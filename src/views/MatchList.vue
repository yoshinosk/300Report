<template>
  <div class="match-list box">
    <div class="roleInfo">
      <RoleInfo></RoleInfo>
    </div>
    <ul class="list" @scroll="handleScroll">
      <MatchType
        @change="handleMTChange"
      ></MatchType>
      <MatchItem
        v-for="(item, index) in matchList"
        :key="item.MTID"
        :match="item"
        :index="index"
      ></MatchItem>
      <li class="loadmore flex" @click="getMatchList">
        <img
          v-show="loadmore === 'loading'"
          class="loading"
          src="@/assets/img/loading.gif"
        />
        <span>{{ loadText }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { watch, ref, computed, onMounted } from "vue";
import MatchItem from "../components/MatchItem.vue";
import RoleInfo from "../components/RoleInfo.vue";
import { store } from "@/composables/store";
import { post } from "@/assets/js/request";
import MatchType from "../components/MatchType.vue";

const page = ref(1),
  matchList = ref([]),
  matchType = ref(1),
  loadmore = ref("loadmore");

onMounted(()=>{
  console.log('onMounted','matchlist');
  // 避免为监听到角色变化
  if(store.role.RoleName && loadmore.value != 'loading' && matchList.value.length == 0){
    clear();
    getMatchList();
  }
})



const loadText = computed(() => {
  let map = {
    loadmore: "点击或拉下加载更多",
    loading: "正在加载",
    nomore: "没有更多了",
  };
  return map[loadmore.value];
});

// 清除对局详细数据缓存
function clear() {
  page.value = 1;
  loadmore.value = 'loadmore';
  matchList.value.splice(0);
  store.matchInfoList.splice(0);
}

function handleMTChange(item){
  matchType.value = item.id;
  clear();
  getMatchList();
  store.setCurrentMT(item.name);
}

// 监听角色变化
watch(
  () => store.role,
  () => {

    clear();
    getMatchList();
  },
  { deep: true,immediate: false}
);


// 监听滚动
function handleScroll(event) {
  let { scrollTop, scrollTopMax} = event.target;
  if(scrollTop == scrollTopMax) getMatchList();
}

// 加载对局列表信息
function getMatchList() {
  if (loadmore.value != "loadmore") return false;
  loadmore.value = "loading";
  post("https://300report.jumpw.com/api/battle/searchMatchs", {
    RoleID: store.role.RoleID,
    MatchType: matchType.value,
    searchIndex: page.value,
  })
    .then((res) => {
      if (!res.success) {
        store.msg = res.msg;
        loadmore.value = "loadmore";
        return false;
      }
      if (!store.heroType) store.heroType = res.data.HreoType;
      if(!res.data || !res.data.Matchs){
        console.log(res);
        store.msg = '未知错误';
        loadmore.value = "loadmore";
        return false;
      }
      matchList.value.push(...res.data.Matchs.Matchs);
      page.value++;
      loadmore.value =
        res.data.Matchs.Matchs.length < 8 ? "nomore" : "loadmore";
    })
    .catch((err) => {
      loadmore.value = "loadmore";
      store.msg = err.toString();
    });
}
</script>

<style lang="scss" scoped>
.match-list {
  display: flex;
  overflow: auto;
  height: 85vh;
  .roleInfo {
    $size: 350px;
    width: $size;
    min-width: $size;
    height: 100%;
    // flex-grow: 1;
    overflow-y: auto;
  }
  & > .list {
    margin-left: 20px;
    min-width: 800px;
    height: 100%;
    overflow-y: auto;
    .loadmore {
      margin-top: 20px;
      padding: 20px;
      justify-content: center;
      background-color: rgba($color: #000000, $alpha: 0.2);
      border-radius: $radius;
      cursor: pointer;
      .loading {
        height: 30px;
        width: 30px;
        margin-right: 8px;
      }
    }
  }
}
</style>