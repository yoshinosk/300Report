<template>
  <ul class="matchType">
    <li
      class="item"
      v-for="item in matchType"
      :key="item.id"
      :class="{ active: item.MID == curMID }"
      @click="handleClick(item)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";
import { matchType } from "@/assets/js/utils.js";
const emit = defineEmits(['change']);

const curMID = ref(254);

function handleClick(item){
    curMID.value = item.MID;
    emit('change',item);
}
</script>

<style lang="scss" scoped>
.matchType {
  margin: 10px 0 20px 0;
  background-color: rgb(51, 53, 59);
  display: flex;
  justify-content: space-between;
  border-radius: $radius;
  .item {
    padding: 10px;
    white-space: nowrap;
    transition: 0.3s;
    font-size: 14px;
    flex-grow: 1;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: rgb(39, 40, 43);
    }
  }
  .active {
    background-color: rgb(39, 40, 43);
  }
}
</style>