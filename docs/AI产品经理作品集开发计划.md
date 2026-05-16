# BeautyGo AI 产品经理作品集开发计划

- 日期：`2026-05-16`
- 当前阶段：`Milestone 1：产品收束与代码健康`
- 项目形态：`准上线 MVP + 作品集展示`
- 协作模式：`Codex 负责产品与验收，Claude Code 负责代码实现`
- 当前 PRD：`PRD_BeautyGo_AI产品经理作品集_v1.0.md`

## 1. 开发目标

BeautyGo 后续不再按完整商业平台推进，而是按求职面试作品集推进。开发目标是做出一个本地可运行、流程可演示、文档可解释、代码质量基本过关的 AI 产品经理作品集。

最终面试演示应包含四件事：

1. 一份能解释产品判断和范围取舍的 PRD。
2. 一个能跑通客户、化妆师、运营后台的 MVP。
3. 一套能展示 Codex + Claude Code 协作方式的研发过程。
4. 一份能支撑面试讲解的 README、复盘和运行指南。

## 2. 研发角色与 Agents

### 2.1 Agent 编组

| Agent | 负责人 | 职责 | 产出 |
| --- | --- | --- | --- |
| Delivery Lead Agent | Codex | 阶段推进、优先级、风险控制、用户同步 | 阶段计划、状态更新、决策记录 |
| Product Breakdown Agent | Codex | PRD、用户流程、故事拆解、验收标准 | PRD、任务包、验收清单 |
| Architecture Agent | Codex 主导，Claude Code 辅助 | 模块边界、数据模型、接口契约、技术债判断 | 架构说明、接口列表、风险说明 |
| Implementation Agent | Claude Code | 代码实现、重构、页面交互、测试补充 | 代码 diff、测试结果、实现说明 |
| QA & Release Agent | Codex | 代码审查、验收、回归测试、提交建议 | 审查报告、测试记录、发布判断 |
| Portfolio Story Agent | Codex | 面试表达、README、复盘、展示材料 | 面试脚本、项目亮点、复盘文档 |

### 2.2 协作原则

1. Codex 不把模糊需求直接丢给 Claude Code，必须先拆成可验收任务。
2. Claude Code 每次只处理一个明确任务包，避免大范围失控修改。
3. 每个任务包都必须说明禁止事项，特别是不得引入真实支付、实名、IM、地图等非目标。
4. 每次 Claude Code 返回后，Codex 负责审查 diff 和跑验证命令。
5. 所有 Git 提交说明必须使用中文。

## 3. Claude Code 任务包模板

后续每次交给 Claude Code 的任务按以下模板发送：

```md
# Claude Code Task：<任务标题>

## 当前目标
说明本次要达成的业务结果，不写泛泛的“优化页面”。

## 写入范围
- 允许修改：
- 不建议修改：

## 禁止事项
- 不接入真实支付。
- 不接入真实实名、短信、IM、地图、保险。
- 不重写无关模块。
- 不删除用户或 Codex 已完成的文档。

## 涉及文件
- <文件路径>

## 产品要求
- 需求点 1
- 需求点 2

## 验收标准
- 标准 1
- 标准 2

## 测试命令
- pnpm --filter @beautygo/<package> typecheck
- pnpm --filter @beautygo/<package> build
- pnpm --filter @beautygo/api test

## 中文提交说明建议
<中文 commit message>
```

## 4. 阶段计划

### 阶段 1：产品收束与代码健康

目标：建立新的作品集方向，并修复影响后续开发的基础技术债。

任务：

1. 新增 `PRD_BeautyGo_AI产品经理作品集_v1.0.md`。
2. 新增 `docs/AI产品经理作品集开发计划.md`。
3. 更新 README，说明当前项目是 AI 产品经理作品集，不再是商业化创业项目。
4. 统一 `domain-types` 与 API 类型定义。
5. 修复 NestJS store 单例与 DI 不一致问题。
6. 前端 `API_BASE_URL` 改为环境变量。
7. 后台补充 `@beautygo/domain-types` 依赖声明。
8. CORS 改为环境化配置。
9. validators 增加长度限制。
10. 增加 `.env.example` 和核心测试。

验收命令：

```bash
pnpm install
pnpm --filter @beautygo/api test
pnpm typecheck
pnpm build
```

阶段完成标准：

1. 新文档成为开发源文件。
2. 代码健康问题 P0/P1 基本关闭。
3. 后续功能可以按任务包交给 Claude Code。

### 阶段 2：作品集展示层

目标：让面试官打开项目后，3 分钟内理解 BeautyGo 是什么、为什么这么做、AI 怎么参与。

建议交给 Claude Code 的任务：

```md
# Claude Code Task：实现 BeautyGo 作品集概览页

## 当前目标
在 super-app 首页加入作品集概览，让面试官快速理解项目定位、范围取舍、AI 协作和当前里程碑。

## 写入范围
- apps/super-app/src/App.vue
- apps/super-app/src/features/**
- apps/super-app/src/pages/**
- 必要时新增静态数据文件

## 禁止事项
- 不引入 UI 框架。
- 不接入真实第三方服务。
- 不删除已有角色切换和化妆师入驻能力。

## 产品要求
- 明确写出“AI 产品经理作品集”定位。
- 展示四条主线：客户侧、化妆师侧、运营后台、作品集展示层。
- 展示 Codex 与 Claude Code 分工。
- 展示当前里程碑和下一步。

## 验收标准
- 首页首屏能说明项目定位。
- 有明确业务入口。
- 移动端和桌面端都可读。
- pnpm --filter @beautygo/super-app typecheck 通过。
```

验收重点：

1. 页面文案必须和新 PRD 一致。
2. 视觉不能像默认模板，要有作品集展示感。
3. 不能让用户误解这是正在融资的商业项目。

### 阶段 3：客户模拟预约

目标：补齐客户侧可演示闭环。

建议交给 Claude Code 的任务：

```md
# Claude Code Task：实现客户浏览与模拟预约主流程

## 当前目标
客户可以浏览模拟化妆师、查看套餐并创建模拟预约，形成作品集可演示主线。

## 写入范围
- packages/domain-types/src/**
- apps/api/src/modules/bookings/**
- apps/super-app/src/**

## 禁止事项
- 不做真实支付。
- 不保存真实详细地址。
- 不接地图、短信、IM。
- 不影响化妆师入驻审核流程。

## 产品要求
- 至少 3 个模拟化妆师。
- 每个化妆师至少 2 个套餐。
- 预约字段包含场景、日期、时间、区域、备注。
- 创建成功后返回预约编号和状态。

## 验收标准
- 客户能完成浏览 -> 选择套餐 -> 提交预约 -> 查看成功状态。
- API 有基础输入校验。
- pnpm --filter @beautygo/api test 通过。
- pnpm typecheck 通过。
```

推荐数据结构：

1. `ArtistProfile`：用于浏览和详情。
2. `ServicePackage`：用于套餐。
3. `MockBooking`：用于模拟预约。

### 阶段 4：运营后台看板

目标：让后台不只是审核台，还能展示“产品经理懂指标和运营”的能力。

建议交给 Claude Code 的任务：

```md
# Claude Code Task：补充作品集版运营看板

## 当前目标
在 admin-web Dashboard 中展示 BeautyGo MVP 的基础运营指标，包括申请状态分布和模拟预约数据。

## 写入范围
- apps/admin-web/src/views/DashboardView.vue
- apps/admin-web/src/api.ts
- apps/api/src/modules/**

## 禁止事项
- 不接真实 BI。
- 不新增复杂图表库。
- 不做真实财务指标。

## 产品要求
- 展示申请总数、待审核数、试运营数、通过数。
- 如果预约模块已完成，展示模拟预约总数和状态分布。
- 展示“作品集指标”：3 分钟理解度、可演示主线、AI 协作可解释性。

## 验收标准
- 后台首页能解释当前 MVP 健康度。
- 指标来自 API 或可维护静态源。
- pnpm --filter @beautygo/admin-web typecheck 通过。
```

### 阶段 5：演示与复盘

目标：项目可以直接用于简历、面试和 GitHub 展示。

任务：

1. 更新 README：项目定位、技术栈、运行方式、演示路径、里程碑。
2. 新增 `docs/面试讲解脚本.md`。
3. 新增 `docs/项目复盘.md`。
4. 补充截图或页面说明。
5. 整理一份“下一步路线图”，明确哪些是刻意不做。

验收标准：

1. 面试官只看 README 也能理解项目。
2. 用户能按 README 在本地跑起来。
3. 文档能解释 AI 协作方式和产品取舍。

## 5. 当前技术债处理清单

| 编号 | 问题 | 处理方式 | 优先级 |
| --- | --- | --- | --- |
| TD-01 | domain-types 与 API 类型重复 | domain-types 作为 source of truth | P0 |
| TD-02 | Controller 直接 import store 单例 | 改为 NestJS DI 注入 | P0 |
| TD-03 | 前端 API 地址硬编码 | 使用 `VITE_API_BASE_URL` | P1 |
| TD-04 | admin-web 缺少 domain-types 依赖 | package.json 补充 workspace 依赖 | P1 |
| TD-05 | CORS 完全开放 | 使用 `CORS_ORIGIN` 环境变量 | P1 |
| TD-06 | 输入字符串无长度限制 | validators 支持 `maxLength` | P1 |
| TD-07 | 缺少 env 示例 | 根目录和前端应用补充 `.env.example` | P1 |
| TD-08 | 缺少基础测试 | API store 和 validators 增加测试 | P1 |

## 6. 日常开发流程

### 6.1 每个任务开始前

1. Codex 检查当前 PRD 和开发计划。
2. Codex 明确本次任务属于哪个阶段。
3. Codex 生成 Claude Code 任务包。
4. 用户确认方向或直接授权继续。

### 6.2 Claude Code 实现后

1. Codex 查看 diff。
2. Codex 对照 PRD 和任务包检查范围。
3. Codex 运行测试命令。
4. Codex 必要时本地打开页面或调用 API。
5. Codex 输出中文阶段总结。

### 6.3 Git 规则

1. 提交说明必须是中文。
2. 每个阶段尽量 1-2 个语义化提交。
3. 不把文档重构、代码修复、功能开发混在一个巨大提交里。
4. 如果本地和远程冲突，先拉取并确认差异，不使用破坏性命令。

建议提交粒度：

1. `收束 BeautyGo 为 AI 产品经理作品集`
2. `修复 API 类型与依赖注入基础问题`
3. `实现作品集概览页`
4. `实现客户模拟预约流程`
5. `补充后台看板与面试演示文档`

## 7. 验收命令

常规命令：

```bash
pnpm install
pnpm --filter @beautygo/api test
pnpm typecheck
pnpm build
```

本地运行：

```bash
pnpm dev
```

默认访问：

1. super-app：`http://localhost:5173`
2. admin-web：`http://localhost:5174`
3. API health：`http://localhost:3000/api/health`

## 8. 状态同步格式

每次阶段同步保持简洁：

```md
## 今日进度
- 完成了什么。
- 验证了什么。

## 当前风险
- 有什么需要注意。

## 下一步
- 下一件最小可交付任务。
```

## 9. 下一步 Todo

1. 完成 Milestone 1 验证并提交。
2. 交给 Claude Code 执行“作品集概览页”任务。
3. Codex 审查页面实现并调整文案。
4. 交给 Claude Code 执行“客户模拟预约主流程”任务。
5. 补充后台看板和最终面试材料。
