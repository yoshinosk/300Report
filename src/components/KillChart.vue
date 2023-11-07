<template>
  <div class="killChart">
    <ul class="list">
      <li class="item flex" v-for="(item, index) in killTrees" :key="index">
        <template v-if="item.killed == 1">
          <span class="time">{{ formatUsedTime(item.time) }}</span>
          <span class="result">击杀</span>
          <img
            class="icon"
            :src="getPlayerIcon(item.player)"
            @error="handleHeroError"
          />
        </template>
        <template v-else>
          <span class="time">{{ formatUsedTime(item.time) }}</span>
          <span class="result">被</span>
          <img
            class="icon"
            :src="getPlayerIcon(item.player)"
            @error="handleHeroError"
          />
          <span class="result">击杀</span>
        </template>
      </li>
    </ul>
    <ul class="count">
      <li class="item flex" v-for="(item, index) in killCount.killed" :key="index">
        <span class="result">击杀</span>
        <img
          class="icon"
          :src="getPlayerIcon(item.player)"
          @error="handleHeroError"
          alt=""
        />
        <span class="result">{{ item.count }}次</span>
      </li>
      <hr />
      <li class="item flex" v-for="(item, index) in killCount.beKilled" :key="index">
        <span class="result">被</span>
        <img
          class="icon"
          :src="getPlayerIcon(item.player)"
          @error="handleHeroError"
          alt=""
        />
        <span class="result">击杀{{ item.count }}次</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { watch, ref, computed } from "vue";
import { getHeroIcon, errorIcon } from "../assets/js/utils";
import { formatUsedTime } from "../assets/js/tool";

const props = defineProps(["match", "player"]);

const killTrees = ref([]), // 击杀列表
  playersMap = ref({}), // 玩家列表 以PlayerID为key
  killCount = ref({
    killed: [],
    beKilled: [],
  });

let list = [], // 未处理的数据数组 格式：2037:1074307499:1610917399，时间:玩家:被击杀的玩家
    timer = null;

const curPlayer = computed(() => (props.player ? props.player.PlayerID : "")), // 当前选中玩家ID
  getPlayerIcon = computed(() => (player) => {
    if(playersMap.value[player]) return getHeroIcon(playersMap.value[player].HeroID)
    else return errorIcon.hero;
  });


watch(curPlayer, () => {
  killTreeInit();
  console.log('killTreeInit');
});

function killTreeInit(){
      // 计算击杀列表
  killTrees.value.splice(0);
  killCount.value.killed.splice(0);
  killCount.value.beKilled.splice(0);
  for (let item of list) {
    let data = item.split(":");
    let player1 = data[1],
      player2 = data[2],
      time = data[0];
    if (player1 == curPlayer.value) {
      killTrees.value.push({
        time,
        player: player2,
        killed: 1, // 1 击杀该玩家 2 被该玩家击杀
      });
    } else if (player2 == curPlayer.value) {
      killTrees.value.push({
        time,
        player: player1,
        killed: 2, // 1 击杀该玩家 2 被该玩家击杀
      });
    }
  }

  killTrees.value.forEach((item) => {
    if (item.killed == 1) {
      let data = killCount.value.killed.find((p) => p.player == item.player);
      if (data) data.count++;
      else killCount.value.killed.push({ player: item.player, count: 1 });
    } else {
      let data = killCount.value.beKilled.find((p) => p.player == item.player);
      if (data) data.count++;
      else killCount.value.beKilled.push({ player: item.player, count: 1 });
    }
  });
}

watch(
  () => props.match,
  (val) => {
    if (!val || !val.KillTrees) return;
    // 分割数据
    list = val.KillTrees.split(";"); // 格式：2037:1074307499:1610917399，时间:玩家:被击杀的玩家
    playersMap.value = {};
    props.match.Players.forEach((item) => {
      playersMap.value[item.PlayerID] = item;
    });
    killTreeInit();
  }
);
</script>

<style lang="scss" scoped>
.icon {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin: 0 10px;
  border: 1px solid white;
}
.killChart {
  font-size: 0.8rem;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  .list {
    .item {
      margin-bottom: 2px;

      .time {
        width: 100px;
      }
    }
  }
}

.count {
  hr{
    margin: 10px 0;
  }
  .item {
    margin-bottom: 5px;
  }
}
</style>