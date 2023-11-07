<template>
    <ul class="sidebar">
        <img class="logo" src="@/assets/img/logo.png"/>
        <li class="item" v-for="item in routes" :key="item.name" :class="{ active: active == item.path }">
            <a :href="`#${item.path}`">{{ item.name }}</a>
        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    routes: Array,
    active: String
})
</script>

<style lang="scss" scoped>
.sidebar{
    background-color: $color-p1;
    width: 200px;
    min-width: 200px;
    color: white;
    text-align: center;
    .logo{
        height: 80px;
        width: 80px;
        border-radius: 50%;
        margin: 40px 0;
    }
    .item{
        text-shadow: rgb(0, 0, 0) 3px 3px 3px;
        transition: 0.3s;
        cursor: pointer;
        &:hover{
            background-color: rgba(22,24,25,0.7);
        }
        a{
            width: 100%;
            display: inline-block;
            padding: 20px 0;
        }
    }
    .active{
        background-color: rgb(22,24,25)!important;
    }
}
</style>