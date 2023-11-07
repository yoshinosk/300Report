<template>
  <Transition>
    <div class="message-modal" v-show="show">
      {{ store.msg }}
    </div>
  </Transition>
</template>

<script setup>
import { watch, ref, nextTick } from "vue";
import { store } from "../composables/store";

const show = ref(false);

let timer;

watch(
  () => store.msg,
  (msg) => {
    if (!msg) return;
    clearTimeout(timer);
    show.value = true;
    timer = setTimeout(() => {
      show.value = false;

      setTimeout(() => {
        store.msg = "";
      }, 500);
    }, 3000);
  }
);
</script>

<style lang="scss" scoped>
.message-modal {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
  padding: 20px;
  background-color: rgba($color: #000000, $alpha: 0.4);
  color: white;
  z-index: 1000;
}
</style>