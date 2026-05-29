# CLAUDE.md

## 项目定位

小丑牌（Balatro）网页复刻版——基于 Vue 3 + TypeScript + Vite 实现的单机卡牌游戏，包含完整的核心循环：出牌评分、Joker 系统、商店购物、盲注进阶。

## 目录约定

```
001/
├── balatro/              # 主游戏源码（Vue 3 + TS + Vite）
│   ├── src/
│   │   ├── components/   # UI 组件（HandArea、JokerArea、PlayArea 等）
│   │   ├── composables/  # 状态逻辑（useGame、useAnimation、useSettings）
│   │   ├── assets/       # 静态资源
│   │   └── App.vue       # 根组件
│   ├── public/           # 公共静态文件
│   └── dist/             # 构建产物（不提交）
├── *.html                # PRD / 设计稿交付文档
└── my-skills-backup/     # Claude Code 自定义命令备份
```

## 常用命令

```bash
# 进入项目目录
cd balatro

# 开发服务器
npm run dev

# 类型检查 + 构建
npm run build

# 预览构建产物
npm run preview
```

## 技术栈

- **框架**：Vue 3（Composition API + `<script setup>`）
- **语言**：TypeScript
- **构建**：Vite
- **样式**：Tailwind CSS v4
- **动画**：GSAP

## 开发约定

- 游戏逻辑集中在 `composables/useGame.ts`，不要在组件里写业务逻辑
- 动画统一走 `composables/useAnimation.ts`
- 新增组件放 `src/components/`，以功能命名（PascalCase）
