<template>
  <div>
    <app-bar />
    <f7-block v-if="!load" :style="'padding-top: 70px;'">
      <div
        :class="
          active === 1
            ? 'loyalty-info-container animated'
            : 'loyalty-info-container'
        "
      >
        <loyalty-info
          :summ="ball.discount"
          :level="ball.level"
          :now="ball.nowValue"
          :full="ball.fullLayer"
          :discount="ball.percents"
          :active="ball.noLevel"
          :userId="user.userId"
          :show="ball.show"
          @selected="navigateToAchievements"
        />
      </div>

      <div :class="active === 1 ? 'loyalty-qrcode animated' : 'loyalty-qrcode'">
        <p class="loyalty-qrcode-header">
          Покажите QR-код нашему сотруднику
        </p>
      </div>

      <div
        v-if="visit.show"
        @click="navigateToLoyal"
        :class="
          active === 1 ? 'achievements-list animated' : 'achievements-list'
        "
      >
        <achievement
          v-for="value in visit.maxValue"
          :key="value"
          :number="value"
          :title="visit.valueName"
          :active="value <= visit.nowValue"
        />
        <achievement
          :present="true"
          :number="visit.presents"
          :presentNumber="visit.maxValue + 1"
        />
      </div>

      <f7-swiper
        v-if="promos.length"
        :style="'height: 112px; margin-bottom: 50px;'"
        :class="active === 1 ? 'animated' : ''"
        pagination
        :params="{
          speed: 1500,
          slidesPerView: 1,
          autoplay: {
            delay: 6000,
            disableOnInteraction: false
          },
          effect: 'flip'
        }"
      >
        <f7-swiper-slide v-for="promo in promos" :key="promo.id">
          <div class="swiper-block">
            <div
              style="display: flex; align-items: center; background: #1b0f29;"
            >
              <img
                style="height: 128px; width: 128px;"
                :src="require('../../images/rentbrandapp.png').default"
              />
            </div>
            <div class="card-content card-content-padding">
              <p class="main-card-title">{{ promo.name }}</p>
              <p class="main-card-description">
                {{ promo.description }}
              </p>
            </div>
          </div>
        </f7-swiper-slide>
      </f7-swiper>
    </f7-block>
    <pre-loader v-else />
  </div>
</template>

<script>
import AppBar from '../components/appbar'
import Achievement from '../components/achievementblock'
import LoyaltyInfo from '../components/loyaltyinfo'
import BottomTabs from '../components/bottomtabs'
import query from '../utils/axiosQuery'
import axios from 'axios'
import CONFIG from '../../../config'
import PreLoader from '../components/preloader'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    AppBar,
    Achievement,
    LoyaltyInfo,
    BottomTabs,
    PreLoader
  },

  data() {
    return {
      load: true,
      visit: {
        show: null,
        id: null,
        inUser: false,
        inCompany: false,
        nowValue: 0,
        maxValue: 6,
        valueName: 'Пусто',
        presents: 0,
        desc: null
      },
      ball: {
        show: null,
        id: null,
        inUser: false,
        inCompany: false,
        nowValue: 0,
        fullLayer: 0,
        discount: 0,
        level: 0,
        displayPercents: 0,
        allGrades: [],
        desc: null,
        noLevel: true
      },
      promos: []
    }
  },

  async mounted() {
    document.addEventListener('deviceready', (e) => {
      window.open = cordova.InAppBrowser.open
      const channel = localStorage.getItem('pushChannel')
      // подписываемся на канал уведомлений Firebase
      if (channel) {
        FirebasePlugin.subscribe(channel)
      }
    })

    // получение списка акций для отображения в свайпере

    await query
      .get(`${CONFIG.API_URL}company/${CONFIG.COMPANY_ID}/promos`)
      .then((res) => {
        this.promos = res.data.promos.filter((item) => item.showOnMainScreen)
      })

    // получение и обновление списка подключенных модулей компании

    // Бронирование   | Module Booking
    // Доставка       | Module Delivery
    // Промокоды      | Module Promo Codes
    // Приведи друга  | Module Invite Friend
    // Колесо фортуны | Module Fortune

    await query
      .get(CONFIG.API_URL + 'company/' + CONFIG.COMPANY_ID + '/tarif')
      .then(async (res) => {
        if (res.data && res.status === 200) {
          localStorage.setItem('modules', JSON.stringify(res.data))
          this.setModules(res.data)
        }
      })

    await query
      .get(CONFIG.API_URL + 'company-loyality', {
        params: {
          companyId: CONFIG.COMPANY_ID
        }
      })
      .then(async (res) => {
        if (res.data && res.status === 200) {
          await res.data.forEach(async (item) => {
            if (item.loyality.name === 'ball') {
              this.ball.show = true
              this.ball.id = item.id
              this.ball.desc = item.description

              await query
                .get(CONFIG.API_URL + 'company-grade', {
                  params: {
                    companyLoyalityId: item.id
                  }
                })
                .then((_res) => {
                  const sorted = _res.data.sort((a, b) => {
                    a.layer - b.layer
                  })

                  this.ball.allGrades = sorted
                })
            } else if (item.loyality.name === 'visit') {
              this.visit.show = true
              this.visit.id = item.id
              this.visit.desc = item.description

              await query
                .get(CONFIG.API_URL + 'company-grade', {
                  params: {
                    companyLoyalityId: item.id
                  }
                })
                .then((_res) => {
                  this.visit.nowValue = _res.loyalityCount
                  this.visit.valueName = _res.grade ? _res.grade.name : ''
                  this.visit.desc = _res.companyLoyality
                    ? _res.companyLoyality.description
                    : ''
                  this.visit.presents = _res.value
                  this.visit.maxValue = _res.grade ? _res.grade.value : 0
                })
            }
          })
        }
      })

    await query
      .get(CONFIG.API_URL + 'user-loyality', {
        params: {
          userId: this.user.userId
        }
      })
      .then(async (res) => {
        if (res.data && res.status === 200) {
          await res.data.forEach(async (item) => {
            await query
              .get(
                `${CONFIG.API_URL}company-loyality/${item.companyLoyality.id}`
              )
              .then(async (_res) => {
                if (_res.data.loyality.name === 'visit') {
                  this.visit.inUser = true
                  this.visit.nowValue = item.loyalityCount
                  this.visit.valueName = item.grade.name
                  this.visit.desc = item.companyLoyality.description
                  this.visit.presents = item.value
                  this.visit.maxValue = item.grade.value
                } else if (_res.data.loyality.name === 'ball') {
                  this.ball.inUser = true
                  this.ball.noLevel = false

                  await query
                    .get(CONFIG.API_URL + 'company-grade', {
                      params: {
                        companyLoyalityId: this.ball.id
                      }
                    })
                    .then((_res) => {
                      const sorted = _res.data.sort((a, b) => {
                        a.layer - b.layer
                      })
                      if (sorted.length === 1) {
                        this.ball.fullLayer = sorted[0].layer
                        this.ball.nowValue = item.summ
                        this.ball.percents = sorted[0].value
                        this.ball.allGrades = sorted
                      } else if (sorted.length > 1) {
                        for (let i = 0; i < sorted.length; i++) {
                          if (!sorted[i]) {
                            continue
                          }

                          if (
                            sorted[i].companyLoyality.id ===
                            item.companyLoyality.id
                          ) {
                            if (sorted[i].layer > item.summ) {
                              this.ball.nowValue = item.summ
                              this.ball.discount = item.value
                              this.ball.fullLayer = sorted[i].layer
                              this.ball.percents = sorted[i - 1]
                                ? sorted[i - 1].value
                                : 0
                              this.ball.level = sorted[i - 1]
                                ? sorted[i - 1].name
                                : 0
                              this.ball.allGrades = sorted
                              this.ball.desc = item.companyLoyality.description
                              break
                            }
                          }
                        }
                      }
                    })
                }
              })
          })
        }
      })

    await this.getMenu()

    const basketItems = JSON.parse(localStorage.getItem('basket')) || []
    this.setBasket(basketItems)

    this.$forceUpdate()

    this.load = false
  },

  computed: {
    ...mapState({
      active: (state) => state.activeRoute,
      user: (state) => state.user
    })
  },

  methods: {
    async getMenu() {
      const dbProducts = localStorage.getItem('products')

      if (!dbProducts) {
        const productsArr = []

        await query
          .get(
            `${CONFIG.API_URL}company/${CONFIG.COMPANY_ID}/productCategories`
          )
          .then(async (res) => {
            for (let item of res.data.productCategories) {
              const categoryItem = await query
                .get(CONFIG.API_URL + `product-category/${item.id}`)
                .then((res) => {
                  return res.data
                })

              const categoryProducts = []

              await categoryItem.products.forEach(async (product) => {
                // const data = await this.getPictureBase(product.files)

                categoryProducts.push({
                  ...product
                  // files: data
                })
              })

              productsArr.push({
                ...categoryItem,
                products: categoryProducts
              })
            }
          })

        localStorage.setItem('products', JSON.stringify(productsArr))
        this.setMenu(productsArr)
      } else {
        const productsArr = []

        await query
          .get(
            CONFIG.API_URL + `company/${CONFIG.COMPANY_ID}/productCategories`
          )
          .then(async (res) => {
            for (let item of res.data.productCategories) {
              await query
                .get(CONFIG.API_URL + `product-category/${item.id}`)
                .then((res) => {
                  return productsArr.push(res.data)
                })
            }
          })

        if (JSON.stringify(productsArr) != JSON.stringify(dbProducts)) {
          localStorage.removeItem('products')
          return this.getMenu()
        }

        this.setMenu(productsArr)
      }
    },

    async getPictureBase(urls) {
      const arr = []

      await urls.forEach(async (item) => {
        await axios({
          url: item.url,
          method: 'GET',
          responseType: 'blob'
        }).then((res) => {
          const blob = new Blob([res.data])
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = function() {
            arr.push(reader.result)
          }
        })
      })

      return arr
    },

    setActiveRoute(route) {
      this.setActiveRoute(route)
    },

    navigateToAchievements() {
      this.$f7router.navigate('/achievements', {
        props: {
          data: this.ball
        }
      })
    },

    navigateToLoyal() {
      this.$f7router.navigate('/loyal', {
        props: {
          data: this.visit
        }
      })
    },
    ...mapActions(['setActiveRoute', 'setMenu', 'setModules', 'setBasket'])
  }
}
</script>
