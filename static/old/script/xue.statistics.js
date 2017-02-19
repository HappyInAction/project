
/**
 * 用户在线时长统计代码
 * @version 1.1
 * @anthor : DuXinli
 * @upload : 2015-1-19 by Marco
 *
 */

/**
 * @description
 *
 * v1.2 2015-1-21 by Marco
 *    1. 修改请求地址为php
 *    2. 修改属性名称
 *    3. 分离分辨率为width和height
 *    4. 把创建图片的操作放到onload后执行，防止顶部调用报错问题
 *    5. 重构事件机制，确保window.onblur 在Chrome能够执行
 *    6. 增加log调试方法
 *
 * v1.1 2015-1-19 by Marco:
 *    1. 增加间隔时间标识
 *    2. 增加登录用户标识
 *    3. 去掉AppVersion（因为服务器日志中已经有了）
 *
 * v1.0 2015-1-4 by DuXinli
 *    1. img代替ajax心跳
 *    2. 主要计算用户在线时长
 */


var xue = xue || {};
xue.statistics = xue.statistics || {};
(function(){
	var stat = xue.statistics;
	stat.version = '1.2';
	stat.server = 'http://www.xueersi.com/visits/check/';
	stat.TimerFunction = null; //定时器函数
	stat.RefreshTime = 5000; //定时器刷新时间
	stat.Domain = document.domain; //域名
	stat.URL = window.location.href; //URL
	stat.Title = document.title; //页面标题
	// stat.Resolution = (window.screen.height) + '&&' + (window.screen.width); //分辨率
	stat.width = window.screen.width;
	stat.height = window.screen.height;
	stat.ColorDepth = window.screen.colorDepth; //颜色深度
	stat.Referrer = document.referrer; //Referrer
	stat.ClientLanguage = navigator.language; //客户端语言
	stat.AppName = navigator.appName; //客户端浏览器名称
	// xue.statistics.AppVersion = navigator.appVersion; //客户端浏览器版本号
	stat.Timestamp = new Date().getTime(); //页面刷新时间戳
	stat.RefreshTimes = 0; //定时器响应的次数
	stat.Websitelogo = ''; //用户自定义的网站标识

	stat.ImgAjax = document.createElement("img");
	stat.ImgAjax.id = "xue_stat_img";
	stat.ImgAjax.style.width = "0";
	stat.ImgAjax.style.height = "0";
})();

/****
 ***设置cookie和获取cookie***
 ***/
xue.statistics.getsec = function(str) {
	var str1 = str.substring(1, str.length) * 1;
	var str2 = str.substring(0, 1);
	if (str2 == "s") {
		return str1 * 1000;
	} else if (str2 == "h") {
		return str1 * 60 * 60 * 1000;
	} else if (str2 == "d") {
		return str1 * 24 * 60 * 60 * 1000;
	}
}

xue.statistics.setCookie = function(name, value, time) {
	var strsec = this.getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec * 1);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=.xueersi.com";
}

xue.statistics.getCookie = function(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)){
		return (arr[2]);
	}else{
		return null;
	}
}
xue.statistics.randomNum = function(randomNum) {
	this.Random = "";
	for (var i = 0; i < randomNum; i++){
		this.Random += Math.floor(Math.random() * 10);
	}
	return this.Random;
}
//用户自定义的网站标识
// xue.statistics.Websitelogo = '';
// var Statistics_Website_logo;

try {
	for (var Key in Statistics_Website_logo) {
		xue.statistics.Websitelogo = xue.statistics.Websitelogo + '&' + '' + Key + '=' + Statistics_Website_logo[Key] + '';
	}
} catch (e) {
	xue.statistics.Websitelogo = '';
}
/****
 ***统计页面函数***
 ***/
xue.statistics.AjaxOnlineTime = function() {
	// xue.statistics.log(2);
	this.RefreshTimes++;
	this.Random = this.randomNum(5) + this.Timestamp;
	this.setCookie("xue_stat", this.Random, "d1000000000000000"); //设置客户标识
	this.Visitorslogo = this.getCookie('xue_stat');
    this.uid = this.getCookie('userId');
	this.xid = this.getCookie('xesId');
    this.server = this.xid ? 'http://xeslog.xesv5.com/' : 'http://www.xueersi.com/visits/check/';
	// this.Data = 'http://xeslog.xesv5.com/?Domain=' + this.Domain + '&URL=' + this.URL + '&Title=' + this.Title + '&Resolution=' + this.Resolution + '&ColorDepth=' + this.ColorDepth + '&Referrer=' + this.Referrer + '&ClientLanguage=' + this.ClientLanguage + '&AppName=' + this.AppName + '&AppVersion=' + this.AppVersion + '&Timestamp=' + this.Timestamp + '&RefreshTime=' + xue.statistics.RefreshTime + '&xue_stat=' + this.Visitorslogo + '' + this.Websitelogo + '';
	this.Data = this.server + '?xes_t=' + this.RefreshTime // 刷新间隔
	+ '|_|xes_domain=' + this.Domain // 域名
	+ '|_|xes_URL=' + this.URL // 页面地址
	+ '|_|xes_title=' + this.Title // 页面标题
	+ '|_|xes_width=' + this.width // 分辨率宽度
	+ '|_|xes_height=' + this.height // 分辨率高度
	+ '|_|xes_color=' + this.ColorDepth // 颜色深度
	+ '|_|xes_referrer=' + this.Referrer // referrer
	+ '|_|xes_lan=' + this.ClientLanguage // 客户端语言
	+ '|_|xes_appname=' + this.AppName // 客户端名称
	+ '|_|xes_stamp=' + this.Timestamp // 时间戳，刷新的时候会改变
	+ '|_|xes_mark=' + this.Visitorslogo // 用户cookie标识
	+ '|_|xes_v=' + this.version // 统计代码版本
	;
    if(this.xid){
        this.Data += '|_|xes_xesId=' + this.xid;
    }
	if(this.uid){
		this.Data += '|_|xes_uid=' + this.uid;
	}
	if(this.Websitelogo){
		this.Data += '|_|' + this.Websitelogo;
	}

	var newData = this.Data.replace(/\|_\|/g, '&');
	document.getElementById('xue_stat_img').src = newData;

};

xue.statistics.log = function(txt) {
	try {
		console.log(txt);
	} catch (e) {
		var box = document.getElementById('xue_stat_debug');
		if (box) {
			box.innerHTML += '<br>' + txt;
		} else {
			var tips = document.createElement("div");
			tips.id = "xue_stat_debug";
			tips.style.position = 'fixed';
			tips.style.top = 0;
			tips.style.width = '100%';
			tips.style.height = '30px';
			tips.style.lineHeight = '22px';
			tips.style.zIndex = 100;
			tips.style.backgroundColor = '#f5f5f5';
			tips.appendChild(document.createTextNode(txt));;
			document.body.appendChild(tips);
		}
	}
};
xue.statistics.start = function(){
	this.TimerFunction = window.setInterval("xue.statistics.AjaxOnlineTime()", xue.statistics.RefreshTime); //定时器每5s刷新一次
};

xue.statistics.stop = function(){
	window.clearInterval(xue.statistics.TimerFunction);
};

window.onload = function(){
	var isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
	document.body.appendChild(xue.statistics.ImgAjax);
	xue.statistics.AjaxOnlineTime();
	/*
		只有chrome在页面加载时不会调用onfocus事件，FF和IE都会直接调用
	*/
	if(isChrome){
		xue.statistics.start();
	}
};
window.onblur = function(){
	// xue.statistics.log(1);
	// window.onblur = '';
	xue.statistics.stop();
	// window.onfocus = this.onfocus;
};
window.onfocus = function(){
	// xue.statistics.AjaxOnlineTime();
	xue.statistics.start();
};