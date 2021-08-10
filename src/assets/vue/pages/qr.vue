<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left
        ><f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link
      ></f7-nav-left>
      <f7-nav-title>
        QR-код
      </f7-nav-title>
      <f7-nav-right><div class="navbar-empty"/></f7-nav-right>
    </f7-navbar>
    <f7-block
      class="loyal-preloader-container"
      :style="'flex-direction: column'"
    >
      <div :class="'loyalty-qrcode'">
        <p class="loyalty-qrcode-header">
          Ваш персональный
          <span class="loyalty-qrcode-header-primary">QR-код</span>
        </p>
      </div>
      <vue-qrcode
        :value="JSON.stringify({ userId })"
        :options="{ width: 170 }"
        :style="'border-radius: 10px'"
      />

      <div :class="'loyalty-qrcode'">
        <p class="loyalty-qrcode-header">
          Покажите его нашему сотруднику, чтобы зафиксировать визит
        </p>
      </div>
    </f7-block>
  </f7-page>
</template>

<script>
import AppBar from '../components/appbar'
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {
    AppBar,
    VueQrcode
  },
  props: ['userId']
}
</script>
