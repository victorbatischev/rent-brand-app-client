<template>
  <div class="bottom-tabs">
    <a href="#" @click="setActiveRoute(1)" data-tab="#tab-1" class="tab-link">
      <div :class="active === 1 ? 'bottom-tab-item active' : 'bottom-tab-item'">
        <img
          v-if="active === 1"
          :src="require('../../images/cardActive.svg').default"
        />
        <img v-else :src="require('../../images/card.svg').default" />
        <p v-if="active === 1" class="bottom-tab-route-name">
          Карта
        </p>
      </div>
    </a>

    <a href="#" @click="setActiveRoute(2)" data-tab="#tab-2" class="tab-link">
      <div :class="active === 2 ? 'bottom-tab-item active' : 'bottom-tab-item'">
        <img
          v-if="active === 2"
          :src="require('../../images/menuActive.svg').default"
        />
        <img v-else :src="require('../../images/menu.svg').default" />
        <p v-if="active === 2" class="bottom-tab-route-name">
          Меню
        </p>
      </div>
    </a>

    <a href="#" @click="setActiveRoute(3)" data-tab="#tab-3" class="tab-link">
      <div :class="active === 3 ? 'bottom-tab-item active' : 'bottom-tab-item'">
        <img
          v-if="active === 3"
          :src="require('../../images/discountActive.svg').default"
        />
        <img v-else :src="require('../../images/discount.svg').default" />
        <p v-if="active === 3" class="bottom-tab-route-name">
          Акции
        </p>
      </div>
    </a>

    <a href="#" @click="setActiveRoute(4)" data-tab="#tab-4" class="tab-link">
      <div :class="active === 4 ? 'bottom-tab-item active' : 'bottom-tab-item'">
        <img
          v-if="active === 4"
          :src="require('../../images/accountActive.svg').default"
        />
        <img v-else :src="require('../../images/account.svg').default" />
        <p v-if="active === 4" class="bottom-tab-route-name">
          Аккаунт
        </p>
      </div>
    </a>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      active: (state) => state.activeRoute
    })
  },
  methods: {
    ...mapActions(['setActiveRoute'])
  }
}
</script>
