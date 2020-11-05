import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerPage',
    component: () => import('../views/SellerPage')
  },
  {
    path: '/trendPage',
    component: () => import('../views/TrendPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
