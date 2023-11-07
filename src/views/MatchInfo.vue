<template>
  <div class="match-info box">
    <!-- 对局信息 -->
    <div class="top flex">
      <span
        class="result"
        :class="{ win: result == '胜', lose: result != '胜' }"
        >{{ result }}</span
      >
      <img class="heroIcon" :src="heroIcon" @error="handleHeroError" />
      <div class="infoBox">
        <span class="title">模式</span>
        <span class="value">{{ store.currentMatchType }}</span>
      </div>
      <div class="infoBox">
        <span class="title">日期</span>
        <span class="value">{{ matchDate }}</span>
      </div>
      <div class="infoBox">
        <span class="title">时长</span>
        <span class="value">{{ matchUseTime }}</span>
      </div>
    </div>
    <div class="container">
      <!-- 玩家列表 -->
      <Players :players="players"></Players>
      <!-- 玩家数据 -->
      <div class="playerData">
        <!-- 选择玩家 -->
        <div class="playerSelect">
          <ul class="side flex" v-for="(side, index) in sideArr" :key="index">
            <span class="sideName">{{ index == 0 ? "我方" : "敌方" }}</span>
            <li
              class="item"
              v-for="item in side"
              :key="item.PlayerID"
              @click="curPlayer = item"
              :class="{
                active: curPlayer && item.PlayerID == curPlayer.PlayerID,
              }"
            >
              <img
                class="icon"
                :src="getHeroIcon(item.HeroID)"
                @error="handleHeroError"
              />
            </li>
          </ul>
        </div>
        <div class="curPlayer flex" v-if="curPlayer">
          <img
            class="icon"
            :src="getHeroIcon(curPlayer.HeroID)"
            @error="handleHeroError"
          />
          <span class="name">{{ curPlayer.RN }}</span>
        </div>
        <!-- 技能加点 -->
        <div class="skill" v-if="curPlayer">
          <h4 class="title">技能</h4>
          <ul class="list flex flex-wrap">
            <li
              class="item"
              v-for="(skill, index) in curPlayer.LUpSO"
              :key="index"
            >
              <img
                class="icon"
                :src="getHeroSkillIcon(skill)"
                @error="handleHeroError"
              />
              <span class="lv">{{ index + 1 }}</span>
            </li>
          </ul>
        </div>
        <!-- 击杀 -->
        <h4 class="title">击杀统计</h4>
        <KillChart :match="match" :player="curPlayer"></KillChart>
        <!-- 出装 -->
        <div class="equip" v-if="curPlayer">
          <h4 class="title">出装</h4>
          <ul class="list">
            <li class="item flex head">
              <span class="date">时间</span>
              <span class="ep">装备</span>
            </li>
            <li
              class="item flex"
              v-for="(item, index) in curPlayer.Equip"
              :key="index"
              @error="handleHeroError"
            >
              <span class="date">{{ item.date }}</span>
              <img
                class="icon"
                v-for="(equip, i1) in item.equip"
                :key="i1"
                :src="getEquipIcon(equip)"
                @error="handleEquipError"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { store } from "../composables/store";
import Players from "../components/Players.vue";
import {
  getHeroIcon,
  getHeroSkillIcon,
  getEquip,
  getEquipIcon,
  playersInit,
  calcScore,
} from "../assets/js/utils";
import { formatUsedTime, formatDate } from "@/assets/js/tool";
import KillChart from "../components/KillChart.vue";

const match = computed(() => store.currentMatch),
  players = computed(() => (match.value ? match.value.Players : [])), // 全部玩家列表
  myRole = computed(() =>
    players.value.find((player) => player.PlayerID == store.role.RoleID)
  ), // 当前玩家
  heroIcon = computed(() =>
    myRole.value ? getHeroIcon(myRole.value.HeroID) : ""
  ), // 当前玩家使用的英雄
  matchDate = computed(() =>
    match.value ? formatDate(match.value.CreateTime * 1000) : "-"
  ), // 比赛日期
  matchUseTime = computed(() =>
    match.value ? formatUsedTime(match.value.UsedTime) : "-"
  ), // 比赛用时
  result = computed(() =>
    !myRole.value
      ? ""
      : myRole.value.Result == 1
      ? "胜"
      : myRole.value.Result == 2
      ? "败"
      : "逃"
  ), // 当前玩家的的比赛结果
  sideArr = computed(() =>
    myRole.value
      ? [
          players.value.filter((player) => player.Side == myRole.value.Side),
          players.value.filter((player) => player.Side != myRole.value.Side),
        ]
      : [[], []]
  ), // 分边玩家列表  0为我方 1为敌方
  curPlayer = ref(null); // 选中的玩家

watch(match, () => {
  calcScore(sideArr.value[1], store.heroType);
  playersInit(players.value);
  curPlayer.value = myRole.value;
});
</script>

<style lang="scss" scoped>
.match-info {
  overflow: auto;
  & > .top {
    border-radius: $radius;
    // background-color: $color-p4;
    padding: 5px;
    border-bottom: 2px white solid;
    margin-bottom: 20px;
    justify-content: center;
    .result {
      writing-mode: vertical-rl;
      color: white;
      border-radius: 50%;
      padding: 5px;
      margin-right: 10px;
      font-size: 0.9rem;
    }
    .win {
      background-color: green;
    }
    .lose {
      background-color: red;
    }
    .heroIcon {
      border-radius: 50%;
      border: 2px solid white;
      height: 50px;
      width: auto;
      margin-right: 10px;
    }
    .infoBox {
      display: flex;
      flex-direction: column;
      color: white;
      text-align: center;
      position: relative;
      padding: 0 30px;
      &::before {
        position: absolute;
        right: -1px;
        top: 50%;
        transform: translateY(-50%);
        height: 60%;
        width: 1px;
        background-color: rgba($color: #fff, $alpha: 0.3);
        border-radius: $radius;
        content: " ";
      }
      &:last-child {
        &::before {
          display: none;
        }
      }
      .title {
        font-size: 0.8rem;
      }
      .value {
        font-weight: bold;
      }
    }
  }
}

.container {
  display: flex;
  align-items: flex-start;
}

.playerData {
  flex-grow: 1;
  padding: 10px;
  .title {
    text-align: center;
    position: relative;
    margin: 20px 0;
    &::before,
    &::after {
      position: absolute;
      height: 2px;
      width: 35%;
      top: 50%;
      border-radius: 5px;
      background-color: white;
      content: " ";
      transform: translateY(-50%);
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }

  .skill {
    .list {
      .item {
        height: 40px;
        width: 40px;
        position: relative;
        border-radius: $radius;
        overflow: hidden;
        border: 1px white solid;
        margin: 0 5px 5px 0;
        .icon {
          height: 100%;
          width: 100%;
        }
        .lv {
          background-color: rgba($color: #000000, $alpha: 0.5);
          border-radius: $radius;
          position: absolute;
          padding: 5px;
          right: 1px;
          bottom: 1px;
          color: white;
          font-size: 0.8rem;
        }
      }
    }
  }

  .equip {
    .list {
      .head {
        padding: 5px;
        margin-bottom: 10px !important;
        // border-bottom: 1px solid white;
      }
      .item {
        margin-bottom: 5px;
        .date {
          margin-right: 5px;
          width: 40px;
          text-align: center;
        }
        .icon {
          border-radius: $radius;
          height: 30px;
          width: 30px;
          margin-right: 5px;
          border: 1px solid white;
        }
      }
    }
  }
}

.curPlayer {
  justify-content: center;
  margin-top: 20px;
  .icon {
    border-radius: 50%;
    height: 40px;
    width: 40px;
    border: 3px solid white;
    margin-right: 10px;
  }
  .name {
    font-size: 110%;
  }
}
.playerSelect {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  .side {
    padding: 5px;
    margin-bottom: 5px;
    background-color: $color-p4;
    border-radius: $radius;
    .sideName {
      font-size: 0.8rem;
      writing-mode: vertical-lr;
      display: inline-block;
      overflow: unset;
      white-space: unset;
      padding: 0 5px;
    }
    .item {
      cursor: pointer;

      overflow: hidden;
      .icon {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        border: 2px solid white;
      }
    }
    .active {
      .icon {
        border: 2px solid rgb(50, 154, 233) !important;
      }
    }
  }
}
</style>