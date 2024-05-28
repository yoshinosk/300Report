<template>
  <li class="matchItem flex" :class="{ show }" @click="handleClickItem">
    <div class="result" :class="{
      win: matchRes == '胜利',
      lose: matchRes == '失败',
      flee: matchRes == '逃跑',
    }">
      {{ matchRes }}
    </div>
    <div class="head">
      <img class="icon" :src="getHeroIcon(role.HeroID)" @error="handleHeroError" />
    </div>
    <div class="info">
      <div class="item kda">
        <span class="name">KDA</span>
        <span class="value">{{
          `${role.KillPlayer}/${role.Death}/${role.Assist}`
        }}</span>
      </div>
      <div class="item">
        <span class="name">输出</span>
        <span class="rank" :class="{ mvp: rank_sd == 1 }">{{ rank_sd }}</span>
        <span class="value">{{ sd }}</span>
      </div>
      <div class="item">
        <span class="name">承伤</span>
        <span class="rank" :class="{ mvp: rank_td == 1 }">{{ rank_td }}</span>
        <span class="value">{{ td }}</span>
      </div>
    </div>
    <div class="info">
      <div class="item">
        <span class="name">参团</span>
        <span class="rank" :class="{ mvp: rank_team == 1 }">{{ rank_team }}</span>
        <span class="value">{{ teamRate }}</span>
      </div>
      <div class="item">
        <span class="name">补刀</span>
        <span class="value">{{ role.KillUnit }}</span>
      </div>
      <div class="item">
        <span class="name">推塔</span>
        <span class="value">{{ role.DestoryTower }}</span>
      </div>
    </div>
    <div class="eloBox flex-column">
      <div class="fv">{{ role.FV }}</div>
      <div class="score">
        <span class="error" v-if="showError">加载失败,点击重试</span>
        <div class="flex" v-else-if="score">
          <img class="value" :src="scoreIconMap[score]" />
          <span class="rank" :class="{ mvp: rank_score == 1 }">{{ rank_score }}</span>
        </div>
        <img class="loading" v-else src="@/assets/img/loading.gif" />
      </div>
    </div>

    <div class="right">
      <div class="row date flex">
        <div class="matchTime">
          <span class="iconfont icon-timer"></span>
          <span>{{ matchTime }}</span>
        </div>
        <div class="matchDate">
          <span>耗时：</span>
          <span>{{ matchDate }}</span>
        </div>
      </div>
      <div class="row flex">
        <div class="skill">
          <img class="item" v-for="(item, index) in playerSkill" :key="index" :src="item" />
        </div>
        <div class="equip flex">
          <img @error="handleEquipError" class="item" v-for="(item, index) in ep" :key="index" :src="item" />
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  getHeroIcon,
  matchResult,
  calcScore,
  scoreIconMap,
  getSkillIcon,
  getEquipIcon,
  playersInit
} from "@/assets/js/utils.js";
import { post } from "@/assets/js/request";
import { store } from "@/composables/store";
import { formatUsedTime, formatDate, toThousand } from "@/assets/js/tool";
const props = defineProps({
  match: Object,
  index: Number,
});

// 定义状态
const showError = ref(false),
  score = ref(""),
  show = ref(false),
  rank_sd = ref("-"),
  rank_td = ref("-"),
  rank_score = ref("-"),
  rank_team = ref("-"),
  teamRate = ref("-");

// 定义计算属性
const role = computed(() => props.match.Players[0]), // 角色信息
  matchRes = computed(() => matchResult[role.value.Result]), // 比赛结果
  sd = computed(() => {
    if (role.value.SD) return toThousand(
      role.value.SD.reduce(
        (prev, curr, index) => (index % 2 != 0 ? curr + prev : prev),
        0
      )
    )
    else return ''
  }), // 输出
  td = computed(() => toThousand(role.value.TD.at(-1))), // 承伤
  ep = computed(() =>
    role.value.Ep.filter((item, index) => index % 2 == 0).map((item) =>
      getEquipIcon(item)
    )
  ), // 装备
  matchDate = computed(() => formatUsedTime(props.match.UsedTime)), // 比赛时间
  matchTime = computed(() => formatDate(props.match.CreateTime * 1000)), // 比赛日期
  playerSkill = computed(() => [
    getSkillIcon(role.value.SummonerSkill1),
    getSkillIcon(role.value.SummonerSkill2),
  ]); // 召唤师技能

onMounted(() => {
  let index = props.index;
  let ms = (index - 8 * Math.floor(index / 8) + 1) * 100;
  setTimeout(() => {
    show.value = true;
  }, ms);
  init();
});

/**
 * @descript 获取当前对局详细数据
 */
async function getMatchInfo() {
  post("/api/battle/searchMatchinfo", {
    mtid: props.match.MTID,
  })
    .then((res) => {
      if (!res.success) {
        showError.value = true;
        return;
      }
      // store.matchInfoList.push(res.data);
      init(res.data);
    })
    .catch((err) => {
      showError.value = true;
    });
}



// 节点被点击
function handleClickItem() {
  if (store.setCurrentMatch(props.match.MTIDInt)) location.hash = "#/match";
  else store.msg = '暂无该对局数据';

}

/**
 * @description 初始化对局数据
 * @param {Object} data 该对局详细数据
 */
function init(data) {
  try {
    data =
      data ||
      store.matchInfoList.find((item) => item.MTID == props.match.MTID);
    if (!data) return getMatchInfo();
    let teammate = data.Players.filter((item) => item.Side == role.value.Side);

    // 计算玩家的评分
    let players = calcScore(teammate, store.heroType);
    playersInit(players)

    let myRole = players.find((item) => item.PlayerID == role.value.PlayerID);

    rank_score.value = myRole.ScoreRank;
    rank_sd.value = myRole.SDRank;
    rank_td.value = myRole.TDRank;
    rank_team.value = myRole.TeamRank;
    teamRate.value = myRole.TeamRate + "%";
    score.value = myRole.Score;

    store.matchInfoList.push(data);
  } catch (e) {
    store.msg = '对局数据初始化失败';
    console.log(e);
  }
}

</script>

<style lang="scss" scoped>
.show {
  opacity: 1 !important;
  transform: translateY(0px) !important;
}

.matchItem {
  border-radius: $radius;
  background-color: $color-p4;
  margin-bottom: 5px;
  overflow: hidden;
  opacity: 0;
  transition: 0.5s;
  transform: translateY(20px);
  cursor: pointer;

  &:hover {
    background-color: rgb(46, 47, 52);
  }

  .result {
    writing-mode: vertical-lr;
    color: white;
    padding: 10px 5px;
    align-self: stretch;
    text-align: center;
    letter-spacing: 5px;
  }

  .win {
    background-color: rgb(61, 115, 216);
  }

  .lose {
    background-color: rgb(216, 61, 61);
  }

  .mvp {
    background-color: red !important;
  }

  .rank {
    border-radius: 50%;
    background-color: rgb(125, 125, 125);
    color: white;
    font-size: 0.9rem;
    $size: 18px;
    height: $size;
    width: $size;
    line-height: $size;
    text-align: center;
    font-weight: bold;
    display: inline-block;
    margin-right: 3px;
  }

  .flee {
    background-color: rgb(248, 145, 27);
  }

  .head {
    position: relative;
    border-radius: 50%;
    padding: 5px;
    border: solid 3px white;
    margin: 10px;
    height: 50px;
    width: 50px;
    min-width: 50px;

    .icon {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }

  &>.info {
    display: flex;
    flex-direction: column;
    width: 140px;

    .kda {
      font-weight: bold;
    }

    .item {
      display: flex;
      align-items: center;

      .value {
        color: white;
        font-size: 16px;
        letter-spacing: 1px;
      }

      .name {
        color: rgb(185, 175, 175);
        font-size: 13px;
        margin-right: 10px;
      }
    }
  }

  .skill {
    margin-right: 10px;

    .item {
      height: 30px;
      width: 30px;
      border-radius: $radius;
      border: solid 1px white;
      margin-right: 5px;
    }
  }

  .equip {
    flex-wrap: nowrap;

    .item {
      height: 30px;
      width: 30px;
      border-radius: $radius;
      border: solid 1px white;
      margin-right: 5px;
    }
  }

  .eloBox {
    align-items: center;
    justify-content: center;

    .fv {
      font-weight: bold;
      font-size: 1rem;
    }

    .score {
      $icon-height: 20px;
      margin-top: 5px;

      .loading {
        height: $icon-height;
        width: $icon-height;
      }

      .value {
        height: $icon-height;
        width: auto;
      }
    }
  }

  &>.right {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    margin-left: 20px;

    .row {
      margin: 5px 0;
    }

    .date {
      justify-content: flex-end;
      font-size: 0.8rem;

      .matchTime {
        margin-right: 10px;
      }
    }
  }
}</style>