# 🏥 医疗器械智能制造云平台 (Medical Smart Cloud Dashboard)

> **上海交通大学** —— 专为医疗器械智能制造行业打造的高保真数据可视化大屏。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## 📖 项目简介

本项目是一个基于 **React 19** 的单页应用（SPA），旨在提供医疗器械生产、物流和质量控制全流程的实时概览。它具备中英双语界面、深度交互式图表以及实时数据可视化功能，专为大屏展示设计。

## ✨ 核心功能

*   **🌐 国际化支持**: 内置 React Context 状态管理，支持一键切换 **中文 (ZH)** 与 **英文 (EN)** 界面。
*   **📊 深度交互图表**:
    *   **生产进度**: 带有滞后指标（Lagging Indicators）和状态追踪的条形图。
    *   **平台数据汇总**: 支持自定义 Tooltip 和图例交互的环形图。
    *   **工作量统计**: 带有钻取功能（模态框详情）和时间维度筛选（周/月/周期）的动态仪表盘。
*   **🗺️ 混合地图系统**:
    *   **高德地图集成**: 支持接入 AMap (高德地图 SDK 2.0) 展示真实地理信息。
*   **🛡️ 数据层**:
    *   API 请求自动拦截：如果后端接口不可用，系统会自动使用内置的 **模拟数据 (Demo Data)** 进行展示。
    *   非侵入式调试：API 错误信息仅在控制台以警告形式输出，不会干扰前端 UI 展示。
*   **🎨 现代 UI/UX 设计**:
    *   **玻璃拟态**：使用背景模糊与半透明效果提升质感。
    *   **响应式布局**：基于 Tailwind CSS Grid 系统，适配不同屏幕尺寸。
    *   **流畅动画**：所有图表和交互均包含过渡动画。

## 🛠 技术栈

*   **核心框架**: React 19, TypeScript
*   **样式库**: Tailwind CSS (当前配置为 CDN 模式，便于快速原型开发)
*   **数据可视化**: Recharts
*   **图标库**: Lucide React
*   **地图服务**: AMap (高德地图 SDK 2.0)
*   **构建工具**: Vite (推荐)

## 📂 目录结构

```bash
├── components/          # UI 组件库
│   ├── Charts.tsx       # 图表组件 (条形图, 饼图, 仪表盘)
│   ├── InfoWidgets.tsx  # 信息小组件 (数字卡片, 列表, 详情弹窗)
│   ├── LayoutComponents.tsx # 布局组件 (头部导航, 卡片容器, Loading)
│   ├── MapWidget.tsx    # 地图组件 (包含高德地图逻辑与 SVG 模拟层)
│   └── NotificationSystem.tsx
├── contexts/
│   └── LanguageContext.tsx # 国际化 (i18n) 上下文逻辑
├── hooks/
│   └── useDashboard.ts  # 数据获取与轮询 Hook
├── services/
│   └── api.ts           # API 请求封装与 Mock 数据降级策略
├── App.tsx              # 主应用入口与布局
├── index.html           # 页面入口 (包含 Tailwind 配置与地图脚本)
├── index.tsx            # React 根节点挂载
├── types.ts             # TypeScript 类型定义
└── metadata.json        # 应用元数据
```
