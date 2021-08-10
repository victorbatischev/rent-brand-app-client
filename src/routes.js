import Login from './assets/vue/pages/login.vue'
import Profile from './assets/vue/pages/profile.vue'
import Loyal from './assets/vue/pages/loyaltyDetail.vue'
import Achievements from './assets/vue/pages/achievementsDetail.vue'
import Main from './assets/vue/pages/main.vue'
import Edit from './assets/vue/pages/edit.vue'
import Discount from './assets/vue/pages/discount.vue'
import Info from './assets/vue/pages/info.vue'
import Menu from './assets/vue/pages/menu.vue'
import Layout from './assets/vue/pages/layout.vue'
import Basket from './assets/vue/pages/basket.vue'
import Order from './assets/vue/pages/order.vue'
import History from './assets/vue/pages/history.vue'
import Booking from './assets/vue/pages/booking.vue'
import Gifts from './assets/vue/pages/gifts.vue'
import Promocode from './assets/vue/pages/promocode.vue'
import Detailed from './assets/vue/pages/detailed.vue'
import Qr from './assets/vue/pages/qr.vue'
import HistoryOrder from './assets/vue/pages/historyOrder.vue'

export default [
  {
    path: '/main',
    component: Layout
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/card',
    component: Main
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/edit',
    component: Edit
  },
  {
    path: '/achievements',
    component: Achievements
  },
  {
    path: '/loyal',
    component: Loyal
  },
  {
    path: '/discount',
    component: Discount
  },
  {
    path: '/info',
    component: Info
  },
  {
    path: '/menu',
    component: Menu
  },
  {
    path: '/basket',
    component: Basket
  },
  {
    path: '/order',
    component: Order
  },
  {
    path: '/history',
    component: History
  },
  {
    path: '/booking',
    component: Booking
  },
  {
    path: '/gifts',
    component: Gifts
  },
  {
    path: '/promocode',
    component: Promocode
  },
  {
    path: '/detailed',
    component: Detailed
  },
  {
    path: '/qr',
    component: Qr
  },
  {
    path: '/historyOrder',
    component: HistoryOrder
  }
]
