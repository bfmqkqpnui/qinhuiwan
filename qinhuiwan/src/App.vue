<template>
  <div id="app">
    <transition :name="slide">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slide: ''
    }
  },
  mounted() {
    Vue.nextTick(() => {
      setTimeout(() => {
        this.slide = 'slide'
      }, 800)
    });
  }
}
</script>
