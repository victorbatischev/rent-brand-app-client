<template>
  <div :class="active ? 'achievement-block' : 'achievement-block disable'">
    <img
      v-if="active && !present"
      :src="require('../../images/activeIcon.svg').default"
    />
    <img
      v-if="!active && !present"
      :src="require('../../images/disableIcon.svg').default"
    />
    <img
      v-if="present"
      :src="require('../../images/presentIcon.png').default"
    />
    <p :class="active ? 'achievement-text' : 'achievement-text disable'">
      {{ present ? presentNumber : number }}<br />
      {{
        present
          ? number === 0 || number === 1
            ? 'Подарок'
            : `Подарок x${number}`
          : title
      }}
    </p>
  </div>
</template>

<script>
import CONFIG from '../../../config'

export default {
  props: ['active', 'title', 'number', 'present', 'presentNumber'],
  data() {
    return { CONFIG }
  }
}
</script>
