<template>
  <f7-app :params="f7params">
    <f7-view v-if="!user" url="/login" :main="true" class="ios-edges" />
    <f7-view v-else url="/main" :main="true" class="ios-edges" />
  </f7-app>
</template>

<script>
import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'
import AppBar from './assets/vue/components/appbar'

// Yandex maps
const settings = {
  apiKey: '4e4bf4c4-869d-45a0-b502-ddcc0cfd0585',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}

Vue.use(YmapPlugin, settings)

// Masked input
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

// Directives
Vue.directive('focus', {
  inserted: function(el, data) {
    if (data.value === 'true') {
      el.focus()
    }
  }
})

// Import Routes...
import { f7App, f7Panel, f7View, f7Statusbar } from 'framework7-vue'
import routes from './routes.js'

// Auth
import { mapState, mapActions } from 'vuex'
import PreLoader from 'assets/vue/components/preloader'

let theme = 'auto'
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0]
}

export default {
  components: {
    AppBar,
    f7App,
    f7Panel,
    f7View,
    f7Statusbar,
    PreLoader
  },
  data() {
    return {
      f7params: {
        theme,
        routes,
        id: 'io.framework7.testapp'
      }
    }
  },
  created() {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    token && userId
      ? this.userLogged({ token, userId })
      : this.userLogged(false)
  },
  computed: {
    ...mapState({
      user: (state) => state.user
    })
  },
  watch: {
    user() {}
  },
  methods: {
    ...mapActions(['userLogged'])
  }
}
</script>
