<template>
  <div class="role-info">
    <div class="header">
      <div class="roleName">
        {{ role.RoleName }}
        <span class="lv">Lv{{ role.MasterLv || 0 }}</span>
      </div>
    </div>
    <div class="info-box">
      <div class="item">
        <div class="info">
          <span class="name">注册时间</span>
          <span class="value" style="font-size:90%;">{{ regDate }}</span>
        </div>
      </div>
      <div class="item" v-for="key in Object.keys(infoMap)" :key="key">
        <div class="info">
          <span class="name">{{ infoMap[key] }}</span>
          <span class="value">{{ role[key] || "暂无数据" }}</span>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="name">竞技场SOLO</span>
          <span class="value"
            >{{ role.JjcSoloWin || 0 }} / {{ role.JjcSoloTotal || 0 }}</span
          >
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="name">战场SOLO</span>
          <span class="value"
            >{{ role.ZcSoloWin || 0 }} / {{ role.ZcSoloTotal || 0 }}</span
          >
        </div>
      </div>
    </div>
    <MatchType @change="(item)=>{curMID = item.MID}"></MatchType>
    <div class="info-box" v-if="matchSports">
      <div class="item">
        <div class="info">
          <span class="name">拳</span>
          <span class="value">{{ matchSports.MatchSports.Sports.Fist || "暂无数据" }}</span>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="name">盾</span>
          <span class="value">{{ matchSports.MatchSports.Sports.Shield || "暂无数据" }}</span>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="name">剑</span>
          <span class="value">{{ matchSports.MatchSports.Sports.Sword || "暂无数据" }}</span>
        </div>
      </div>
      <div class="item" v-for="key in Object.keys(sportsMap)" :key="key">
        <div class="info">
          <span class="name">{{ sportsMap[key] }}</span>
          <span class="value">{{
            matchSports.MatchSports[key] || "暂无数据"
          }}</span>
        </div>
      </div>
    </div>
    <h4 class="common-title">常用英雄</h4>
    <ul class="common-hero">
      <li class="item flex" v-for="item in commonHero" :key="item.HeroID">
        <img class="icon" :src="getHeroIcon(item.HeroID)"/>
        <span class="total">{{ item.Win + ' / ' + item.Total }}</span>
        <span class="pro">{{ (item.Win / item.Total * 100).toFixed(1) + '%' }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getHeroIcon } from "@/assets/js/utils.js";
import { formatDate } from "@/assets/js/tool.js";
import { computed } from "vue";
import { store } from "../composables/store";
import MatchType from "./MatchType.vue";

const curMID = ref(254);

const role = computed(() => store.role),
  regDate = computed(() =>
    store.role.RoleRegist
      ? formatDate(store.role.RoleRegist * 1000, "yyyy-MM-dd")
      : "暂无数据"
  ),
  matchSports = computed(() =>
    store.role.MatchSportsList
      ? store.role.MatchSportsList.find((item) => item.MID == curMID.value)
      : null
  ),
  commonHero = computed(()=> matchSports.value ? matchSports.value.MatchSports.MyHeros : [] )

const infoMap = {
    LvVIP: "VIP等级",
    TeamScore: "团分",
    TotalSign: "总签到数",
    HeroCount: "英雄数量",
    SkinCount: "皮肤数量",
    HeroExclusive: "专属装备",
    ZcEquip: "战场装备",
    AttainTitleCount: "称号数量",
    Win100Title: "百胜称号",
    Win300Title: "三百胜称号",
    AttainCount: "成就点",
    ZcScore: "战场分数",
  },
  sportsMap = {
    Total: "总场",
    Win: "胜场",
    BestKill: "最高杀敌",
    BestKillMonster: "最高补刀",
    BestAthMoney: "最高竞技",
    BestBeHurt: "最高承伤",
    BestHelp: "最高助攻",
    BestKillTower: "最高推塔",
    BestDamage: "最高输出",
    // BestContinueKill: "最高连杀",
    // BestContinueWin: "最高连胜",
  };
</script>

<style lang="scss" scoped>
.role-info {
  .header {
    margin-bottom: 15px;
    .roleName {
      font-weight: bold;
      font-size: 22px;
      .lv {
        font-size: 16px;
      }
    }
  }
  .info-box {
    display: grid;
    grid-template-columns: repeat(3,33.3%);
    .item {
      text-align: center;
      .info {
        margin:0 5px 5px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border-radius: $radius;
        background-color: $color-p4;
      }
      .name {
        font-size: 14px;
        color: rgb(149, 149, 149);
        margin-bottom: 3px;
        white-space: nowrap;
      }
      .value {
        font-size: 16px;
        color: white;
        white-space: nowrap;
      }
    }
  }
}


.common-title{
  margin: 10px 0;
}
.common-hero{
  .item{
    border-radius: $radius;
    background-color: $color-p4;
    margin-bottom: 6px;
    padding-right: 10px;
    .icon{
      height: 40px;
      width: 40px;
      border-radius: $radius;
      margin-right: 10px;
    }
    .pro{
      margin-left: auto;
    }
  }
}
</style>