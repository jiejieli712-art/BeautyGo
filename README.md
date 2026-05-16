# BeautyGo

**AI 产品经理作品集** — 上门美妆 O2O 双边撮合平台

> 让每个人在任何地方都能轻松获得专业美妆服务，让每一位化妆师都能把技术转化为稳定收入。

## 项目概览

BeautyGo 是一个求职面试向的 AI 产品经理作品集项目。使用"上门美妆 O2O"作为业务载体，展示从产品判断、需求收束、PRD、流程设计、AI 协作研发到 MVP 验收的完整能力链路。

| 维度 | 数据 |
|------|------|
| 核心代码 | ~2500 行 |
| 里程碑 | 3 个完成 |
| API 端点 | 10 个 |
| 前端页面 | 5 个 |
| 测试用例 | 38 个，全部通过 |
| 技术栈 | NestJS + Vue 3 + TypeScript + pnpm monorepo |

## 快速开始

```bash
pnpm install
pnpm dev
```

默认本地地址：

- **super-app**（客户/化妆师入口）：`http://localhost:5173`
- **admin-web**（运营审核后台）：`http://localhost:5174`
- **API health**：`http://localhost:3000/api/health`

## 可演示主线

1. **客户侧**：浏览化妆师 → 查看服务套餐 → 发起模拟预约
2. **化妆师侧**：提交入驻申请 → 查看审核状态
3. **运营后台**：审核化妆师 → 管理申请状态 → 查看运营看板
4. **作品集展示层**：展示 PRD 摘要、产品决策、AI 协作流程、里程碑和复盘

## MVP 范围取舍

**做了：** 化妆师入驻 + 后台审核 + 客户预约 + 运营看板 + 作品集展示

**不做（有明确原因）：**
- 新娘全天跟妆：高复杂度，MVP 不验证
- 派单/抢单：先验证直约模式
- 内容社区：非交易闭环必需
- 真实支付/IM/地图：需要企业资质，与作品集目标无关

## 技术架构

```text
pnpm monorepo
├─ apps/api              NestJS + TypeScript（领域逻辑 + 集成层）
├─ apps/super-app        Vue 3 + Vite（客户 + 化妆师入口）
├─ apps/admin-web        Vue 3 + Router + Vite（运营审核后台）
└─ packages/domain-types TypeScript 类型包（共享业务语言）
```

## AI 协作方式

采用 **Vibe Coding** 模式：人类定义产品方向和业务规则，AI Agent 负责架构设计、代码实现和质量检查。

五个 Agent 角色：Delivery Lead → Product Breakdown → Architecture → Implementation → QA & Release

详见 `docs/beautygo-vibe-coding-operating-system.md`

## 验证

```bash
pnpm --filter @beautygo/api test   # 38 个测试
pnpm typecheck                      # 全包类型检查
pnpm build                          # 全包构建
```

## 文档索引

| 文档 | 说明 |
|------|------|
| `PRD_BeautyGo_AI产品经理作品集_v1.0.md` | 当前 PRD（唯一产品源文件） |
| `docs/AI产品经理作品集开发计划.md` | 开发计划 |
| `docs/beautygo-vibe-coding-operating-system.md` | AI 协作模式 |
| `docs/面试讲解脚本.md` | 30s / 3min / 8min 三个版本 |
| `docs/项目复盘.md` | 里程碑回顾、技术决策、经验教训 |
