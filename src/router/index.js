import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Task from '@/views/Task.vue'
import Mine from '@/views/Mine.vue'
import Search from '@/views/Search.vue'
import About from '@/views/About.vue'
import Contact from "@/views/Contact.vue"
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import GameDetail from "@/views/GameDetail.vue";
import GameSearch from "@/views/GameSearch.vue";
import HomeB from "@/views/HomeB.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/homeb',
    name: 'Home-B',
    component: HomeB,
    meta: { title: '首页' }
  },
  {
    path: '/task',
    name: 'Task',
    component: Task,
    meta: { title: '任务' }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
    meta: { title: '我的' }
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

export default router