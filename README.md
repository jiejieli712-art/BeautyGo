# BeautyGo

BeautyGo 是一个求职面试向的 `AI 产品经理作品集项目`。项目使用“上门美妆 O2O”作为业务载体，展示从产品判断、需求收束、PRD、流程设计、AI 协作研发到准上线 MVP 验收的完整能力链路。

当前项目不再按真实商业化平台推进，不接入真实支付、实名认证、IM、短信、地图、保险和多城市运营。旧商业化 PRD 仅保留为历史资料，后续开发以 `PRD_BeautyGo_AI产品经理作品集_v1.0.md` 为唯一产品源文件。

## Current Status

当前阶段：`Milestone 1：产品收束与代码健康`

已完成：

1. monorepo 基础骨架：API、客户/化妆师入口、运营后台、共享领域类型。
2. Mock 登录、角色切换、化妆师入驻申请、后台审核闭环。
3. 项目定位从完整商业平台收束为 AI 产品经理作品集。
4. Claude Code 审查中的关键技术债开始修复：类型收敛、DI、环境变量、CORS、输入限制、基础测试。

下一步：

1. 实现作品集概览页，让面试官 3 分钟理解项目。
2. 补齐客户浏览化妆师与模拟预约流程。
3. 完善后台运营看板、面试讲解脚本和项目复盘。

## Source Documents

1. 当前 PRD：`PRD_BeautyGo_AI产品经理作品集_v1.0.md`
2. 开发计划：`docs/AI产品经理作品集开发计划.md`
3. 历史 PRD：`PRD_上门美妆平台_BeautyGo_v0.2.md`
4. Agent 协作：`docs/beautygo-vibe-coding-operating-system.md`

## Demo Lines

1. `客户侧`：浏览化妆师、查看服务套餐、发起模拟预约。
2. `化妆师侧`：提交入驻申请、配置基础资料、查看审核状态。
3. `运营后台`：审核化妆师、管理申请状态、查看基础运营看板。
4. `作品集展示层`：展示 PRD 摘要、产品决策、AI 协作流程、里程碑和复盘。

## Tech Stack

```text
pnpm monorepo
├─ apps/api        NestJS + TypeScript
├─ apps/super-app  Vue 3 + Vite
├─ apps/admin-web  Vue 3 + Vite
└─ packages/domain-types
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Run all apps:

```bash
pnpm dev
```

Default local URLs:

1. super-app：`http://localhost:5173`
2. admin-web：`http://localhost:5174`
3. API health：`http://localhost:3000/api/health`

## Environment

Root API example:

```bash
cp .env.example .env
```

Frontend examples:

```bash
cp apps/super-app/.env.example apps/super-app/.env
cp apps/admin-web/.env.example apps/admin-web/.env
```

## Verification

```bash
pnpm --filter @beautygo/api test
pnpm typecheck
pnpm build
```

## AI Collaboration

Codex 负责产品定位、PRD、任务拆解、验收标准、代码审查和阶段推进。Claude Code 负责具体代码实现、重构、测试补充、页面交互和 bug 修复。

每次交给 Claude Code 的任务都会包含：当前目标、写入范围、禁止事项、涉及文件、验收标准、测试命令和中文提交说明建议。
