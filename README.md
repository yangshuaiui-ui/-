# 小丑牌 (Balatro Web)

基于 Vue 3 + TypeScript 实现的 Balatro 网页复刻版，包含完整的核心玩法循环。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/Vue-3-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## 功能

- 标准扑克牌手牌系统（抽牌、出牌、弃牌）
- Joker 卡系统与商店购买
- 评分计算（牌型识别 + 倍率叠加）
- 盲注进阶（小盲注 → 中盲注 → 大盲注）
- 流畅动画（基于 GSAP）

## 安装

```bash
# 克隆仓库
git clone https://github.com/yangshuaiui-ui/balatro.git
cd balatro/balatro

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 使用

浏览器打开 `http://localhost:5173`，即可开始游戏。

```bash
# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

## 技术栈

| 技术 | 版本 |
|------|------|
| Vue | 3 |
| TypeScript | 5 |
| Vite | 6 |
| Tailwind CSS | 4 |
| GSAP | 3 |

## 目录结构

```
balatro/src/
├── components/     # UI 组件
│   ├── HandArea.vue
│   ├── PlayArea.vue
│   ├── JokerArea.vue
│   ├── ShopView.vue
│   └── ...
├── composables/    # 游戏逻辑
│   ├── useGame.ts
│   ├── useAnimation.ts
│   └── useSettings.ts
└── App.vue
```

## License

[MIT](./LICENSE) © 2026 yangshuaiui-ui
