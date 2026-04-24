import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import About from '@/views/About.vue'
import Contact from "@/views/Contact.vue"
import PrivacyPolicy from "@/views/PrivacyPolicy.vue"
import GameDetail from "@/views/GameDetail.vue";
import GameSearch from "@/views/GameSearch.vue"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我们' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { title: '联系我们' }
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: { title: '隐私政策' }
  },
  {
    path: '/game/:id',
    name: 'GameDetail',
    component: GameDetail,
    meta: { title: '游戏详情' }
  },
  {
    path: '/search',
    name: 'GameSearch',
    component: GameSearch,
    meta: { title: '游戏查询' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // document.title = `${to.meta.title} - Vue 3 项目`
  }
  next()
})

export default router