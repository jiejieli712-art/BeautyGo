<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { ArtistApplication, ArtistApplicationStatus } from "@beautygo/domain-types";
import {
  listArtistApplications,
  mockLogin,
  updateArtistApplicationStatus
} from "../api";

const token = ref("");
const loading = ref(false);
const statusMessage = ref("等待连接 API");
const applications = ref<ArtistApplication[]>([]);
const reviewerNotes = ref<Record<string, string>>({});

const statusOptions: Array<{ value: ArtistApplicationStatus; label: string }> = [
  { value: "pending", label: "待审核" },
  { value: "trial", label: "试运营" },
  { value: "approved", label: "通过" },
  { value: "rejected", label: "驳回" }
];

const statusLabels: Record<ArtistApplicationStatus, string> = {
  pending: "待审核",
  trial: "试运营",
  approved: "通过",
  rejected: "驳回"
};

async function ensureAdminSession() {
  if (token.value) {
    return token.value;
  }

  const login = await mockLogin({
    role: "admin",
    cityId: "chengdu",
    displayName: "运营管理员"
  });

  token.value = login.token;
  return login.token;
}

async function refreshApplications() {
  loading.value = true;

  try {
    const adminToken = await ensureAdminSession();
    const result = await listArtistApplications(adminToken);
    applications.value = result.items;
    statusMessage.value = `已加载 ${result.total} 条申请`;
  } catch (error) {
    statusMessage.value = error instanceof Error ? error.message : "加载失败";
  } finally {
    loading.value = false;
  }
}

async function updateStatus(application: ArtistApplication, status: ArtistApplicationStatus) {
  loading.value = true;

  try {
    const adminToken = await ensureAdminSession();
    await updateArtistApplicationStatus(
      adminToken,
      application.id,
      status,
      reviewerNotes.value[application.id] ?? ""
    );
    await refreshApplications();
  } catch (error) {
    statusMessage.value = error instanceof Error ? error.message : "更新失败";
  } finally {
    loading.value = false;
  }
}

onMounted(refreshApplications);
</script>

<template>
  <main class="page">
    <header class="toolbar">
      <div>
        <h1>化妆师入驻审核</h1>
        <p>{{ statusMessage }}</p>
      </div>
      <button :disabled="loading" @click="refreshApplications">
        刷新
      </button>
    </header>

    <section v-if="applications.length === 0" class="empty-state">
      暂无入驻申请。先在 Super App 中用化妆师角色提交一条申请。
    </section>

    <section v-else class="review-list">
      <article v-for="application in applications" :key="application.id" class="review-row">
        <div>
          <span class="status-pill">{{ statusLabels[application.status] }}</span>
          <h2>{{ application.applicantName }}</h2>
          <p>{{ application.bio }}</p>
          <dl>
            <div>
              <dt>城市</dt>
              <dd>{{ application.cityId }}</dd>
            </div>
            <div>
              <dt>手机号</dt>
              <dd>{{ application.phone }}</dd>
            </div>
            <div>
              <dt>年限</dt>
              <dd>{{ application.experienceYears }} 年</dd>
            </div>
          </dl>
        </div>

        <div class="review-actions">
          <textarea
            v-model="reviewerNotes[application.id]"
            rows="3"
            placeholder="审核备注"
          />
          <div>
            <button
              v-for="option in statusOptions"
              :key="option.value"
              :disabled="loading"
              @click="updateStatus(application, option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding: 32px;
  font-family: "Helvetica Neue", sans-serif;
}

.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

h1,
h2,
p {
  margin: 0;
}

.toolbar p {
  margin-top: 8px;
  color: #61716b;
}

button {
  border: 1px solid #cbd6d0;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  cursor: pointer;
}

.empty-state {
  margin-top: 24px;
  border: 1px dashed #cbd6d0;
  border-radius: 8px;
  padding: 24px;
  color: #61716b;
}

.review-list {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}

.review-row {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  border: 1px solid #d9e0dc;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.status-pill {
  display: inline-block;
  margin-bottom: 10px;
  border-radius: 999px;
  padding: 4px 10px;
  background: #dceee8;
  color: #20352f;
  font-size: 12px;
  font-weight: 700;
}

dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 18px 0 0;
}

dt {
  color: #61716b;
  font-size: 12px;
}

dd {
  margin: 4px 0 0;
  font-weight: 700;
}

.review-actions {
  display: grid;
  gap: 12px;
}

textarea {
  width: 100%;
  border: 1px solid #cbd6d0;
  border-radius: 8px;
  padding: 10px;
  font: inherit;
}

.review-actions div {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (max-width: 900px) {
  .review-row {
    grid-template-columns: 1fr;
  }
}
</style>
