<template>
  <button class="primary-button" :type="type">
    {{ title }}
  </button>
</template>
<script>
export default { props: ['type', 'title'] }
</script>
