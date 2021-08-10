<template>
  <f7-navbar>
    <f7-nav-title>
      {{ config.COMPANY_NAME }}
    </f7-nav-title>
  </f7-navbar>
</template>

<script>
import CONFIG from '../../../config'

export default {
  data() {
    return { config: CONFIG, appbar_svg: require('../../images/appbar.png') }
  }
}
</script>
