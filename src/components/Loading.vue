<template>
  <Teleport to="body">
    <Transition>
      <div class="loading-mask" v-show="store.loading">
        <div class="loading">加载中···</div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { store } from "../composables/store";
</script>

<style lang="scss" scoped>
.loading-mask {
  z-index: 999;
  position: fixed;
  top: 0;
  background-color: rgba($color: #000, $alpha: 0.1);
  height: 100vh;
  width: 100vw;
  .loading {
    border-radius: 5px;
    padding: 20px;
    background-color: rgba($color: #000, $alpha: 0.5);
    color: white;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
}

</style>