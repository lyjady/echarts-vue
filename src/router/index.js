import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/ScreenPage')
  },
  {
    path: '/sellerPage',
    component: () => import('../views/SellerPage')
  },
  {
    path: '/trendPage',
    component: () => import('../views/TrendPage')
  },
  {
    path: '/mapPage',
    component: () => import('../views/MapPage')
  },
  {
    path: '/rankPage',
    component: () => import('../views/RankPage')
  },
  {
    path: '/hotProduct',
    component: () => import('../views/HotProduct')
  },
  {
    path: '/stockPage',
    component: () => import('../views/StockPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
