import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Task from '@/views/Task.vue'
import Wallet from '@/views/Wallet.vue'
import Mine from '@/views/Mine.vue'
import Invite from '@/views/Invite.vue'
import GameDetail from '@/views/GameDetail.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: '首页', tab: true } },
  { path: '/task', name: 'Task', component: Task, meta: { title: '任务', tab: true } },
  { path: '/wallet', name: 'Wallet', component: Wallet, meta: { title: '钱包', tab: true } },
  { path: '/mine', name: 'Mine', component: Mine, meta: { title: '我的', tab: true } },
  { path: '/invite', name: 'Invite', component: Invite, meta: { title: '邀请' } },
  { path: '/game/:id', name: 'GameDetail', component: GameDetail, meta: { title: '游戏' } },
  { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy, meta: { title: '隐私政策' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
