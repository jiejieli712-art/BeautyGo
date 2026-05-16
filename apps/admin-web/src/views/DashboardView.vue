<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchDashboardSummary, type DashboardSummary } from "../api";

const summary = ref<DashboardSummary | null>(null);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    summary.value = await fetchDashboardSummary();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "加载失败";
  } finally {
    loading.value = false;
  }
});

function statusIcon(ok: boolean): string {
  return ok ? "PASS" : "—";
}
</script>

<template>
  <main class="page">
    <header class="page-header">
      <div>
        <h1>BeautyGo 运营看板</h1>
        <p class="subtitle">AI 产品经理作品集 — 后台数据总览</p>
      </div>
      <RouterLink class="review-link" to="/artists">化妆师审核台 &rarr;</RouterLink>
    </header>

    <p v-if="loading" class="muted">加载中...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <template v-if="summary">
      <!-- Project Overview -->
      <section class="section">
        <h2>MVP 总览</h2>
        <div class="overview-grid">
          <div class="overview-item">
            <span class="overview-label">项目定位</span>
            <span class="overview-value">{{ summary.project.positioning }}</span>
          </div>
          <div class="overview-item">
            <span class="overview-label">当前里程碑</span>
            <span class="overview-value highlight">{{ summary.project.milestone }}</span>
          </div>
        </div>
        <div class="demo-lines">
          <span class="overview-label">可演示主线</span>
          <ul>
            <li v-for="line in summary.project.demoLines" :key="line">{{ line }}</li>
          </ul>
        </div>
      </section>

      <!-- Supply & Demand -->
      <div class="two-col">
        <section class="section">
          <h2>供给侧数据</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <span class="stat-number">{{ summary.supply.totalApplications }}</span>
              <span class="stat-label">申请总数</span>
            </div>
            <div class="stat-card warn">
              <span class="stat-number">{{ summary.supply.pending }}</span>
              <span class="stat-label">待审核</span>
            </div>
            <div class="stat-card info">
              <span class="stat-number">{{ summary.supply.trial }}</span>
              <span class="stat-label">试运营</span>
            </div>
            <div class="stat-card ok">
              <span class="stat-number">{{ summary.supply.approved }}</span>
              <span class="stat-label">已通过</span>
            </div>
            <div class="stat-card muted-card">
              <span class="stat-number">{{ summary.supply.rejected }}</span>
              <span class="stat-label">已驳回</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>客户侧数据</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <span class="stat-number">{{ summary.demand.totalBookings }}</span>
              <span class="stat-label">预约总数</span>
            </div>
            <div class="stat-card warn">
              <span class="stat-number">{{ summary.demand.created }}</span>
              <span class="stat-label">待确认</span>
            </div>
            <div class="stat-card ok">
              <span class="stat-number">{{ summary.demand.confirmed }}</span>
              <span class="stat-label">已确认</span>
            </div>
            <div class="stat-card muted-card">
              <span class="stat-number">{{ summary.demand.cancelled }}</span>
              <span class="stat-label">已取消</span>
            </div>
          </div>
          <div class="meta-row">
            <span>模拟化妆师 <strong>{{ summary.demand.artistCount }}</strong></span>
            <span>套餐数 <strong>{{ summary.demand.packageCount }}</strong></span>
            <span>覆盖场景 <strong>{{ summary.demand.sceneCount }}</strong></span>
          </div>
        </section>
      </div>

      <!-- Portfolio Readiness -->
      <section class="section">
        <h2>作品集验收指标</h2>
        <div class="check-grid">
          <div class="check-item">
            <span class="check-icon" :class="summary.portfolio.docsReady ? 'pass' : ''">
              {{ statusIcon(summary.portfolio.docsReady) }}
            </span>
            <span>文档到代码一致性</span>
          </div>
          <div class="check-item">
            <span class="check-icon" :class="summary.portfolio.aiCollaborationVisible ? 'pass' : ''">
              {{ statusIcon(summary.portfolio.aiCollaborationVisible) }}
            </span>
            <span>AI 协作可解释性</span>
          </div>
          <div class="check-item">
            <span class="check-icon" :class="summary.portfolio.runnableMvp ? 'pass' : ''">
              {{ statusIcon(summary.portfolio.runnableMvp) }}
            </span>
            <span>可运行 MVP</span>
          </div>
          <div class="check-item">
            <span class="check-icon pass">PASS</span>
            <span>{{ summary.portfolio.testStatus }}</span>
          </div>
        </div>
      </section>

      <!-- Roadmap -->
      <section class="section">
        <h2>下一步路线图</h2>
        <div class="roadmap-grid">
          <div class="roadmap-item">
            <span class="roadmap-phase">近期</span>
            <p>完善演示文案和截图，打磨面试讲解脚本</p>
          </div>
          <div class="roadmap-item">
            <span class="roadmap-phase">中期</span>
            <p>补充后台筛选、预约详情页、化妆师档案</p>
          </div>
          <div class="roadmap-item">
            <span class="roadmap-phase">远期</span>
            <p>若作为真实项目：接数据库、支付、地图、IM</p>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.page {
  padding: 32px;
  font-family: "Helvetica Neue", sans-serif;
  max-width: 960px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 4px;
  font-size: 28px;
}

.subtitle {
  margin: 0;
  color: #888;
  font-size: 14px;
}

.review-link {
  padding: 10px 16px;
  border: 1px solid #cbd6d0;
  border-radius: 8px;
  text-decoration: none;
  color: #20352f;
  font-size: 13px;
  font-weight: 600;
}

.muted {
  color: #999;
}

.error {
  padding: 12px 16px;
  background: #fce4ec;
  border-radius: 8px;
  color: #c62828;
  font-size: 13px;
}

.section {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
}

.section h2 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 700px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}

/* Overview */
.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.overview-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.overview-label {
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.overview-value {
  font-size: 14px;
  color: #333;
}

.overview-value.highlight {
  color: #e65100;
  font-weight: 700;
}

.demo-lines {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.demo-lines ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.demo-lines li {
  font-size: 13px;
  color: #555;
  line-height: 1.8;
}

/* Stats */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  border-radius: 10px;
  background: #f5f5f5;
}

.stat-card.warn {
  background: #fff3e0;
}

.stat-card.info {
  background: #e3f2fd;
}

.stat-card.ok {
  background: #e8f5e9;
}

.stat-card.muted-card {
  background: #fafafa;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #333;
}

.stat-label {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.meta-row {
  display: flex;
  gap: 20px;
  margin-top: 14px;
  font-size: 13px;
  color: #666;
}

.meta-row strong {
  color: #333;
}

/* Check grid */
.check-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 24px;
  border-radius: 4px;
  background: #f0f0f0;
  font-size: 11px;
  font-weight: 700;
  color: #999;
}

.check-icon.pass {
  background: #e8f5e9;
  color: #2e7d32;
}

/* Roadmap */
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 700px) {
  .roadmap-grid {
    grid-template-columns: 1fr;
  }
}

.roadmap-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
}

.roadmap-phase {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin-bottom: 6px;
}

.roadmap-item p {
  margin: 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}
</style>
