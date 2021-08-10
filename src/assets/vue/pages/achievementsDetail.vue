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

    <div class="achievement-detail-header-container">
      <p class="achievement-detail-header-text">УРОВЕНЬ</p>
      <p class="achievement-detail-header-text">КЭШБЭК</p>
    </div>

    <div class="achievement-detail-info-container">
      <div v-for="(item, index) in data.allGrades" :key="index">
        <div class="achievement-detail-info-block">
          <div class="achievement-detail">
            <img
              class="achievement-active-svg"
              v-if="item.layer <= data.nowValue && !data.noLevel"
              :src="require('../../images/activeIcon.svg').default"
            />
            <img
              v-if="item.layer > data.nowValue || data.noLevel"
              :src="require('../../images/disableIcon.svg').default"
            />
            <div
              :class="
                item.layer > data.nowValue || data.noLevel
                  ? 'achievement-detail-info'
                  : 'achievement-detail-info active'
              "
            >
              <p class="achievement-detail-level">
                {{ item.name }}
              </p>

              <p
                v-if="item.layer > data.nowValue || data.noLevel"
                class="achievement-detail-points"
              >
                От {{ item.layer }} р.
              </p>
            </div>
          </div>

          <p class="achievement-detail-discount">{{ item.value }}%</p>
        </div>

        <div
          v-if="index !== data.allGrades.length - 1"
          class="achievement-statusbar-container"
        >
          <div class="achievement-statusbar disable">
            <div
              :style="
                index < data.nowGrade
                  ? 'height: 100%'
                  : index === data.nowGrade
                  ? 'height: ' +
                    (parseInt(data.nowValue) / parseInt(data.fullLayer)) * 100 +
                    '%'
                  : 'height: 0%'
              "
              class="achievement-statusbar-inner disable"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="data.desc" class="achievement-detail-footer">
      <div class="achievement-detail-icon-container">
        <f7-icon class="achievement-detail-icon" material="info" />
      </div>
      <p class="achievement-detail-text">
        {{ data.desc }}
      </p>
    </div>
  </div>
</template>

<script>
import CONFIG from '../../../config'

export default {
  props: ['data'],
  data() {
    return {
      CONFIG,
      listener: null
    }
  },
  created() {
    this.data.allGrades.map((item, idx) => {
      if (
        item.layer < this.data.nowValue &&
        this.data.allGrades[idx + 1].layer > this.data.nowValue
      ) {
        return (this.data.nowGrade = idx)
      }
    })
  },
  mounted() {
    this.listener = document.addEventListener(
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
