<script setup>
import LayoutVue from "./components/layout/Layout.vue";
</script>

<template>
  <LayoutVue></LayoutVue>
</template>

<style lang="scss">
#app {
  overflow: hidden;
}
* {
  padding: 0;
  margin: 0;
  font-family: "微软雅黑";
}
a {
  text-decoration: none;
  color: unset;
  &:hover,
  &:link,
  &:active,
  &:visited {
    color: unset;
  }
}
ul {
  list-style: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
