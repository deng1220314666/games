# Vue 3 项目模板

这是一个基于 Vue 3 的现代化前端项目模板，集成了当前主流的前端开发工具和库。

## 特性

- 🚀 **Vue 3** - 渐进式 JavaScript 框架
- ⚡ **Vite** - 下一代前端构建工具
- 🏪 **Pinia** - Vue 官方推荐的状态管理库
- 🌐 **Vue Router** - 官方路由管理器
- 🌍 **Vue I18n** - 国际化解决方案
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 🔄 **Axios** - 基于 Promise 的 HTTP 客户端
- 💾 **状态持久化** - 使用 pinia-plugin-persistedstate
- 🎯 **深色模式** - 支持主题切换
- 📱 **响应式设计** - 支持移动端

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 公共组件
│   └── ThemeToggle.vue  # 主题切换组件
├── locales/             # 国际化文件
│   ├── index.js         # 国际化配置
│   ├── zh.json          # 中文语言包
│   └── en.json          # 英文语言包
├── router/              # 路由配置
│   └── index.js         # 路由定义
├── stores/              # 状态管理
│   ├── counter.js       # 计数器状态
│   └── index.js         # store 导出
├── styles/              # 样式文件
│   ├── index.scss       # 主样式文件
│   └── variables.scss   # 样式变量
├── utils/               # 工具函数
│   └── request.js       # HTTP 请求封装
├── views/               # 页面组件
│   ├── Home.vue         # 首页
│   └── About.vue        # 关于页面
├── App.vue              # 根组件
└── main.js              # 应用入口
```

## 开发指南

### 添加新页面

1. 在 `src/views` 目录下创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置

```javascript
import NewPage from '@/views/NewPage.vue'

const routes = [
  // ... 其他路由
  {
    path: '/new-page',
    name: 'NewPage',
    component: NewPage
  }
]
```

### 添加新语言

1. 在 `src/locales` 目录下创建新的语言文件，如 `fr.json`
2. 在 `src/locales/index.js` 中导入并配置

```javascript
import fr from './fr.json'

const messages = {
  zh,
  en,
  fr  // 添加新语言
}
```

### 状态管理

1. 在 `src/stores` 目录下创建新的 store
2. 在组件中使用 `useStore` 来访问状态

```javascript
import { useUserStore } from '@/stores'

const userStore = useUserStore()
```

### HTTP 请求

使用封装的 Axios 实例进行 HTTP 请求：

```javascript
import request from '@/utils/request'

// GET 请求
request.get('/api/users')

// POST 请求
request.post('/api/users', { name: 'John' })
```

## 配置说明

### 环境变量

项目支持环境变量配置，参考 `.env.example` 文件：

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Vue 3 Template
```

### 主题配置

项目支持深色/浅色主题切换，主题配置在 `src/styles/index.scss` 中定义。

## 技术栈版本

- Vue 3.4.0+
- Vite 5.0.0+
- Pinia 2.1.0+
- Vue Router 4.2.0+
- Vue I18n 9.0.0+
- Tailwind CSS 3.3.0+
- Axios 1.6.0+

## 浏览器支持

- Chrome ≥ 60
- Firefox ≥ 60
- Safari ≥ 12
- Edge ≥ 79

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目模板。

## 许可证

MIT License