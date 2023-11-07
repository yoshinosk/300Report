<template>
  <div class="players">
    <div class="iconTips flex">
      <div class="item">
        <span class="iconfont icon-sword"></span>
        <span class="desc">输出</span>
      </div>
      <div class="item">
        <span class="iconfont icon-shield"></span>
        <span class="desc">承伤</span>
      </div>
      <div class="item">
        <span class="iconfont icon-sword-line"></span>
        <span class="desc">参团率</span>
      </div>
      <div class="item">
        <span class="iconfont icon-money"></span>
        <span class="desc">经济</span>
      </div>
      <div class="item">
        <span class="iconfont icon-gaoguai"></span>
        <span class="desc">补兵</span>
      </div>
      <div class="item">
        <span class="iconfont icon-tower"></span>
        <span class="desc">推塔</span>
      </div>
      <div class="item">
        <span class="iconfont icon-bianzhuangbeifen"></span>
        <span class="desc">插眼</span>
      </div>
    </div>
    <div
      v-for="(side, index) in sideArr"
      :key="index"
      :class="`side side${index + 1}`"
    >
      <!-- Side信息 -->
      <div class="sideInfo flex">
        <div
          :class="`result ${getSideResult(side.value) == 1 ? 'win' : 'lose'}`"
        >
          {{ index == 0 ? "我方" : "敌方"
          }}{{ getSideResult(side.value) == 1 ? "胜" : "败" }}
        </div>
        <div class="infoBox">
          <span class="title iconfont icon-sword"></span>
          <span class="value">{{
            `${sideData[index].killCount}/${sideData[index].assistCount}/${sideData[index].deathCount}`
          }}</span>
        </div>
        <div class="infoBox">
          <span class="title iconfont icon-money"></span>
          <span class="value">{{ sideData[index].moneyCount }}</span>
        </div>
        <div class="infoBox">
          <span class="title iconfont icon-tower"></span>
          <span class="value">{{ sideData[index].dTowerCount }}</span>
        </div>
        <div class="infoBox">
          <span class="title">平均经济</span>
          <span class="value">{{ sideData[index].avgMoney }}</span>
        </div>
        <div class="infoBox">
          <span class="title">平均竞技力</span>
          <span class="value">{{ sideData[index].avgFV }}</span>
        </div>
      </div>
      <!-- 玩家列表 -->
      <div class="item flex" v-for="item in side.value" :key="item.PlayerID">
        <div class="heroIcon">
          <!-- <span class="playerLv">{{ item.SummonerLevel }}</span> -->
          <span class="level">{{ item.HeroLv }}</span>
          <img
            class="icon"
            :src="getHeroIcon(item.HeroID)"
            @error="handleHeroError"
          />
        </div>
        <div class="playerInfo flex-column">
          <div class="info flex">
            <span class="playerName">{{ `${item.RN}` }}</span>
            <div class="playerTag flex">
              <div class="tag">
                <span class="title">等级</span>
                <span class="value">{{ item.SummonerLevel }}</span>
              </div>
              <div class="tag">
                <span class="title">竞技力</span>
                <span class="value">{{ item.FV }}</span>
              </div>
              <div class="tag">
                <span class="title">团分</span>
                <span class="value">{{ item.Elo }}</span>
              </div>
              <div class="tag">
                <span class="title">胜率</span>
                <span class="value">{{ getPlayerMWRate(item) }}</span>
              </div>
              <div class="tag">
                <!-- <span class="title">大区</span> -->
                <span class="value">{{ getGuidName(item.Guid) }}</span>
              </div>
              
            </div>
          </div>
          <div class="kda flex">
            <span class="tips">KDA</span>
            <span class="kdaV">{{
              `${item.KillPlayer}/${item.Death}/${item.Assist}`
            }}</span>
            <img class="score" :src="scoreIconMap[item.Score]" />
            <!-- 玩家数据 -->
            <div class="dataRow flex">
              <!-- 输出 -->
              <div class="dataItem">
                <span class="iconfont icon-sword"></span>
                <span>{{ toThousand(item.Damage) }}</span>
              </div>
              <!-- 参团率 -->
              <div class="dataItem">
                <span class="iconfont icon-sword-line"></span>
                <span>{{ item.TeamRate + "%" }}</span>
              </div>
              <!-- 补兵 -->
              <div class="dataItem">
                <span class="iconfont icon-gaoguai"></span>
                <span>{{ item.KillUnit }}</span>
              </div>
              <!-- 承伤 -->
              <div class="dataItem">
                <span class="iconfont icon-shield"></span>
                <span>{{ toThousand(item.Hurt) }}</span>
              </div>
              <!-- 经济 -->
              <div class="dataItem">
                <span class="iconfont icon-money"></span>
                <span>{{ toThousand(item.TotalMoney) }}</span>
              </div>
              <!-- 插眼 -->
              <div class="dataItem">
                <span class="iconfont icon-bianzhuangbeifen"></span>
                <span>{{ item.PutEyes }}</span>
              </div>
              <!-- 推塔 -->
              <div class="dataItem">
                <span class="iconfont icon-tower"></span>
                <span>{{ item.DestoryTower }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="skill flex">
          <img class="icon" :src="getSkillIcon(item.SummonerSkill1)" />
          <img class="icon" :src="getSkillIcon(item.SummonerSkill2)" />
        </div>
        <div class="equip flex">
          <img
            class="icon"
            v-for="(ep, epi) in getEquip(item.Ep)"
            :key="epi"
            :src="ep"
            @error="handleEquipError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { store } from "../composables/store"; 
import { toThousand } from "../assets/js/tool";
import {
  getHeroIcon,
  scoreIconMap,
  getSkillIcon,
  getEquip,
  getGuidName
} from "../assets/js/utils";

const props = defineProps({
  players: Array,
});

const myRole = computed(() =>
    props.players.find((player) => player.PlayerID == store.role.RoleID)
  ),
  side1 = computed(() =>
    myRole.value
      ? props.players.filter((player) => player.Side == myRole.value.Side)
      : []
  ), // 我方
  side2 = computed(() =>
    myRole.value
      ? props.players.filter((player) => player.Side != myRole.value.Side)
      : []
  ), // 敌方
  sideArr = computed(()=>[side1,side2]),
  sideData = computed(() => [
    getSideData(side1.value),
    getSideData(side2.value),
  ]),
  getPlayerMWRate = computed(
    () => (player) =>
      `${((player.WinCount / player.TotalCount) * 100).toFixed(1)}%`
  );



// 获取比赛结果
function getSideResult(players) {
  if(!players) return "";
  for (let player of players) {
    if (player.Result == 3) continue; // 跳过逃跑玩家
    return player.Result;
  }
  return "";
}

// 获取单边玩家数据
function getSideData(players) {
  let killCount = 0,
    assistCount = 0,
    deathCount = 0,
    fvCount = 0,
    moneyCount = 0,
    dTowerCount = 0;
  players.forEach((player) => {
    killCount += player.KillPlayer;
    assistCount += player.Assist;
    deathCount += player.Death;
    fvCount += player.FV;
    moneyCount += player.TotalMoney;
    dTowerCount += player.DestoryTower;
  });
  return {
    killCount, // 杀敌数
    assistCount, // 助攻数
    deathCount, // 死亡数
    moneyCount, // 总经济
    dTowerCount, // 推塔数
    avgFV: Math.round(fvCount / players.length),
    avgMoney: Math.round(moneyCount / players.length),
  };
}


</script>

<style lang="scss" scoped>

.iconTips{
    margin-bottom: 10px;
    .item{
        margin-right: 10px;
        font-size: 0.7rem;
        .iconfont{
            font-size: 0.7rem;
            margin-right: 2px;
        }
    }
}

.sideInfo {
  font-size: 0.8rem;
  margin: 0 0 5px 1px;
  .infoBox {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .title {
      font-size: 90%;
      margin-right: 2px;
    }
    .value {
      font-weight: bold;
    }
  }
  .result {
    padding: 2px 5px;
    color: white;
    border-radius: $radius;
    margin-right: 10px;
  }
  .win {
    background-color: green;
  }
  .lose {
    background-color: red;
  }
}

.side {
  margin-bottom: 20px;
  border-radius: $radius;
  padding: 5px;
  background-color: $color-p4;
  & > .item {
    margin-bottom: 5px;
    border-radius: 10px;
    background-color: rgba($color: #000000, $alpha: 0.2);
    padding: 5px 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .heroIcon {
      position: relative;
      $size: 50px;
      height: $size;
      width: $size;
      min-width: $size;
      .level {
        position: absolute;
        right: 1px;
        bottom: 1px;
        background-color: rgba($color: #000000, $alpha: 0.5);
        color: white;
        $size: 15px;
        height: $size;
        width: $size;
        font-size: 0.7rem;
        display: block;
        padding: 1px;
        border-radius: $radius;
      }
      .playerLv {
        position: absolute;
        left: 1px;
        top: 1px;
        background-color: rgba($color: #000000, $alpha: 0.5);
        color: white;
        font-size: 0.8rem;
        display: block;
        padding: 2px 0;
        text-align: center;
        border-radius: $radius;
      }
      .icon {
        border-radius: $radius;
        border: 1px solid white;
        width: 100%;
        height: 100%;
      }
    }
  }
}

.skill {
  margin-left: 10px;
  width: 27px;
  flex-wrap: wrap;
  .icon {
    $size: 25px;
    width: $size;
    height: $size;
    border-radius: $radius;
    margin: 3px 0;
    border: 1px solid white;
  }
}
.equip {
  margin-left: 10px;
  width: 100px;
  flex-wrap: wrap;
  .icon {
    $size: 25px;
    width: $size;
    height: $size;
    border-radius: $radius;
    margin: 3px;
    border: 1px solid white;
  }
}

.playerInfo {
  margin-left: 8px;
  .info {
    .playerName {
      font-size: 1rem;
      margin-right: 10px;
      width: 120px;
        // background-color: rgb(74,75,81);
        // border-radius: $radius;
        // text-align: center;
      font-size: 0.9rem;
    }
    .playerTag {
      border-radius: $radius;
      padding: 2px 5px;
      font-size: 0.8rem;
      background-color: rgba($color: rgba(123, 123, 123, 0.753), $alpha: 0.2);
      flex-grow: 1;
      min-width: 350px;
      .tag {
        margin-right: 8px;
        align-items: center;
        display: flex;
        .title {
          font-size: 70%;
          margin-right: 2px;
        }
      }
    }
  }
  .kda {
    margin-top: 5px;
    .kdaV {
      width: 70px;
      font-size: 0.9rem;
    }
    .tips {
      font-size: 70%;
      margin-right: 3px;
      color: #f0f0f0;
    }
  }
  .score {
    height: 20px;
    width: auto;
    margin: 0 -5px;
  }
}

.dataRow {
  margin-left: 5px;
  flex-grow: 1;
}
.dataItem {
  font-size: 0.9rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  background: rgb(72, 73, 86);
  //   justify-content: center;
  padding: 2px;
  border-radius: $radius;
  margin-right: 2px;
  //   width: 20%;
  flex-grow: 1;
  span:last-child {
    flex-grow: 1;
    text-align: center;
    font-size: 0.8rem;
  }
  .iconfont {
    font-size: 90%;
  }
}
</style>