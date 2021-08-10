<template>
  <div @click="handleClick" class="loyalty-info">
    <div class="loyalty-info-header">
      <div v-if="show">
        <p class="loyalty-info-header-balance">Текущий баланс</p>
        <p class="loyalty-info-header-summ">{{ summ }} ₽</p>
      </div>
      <div @click="openQrCode">
        <vue-qrcode
          :value="JSON.stringify({ userId })"
          :options="{ width: 53 }"
          :style="'border-radius: 10px'"
        />
      </div>
    </div>

    <div v-if="show" class="loyalty-info-body">
      <div class="loyalty-info-body-head">
        <p class="loyalty-info-body-text">
          Ваша персональная скидка
        </p>
        <p class="loyalty-info-body-percents">{{ discount || 0 }}%</p>
      </div>

      <progress-bar :now="now" :full="full" />

      <div class="loyalty-info-header">
        <p class="loyalty-info-body-level">Уровень {{ level }}</p>
        <p class="loyalty-info-body-info">{{ now }}/{{ full }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from './progress'
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: { ProgressBar, VueQrcode },
  props: ['summ', 'level', 'discount', 'now', 'full', 'userId', 'show'],
  methods: {
    handleClick() {
      this.$emit('selected')
    },
    openQrCode() {
      this.$f7router.navigate('/qr', {
        props: {
          userId: this.userId
        }
      })
    }
  }
}
</script>
