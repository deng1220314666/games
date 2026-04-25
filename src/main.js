import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n }  from './locales'
import './styles/index.scss'
import VueLazyload from 'vue3-lazyload'

// 创建应用实例
const app = createApp(App)

// 配置 Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 使用插件
app.use(pinia)
app.use(router)
app.use(i18n)

app.use(VueLazyload, {
  loading: "",  // 设置加载时显示的占位图
  error: "",     // 设置加载失败时的占位图
})

app.mount('#app')