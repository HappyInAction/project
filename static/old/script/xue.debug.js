/*
 * XESUI
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 声明 xue 包：增加别名“X”
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-06-26 21:21:50
 * @version $Id$
 *
 * @links http://xesui.com
 */

var X, xue;
xue = xue || function(expr, fn) {
    return xue.dom ? xue.dom(expr, fn) : {};
};
X = xue;
window.xue = xue;

xue.version = '10432';

xue.id = 'xesui';
xue.guid = '$XESUI$';
xue.team = {
    Marco: 'Marco@xesui.com',
    Alex: 'Alex@xesui.com',
    Sam: 'Sam@xesui.com'
};

xue.expr = '';
xue.host = window.location.host;
var _host = xue.host.split('.');
if (_host.length > 2) {
    xue.subdomain = _host[0];
    xue.domain = _host[1];
}
/* ========================== 公共方法 =========================== */

xue.random = function(min, max, len) {

};

/**
 * 返回时间数
 * @param  {Date} date 指定日期 2012-05-23
 * @return {number}      返回以毫秒为单位的时间
 */
xue.getTime = function(date) {
    var d = date ? new Date(date) : new Date();
    return d.getTime();
};
/**
 * @name xue.extend.js
 * @description 扩展
 *
 * @module
 * @submodule
 * @main
 * @class
 * @constructor
 * @static
 */

xue.extend = xue.extend || function(className, fn, constructor) {
    var _name = className;

    var _class = xue[_name] = xue[_name] || fn;

    return this;
};

// var isIE=!!window.ActiveXObject;
// xue.ie6 = isIE&&!window.XMLHttpRequest;
// xue.ie6 = !-[1,]&&!window.XMLHttpRequest;

xue.browser = xue.browser || {};
xue.browser.uga = navigator.userAgent.toLowerCase();

xue.browser.mozilla = /firefox/.test(xue.browser.uga);
xue.browser.webkit = /webkit/.test(xue.browser.uga);
xue.browser.opera = /opera/.test(xue.browser.uga);
xue.browser.msie = /msie/.test(xue.browser.uga);
xue.browser.safari = /safari/.test(xue.browser.uga);
xue.browser.camino = /camino/.test(xue.browser.uga);
xue.browser.gecko = /gecko/.test(xue.browser.uga);

xue.check = xue.check || {};
xue.check.isIE6 = !-[1, ] && !window.XMLHttpRequest;
xue.check.isIE9 = xue.browser.uga.indexOf("msie 9.0") > 0;
xue.check.isFirefox = xue.browser.mozilla;

xue.isIE = xue.browser.msie;
xue.isIE6 = xue.check.isIE6;
xue.isIE7 = window.XMLHttpRequest ? true : false;
xue.isIE8 = window.postMessage ? true : false;
xue.isIE9 = xue.check.isIE9;
xue.isIE10 = (document.documentMode == 10) ? true : false;
xue.isFirefox = xue.check.isFirefox;



xue.ajaxCheck = xue.ajaxCheck || {};


xue.ajaxCheck.HTML = function(str, notips) {
    if (!str) {
        // xue.alert('数据读取错误……');
        return false;
    }
    var _str = $.trim(str);
    if (_str.substr(0, 1) == '<') {
        return _str;
    } else if (_str.substr(0, 4) == 'http' || _str.substr(0, 1) == '/') {
        window.location.href = _str;
        return false;
    } else {
        if (notips) {
            return false;
        } else {
            alert(_str);
        }
        return false;
    }

};

xue.ajaxCheck.JSON = function(d) {
	if(!d){ 
    // xue.alert('数据读取错误……');
        return false;
    }
	var tp = d.sign, msg = d.msg;
    if (tp === 0) {
        alert(msg);
        return false;
    }
    if (tp === 2) {
        window.location.href = d.msg;
    }
    if (tp === 1) {
        return msg;
    }
};

xue.ajaxCheck.json = xue.ajaxCheck.JSON;
xue.ajaxCheck.html = xue.ajaxCheck.HTML;


/**
 * 异步加载JS/CSS文件
 * @param  {[type]}   url [description]
 * @param  {Function} fn  [description]
 * @return {[type]}       [description]
 */
xue.load = xue.load || function(url, fn) {
	if(!url){ return xue; }

    var tp = xue.load._checkType(url);
    var callback = null;

    $.each(arguments, function() {
        if (typeof this === 'function') {
            callback = this;
        } else {
            return this;
        }
    });

    xue.load.callback = callback;

    if (xue.load.isExist(url)) {
        // xue.alert('文件已存在');
        if (callback) {
            callback();
        }
        return xue;
    }
    if (tp) {
        xue.load[tp](url);
    }

    return xue;
};

(function() {

    var load = xue.load;

    load.files = {};

    // 回调函数
    load.callback = null;
    load.type = null;
    load.url = null;

    // 加载外部js文件
    load.js = function(url) {

        var _call = load.callback ? load.callback : function() {};

        // 检测文件是否存在，不存在则加载，否则直接返回callback
        if (!this.isExist(url)) {
            var file = document.createElement('script');
            file.type = 'text/javascript';

            if (file.readyState) { // IE
                file.onreadystatechange = function() {
                    if (file.readyState == 'loaded' || file.readyState == 'complete') {
                        file.onreadystatechange = null;
                        _call(true);
                    }
                };
            } else {
				file.onload = function() { _call(true); };
            }
            file.src = url;
            document.getElementsByTagName('head')[0].appendChild(file);
        } else {
            _call(false);
        }

        return this;
    };

    // 加载外部css文件
    load.css = function(url) {
        var _call = load.callback ? load.callback : function() {};

        // 检测文件是否存在，不存在则加载，否则直接返回callback
        if (!this.isExist(url)) {
            var file = document.createElement('link');
            file.type = 'text/css';
            file.rel = 'stylesheet';

            if (file.readyState) { // IE
                file.onreadystatechange = function() {
                    if (file.readyState == 'loaded' || file.readyState == 'complete') {
                        file.onreadystatechange = null;
                        _call(true);
                    }
                };
            } else {
				file.onload = function() { _call(true); };
            }
            file.href = url;
            document.getElementsByTagName('head')[0].appendChild(file);
        } else {
            _call(false);
        }
        return this;
    };

    // 往页面里直接写入script代码
    load.script = function(code) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        try {
            script.appendChild(document.createTextNode(code));
        } catch (ex) {
            script.text = code;
        }
        document.body.appendChild(script);
        return this;
    };

    // 往页面里直接写入style样式
    load.style = function(code) {
        var style = document.createElement('style');
        style.type = 'text/css';
        try {
            style.appendChild(document.createTextNode(code));
        } catch (ex) {
            style.styleSheet.cssText = code;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
        return this;
    };

    // 根据文件路径，判断是js还是css，返回文件类型
    load._checkType = function(url) {
		if(!url){ return; }

        var tp = (url.indexOf('.js') > -1) ? 'js' : (url.indexOf('.css') > -1 ? 'css' : null);
        return tp;
    };

    //检查文件是否存在
    load.isExist = function(url) {
		if(!url){ return; }
        var tp = load._checkType(url);
		if(!tp){ xue.alert('文件格式不对'); return; }

        var tag = tp == 'js' ? 'script' : 'link';
        var src = tp == 'js' ? 'src' : 'href';
        var _files = document.getElementsByTagName(tag);
        for (var i = 0, len = _files.length; i < len; i++) {
            if (_files[i][src].indexOf(url) > -1) {
                return true;
            }
        }
        return false;
    };

})();


/**
 * 加载script文件
 * @param {String}		url
 * @param {sting}		place: 加载文件的位置：head or body
 * @param {Function}	callback
 */
xue.loader = xue.loader || function(url, callback, isBody) {

    // 如果没有url则返回；
	if(!url) { return; }

    var _call = callback ? callback : function() {};

    // 增加setTimeout，解决在loadScript与页面内容之间如果还有script标签的话，一样会阻塞内容下载的问题：http://www.58lou.com/separticle.php?artid=194
    setTimeout(function() {

        // 声明一个“检查文件是否已经存在”的函数，返回布尔值；
        var _isLoad = function() {
            var _scripts = document.getElementsByTagName('script');
            for (var i = 0, len = _scripts.length; i < len; i++) {
                if (_scripts[i].src.indexOf(url) > -1) {
                    return true;
                }
            }
            return false;
        }();

        // 检测文件是否存在，不存在则加载，否则直接返回callback
        if (!_isLoad) {
            var script = document.createElement('script');
            script.async = "async";
            script.type = 'text/javascript';

            if (script.readyState) { // IE
                script.onreadystatechange = function() {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        _call(true);
                    }
                };
            } else {
                script.onload = function() { _call(true); };
            }
            script.src = url + '?' + xue.version;
            // 文件加入的位置：如果 isBody = true 则在body后面追加，否则追加到head后面
            var _place = (isBody) ? 'body' : 'head';
            document.getElementsByTagName(_place)[0].appendChild(script);
        } else {
            _call(false);
        }
        return this;

    }, 0);

};

/**
 * 增加对JSON数据的序列化方法，
 * 主要用于IE6、7不支持JSON对象的浏览器
 */
xue.json = xue.json || {};

xue.json.stringify = function(obj) {
    //如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
    if (window.JSON) {
        return JSON.stringify(obj);
    }
    var t = typeof(obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);

        // fix.
        var self = arguments.callee;

        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (obj.hasOwnProperty(n)) {
                if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null)
                // v = jQuery.stringify(v);
                    v = self(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
/*
 * method : parse(json string)
 * return : js原生值
 */
xue.json.parse = function(jsonString) {
    if (window.JSON) {
        return window.JSON.parse(s);
    }
    //使用到了jquery的parseJSON(s)方法
    return $.parseJSON(jsonString);
};

xue.JSON = xue.json;

/**
 * 模块添加
 * @param  {string}   moduleName	模块名称
 * @param  {Function} callback		回调函数
 * @param  {Boolean}  isQueue		是否加入队列：在队列中的文件逐个加载（非异步）
 * @return {[type]}					加载完成后返回xue对象，可直接链式调用，
 *
 * @example:
 *
 *			xue.add('pages', function(){
 *		
				// 将分页扩展到xue对象下；
				xue.extend('pages', xue.pages);

 *			}).use('pages', function(){
 *				xue.pages.config({
 *					...
 *				});
 *			});
 *
 * 还没想好：如何让链式调用需要放在异步加载成功之后再执行；
 */
// xue.add = xue.add || function(moduleName, callback, isQueue){};

/**
 * 模块调用方法
 *
 * 
 * @param  {string}   moduleName	模块名称
 * @param  {Function} callback		模块加载完成的回调，回调函数中会返回模块对象，方便内部调用
 * @param  {Boolean}  isQueue		是否加入队列：在队列中的文件逐个加载（非异步）
 * @param  {date}     timeout    延时加载的时间以毫秒为单位
 * 
 * @return {[type]}              不管模块是否加载成功，都会返回跟对象，便于链式调用 ; 
 *                               链式调用与模块的加载情况是异步的，没有依赖关系，所以在链式调用中不能确保能够调用到模块中的方法
 * @example
 
		window.onload = (function(){

				xue.use('pages', function(module){
					// 根据模块名称进行调用
					xue.pages.config({
						pages : 22,
						current : 1
					}).go(3);

					// 根据返回的对象进行调用
					module('page2').config({
						pages: 10,
						current: 3
					});
				}, true, 1000).test();
		});
 */
xue.use = xue.use || function(moduleName, callback, isQuequ, timeout) {

    /**
     * 声明内部变量，用于存放传入的参数
     *
     * n  [moduleName] : 模块名称
     * f  [callback]   : 回调函数
     * q  [isQueue]    : 是否加入队列
     * t  [timeout]    : 延迟执行回调的时间
     * tp [typeof]     : 存放参数类型
     *
     * @type {[type]}
     */
	var n = null, f = false, q = false, t = false, tp = null;

    /**
     * 循环参数对象
     *
     * 根据参数的类型存入相应的变量中
     * 如果类型不匹配则返回变量的原始值，防止变量被重复赋值
     */
    $.each(arguments, function(k, v) {
        tp = typeof v;
        n = (tp === 'string') ? v : n;
        f = (tp === 'function') ? v : f;
        q = (tp === 'boolean') ? v : q;
        t = (tp === 'number') ? v : t;
    });

    // 如果没有传入模块名称，则直接返回xue对象，并提示错误；
    if (n === null || n === '') {
        alert('方法调用错误，没有模块名称');
        return xue;
    }

    /**
     * 回调函数
     * @return {object}   xue[n]  返回模块对象
     */
	var _callback = function(){ if(f){ return f(xue[n]); } };

    /**
     * 模块状态判断
     *
     * 如果已经存在，则直接调用回调函数
     * 如果不存在，则通过异步加载模块文件，
     * 文件加载成功之后根据传入的timeout情况来确定是否延时触发回调函数
     */
    if (xue[n]) {
		_callback();
    } else {
        // 调用异步加载方法，默认线上JS模块文件放到 sript/下面，文件名：xue.[模块名].min.js
        xue.loader('http://js04.xesimg.com/xue.' + n + '.min.js', function() {
            if (t) {
                setTimeout(function() {
					_callback();
                }, t);
            } else {
				_callback();
            }
        });

    }
    return this;
};
/**
 * 延时事件
 */
xue.eventDelay = function(dom, fn, timer) {
    this.timer = timer || 1000;
    this.interval = '';
};

xue.eventDelay.start = function(dom, fn) {};

xue.eventDelay.clear = function(dom, fn) {};

xue.delay = xue.eventDelay;

xue.test = function(d) {
    // console.log(d);
};

xue.log = xue.log || function(msg) {
    if (window.console) {
        console.log(msg);
    } else {
        alert(msg);
    }
    return xue;
};

/**
 * @name placeHolder
 * @class 跨浏览器placeHolder,对于不支持原生placeHolder的浏览器，通过value或插入span元素两种方案模拟
 * @param {Object} obj 要应用placeHolder的表单元素对象
 * @param {Boolean} span 是否采用悬浮的span元素方式来模拟placeHolder，默认值false,默认使用value方式模拟
 */
xue.placeholder = function(obj, span) {
    if (!obj.getAttribute('placeholder')) return;
    var imitateMode = span === true ? true : false;
    var supportPlaceholder = 'placeholder' in document.createElement('input');
    if (!supportPlaceholder) {
        var defaultValue = obj.getAttribute('placeholder');
        if (!imitateMode) {
            obj.onfocus = function() {
                (obj.value == defaultValue) && (obj.value = '');
                obj.style.color = '';
            };
            obj.onblur = function() {
                if (obj.value == defaultValue) {
                    obj.style.color = '';
                } else if (obj.value === '') {
                    obj.value = defaultValue;
                    obj.style.color = '#ACA899';
                }
            };
            obj.onblur();
        } else {
            var placeHolderCont = document.createTextNode(defaultValue);
            var oWrapper = document.createElement('span');
            oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
            oWrapper.className = 'wrap-placeholder';
            oWrapper.style.fontFamily = getStyle(obj, 'fontFamily');
            oWrapper.style.fontSize = getStyle(obj, 'fontSize');
            oWrapper.style.marginLeft = parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
            oWrapper.style.marginTop = parseInt(getStyle(obj, 'marginTop')) ? getStyle(obj, 'marginTop') : 1 + 'px';
            oWrapper.style.paddingLeft = getStyle(obj, 'paddingLeft');
            oWrapper.style.width = obj.offsetWidth - parseInt(getStyle(obj, 'marginLeft')) + 'px';
            oWrapper.style.height = obj.offsetHeight + 'px';
            oWrapper.style.lineHeight = obj.nodeName.toLowerCase() == 'textarea' ? '' : obj.offsetHeight + 'px';
            oWrapper.appendChild(placeHolderCont);
            obj.parentNode.insertBefore(oWrapper, obj);
            oWrapper.onclick = function() {
                obj.focus();
            };
            //绑定input或onpropertychange事件
            if (typeof(obj.oninput) == 'object') {
                obj.addEventListener("input", changeHandler, false);
            } else {
                obj.onpropertychange = changeHandler;
            }
            function changeHandler() {
                oWrapper.style.display = obj.value !== '' ? 'none' : 'inline-block';
            }
            /**
             * @name getStyle
             * @class 获取样式
             * @param {Object} obj 要获取样式的对象
             * @param {String} styleName 要获取的样式名
             */
            function getStyle(obj, styleName) {
                var oStyle = null;
                if (obj.currentStyle)
                    oStyle = obj.currentStyle[styleName];
                else if (window.getComputedStyle)
                    oStyle = window.getComputedStyle(obj, null)[styleName];
                return oStyle;
            }
        }
    }
};
xue.placeHolder = xue.placeholder;


jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie  
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
/* ========================== UI 组件 =========================== */

xue.tabs = xue.tabs || function(id, fn) {
    if (id === undefined) {
        return xue.tabs;
    }

    xue.tabs.id = id || 'ui_tabs';
    xue.tabs.handle = $('#' + xue.tabs.id);

    if (xue.tabs.handle.length === 0) {
        return xue.tabs;
    }
    xue.tabs.handle.off('click', 'li');
    xue.tabs.handle.on('click', 'li', function() {
        $(this).addClass('current').siblings('.current').removeClass('current');
        if (typeof fn === 'function') {
            return fn(this);
        } else {
            return false;
        }
    });

    return xue.tabs;
};

/* ========================== module =========================== */





/* ========== 压缩后的模块 ============= */
// 弹窗 
/**
 * @modify : 2013-07-16
 * @by Marco : 已压缩后放置到xue.js中
 */

/**
 * @name xue.dialog.js
 * @description 全站弹窗
 *
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 * @example
    xue.use('dialog', function(dialog){
        var b = new dialog({
            id : 'welcome',
            title : 'adaasdfasfd',
            // title : false,
            width : 500,
            // height: 200,
            close: true,
            left:1,
            arrow:'tr',
            // lock:true,
            lockbg : true,
            // ok : function(){
            //     alert(222);
            //     dialog.close();
            // },
            button : [
                {id : 'step', tp : 'submit', text : '下一步', cls : 'btn_red', fn : function(){
                    alert(b.id);
                }},
                {id : 'test', tp : 'test', text : '测试', cls : 'btn_blue', fn : false}


            ],
            // arrow: 'bl',
            cancel : true,
            content : '欢迎来到学而思网校-新版学习中心'
        });

        var a = new dialog({
            id: '123',
            // title:false,
            title:'2334334534',
            // width: 200,
            ok : function(){
                alert(1111);
                dialog.close();
            },
            arrow : 'bl',
            border: false,
            // close:function(){
            //     alert(3333);
            //     a.close();
            // },
            content : 'afafasfasfsfa'
        });
    });
 */
xue.dialog = xue.dialog || function( opt ){
    var o = {};
    /**
     * 初始化
     *
     * 如果opt是{}对象，则进行配置
     * 如果是字符串，即ID，则检查队列中是否存在，如果存在则设置win.id和win.box为指定id
     *
     * 否则直接合并默认配置
     * 
     * @type {[type]} 返回xue.dailog对象
 */
    if(opt && typeof opt === 'object' && opt.length === undefined){

        $.extend(o, xue.dialog._default, opt);
        xue.dialog._init(o);
        return xue.dialog;

    }else if(opt && typeof opt === 'string'){
        var id = 'xuebox_' + opt;
        var item = xue.dialog.queue[id];
        if(item){
            xue.dialog.id = id;
            xue.dialog.box = item.DOM_BOX;
        }
        return xue.dialog;
    }else{
        $.extend(o, xue.dialog._default);
        xue.dialog._init(o);
    }

    return xue.dialog;
};

(function () {

    var win = xue.dialog;

    win.id = 'xuebox';

    win.tpl = {
        /**
         * 弹窗外围容器
         * @type {String}
         */
        wrap : '<div id="$id$" class="dialog">$dialog_box$ $dialog_close$ $dialog_arrow$</div>',
        /**
         * 关闭按钮
         * @type {String}
         */
        close : '<a href="javascript:void(0);" class="dialog_close">关闭</a>',
        /**
         * 指示箭头模板
         * $arrow_type$ : 按钮位置
         * - tl : 上左
         * - tr : 上右
         * - bl : 下左
         * - br : 下右
         * @type {String}
         */
        arrow : '<div class="dialog_arrow arrow_$arrow_type$"></div>',
        /**
         * 按钮模版
         * $btn_id$   : 
         * $btn_type$ :
         * $btn_cls$  :
         * $btn_text$ :
         * @type {String}
         */
        button : '<button type="button" data-type="$btn_type$" id="$id$_btn_$btn_id$" class="btn $btn_cls$ $btn_type$" href="javascript:void(0);">$btn_text$</button>',
        /**
         * 弹窗容器table
         * $id$ : 
         * $is_title$ : 
         * $is_buttons$ : 
         * $title$ :
         * $content$ : 
         * $buttons$ : 
         * $width$ : 
         * $height$ : 
         * @type {[type]}
         */
        box : '<table class="dialog_box">\n' + '    <thead><tr class="t"><td class="tl"></td><td class="tc"></td><td class="tr"></td></tr></thead>\n' + '   <tbody class="dialog_head $is_title$">\n' + '       <tr class="ct">\n' + '          <td class="cl"></td>\n' + '         <td class="dialog_handle">\n' + '               <p class="dialog_title" id="$id$_title">$title$</p>\n' + '          </td>\n' + '            <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tbody class="dialog_body">\n' + '      <tr class="cc">\n' + '          <td class="cl"></td>\n' + '         <td id="$id$_content" class="dialog_content_wrap"><div class="dialog_content">$content$</div></td>\n' + '           <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tbody class="dialog_foot $is_buttons$">\n' + '     <tr class="cb">\n' + '          <td class="cl"></td>\n' + '         <td class="dialog_buttons" id="$id$_buttons">$buttons$</td>\n' + '          <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tfoot><tr class="b"><td class="bl"></td><td class="bc"></td><td class="br"></td></tr></tfoot>\n' + '</table>\n',
        /**
         * 背景遮罩
         */
        mask : '<div class="dialog_mask"></div>'
    };

    /**
     * 默认配置
     * @type {Object}
     */
    win._default = {
        content   : '<div class="aui_loading"><span>loading..</span></div>',
        title     : '\u6d88\u606f',     // 标题. 默认'消息'
        handle    : null,
        button    : null,               // 自定义按钮
        ok        : null,               // 确定按钮回调函数
        no        : null,               // 取消按钮回调函数
        submit    : null,               // 同 ok
        cancel    : null,               // 同 no
        init      : null,               // 对话框初始化后执行的函数
        close     : null,               // 对话框关闭前执行的函数
        okVal     : '\u786E\u5B9A',     // 确定按钮文本. 默认'确定'
        cancelVal : '\u53D6\u6D88',     // 取消按钮文本. 默认'取消'
        width     : 'auto',             // 内容宽度
        height    : 'auto',             // 内容高度
        minWidth  : 96,                 // 最小宽度限制
        minHeight : 32,                 // 最小高度限制
        padding   : null,        // 内容与边界填充距离,默认：'25px 20px'
        skin      : '',                 // 皮肤名(预留接口,尚未实现)
        icon      : null,               // 消息图标名称
        time      : null,               // 自动关闭时间
        esc       : true,               // 是否支持Esc键关闭
        focus     : true,               // 是否支持对话框按钮自动聚焦
        show      : true,               // 初始化后是否显示对话框
        follow    : null,               // 跟随某元素(即让对话框在元素附近弹出)
        // path      : _path,               // Dialog路径
        lock      : false,              // 是否锁屏
        background: '#000',             // 遮罩颜色
        opacity   : 0.7,                    // 遮罩透明度
        duration  : 300,                // 遮罩透明度渐变动画速度
        fixed     : false,              // 是否静止定位
        left      : null,               // X轴坐标
        top       : null,           // Y轴坐标
        zIndex    : 1000,               // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
        resize    : true,               // 是否允许用户调节尺寸
        drag      : true,               // 是否允许用户拖动位置，
        border    : true,               // 是否显示边框
        cls       : ''                  // dialog外围增加样式：dialog_alert / dialog_win等
    };

    // 设置队列
    win.queue = { /* 'id' : {} */ };


    win._init = function ( opt ) {

        this.id = opt.id ? 'xuebox_' + opt.id : 'xuebox';

        this.queue[this.id] = opt;
        /* --------------- 获取HTML结构 ------------- */

        var _dom = this.tpl.wrap;

        _dom = _dom.replace('$id$', this.id);

        _dom = _dom.replace('$dialog_close$', this._getClose());

        _dom = _dom.replace('$dialog_box$', this._getDOM());

        _dom = _dom.replace(/\$dialog_arrow\$/, this._getArrow());

        /* --------------- 页面中插入 ------------- */
        if($('#xuebox_' + opt.id).length > 0){
            $('#xuebox_' + opt.id).remove();
        }
        // var _top_temp = Number(-2000);
        $(_dom).css('top', Number(-2000)).appendTo('body');
        this.box = $('#' + this.id);
        // this.box.css('top', -2000);
        /* --------------- 存储配置 ------------- */
        // 设置DOM节点到队列中
        
        var dom = {
            DOM_BOX     : this.box,
            DOM_CLOSE   : this.box.find('.dialog_close'),
            DOM_CANCEL  : this.box.find('.btn_cancel'),
            DOM_OK      : this.box.find('.btn_ok'),
            DOM_BUTTONS : this.box.find('.dialog_buttons .btn'),
            DOM_TITLE   : this.box.find('.dialog_title'),
            DOM_CONTENT : this.box.find('.dialog_content_wrap')
        };

        this._setOption('DOM_BOX', dom.DOM_BOX);
        this._setOption('DOM_CLOSE', dom.DOM_CLOSE);
        this._setOption('DOM_CANCEL', dom.DOM_CANCEL);
        this._setOption('DOM_OK', dom.DOM_OK);
        this._setOption('DOM_CONTENT', dom.DOM_CONTENT);
        this._setOption('DOM_TITLE', dom.DOM_TITLE);
        this._setOption('DOM_BUTTONS', dom.DOM_BUTTONS);
        this._setOption(dom);

        /* --------------- 事件绑定 ------------- */

        var that = this;

        // 关闭事件
        this._addClick(dom.DOM_CLOSE, opt.close);

        // 取消事件
        this._addClick(dom.DOM_CANCEL, opt.no || opt.cancel);

        // 确定事件
        this._addClick(dom.DOM_OK, opt.ok || opt.submit);
        
        // buttons的事件绑定
        // {id, tp, text, cls, fn}
        if(opt.button && opt.button.length > 0){
            $.each(opt.button, function(k, v){
                var _btn = $('#' + that.id + '_btn_' + v.id);
                that._addClick(_btn, v.fn);
            });
        }

        // 给Dialog绑定点击事件，点击后重置Dialog的id和dom值
        dom.DOM_BOX.off('mousedown').on('mousedown', function(){
            that.id = $(this).attr('id');
            that.box = $(this);
        });
        /* --------------- 设置定位和尺寸 ------------- */

        this.resize();
        // this(this.id).position();

        /* --------------- 设定背景遮罩 ------------- */
        if(opt.lock){
            var bg = opt.lockbg ? true : false;
            this.lock( bg );
        }

        /* --------------- 判断是否显示边框 ------------- */
        if(opt.border){
            dom.DOM_BOX.removeClass('dialog_noborder');
        }else{
            dom.DOM_BOX.addClass('dialog_noborder');
        }
        // 如果不存在遮罩，则给所有的弹窗增加1px边框样式
        // if($('.dialog_mask').length == 0){
        // $('.dialog').addClass('dialog_noMask');
        // }
        
        /* --------------- 设置圆角 ------------- */
        // 头部存在的时候增加样式
        if(dom.DOM_BOX.find('.dialog_head:hidden').length >0){
            dom.DOM_CONTENT.addClass('dialog_radius_top');
        }else{
            dom.DOM_CONTENT.removeClass('dialog_radius_top');
        }
        // 底部存在的时候增加样式
        if(dom.DOM_BOX.find('.dialog_foot:hidden').length >0){
            dom.DOM_CONTENT.addClass('dialog_radius_bottom');
        }else{
            dom.DOM_CONTENT.removeClass('dialog_radius_bottom');
        }

        /* --------------- 设置外围样式 ------------- */

        if(opt.cls){
            dom.DOM_BOX.addClass(opt.cls);
        }

        /* --------------- 设置延时关闭 ------------- */
        if(opt.time){
            this.timeout(opt.time, dom.DOM_BOX);
        }
        /* --------------- 设置跟随 ------------- */
        if(opt.follow){
            this.follow(opt.follow);
        }

        /* --------------- 设置右上角的关闭按钮 ------------- */
        /**
         * 当内容区域出现滚动条，且没有标题区域的时候，关闭按钮会被滚动条遮住
         *
         * 判断
         */
        // if(!opt.title){
        //  var c = dom.DOM_CONTENT.find('.dialog_content'),
        //      d = c[0];
        //  // 判断容器滚动高度是否大于容器高度，或者容器的 offsetHeight > 容器高度的时候进行调整
        //  if(d.scrollHeight > d.clientHeight || d.offsetHeight > d.clientHeight){
        //      dom.DOM_CLOSE.css('right', 25);
        //  }
        // }

        /* --------------- 设置箭头 ------------- */

        this.arrow(opt.handle);
        /* --------------- 设置IE6兼容 ------------- */
        
        if(xue.isIE6){
            dom.DOM_BOX.addClass('dialog_noshadow');
            // 增加iframe遮罩
            if($('body').find('select').length > 0){
                win.iframe();
            }
        }else{
            dom.DOM_BOX.removeClass('dialog_noshadow');
        }

    };

    win.iframe = function(tp){
        var opt = this.queue[this.id];
        if(!opt){ return ;}
        var w = $('body').width(), h = $('body').height();
        var iframe_tpl = '<iframe id="dialog_iframe" style="position:fixed;width:100%;height:100%;top:0;left:0;_position:absolute;_width:' + w + ';_height:' + h + ';_filter:alpha(opacity=0);opacity=0;border-style:none;z-index:998;"></iframe>';
        // if(!this.iframe){
            $('body').append(iframe_tpl);
        // }
        // this.iframe = $('#dialog_iframe');
    };
    // 获取关闭标签HTML结构
    win._getClose = function(){
        var opt = this.queue[this.id];
        if(!opt){ return ;}
        var _close = opt.close ? this.tpl.close : '';

        return _close;
    };

    // 获取箭头标签的HTML结构
    win._getArrow = function(){
        var opt = this.queue[this.id];
        if(!opt){ return ;}

        var tp = opt.arrow;
        if(tp){
            var html = win.tpl.arrow;
            tp = tp ? (tp === true ? 'bc' : tp ) : 'bc';
            html = html.replace('$arrow_type$', tp);
            return html;
        }else{
            return '';
        }
    };
    // 获取按钮组标签的HTML结构
    win._getButton = function(){
        var opt = this.queue[this.id];
        if(!opt){ return ;}

        /**
         * 获取button数据
         *
         * [{id:'', text:'', tp:'', cls:'', fn}]
         * @type {[type]}
         */
        var btn = opt.button;
        var tpl = this.tpl.button;

        var btns = '';
        var re = {
            id : /\$id\$/g,
            btn: /\$btn_id\$/,
            type : /\$btn_type\$/g,
            cls : /\$btn_cls\$/,
            text: /\$btn_text\$/

        };
        if(btn && typeof btn === 'object' && btn.length > 0){
            $.each(btn, function(k, v){
                var _btn = tpl;
                _btn = _btn.replace(re.id, win.id);
                _btn = _btn.replace(re.btn, v.id);
                _btn = _btn.replace(re.type, 'btn_' + v.tp);
                _btn = _btn.replace(re.cls, v.cls);
                _btn = _btn.replace(re.text, v.text);
                btns += _btn;
            });
        }
        if(opt.submit || opt.ok){
            var _submit = tpl;
            _submit = _submit.replace(re.type, 'btn_ok');
            _submit = _submit.replace(re.id, win.id);
            _submit = _submit.replace(re.btn, 'ok');
            _submit = _submit.replace(re.cls, 'btn_red');
            _submit = _submit.replace(re.text, opt.submitVal || opt.okVal);
            btns += _submit;
        }
        if(opt.cancel || opt.no){
            var _cancel = tpl;
            _cancel = _cancel.replace(re.type, 'btn_cancel');
            _cancel = _cancel.replace(re.id, win.id);
            _cancel = _cancel.replace(re.btn, 'cancel');
            _cancel = _cancel.replace(re.cls, 'btn_gray');
            _cancel = _cancel.replace(re.text, opt.cancelVal || opt.noVal);
            btns += _cancel;
        }
        return btns;
    };

    // 获取整个中间区域的HTML结构
    win._getDOM = function(){

        var opt = this.queue[this.id];
        if(!opt){ return ;}

        var box = this.tpl.box;
        /*
         * $id$ : 
         * $is_title$ : 
         * $is_buttons$ : 
         * $title$ :
         * $content$ : 
         * $buttons$ : 
         * $width$ : 
         * $height$ : 
         */
        var id = this.id || xue.getTime();
        box = box.replace(/\$id\$/g, id);

        /**
         * title
         */
        if(opt.title){
            box = box.replace(/\$is_title\$/, '');
            box = box.replace(/\$title\$/, opt.title);
        }else{
            box = box.replace(/\$is_title\$/, 'hidden');
            box = box.replace(/\$title\$/, this._default.title);
        }

        /**
         * 按钮组
         */
        var _btn = this._getButton(),
            isbtn = _btn ? '' : 'hidden';
        box = box.replace('$buttons$', _btn);
        box = box.replace('$is_buttons$', isbtn);

        /**
         * 内容区域
         */
        box = box.replace('$content$', opt.content);

        return box;
    };

    // 向队列中添加属性
    win._setOption = function(key, val, id){
        var _id = id || win.id;
        var list = win.queue[_id];
        list[key] = val;

        return win.queue;
    };


    /**
     * 事件绑定
     * @param  {selector}   expr 要绑定的元素
     * @param  {Function} fn   要绑定的事件
     * @return {[type]}        [description]
     */
    win._addClick = function(expr, fn){
        var box = $(expr).parents('.dialog'),
            id = (box.length > 0) ? box.attr('di') : this.id;
        
        var _fn = (fn && typeof fn === 'function') ? fn : function(){
            win.close();
        };
        var that = this;
        $(expr).off('click').on('click', function(){
            that.box = $(this).parents('.dialog');
            that.id = that.box.attr('id');

            _fn(this, id);
        });

    };


    /**
     * 返回尺寸
     * @type {Object}
     *
     * 返回值： w = width, h = height, l = left, t = top, s = scrollTop, c = center, m = middle
     */
    win._size = {
        wins : function(){
            var _win = $(window);
            // 窗体尺寸
            var w = {
                w : _win.width(),       // 宽度
                h : _win.height(),      // 高度
                s : _win.scrollTop()    // 滚动高度
            };
            // 窗体垂直中线
            w.c = (w.w / 2);
            // 窗体可显示区域水平中线
            w.m = w.s + (w.h / 2);
            return w;
        },
        box : function(){
            var opt = win.queue[win.id];
            if(!opt){ return win; }
            var box = opt.DOM_BOX;
            // 弹窗的尺寸
            var d = /*this.getSize() ||*/ {
                w  : box.outerWidth(true),
                h : box.outerHeight(true)
            };
            return d;
        },
        handle : function(){
            var opt = win.queue[win.id];
            if(!opt){ return win; }
            var handle = $(opt.handle);
            if(handle.length === 0){ return win; }
            var h = {
                w : handle.width(),
                h : handle.height(),
                l : handle.offset().left,
                t : handle.offset().top
            };
            // handle垂直中心
            h.c = h.l + (h.w / 2);

            return h;
        }
    };


    // 事件绑定
    // win._addEvent = function(ev, expr, fn){};

    // 关闭事件
    win.close = function( fn ){
        var opt = this.queue[this.id];
        if(!opt){ return ;}

        this.box.remove();
        if(xue.isIE6){
            $('#dialog_iframe').remove();
            // this.iframe = null;
        }
        delete this.queue[this.id];

        //关闭的时候检查剩余弹窗中有没有锁定的，如果有则不删除遮罩
        var islock = false;
        $.each(this.queue,function(){
            if(this.lock){ islock = true; }
        });

        if(!islock){
            this.unlock();
        }
    };

    // 设置弹窗的位置
    win.position = function(left, top){
        
        var box = [], opt = this.queue[this.id];

        if((left && typeof left === 'number') || (top && typeof top === 'number')){
            if(!opt){ return ;}
            opt.left = left || opt.left;
            opt.top = top || opt.top;
            box.push(opt);
        }else{
            // 重置所有弹窗的定位
            // $.each(this.queue, function(){
            //  box.push(this);
            // });
            
            // 只设置当前弹窗的定位
            box.push(opt);
        }

        $.each(box, function(){
            var opt = this;
            var box = opt.DOM_BOX;
            var pos = {
                left : left || opt.left || ($(window).width() / 2) - (box.width() / 2),
                top  : top  || opt.top  || ($(window).height() / 2) - (box.height() / 2)
            };
            box.css({
                left : pos.left,
                top  : pos.top
            });
        });
        
        return this;
    };

    // 设置弹窗的大小
    win.resize = function(width, height){
        var opt = this.queue[this.id];
        if(!opt){ return; }

        if((width || opt.width) && (height || opt.height)){
            var box = opt.DOM_BOX;
            var con = box.find('.dialog_content');
            con.css({
                width : width || opt.width,
                height : height || opt.height
            });
            if(opt.padding){
                con.css('padding', opt.padding);
            }
            // 如果没有设置宽度的，则需要延时处理：等dialog加载完成后再设置定位，否则直接设置
            if(!opt.width || opt.width == 'auto'){
                setTimeout(function(){
                    win.position();
                }, 100);
            }else{
                win.position();
            }
        }
        if(xue.isIE6){
            var _box = opt.DOM_BOX;
            _box.css({
                width : _box.width()
            });
            _box.find('.dialog_arrow').css('width', _box.width());
        }
        
        return this;
    };

    // 设置弹窗的层级，默认为1000
    win.zIndex = function(){};

    /**
     * 设置当前焦点,zindex : 2000
     *
     * 其他的Dialog的zindex值设为默认 1000
     *
     * 当点击某个的时候，可以激活当前焦点
     * 
     * @return {[type]} [description]
     */
    win.focus = function(){};

    /**
     * 获取弹窗内容区域
     * @param  {string} tp 获取类型：html / text / dom
     * @return {[type]}    根据类型返回：html(HTML内容) / text(文本) / dom(jQuery对象)
     */
    win.getContent = function( tp ){
        var opt = this.queue[this.id];
        if(!opt){ return ;}

        var DOM = opt.DOM_CONTENT.find('.dialog_content'), con = '';

        if(tp === 'html'){
            con = DOM.html();
        }else if( tp === 'text'){
            con = DOM.text();
        }else{
            con = DOM;
        }

        return con;
    };

    /**
     * 设置遮罩
     * @param  {boolen} lockbg 是否显示背景图片（斜线）
     * @return {[type]}        [description]
     */
    win.lock = function( lockbg ){
        var mask = $('body').find('.dialog_mask');
        if(mask.length > 0){
            mask.show();
        }else{
            $('body').append(this.tpl.mask);
        }
        var newMask = $('.dialog_mask');
        if(lockbg){
            newMask.addClass('mask_bg');
        }else{
            $('.dialog_mask').removeClass('mask_bg');
        }

        if(xue.isIE6){
            var h = Math.max($('body').outerHeight(), $(window).outerHeight());
            newMask.height(h);
        }
        if(newMask.height() < $(window).height()){
            newMask.height($(window).height());
        }
        // $('.dialog').addClass('dialog_noborder');
    };

    /**
     * 取消遮罩
     *
     * 判断当前点击的元素是否有lock，如果没有则不关闭遮罩
     *
     * 如果有，还要看关闭后其他弹层中是否有lock，如果有，则还不能关闭遮罩
     * 
     * @return {[type]} [description]
     */
    win.unlock = function( id ){
        $('.dialog_mask').remove();
    };


    win.content = function( msg ){
        var opt = this.queue[this.id];
        if(!opt){ return this; }
        
        var box = opt.DOM_BOX.find('.dialog_content');
        
        box.html(msg);
        this.resize();
        return this;
    };
    win.title = function( title ){
        var opt = this.queue[this.id];
        if(!opt){ return this; }
        
        var box = opt.DOM_BOX.find('.dialog_title');
        
        box.html( title );

        return this;
    };


    win.timeout = function( timer, box ){
        var t = timer || 2000;
        var that = this;
        var opt = this.queue[this.id];
        if(!opt){ return this; }
        var _box = box || opt.DOM_BOX;
        setTimeout(function(){
            _box.fadeOut(100,function(){
                that.close();
            });
            // if(opt.lock){
            // }
            // delete that.queue[that.id];
        }, t);
    };

    win.getSize = function(){
        var opt = this.queue[this.id];
        if(!opt){ return this; }

        var box = opt.DOM_BOX;
        var width = box.outerWidth(),
            height= box.outerHeight();
        return { width: width, height: height};
    };

    win._getHandleSize = function( expr ){
        var handle = $(expr);
        if(handle.length === 0){ return false; }
        var offset = handle.offset();
        var size = {
            height : handle.outerHeight(true),
            width  : handle.outerWidth(true),
            left   : offset.left,
            top    : offset.top
        };
        return size;
    };

    win.follow = function( expr ){
        var handle = $(expr);
        if(handle.length === 0){ return this; }

        var opt = this.queue[this.id];
        if(!opt){ return this; }

        var box = opt.DOM_BOX;

        if(box.hasClass('dialog_follow')){ box.addClass('dialog_follow'); }

        var dom = this._getHandleSize( handle );
        var size = {
            width : box.outerWidth(true),
            height : box.outerHeight(true)
        };
        win.position(dom.left - (size.width / 2) + (dom.width / 2) , dom.top - (size.height / 2) - dom.height - 11);
        // win.position(dom.left - (size.width / 2) + 10, dom.top - (size.height /2) - dom.height - 10);
        return this;
    };


    /**
     * 箭头定位
     * @param  {[type]} fixe [description]
     * @return {[type]}      [description]
     *
     *
     *
     *    ...... 未完成 .......
     */
    win.arrow = function(handle){
        var _dom = $(handle);
        if(_dom.length === 0){ return; }

        var opt = this.queue[this.id];
        if(!opt){ return this; }
        var box = opt.DOM_BOX;
        

        // 窗体尺寸
        var w = this._size.wins();
        
        var s = this._size.handle();

        // 弹窗的尺寸
        var d = this._size.box();

        // 设置箭头类别
        var c = (s.c < w.c) ? 'l' : 'r',        // 垂直区域
            m = ((s.t - d.h )< w.s) ? 't' : 'b';            // 水平区域
        var tp = m + c;
        var arrow = box.find('.dialog_arrow');

        arrow.removeClass().addClass('dialog_arrow').addClass('arrow_'+tp);

        var aLeft = Math.floor((c == 'l') ? d.w * 0.2 : d.w * 0.8);
        // console.log(s);
        arrow.css({
            'background-position' : aLeft + 'px 0'
        });



        // this.position();

    };


})();



// 拖拽模块


// 箭头模块



// xue.extend('dialog', xue.dialog);



/* ================== 插件 =================== */

xue.alert = function(msg, fn, tm){
    if(!msg || msg === ''){ return; }
    var ok = fn || true;
    var win = xue.dialog;
    return win({
        id      : 'alert',
        cls     : 'dialog_alert',
        title   : false,
        lock    : true,
        close   : false,
        content : msg,
        time    : 3000,
        cancel  : function(){ if(typeof ok === 'function'){ ok(); } xue.dialog('alert').close(); },
        cancelVal: '确定',
        submit  : false
    });
};
xue.confirm = function(msg, fn1, fn2){
    if(!msg || msg === ''){ return; }
    var ok = fn1 || true, no = fn2 || true;
    var win = xue.dialog;
    return win({
        id      : 'confirm',
        cls     : 'dialog_confirm',
        title   : false,
        lock    : true,
        content : msg,
        submit  : function(){ if(typeof ok === 'function'){ ok(); } xue.dialog('confirm').close(); },
        cancel  : function(){ if(typeof no === 'function'){ no(); } xue.dialog('confirm').close(); }
    });
};

xue.poptips = function( msg , expr, timer ){
    if(!msg || msg === ''){ return; }
    var _t = timer ? (typeof timer === 'number' ? timer : 1000) : null;
    var o = {
        id      : 'poptips',
        cls     : 'dialog_poptips',
        title   : false,
        submit  : false,
        cancel  : false,
        lock    : false,
        close   : false,
        follow  : expr || null,
        arrow   : true,
        content : '<div class="dialog_success"><em class="dialog_icon"></em>' + msg + '</div>',
        time    : _t
    };
   
    var win = xue.dialog;


    win(o);

    var box = $('.dialog_poptips');
    box.find('.dialog_arrow').width(box.width());
};

xue.win = xue.dialog;

(function(){
    var w = xue.win;
    var config = {
        id : 'win',
        lock : true,
        close : true,
        title : '标题',
        content : '<div></div>',
        submit : true,
        cancel : true
    };

    $.each(config, function(k, v){
        w._default[k] = v;
    });

})();


// 分页
/**
 * @name xue.pages.js
 * @description 分页组件
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 *
 * @example
 
   1. 默认ID的调用方式：如果不写ID则直接调用ui_pages默认ID
        <div id="ui_pages"></div>
        xue.pages.config({
            pages : 30
        }).go(1);

   2. 非默认ID(ui_pages)的调用方式：size为当前页左右共显示的页码的节点数
        <div id="pages"></div>
        xue.pages('pages').config({
            pages   : 20,
            current : 2,
            size    : 5,
            callback: function(current, pages){
                xue.pages('pages').go(current);
            }
        });

   3. ajax分页，在配置参数中设置callback回掉函数，返回点击的页码和总页数
        <div id="ajax_pages"></div>
        xue.pages('ajax_pages').config({
            pages     : 10,
            callback  : function(pageNumber, allPages){
                $.ajax({
                    url : '',
                    success : function(data){
                        if(data.message === 'success'){
                            xue.pages('ajax_pages').go(pageNumber);
                        }
                    }
                });
            }
        });
 *
 *
 *
 * 
 */


/**
 * 分页构造
 * @param  {string}    id       要渲染分页的容器ID
 * @return {Object}  xue.pages   设置完ID之后返回分页对象
 */
xue.pages = xue.pages || function(id){ xue.pages.id = id || 'ui_pages'; return xue.pages; };

(function(){

    var pg = xue.pages;

    /* ========================== 属性  =============================== */

    /**
     * 用于存储多个分页内容
     * @type {Object}
     *
     * {
        'pages_id': {
            id:'',
            . -----
            .     |
            .      > opt里面的所有内容
            .     |
            . -----
            fn :{},
            callback : null
        }
    };
     */
    pg.queue = {};
    
    /**
     * 分页设置
     * @type {Object}
     *
     * 全局初始化参数，会根据不同ID存入到队列中：pd.queue[id]
     */
    var options = {
        id       : 'ui_pages',
        handle   : '#ui_pages',     // 存放分页内容的容器：初始化之后是jquery对象
        size     : 5,               // 连续显示的页码节点数
        bitwise  : 2,               // 当前页码左右要显示页数的长度
        current  : 1,               // 当前页数
        pages    : 20,              // 总记录数
        pageCount: 20,              // 分页总数
        pageNum  : 20,              // 每页显示的记录数
        prevText : '上一页',           // 上一页显示的文字
        nextText : '下一页',           // 下一页显示的文字
        prev     : '.pages_prev:not(.disable)', // 上一页的样式
        next     : '.pages_next:not(.disable)', // 下一页的样式
        item     : '.pages_item',   // 分页节点
        html     : '',              // 存放分页HTML内容
        fn       : {},              // 事件绑定
        firstText: null,            // 第一页显示的文本: 默认显示 1
        lastText : null,            // 最后一页显示的文本：默认显示 总页数
        isMore   : true,            // 是否显示“...”,
        callback : false            // 点击页数时的回掉函数，返回2个参数：当前页数和总页数
    };

    /**
     * 分页模板
     * 
     * @type {Object}
     * 
     * wrap   : 分页外围容器
     * page   : 分页节点
     * more   : 省略号节点
     * current: 当前页码节点
     * prev   : 上一页节点
     * next   : 下一页节点
     */
    var tpl = {
        wrap    : '<ol class="ui_pages"></ol>',
        page    : '<li class="pages_item" data-page="$pageData$"><a href="javascript:void(0);">$pageText$</a></li>',
        more    : '<li class="pages_more"><span>...</span></li>',
        current : '<li class="pages_current"><span>$pageText$</span></li>',
        prev    : '<li class="pages_prev $disabled$"><a href="javascript:void(0);" class="btn btn_gray $disable$">' + options.prevText + '</a></li>',
        next    : '<li class="pages_next $disabled$"><a href="javascript:void(0);" class="btn btn_gray $disable$">' + options.nextText + '</a></li>'
    };

    /* ========================== 方法 =============================== */
    
    /**
     * 通过外部的设置来修改内部的配置；
     */
    pg.config = function(o){

        /**
         * 如果没有传入ID(直接调用：xue.pages.config，而非：xue.pages('id').config)
         * 则直接调用默认ID(options.id);
         */
        this.id = this.id === undefined ? options.id : this.id;

        // 给队列中增加ID标识
        o.id = o.id || this.id;

        // 给队列中增加分页容器
        o.handle = o.handle || $('#'+o.id);

        // 声明将要放置到队列中的配置参数
        var oo = { opt : {} };

        // 如果传入的配置参数是{}对象，则合并到队列中，否则把全局配置参数合并到队列中
        if(typeof(o) === 'object' && o.length === undefined){
            $.extend(oo, options, o);
        }else{
            $.extend(oo, options);
        }
        
        // 根据连续页数的长度计算出左右的位移数：如果length = 7 则 bitwise = 3
        oo.bitwise = oo.size >> 1;

        // 总页数 = 总记录数 / 每页记录数 : 取最大值
        oo.pageCount = Math.ceil(Number(oo.pages) / Number(oo.pageNum));

        // 配置参数存入到队列当中
        this.queue[this.id] = oo;

        /**
         * 事件绑定
         *
         * 将传入的参数中对应的点击事件存储到队列配置参数当中
         */
        var fn = undefined;
        if(oo.pageClick || oo.prevClick || oo.nextClick){
            fn = {};
        }
        if(typeof(oo.pageClick) === 'function'){
            oo.fn['pageClick'] = oo.pageClick;
        }

        if(typeof(oo.prevClick) === 'function'){
            oo.fn['prevClick'] = oo.prevClick;
        }
        
        if(typeof(oo.nextClick) === 'function'){
            oo.fn['nextClick'] = oo.nextClick;
        }
        
        // 执行事件绑定
        this.fn(this.id, oo.fn);
        
        // 如果配置参数中的当前页数大于0，且总页数大于0时，执行分页
        if(oo.current > 0 && oo.pageCount > 0){
            pg(this.id).go(oo.current);
        }

        // 设置完成后 重置变量，防止污染
        o = oo = fn = this.id = undefined;

        return this;

    };

    /**
     * 返回分页节点
     * @param  {Number} page 页数
     * @param  {string} text 显示的文字：如果不传则直接调用页数
     * @param  {String} tp   节点类型：当前页(current) / 普通页(page)
     * @return {HTML}        节点HTML
     */
    pg.createItem = function(page, text, tp){
        var _tp = tp === 'current' ? 'current' : 'page';
        var _text = text || page;
        var html = tpl[_tp].replace('$pageText$', _text);

        // 将页数存入到节点中的"data-page"属性中
        html = html.replace('$pageData$', page);

        return html;
    };

    /**
     * 返回按钮节点
     * @param  {string}  tp        按钮类型：prev / next
     * @param  {Boolean} isDisable 是否不可点击
     * @return {HTML}              按钮节点
     */
    pg.createBtn = function(tp, isDisable){
        var _tp = tp === 'prev' ? 'prev' : 'next',
            disableCls = isDisable ? 'btn_disable' : '',
            disablewrap = isDisable ? 'disable' : '';
        var btn = tpl[_tp].replace(/\$disable\$/g, disableCls);
            btn = btn.replace(/\$disabled\$/g, disablewrap);
        return btn;
    };

    /**
     * 返回更多节点
     * 
     * @return {[type]} 如果设置中禁用更多节点，则返回空值；否则返回HTML节点
     */
    pg.createMore = function(){
        // 获取队列中的配置
        var opt = this.queue[this.id];

        var btn = opt.isMore ? tpl.more : '';
        return btn;
    };

    /**
     * 返回所有分页HTML结构
     * @param  {Number} current 当前页数
     * @param  {Number} pages   总页数
     * @return {HTML}           所有分页HTML
     */
    pg.createPages = function(cur, page){
        // 获取队列中的配置
        var opt = this.queue[this.id];

        /**
         * 校验分页数
         * @type {[type]}
         *
         * 如果参数中没有总页数，则取配置中的
         * 如果总也是 <= 0 则取 1；
         */
        var pages = page || opt.pageCount;
        opt.pageCount = (pages > 0) ? pages : 1;

        /**
         * 校验当前页数
         * @type {[type]}
         *
         * 如果当前页面大于0，则为当前页；
         * 如果当前页大于总页数，则为总页数；
         * 如果当前页 <= 0时，则为1；
         */
        var current = cur || opt.current;
        opt.current = (current > 0) ? (current > pages ? pages : current) : 1;

        //只有1页的时候只显示1
        if(pages === 1){
            // return this.createItem(1, 1, 'current');
            return ' ';
        }

        /* 
            ----------------------\  开始计算分页  /----------------------
                                   \_____  _____/
                                         \/
        */
        var start, more, items, end, prev, next, length, first, last, html;

        /**
         * 上一页节点：第一页只读
         */
        prev  = this.createBtn('prev', (current === 1 ? true : false));
        
        /**
         * 下一页节点：最后一页只读
         */
        next  = this.createBtn('next', (current === pages ? true : false));
        
        /**
         * 连续页码的起始页数
         */
        start = Number(current - opt.bitwise);
        start = start < 1 ? 1 : start;
        
        /**
         * 连续页码的结束页数
         */
        end   = Number(current + opt.bitwise);
        end = end > pages ? pages : end;
        
        /**
         * “...” 节点
         */
        more  = this.createMore();
        
        /** 
         * 第一页：前五个不显示
         */
        first = (end <= opt.size) ? '' : this.createItem(1, opt.firstText);
        
        /** 
         * 最后一页：后五个不显示
         */
        last  = (start > (pages - opt.size)) ? '' : this.createItem(pages, opt.lastText);

        /**
         * pages(总页数) <= 10 全显示
         */
        if(pages <= 10){
            html = prev;
            for(var i = 1; i <= pages ; i++){
                var tp = i === current ? 'current' : false;
                html += this.createItem(i, i, tp);
            }
            html += next;
            return html;
        }

        /**
         * 前五：连续页码的结束数大于等于连续页码数，
         * 连续页码数具体是多少，按照配置中的连续页码数(opt.size)值确定，默认为连续的5个
         */
        if(end <= opt.size){
            start = 1;
            end = opt.size;
        }

        /**
         * 后五：连续页码的起始数大于总页数减去连续页码数
         */
        if(start > (pages - opt.size)){
            start = (pages - opt.size) + 1;
            end = pages;
        }

        /**
         * 连续的页数
         */
        items = '';
        for(var _i = start; _i <= end; _i++){
            var _tp = _i === current ? 'current' : false;
            items += this.createItem(_i, _i, _tp);
        }

        /* ------------ 开始拼凑分页节点内容 ------------ */
    
        // 上一页 + 首页
        html = prev + first;

        // 前置省略号：如果前面的长度是（连续页数 + 1） 则不显示；
        html += (end <= opt.size + 1) ? '' : more;

        // 分页节点
        html += items;

        // 后置省略号：如果最后剩余的是长度是（连续页数）则不显示；
        html += (start >= (pages - (opt.size))) ? '' : more;

        // 尾页 + 下一页
        html += last + next;

        return html;

    };


    /**
     * 向页面加入HTML分页代码
     * @param  {HTML} html [description]
     * @return {[type]}      [description]
     */
    pg.append = function(html){
        // 获取队列中的配置
        var opt = this.queue[this.id];

        // 如果没有传入参数，则直接从队列中取出
        var _html = html || opt.html;
        
        // 用jquery方法将内容插入到页面中
        $(opt.handle).html(_html);
    };

    /**
     * 返回整个分页的HTML内容
     * @return {[type]} [description]
     */
    pg.getPagesHTML = function(){
        // 获取队列中的配置
        var opt = this.queue[this.id];

        // 通过分页计算获取分页内容
        var list = this.createPages(opt.current, opt.pageCount);
        
        // 将分页外围容器转换为jquery对象
        var wrap = $(tpl.wrap);
        
        // 在外围中插入分页内容
        var html = wrap.html(list);
        
        // 将分页内容存储到队列中
        opt.html = html;

        return html;
    };

    /**
     * 页面跳转
     * @param  {Number} currnet 当前页数
     * @param  {Number} pages   总页数，可选
     * @return {[type]}         [description]
     */
    pg.go = function(current, pages){
        // 如果this.id不存在则直接调用默认ID
        this.id = this.id || options.id;
        
        // 获取队列中的配置
        var opt = this.queue[this.id];

        /**
         * 当前页、总页数校准
         * @type {[type]}
         */
        opt.current = (current > 0) ? current : opt.current;
        opt.pageCount = pages || opt.pageCount;

        var html = this.getPagesHTML();

        // 向页面中插入分页内容
        this.append(html);

        $('html,body').animate({
            scrollTop : 0
        }, 'fast');
        
        return this;
    };

    /* ========================== 事件 =============================== */

    /**
     * 事件绑定
     * @param  {Object} option 支持3种事件：{
     *                                      pageClick : function(){},
     *                                      prevClick : function(){},
     *                                      nextClick : function(){}
     *                                      }
     * @return {Number}    opt.current    每个事件都会返回点击后的当前页数
     */
    pg.fn = function(id, option){
        // 获取队列中的配置
        var opt = this.queue[id];

        // 声明默认的点击事件：直接执行go方法；
        var _click = function(num, all){
            pg(id).go(num, opt.pageCount);
        };

        /**
         * 检查配置中的事件绑定
         *
         * 如果配置中有回掉，则直接绑定回掉函数；
         * 否则判断在队列中是否配置节点的点击事件，如果有则绑定
         * 
         * @param  {Number} num 当前页数
         * @param  {String} tp  事件类型
         * @return {[type]}     调用后的返回值： 如果存在回调则会返回 undefined 否则返回 'default'
         */
        var _checkFn = function(num, types){
            var tp = types || 'page';

            // 如果有回调则直接返回回调
            if(opt.callback){
                return opt.callback(num, opt.pageCount);
            }

            // 如果有：pageClick / parvClick / nextClick则直接返回
            if(opt.fn[ tp + 'Click' ]){
                return opt.fn[ tp + 'Click' ](num, opt.pageCount);
            }

            // 如果以上检查后都无效，则直接返回，用于点击事件判断
            return 'default';
            
        };

        /**
         * 声明在点击事件中用到的变量
         *
         * currentNumber   : 存储点击页码
         * checkValue      : 存储检测是否有回调函数的返回值，如果有回调则返回 undefined，否则返回 default 可以直接执行默认事件
         * i               : 为了防止回调中不执行go方法仍然累计的问题，增加临时存储当前页码的变量，用于点击上/下一页按钮时的页码累计，而非修改真实的当前页码
         * 
         * @type {Number}
         */
        var currentNumber = 1, checkValue = false, i = 1;

        opt.handle.off('click', opt.item);
        /**
         * 分页节点点击事件
         * @return {[type]} [description]
         */
        opt.handle.on('click', opt.item, function(){

            // 通过节点的data-page属性获取页数
            currentNumber = $(this).data('page');

            checkValue = _checkFn(currentNumber, 'page');

            // 当以上2种情况都没有时，绑定默认的点击事件
            if(checkValue !== undefined){
                return _click(currentNumber);
            }
        });


        opt.handle.off('click', opt.prev);
        /**
         * 上一页点击事件
         */
        opt.handle.on('click', opt.prev, function(){
            var that = $(this);
            if(that.find('.btn_disable').length > 0){
                return false;
            }
            i = opt.current; i--;

            // 页码校准：上一页不能 < 1;
            currentNumber = (i > 0) ? i : 0;
            
            checkValue = _checkFn(currentNumber, 'prev');
            
            if(checkValue !== undefined){
                return _click(currentNumber);
            }
        });

        opt.handle.off('click', opt.next);
        /**
         * 下一页点击事件
         * @return {[type]} [description]
         */
        opt.handle.on('click', opt.next, function(){
            var that = $(this);
            if(that.find('.btn_disable').length > 0){
                return false;
            }
            i = opt.current; i++;

            // 页码校准：下一页不能 > 总页数
            currentNumber = (i > opt.pageCount) ? opt.pageCount : i;

            checkValue = _checkFn(currentNumber, 'next');

            if(checkValue !== undefined){
                return _click(currentNumber);
            }
        });
    };

/**
     * 自定义点击节点的回掉函数
     * @param  {Function}    fn             回掉函数
     * @return {Number}      opt.current    当前页数
     * @return {jQuery DOM}  data           返回jquery构造的分页节点HTML
     */
    pg.click = function(fn){
        // 获取队列中的配置
        var opt = this.queue[this.id];
        
        if(typeof fn === 'function'){
            var html = pg(this.id).getPagesHTML();

            return fn(opt.current, html);
        }
    };

})();



/**
 * @name xue.message.js
 * @description 信息
 *
 * @module
 * @submodule
 * @main
 * @class
 * @constructor
 * @static
 */

xue.message = xue.message || {};

(function() {
    var m = xue.message;

    /**
     * 激活当前类别的信息
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    m.setCurrent = function(type) {
        var tp = type || 1;

        var box = $('#nav_tab'), list= box.find('li');
        var act = box.find('li[data-type="' + tp + '"]');
        if(act.length === 0){ return false; }

        // 让对应类别进行一次模拟点击
        act.click();

        // m.clearNewTips( tp );
    };

    /**
     * 清除新消息提示
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    m.clearNewTips = function(type) {
        var tp = type || 1;
        var top = $('#header .ui_topbar_pop .msg_tips li[data-type=' + tp + ']'),
            pop = $('#header .layer_news_tips .msg_tips li[data-type=' + tp + ']'),
            nav = $('#nav_tab li[data-type="' + tp + '"]');
        // 清除顶部下拉列表里面的数字
        if (top.length > 0) {
            top.find('a strong').remove();
        }
        // 清除顶部悬浮新消息里面的内容
        if (pop.length > 0) {
            var wrap = pop.parents('.layer_news_tips');
            pop.remove();
            if (wrap.find('li').length === 0) {
                wrap.remove();
            }
        }
        // 清除我的通知页面里 通知类别上的小红点
        if (nav.length > 0) {
            nav.find('em.icon_new').remove();
        }

        // 当全部新消息为空的时候，清除新消息的小圆点；
        var top_new_icon = $('em.icon_messages').parent().find('em.icon_new'),
            top_new = $('.ui_topbar_pop strong');

        if (top_new.length === 0) {
            top_new_icon.remove();
            $('#header .loginbar .tips').children('p').find('em.icon_new').remove();
        }
    };

})();



// 输入框焦点提示效果：by bluebird
jQuery.focusblur = function(focusid) {
    var focusblurid = $(focusid);
    var defval = focusblurid.data('place');
    focusblurid.focus(function() {
        var thisval = xue.isIE ? $(this).val() : $(this).prop('placeholder');
        if (thisval == defval) {
            if (xue.isIE) {
                $(this).val('');
            } else {
                $(this).prop('placeholder', '');
            }
        }
    });

    focusblurid.blur(function() {
        var thisval = xue.isIE ? $(this).val() : $(this).prop('placeholder');
        if (thisval === '') {
            if (xue.isIE) {
                if (!$(this).is(':password')) {
                    $(this).val(defval);
                }
            } else {
                $(this).prop('placeholder', defval);
            }
        }
    });
};

//倒计时
xue.countdown = null;
xue.updateEndTime = function(boxs) {
    var box = $(boxs);
    if (box.length === 0) {
        return false;
    }
    var date = new Date();
    var time = date.getTime(); //当前时间距1970年1月1日之间的毫秒数
    box.each(function(i) {
        var endDate = this.getAttribute("endTime"); //结束时间字符串
        //转换为时间日期类型
           var endDate1 = eval('new Date(' + endDate.replace(/\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
        var endTime = endDate1.getTime(); //结束时间毫秒数
        var lag = (endTime - time) / 1000; //当前时间和结束时间之间的秒数
        var nMS = 2000000000 * 1000 - date.getTime();
        if (lag > 0) {
            var nMS2 = Math.floor(nMS / 100) % 10;
            var second = Math.floor(lag % 60);
            var minite = Math.floor((lag / 60) % 60);
            var hour = Math.floor((lag / 3600) % 24);
            // xue.log(hour % 24);
            var day = Math.floor((lag / 3600) / 24);
            $(this).html(day + "天 " + hour + "时" + minite + "分" + second + "." + nMS2 + "秒");
        } else
            $(this).html("优惠已经结束啦！");
    });

    xue.countdown = setTimeout(function() {
        xue.updateEndTime(box);
    }, 100);
};
xue.clearEndTime = function() {
    clearTimeout(xue.countdown);
};

/* ========== 全局事件 ============= */
// window尺寸发生变化时
$(window).resize(function() {
    if ($('.dialog').length > 0) {
        xue.win.position();
    }
});
// 页面滚动时
// $(window).scroll(function(){

// });

$(function() {

    if (xue.isFirefox) {
        // 火狐下禁止缓存表单
        $('input').prop('autocomplete', 'off');
    }

    //头部选课程
    var topselect_course = false,
        topselect_interval = null,
        topselect_i = 0,
        topselect_message = 0,
        topselect_setting = 0,
        topselect = {
            0: 0,
            1: 0,
            2: 0
        };
    $('#header .navs li.course').on('mouseenter', function(a) {
        var that = $(this);
        topselect_interval = setInterval(function() {
            topselect_i++;
            if (topselect_i > 3) {
                that.addClass('course_select');
            }
        }, 100);

        that.on('mouseleave', function(event) {
            that.removeClass('course_select');
            clearInterval(topselect_interval);
            topselect_i = 0;
        });
        that.find('.layer_head_menu').on('mouseenter', function() {
            clearInterval(topselect_interval);
            topselect_i = 0;
        });


    });
    // 头部右侧点击下拉

    $('#header .loginbar > li').on('mouseenter', function(ee) {
        var that = $(this);
    	if(that.hasClass('shopcart')){ return false; }

        var newMessage = $('.layer_news_tips'),
            index = $(this).index();
        topselect_interval = setInterval(function() {
            topselect_message++;
            if (topselect_message > 3) {
                that.addClass('current');
                // newMessage.hide();
            }
        }, 100);

        that.off('mouseleave').on('mouseleave', function(event) {
            that.removeClass('current');
            // newMessage.show();
            clearInterval(topselect_interval);
            topselect_message = 0;
        });
    });


    // 头部新消息浮层的关闭事件
    $('#header .layer_news_tips .close').on('click', function() {
        var box = $(this).parents('.layer_news_tips');
        box.remove();
    });

    // 头部信息点击事件
    $('#header .msg_tips a').on('click', function() {
        var that = this, a = $(this).attr('href').split('#_'), loc = window.location;
        var link = { url : a[0], tp  : a[1] };
        var href = { url : loc.pathname, tp  : loc.href.split('#_')[1] };
        // 如果不是消息页面，直接跳转
        if(link.url !== href.url){ return true; }

        // 如果时信息页面则执行
        xue.use('message', function() {
            xue.message.setCurrent(link.tp);
        });
    });
    // 绑定老师头像切换事件
    $('body').off('click', '.avatar_roll a, .ui_avatar_con .prev, .ui_avatar_con .next').on('click', '.avatar_roll a, .ui_avatar_con .prev, .ui_avatar_con .next', function() {
        var that = $(this);
        if (that.hasClass('none')) {
            return false;
        } else {
            xue.use('avatar', function() {
                xue.avatar.toggle(that);
            });
        }
    });

    var userinfo_temp = false, userinfo_dom = null, userinfo_show = null, userinfo_interval = false;

    // 绑定所有V用户的鼠标滑过事件：弹出用户信息
    $('body').off('mouseover', '.ui_userinfo').on('mouseover', '.ui_userinfo', function(ev) {
        var d = $(this).data();
        var that = $(this);
        if(!d.params){ return; }

        // var ra = ev; ra.relatedTarget;

        userinfo_show = true;
        userinfo_dom = that;
        setTimeout(function() {
            if (userinfo_show) {
                // that = userinfo_dom;
                userinfoShow(userinfo_dom);
            }
        }, 800);
        // return;
        var userinfoShow = function(udom) {

            var temp = udom.find('.pop_userinfo_temp');
            if (temp.length > 0) {
                var msg = temp.html();
                xue.use('userinfo', function() {
                    xue.userinfo.show(udom, msg);
                });
            } else {
                if (!udom.hasClass('info_open')) {

                    var url = window.location.hostname == 'v04.xesui.com' ? '../json/pop_userinfo.php' : '/Dynamics/ajaxTeacherInfo';
                    $.ajax(url, {
                        type: 'POST',
                        dataType: 'html',
                        data: d.params,
                        success: function(result) {
                            // var msg = xue.ajaxCheck.HTML(result);
                            if (result.substr(0, 1) == '<') {
                                // if(result.sign == 1){
                                xue.use('userinfo', function() {
                                    if (xue.userinfo) {
                                        xue.userinfo.show(udom, result);
                                    }
                                });
                            }
                        }
                    });
                }
            }

            udom.addClass('info_open');

            userinfo_temp = true;
        };



        that.off('mouseout').on('mouseout', function(a, b, c, d) {
            userinfo_temp = false; userinfo_show = false; userinfo_dom = null;

            var re = $(a.relatedTarget);
            var _c = $('.dialog_userinfo').find(re);

            if (_c.length > 0) {
                userinfo_temp = true;
            }
            setTimeout(function() {
                if (!userinfo_temp) {
                    xue.win('userinfo').close();
                    that.removeClass('info_open');
                }
                that = null;
            }, 500);
        });

    });

    $('body').off('mouseover', '.dialog_userinfo').on('mouseover', '.dialog_userinfo', function(a) {
        userinfo_temp = true;
    });

    $('body').off('mouseout', '.dialog_userinfo').on('mouseout', '.dialog_userinfo', function(a) {
        var re = a.relatedTarget;
        var c = $(this).find(re);
        if (c.length === 0) {
            userinfo_temp = false;
            setTimeout(function() {
                if (!userinfo_temp) {
                    xue.win('userinfo').close();
                    $('.ui_userinfo').removeClass('info_open');
                }
            }, 500);
        }
    });
    if (xue.subdomain && xue.subdomain != 'bbs') {
        xue.use('feedback');
    }

    $('input[placeholder]').each(function() {
        var tips = $(this).prop('placeholder');
        $(this).data('place', tips);
        if (xue.isIE) {
            if ($(this).val() === '' && !$(this).is(':password')) {
                $(this).val(tips);
            }
        }
        $.focusblur(this);
    });
    // <script type="text/javascript" src="https://getfirebug.com/firebug-lite-debug.js"></script>
    // xue.loader('https://getfirebug.com/firebug-lite-debug.js');

    // 选课下拉效果
    $('.GradeMenu').hover(function() {
        $(this).addClass('hover'); //添加hover,显示
    }, function() {
        $(this).removeClass('hover'); //删除hover,隐藏
    });


    // 每日五题：点击展示功能提示
    $('.task_five').on('click', function(){
        var that = $(this), _that = null;
        // if(that.find('.task_days_btn').length > 0 || that.find('.task_finish').length > 0){
        //     return false;
        // }
        xue.use('feed', function(){
            if(that.find('.task_days_btn').length > 0 || that.find('.task_finish').length > 0){
                if(that.find('.task_days_btn').length > 0){
                    _that = that.find('.task_days_btn');
                    xue.feed.extend.fiveQuestionSubmit(_that);
                }
            }else{
                _that = that.find('.task_days');
                xue.feed.extend.fiveQuestionWinTips(_that);
            }


        });
    });

    // function fiveQuestionReceiveAwards(){
    //     xue.use('feed', function(){
    //         xue.feed.extend.fiveQuestionSubmit(that);
    //     });
    // }

    // 每日五题：点击领取效果
    // $('.task_five').on('click', '.task_days_btn', function(){
    //     var that = $(this);
    //     xue.use('feed', function(){
    //         xue.feed.extend.fiveQuestionSubmit(that);
    //     });
    // });

    // 每日五题：鼠标划过出现简单提示
    $('.task_five').on('mouseenter', '.task_days_btn, .task_finish', function(){
        var that = $(this);
        xue.use('feed', function(){
            xue.feed.extend.fiveQuestionTips(that);
        });
    });
});


/* ========================== IE6兼容 =========================== */
// IE6下的内容
if (xue.isIE6) {
    xue.use('ie6', function() {
        xue.ie6.png();
    });
}

