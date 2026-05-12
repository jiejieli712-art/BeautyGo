<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type {
  AppRole,
  ArtistApplication,
  CreateArtistApplicationInput,
  ServiceScene
} from "@beautygo/domain-types";
import { checkApiHealth, createArtistApplication, mockLogin } from "./api";
import { appRoles, getPrimaryNavigation } from "./features/role-shell/navigation";

const activeRole = ref<AppRole>(appRoles.customer);
const navigation = computed(() => getPrimaryNavigation(activeRole.value));
const apiStatus = ref("checking");
const sessionToken = ref("");
const sessionLabel = ref("未登录");
const submitState = ref("idle");
const submittedApplication = ref<ArtistApplication | null>(null);

const loginForm = reactive({
  displayName: "小王",
  cityId: "chengdu"
});

const applicationForm = reactive<CreateArtistApplicationInput>({
  applicantName: "小王",
  cityId: "chengdu",
  phone: "13800000000",
  bio: "擅长旅拍、写真和轻正式妆面，周末可接单。",
  experienceYears: 2,
  primaryScenes: ["travel_photo", "party"],
  portfolio: [
    {
      id: "portfolio_1",
      imageUrl: "https://example.com/portfolio/travel-photo.jpg",
      scene: "travel_photo"
    },
    {
      id: "portfolio_2",
      imageUrl: "https://example.com/portfolio/party.jpg",
      scene: "party"
    }
  ]
});

const sceneOptions: Array<{ value: ServiceScene; label: string }> = [
  { value: "travel_photo", label: "旅拍/写真" },
  { value: "party", label: "聚会/晚宴" },
  { value: "business", label: "面试/商务" },
  { value: "wedding_guest", label: "婚礼宾客" }
];

const roleText: Record<AppRole, string> = {
  customer: "客户",
  artist: "化妆师",
  admin: "运营"
};

async function loginAs(role: AppRole) {
  activeRole.value = role;
  submitState.value = "idle";
  const result = await mockLogin({
    role,
    cityId: loginForm.cityId,
    displayName: loginForm.displayName
  });

  sessionToken.value = result.token;
  sessionLabel.value = `${result.session.displayName} / ${roleText[result.session.role]}`;
}

async function submitArtistApplication() {
  if (!sessionToken.value || activeRole.value !== "artist") {
    await loginAs("artist");
  }

  submitState.value = "submitting";

  try {
    submittedApplication.value = await createArtistApplication(
      sessionToken.value,
      applicationForm
    );
    submitState.value = "submitted";
  } catch (error) {
    submitState.value = error instanceof Error ? error.message : "提交失败";
  }
}

function toggleScene(scene: ServiceScene) {
  const exists = applicationForm.primaryScenes.includes(scene);
  applicationForm.primaryScenes = exists
    ? applicationForm.primaryScenes.filter((item) => item !== scene)
    : [...applicationForm.primaryScenes, scene];
}

onMounted(async () => {
  try {
    const health = await checkApiHealth();
    apiStatus.value = `${health.status} / ${health.milestone}`;
  } catch {
    apiStatus.value = "offline";
  }
});
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <span class="eyebrow">BeautyGo MVP</span>
        <h1>上门美妆工作台</h1>
      </div>

      <label>
        昵称
        <input v-model="loginForm.displayName" />
      </label>

      <label>
        城市
        <select v-model="loginForm.cityId">
          <option value="chengdu">成都</option>
          <option value="hangzhou">杭州</option>
        </select>
      </label>

      <div class="role-switcher">
        <button
          v-for="role in Object.values(appRoles)"
          :key="role"
          class="role-button"
          :class="{ active: activeRole === role }"
          @click="loginAs(role)"
        >
          {{ roleText[role] }}
        </button>
      </div>

      <dl class="status-list">
        <div>
          <dt>API</dt>
          <dd>{{ apiStatus }}</dd>
        </div>
        <div>
          <dt>会话</dt>
          <dd>{{ sessionLabel }}</dd>
        </div>
      </dl>
    </aside>

    <main class="workspace">
      <section class="panel">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">当前角色</span>
            <h2>{{ roleText[activeRole] }}</h2>
          </div>
          <nav>
            <span v-for="item in navigation" :key="item.key">{{ item.label }}</span>
          </nav>
        </div>

        <div v-if="activeRole === 'customer'" class="customer-grid">
          <article>
            <h3>附近化妆师</h3>
            <p>下一步会接入搜索、筛选和化妆师详情页。</p>
          </article>
          <article>
            <h3>预约链路</h3>
            <p>当前阶段先完成角色和入驻闭环，再进入搜索与下单。</p>
          </article>
        </div>

        <form v-else-if="activeRole === 'artist'" class="artist-form" @submit.prevent="submitArtistApplication">
          <label>
            申请人
            <input v-model="applicationForm.applicantName" required />
          </label>

          <label>
            手机号
            <input v-model="applicationForm.phone" required />
          </label>

          <label>
            从业年限
            <input v-model.number="applicationForm.experienceYears" min="0" type="number" />
          </label>

          <label class="wide">
            个人简介
            <textarea v-model="applicationForm.bio" rows="4" />
          </label>

          <fieldset class="wide">
            <legend>擅长场景</legend>
            <button
              v-for="scene in sceneOptions"
              :key="scene.value"
              type="button"
              class="scene-toggle"
              :class="{ active: applicationForm.primaryScenes.includes(scene.value) }"
              @click="toggleScene(scene.value)"
            >
              {{ scene.label }}
            </button>
          </fieldset>

          <button class="primary-action" type="submit">
            提交入驻申请
          </button>

          <p class="form-result">{{ submitState }}</p>
          <p v-if="submittedApplication" class="form-result">
            申请已提交：{{ submittedApplication.id }} / {{ submittedApplication.status }}
          </p>
        </form>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 320px 1fr;
  background: #f3f5f2;
  font-family: "Helvetica Neue", sans-serif;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 100vh;
  padding: 28px;
  background: #20352f;
  color: #f8fbf6;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #8cc7b3;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: 32px;
  line-height: 1.15;
}

label {
  display: grid;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cad3ce;
  border-radius: 8px;
  padding: 11px 12px;
  font: inherit;
}

.role-switcher {
  display: grid;
  gap: 10px;
}

.role-button {
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.role-button.active {
  background: #f4d35e;
  color: #16221f;
}

.status-list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding-top: 8px;
}

dt {
  color: #bad5cc;
  font-size: 12px;
}

dd {
  margin: 4px 0 0;
}

.workspace {
  padding: 32px;
}

.panel {
  max-width: 980px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.panel-heading h2 {
  font-size: 34px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

nav span,
.scene-toggle {
  border: 1px solid #cbd6d0;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
}

.customer-grid,
.artist-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.customer-grid article,
.artist-form {
  border: 1px solid #d9e0dc;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.artist-form {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wide {
  grid-column: 1 / -1;
}

fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border: 1px solid #cad3ce;
  border-radius: 8px;
  padding: 14px;
}

legend {
  padding: 0 6px;
  font-weight: 700;
}

.scene-toggle {
  cursor: pointer;
}

.scene-toggle.active {
  border-color: #20352f;
  background: #dceee8;
}

.primary-action {
  border: 0;
  border-radius: 8px;
  padding: 13px 18px;
  background: #20352f;
  color: #fff;
  cursor: pointer;
}

.form-result {
  align-self: center;
  color: #41524d;
}

@media (max-width: 820px) {
  .app-shell,
  .customer-grid,
  .artist-form {
    grid-template-columns: 1fr;
  }

  .sidebar {
    min-height: auto;
  }
}
</style>
