import icon_sss from '@/assets/img/SSS.png';
import icon_ss from '@/assets/img/SS.png';
import icon_s from '@/assets/img/S.png';
import icon_a from '@/assets/img/A.png';
import icon_b from '@/assets/img/B.png';
import icon_c from '@/assets/img/C.png';
import icon_d from '@/assets/img/D.png';
export const scoreIconMap = {
	'SSS': icon_sss,
	'SS': icon_ss,
	'S': icon_s,
	'A': icon_a,
	'B': icon_b,
	'C': icon_c,
	'D': icon_d,
}

export const matchType = [{ id: 1, name: '竞技场', MID: 254 }, { id: 2, name: '战场', MID: 252 }, { id: 3, name: '排位', MID: 273 }, { id: 4, name: '闪电战', MID: 356 }, { id: 5, name: '克隆战', MID: 360 }];

export const matchResult = { 1: '胜利', 2: '失败', 3: '逃跑' }

export function getHeroIcon(id) {
	return `https://ziyuan.jumpw.com/wxm300app/heros/chara_${String(id).padStart(4, '0')}.png`
}

export const errorIcon = {
	hero: 'https://ziyuan.jumpw.com/wxm300app/static/images/myscore/head_03.png?id=295',
	equip: 'https://ziyuan.jumpw.com/wxm300app/icon20210706/zb-n.png'
}

export const getScore = (n) => {
	return n >= 7.7 ? "SSS" : n >= 6.8 ? "SS" : n >= 5.5 ? "S" : n >= 4 ? "A" : n >= 3 ? "B" : n >= 2 ? "C" : "D";
}

export const calcMvpScoreLv = (n) => {
	return "SSS" == n || "SS" == n ? "SSS" : "S" == n ? "SS" : "A" == n ? "S" : "B" == n ? "A" : "C" == n ? "B" : "D" == n ? "C" : n;
}

export const calcScore = function calcScore(Players, heroType) {
	var _this = this;
	//参团率
	//先算总值
	var funCount = function funCount(sdArr, key) {
		var count = 0;
		if (sdArr == null) {
			return count;
		}
		for (var i = 0; i < sdArr.length; i += 1) {
			count += sdArr[i][key];
		}
		return count;
	};
	var funSdCount = function funSdCount(sdArr) {
		var count = 0;
		if (sdArr == null) {
			return count;
		}
		for (var i = 0; i < sdArr.length; i += 2) {
			count += sdArr[i + 1];
		}
		return count;
	};
	var ps = Players;
	//总队（击杀）
	var LeftKillPlayerCount = funCount(Players.filter(function (item) {
		return item.Side == 1;
	}), "KillPlayer");
	var RightKillPlayerCount = funCount(Players.filter(function (item) {
		return item.Side == 2;
	}), "KillPlayer");
	//let KillPlayerCount = funCount(Players,'KillPlayer')
	//队伍总经济
	var TotalMoneyCount = funCount(Players, "TotalMoney");
	//
	var SdList = {};
	var SdCountCount = 0;
	var KDAList = {};
	var KDAountCount = 0;
	for (var i = 0; i < ps.length; i += 1) {
		var p = ps[i];
		var a = funSdCount(p.SD);
		var b = (2 * p.KillPlayer + p.Assist) / (p.Death == 0 ? 1 : p.Death);
		a = a || 0;
		b = b || 0;
		SdList[p.PlayerID] = a;
		KDAList[p.PlayerID] = b;
		SdCountCount += a;
		KDAountCount += b;
	}
	SdList[-1] = SdCountCount;
	KDAList[-1] = KDAountCount;
	//
	var kd = {};
	var jifen = {};
	for (var _i = 0; _i < ps.length; _i += 1) {
		var _p = ps[_i];
		var 参团 = (_p.KillPlayer + _p.Assist) / (_p.Side == 1 ? LeftKillPlayerCount : RightKillPlayerCount);
		jifen["ct" + _p.PlayerID] = (参团 * 100).toFixed(0) || 0;
		var 经济 = _p.TotalMoney / TotalMoneyCount;
		var 输出 = SdList[_p.PlayerID] / SdList[-1];
		var KDA = KDAList[_p.PlayerID] / KDAList[-1];
		kd[_p.PlayerID] = [参团 || 0, 经济 || 0, 输出 || 0, KDA || 0];
	}
	var maxPlayer = {};
	var maxvalue = 0;
	for (var _i2 = 0; _i2 < ps.length; _i2 += 1) {
		var _p2 = ps[_i2];
		var aHeroID = _p2.HeroID;
		var aPlayerID = _p2.PlayerID;
		var aHeroType = heroType[aHeroID];
		var valu = kd[aPlayerID];
		_p2.isMvp = false;
		//HeroType :0,//1=魔法；2=战斗；3=防御；4=射击；5=协助；6=爆发;0=全部
		if (aHeroType == 2) {
			_p2.Score = parseFloat((valu[1] * 5 + valu[2] * 5 + valu[0] * 5 + valu[3] * 5).toFixed(2));
		}
		if (aHeroType == 6) {
			_p2.Score = parseFloat((valu[1] * 4 + valu[2] * 6 + valu[0] * 4 + valu[3] * 6).toFixed(2));
		}
		if (aHeroType == 3 || aHeroType == 5) {
			_p2.Score = parseFloat((valu[1] * 4 + valu[2] * 4 + valu[0] * 8 + valu[3] * 4).toFixed(2));
		}
		if (aHeroType == 1 || aHeroType == 4) {
			_p2.Score = parseFloat((valu[1] * 6 + valu[2] * 6 + valu[0] * 4 + valu[3] * 4).toFixed(2));
		}
		if (_p2.Score > maxvalue) {
			maxvalue = _p2.Score;
			maxPlayer = _p2;
		}
		_p2.ScoreNum = _p2.Score;

		_p2.Score = getScore(_p2.Score);
	}
	maxPlayer.isMvp = true;
	maxPlayer.Score = calcMvpScoreLv(maxPlayer.Score);
	return Players;
}

export const getSkillIcon = id => `https://ziyuan.jumpw.com/wxm300app/report/images/skill/ico_${id}.png`;

export const getEquipIcon = id => `https://300data.com/api/game/games_equip_img?equipid=${id}&type=1`;

export const getHeroSkillIcon = id => `https://300data.com/api/game/games_skill_img?skillid=${id}`;

/**
 * @description 获取装备图片
 * @param {Array} ep Player.Ep
 * @returns {Array} 图片地址数组
 */
export function getEquip(ep) {
	if (!ep) return [];
	return ep
		.filter((item, index) => index % 2 == 0)
		.map((item) => getEquipIcon(item));
}

/**
 * @description 设置玩家排名
 * @param {Array} arr 玩家列表
 * @param {String} key 需要排名的数值
 * @param {String} sortKey 排序的属性
 */
function setPlayerRank(arr, key, sortKey) {
	// if(!arr[0].sortKey) return false;
	arr.sort((a,b)=> b[sortKey] - a[sortKey])
	arr.forEach((item, index) => {
		item[key] = index + 1;
	});
}

/**
 * @description 初始化单边玩家数据
 * @param {Array} players 单边玩家
 */
export const playersInit = players => {
	// 先遍历一遍初始化一些属性
	let killTotal = 0; // 队伍总杀敌数
	players.forEach((item) => {
		if(item.TD) item.Hurt = item.TD.at(-1);
		if(item.SD) item.Damage = item.SD.reduce(
			(prev, curr, index) => (index % 2 != 0 ? curr + prev : prev),
			0
		);
		killTotal += item.KillPlayer;
		item.Equip = []
		let equip = {
			date: 1,
			equip: []
		}
		if(item.ED) item.ED.forEach((e, i) => {
			if (e < 300 || i == item.ED.length) {
				if (i) item.Equip.push({ ...equip })
				equip.date = e;
				equip.equip = new Array()
			} else {
				equip.equip.push(e)
			}
		})
	});

	players.forEach((item) => {
		
		item.TeamRate = Math.round((item.KillPlayer + item.Assist) / killTotal * 1000) / 10;
	});
	// 获取玩家评分排名
	setPlayerRank(players, 'ScoreRank','ScoreNum')
	// 获取玩家承伤排名
	setPlayerRank(players, 'TDRank','Hurt')
	// 获取玩家输出排名
	setPlayerRank(players, 'SDRank','Damage')
	// 获取玩家参团率排名
	setPlayerRank(players, 'TeamRank','TeamRate')
}

const server = [
	{
		"GameGUID": 12591,
		"GUIDName": "进击巨人(电信)"
	},
	{
		"GameGUID": 12394,
		"GUIDName": "天降之物(电信)"
	},
	{
		"GameGUID": 12431,
		"GUIDName": "邪王真眼(电信)"
	},
	{
		"GameGUID": 12293,
		"GUIDName": "学园都市(电信)"
	},
	{
		"GameGUID": 12292,
		"GUIDName": "威风堂堂(电信)"
	},
	{
		"GameGUID": 12291,
		"GUIDName": "绝对领域(网通)"
	},
	{
		"GameGUID": 11111,
		"GUIDName": "圣杯战争(电信)"
	},
	{
		"GameGUID": 10611,
		"GUIDName": "刀剑神域(电信)"
	},
	{
		"GameGUID": 1003,
		"GUIDName": "临兵斗者(网通)"
	},
	{
		"GameGUID": 1002,
		"GUIDName": "风林火山(电信)"
	},
	{
		"GameGUID": 20003,
		"GUIDName": "梦想封印(电信)"
	},
	{
		"GameGUID": 20002,
		"GUIDName": "魔女之夜(电信)"
	},
	{
		"GameGUID": 20001,
		"GUIDName": "空之境界(网通)"
	},
	{
		"GameGUID": 20000,
		"GUIDName": "无限剑制(电信)"
	},
	{
		"GameGUID": 20004,
		"GUIDName": "天壤劫火(电信)"
	},
	{
		"GameGUID": 20006,
		"GUIDName": "圆环之理(网通)"
	},
	{
		"GameGUID": 20005,
		"GUIDName": "失落圣诞(电信)"
	},
	{
		"GameGUID": 20009,
		"GUIDName": "加速世界(电信)"
	},
	{
		"GameGUID": 20008,
		"GUIDName": "恋姬无双(电信)"
	},
	{
		"GameGUID": 20012,
		"GUIDName": "旭日之心(电信)"
	},
	{
		"GameGUID": 20013,
		"GUIDName": "绝灭天使(电信)"
	},
	{
		"GameGUID": 20015,
		"GUIDName": "黄金剧场(网通)"
	},
	{
		"GameGUID": 20014,
		"GUIDName": "破军歌姬(电信)"
	},
	{
		"GameGUID": 20016,
		"GUIDName": "境界彼方(电信)"
	},
	{
		"GameGUID": 20019,
		"GUIDName": "WCA比赛服(电信)"
	},
	{
		"GameGUID": 20018,
		"GUIDName": "幻想乡(网通)"
	},
	{
		"GameGUID": 20017,
		"GUIDName": "镇守府(电信)"
	},
	{
		"GameGUID": 20020,
		"GUIDName": "极乐净土(电信)"
	},
	{
		"GameGUID": 20021,
		"GUIDName": "甲铁城(电信)"
	},
	{
		"GameGUID": 20022,
		"GUIDName": "红魔馆(网通)"
	},
	{
		"GameGUID": 20023,
		"GUIDName": "赤红之瞳(电信)"
	},
	{
		"GameGUID": 20024,
		"GUIDName": "蔷薇少女(网通)"
	},
	{
		"GameGUID": 20025,
		"GUIDName": "叛逆骑士(电信)"
	},
	{
		"GameGUID": 20026,
		"GUIDName": "真理之门(电信)"
	},
	{
		"GameGUID": 20027,
		"GUIDName": "万华镜(电信)"
	},
	{
		"GameGUID": 20028,
		"GUIDName": "荣耀(电信)"
	},
	{
		"GameGUID": 20029,
		"GUIDName": "冠位指定(电信)"
	},
	{
		"GameGUID": 20030,
		"GUIDName": "阿瓦隆(网通)"
	},
	{
		"GameGUID": 20031,
		"GUIDName": "序列之争(电信)"
	},
	{
		"GameGUID": 20032,
		"GUIDName": "镇魂街(电信)"
	},
	{
		"GameGUID": 20033,
		"GUIDName": "画江湖(网通)"
	},
	{
		"GameGUID": 20034,
		"GUIDName": "十二试炼(电信)"
	},
	{
		"GameGUID": 20035,
		"GUIDName": "天之杯(电信)"
	},
	{
		"GameGUID": 20036,
		"GUIDName": "理想乡(电信)"
	},
	{
		"GameGUID": 20038,
		"GUIDName": "超越天堂"
	},
	{
		"GameGUID": 20041,
		"GUIDName": "群星闪耀"
	},
	{
		"GameGUID": 20042,
		"GUIDName": "QQ专区"
	},
	{
		"GameGUID": 20043,
		"GUIDName": "第九世界"
	}
]
/**
 * @description 获取大区名字
 * @param {Number} guid 大区id
 * @returns {String} 大区名字
 */
export const getGuidName = (guid) => {
	let data = server.find(item => item.GameGUID == guid);
	return data ? data.GUIDName : guid;
}