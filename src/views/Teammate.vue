<template>
    <div class="box">
        <ul class="filter">
            <li class="item" :class="{ active: side == 1 }" @click="handleSide(1)">队友</li>
            <li class="item" :class="{ active: side == 2 }" @click="handleSide(2)">敌方</li>
        </ul>
        <div class="info ">
            <div>平均竞技力：<span>{{ avgFV }}</span></div>
        </div>
        <ul class="heroList flex">
            <li v-for="(hero, index) in heroList" :key="index">
                <img class="heroIcon" :src="getHeroIcon(hero.ID)" alt="">
                <span class="count ">{{ hero.Count }}</span>
            </li>
        </ul>

        <ul class="list">
            <li class="item flex header">
                <span class="rn">玩家昵称</span>
                <span class="count">场次</span>
                <span class="fv">竞技力</span>
                <span class="elo">团分</span>
                <span class="winp">玩家胜率</span>
                <span class="guid">大区</span>
                <span class="hero">使用角色</span>
            </li>
            <li class="item flex" v-for="item in list" :key="item.PlayerID">
                <span class="rn">{{ item.RN }}</span>
                <span class="count">{{ item.Count }}</span>
                <span class="fv">{{ item.FV }}</span>
                <span class="elo">{{ item.Elo }}</span>
                <span class="winp">{{ item.Winp }}%</span>
                <span class="guid">{{ getGuidName(item.Guid) }}</span>
                <ul class="hero flex">
                    <li v-for="(hero, index) in item.Hero.slice(0, 5)" :key="index">
                        <img class="heroIcon" :src="getHeroIcon(hero.ID)" alt="">
                        <span class="score">{{ hero.Score || '-' }}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, onActivated, ref } from 'vue';
import { store } from '../composables/store';
import { getHeroIcon, getGuidName } from '../assets/js/utils';

const 
teammateList = ref([]),  //队友列表
enemyList = ref([]), // 敌人列表
side = ref(1), // 当前团队
teammateHero = ref([]),  // 队友英雄
enemyHero = ref([]), // 敌人英雄
teammateAVGFV = ref(0), // 队友平均竞技力
enemyAVGFV = ref(0),// 敌人平均竞技力
lineupList = ref([]) // 阵容列表
 

function clear() {
    teammateList.value.splice(0)
    enemyList.value.splice(0)
    teammateHero.value.splice(0)
    enemyHero.value.splice(0)
}

onActivated(() => {
    clear()
    store.matchInfoList.sort((a, b) => b.CreateTime - a.CreateTime);
    store.matchInfoList.forEach(item => {
        // 筛选敌我方玩家
        let side = item.Players.find(p => p.PlayerID == store.role.RoleID).Side;
        let t = item.Players.filter(p => p.Side == side);
        let e = item.Players.filter(p => p.Side != side);
        addTeammate(t, 1);
        addTeammate(e, 2);
    })
    teammateList.value.sort((a, b) => b.Count - a.Count).splice(50)
    enemyList.value.sort((a, b) => b.Count - a.Count).splice(50)

    teammateHero.value.sort((a, b) => b.Count - a.Count).splice(20)
    enemyHero.value.sort((a, b) => b.Count - a.Count).splice(20)

    teammateAVGFV.value = (teammateList.value.reduce((acc, cur) => acc + cur.FV, 0) / teammateList.value.length).toFixed(0)
    enemyAVGFV.value = (enemyList.value.reduce((acc, cur) => acc + cur.FV, 0) / enemyList.value.length).toFixed(0)
})


function handleSide(s) {
    side.value = s;
}

/**
 * @description 添加玩家到列表
 * @param {List} players 玩家列表
 * @param {Number} side 1=我方 2地方
 */
function addTeammate(players, side) {
    for (let index = 0; index < players.length; index++) {
        const player = players[index];
        const tm = teammateList.value.find(item => item.PlayerID == player.PlayerID);
        if (tm) {
            tm.Count++;
            tm.Hero.push({ ID: player.HeroID, Score: player.Score })
            continue;
        }
        let p = {
            PlayerID: player.PlayerID,
            RN: player.RN,
            Elo: player.Elo,
            FV: player.FV,
            Count: 1,
            Hero: [{ ID: player.HeroID, Score: player.Score }],
            Winp: ((player.WinCount / player.TotalCount) * 100).toFixed(1),
            Guid: player.Guid
        }
        let playerList = side == 1 ? teammateList : enemyList;
        playerList.value.push(p);

        // 英雄出场次数
        let heros = side == 1 ? teammateHero : enemyHero;
        let h = heros.value.find(item => item.ID == player.HeroID);
        if (h) {
            h.Count++;
        } else {
            heros.value.push({
                ID: player.HeroID,
                Count: 1
            })
        }
    }
}

/**
 * @description 添加玩家到阵容列表
 * @param {List} players 玩家列表
 * @param {Number} side 1=我方 2地方
 */
function addLineup(players,side){

}



const list = computed(() => side.value == 1 ? teammateList.value : enemyList.value),
    heroList = computed(() => side.value == 1 ? teammateHero.value : enemyHero.value),
    avgFV = computed(() => {

        return side.value == 1 ? teammateAVGFV.value : enemyAVGFV.value;
    })

</script>

<style lang="scss" scoped>
.heroList {
    margin-bottom: 10px;

    .heroIcon {
        height: 100%;
        width: 100%;
        border-radius: 50%;
    }

    li {
        border-radius: 50%;
        margin-right: 3px;
        max-width: 50px;
        min-height: 50px;
        min-width: 50px;
        max-height: 50px;
        border: 1px solid white;
        position: relative;

        .count {
            position: absolute;
            text-align: center;
            display: block;
            // font-size: 12px;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid white;
            background-color: rgba($color: #000000, $alpha: 0.5);
        }
    }
}

.filter {
    margin: 10px auto 10px auto;
    background-color: rgb(51, 53, 59);
    display: flex;
    justify-content: space-between;
    width: 50%;
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

.info {
    margin: 10px 0 10px;
    background-color: $color-p2;
    padding: 10px;
    border-radius: $radius;
    overflow-x: auto;
}

.list {
    .header {
        text-align: center;
    }

    .item {
        background-color: $color-p4;
        padding: 3px 8px;
        margin-bottom: 5px;
        border-radius: $radius;

        .fv,
        .elo {
            width: 50px;
        }

        .rn {
            width: 120px;
        }

        .winp {
            width: 70px;
        }

        .guid {
            width: 120px;
        }

        .hero {
            min-width: 20%;

            li {
                text-align: center;

                .score {
                    display: block;
                    font-size: 12px;
                }
            }
        }

        .count {
            width: 50px;
            text-align: center;
        }

        &>span {
            margin-right: 15px;
            text-align: center;
        }

        .heroIcon {
            border-radius: 50%;
            margin-right: 3px;
            width: 30px;
            height: 30px;
            border: 1px solid white;
        }
    }
}
</style>