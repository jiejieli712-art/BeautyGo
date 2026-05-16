<script setup lang="ts">
import { ref } from "vue";

const activeSection = ref<string | null>(null);

function toggle(id: string) {
  activeSection.value = activeSection.value === id ? null : id;
}

const mvpIn = [
  { label: "旅拍/写真妆", desc: "个人写真、景点出片" },
  { label: "聚会/晚宴妆", desc: "生日、聚餐、酒会" },
  { label: "面试/商务妆", desc: "面试、见客户" },
  { label: "婚礼宾客妆", desc: "非新娘本人宾客上妆" },
];

const mvpOut = [
  { label: "新娘全天跟妆", reason: "高复杂度，MVP 不验证" },
  { label: "派单/抢单", reason: "先验证直约模式" },
  { label: "内容社区", reason: "非交易闭环必需" },
  { label: "会员体系", reason: "成长期再建设" },
];

const milestones = [
  { id: "m0", name: "M0: Bootstrap", status: "done", items: ["monorepo 骨架", "领域类型包", "角色感知壳"] },
  { id: "m1", name: "M1: Auth + Onboarding", status: "done", items: ["Mock 登录", "化妆师入驻申请", "后台审核闭环"] },
  { id: "m2", name: "M2: Customer Booking", status: "done", items: ["化妆师浏览", "套餐选择", "模拟预约", "API 测试"] },
  { id: "m3", name: "M3: Search & Payment", status: "planned", items: ["搜索筛选", "支付集成", "订单状态机"] },
];

const agents = [
  { role: "Delivery Lead", desc: "编排里程碑、风险、优先级", icon: ">>>" },
  { role: "Product Breakdown", desc: "PRD 拆 epic / story / 验收标准", icon: "[]" },
  { role: "Architecture", desc: "模块边界、数据模型、集成点", icon: "{}" },
  { role: "Implementation", desc: "按切片写代码、跑测试", icon: "</>" },
  { role: "QA & Release", desc: "回归、验收、go/no-go", icon: "ok" },
];

const techStack = [
  { layer: "API", tech: "NestJS + TypeScript", note: "模块化、DI、装饰器路由" },
  { layer: "Admin", tech: "Vue 3 + Vue Router + Vite", note: "SPA 后台" },
  { layer: "Super App", tech: "Vue 3 + Vite", note: "客户/化妆师共用壳" },
  { layer: "共享类型", tech: "domain-types 包", note: "PRD 术语 single source of truth" },
  { layer: "工具链", tech: "pnpm workspace + tsx", note: "monorepo + 热重载" },
];

const stats = [
  { value: "~2500", unit: "行", label: "核心代码" },
  { value: "3", unit: "个", label: "里程碑完成" },
  { value: "10", unit: "个", label: "API 端点" },
  { value: "5", unit: "个", label: "前端页面" },
];
</script>

<template>
  <div class="portfolio">
    <!-- Hero -->
    <header class="hero">
      <div class="hero-badge">Portfolio Showcase</div>
      <h1>BeautyGo</h1>
      <p class="hero-tagline">上门美妆 O2O 双边撮合平台</p>
      <p class="hero-sub">
        让每个人在任何地方都能轻松获得专业美妆服务，<br />
        让每一位化妆师都能把技术转化为稳定收入。
      </p>
      <div class="hero-stats">
        <div v-for="s in stats" :key="s.label" class="stat">
          <span class="stat-value">{{ s.value }}<small>{{ s.unit }}</small></span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </header>

    <!-- Problem & Positioning -->
    <section class="card">
      <div class="card-header" @click="toggle('problem')">
        <h2>01 / 市场痛点与产品定位</h2>
        <span class="chevron" :class="{ open: activeSection === 'problem' }">&#9662;</span>
      </div>
      <div v-if="activeSection === 'problem'" class="card-body">
        <div class="two-col">
          <div>
            <h3>市场痛点</h3>
            <ul class="pain-points">
              <li>用户找不到合适且可信赖的上门化妆师</li>
              <li>化妆师接单渠道分散，订单不稳定</li>
              <li>交易、沟通、履约、评价分散在多个工具中</li>
              <li>缺少针对上门美妆场景的标准化规则</li>
            </ul>
          </div>
          <div>
            <h3>BeautyGo 的解法</h3>
            <ul class="solutions">
              <li><strong>O2O 双边撮合</strong> — 连接客户与化妆师</li>
              <li><strong>场景化搜索</strong> — 旅拍/聚会/面试/婚礼</li>
              <li><strong>一体化闭环</strong> — 搜索 &rarr; 预约 &rarr; 支付 &rarr; 履约 &rarr; 评价 &rarr; 结算</li>
              <li><strong>规则保障</strong> — 接单时限、退款分级、纠纷仲裁</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- MVP Scope -->
    <section class="card">
      <div class="card-header" @click="toggle('scope')">
        <h2>02 / MVP 范围取舍</h2>
        <span class="chevron" :class="{ open: activeSection === 'scope' }">&#9662;</span>
      </div>
      <div v-if="activeSection === 'scope'" class="card-body">
        <p class="scope-principle">原则：先锁业务闭环，再扩功能广度。一次只推一个可验收的垂直切片。</p>
        <div class="two-col">
          <div>
            <h3 class="in-label">MVP 包含</h3>
            <div class="scope-grid">
              <div v-for="item in mvpIn" :key="item.label" class="scope-item in">
                <strong>{{ item.label }}</strong>
                <span>{{ item.desc }}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="out-label">MVP 不做（有明确原因）</h3>
            <div class="scope-grid">
              <div v-for="item in mvpOut" :key="item.label" class="scope-item out">
                <strong>{{ item.label }}</strong>
                <span>{{ item.reason }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="scope-note">
          <strong>设计决策：</strong>PRD 中已为成长期预留了字段和数据结构（如派单模式、分级体系），MVP 不碰但不堵死。
        </div>
      </div>
    </section>

    <!-- Architecture -->
    <section class="card">
      <div class="card-header" @click="toggle('arch')">
        <h2>03 / 技术架构</h2>
        <span class="chevron" :class="{ open: activeSection === 'arch' }">&#9662;</span>
      </div>
      <div v-if="activeSection === 'arch'" class="card-body">
        <div class="arch-diagram">
          <div class="arch-row">
            <div class="arch-box client">
              <div class="arch-title">super-app</div>
              <div class="arch-desc">客户 + 化妆师</div>
              <div class="arch-tech">Vue 3 / Vite</div>
            </div>
            <div class="arch-box client">
              <div class="arch-title">admin-web</div>
              <div class="arch-desc">运营审核后台</div>
              <div class="arch-tech">Vue 3 / Router / Vite</div>
            </div>
          </div>
          <div class="arch-arrow">&#8595; HTTP / JSON &#8595;</div>
          <div class="arch-row">
            <div class="arch-box server">
              <div class="arch-title">api</div>
              <div class="arch-desc">领域逻辑 + 集成层</div>
              <div class="arch-tech">NestJS / TypeScript</div>
            </div>
          </div>
          <div class="arch-arrow">&#8595;</div>
          <div class="arch-row">
            <div class="arch-box shared">
              <div class="arch-title">domain-types</div>
              <div class="arch-desc">共享业务语言</div>
              <div class="arch-tech">TypeScript 类型包</div>
            </div>
          </div>
        </div>
        <div class="tech-table">
          <div v-for="item in techStack" :key="item.layer" class="tech-row">
            <span class="tech-layer">{{ item.layer }}</span>
            <span class="tech-name">{{ item.tech }}</span>
            <span class="tech-note">{{ item.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Collaboration -->
    <section class="card">
      <div class="card-header" @click="toggle('ai')">
        <h2>04 / AI 协作方式</h2>
        <span class="chevron" :class="{ open: activeSection === 'ai' }">&#9662;</span>
      </div>
      <div v-if="activeSection === 'ai'" class="card-body">
        <p class="ai-intro">
          BeautyGo 采用 <strong>Vibe Coding</strong> 模式开发：人类定义产品方向和业务规则，AI Agent 负责架构设计、代码实现和质量检查。
        </p>
        <div class="agent-flow">
          <div v-for="(agent, i) in agents" :key="agent.role" class="agent-step">
            <div class="agent-icon">{{ agent.icon }}</div>
            <div class="agent-info">
              <strong>{{ agent.role }}</strong>
              <span>{{ agent.desc }}</span>
            </div>
            <div v-if="i < agents.length - 1" class="agent-arrow">&#8594;</div>
          </div>
        </div>
        <div class="ai-principles">
          <h3>协作原则</h3>
          <div class="principle-grid">
            <div class="principle">
              <strong>事件触发同步</strong>
              <span>开始新切片、锁定决策、出现 blocker 时才同步，不刷屏</span>
            </div>
            <div class="principle">
              <strong>垂直切片交付</strong>
              <span>每个切片可独立验收，做完一个再做下一个</span>
            </div>
            <div class="principle">
              <strong>产品规则先收紧</strong>
              <span>先用 PRD 锁边界，再进入架构和编码</span>
            </div>
            <div class="principle">
              <strong>决策可回溯</strong>
              <span>所有重大决策记录在 docs/ 中，git 留痕</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Current MVP Demo -->
    <section class="card">
      <div class="card-header" @click="toggle('demo')">
        <h2>05 / 当前 MVP 能力</h2>
        <span class="chevron" :class="{ open: activeSection === 'demo' }">&#9662;</span>
      </div>
      <div v-if="activeSection === 'demo'" class="card-body">
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-number">01</div>
            <h3>角色切换 & Mock 登录</h3>
            <p>支持客户、化妆师、运营三种角色。通过 API 创建 session，前端根据角色切换视图。</p>
            <div class="demo-endpoints">
              <code>POST /api/auth/mock-login</code>
              <code>GET  /api/auth/session</code>
            </div>
          </div>
          <div class="demo-card">
            <div class="demo-number">02</div>
            <h3>化妆师入驻申请</h3>
            <p>化妆师角色可填写个人信息、从业年限、擅长场景、作品集，提交入驻申请。</p>
            <div class="demo-endpoints">
              <code>POST /api/artist-applications</code>
              <code>GET  /api/artist-applications</code>
            </div>
          </div>
          <div class="demo-card">
            <div class="demo-number">03</div>
            <h3>后台审核闭环</h3>
            <p>运营角色可查看所有申请，修改状态（待审核/试运营/通过/驳回），填写审核备注。</p>
            <div class="demo-endpoints">
              <code>PATCH /api/artist-applications/:id/status</code>
            </div>
          </div>
          <div class="demo-card">
            <div class="demo-number">04</div>
            <h3>客户浏览与预约</h3>
            <p>客户可浏览化妆师列表、查看套餐、填写预约表单并提交。含 3 位模拟化妆师和 6 个套餐。</p>
            <div class="demo-endpoints">
              <code>GET  /api/marketplace/artists</code>
              <code>POST /api/bookings</code>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Milestones -->
    <section class="card">
      <div class="card-header" @click="toggle('milestones')">
        <h2>06 / 里程碑进度</h2>
        <span class="chevron" :class="{ open: activeSection === 'milestones' }">&#9662;</span>
      </div>
      <div v-if="activeSection === 'milestones'" class="card-body">
        <div class="timeline">
          <div
            v-for="m in milestones"
            :key="m.id"
            class="timeline-item"
            :class="m.status"
          >
            <div class="timeline-dot" />
            <div class="timeline-content">
              <div class="timeline-header">
                <strong>{{ m.name }}</strong>
                <span class="timeline-badge">{{ m.status === 'done' ? '已完成' : m.status === 'next' ? '下一步' : '规划中' }}</span>
              </div>
              <ul>
                <li v-for="item in m.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Next Steps -->
    <section class="card">
      <div class="card-header" @click="toggle('next')">
        <h2>07 / 下一步规划</h2>
        <span class="chevron" :class="{ open: activeSection === 'next' }">&#9662;</span>
      </div>
      <div v-if="activeSection === 'next'" class="card-body">
        <div class="next-grid">
          <div class="next-item">
            <div class="next-phase">近期</div>
            <h3>服务配置 + 搜索</h3>
            <ul>
              <li>套餐 CRUD 与价格规则</li>
              <li>档期管理与冲突检测</li>
              <li>化妆师搜索与筛选</li>
            </ul>
          </div>
          <div class="next-item">
            <div class="next-phase">中期</div>
            <h3>交易闭环</h3>
            <ul>
              <li>下单与微信支付接入</li>
              <li>订单状态机完整实现</li>
              <li>履约打卡与自动完单</li>
            </ul>
          </div>
          <div class="next-item">
            <div class="next-phase">远期</div>
            <h3>运营与增长</h3>
            <ul>
              <li>评价与纠纷仲裁</li>
              <li>T+1 结算系统</li>
              <li>首城冷启动运营</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <footer class="portfolio-footer">
      <p>BeautyGo &mdash; Built with AI-assisted Vibe Coding</p>
      <p class="footer-tech">Vue 3 + NestJS + TypeScript + pnpm monorepo</p>
    </footer>
  </div>
</template>

<style scoped>
.portfolio {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 60px;
  font-family: "Helvetica Neue", -apple-system, sans-serif;
  color: #1a1a1a;
}

/* Hero */
.hero {
  text-align: center;
  padding: 56px 0 40px;
}

.hero-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

h1 {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -1px;
}

.hero-tagline {
  font-size: 20px;
  color: #555;
  margin: 0 0 12px;
}

.hero-sub {
  font-size: 15px;
  color: #888;
  line-height: 1.6;
  margin: 0 0 32px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1b5e20;
}

.stat-value small {
  font-size: 14px;
  font-weight: 600;
  margin-left: 2px;
}

.stat-label {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

/* Cards */
.card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 12px;
  background: #fff;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.card-header:hover {
  background: #fafafa;
}

.card-header h2 {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.chevron {
  font-size: 18px;
  color: #999;
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

.card-body {
  padding: 0 24px 24px;
  animation: fadeSlide 0.2s ease-out;
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Two column layout */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 700px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}

h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

ul {
  margin: 0;
  padding-left: 18px;
}

li {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
}

/* Pain points & solutions */
.pain-points li::marker {
  color: #c62828;
}

.solutions li::marker {
  color: #2e7d32;
}

/* Scope */
.scope-principle {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 3px solid #1b5e20;
}

.in-label { color: #2e7d32; }
.out-label { color: #999; }

.scope-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scope-item {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}

.scope-item.in {
  background: #e8f5e9;
  border-left: 3px solid #4caf50;
}

.scope-item.out {
  background: #fafafa;
  border-left: 3px solid #ccc;
}

.scope-item strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.scope-item span {
  color: #777;
}

.scope-note {
  margin-top: 16px;
  font-size: 13px;
  color: #666;
  padding: 12px 16px;
  background: #fff8e1;
  border-radius: 8px;
}

/* Architecture */
.arch-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.arch-row {
  display: flex;
  gap: 16px;
}

.arch-box {
  padding: 16px 24px;
  border-radius: 10px;
  text-align: center;
  min-width: 180px;
}

.arch-box.client {
  background: #e3f2fd;
  border: 1px solid #90caf9;
}

.arch-box.server {
  background: #fce4ec;
  border: 1px solid #f48fb1;
}

.arch-box.shared {
  background: #f3e5f5;
  border: 1px solid #ce93d8;
}

.arch-title {
  font-size: 15px;
  font-weight: 800;
  font-family: monospace;
}

.arch-desc {
  font-size: 12px;
  color: #666;
  margin: 4px 0;
}

.arch-tech {
  font-size: 11px;
  color: #999;
}

.arch-arrow {
  font-size: 13px;
  color: #999;
  font-family: monospace;
}

.tech-table {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.tech-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  padding: 10px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
}

.tech-row:last-child {
  border-bottom: none;
}

.tech-layer {
  font-weight: 700;
  color: #333;
}

.tech-name {
  font-family: monospace;
  color: #555;
}

.tech-note {
  color: #888;
}

/* AI Collaboration */
.ai-intro {
  font-size: 14px;
  color: #555;
  margin: 0 0 20px;
  line-height: 1.7;
}

.agent-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-bottom: 24px;
}

.agent-step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #e8f5e9;
  font-size: 12px;
  font-weight: 700;
  font-family: monospace;
  color: #2e7d32;
  flex-shrink: 0;
}

.agent-info {
  display: flex;
  flex-direction: column;
}

.agent-info strong {
  font-size: 13px;
}

.agent-info span {
  font-size: 11px;
  color: #888;
}

.agent-arrow {
  font-size: 18px;
  color: #ccc;
  margin: 0 6px;
}

.principle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 700px) {
  .principle-grid {
    grid-template-columns: 1fr;
  }
}

.principle {
  padding: 14px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #eee;
}

.principle strong {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.principle span {
  font-size: 12px;
  color: #777;
  line-height: 1.5;
}

/* Demo */
.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 700px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}

.demo-card {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  position: relative;
}

.demo-number {
  font-size: 32px;
  font-weight: 800;
  color: #eee;
  position: absolute;
  top: 12px;
  right: 16px;
}

.demo-card h3 {
  font-size: 15px;
  margin: 0 0 8px;
  color: #333;
}

.demo-card p {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px;
  line-height: 1.6;
}

.demo-endpoints {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-endpoints code {
  font-size: 11px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #c62828;
  font-family: monospace;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 28px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: #fff;
}

.timeline-item.done .timeline-dot {
  background: #4caf50;
  border-color: #4caf50;
}

.timeline-item.next .timeline-dot {
  background: #ff9800;
  border-color: #ff9800;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.timeline-header strong {
  font-size: 14px;
}

.timeline-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f0f0f0;
  color: #666;
}

.timeline-item.done .timeline-badge {
  background: #e8f5e9;
  color: #2e7d32;
}

.timeline-item.next .timeline-badge {
  background: #fff3e0;
  color: #e65100;
}

.timeline-content ul {
  padding-left: 16px;
}

.timeline-content li {
  font-size: 13px;
  color: #666;
  line-height: 1.7;
}

/* Next steps */
.next-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 700px) {
  .next-grid {
    grid-template-columns: 1fr;
  }
}

.next-item {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
}

.next-phase {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin-bottom: 8px;
}

.next-item h3 {
  font-size: 15px;
  margin: 0 0 10px;
  color: #333;
}

.next-item li {
  font-size: 13px;
  color: #666;
}

/* Footer */
.portfolio-footer {
  text-align: center;
  padding: 40px 0 0;
  color: #999;
  font-size: 13px;
}

.footer-tech {
  font-family: monospace;
  font-size: 11px;
  margin-top: 4px;
  color: #bbb;
}
</style>
