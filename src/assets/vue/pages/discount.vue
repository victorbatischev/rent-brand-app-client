<template>
  <div :style="'padding-bottom: 20px'">
    <f7-navbar>
      <f7-nav-left></f7-nav-left>
      <f7-nav-title>
        Акции
      </f7-nav-title>
      <f7-nav-right><div class="navbar-empty"/></f7-nav-right>
    </f7-navbar>
    <f7-page class="info">
      <f7-block>
        <div v-if="showFortune" class="discount-fortune">
          <div class="discount-fortune-container">
            <div class="discount-fortune-title">Крутите и получайте призы!</div>
            <div :style="{ display: 'flex', flexDirection: 'row' }">
              <div class="discount-fortune-title">Попытки:</div>
              <div class="discount-fortune-counter">1</div>
            </div>
          </div>
          <img
            :src="require('../../images/fortune.svg').default"
            class="discount-fortune-img"
          />
          <primary-button class="info-submit-button" title="Крутить" />
        </div>

        <div :style="'padding-bottom: 20px'">
          <div
            v-for="promo in promos"
            :key="promo.id"
            :class="
              active === 3
                ? 'card demo-card-header-pic animated'
                : 'card demo-card-header-pic'
            "
          >
            <img
              :src="
                promo.files.length > 0
                  ? promo.files[0].url
                  : require('../../images/mainDiscount.svg').default
              "
              class="card-header"
            />
            <div class="card-content card-content-padding">
              <p class="card-description">{{ promo.description }}</p>
              <p class="card-date">
                {{ promo.timeSpending }}
              </p>
            </div>
          </div>
        </div>
      </f7-block>
    </f7-page>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import query from '../utils/axiosQuery'
import CONFIG from '../../../config'
import AppBar from '../components/appbar'
import PrimaryButton from '../components/primarybutton'

export default {
  components: {
    AppBar,
    PrimaryButton
  },

  data() {
    return {
      promos: [],
      CONFIG
    }
  },

  computed: {
    showFortune() {
      return this.modules.find((item) => item.systemName === 'Module Fortune')
    },
    ...mapState({
      active: (state) => state.activeRoute,
      modules: (state) => state.modules
    })
  },

  mounted() {
    query
      .get(`${CONFIG.API_URL}company/${CONFIG.COMPANY_ID}/promos`)
      .then((res) => {
        this.promos = res.data.promos
      })
  }
}
</script>
