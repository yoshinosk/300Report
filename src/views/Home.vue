<template>
  <div class="home">
    <div class="box">
      <h3 class="title">角色绑定</h3>
    <div class="bind">
      <div class="m-inputBox">
        <input
          class="m-input"
          placeholder="请输入角色名称"
          type="text"
          v-model="roleName"
          @keydown.enter="handleBind"
        />
        <button class="m-button" @click="handleBind">查询</button>
      </div>
    </div>
    <ul class="history">
      <li
        class="item"
        v-for="(item, index) in roleList"
        :key="item.RoleName"
        @click="handleRole(item)"
      >
        <span class="RN">{{ item.RoleName }}</span>
        <span class="autoBtn" @click.stop="handleSetAuto(index)" :class="{active: item.AutoLoad }">自动加载</span>
      </li>
    </ul>
    </div>
    <div class="box notic">
      <span>战绩网接口不允许跨域了，需要装插件才能用。</span>
      <span>用的什么浏览器就点哪个进去装</span>
      <a href="https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino/" target="_blank">Chrome</a>
      <a href="https://addons.mozilla.org/en-US/firefox/addon/cors-unblock/" target="_blank">Firefox</a>
      <a href="https://microsoftedge.microsoft.com/addons/detail/cors-unblock/hkjklmhkbkdhlgnnfbbcihcajofmjgbh" target="_blank">Edge</a> 
      <span class="iconTips">要查战绩的时候点插件图标启用<img src="@/assets/img/tips.png">，不查的时候记得关掉。</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { post } from "@/assets/js/request";
import { store } from "../composables/store";

const roleName = ref(""),
  roleList = ref([]); // 查询历史

// 点击查询
function handleBind() {
  if (!roleName.value) return "";
  post("/api/battle/searchNormal?type=h5", {
    AccountID: "0",
    Guid: "0",
    RoleName: roleName.value,
  })
    .then((res) => {
      if (!res.success) {
        store.msg = res.msg == "Role not exists!" ? "角色不存在" : res.msg;
        return false;
      }
      updateRoleList(res.data);

      store.setCurrentRole(res.data);
      location.hash = "#/list";
    })
    .catch((err) => {
      store.msg = err.toString();
    });
}

// 更新角色列表
function updateRoleList(data) {
  if (roleList.value.find((item) => item.RoleName == data.RoleName)) return;

  let { RoleName, Guid } = data;
  roleList.value.push({ RoleName, Guid, AutoLoad: false });
  saveRoleList();
}

// 缓存角色列表
function saveRoleList() {
  localStorage.setItem("roleList", JSON.stringify(roleList.value));
}

// 点击角色查询战绩
function handleRole(item) {
  roleName.value = item.RoleName;
  handleBind();
}

// 设置自动查询
function handleSetAuto(index) {
  if(roleList.value[index].AutoLoad){
    roleList.value[index].AutoLoad = false;
    saveRoleList();
    return;
  }
  roleList.value.forEach((item) => {
    item.AutoLoad = false;
  });
  roleList.value[index].AutoLoad = true;
  saveRoleList();
}

// 加载角色列表
onMounted(() => {
  let temp = localStorage.getItem("roleList");
  if (temp) {
    roleList.value = JSON.parse(temp);
    let autoLoadRole = roleList.value.find(item=>item.AutoLoad);
    if(autoLoadRole){
      roleName.value = autoLoadRole.RoleName;
      handleBind();
    }
  }
});


</script>

<style lang="scss" scoped>
.history {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  .item {
    border-radius: $radius;
    padding: 10px;
    background-color: $color-p4;
    margin: 0 5px 5px 0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background-color: rgb(69, 70, 73);
    }
  }
  .active{
    background-color:  rgb(110, 111, 112)!important;
  }
  .autoBtn {
    font-size: 0.7rem;
    background-color: rgb(0, 153, 204);
    padding: 2px 5px;
    border-radius: $radius;
    margin-top: 5px;
    align-self: flex-end;
    transition: 0.3s;
    &:hover {
      background-color: rgb(18, 156, 201);
    }
  }
}

.home {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  padding: 0;
  width: 550px;
  .notic{
    a{
      display: inline-block;
      margin-right: 5px;
      font-weight: bold;
    }
    .iconTips{
      display: flex;
      align-items: center;
      img{height: 30px;width: 30px;margin-left: 3px;}
    }
  }
  .box{
    margin: 10px 0!important;
  }
  .title {
    text-align: center;
    position: relative;
    margin-bottom: 20px;
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
}
.bind {
  .m-inputBox {
    .m-input,
    .m-button {
      font-size: 18px;
    }
  }
}
</style>