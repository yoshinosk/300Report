<template>
  <div class="wrapper">
    <Message></Message>
    <Loading></Loading>
    <SidebarVue :routes="routes" :active="currentPath"></SidebarVue>
    <div class="container">
      <Transition name="layout" appear mode="out-in">
        <KeepAlive>
          <Component :is="currentView" :key="currentPath"></Component>
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import SidebarVue from "./Sidebar.vue";
import { useRouter } from "@/composables/router.js";
import Loading from "../Loading.vue";
import Message from "../Message.vue";

const { routes, currentView, currentPath } = useRouter();
</script>

<style lang="scss">
.wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
  .container {
    min-width: 500px;
    overflow: auto;
    flex-grow: 1;
    align-self: stretch;
    background-color: $color-p2;
    color: white;
    overflow: auto;
    padding: 20px;
    position: relative;
    .box {
      overflow: auto;
      margin: 20px;
      background-color: $color-p3;
      padding: 20px;
      border-radius: 5px;
      // position: absolute;
    }
  }
}

.layout-enter-active,
.layout-leave-active {
  transition: 0.2s;
}

.layout-enter-from,
.layout-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>