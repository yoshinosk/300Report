import { ref, computed, onMounted } from 'vue';
import { store } from './store';
import NotFound from '@/views/NotFound.vue';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import MatchInfo from '@/views/MatchInfo.vue';
import MatchList from '@/views/MatchList.vue';

import Teammate from '@/views/Teammate.vue';
import RoleReport from '@/views/RoleReport.vue';

export function useRouter() {
    const routes = [
        { path: '/', name: '角色绑定', component: Home },
        { path: '/list', name: '战绩列表', component: MatchList },
        { path: '/match', name: '对局信息', component: MatchInfo },
        { path: '/teammate', name: '队友分析', component: Teammate },
        { path: '/report', name: '角色周报', component: RoleReport },
        { path: '/about', name: '关于本站', component: About }
    ]
    const currentPath = ref(window.location.hash.slice(1))

    onMounted(()=>{
        window.location.hash = '#/';
    })

    window.addEventListener('hashchange', (event) => {
        let hash = window.location.hash.slice(1);
        if(hash == '/about'){
            return currentPath.value = hash
        }
        if(!store.role.RoleName && hash != '/') {
            store.msg = '请先绑定角色';
            window.location.hash = '#/';
            return;
        }
        if(hash == '/match' && !store.currentMatch){
            store.msg = '请先选择对局';
            window.location.hash = '#/list';
            return;
        }
        currentPath.value = hash;
    })

    const currentView = computed(() => {
        let path = currentPath.value || '/';
        let route = routes.find(item => item.path == path)

        return route ? route.component : NotFound;
    })

    return {
        routes,
        currentPath,
        currentView
    }
}