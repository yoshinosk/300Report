export function formatDate(timestamp, fmt) {
    fmt = fmt || 'yyyy-MM-dd HH:mm'
    const date = new Date(timestamp)
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            )
        }
    }
    return fmt
}

export function prettyDate(timestamp) {
    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const diffValue = new Date().getTime() - timestamp
    if (diffValue / minute < 1) {
        return '刚刚'
    } else if (diffValue / minute < 60) {
        return parseInt(diffValue / minute) + '分钟前'
    } else if (diffValue / hour <= 24) {
        return parseInt(diffValue / hour) + '小时前'
    } else if (diffValue / day <= 30) {
        return parseInt(diffValue / day) + '天前'
    }
    return formatDate(timestamp, 'yyyy-MM-dd HH:mm')
}

// 格式化使用时间 参数 秒
export const formatUsedTime = (second) => {
	var secondTime = parseInt(second);
	var minuteTime = 0;
	var hourTime = 0;
	if (secondTime > 60) {
		minuteTime = parseInt(secondTime / 60);
		secondTime = parseInt(secondTime % 60);
		if (minuteTime > 60) {
			hourTime = parseInt(minuteTime / 60);
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	var result = "" + parseInt(secondTime) + "秒";
	var min = 0;
	if (minuteTime > 0) {
		result = "" + parseInt(minuteTime) + "分" + result;
		min = parseInt(minuteTime);
	}
	if (hourTime > 0) {
		result = "" + parseInt(hourTime) + "小时" + result;
		min += parseInt(hourTime) * 60;
	}
	return result;
}

export const toThousand = (num) => {
    num = parseInt(num);
    if(num == 0 || isNaN(num)) return 0;
    return (num / 1000).toFixed(1) + 'k';
}