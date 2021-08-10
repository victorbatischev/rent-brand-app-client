<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link>
      </f7-nav-left>
      <f7-nav-title>
        Информация
      </f7-nav-title>
      <f7-nav-right><div class="navbar-empty"/></f7-nav-right>
    </f7-navbar>

    <f7-block>
      <div class="info-header-container">
        <p class="info-header-text">{{ CONFIG.COMPANY_NAME }}</p>
        <p v-if="description" class="info-header-desc">
          {{ description }}
        </p>
      </div>

      <div class="info-company-container">
        <div v-for="(item, index) in places" :key="index">
          <div class="company-info-row">
            <img
              :src="require('../../images/locationOutline.svg').default"
              class="company-info-row-icon"
            />
            <div class="company-info-row-values">
              <p class="company-info-row-value external">
                {{ item.address || 'Не указан' }}
              </p>
            </div>
          </div>
          <div class="company-info-row">
            <img
              :src="require('../../images/clockOutline.svg').default"
              class="company-info-row-icon"
            />
            <div class="company-info-row-values">
              <p class="company-info-row-value external">
                {{ item.workMode || 'Не указан' }}
              </p>
            </div>
          </div>
        </div>
        <info-company-row
          v-if="call"
          iconType="material"
          :tel="true"
          :value="call"
        />
        <info-company-row
          v-if="site"
          iconType="material"
          :browser="true"
          :value="site"
        />
      </div>

      <div class="info-company-social">
        <f7-link v-if="vkUrl" :href="vkUrl" external>
          <img :src="vk.default" class="info-company-social-icon" />
        </f7-link>
        <f7-link v-if="fbUrl" :href="fbUrl" external>
          <img :src="fb.default" class="info-company-social-icon" />
        </f7-link>
        <f7-link v-if="instUrl" :href="instUrl" external>
          <img :src="inst.default" class="info-company-social-icon" />
        </f7-link>
        <f7-link v-if="ytUrl" :href="ytUrl" external>
          <img :src="youtube.default" class="info-company-social-icon" />
        </f7-link>
      </div>

      <div class="info-company-map">
        <yandex-map class="info-map" :coords="coords" zoom="2" show-all-markers>
          <ymap-marker
            v-for="(item, index) in markers"
            :key="index"
            :coords="item"
            marker-id="123"
          />
        </yandex-map>
      </div>
    </f7-block>
  </f7-page>
</template>

<script>
import CONFIG from '../../../config'
import InfoCompanyRow from '../components/companyinforow'
import { loadYmap } from 'vue-yandex-maps'
import axios from 'axios'
import query from '../utils/axiosQuery'
import AppBar from '../components/appbar'

export default {
  components: {
    InfoCompanyRow,
    AppBar
  },

  data() {
    return {
      CONFIG,
      places: [],
      call: null,
      site: null,
      vkUrl: null,
      fbUrl: null,
      instUrl: null,
      ytUrl: null,
      description: null,
      vk: require('../../images/vkontakte.svg'),
      fb: require('../../images/facebook.svg'),
      inst: require('../../images/instagram.svg'),
      youtube: require('../../images/youtube.svg'),
      coords: [0, 0],
      markers: []
    }
  },

  mounted() {
    query
      .get(`${CONFIG.API_URL}company/${CONFIG.COMPANY_ID}`)
      .then(async (res) => {
        this.call = res.data.phone ? this.parseData(res.data.phone) : null
        this.site = res.data.url ? this.parseData(res.data.url) : null
        this.vkUrl = res.data.vk || null
        this.fbUrl = res.data.fb || null
        this.instUrl = res.data.ig || null
        this.ytUrl = res.data.youtube || null
        this.description = res.data.description
      })

    query
      .get(`${CONFIG.API_URL}company/${CONFIG.COMPANY_ID}/addresses`)
      .then(async (res) => {
        this.places = res.data.addresses
        await this.getGeoData(this.places)
      })
  },

  async created() {
    try {
      await loadYmap()
    } catch (e) {
      console.log(e)
    }
  },

  methods: {
    parseData(data) {
      return data.split(';')
    },

    async getGeoData(places) {
      places.map((item, idx) => {
        axios
          .get(
            'https://geocode-maps.yandex.ru/1.x/?apikey=' +
              CONFIG.YANDEX_MAP_API_KEY +
              '&format=json&geocode=' +
              item.address
          )
          .then(async (res) => {
            const data =
              res.data.response.GeoObjectCollection.featureMember[0].GeoObject
                .Point.pos

            console.log(data)

            const coords = data.split(' ')

            const lat = parseFloat(coords[0])
            const long = parseFloat(coords[1])
            this.markers.push([long, lat])
            if (idx === 0) {
              this.coords = [long, lat]
            }
          })
      })
    }
  }
}
</script>
