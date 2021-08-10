<template>
  <div class="page">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-f7="chevron_left" @click="getBack"></f7-link>
      </f7-nav-left>
      <f7-nav-title>
        {{ CONFIG.COMPANY_NAME }}
      </f7-nav-title>
      <f7-nav-right><div class="navbar-empty"/></f7-nav-right>
    </f7-navbar>

    <div class="page-padding-appbar" />

    <div class="loyal-detail-header-container">
      <p class="loyal-detail-header-text">СОВЕРШЕНО ПОКУПОК</p>
      <p class="loyal-detail-header-text">ДО ПОДАРКА ОСТАЛОСЬ</p>
    </div>

    <div class="loyal-detail-presents-container">
      <p class="loyal-detail-presents-text">
        {{ data.nowValue || 0 }}
        {{
          Utils.declOfNum(Math.ceil(data.nowValue || 0), [
            'покупка',
            'покупки',
            'покупок'
          ])
        }}
      </p>
      <p class="loyal-detail-presents-text">
        {{ data.maxValue || 0 }}
        {{
          Utils.declOfNum(Math.ceil(data.maxValue || 0), [
            'покупка',
            'покупки',
            'покупок'
          ])
        }}
      </p>
    </div>

    <div class="loyal-detail-progress-container">
      <div class="loyal-detail-progress-block">
        <div class="loyal-detail-progress">
          <div
            :style="
              'width: ' +
                (parseInt(data.nowValue) / parseInt(data.maxValue + 1)) * 100 +
                '%'
            "
            class="loyal-detail-progress active"
          />
        </div>
        <div class="loyal-detail-progress-present">
          <img
            :src="require('../../images/presentIcon.png').default"
            class="loyal-detail-present"
          />
        </div>
      </div>

      <p class="loyal-detail-indicator">
        {{ data.nowValue || 0 }}/{{ data.maxValue + 1 || 0 }}
      </p>
    </div>

    <div v-if="data.desc" class="loyal-detail-footer">
      <div class="loyal-detail-icon-container">
        <f7-icon class="loyal-detail-icon" material="info" />
      </div>
      <p class="loyal-detail-text">
        {{ data.desc }}
      </p>
    </div>
  </div>
</template>

<script>
import CONFIG from '../../../config'
import * as Utils from 'utils'

export default {
  props: ['data'],

  data() {
    return {
      CONFIG,
      Utils,
      listener: null
    }
  },

  mounted() {
    document.addEventListener(
      'backbutton',
      (e) => {
        e.preventDefault()
        this.$f7router.back()
      },
      { once: true }
    )
  },

  methods: {
    getBack() {
      this.$f7router.back()
    }
  }
}
</script>
