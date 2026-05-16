<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type {
  CreateBookingInput,
  MarketplaceArtist,
  ServicePackage,
  ServiceScene,
  Booking
} from "@beautygo/domain-types";
import { fetchArtists, createBooking, fetchBookings } from "../api";

type Step = "browse" | "packages" | "form" | "success";

const props = defineProps<{ token: string }>();

const artists = ref<MarketplaceArtist[]>([]);
const selectedArtist = ref<MarketplaceArtist | null>(null);
const selectedPackage = ref<ServicePackage | null>(null);
const step = ref<Step>("browse");
const loading = ref(false);
const errorMsg = ref("");
const submittedBooking = ref<Booking | null>(null);
const myBookings = ref<Booking[]>([]);

const bookingForm = reactive({
  appointmentDate: "",
  appointmentTime: "",
  cityId: "chengdu",
  addressArea: "",
  note: ""
});

const sceneLabels: Record<ServiceScene, string> = {
  travel_photo: "旅拍/写真",
  party: "聚会/晚宴",
  business: "面试/商务",
  wedding_guest: "婚礼宾客"
};

const levelLabels: Record<string, string> = {
  new: "新星",
  certified: "认证",
  gold: "金牌",
  master: "大师"
};

async function loadArtists() {
  loading.value = true;
  errorMsg.value = "";
  try {
    artists.value = await fetchArtists(props.token);
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : "加载失败";
  } finally {
    loading.value = false;
  }
}

function selectArtist(artist: MarketplaceArtist) {
  selectedArtist.value = artist;
  step.value = "packages";
}

function selectPackage(pkg: ServicePackage) {
  selectedPackage.value = pkg;
  bookingForm.appointmentDate = "";
  bookingForm.appointmentTime = "";
  bookingForm.addressArea = "";
  bookingForm.note = "";
  step.value = "form";
}

async function submitBooking() {
  if (!selectedArtist.value || !selectedPackage.value) return;

  loading.value = true;
  errorMsg.value = "";

  try {
    const input: CreateBookingInput = {
      artistId: selectedArtist.value.id,
      packageId: selectedPackage.value.id,
      scene: selectedPackage.value.scene,
      appointmentDate: bookingForm.appointmentDate,
      appointmentTime: bookingForm.appointmentTime,
      cityId: bookingForm.cityId,
      addressArea: bookingForm.addressArea,
      note: bookingForm.note
    };

    submittedBooking.value = await createBooking(props.token, input);
    step.value = "success";
    await loadMyBookings();
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : "预约失败";
  } finally {
    loading.value = false;
  }
}

async function loadMyBookings() {
  try {
    const result = await fetchBookings(props.token);
    myBookings.value = result.items;
  } catch {
    // ignore
  }
}

function goBack() {
  if (step.value === "form") {
    step.value = "packages";
  } else if (step.value === "packages") {
    selectedArtist.value = null;
    step.value = "browse";
  } else if (step.value === "success") {
    step.value = "browse";
    selectedArtist.value = null;
    selectedPackage.value = null;
    submittedBooking.value = null;
  }
}

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

onMounted(loadArtists);
</script>

<template>
  <div class="booking-view">
    <!-- Header -->
    <header class="booking-header">
      <button v-if="step !== 'browse'" class="back-btn" @click="goBack">
        &larr; 返回
      </button>
      <h1>
        <template v-if="step === 'browse'">选择化妆师</template>
        <template v-else-if="step === 'packages'">{{ selectedArtist?.displayName }} 的套餐</template>
        <template v-else-if="step === 'form'">填写预约信息</template>
        <template v-else>预约成功</template>
      </h1>
    </header>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-if="loading" class="loading">加载中...</p>

    <!-- Step 1: Browse Artists -->
    <div v-if="step === 'browse' && !loading" class="artist-list">
      <article
        v-for="artist in artists"
        :key="artist.id"
        class="artist-card"
        @click="selectArtist(artist)"
      >
        <div class="artist-avatar">
          <img :src="artist.avatarUrl" :alt="artist.displayName" />
        </div>
        <div class="artist-info">
          <div class="artist-name-row">
            <h2>{{ artist.displayName }}</h2>
            <span class="level-badge">{{ levelLabels[artist.level] ?? artist.level }}</span>
          </div>
          <p class="artist-bio">{{ artist.bio }}</p>
          <div class="artist-meta">
            <span class="rating">{{ artist.rating }} ({{ artist.reviewCount }}条评价)</span>
            <span>{{ artist.experienceYears }}年经验</span>
            <span>服务半径 {{ artist.serviceArea }}km</span>
          </div>
          <div class="artist-tags">
            <span v-for="tag in artist.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="artist-scenes">
            <span v-for="scene in artist.scenes" :key="scene" class="scene-tag">
              {{ sceneLabels[scene] }}
            </span>
          </div>
        </div>
      </article>

      <!-- My bookings summary -->
      <section v-if="myBookings.length > 0" class="my-bookings">
        <h3>我的预约 ({{ myBookings.length }})</h3>
        <div v-for="b in myBookings" :key="b.id" class="booking-mini">
          <span>{{ b.artistName }}</span>
          <span>{{ b.packageName }}</span>
          <span>{{ b.appointmentDate }} {{ b.appointmentTime }}</span>
          <span class="booking-status">{{ b.status }}</span>
        </div>
      </section>
    </div>

    <!-- Step 2: Package List -->
    <div v-if="step === 'packages' && selectedArtist" class="package-list">
      <div class="artist-portfolios">
        <img
          v-for="(img, i) in selectedArtist.portfolioImages"
          :key="i"
          :src="img"
          :alt="`作品 ${i + 1}`"
          class="portfolio-img"
        />
      </div>
      <article
        v-for="pkg in selectedArtist.servicePackages"
        :key="pkg.id"
        class="package-card"
        @click="selectPackage(pkg)"
      >
        <div class="package-header">
          <h3>{{ pkg.name }}</h3>
          <span class="package-price">{{ pkg.priceYuan }}元</span>
        </div>
        <p class="package-desc">{{ pkg.description }}</p>
        <div class="package-meta">
          <span>{{ pkg.durationMinutes }}分钟</span>
          <span>{{ sceneLabels[pkg.scene] }}</span>
          <span>{{ pkg.includesHair ? "含发型" : "不含发型" }}</span>
        </div>
      </article>
    </div>

    <!-- Step 3: Booking Form -->
    <form v-if="step === 'form' && selectedPackage" class="booking-form" @submit.prevent="submitBooking">
      <div class="form-summary">
        <div>
          <strong>{{ selectedArtist?.displayName }}</strong>
          <span>{{ selectedPackage.name }}</span>
        </div>
        <span class="form-price">{{ selectedPackage.priceYuan }}元</span>
      </div>

      <div class="form-grid">
        <label>
          预约日期
          <input
            v-model="bookingForm.appointmentDate"
            type="date"
            :min="getMinDate()"
            required
          />
        </label>
        <label>
          预约时间
          <select v-model="bookingForm.appointmentTime" required>
            <option value="" disabled>请选择时间段</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
          </select>
        </label>
        <label>
          服务区域
          <input
            v-model="bookingForm.addressArea"
            placeholder="例如：春熙路附近"
            required
            maxlength="200"
          />
        </label>
        <label>
          备注
          <textarea
            v-model="bookingForm.note"
            rows="3"
            placeholder="例如：希望自然清新的风格"
            maxlength="500"
          />
        </label>
      </div>

      <button class="submit-btn" type="submit" :disabled="loading">
        {{ loading ? "提交中..." : "确认预约" }}
      </button>
    </form>

    <!-- Step 4: Success -->
    <div v-if="step === 'success' && submittedBooking" class="success-card">
      <div class="success-icon">&#10003;</div>
      <h2>预约已创建</h2>
      <div class="success-details">
        <div class="detail-row">
          <span>预约编号</span>
          <code>{{ submittedBooking.id }}</code>
        </div>
        <div class="detail-row">
          <span>化妆师</span>
          <strong>{{ submittedBooking.artistName }}</strong>
        </div>
        <div class="detail-row">
          <span>套餐</span>
          <strong>{{ submittedBooking.packageName }}</strong>
        </div>
        <div class="detail-row">
          <span>价格</span>
          <strong>{{ submittedBooking.priceYuan }}元</strong>
        </div>
        <div class="detail-row">
          <span>日期时间</span>
          <strong>{{ submittedBooking.appointmentDate }} {{ submittedBooking.appointmentTime }}</strong>
        </div>
        <div class="detail-row">
          <span>服务区域</span>
          <strong>{{ submittedBooking.addressArea }}</strong>
        </div>
        <div class="detail-row">
          <span>状态</span>
          <strong class="status-created">{{ submittedBooking.status }}</strong>
        </div>
      </div>
      <p class="disclaimer">
        这是作品集模拟预约，不涉及真实支付或履约。
      </p>
      <button class="back-btn-main" @click="goBack">继续浏览</button>
    </div>
  </div>
</template>

<style scoped>
.booking-view {
  max-width: 800px;
}

.booking-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.booking-header h1 {
  font-size: 24px;
  font-weight: 800;
}

.back-btn {
  border: 1px solid #cbd6d0;
  border-radius: 8px;
  padding: 8px 14px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.error {
  padding: 12px 16px;
  background: #fce4ec;
  border-radius: 8px;
  color: #c62828;
  font-size: 13px;
  margin-bottom: 16px;
}

.loading {
  color: #888;
  font-size: 14px;
}

/* Artist cards */
.artist-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.artist-card {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s;
}

.artist-card:hover {
  border-color: #20352f;
}

.artist-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  background: #f0f0f0;
}

.artist-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.artist-name-row h2 {
  font-size: 18px;
  font-weight: 700;
}

.level-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
}

.artist-bio {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

.artist-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.rating {
  color: #f57c00;
  font-weight: 600;
}

.artist-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f5f5f5;
  color: #555;
}

.artist-scenes {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.scene-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #e3f2fd;
  color: #1565c0;
}

/* My bookings */
.my-bookings {
  margin-top: 12px;
  padding: 16px;
  border: 1px dashed #cbd6d0;
  border-radius: 10px;
}

.my-bookings h3 {
  font-size: 14px;
  margin-bottom: 10px;
}

.booking-mini {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  font-size: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.booking-mini:last-child {
  border-bottom: none;
}

.booking-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #fff3e0;
  color: #e65100;
  font-weight: 600;
}

/* Package list */
.package-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.artist-portfolios {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.portfolio-img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 8px;
  background: #f0f0f0;
}

.package-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s;
}

.package-card:hover {
  border-color: #20352f;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.package-header h3 {
  font-size: 16px;
  font-weight: 700;
}

.package-price {
  font-size: 20px;
  font-weight: 800;
  color: #c62828;
}

.package-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
}

.package-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888;
}

/* Booking form */
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

.form-summary div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-summary span {
  font-size: 13px;
  color: #666;
}

.form-price {
  font-size: 24px;
  font-weight: 800;
  color: #c62828;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.form-grid label:last-child {
  grid-column: 1 / -1;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
  font-size: 14px;
}

.submit-btn {
  align-self: flex-start;
  border: 0;
  border-radius: 10px;
  padding: 14px 32px;
  background: #20352f;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success card */
.success-card {
  text-align: center;
  padding: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: #fff;
}

.success-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 28px;
  font-weight: 800;
}

.success-card h2 {
  font-size: 22px;
  margin-bottom: 24px;
}

.success-details {
  text-align: left;
  max-width: 400px;
  margin: 0 auto 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.detail-row span {
  color: #888;
}

.detail-row code {
  font-size: 11px;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-created {
  color: #e65100;
}

.disclaimer {
  font-size: 12px;
  color: #999;
  padding: 12px 16px;
  background: #fff8e1;
  border-radius: 8px;
  margin-bottom: 20px;
  display: inline-block;
}

.back-btn-main {
  border: 1px solid #20352f;
  border-radius: 8px;
  padding: 10px 24px;
  background: transparent;
  color: #20352f;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 700px) {
  .artist-card {
    grid-template-columns: 1fr;
  }

  .artist-portfolios {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .booking-mini {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
