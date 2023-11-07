import { reactive } from "vue"

export const store = reactive({
    loading: false,
    msg: '',// 提示信息
    role: {
        RoleName: ''
    }, // 当前角色
    matchInfoList: [],// 对局数据列表
    heroType: null,
    currentMatch: null,// 当前对局
    currentMatchType: '竞技场',
    // 设置当前对局数据
    setCurrentMatch(mtid){
        let mtInfo = this.matchInfoList.find(item=>item.MTIDInt == mtid);
        if(mtInfo) {
            this.currentMatch = mtInfo;
            return true;
        }else return false;
    },
    // 设置当前角色
    setCurrentRole(role){
        this.role = role;
    },
    // 设置当前对局类型
    setCurrentMT(text){
        this.currentMatchType = text;
    },
})