;/*!/widget/Module.Dropdown/dropdown.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-30 14:50:51
 * @version $Id$
 */

var dropdown = dropdown || {};
//var $ = require('jquery');


//头部菜单显示隐藏
dropdown.show = function (e) {
    var that = $(e);
    that.addClass('hover').siblings().removeClass('hover');
    that.find('.dropdown-body').show();
    that.on('mouseleave', function (event) {
        that.removeClass('hover');
        that.find('.dropdown-body').hide();
    });
};
dropdown.init = function(handle){
    $('.ui-dropdown').on('mouseenter', function (event) {
        dropdown.show(this);
    });
};
//$(function () {
//    //头部菜单
//    $('.ui-dropdown').on('mouseenter', function (event) {
//        dropdown.show(this);
//    });
//
//});

;/*!/widget/Module.Follow/follow.js*/
/**
 * 
 * 
    关注按钮：
    <div class="ui_follow add focus_m" data-url="/teachers/follow/" data-params="urlStr=287&amp;urlKey=30a7f6b663710b1824a13eca674021ae" data-type="3"> 
		<em>+</em>关注
	</div>
 
    已关注，带取消：
    <div class="ui_follow follow_cancel" data-url="/teachers/follow/" data-value="425" data-params="urlStr=425&amp;urlKey=7830acaf10067e0302053fb4f9d0c6e0" data-type="2"> 
        <em class="addsucess"></em>
        已关注 <i class="line">|</i>
        <a href="javascript:void(0)" class="">取消</a>
    </div>
    
    已关注：
    <div class="ui_follow follow_cancel" data-url="/teachers/follow/" data-params="urlStr=30263&amp;urlKey=a0fb1a25fcfffd5722a8a9d8db52215e" data-type="2"> 
        <em class="addsucess"></em>已关注
    </div>
    
    $().follow({
        
    });
 
 */

;(function($){
    // 默认配置
    var defaults = {
        url: '', // 每页的条目数
        type: 1, // 关注按钮类型：1、灰底；2、加关注；3、已关注，取消
        params : null, // 点击关注时请求ajax的携带的参数
        state: 1, // 关注状态：1. 不可取消； 2. 可取消
        goto : window.location.href
    };
    /*
     * @name 关注老师操作
     * @param userId:被关注人id，type:操作类型(1:改为已关注，2：改为取消关注成功，3：改为已关注可取消状态，4：改为取消关注成功且删除)
     * @return sign(0:未登录，1：成功 2：失败 3：未登录)
     */
    // 发送请求
    var _followPost = function(options){
//        console.log('ajax:');
        var that = $(this);
        var data = that.data();
        var settings = $.extend({}, defaults, data);
        settings.tp = (that.find('a.follow_add').length > 0) ? 'add' : 'cancel';
//        console.log('data-type: ' + settings.type);
        if(!settings.url){
            return false;
        }
        $.ajax({
            type: "post",
            url: settings.url,
            timeout: 7000,
            dataType: 'json',
            data: settings.params  + '&type=' + settings.type,
            success: function(msg) {
                if (msg.sign == 2) {
                    window.location.href = msg.msg;
                }else if(msg.sign == 1) {
                    var btnCls = that.find('.follow_add').hasClass('btn') ? 'btn' : 'btn-sm';
                    var btn = that.find('a');
                    if(settings.tp == 'add'){
                        defaults.tp = 'cancel';
                        btn.removeClass('follow_add btn-warning').addClass('btn-default');
                        var cls = btn.attr('class');
                        var tpl = '<span class="' + cls + '">已关注</span> ';
                        if(settings.state == 2){
                            tpl += '<a href="###" class="' + btnCls + ' btn-link text-primary follow_cancel">取消关注</a>';
                        }
                        that.html(tpl);
                        follows.unbind.call(that.find('.follow_add'));
                    }else{
                        defaults.tp = 'add';
                        btn = that.find('a').prev();
                        btn.removeClass('btn-default').addClass('btn-warning follow_add');
                        var cls = btn.attr('class');
                        var tpl = '<a href="###" class="' + cls + '">+ 关注</a>';
                        that.html(tpl);
                        follows.unbind.call(that.find('.follow_cancel'));
                    }
                    var _type = data.type == 1 ? 2 : 1;
//                    console.log('data: ' + data.type);
//                    console.log('type: ' + _type);
                    that.data('type', _type);
                    
                    return;
                }else{
                    alert(msg.msg);
                }
            },
            error: function() {
                alert('数据读取错误..');
            }
        });
    };
    var follows = {
        // 初始化
        init : function(options){
//            console.log('init:');
        },
        bind : function(options){
            var that = $(this);
            that.off('click', 'a').on('click', 'a', function(){
                if($(this).hasClass('follow_add')){
                    follows.add.call(that);
                }else if($(this).hasClass('follow_cancel')){
                    follows.cancel.call(that);
                }
            });
            return;
        },
        unbind: function(){
            $(this).off('click', 'a');
        },
        // 加关注
        add : function(opt){
//            console.info('add: ');
            _followPost.call(this);
        },
        // 取消关注
        cancel : function(opt){
//            console.log('cancel: ');
            _followPost.call(this);
        },
        // 返回关注、已关注的HTML结构
        template: function(tp){
            var tpl = '';
            switch(tp){
                // 1:改为已关注
                case 1:
                    tpl = '';
                    break;
                // 2：改为取消关注成功
                case 2:
                    tpl = '';
                    break;
                // 3：改为已关注可取消状态
                case 3:
                    tpl = '';
                    break;
                // 4：改为取消关注成功且删除
                case 4:
                    tpl = '';
                    break;
            }
            return tpl;
        }
    };

    $.fn.follow = function(method){
        if($.isEmptyObject(method)){
            return this.each(function(){
                var that = $(this), data = that.data();
                // 如果data为空则退出
                if($.isEmptyObject(data)){ 
                    return false; 
                }else{
                    follows.bind.call(this, data);
                }
                return this;
            });
        }else if (follows[method]) {
            return follows[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object') {
            return follows.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on $.follow');
        }
    };

})(jQuery);

;/*!/widget/Public.Header/header.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-30 14:50:51
 * @version $Id$
 */
//首页倒计时
    var xue = xue || {};
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
            if(endDate){
                    //转换为时间日期类型
                    var endDate1 = eval('new Date(' + endDate.replace(/\d+(?=-[^-]+$)/, function(a) {
                        return parseInt(a, 10) - 1;
                    }).match(/\d+/g) + ')');
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
                        //$(this).html(day + "<span>天</span> " + hour + "<span>时</span>" + minite + "<span>分</span>" + second + "." + nMS2 + "<span>秒</span>");

                    } else{
                        $(this).html("优惠已经结束啦！");
                        $(this).parents('.course-endtime').hide();
                    }
            }
        });

        xue.countdown = setTimeout(function() {
            xue.updateEndTime(box);
        }, 100);
    };
    xue.clearEndTime = function() {
        clearTimeout(xue.countdown);
    };
$(function () {
    $('#module-header').on('keydown', '.h-search input.h-text', function (e) {
        if (e.which == 13) {
            try {
                search();
            } catch (e) {}
        }
    });
});

;/*!/widget/Public.MiniCart/minicart.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-30 14:50:51
 * @version $Id$
 */

/* ========================== Ajax封装通用类 =========================== */
var xue = xue || {};
    xue.ajaxCheck = xue.ajaxCheck || {};

xue.alert = function(tips){
    alert(tips);
};
xue.ajaxCheck.html = function( str ){
    if(!str){ 
        //xue.alert('数据读取错误……');
        return false; 
    }
    var str = $.trim(str);
    if(str.substr(0,1)=='<'){
        return str;
    }else if(str.substr(0,4)=='http' || str.substr(0,1)=='/'){
        window.location.href = str;
        return false;
    }else{
         if(str.substr(0,6) == 'error:'){
             alert(str);
             return false;
         }
    }
};

xue.ajaxCheck.json = function( d ){
    if(!d){ 
        //xue.alert('数据读取错误……');
        return false; 
    }
    var tp = d.sign, msg = d.msg;
    if(tp === 0){
        xue.alert(msg);
        return false;
    }
    if(tp === 2){
        window.location.href = d.msg;
    }
    if(tp === 1){
        return msg;
    }
};

loadingHtml =  function(){document.write("<div id='loading' style=\"position:absolute;top:0;left:0;width:100%;height:100%;background:#000;opacity:0.1;filter:alpha(opacity=10);\"><div style=\"position:absolute;left:50%;top:50%;\"><i class='fa fa-spinner fa-spin'></i></div></div>");} 
function beforeSendfn(){  
   $("body").append(loadingHtml);  
}
function completefn(){  
   $("#loading").remove();
}  

$.ajaxSetup({
  type: 'post',
  dataType: 'json'
}); 

var miniCart = miniCart || {};
var miniUrl = $('#myCartUrl').attr('href');
//头部购物车显示隐藏
miniCart.shopCart = function(e){
    var that = $(e);
    var _html = that.find('#miniCart-body').html();
    if(_html !== ''){
        that.addClass('hover');
        return false;
    }else{
            var url = '/ShoppingCart/ajaxGetCartList/';
            $.ajax({
	         	url: url,
	         	type: 'POST',
	         	dataType: 'html',
	         	success:function (result) {
                       that.addClass('hover');
                       $(result).appendTo('#miniCart-body');
	         	}
	         });
    }
   //鼠标移出
	$('body').on('mouseleave','.ui-dropdown-miniCart',function(event) {
		$(this).removeClass('hover');
	});
};
 //删除头部购物车里的课程
    miniCart.shopCartDel = function(e){
        var that= $(e),
                _id = that.data('id'),
                _num = $('.minicart-footer .minicart-total').data('num');
        var url = miniUrl + '/ShoppingCart/delCart/';
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'jsonp',
                    data: {id:_id},
                    jsonp:'jsonpCallback',
                    success:function (result) {
						if(result.sign == 2){
							 window.location.href = result.url;
						}
                        if(result.sign == 1){
                            $('small.minicart-total').text(_num - 1);
							$('.dropdown-body').empty();
							$.ajax({
								url:'/ShoppingCart/ajaxGetCartList/',
								type: 'POST',
								dataType: 'html',
								success:function (result) {
									   $(result).appendTo('#miniCart-body');
								}
							 }); 
                        }
                    }
                 });    
    }
$(function(){
	//头部购物车鼠标移入
	$('.ui-dropdown-miniCart').on('mouseenter',function() {
         miniCart.shopCart(this);
      
	});
    //删除头部购物车里的课程
    $('body').on('click','.course-function .delete',function(){
        miniCart.shopCartDel(this);
    });
    
});








;/*!/widget/Public.Nav/nav.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-30 14:50:51
 * @version $Id$
 */

var nav = nav || {};

nav.opt = {
    id: '#ui-categorys',
    handle: '.category-dt',
    body: '.category-dd',
    layer: '.category-layer',
    items: '.category-items',
    item: '.category-item',
    subjects: '.category-subject',
    dataUrl : 'nav.json',
    fixed : false

};
//nav.get = function (url, callback) {
//    var _opt = this.opt;
//    var _url = url || _opt.dataUrl;
//    var _handle = $(_opt.handle),
//        _body = $(_opt.body);
//    if ($(nav.opt.item).length > 0) {
//        return;
//    }
//    $.ajax({
//        url: _url,
//        type: 'GET',
//        dataType: 'json',
//        success: function (result) {
//            if (result.content.length <= 0) {
//                return;
//            }
//            var _item = [],
//                _tpl = '<ul>',
//                _sub = '',
//                _con = result.content;
//            $.each(_con, function (k, v) {
//                _tpl += '<li class="category-item item'+ v.id +'" data-id="' + v.id + '">' + '<h3>' + v.name + ' <i class="icon icon-arrow-right pull-right">&gt;</i></h3>' + '<p class="row">';
//                _sub += '<div class="category-subject" id="subject_' + v.id + '" data-id="' + v.id + '">';
//                $.each(v.items, function (i, c) {
//                    _tpl += '<a href="' + c.link + '" class="col-xs-3" data-id="' + c.id + '">' + c.name + '</a>';
//                    _sub += '<dl class="subitem" data-id="' + c.id + '">' + '<dt>' + c.name + '</dt>' + '<dd class="row">' + c.content + '</dd>' + '</dl>';
//                });
//                _tpl += '</p></li>';
//                _sub += '</div>';
//            });
//            _tpl += '</ul>';
//            $(_opt.items).html(_tpl);
//            $(_opt.layer).html(_sub);
//        },
//        error: function(a, b, c, d){
////            console.log(arguments);
//        }
//    });
//};
nav.get = function (url, callback) {
    var _opt = this.opt;
    var _url = url || _opt.dataUrl;
    var _handle = $(_opt.handle),
        _body = $(_opt.body);
    // console.log($(nav.opt.item).length);
    if ($(nav.opt.item).length > 0) {
        return;
    }
    $.ajax({
        url: _url,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            console.log(result);
            if (result.data.length <= 0) {
                return;
            }
            var _item = [],
                _tpl = '<ul>',
                _sub = '',
                _con = result.data;
            $.each(_con, function (k, v) {
                _tpl += '<li class="category-item item'+ v.id +'" data-id="' + v.id + '">' 
                    + '<h3>' + v.name + ' <i class="icon icon-arrow-right pull-right">&gt;</i></h3>' 
                    + '<p class="row">' + v.info + '</p></li>';
                _sub += '<div class="category-subject" id="subject_' + v.id + '" data-id="' + v.id + '">' + v.content + '</div>';
            });
            _tpl += '</ul>';
            $(_opt.items).html(_tpl);
            $(_opt.layer).html(_sub);
        },
        error: function(a, b, c, d){
            console.log(arguments);
        }
    });
};

nav.show = function () {
    this.get();
    $(nav.opt.id).addClass('hover');
};
nav.hide = function () {
    var that = $(nav.opt.id);
    if (that.hasClass('fixed')) {
        nav.sub.hide();
        return false;
    }
    that.removeClass('hover');
    nav.sub.hide();
};
nav.sub = {
    show: function (id) {
        var _sub = $('#subject_' + id),
            _item = $(nav.opt.item + '.item' + id);
        _item.addClass('hover').siblings().removeClass('hover');
        _sub.addClass('hover').siblings().removeClass('hover');
        $(nav.opt.layer).addClass('hover');
    },
    hide: function () {
        $(nav.opt.item).removeClass('hover');
        $(nav.opt.layer).removeClass('hover');
    }
};
nav.init = function(o){
    $.extend(this.opt, o);
    
    if(this.opt.fixed){
        $(this.opt.id).addClass('fixed hover');
    }else{
        $(this.opt.id).removeClass('fixed hover');
    }
    
    if ($(nav.opt.id).hasClass('hover')) {
        nav.show();
    }
    $(nav.opt.body).on('mouseenter', nav.opt.item, function () {
        var _id = $(this).data('id');
        nav.sub.show(_id);
    });

    $(nav.opt.handle).on('mouseenter', function () {
        nav.show();
    });
    $(nav.opt.id).on('mouseleave', function () {
        nav.hide();
    });
};
nav.timesEnd = function(){
    var tim = 20;
    var timer;
        timer = setInterval(function(){
            tim --;
             $('.help-end-time em').html(tim);
            if(tim == 0){
                $(".live-course-help").hide();
                $('.nav-live-course-info').removeClass('hidden');
                clearInterval(timer);
            }
        },1000); 
    $('body').on('click','.live-course-help .help-close',function(){
        var that = $(this);
        that.parents('.live-course-help').remove();
        $('.nav-live-course-info').removeClass('hidden');
    });
};
nav.timesEnd(); 

;/*!/widget/Mall.courseInfo/ui-course-info.js*/
/**
 * @name ui-course-infor.js
 * @description 课程详情页
 * 
 * @author alexliu
 * @modify 2013-07-12 16:52:31
 * @links https://github.com/xueAlex/
 */
// 课程详情页头像切换封装函数
var xue = xue || {};
xue.avatar = xue.avatar || {};

(function () {
    var a = xue.avatar;

    a.box = {
        pic: null,
        list: null,
        btn: null
    };

    a.step = $(".avatar_items li").width();
    a.size = 0;
    a.max = 0;

    a.len = 0;

    a.toggle = function (expr) {
        var btn = $(expr);
        if (btn.length == 0) {
            return;
        }
        var wrap = btn.parent();
        var pic = wrap.hasClass('avatar_roll') ? wrap.siblings('.avatar_items') : wrap.find('.avatar_items');
        if (pic.length == 0) {
            return;
        }


        this.box.pic = pic;
        this.box.list = pic.find('li');
        this.box.btn = btn;
        this.box.prev = btn.hasClass('prev') ? btn : btn.siblings('.prev');
        this.box.next = btn.hasClass('next') ? btn : btn.siblings('.next');
        this.size = this.box.list.length;
        this.max = this.size - 1;

        var list = pic.find('li');
        var left = pic.css('margin-left');

        this.left = Number(left.replace('px', ''));

        if (btn.hasClass('prev')) {
            a.prev();
        } else {
            a.next();
        }
    }

    a.prev = function () {

        if (a.left < 0) {
            a.box.pic.animate({
                marginLeft: '+=' + a.step + 'px'
            }, 500, function () {
                a.left += a.step;
                a.setCls();
                if (a.left >= 0) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };

    a.next = function () {
        var box = a.box.pic,
            left = Number(box.css('margin-left').replace('px', ''));

        if (a.left > -(a.max * a.step)) {
            a.box.pic.animate({
                marginLeft: '-=' + a.step + 'px'
            }, 500, function () {
                a.left -= a.step;
                a.setCls();
                if (a.left <= -(a.max * a.step)) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };

    a.setCls = function () {
        var hasNext = Math.abs(a.left) < ((a.box.list.length - 1) * a.step);
        var hasPrev = a.left < 0;

        if (hasNext) {
            a.box.next.removeClass('none');
        } else {
            a.box.next.addClass('none');
        }

        if (hasPrev) {
            a.box.prev.removeClass('none');
        } else {
            a.box.prev.addClass('none');
        }
    };

})(xue.avatar);
var courseInfor = courseInfor || {};
//视频弹层方法封装
courseInfor.videoPlaySwitch = function (u, w, h, t) {
        xue.win({
            id: 'videoPlayWrap',
            title: t,
            content: '<iframe frameborder="0" scrolling="no" src="' + u + '" width="100%" height="100%"> </iframe>',
            width: w,
            height: h,
            lock: true,
            close: true,
            submit: false,
            cancel: false
        });
        if($('#xuebox_videoPlayWrap').length == 1){
            $('body').css('overflow-y','hidden');
        }
        $('#xuebox_videoPlayWrap .dialog_close').on('click',function(){
             $('body').css('overflow-y','scroll');
        });
    }
    //课程大纲切换方法
courseInfor.courseTab = function (tabTit, on, tabCon) {
        var items = $(tabTit).children();
        items.click(function () {
            var that = $(this),
                con = $(tabCon).children(),
                index = items.index(this);
            that.addClass(on).siblings().removeClass(on);
            con.eq(index).show().siblings().hide();
        });
    }
$(function () {
    courseInfor.courseTab('.ui-nav-link', 'current', '.course-info-box'); //课程详情页--课程大纲切换
    var ouline = $('#open-outline'); //免费试听详情页------试听节超过规定节数出现滚动条
    if (ouline.length != 0) { //当id:ouline的值不等于零的时候执行
        ouline.jScrollPane();
    }
    //courseInfor.lookTimeList(); //直播课程详情页---查看直播时间列表
    // 绑定老师头像切换事件
    $('body').on('click', '.ui_avatar_con .prev ,  .ui_avatar_con .next', function () {
        var that = $(this);
        if (that.hasClass('none')) {
            return false;
        } else {
            xue.avatar.toggle(that)
        }
    });
    //加入购物车效果
    $('body').on('click', '.button_shop-cart', function () {
        var that = $(this),
            _id = that.data('id'),
            _url = miniUrl + '/ShoppingCart/addCart/' + _id;
        $.ajax({
            url: _url,
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (result) {
                if (result.sign == 1) {
                    var num = Number($('small.minicart-total').text());
                    $('small.minicart-total').text(num + 1);
                    $('#miniCart-body').empty();
                    $('.button_shop-cart').button('loading');
                    $.ajax({
                        url: '/ShoppingCart/ajaxGetCartList/',
                        type: 'POST',
                        dataType: 'html',
//                        xhrFields: {
//                            withCredentials: true
//                        },
//                        crossDomain: true,
                        success: function (result) {
                            $(result).appendTo('#miniCart-body');

                        }
                    });
                }
                if (result.sign == 2) {
                    window.location.href = result.url;
                }
            }
        });
    });
     //暂时不可报名
    $('body').on('mouseenter','.do_not_sign_up', function(){
        var that = $(this);
        var tpl = that.text();
        var con ='';
        var a = $('#courseExam'),
            b = a.data('stuscore'),
            c = a.data('cutscore');
        if(tpl === '无报名资格'){
            con = '抱歉，您不具备本课程的报名资格，详情请咨询<strong style="color:#cc0000;">4008002211</strong>'
        }else if(tpl === '报满'){
            con = '抱歉，本课程已经报满，暂时无法报名';
        }else if(tpl === '考试未通过'){
			 con = '抱歉您未通过考试，您的得分<strong style="color:#cc0000;">'+ b +'</strong>分，分数线<strong style="color:#cc0000;">'+ c +'</strong>分。请报名其他课程。';
		}else{
            con = '抱歉，当前没有正在进行的课程排期';
        }
        xue.win({
            id: 'DoNotSignUp',
             title : false,
             arrow : 'bc',
             follow : that,
             content : con,
             lock : false,
             close : false,
             submit : false,
             cancel : false
        });
         var box = $('#xuebox_DoNotSignUp'),
             size = xue.win('DoNotSignUp').getSize(),
             o = {
             left : that.offset().left + (that.outerWidth() / 2) - (size.outerWidth / 2),
             top : that.offset().top + that.height() - 73
         };
         xue.win('DoNotSignUp').position(o.left, o.top);
         $(this).on('mouseleave', function(e){
             if($(e.relatedTarget).attr('id') != 'xuebox_DoNotSignUp' && $(e.relatedTarget).parents('#xuebox_DoNotSignUp').length === 0){
                 xue.win('DoNotSignUp').close();
             }
         });
         $('#xuebox_DoNotSignUp').on('mouseleave', function(){
             xue.win('DoNotSignUp').close();
         });
    });
       //参加考试
    $('body').on('mouseenter','.btn-join-exam', function(){
        var that = $(this);
        xue.win({
            id: 'btnJoinExam',
             title : false,
             arrow : 'bc',
             follow : that,
             content : '通过入学考试才能报名此课程',
             lock : false,
             close : false,
             submit : false,
             cancel : false
        });
         var box = $('#xuebox_btnJoinExam'),
             size = xue.win('btnJoinExam').getSize(),
             o = {
             left : that.offset().left + (that.outerWidth() / 2) - (size.outerWidth / 2),
             top : that.offset().top + that.height() - 73
         };
         xue.win('btnJoinExam').position(o.left, o.top);
         $(this).on('mouseleave', function(e){
             if($(e.relatedTarget).attr('id') != 'xuebox_btnJoinExam' && $(e.relatedTarget).parents('#xuebox_btnJoinExam').length === 0){
                 xue.win('btnJoinExam').close();
             }
         });
         $('#xuebox_btnJoinExam').on('mouseleave', function(){
             xue.win('btnJoinExam').close();
         });
    });
});
;/*!/widget/Public.Selector/selector.js*/
/**
 * Created by user on 2015/10/21.
 */
    //上半部年级以及知识点选择的处理
var select = select || {};

select.opti = {
    item      : '.choice-item-each',
    pointInput: '.choice-items-spe-input',
    itemSpe   : '.choice-items-spe',
    pointShow : '.choice-more-download',
//    selector  : '.selector',
    choiceHide: '.choiceHide',
    choiceSpe : '.choice-items-spe'
}

/**
* [chooseSpan description]
* @param  {string} all       [所有的标签]
* @param  {string} that      [点击选中的标签]
* @param  {[type]} className [description]
* @return {[type]} none      [description]
*/
select.chooseSpan = function(all,that,className){
    $(all).removeClass(className);
    $(that).addClass(className);
}



/* 年级+知识点+学科 点击选择交互 */
$(select.opti.item).on('click',function(){
	var that = this,
        all = $(that).parent('li').siblings(),
        thatLi = $(that).parent('li');
    select.chooseSpan(all,thatLi,'active');
})
/* 更多知识点按钮是否出现在ajax中判断 */
//if($('.choice-items-spe-input').length){
//    $('.choice-more').removeClass('hide');
//    var height = $('.choice-items-spe').css('height');
//    console.log(height);
//    if(height > '22px'){
//        $('.choice-items-spe').css({'height':'22px'});
//    }
//}

/* 知识点展示“更多”交互 */
//$('body').on('click', '.choice-more-download',function(){
//    var that = this;
//    if($(that).hasClass('show-choice')){
//        $(that).children('a').html('更多知识点');
//        $(that).children('i').removeClass('fa-angle-up fa-chevron-up').addClass('fa-angle-down fa-chevron-down');
//        if($(select.opti.itemSpe).length){
//            $(select.opti.itemSpe).scrollTop(0);
//            $(select.opti.itemSpe).removeClass('choice-items-open');    
//        }else{
//            $(select.opti.pointInput).css({
//                'height':'22px',
//                'overflow':'hidden'
//            }); 
//            
//        }
//        
//        $(that).removeClass('show-choice');
//    }else{
//        $(that).children('a').html('收起知识点');
//        $(that).children('i').removeClass('fa-angle-down fa-chevron-down').addClass('fa-angle-up fa-chevron-up');
//        if($(select.opti.itemSpe).length){
//            $(select.opti.itemSpe).addClass('choice-items-open');    
//        }else{
//            $(select.opti.pointInput).css({
//                'height':'74px',
//                'overflow':'auto'
//            })
//        }
//        
//        $(that).addClass('show-choice');
//    }
//})

/**
当用户选择了一个某一个知识点之后，可以点击筛选按钮
*/
$('.choice-items-spe-input .radio-inline').on('click',function(){
    
        $('#choice-btn-disable-remove').removeAttr('disabled');    
    
    
})




;/*!/widget/Public.Module/courses.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */

// 头像切换封装函数
var courses = courses || {};

courses.avatar = courses.avatar || {};

(function(a){
    a.box = {
        pic : null,
        list: null,
        btn : null
    };

    a.step = $(".avatar-items li").width();
    a.size = 0;
    a.max = 0;

    a.len = 0;

    a.toggle = function( expr ){
        var btn = $(expr);
        if(btn.length == 0){ return; }
        var wrap = btn.parent();
        var pic = wrap.hasClass('avatar-roll') ? wrap.siblings('.avatar-items') : wrap.find('.avatar-items');
        if(pic.length == 0){ return; }


        this.box.pic = pic;
        this.box.list = pic.find('li');
        this.box.btn = btn;
        this.box.prev = btn.hasClass('prev') ? btn : btn.siblings('.prev');
        this.box.next = btn.hasClass('next') ? btn : btn.siblings('.next');
        this.size = this.box.list.length;
        this.max = this.size - 1;
        this.step = pic.find('li').width();
        var list = pic.find('li');
        var left = pic.css('margin-left');

        this.left = Number(left.replace('px',''));

        if(btn.hasClass('prev')){
            a.prev();
        }else{
            a.next();
        }
    }

    a.prev = function(){

        if(a.left < 0){
            a.box.pic.animate({
                marginLeft : '+='+a.step+'px'
            }, 500, function(){
                a.left += a.step;
                a.setCls();
                if(a.left >= 0){
                    $(this).clearQueue();
                }
            });
        }else{
            a.box.pic.clearQueue();
        }
    };

    a.next = function(){
        var box = a.box.pic,
        left = Number(box.css('margin-left').replace('px',''));

        if(a.left > -(a.max * a.step)){
            a.box.pic.animate({
                marginLeft : '-='+a.step+'px'
            }, 500, function(){
                a.left -= a.step;
                a.setCls();
                if(a.left <= -(a.max * a.step)){
                    $(this).clearQueue();
                }
            });
        }else{
            a.box.pic.clearQueue();
        }
    };

    a.setCls = function(){
        var hasNext = Math.abs(a.left) < ((a.box.list.length - 1) * a.step);
        var hasPrev = a.left < 0;

        if(hasNext){
            a.box.next.removeClass('none');
        }else{
            a.box.next.addClass('none');
        }

        if(hasPrev){
            a.box.prev.removeClass('none');
        }else{
            a.box.prev.addClass('none');
        }
    };

})(courses.avatar);

// 绑定老师头像切换事件
$('body').off('click', '.avatar-roll a, .majar-items .prev, .majar-items .next').on('click', '.avatar-roll a, .majar-items .prev, .majar-items .next', function() {
    var that = $(this);
    if (that.hasClass('none')) {
        return false;
    } else {
     courses.avatar.toggle(that)     
 }
});

//热门专题课区域增加链接
var a = $('.course-list.hot-course-list');
var bLink = $('.course-list.hot-course-link');
a.on('mouseover', function(){
    $(this).addClass('hover-feed');
});
a.on('mouseout', function(){
    $(this).removeClass('hover-feed');
});

bLink.find('.course-detail').off('click').on('click', function(event){
    var t = $(event.target);
    if(t.attr('href')){
        return;
    }else{
        var b = $(this).find('.course-title a');
        window.open(b.attr('href'));
    }
})


/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-08 16:57:28
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name ui.userinfo.js
 * @description 弹出的用户信息窗口
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */
// 课程列表增加筛选功能
function showStuterm(){
    $('.stu-term-select').css('height','auto').find('.stu-term-select-content').css('display','block');
    $('.stu-term-select-title i').removeClass('fa-angle-down').addClass('fa-angle-up');
};
function hideStuterm(){
    $('.stu-term-select').css('height','37px').find('.stu-term-select-content').css('display','none');
    $('.stu-term-select-title i').removeClass('fa-angle-up').addClass('fa-angle-down');
}
$('body').on('mouseenter','.stu-term-select', function(){
      showStuterm();
    }).on('mouseleave','.stu-term-select',function(){
        hideStuterm();
    });

;/*!/widget/Public.Module/courses_dialog.js*/
/*
 * XESUI
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 声明 xue 包：增加别名“X”
 *
 * @author Marco (marco@xesui.com)
 * @modify 2014-07-28 20:02:08
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

xue.version = '10551';

xue.id = 'xesui';
xue.guid = '$XESUI$';
xue.team = {
    Marco: 'Marco@xesui.com',
    Alex: 'Alex@xesui.com',
    oba: 'oba@xesui.com'
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
     var n = null,
     f = false,
     q = false,
     t = false,
     tp = null;

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
     var _callback = function() {
        if (f) {
            return f(xue[n]);
        }
    };

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

/* ========================== UI 组件 =========================== */



/* ========================== module =========================== */


xue.dialog = xue.dialog || function(opt) {
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
     if (opt && typeof opt === 'object' && opt.length === undefined) {

        $.extend(o, xue.dialog._default, opt);
        xue.dialog._init(o);
        return xue.dialog;

    } else if (opt && typeof opt === 'string') {
        var id = 'xuebox_' + opt;
        var item = xue.dialog.queue[id];
        if (item) {
            xue.dialog.id = id;
            xue.dialog.box = item.DOM_BOX;
        }
        return xue.dialog;
    } else {
        $.extend(o, xue.dialog._default);
        xue.dialog._init(o);
    }

    return xue.dialog;
};

(function() {

    var win = xue.dialog;

    win.id = 'xuebox';

    win.tpl = {
        /**
         * 弹窗外围容器
         * @type {String}
         */
         wrap: '<div id="$id$" class="dialog">$dialog_box$ $dialog_close$ $dialog_arrow$</div>',
        /**
         * 关闭按钮
         * @type {String}
         */
         close: '<a href="javascript:void(0);" class="dialog_close">关闭</a>',
        /**
         * 指示箭头模板
         * $arrow_type$ : 按钮位置
         * - tl : 上左
         * - tr : 上右
         * - bl : 下左
         * - br : 下右
         * @type {String}
         */
         arrow: '<div class="dialog_arrow arrow_$arrow_type$"></div>',
        /**
         * 按钮模版
         * $btn_id$   :
         * $btn_type$ :
         * $btn_cls$  :
         * $btn_text$ :
         * @type {String}
         */
         button: '<button type="button" data-type="$btn_type$" id="$id$_btn_$btn_id$" class="btn $btn_cls$ $btn_type$" href="javascript:void(0);">$btn_text$</button>',
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
         box: '<table class="dialog_box">\n' + '    <thead><tr class="t"><td class="tl"></td><td class="tc"></td><td class="tr"></td></tr></thead>\n' + '   <tbody class="dialog_head $is_title$">\n' + '       <tr class="ct">\n' + '          <td class="cl"></td>\n' + '         <td class="dialog_handle">\n' + '               <p class="dialog_title" id="$id$_title">$title$</p>\n' + '          </td>\n' + '            <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tbody class="dialog_body">\n' + '      <tr class="cc">\n' + '          <td class="cl"></td>\n' + '         <td id="$id$_content" class="dialog_content_wrap"><div class="dialog_content">$content$</div></td>\n' + '           <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tbody class="dialog_foot $is_buttons$">\n' + '     <tr class="cb">\n' + '          <td class="cl"></td>\n' + '         <td class="dialog_buttons" id="$id$_buttons">$buttons$</td>\n' + '          <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tfoot><tr class="b"><td class="bl"></td><td class="bc"></td><td class="br"></td></tr></tfoot>\n' + '</table>\n',
        /**
         * 背景遮罩
         */
         mask: '<div class="dialog_mask"></div>'
     };

    /**
     * 默认配置
     * @type {Object}
     */
     win._default = {
        content: '<div class="aui_loading"><span>loading..</span></div>',
        title: '\u6d88\u606f', // 标题. 默认'消息'
        handle: null,
        button: null, // 自定义按钮
        ok: null, // 确定按钮回调函数
        no: null, // 取消按钮回调函数
        submit: null, // 同 ok
        cancel: null, // 同 no
        init: null, // 对话框初始化后执行的函数
        close: null, // 对话框关闭前执行的函数
        okVal: '\u786E\u5B9A', // 确定按钮文本. 默认'确定'
        cancelVal: '\u53D6\u6D88', // 取消按钮文本. 默认'取消'
        width: 'auto', // 内容宽度
        height: 'auto', // 内容高度
        minWidth: 96, // 最小宽度限制
        minHeight: 32, // 最小高度限制
        padding: null, // 内容与边界填充距离,默认：'25px 20px'
        skin: '', // 皮肤名(预留接口,尚未实现)
        icon: null, // 消息图标名称
        time: null, // 自动关闭时间
        esc: true, // 是否支持Esc键关闭
        focus: true, // 是否支持对话框按钮自动聚焦
        show: true, // 初始化后是否显示对话框
        follow: null, // 跟随某元素(即让对话框在元素附近弹出)
        // path      : _path,               // Dialog路径
        lock: false, // 是否锁屏
        background: '#000', // 遮罩颜色
        opacity: 0.7, // 遮罩透明度
        duration: 300, // 遮罩透明度渐变动画速度
        fixed: false, // 是否静止定位
        left: null, // X轴坐标
        top: null, // Y轴坐标
        zIndex: 1000, // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
        resize: true, // 是否允许用户调节尺寸
        drag: true, // 是否允许用户拖动位置，
        border: true, // 是否显示边框
        cls: '' // dialog外围增加样式：dialog_alert / dialog_win等
    };

    // 设置队列
win.queue = { /* 'id' : {} */ };


win._init = function(opt) {

    this.id = opt.id ? 'xuebox_' + opt.id : 'xuebox';

    this.queue[this.id] = opt;
    /* --------------- 获取HTML结构 ------------- */

    var _dom = this.tpl.wrap;

    _dom = _dom.replace('$id$', this.id);

    _dom = _dom.replace('$dialog_close$', this._getClose());

    _dom = _dom.replace('$dialog_box$', this._getDOM());

    _dom = _dom.replace(/\$dialog_arrow\$/, this._getArrow());

    /* --------------- 页面中插入 ------------- */
    if ($('#xuebox_' + opt.id).length > 0) {
        $('#xuebox_' + opt.id).remove();
    }
        // var _top_temp = Number(-2000);
        $(_dom).appendTo('body');
        // $(_dom).css('top', Number(-2000)).appendTo('body');
        this.box = $('#' + this.id);
        // this.box.css('top', -2000);
        /* --------------- 存储配置 ------------- */
        // 设置DOM节点到队列中

        var dom = {
            DOM_BOX: this.box,
            DOM_CLOSE: this.box.find('.dialog_close'),
            DOM_CANCEL: this.box.find('.btn_cancel'),
            DOM_OK: this.box.find('.btn_ok'),
            DOM_BUTTONS: this.box.find('.dialog_buttons .btn'),
            DOM_TITLE: this.box.find('.dialog_title'),
            DOM_CONTENT: this.box.find('.dialog_content_wrap')
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
        if (opt.button && opt.button.length > 0) {
            $.each(opt.button, function(k, v) {
                var _btn = $('#' + that.id + '_btn_' + v.id);
                that._addClick(_btn, v.fn);
            });
        }

        // 给Dialog绑定点击事件，点击后重置Dialog的id和dom值
        dom.DOM_BOX.off('mousedown').on('mousedown', function() {
            that.id = $(this).attr('id');
            that.box = $(this);
        });
        /* --------------- 设置定位和尺寸 ------------- */

        this.resize();
        // this(this.id).position();

        /* --------------- 设定背景遮罩 ------------- */
        if (opt.lock) {
            var bg = opt.lockbg ? true : false;
            this.lock(bg);
        }

        /* --------------- 判断是否显示边框 ------------- */
        if (opt.border) {
            dom.DOM_BOX.removeClass('dialog_noborder');
        } else {
            dom.DOM_BOX.addClass('dialog_noborder');
        }
        // 如果不存在遮罩，则给所有的弹窗增加1px边框样式
        // if($('.dialog_mask').length == 0){
        // $('.dialog').addClass('dialog_noMask');
        // }

        /* --------------- 设置圆角 ------------- */
        // 头部存在的时候增加样式
        if (dom.DOM_BOX.find('.dialog_head:hidden').length > 0) {
            dom.DOM_CONTENT.addClass('dialog_radius_top');
        } else {
            dom.DOM_CONTENT.removeClass('dialog_radius_top');
        }
        // 底部存在的时候增加样式
        if (dom.DOM_BOX.find('.dialog_foot:hidden').length > 0) {
            dom.DOM_CONTENT.addClass('dialog_radius_bottom');
        } else {
            dom.DOM_CONTENT.removeClass('dialog_radius_bottom');
        }

        /* --------------- 设置外围样式 ------------- */

        if (opt.cls) {
            dom.DOM_BOX.addClass(opt.cls);
        }

        /* --------------- 设置延时关闭 ------------- */
        if (opt.time) {
            this.timeout(opt.time, dom.DOM_BOX);
        }
        /* --------------- 设置跟随 ------------- */
        if (opt.follow) {
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

        if (xue.isIE6) {
            dom.DOM_BOX.addClass('dialog_noshadow');
            // 增加iframe遮罩
            if ($('body').find('select').length > 0) {
                win.iframe();
            }
        } else {
            dom.DOM_BOX.removeClass('dialog_noshadow');
        }

    };

    win.iframe = function(tp) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        var w = $('body').width(),
        h = $('body').height();
        var iframe_tpl = '<iframe id="dialog_iframe" style="position:fixed;width:100%;height:100%;top:0;left:0;_position:absolute;_width:' + w + ';_height:' + h + ';_filter:alpha(opacity=0);opacity=0;border-style:none;z-index:998;"></iframe>';
        // if(!this.iframe){
            $('body').append(iframe_tpl);
        // }
        // this.iframe = $('#dialog_iframe');
    };
    // 获取关闭标签HTML结构
    win._getClose = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        var _close = opt.close ? this.tpl.close : '';

        return _close;
    };

    // 获取箭头标签的HTML结构
    win._getArrow = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }

        var tp = opt.arrow;
        if (tp) {
            var html = win.tpl.arrow;
            tp = tp ? (tp === true ? 'bc' : tp) : 'bc';
            html = html.replace('$arrow_type$', tp);
            return html;
        } else {
            return '';
        }
    };
    // 获取按钮组标签的HTML结构
    win._getButton = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }

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
            id: /\$id\$/g,
            btn: /\$btn_id\$/,
            type: /\$btn_type\$/g,
            cls: /\$btn_cls\$/,
            text: /\$btn_text\$/

        };
        if (btn && typeof btn === 'object' && btn.length > 0) {
            $.each(btn, function(k, v) {
                var _btn = tpl;
                _btn = _btn.replace(re.id, win.id);
                _btn = _btn.replace(re.btn, v.id);
                _btn = _btn.replace(re.type, 'btn_' + v.tp);
                _btn = _btn.replace(re.cls, v.cls);
                _btn = _btn.replace(re.text, v.text);
                btns += _btn;
            });
        }
        if (opt.submit || opt.ok) {
            var _submit = tpl;
            _submit = _submit.replace(re.type, 'btn_ok');
            _submit = _submit.replace(re.id, win.id);
            _submit = _submit.replace(re.btn, 'ok');
            _submit = _submit.replace(re.cls, 'btn_red');
            _submit = _submit.replace(re.text, opt.submitVal || opt.okVal);
            btns += _submit;
        }
        if (opt.cancel || opt.no) {
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
    win._getDOM = function() {

        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }

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
         if (opt.title) {
            box = box.replace(/\$is_title\$/, '');
            box = box.replace(/\$title\$/, opt.title);
        } else {
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
    win._setOption = function(key, val, id) {
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
     win._addClick = function(expr, fn) {
        var box = $(expr).parents('.dialog'),
        id = (box.length > 0) ? box.attr('di') : this.id;

        var _fn = (fn && typeof fn === 'function') ? fn : function() {
            win.close();
        };
        var that = this;
        $(expr).off('click').on('click', function() {
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
        wins: function() {
            var _win = $(window);
            // 窗体尺寸
            var w = {
                w: _win.width(), // 宽度
                h: _win.height(), // 高度
                s: _win.scrollTop() // 滚动高度
            };
            // 窗体垂直中线
            w.c = (w.w / 2);
            // 窗体可显示区域水平中线
            w.m = w.s + (w.h / 2);
            return w;
        },
        box: function() {
            var opt = win.queue[win.id];
            if (!opt) {
                return win;
            }
            var box = opt.DOM_BOX;
            // 弹窗的尺寸
            var d = /*this.getSize() ||*/ {
                w: box.outerWidth(true),
                h: box.outerHeight(true)
            };
            return d;
        },
        handle: function() {
            var opt = win.queue[win.id];
            if (!opt) {
                return win;
            }
            var handle = $(opt.handle);
            if (handle.length === 0) {
                return win;
            }
            var h = {
                w: handle.width(),
                h: handle.height(),
                l: handle.offset().left,
                t: handle.offset().top
            };
            // handle垂直中心
            h.c = h.l + (h.w / 2);

            return h;
        }
    };


    // 事件绑定
    // win._addEvent = function(ev, expr, fn){};

    // 关闭事件
    win.close = function(fn) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        // 当关闭的容器ID并不是当前激活窗口时，禁止弹层
        if((typeof(fn) == 'string') && (this.id !== 'xuebox_'+fn)){
            return;
        }

        opt.DOM_BOX.remove();
        if (xue.isIE6) {
            $('#dialog_iframe').remove();
            // this.iframe = null;
        }
        delete this.queue[this.id];

        //关闭的时候检查剩余弹窗中有没有锁定的，如果有则不删除遮罩
        var islock = false;
        $.each(this.queue, function() {
            if (this.lock) {
                islock = true;
            }
        });

        if (!islock) {
            this.unlock();
        }
    };

    // 设置弹窗的位置
    win.position = function(left, top) {

        var box = [],
        opt = this.queue[this.id];

        if ((left && typeof left === 'number') || (top && typeof top === 'number')) {
            if (!opt) {
                return;
            }
            opt.left = left || opt.left;
            opt.top = top || opt.top;
            box.push(opt);
        } else {
            // 重置所有弹窗的定位
            // $.each(this.queue, function(){
            //  box.push(this);
            // });

            // 只设置当前弹窗的定位
            box.push(opt);
        }

        $.each(box, function() {
            var opt = this;
            var box = opt.DOM_BOX;
            var pos = {
                left: left || opt.left || ($(window).width() / 2) - (box.width() / 2),
                top: top || opt.top || ($(window).height() / 2) - (box.height() / 2)
            };
            box.css({
                left: pos.left,
                top: pos.top
            });
        });

        return this;
    };

    // 设置弹窗的大小
    win.resize = function(width, height) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }

        if ((width || opt.width) && (height || opt.height)) {
            var box = opt.DOM_BOX;
            var con = box.find('.dialog_content');
            con.css({
                width: width || opt.width,
                height: height || opt.height
            });
            if (opt.padding) {
                con.css('padding', opt.padding);
            }
            // 如果没有设置宽度的，则需要延时处理：等dialog加载完成后再设置定位，否则直接设置
            if (!opt.width || opt.width == 'auto') {
                setTimeout(function() {
                    win.position();
                }, 100);
            } else {
                win.position();
            }
        }
        if (xue.isIE6) {
            var _box = opt.DOM_BOX;
            _box.css({
                width: _box.width()
            });
            _box.find('.dialog_arrow').css('width', _box.width());
        }

        return this;
    };

    // 设置弹窗的层级，默认为1000
    win.zIndex = function() {};

    /**
     * 设置当前焦点,zindex : 2000
     *
     * 其他的Dialog的zindex值设为默认 1000
     *
     * 当点击某个的时候，可以激活当前焦点
     *
     * @return {[type]} [description]
     */
     win.focus = function() {};

    /**
     * 获取弹窗内容区域
     * @param  {string} tp 获取类型：html / text / dom
     * @return {[type]}    根据类型返回：html(HTML内容) / text(文本) / dom(jQuery对象)
     */
     win.getContent = function(tp) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }

        var DOM = opt.DOM_CONTENT.find('.dialog_content'),
        con = '';

        if (tp === 'html') {
            con = DOM.html();
        } else if (tp === 'text') {
            con = DOM.text();
        } else {
            con = DOM;
        }

        return con;
    };

    /**
     * 设置遮罩
     * @param  {boolen} lockbg 是否显示背景图片（斜线）
     * @return {[type]}        [description]
     */
     win.lock = function(lockbg) {
        var mask = $('body').find('.dialog_mask');
        if (mask.length > 0) {
            mask.show();
        } else {
            $('body').append(this.tpl.mask);
        }
        var newMask = $('.dialog_mask');
        if (lockbg) {
            newMask.addClass('mask_bg');
        } else {
            $('.dialog_mask').removeClass('mask_bg');
        }

        if (xue.isIE6) {
            var h = Math.max($('body').outerHeight(), $(window).outerHeight());
            newMask.height(h);
        }
        if (newMask.height() < $(window).height()) {
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
     win.unlock = function(id) {
        $('.dialog_mask').remove();
    };


    win.content = function(msg) {
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }

        var box = opt.DOM_BOX.find('.dialog_content');

        box.html(msg);
        this.resize();
        return this;
    };
    win.title = function(title) {
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }

        var box = opt.DOM_BOX.find('.dialog_title');

        box.html(title);

        return this;
    };


    win.timeout = function(timer, box) {
        var t = timer || 2000;
        var that = this;
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var _box = box || opt.DOM_BOX;
        setTimeout(function() {
            _box.fadeOut(100, function() {
                that.close();
            });
            // if(opt.lock){
            // }
            // delete that.queue[that.id];
        }, t);
    };

    win.getSize = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }

        var box = opt.DOM_BOX;
        var width = box.outerWidth(),
        height = box.outerHeight();
        return {
            width: width,
            height: height
        };
    };

    win._getHandleSize = function(expr) {
        var handle = $(expr);
        if (handle.length === 0) {
            return false;
        }
        var offset = handle.offset();
        var size = {
            height: handle.outerHeight(true),
            width: handle.outerWidth(true),
            left: offset.left,
            top: offset.top
        };
        return size;
    };

    win.follow = function(expr) {
        var handle = $(expr);
        if (handle.length === 0) {
            return this;
        }

        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }

        var box = opt.DOM_BOX;

        if (box.hasClass('dialog_follow')) {
            box.addClass('dialog_follow');
        }

        var dom = this._getHandleSize(handle);
        var size = {
            width: box.outerWidth(true),
            height: box.outerHeight(true)
        };
        win.position(dom.left - (size.width / 2) + (dom.width / 2), dom.top - (size.height / 2) - dom.height - 11);
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
     win.arrow = function(handle) {
        var _dom = $(handle);
        if (_dom.length === 0) {
            return;
        }

        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var box = opt.DOM_BOX;


        // 窗体尺寸
        var w = this._size.wins();

        var s = this._size.handle();

        // 弹窗的尺寸
        var d = this._size.box();

        // 设置箭头类别
        var c = (s.c < w.c) ? 'l' : 'r', // 垂直区域
            m = ((s.t - d.h) < w.s) ? 't' : 'b'; // 水平区域
            var tp = m + c;
            var arrow = box.find('.dialog_arrow');

            arrow.removeClass().addClass('dialog_arrow').addClass('arrow_' + tp);

            var aLeft = Math.floor((c == 'l') ? d.w * 0.2 : d.w * 0.8);
        // console.log(s);
        arrow.css({
            'background-position': aLeft + 'px 0'
        });



        // this.position();

    };


})();







/* ================== 插件 =================== */




xue.win = xue.dialog;

(function() {
    var w = xue.win;
    var config = {
        id: 'win',
        lock: true,
        close: true,
        title: '标题',
        content: '<div></div>',
        submit: true,
        cancel: true
    };

    $.each(config, function(k, v) {
        w._default[k] = v;
    });

})();








/* ================================================= 全局事件 ==================================================== */


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


    


// 开始
var userinfo_temp = false,
userinfo_dom = null,
userinfo_show = null,
userinfo_interval = false;
var time_all = '';
    // 绑定所有V用户的鼠标滑过事件：弹出用户信息
    $('body').off('mouseover', '.ui-userinfo').on('mouseover', '.ui-userinfo', function(ev) {
        var d = $(this).data();
        var that = $(this);
        if (!d.params) {
            return;
        }
        var over_url = location.href;
        var over_time = Date.now();
        time_all = over_time;
        // var ra = ev; ra.relatedTarget;
        // userinfo_show = null;
        userinfo_show = true;
        userinfo_dom = that;
        setTimeout(function() {
            if (userinfo_show) {
                // that = userinfo_dom;
                userinfoShow(userinfo_dom);
                userinfo_show = null;
                userinfo_dom = null;
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
                    var _url = '/UserPages/ajaxUserPage';
                    //var _a = $('.ui-userinfo').data('url');
                    var url = _url;
                    // var url = window.location.hostname == 'v04.xesui.com' ? '../json/pop_userinfo.php' : '/UserPages/ajaxUserPage';
                    var par = udom.data().params;
                    // var url = '/data/courses/teacher-bomb.html';
                    $.ajax(url,{
                        type: 'get',
                        dataType: 'html',
                        data: par,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(result) {
                            // alert(result)
                            // var msg = xue.ajaxCheck.HTML(result);
                            if (result != '0'){
                                // if(result.sign == 1){
                                    xue.use('userinfo', function() {
                                        if (xue.userinfo) {

                                            xue.userinfo.show(udom, result);
                                            $('.ui_follow').follow();

                                        }
                                    });
                                }
                            },
                            error: function(){
                                alert('数据请求失败')
                            }
                        });
}
}

udom.addClass('info_open');

userinfo_temp = true;
};



that.off('mouseout').on('mouseout', function(a, b, c, d) {
    userinfo_temp = false;
    userinfo_show = false;
    userinfo_dom = null;
    
    var re = $(a.relatedTarget);
    var _c = $('.dialog_userinfo').find(re);

    if (_c.length > 0) {
        userinfo_temp = true;
    }
    setTimeout(function() {
        if (!userinfo_temp) {
                    // 关闭窗口的时候传入要关闭窗口的ID，防止关闭正在激活的窗口（非用户信息窗口）
                    xue.win('userinfo').close('userinfo');
                    that.removeClass('info_open');
                    
                }
                that = null;
            }, 500);
        var out_time = Date.now();
        var o_time = out_time - over_time;
         utrack('xueersi','key=user_tab&value=times:' + o_time + ';userid:' + that.data('params') + ';url:'+ over_url);

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
                $('.ui-userinfo').removeClass('info_open');
            }
        }, 500);
    }
        var over_url = location.href;
        var out_time = Date.now();
        var o_time = out_time - time_all;
        var src_img = $(this).find('.app-code img').attr('src') || '';
        utrack('xueersi','key=user_tab&value=times:' + o_time + ';userid:0;url:'+ over_url+';weixin_code_img_url:'+ src_img);
});


// 结束




});



;/*!/widget/Public.Module/xue.userinfo.min.js*/
/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-08 16:57:28
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name ui.userinfo.js
 * @description 弹出的用户信息窗口
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */

xue.userinfo = xue.userinfo || {};
(function(){
    var u = xue.userinfo;
    // u.queue = 
    u.opt = {
        id : null,
        handle : null,
        orientation : null,
        content : null
    };

    u.show = function( expr, content ){
        if(arguments.length == 0){ return; }


        var msg = content || null, handle = expr ? $(expr) : false;
        
        var left, top, tp;
        if(handle.length == 0 && !msg){ return; }

        // u.setDom(handle, msg);



        var w = handle.width(), h = handle.height(),
            l = handle.offset().left, t = handle.offset().top;
        
        // win (w:330 h:150)
        
        var left = l - 50,
            top  = t - 150,
            arrow = 'bl';

        var side = handle.parents('.layout_side').hasClass('right');

        if(side){
            left = l - 235;
            arrow = 'br';
        }

        var o = {
            id      : 'userinfo',
            cls     : 'dialog_userinfo',
            title   : false,
            submit  : false,
            cancel  : false,
            lock    : false,
            close   : false,
            left    : left,
            top     : top,
            handle  : handle,
            arrow   : arrow,
            content : '<div class="pop_userinfo_wrap">' + msg + '</div>'
        };

        xue.win(o);




        // 根据滚动条设置显示的方向，以及箭头位置
        // var win = xue.win('userinfo');
        // var s = win.getSize();
        // var new_top = t - (s.height) - 8;
        // if((new_top - $(window).scrollTop()) < 0){
        //     new_top = t + h + 5;
        //     var _uwin = $('.dialog_userinfo');
        //     var _arrow = _uwin.find('.dialog_arrow');
        //     if(_arrow.hasClass('arrow_br')){
        //         _arrow.removeClass('arrow_br').addClass('arrow_tr');
        //     }else if(_arrow.hasClass('arrow_bl')){
        //         _arrow.removeClass('arrow_bl').addClass('arrow_tl');
        //     }
        // }

        var _u = xue.win('userinfo');
        // 窗体尺寸
        var w = _u._size.wins();
        
        // handle尺寸
        var h = _u._size.handle();

        // 弹窗的尺寸
        var d = _u._size.box();

        // 设置箭头类别
        // var c = (h.c < w.c) ? 'l' : 'r',        // 垂直区域
        //     m = ((s.t - d.h )< w.s) ? 't' : 'b';            // 水平区域
        //     // m = (h.t < w.m) ? 't' : 'b';            // 水平区域

        var left = (h.c < w.c) ? h.l - (d.w * 0.2) + (h.w / 2) - 7 : (h.l - d.w) + (d.w * 0.2) + (h.w / 2) - 7;

        var new_top = ((h.t - d.h ) < w.s) ? h.t + h.h + 7 : h.t - d.h - 7;

        xue.win('userinfo').position(left, new_top);




        // 当滑出后，点击关注，或者取消按钮时，情况已经缓存到页面中的内容，重新请求
        $('.dialog_userinfo').on('mousedown', '.ui_follow', function(){
            var temp = handle.find('.pop_userinfo_temp');
            if(temp.length > 0){ temp.remove(); }
        });


        if(xue.isIE6){
            $('.dialog_userinfo').find('.dialog_arrow').width($('.dialog_userinfo').width());
            
        }




        // 设置u.opt
        
        // append节点到handle里面
        
        // 执行弹窗


    };

    /**
     * 在鼠标滑过的节点内存入弹出的结构，下次再滑过时不再请求
     * @return {[type]} [description]
     */
    u.setDom = function(handle, content){
        var box = $(handle);
        if(box.length == 0){ return; }

        if(box.find('.pop_userinfo_temp').length == 0){
            box.append('<div class="pop_userinfo_temp">' + content + '</div>')
        }else{
            box.find('.pop_userinfo_temp').html(content);
        }
    };


    u.close = function(){
        $('.dialog_userinfo').hide();
    };


    /**
     * 根据鼠标滑过的节点位置，返回将要显示的弹层坐标
     * @return {[type]} [description]
     */
    u.getPosition = function(){
        var box = u.opt.handle;
        if(!box){ return this; }


    };

    /**
     * 根据鼠标滑过的节点，返回箭头的方向: bl, br, tl, tr
     * @return {[type]} [description]
     */
    u.getOrientation = function(){};

})();
;/*!/widget/Module.Pagination/paginations.js*/
/**
 * 
 * @example
        $('.ui-pages').pages({
            total : 50, // 总记录数
            size: 2, // 每页显示记录数
            index : 26, // 当前页
            url : '#!{page}', // 非ajax情况下分类的链接地址
            // 点击分页时的回调，返回被点击的页数
            click : function(e){
                console.log(e);
            }
        }); 
 */
;(function($){
    var defaults = {
        'total': 100, // 条目总数，异步分页时必填，模拟分页时为数组的长度
        'size': 10, // 每页的条目数
        'index': 1,// 初始化时选定的页数
        'cls' : '', // 分页容器ul上面的出class名
        'range': 2, // 可见的页码范围，即当前页码两边的页码数量。比如当前是第 6 页，设置 pageRange 为 2，则页码条显示为 '1... 4 5 6 7 8'
        'handle': '.pagination-handle' , // 加载分页的容器
        'click' : null, // 点击分页后事件绑定
        'container': '.pagination-container', // 存放分页数据内容的容器
        'url' : null // 分页按钮的链接
    };
    var methods = {
        init : function(){},
        data: function(len){
            if(len <= 0 ){
                return [];
            }
            return new Array(len || 100);
        },
        template: function(str){}
    };

    $.fn.pages = function(options){
        if(options && options.total <= 1){
            return this;
        }
        return this.each(function(){
            var that = $(this);

            if(typeof options == 'number'){
                that.pagination(options);
                return that;
            }
            var settings = $.extend({}, defaults, options);
            settings.handle = that;
            var _opt = {
                dataSource: methods.data(settings.total),
                totalNumber: settings.total,   // 条目总数，异步分页时必填，模拟分页时为数组的长度
                pageNumber: settings.index,  // 指定初始化时加载哪一页的数据
                pageSize: settings.size, // 每页的条目数
                pageRange: settings.range, // 可见的页码范围，即当前页码两边的页码数量。比如当前是第 6 页，设置 pageRange 为 2，则页码条显示为 '1... 4 5 6 7 8'
                ulClassName: 'pagination ' + settings.cls,
                callback: function(data, pagination){
                    try{
                        settings.callback(pagination);
                    }catch(e){}
                }
            };
            if(typeof settings.click == 'function'){
                _opt.afterPageOnClick = _opt.afterNextOnClick = _opt.afterPreviousOnClick = function(){
                    settings.click(settings.handle.pagination('getSelectedPageNum'));
                };
                _opt.pageLink  = '#';
            }
            if(settings.url){
                _opt.pageLink  = settings.url;
            }

//            that.pagination('destroy').pagination(_opt);
              that.pagination(_opt);

            return that;
        });
//        var settings = $.extend({}, defaults, options);
//
//        settings.handle = this;
//        var _opt = {
//            dataSource: methods.data(settings.total),
//            totalNumber: settings.total,   // 条目总数，异步分页时必填，模拟分页时为数组的长度
//            pageNumber: settings.index,  // 指定初始化时加载哪一页的数据
//            pageSize: settings.size, // 每页的条目数
//            pageRange: settings.range, // 可见的页码范围，即当前页码两边的页码数量。比如当前是第 6 页，设置 pageRange 为 2，则页码条显示为 '1... 4 5 6 7 8'
//            ulClassName: 'pagination ' + settings.cls,
//            callback: function(data, pagination){
//                try{
//                    settings.callback(pagination);
//                }catch(e){}
//            }
//        };
//        if(typeof settings.click == 'function'){
//            _opt.afterPageOnClick = _opt.afterNextOnClick = _opt.afterPreviousOnClick = function(){
//                settings.click(settings.handle.pagination('getSelectedPageNum'));
//            };
//        }
//        if(settings.url){
//            _opt.pageLink  = settings.url;
//        }
//
//        this.pagination(_opt);
//
//        return this;
    };

})(jQuery);

/*
 * pagination.js 2.0.7
 *
 * Released under the MIT license.
 */

(function(global, $) {

    if (typeof $ === 'undefined') {
        throwError('Pagination requires jQuery.');
    }

    var pluginName = 'pagination';

    var pluginHookMethod = 'addHook';

    var eventPrefix = '__pagination-';

    // Conflict, use backup
    if ($.fn.pagination) {
        pluginName = 'pagination2';
    }

    $.fn[pluginName] = function(options) {

        if (typeof options === 'undefined') {
            return this;
        }

        var container = $(this);

        var pagination = {

            initialize: function() {
                var self = this;

                // 保存当前实例的属性
                if (!container.data('pagination')) {
                    container.data('pagination', {});
                }

                // 初始化之前
                if (self.callHook('beforeInit') === false) return;

                // 如果分页已经初始化,摧毁它
                if (container.data('pagination').initialized) {
                    $('.paginationjs', container).remove();
                }

                // 初始化是否禁用分页
                self.disabled = !!attributes.disabled;

                // 传递给回调函数
                var model = self.model = {
                    pageRange: attributes.pageRange,
                    pageSize: attributes.pageSize
                };

                // "dataSource"的类型是未知的,解析它找到真正的数据
                self.parseDataSource(attributes.dataSource, function(dataSource) {

                    // 分页是否同步模式
                    self.sync = Helpers.isArray(dataSource);
                    if (self.sync) {
                        model.totalNumber = attributes.totalNumber = dataSource.length;
                    }

                    // 获取页面的总数
                    model.totalPage = self.getTotalPage();

                    // 不到一页
                    if (attributes.hideWhenLessThanOnePage) {
                        if (model.totalPage <= 1) return;
                    }

                    var el = self.render(true);

                    // 额外的类名
                    if (attributes.className) {
                        el.addClass(attributes.className);
                    }

                    model.el = el;

                    // 加载模板
                    container[attributes.position === 'bottom' ? 'append' : 'prepend'](el);

                    // 绑定事件
                    self.observer();

                    // 初始化标志
                    container.data('pagination').initialized = true;

                    // 初始化之后
                    self.callHook('afterInit', el);

                });

            },

            render: function(isBoot) {

                var self = this;
                var model = self.model;
                var el = model.el || $('<div class="paginationjs"></div>');
                var isForced = isBoot !== true;

                // 渲染之前
                self.callHook('beforeRender', isForced);

                var currentPage = model.pageNumber || attributes.pageNumber;
                var pageRange = attributes.pageRange;
                var totalPage = model.totalPage;

                var rangeStart = currentPage - pageRange;
                var rangeEnd = currentPage + pageRange;

                if (rangeEnd > totalPage) {
                    rangeEnd = totalPage;
                    rangeStart = totalPage - pageRange * 2;
                    rangeStart = rangeStart < 1 ? 1 : rangeStart;
                }

                if (rangeStart <= 1) {
                    rangeStart = 1;

                    rangeEnd = Math.min(pageRange * 2 + 1, totalPage);
                }

                el.html(self.createTemplate({
                    currentPage: currentPage,
                    pageRange: pageRange,
                    totalPage: totalPage,
                    rangeStart: rangeStart,
                    rangeEnd: rangeEnd
                }));

                // 渲染之后
                self.callHook('afterRender', isForced);

                return el;
            },

            // 创建模板
            createTemplate: function(args) {

                var self = this;
                var currentPage = args.currentPage;
                var totalPage = args.totalPage;
                var rangeStart = args.rangeStart;
                var rangeEnd = args.rangeEnd;

                var totalNumber = attributes.totalNumber;

                var showPrevious = attributes.showPrevious;
                var showNext = attributes.showNext;
                var showPageNumbers = attributes.showPageNumbers;
                var showNavigator = attributes.showNavigator;
                var showGoInput = attributes.showGoInput;
                var showGoButton = attributes.showGoButton;

                var pageLink = attributes.pageLink;
                var prevText = attributes.prevText;
                var nextText = attributes.nextText;
                var ellipsisText = attributes.ellipsisText;
                var goButtonText = attributes.goButtonText;

                var classPrefix = attributes.classPrefix;
                var activeClassName = attributes.activeClassName;
                var disableClassName = attributes.disableClassName;
                var ulClassName = attributes.ulClassName;

                var formatNavigator = $.isFunction(attributes.formatNavigator) ? attributes.formatNavigator() : attributes.formatNavigator;
                var formatGoInput = $.isFunction(attributes.formatGoInput) ? attributes.formatGoInput() : attributes.formatGoInput;
                var formatGoButton = $.isFunction(attributes.formatGoButton) ? attributes.formatGoButton() : attributes.formatGoButton;

                var autoHidePrevious = $.isFunction(attributes.autoHidePrevious) ? attributes.autoHidePrevious() : attributes.autoHidePrevious;
                var autoHideNext = $.isFunction(attributes.autoHideNext) ? attributes.autoHideNext() : attributes.autoHideNext;

                var header = $.isFunction(attributes.header) ? attributes.header() : attributes.header;
                var footer = $.isFunction(attributes.footer) ? attributes.footer() : attributes.footer;

                var html = '';
                var goInput = '<input type="text" class="J-paginationjs-go-pagenumber">';
                var goButton = '<input type="button" class="J-paginationjs-go-button" value="'+ goButtonText +'">';
                var formattedString;
                var i, pageUrl;

                if (header) {

                    formattedString = self.replaceVariables(header, {
                        currentPage: currentPage,
                        totalPage: totalPage,
                        totalNumber: totalNumber
                    });

                    html += formattedString;
                }

                if (showPrevious || showPageNumbers || showNext) {

                    html += '<div class="paginationjs-pages">';

                    if (ulClassName) {
                        html += '<ul class="'+ ulClassName +'">';
                    }
                    else{
                        html += '<ul>';
                    }

                    // 上一页按钮
                    if (showPrevious) {
                        if (currentPage === 1) {
                            if (!autoHidePrevious) {
                                html += '<li class="'+ classPrefix +'-prev '+ disableClassName +'"><a>'+ prevText +'<\/a><\/li>';
                            }
                        }
                        else{
                            pageUrl = pageLink.replace('{page}', (currentPage - 1));
                            html += '<li class="'+ classPrefix +'-prev J-paginationjs-previous" data-num="'+ (currentPage - 1) +'" title="Previous page"><a href="'+ pageUrl +'">'+ prevText +'<\/a><\/li>';
                        }
                    }

                    // 页码
                    if (showPageNumbers) {
                        if (rangeStart <= 3) {
                            for(i = 1; i < rangeStart; i++) {
                                if (i == currentPage) {
                                    html += '<li class="'+ classPrefix +'-page J-paginationjs-page '+ activeClassName +'" data-num="'+ i +'"><a>'+ i +'<\/a><\/li>';
                                }
                                else{
                                    pageUrl = pageLink.replace('{page}', i);
                                    html += '<li class="'+ classPrefix +'-page J-paginationjs-page" data-num="'+ i +'"><a href="'+ pageUrl +'">'+ i +'<\/a><\/li>';
                                }
                            }
                        }
                        else{
                            if (attributes.showFirstOnEllipsisShow) {
                                pageUrl = pageLink.replace('{page}', 1);
                                html += '<li class="'+ classPrefix +'-page '+ classPrefix +'-first J-paginationjs-page" data-num="1"><a href="'+ pageUrl +'">1<\/a><\/li>';
                            }

                            html += '<li class="'+ classPrefix +'-ellipsis '+ disableClassName +'"><a>'+ ellipsisText +'<\/a><\/li>';
                        }

                        // 主循环
                        for(i = rangeStart; i <= rangeEnd; i++) {
                            if (i == currentPage) {
                                html += '<li class="'+ classPrefix +'-page J-paginationjs-page '+ activeClassName +'" data-num="'+ i +'"><a>'+ i +'<\/a><\/li>';
                            }
                            else{
                                pageUrl = pageLink.replace('{page}', i);
                                html += '<li class="'+ classPrefix +'-page J-paginationjs-page" data-num="'+ i +'"><a href="'+ pageUrl +'">'+ i +'<\/a><\/li>';
                            }
                        }

                        if (rangeEnd >= totalPage - 2) {
                            for(i = rangeEnd + 1; i <= totalPage; i++) {
                                pageUrl = pageLink.replace('{page}', i);
                                html += '<li class="'+ classPrefix +'-page J-paginationjs-page" data-num="'+ i +'"><a href="'+ pageUrl +'">'+ i +'<\/a><\/li>';
                            }
                        }
                        else{
                            html += '<li class="'+ classPrefix +'-ellipsis '+ disableClassName +'"><a>'+ ellipsisText +'<\/a><\/li>';

                            if (attributes.showLastOnEllipsisShow) {
                                pageUrl = pageLink.replace('{page}', totalPage);
                                html += '<li class="'+ classPrefix +'-page '+ classPrefix +'-last J-paginationjs-page" data-num="'+ totalPage +'"><a href="'+ pageUrl +'">'+ totalPage +'<\/a><\/li>';
                            }
                        }
                    }

                    // 下一页按钮
                    if (showNext) {
                        if (currentPage == totalPage) {
                            if (!autoHideNext) {
                                html += '<li class="'+ classPrefix +'-next '+ disableClassName +'"><a>'+ nextText +'<\/a><\/li>';
                            }
                        }
                        else{
                            pageUrl = pageLink.replace('{page}', (currentPage + 1));
                            html += '<li class="'+ classPrefix +'-next J-paginationjs-next" data-num="'+ (currentPage + 1) +'" title="Next page"><a href="'+ pageUrl +'">'+ nextText +'<\/a><\/li>';
                        }
                    }

                    html += '<\/ul><\/div>';

                }

                // 导航条
                if (showNavigator) {

                    if (formatNavigator) {

                        formattedString = self.replaceVariables(formatNavigator, {
                            currentPage: currentPage,
                            totalPage: totalPage,
                            totalNumber: totalNumber
                        });

                        html += '<div class="'+ classPrefix +'-nav J-paginationjs-nav">'+ formattedString +'<\/div>';
                    }
                }

                // 跳转输入框
                if (showGoInput) {

                    if (formatGoInput) {

                        formattedString = self.replaceVariables(formatGoInput, {
                            currentPage: currentPage,
                            totalPage: totalPage,
                            totalNumber: totalNumber,
                            input: goInput
                        });

                        html += '<div class="'+ classPrefix +'-go-input">'+ formattedString +'</div>';
                    }
                }

                // 跳转按钮
                if (showGoButton) {

                    if (formatGoButton) {

                        formattedString = self.replaceVariables(formatGoButton, {
                            currentPage: currentPage,
                            totalPage: totalPage,
                            totalNumber: totalNumber,
                            button: goButton
                        });

                        html += '<div class="'+ classPrefix +'-go-button">'+ formattedString +'</div>';
                    }
                }

                if (footer) {

                    formattedString = self.replaceVariables(footer, {
                        currentPage: currentPage,
                        totalPage: totalPage,
                        totalNumber: totalNumber
                    });

                    html += formattedString;
                }

                return html;
            },

            // 跳转到指定的页面
            go: function(number, callback) {

                var self = this;
                var model = self.model;

                if (self.disabled) return;

                var pageNumber = number;
                var pageSize = attributes.pageSize;
                var totalPage = model.totalPage;

                pageNumber = parseInt(pageNumber);

                // 页码范围
                if (!pageNumber || pageNumber < 1 || pageNumber > totalPage) return;

                // 同步模式
                if (self.sync) {
                    render(self.getDataSegment(pageNumber));
                    return;
                }

                var postData = {};
                var alias = attributes.alias || {};

                postData[alias.pageSize ? alias.pageSize : 'pageSize'] = pageSize;
                postData[alias.pageNumber ? alias.pageNumber : 'pageNumber'] = pageNumber;

                var formatAjaxParams = {
                    type: 'get',
                    cache: false,
                    data: {},
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    dataType: 'json',
                    async: true
                };

                $.extend(true, formatAjaxParams, attributes.ajax);
                $.extend(formatAjaxParams.data || {}, postData);

                formatAjaxParams.url = attributes.dataSource;
                formatAjaxParams.success = function(response) {
                    render(self.filterDataByLocator(response));
                };
                formatAjaxParams.error = function(jqXHR, textStatus, errorThrown) {
                    attributes.formatAjaxError && attributes.formatAjaxError(jqXHR, textStatus, errorThrown);
                    self.enable();
                };

                self.disable();

                $.ajax(formatAjaxParams);

                function render(data) {

                    // 分页之前
                    if (self.callHook('beforePaging', pageNumber) === false) return false;

                    // Pagination direction
                    model.direction = typeof model.pageNumber === 'undefined' ? 0 : (pageNumber > model.pageNumber ? 1 : -1);

                    model.pageNumber = pageNumber;

                    self.render();

                    if (self.disabled && !self.sync) {
                        // enable
                        self.enable();
                    }

                    // 缓存模型数据
                    container.data('pagination').model = model;

                    // 格式结果之前执行的回调函数
                    if ($.isFunction(attributes.formatResult)) {
                        var cloneData = $.extend(true, [], data);
                        if (!Helpers.isArray(data = attributes.formatResult(cloneData))) {
                            data = cloneData;
                        }
                    }

                    container.data('pagination').currentPageData = data;

                    // callback
                    self.doCallback(data, callback);

                    // 分页之后
                    self.callHook('afterPaging', pageNumber);

                    // 已经是第一页
                    if (pageNumber == 1) {
                        self.callHook('afterIsFirstPage');
                    }

                    // 已经是最后一页
                    if (pageNumber == model.totalPage) {
                        self.callHook('afterIsLastPage');
                    }

                }
            },

            doCallback: function(data, customCallback) {
                var self = this;
                var model = self.model;

                if ($.isFunction(customCallback)) {
                    customCallback(data, model);
                }
                else if ($.isFunction(attributes.callback)) {
                    attributes.callback(data, model);
                }
            },

            destroy: function() {

                // 销毁之前
                if (this.callHook('beforeDestroy') === false) return;

                this.model.el.remove();
                container.off();

                // 删除样式元素
                $('#paginationjs-style').remove();

                // 销毁之后
                this.callHook('afterDestroy');
            },

            previous: function(callback) {
                this.go(this.model.pageNumber - 1, callback);
            },

            next: function(callback) {
                this.go(this.model.pageNumber + 1, callback);
            },

            disable: function() {
                var self = this;
                var source = self.sync ? 'sync' : 'async';

                // 禁用之前
                if (self.callHook('beforeDisable', source) === false) return;

                self.disabled = true;
                self.model.disabled = true;

                // 禁用之后
                self.callHook('afterDisable', source);
            },

            enable: function() {
                var self = this;
                var source = self.sync ? 'sync' : 'async';

                // 启用之前
                if (self.callHook('beforeEnable', source) === false) return;

                self.disabled = false;
                self.model.disabled = false;

                // 启用之后
                self.callHook('afterEnable', source);
            },

            refresh: function(callback) {
                this.go(this.model.pageNumber, callback);
            },

            show: function() {
                var self = this;

                if (self.model.el.is(':visible')) return;

                self.model.el.show();
            },

            hide: function() {
                var self = this;

                if (!self.model.el.is(':visible')) return;

                self.model.el.hide();
            },

            // 替换变量的模板
            replaceVariables: function(template, variables) {

                var formattedString;

                for(var key in variables) {
                    var value = variables[key];
                    var regexp = new RegExp('<%=\\s*'+ key +'\\s*%>', 'img');

                    formattedString = (formattedString || template).replace(regexp, value);
                }

                return formattedString;
            },
            // 替换pageLink中的页面
            replacePageLink : function(template, variables){
                var formattedString;

                for(var key in variables) {
                    var value = variables[key];
                    var regexp = new RegExp('{'+ key +'}', 'img');

                    formattedString = (formattedString || template).replace(regexp, value);
                }

                return formattedString;
            },

            // 获取数据段
            getDataSegment: function(number) {
                var pageSize = attributes.pageSize;
                var dataSource = attributes.dataSource;
                var totalNumber = attributes.totalNumber;

                var start = pageSize * (number - 1) + 1;
                var end = Math.min(number * pageSize, totalNumber);

                return dataSource.slice(start - 1, end);
            },

            // 获取总页数
            getTotalPage: function() {
                return Math.ceil(attributes.totalNumber / attributes.pageSize);
            },

            // 获取数据定位
            getLocator: function(locator) {
                var result;

                if (typeof locator === 'string') {
                    result = locator;
                }
                else if ($.isFunction(locator)) {
                    result = locator();
                }
                else{
                    throwError('"locator" is incorrect. (String | Function)');
                }

                return result;
            },

            // 通过 "locator" 过滤数据
            filterDataByLocator: function(dataSource) {

                var locator = this.getLocator(attributes.locator);
                var filteredData;

                // dataSource 是一个对象,使用 “locator” 来定位真正的数据
                if (Helpers.isObject(dataSource)) {
                    try{
                        $.each(locator.split('.'), function(index, item) {
                            filteredData = (filteredData ? filteredData : dataSource)[item];
                        });
                    }
                    catch(e) {}

                    if (!filteredData) {
                        throwError('dataSource.'+ locator +' is undefined.');
                    }
                    else if (!Helpers.isArray(filteredData)) {
                        throwError('dataSource.'+ locator +' must be an Array.');
                    }
                }

                return filteredData || dataSource;
            },

            // 解析 dataSource
            parseDataSource: function(dataSource, callback) {

                var self = this;
                var args = arguments;

                if (Helpers.isObject(dataSource)) {
                    callback(attributes.dataSource = self.filterDataByLocator(dataSource));
                }
                else if (Helpers.isArray(dataSource)) {
                    callback(attributes.dataSource = dataSource);
                }
                else if ($.isFunction(dataSource)) {
                    attributes.dataSource(function(data) {
                        if ($.isFunction(data)) {
                            throwError('Unexpect parameter of the "done" Function.');
                        }

                        args.callee.call(self, data, callback);
                    });
                }
                else if (typeof dataSource === 'string') {
                    if (/^https?|file:/.test(dataSource)) {
                        attributes.ajaxDataType = 'jsonp';
                    }

                    callback(dataSource);
                }
                else{
                    throwError('Unexpect data type of the "dataSource".');
                }
            },

            callHook: function(hook) {
                var paginationData = container.data('pagination');
                var result;

                var args = Array.prototype.slice.apply(arguments);
                args.shift();

                if (attributes[hook] && $.isFunction(attributes[hook])) {
                    if (attributes[hook].apply(global, args) === false) {
                        result = false;
                    }
                }

                if (paginationData.hooks && paginationData.hooks[hook]) {
                    $.each(paginationData.hooks[hook], function(index, item) {
                        if (item.apply(global, args) === false) {
                            result = false;
                        }
                    });
                }

                return result !== false;
            },

            observer: function() {

                var self = this;
                var el = self.model.el;

                // Go to page
                container.on(eventPrefix + 'go', function(event, pageNumber, done) {

                    pageNumber = parseInt($.trim(pageNumber));

                    if (!pageNumber) return;

                    if (!$.isNumeric(pageNumber)) {
                        throwError('"pageNumber" is incorrect. (Number)');
                    }

                    self.go(pageNumber, done);
                });

                // Page click
                el.delegate('.J-paginationjs-page', 'click', function(event) {
                    var current = $(event.currentTarget);
                    var pageNumber = $.trim(current.attr('data-num'));

                    if (!pageNumber || current.hasClass(attributes.disableClassName) || current.hasClass(attributes.activeClassName)) return;

                    // 页面按钮点击之前
                    if (self.callHook('beforePageOnClick', event, pageNumber) === false) return false;

                    self.go(pageNumber);

                    // 页面按钮点击之后
                    self.callHook('afterPageOnClick', event, pageNumber);

                    if (!attributes.pageLink) return false;
                });

                // Previous click
                el.delegate('.J-paginationjs-previous', 'click', function(event) {
                    var current = $(event.currentTarget);
                    var pageNumber = $.trim(current.attr('data-num'));

                    if (!pageNumber || current.hasClass(attributes.disableClassName)) return;

                    // 上一页点击之前
                    if (self.callHook('beforePreviousOnClick', event, pageNumber) === false) return false;

                    self.go(pageNumber);

                    // 上一页点击之后
                    self.callHook('afterPreviousOnClick', event, pageNumber);

                    if (!attributes.pageLink) return false;
                });

                // Next click
                el.delegate('.J-paginationjs-next', 'click', function(event) {
                    var current = $(event.currentTarget);
                    var pageNumber = $.trim(current.attr('data-num'));

                    if (!pageNumber || current.hasClass(attributes.disableClassName)) return;

                    // 下一页点击之前
                    if (self.callHook('beforeNextOnClick', event, pageNumber) === false) return false;

                    self.go(pageNumber);

                    // 下一页点击之后
                    self.callHook('afterNextOnClick', event, pageNumber);

                    if (!attributes.pageLink) return false;
                });

                // Go button click
                el.delegate('.J-paginationjs-go-button', 'click', function() {
                    var pageNumber = $('.J-paginationjs-go-pagenumber', el).val();

                    // 跳转按钮点击之前
                    if (self.callHook('beforeGoButtonOnClick', event, pageNumber) === false) return false;

                    container.trigger(eventPrefix + 'go', pageNumber);

                    // 跳转按钮点击之后
                    self.callHook('afterGoButtonOnClick', event, pageNumber);
                });

                // go input enter
                el.delegate('.J-paginationjs-go-pagenumber', 'keyup', function(event) {
                    if (event.which === 13) {
                        var pageNumber = $(event.currentTarget).val();

                        // 输入之前
                        if (self.callHook('beforeGoInputOnEnter', event, pageNumber) === false) return false;

                        container.trigger(eventPrefix + 'go', pageNumber);

                        // 重新获取焦点
                        $('.J-paginationjs-go-pagenumber', el).focus();

                        // 输入之后
                        self.callHook('afterGoInputOnEnter', event, pageNumber);
                    }
                });

                // 上一页
                container.on(eventPrefix + 'previous', function(event, done) {
                    self.previous(done);
                });

                // 下一页
                container.on(eventPrefix + 'next', function(event, done) {
                    self.next(done);
                });

                // 禁用
                container.on(eventPrefix + 'disable', function() {
                    self.disable();
                });

                // 启用
                container.on(eventPrefix + 'enable', function() {
                    self.enable();
                });

                // 刷新
                container.on(eventPrefix + 'refresh', function(event, done) {
                    self.refresh(done);
                });

                // 显示
                container.on(eventPrefix + 'show', function() {
                    self.show();
                });

                // 隐藏
                container.on(eventPrefix + 'hide', function() {
                    self.hide();
                });

                // 销毁
                container.on(eventPrefix + 'destroy', function() {
                    self.destroy();
                });

                // 是否加载默认页面
                if (attributes.triggerPagingOnInit) {
                    container.trigger(eventPrefix + 'go', Math.min(attributes.pageNumber, self.model.totalPage));
                }
            }
        };


        // If initial
        if (container.data('pagination') && container.data('pagination').initialized === true) {

            // 处理事件
            if ($.isNumeric(options)) {
                // container.pagination(5)
                container.trigger.call(this, eventPrefix + 'go', options, arguments[1]);
                return this;
            }
            else if (typeof options === 'string') {

                var args = Array.prototype.slice.apply(arguments);
                args[0] = eventPrefix + args[0];

                switch(options) {
                    case 'previous':
                    case 'next':
                    case 'go':
                    case 'disable':
                    case 'enable':
                    case 'refresh':
                    case 'show':
                    case 'hide':
                    case 'destroy':
                        container.trigger.apply(this, args);
                        break;

                    // 得到选中页码
                    case 'getSelectedPageNum':
                        if (container.data('pagination').model) {
                            return container.data('pagination').model.pageNumber;
                        }
                        else{
                            return container.data('pagination').attributes.pageNumber;
                        }

                    // 得到总页面
                    case 'getTotalPage':
                        return container.data('pagination').model.totalPage;

                    // 得到选中的页面数据
                    case 'getSelectedPageData':
                        return container.data('pagination').currentPageData;

                    // 分页是否被禁用
                    case 'isDisabled':
                        return container.data('pagination').model.disabled === true;

                    default:
                        throwError('Pagination do not provide action: ' + options);
                }

                return this;
            } else {
                // 卸载旧实例之前初始化一个新的
                uninstallPlugin(container);
            }
        }
        else{
            if (!Helpers.isObject(options)) {
                throwError('Illegal options');
            }
        }


        // 属性
        var attributes = $.extend({}, arguments.callee.defaults, options);

        // 检查参数
        parameterChecker(attributes);

        pagination.initialize();

        return this;
    };

    // 实例的默认值
    $.fn[pluginName].defaults = {

        // Data source
        // Array | String | Function | Object
        //dataSource: '',

        // String | Function
        //locator: 'data',

        // 总条目,必须指定分页是异步的
        totalNumber: 1,

        // 默认页数
        pageNumber: 1,

        // 每页的条目
        pageSize: 10,

        // 页面范围(当前页的两边)
        pageRange: 2,

        // 是否显示 'Previous' 按钮
        showPrevious: true,

        // 是否显示 'Next' 按钮
        showNext: true,

        // 是否显示分页按钮
        showPageNumbers: true,

        showNavigator: false,

        // 是否显示 'Go' 输入框
        showGoInput: false,

        // 是否显示 'Go' 按钮
        showGoButton: false,

        // 页面链接
        pageLink: '',

        // 'Previous' 文本
        prevText: '&laquo;',

        // 'Next' 文本
        nextText: '&raquo;',

        // 省略号文本
        ellipsisText: '...',

        // 'Go' 按钮文本
        goButtonText: 'Go',

        // 额外分页元素的样式名称
        //className: '',

        classPrefix: 'paginationjs',

        // 默认当前页的样式名
        activeClassName: 'active',

        // 默认禁用的样式名
        disableClassName: 'disabled',

        // 分页中ul的样式名
        //ulClassName: '',

        // 是否插入内联样式
        inlineStyle: true,

        formatNavigator: '<%= currentPage %> / <%= totalPage %>',

        formatGoInput: '<%= input %>',

        formatGoButton: '<%= button %>',

        // 分页元素在容器中的位置
        position: 'bottom',

        // 当第一页时自动隐藏上一页按钮
        autoHidePrevious: false,

        // 当最后一页时自动隐藏下一页按钮
        autoHideNext: false,

        //header: '',

        //footer: '',

        // 别名为自定义分页参数
        //alias: {},

        // 是否在初始化时触发分页
        triggerPagingOnInit: true,

        // 当不到一页的时候是否隐藏分页
        hideWhenLessThanOnePage: false,

        showFirstOnEllipsisShow: true,

        showLastOnEllipsisShow: true,

        // 分页回调
        callback: function() {}
    };

    // 注册钩子
    $.fn[pluginHookMethod] = function(hook, callback) {

        if (arguments.length < 2) {
            throwError('Missing argument.');
        }

        if (!$.isFunction(callback)) {
            throwError('callback must be a function.');
        }

        var container = $(this);
        var paginationData = container.data('pagination');

        if (!paginationData) {
            container.data('pagination', {});
            paginationData = container.data('pagination');
        }

        !paginationData.hooks && (paginationData.hooks = {});

        //paginationData.hooks[hook] = callback;
        paginationData.hooks[hook] = paginationData.hooks[hook] || [];
        paginationData.hooks[hook].push(callback);

    };

    // 静态方法
    $[pluginName] = function(selector, options) {

        if (arguments.length < 2) {
            throwError('Requires two parameters.');
        }

        var container;

        // 'selector' is a jQuery object
        if (typeof selector !== 'string' && selector instanceof jQuery) {
            container = selector;
        }
        else{
            container = $(selector);
        }

        if (!container.length) return;

        container.pagination(options);

        return container;

    };

    // ============================================================
    // helpers
    // ============================================================

    var Helpers = {};

    // Throw error
    function throwError(content) {
        throw new Error('Pagination: '+ content);
    }

    // 检查参数
    function parameterChecker(args) {

        if (!args.dataSource) {
            throwError('"dataSource" is required.');
        }

        if (typeof args.dataSource === 'string') {
            if (typeof args.totalNumber === 'undefined') {
                throwError('"totalNumber" is required.');
            }
            else if (!$.isNumeric(args.totalNumber)) {
                throwError('"totalNumber" is incorrect. (Number)');
            }
        }
        else if (Helpers.isObject(args.dataSource)) {
            if (typeof args.locator === 'undefined') {
                throwError('"dataSource" is an Object, please specify "locator".');
            }
            else if (typeof args.locator !== 'string' && !$.isFunction(args.locator)) {
                throwError(''+ args.locator +' is incorrect. (String | Function)');
            }
        }
    }

    // 卸载插件
    function uninstallPlugin(target) {
        var events = ['go', 'previous', 'next', 'disable', 'enable', 'refresh', 'show', 'hide', 'destroy'];

        // off events of old instance
        $.each(events, function(index, value) {
            target.off(eventPrefix + value);
        });

        // reset pagination data
        target.data('pagination', {});

        // remove old
        $('.paginationjs', target).remove();
    }

    // 对象类型检测
    function getObjectType(object, tmp) {
        return ( (tmp = typeof(object)) == "object" ? object == null && "null" || Object.prototype.toString.call(object).slice(8, -1) : tmp ).toLowerCase();
    }
    $.each(['Object', 'Array'], function(index, name) {
        Helpers['is' + name] = function(object) {
            return getObjectType(object) === name.toLowerCase();
        };
    });

    /*
     * export via AMD or CommonJS
     * */
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return $;
        });
    }

})(this, window.jQuery);

;/*!/widget/Module.popover/xue.popover.js*/
/**
 * 提示弹出层封装
 * @authors duxinli
 * @date    2015-11-17
 * @version $Id$
 */

var popoverTips = popoverTips || {};


/**
 * 提示弹出层显示方法
 * @param  {Object} params 参数配置对象
 */
popoverTips.show = function (params) {
    params = $.extend({
                    dom: null, //任意子节点
                    placement: 'top', //弹出层显示位置
                    trigger: 'click', //事件
                    con: '', //提示内容，可以是function或者html字符串
                    title: '', //title内容
                    html: true //true |false
                }, params || {});

    //先清除已经存在的
    if($('body').find('.popover[role="tooltip"]')){
        $('body').find('.popover[role="tooltip"]').each(function(){
             var that = this;
             $(this).prev().prev().popover('destroy');
             $(this).siblings('.popover-mask-box').remove();
        }) 
    }
   //配置参数
    if( params.dom ){
        $(params.dom).popover({
              placement: params.placement,
              html: params.html,
              trigger: params.trigger,
              title: params.title,
              content: params.con
        });
        $(params.dom).popover('show');
    }

    //弹出展开的时候删除点击dom防止重复点击
    var _domW = $(params.dom).outerWidth();
    var _domH = $(params.dom).outerHeight();
    if( $(params.dom).nextAll('.popover-mask-box').length == 0 ){
         $(params.dom).after('<span class="popover-mask-box"></span>');
         $(params.dom).nextAll('.popover-mask-box').css({
              width:_domW,
              height:_domH,
              marginLeft:-(_domW)
         });
    }
};

/**
 * 提示弹出层销毁方法
 * @param  {Object} dom 任意子节点
 */
popoverTips.destroy = function (dom) {
    $(dom).popover('destroy');
    $(dom).nextAll('.popover-mask-box').remove();
}


;/*!/widget/Module.Modal/Modal.js*/
/**
 * Created by yangmengyuan on 15/11/17.
 */
var createModal = createModal || {};


createModal.show = function(e){
	this.opt = {};
    this.target = '';
    $.extend(this.opt, e);
    //console.log(this.opt);
    $('body').append("<div id='"+ this.opt.id +"' class='modal fade "+this.opt.cls+"'  role='dialog'><div class='modal-dialog' style='width:"+ this.opt.width +"px;' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title'>"+this.opt.title+"</h4></div><div class='modal-body'>"+this.opt.content+"</div></div>");
    $('.modal').on('hidden.bs.modal',function(e){
        $(this).remove();
    })
};




;/*!/widget/Public.Dynamic/fresh.js*/
/*******************************************
 *
 * 新鲜事所有交互逻辑业务功能
 * @authors Du xin li
 * @date    2015-10-22
 * @version $Id$
 *
*********************************************/

var fresh = fresh || {};
fresh.path = fresh.path || {};
//fresh.path.url = '/data/Dynamic/';
fresh.path.url = '/Dynamic/';
fresh.path.img = '/static/img/';
fresh.emoteHmtl = null;

/**
 * 
 * 动态切换大小图片、视频、作答效果
 * @param {Object} fm fresh.media前缀
 * 
 */
fresh.media = fresh.media || {};

(function(fm){

	fm.img = fm.img || {};
	/**
	 * 切换大小图片方法
	 * @param  {Object} dom 任意子节点
	 */
    fm.img.toggle = function(dom){
        var _img = $(dom);
        //判断是否存在图片，如果不存在则返回false
        if( _img.length == 0 ){ 
       	    return false; 
        } else {
       	    var _url = _img.find('img').attr('src');
            if( _img.hasClass('fresh-media-img-list') ){
            	if( _img.siblings('.fresh-type-img').find('img').length == 0 ){
                   var _tpl ='<div class="fresh-media-big-img">\
      			                    <img src="'+ _url.replace("_small", "_big")+ '">\
      			                  </div>';
                    _img.siblings('.fresh-type-img').html(_tpl);   
            	}
	        }
	        _img.hide();
	        _img.siblings('.fresh-type-img').show();    
        }
    }

    fm.answer = fm.answer || {};

    /**
     * 点击作答按钮动态切换试题大小图方法
     * @param  {Object} dom 任意子节点
     */
    fm.answer.btnToggle = function(dom){
        var that = $(dom), 
            _wrap = that.closest('.fresh-detail'), 
            _item = _wrap.find('.fresh-type-answer');
        _item.toggle();
        if(_item.hasClass('fresh-big-img-answer')){
            _item.find('.fresh-sign-remove').remove();
        }
    }

    /**
     * 点击动态试题图片切换方法
     * @param  {Object} dom 任意子节点
     * @param  {Object} e event对象
     */
    fm.answer.imgToggle = function(dom, e){
        var that = $(dom);
        if($(e.target).data('type') == 'radio'){
            return false;
        }else{
            that.hide().siblings('.fresh-type-answer').show();
            if(that.hasClass('fresh-big-img-answer')){
                that.find('.fresh-sign-remove').remove();
            }
        }
    }
  
    /**
     * 选择动态试题答案：提交答案
     * @param  {Object} dom 任意子节点
     */
    fm.answer.answerSubmit = function(dom){
        var that = $(dom),
            selectAnswer_Box = that.closest('.fresh-big-answer'),
            smallAnswer_Box = that.closest('.fresh-type-answer').siblings('.fresh-type-answer').find('.fresh-media-small-img');

        //解析html
        var analysis_html = '<div class="fresh-big-analysis">$analysis$</div>';

        //增加答题正确与否与抢金币成功与否的图片提示html
        var bigSign_html = '<div class="fresh-big-sign-exam fresh-sign-remove"><img src="'+fresh.path.img+'$bigSignImg$.png"/></div>';

         //增加大图右上角正确或错误图标html
        var examRight_html = '<i class="fresh-bigimg-examIcon $examRightIcon$"></i>';

        //改变小图试题右上角正确或错误图标html
        var smallRight_html = '<i class="fresh-examIcon $smallRightIcon$"></i>';

        //作题结果提示html
        var examRezult_html = '', 
            _url = window.location.pathname,
            _dynId = that.closest('.fresh-detail').data("id"),
            _stuAnswer = $.trim(that.text());

        $.ajax({
              //url: fresh.path.url + 'answer.json',
              url: fresh.path.url + 'ajaxSaveDynQueLog',
              //type : 'get',
              type : 'post',
              dataType : 'json',
              data : {
                  url : _url,
                  dynId : _dynId,
                  stuAnswer : _stuAnswer
              },
              beforeSend: function() {
                  $(dom).addClass('fresh-Answer-disabled');
              },
              success : function(data){
                    var _sign = data.sign;
                    var dataMsg = data.msg;

                    if( _sign == 0 ){
                         alert(data.msg);
                         return false;
                    }else if( _sign == 2 ){
                       window.location.href = dataMsg;
                       return false;
                    }
                    
                    // 增加解析内容
                    if(dataMsg.analysisimg_path != ''){
                        analysis_html = analysis_html.replace('$analysis$', '<strong>解析</strong><img src="' + dataMsg.analysisimg_path + '">');
                    }else{
                        analysis_html = analysis_html.replace('$analysis$', '');
                    }
                    selectAnswer_Box.after(analysis_html);

                    // 增加右上角正确/错误提示图标
                    if(dataMsg.is_right == '1'){
                        if(dataMsg.is_gold == '1'){
                            bigSign_html = bigSign_html.replace('$bigSignImg$', 'fresh_examtip1');
                        }else{
                            bigSign_html = bigSign_html.replace('$bigSignImg$', 'fresh_examtip');
                        }
                        examRight_html = examRight_html.replace('$examRightIcon$', 'fresh-bigimg-examIcon-right');
                        smallRight_html = smallRight_html.replace('$smallRightIcon$', 'fresh-examIcon-right');
                    }else{
                        bigSign_html = bigSign_html.replace('$bigSignImg$', 'fresh_examtip2');
                        examRight_html = examRight_html.replace('$examRightIcon$', 'fresh-bigimg-examIcon-error');
                        smallRight_html = smallRight_html.replace('$smallRightIcon$', 'fresh-examIcon-error');
                    }
                    selectAnswer_Box.before(bigSign_html);
                    selectAnswer_Box.after(examRight_html);
                    smallAnswer_Box.append(smallRight_html);

                    //作题结果提示
                    examRezult_html += '您的答案是：<em>'+ dataMsg.stu_answer +'</em>&nbsp;&nbsp;';
                    examRezult_html += '&nbsp;&nbsp;参考答案是：<span>'+ dataMsg.right_answer +'</span>&nbsp;&nbsp;&nbsp;&nbsp;';
                    /*if(dataMsg.right_num <= 5){
                        examRezult_html += '<span class="fresh-sign-remove">每日五题已答对<em> '+ dataMsg.right_num +' </em>题</span>&nbsp;&nbsp;&nbsp;&nbsp;';
                    }else{
                        examRezult_html += '<span class="fresh-sign-remove">每日五题已完成</span>';
                    }
                    examRezult_html += '<span class="fresh-sign-remove">你是第<em> '+ dataMsg.dyn_que_replynum +' </em>';*/
                    examRezult_html += '<span class="fresh-sign-remove">你是第<em> '+ dataMsg.dyn_que_replynum +' </em>个答题的学员，已有<em> '+ dataMsg.dyn_que_rightnum +' </em>人答对!</span>';
                    selectAnswer_Box.html(examRezult_html)
              },
              complete: function() {
                  $(dom).removeClass('fresh-Answer-disabled');
              }
        });
    };

    fm.video = fm.video || {};

    /**
     * 新鲜事点击视频缩略图展开播放视频方法
     * @param  {Object} dom 任意子节点
     */
   /* fm.video.videoPlay = function(dom){
        var videoBox = $(dom).closest('.fresh-type-video');
        //视频div层显示
        videoBox.next().show();
        //视频缩略图隐藏
        videoBox.hide();//图隐藏
        var url = videoBox.next().data('url');
        var video_html ='<div class="fresh-media-big-video">'
                            + '<p class="fresh-media-packUp"><a href="javascript:void(0);" class="fresh-packUp-video">收起</a></p>'
                            + '<div id="flashcontent" style ="height:408px;">'
                            + '<object id="FlashID" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" height="408" width="600"> '
                            + '<param name="movie" value="http://www.xueersi.com/flash/xueersiPlayer.swf" />'
                            + '<param name="quality" value="high" />'
                            + '<param name="wmode" value="opaque" />'
                            + '<param name="allowscriptaccess" value="always">'
                            + '<param name="allowFullScreen" value="true" />'
                            + '<param name="swfversion" value="9.0.115.0" />'
                            + '<param name="FlashVars" value="url='+ url +'/&autoPlay=true" />'
                            + '<!-- 此 param 标签提示使用 Flash Player 6.0 r65 和更高版本的用户下载最新版本的 Flash Player。如果您不想让用户看到该提示，请将其删除。 -->'
                            + '<param name="expressinstall" value="./player/expressInstall.swf" />'
                            + '<!-- 下一个对象标签用于非 IE 浏览器。所以使用 IECC 将其从 IE 隐藏。 --> '
                            + '<!--[if !IE]>-->'
                            + '<object type="application/x-shockwave-flash" data="http://www.xueersi.com/flash/xueersiPlayer.swf" height="100%" width="100%">'
                            + '<!--<![endif]-->'
                            + '<param name="quality" value="high" />'
                            + '<param name="wmode" value="opaque" />'
                            + '<param name="allowscriptaccess" value="always">'
                            + '<param name="allowFullScreen" value="true" />'          
                            + '<param name="swfversion" value="9.0.115.0" />'         
                            + '<param name="expressinstall" value="player/expressInstall.swf" />'
                            +'<param name="FlashVars" value="url='+ url +'/&autoPlay=true" />'
                            +'<!-- 浏览器将以下替代内容显示给使用 Flash Player 6.0 和更低版本的用户。 -->'
                            +'<div>'
                            +'<h4>此页面上的内容需要较新版本的 Adobe Flash Player。</h4>'
                            +'<p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="获取 Adobe Flash Player" height="33" width="112" /></a></p>'
                            +'</div>'
                            +'<!--[if !IE]>-->'
                            +'</object>    '       
                            +'<!--<![endif]-->'
                            +'</object>'
                          + '</div>'
                        + '</div>'; 
        videoBox.next().html(video_html);  
    }*/

    fm.video.videoPlay = function(dom){
        var videoBox = $(dom).closest('.fresh-type-video');
        //视频div层显示
        videoBox.next().show();
        //视频缩略图隐藏
        videoBox.hide();//图隐藏
        var url = videoBox.next().data('url');
        var video_html ='<div class="fresh-media-big-video">'
                            + '<p class="fresh-media-packUp"><a href="javascript:void(0);" class="fresh-packUp-video">收起</a></p>'
                            + '<div id="flashcontent" style ="height:408px;">'
                            +'<iframe src="'+url+'" frameborder="no" border="0" scrolling="no" width="100%" height="100%">iframe>'
                            +'</div>'
                         +'</div>'; 
      videoBox.next().html(video_html);
         
    }
    
    /**
     * 点击视频大图上的收起显示小图视频方法
     * @param  {Object} dom 任意子节点
     */
    fm.video.videoHide = function(dom){
        var videoBox = $(dom).closest(".fresh-media-expand-video");
        videoBox.hide();
        videoBox.prev().show();
        videoBox.find(".fresh-media-big-video").remove();
  } 

})(fresh.media);




/**
 * 
 * 评论所有相关业务
 * @param {Object} fc fresh.comment前缀
 * 
 */
fresh.comment = fresh.comment || {};

(function(fc){

  fc.tpl ={
      formBox: '<form class="fresh-comment-form fresh-parentComment-formBox" action="javascript:void(0);">\
                      <div class="fresh-comment-title">\
                          <span class="fresh-comment-title-text pull-left">原文评论</span> \
                          <span class="fresh-comment-close-btn pull-right"></span>\
                      </div>\
                      <div class="fresh-comment-textarea">\
                        <textarea></textarea>\
                      </div>\
                      <div class="fresh-comment-func">\
                          <div class="fresh-comment-emote-smiles-btn fresh-emote-current" flag="0">\
                              <i class="fresh-comment-emote-btn"></i>\
                              <a href="javascript:void(0);" class="fresh-comment-emotetext">表情</a>\
                          </div>\
                          <div class="fresh-comment-btn">\
                             <span class="fresh-comment-size">您还可以输入<em class="fresh-comment-text-num"> 140 </em>字</span>\
                             <div class="fresh-comment-submit-btn">\
                                <a href="#" class="blue-radius-btn" data-toggle="modal" data-target="#fresh-dialog-verificationCode">评论</a>\
                             </div>\
                          </div>\
                          <span class="fresh-comment-tips hiding"></span>\
                      </div>\
                  </form>',
      replyForm: '<form class="fresh-comment-form fresh-comment-repley" action="javascript:void(0);">\
                      <div class="fresh-comment-textarea">\
                        <textarea>$textarea$</textarea>\
                      </div>\
                      <div class="fresh-comment-func">\
                          <div class="fresh-comment-emote-smiles-btn fresh-emote-current" flag="0">\
                              <i class="fresh-comment-emote-btn"></i>\
                              <a href="javascript:void(0);" class="fresh-comment-emotetext">表情</a>\
                          </div>\
                          <div class="fresh-comment-btn">\
                             <div class="fresh-comment-submit-btn">\
                                <a href="#" class="blue-radius-btn" data-toggle="modal" data-target="#fresh-dialog-verificationCode">评论</a>\
                             </div>\
                          </div>\
                          <span class="fresh-comment-tips hiding"></span>\
                      </div>\
                  </form>'            
    };

    fc.param = {
        wraper: null,//单条评论信息fresh-detail类名
        commentBox: null,//单条评论信息评论框fresh-comment-box类名
        infoBox: null,//显示评论信息的fresh-comment-detail-info类名
        bar: null,//评论按钮fresh-comment-expand-btn类名
        close: null,//评论框的关闭按钮fresh-comment-close-btn类名
        form: null,//评论框文本域fresh-comment-textarea类名下的textarea
        submit: null,//提交评论按钮fresh-comment-submit-btn类名下的a
        textSzie: null,//评论文字限制区域的文字数量fresh-comment-text-num类名
        status: null//发送评论状态显示fresh-comment-status类名在fresh-comment-textarea的自己中
    };

    /**
     * 设置默认参数
     * @param  {Object} dom 任意子节点
     */
    fc.setParam = function(dom) {
        var that = $(dom);

        if (that.length == 0) {
            return false;
        }
        var wraper = that.closest('.fresh-detail');
        if (wraper.length == 0) {
            return false;
        }
        //获取信息id
        this.id = wraper.data('id');
        var _infoBox = null;

        if( wraper.find('.fresh-comment-detail-info').length == 0 ){
            _infoBox = wraper.closest('.fresh-comment-detail-info');
        } else {
            _infoBox = wraper.find('.fresh-comment-detail-info');
        }
        var _commentBox = null;
        if( wraper.find('.fresh-comment-box').length == 0 ){
            _commentBox = wraper.closest('.fresh-comment-box');
        } else {
            _commentBox = wraper.find('.fresh-comment-box');
        }
        this.param = {
            wraper: wraper,
            commentBox: _commentBox,
            bar: wraper.find('.fresh-comment-expand-btn'),
            infoBox: _infoBox,
            close: wraper.find('.fresh-comment-close-btn'),
            form: wraper.find('.fresh-comment-textarea:eq(0) textarea'),
            submit: wraper.find('.fresh-comment-submit-btn:eq(0) a'),
            textSzie: wraper.find('.fresh-comment-form:eq(0)').find('.fresh-comment-text-num'),
            status: wraper.find('.fresh-comment-form:eq(0)').find('.fresh-comment-status'),
            tips: wraper.find('.fresh-comment-tips:eq(0)')
        };
    }

    /**
     * 点击评论切换评论框区域和评论消息方法
     * @param  {Object} dom 任意子节点
     */
    fc.toggle = function(dom){
        if(dom){
           this.setParam(dom);
        }else{
           return false;
        }
        if( this.param.bar.hasClass('fresh-comment-show') ){
           this.hide();
        } else {
           this.show(dom);
        }
        
    } 

    /**
     * 评论框区域和评论消息显示方法
     * @param  {Object} dom 任意子节点
     */
    fc.show = function(dom){
        if(dom){
           this.setParam(dom);
        }else{
           return false;
        }
        this.param.bar.addClass('fresh-comment-show');
        this.getList(dom);
    }

    /**
     * 评论框区域和评论消息隐藏方法
     * @param  {Object} dom 任意子节点
     */
    fc.hide = function(){
        this.param.bar.removeClass('fresh-comment-show');
        this.param.commentBox.addClass('hiding');
        // 隐藏后初始化参数
        $.each(this.param, function(k, v) {
            fc.param[k] = null;
        });
    }

    /**
     * 关闭评论框方法
     * @param  {Object} dom 任意子节点
     */
    fc.close = function(dom){
        if(dom){
           this.setParam(dom);
        }else{
           return false;
        }
        //判断评论类型，默认评论框是否显示data-type=2显示默认
        if (this.param.bar.data('type') && this.param.bar.data('type') == 2) {
            return false;
        }
        this.hide();
    }

    /**
     * 获取评论列表信息
     * @param  {Object} dom 任意子节点
     */
    fc.getList = function(dom){

        if(dom){
          this.setParam(dom);
        }else{
           return false;
        }

        var _params = fc.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').data('params');
        //ajax获取评论信息
        $.ajax({
            //url: fresh.path.url + "coment.html",
            //type: 'get',
            url: fresh.path.url + "dynComList",
            type: 'post',
            dataType: 'html',
            data: _params,
            beforeSend: function() {
                fc.param.infoBox.html('<span class="fresh-commentInfo-loading">Loading...</span>');
            },
            success: function(data) {
                fc.setMsg(data);
            },
            error: function(a, b, c) {
                alert(c);
            },
            complete: function() {
                fc.param.infoBox.find('.fresh-commentInfo-loading').remove();
            }
        }); 
    }
     
    /**
     * 设置评论内容信息方法
     * @param  {string} msg 评论信息html内容
     * @param  {Object} dom 任意子节点
     */
    fc.setMsg = function(msg) {
        if (!msg) {
            return false;
        }

        //如果没有评论消息返回的是暂无评论的html
        this.param.commentBox.removeClass('hiding');
        this.param.infoBox.html(msg);
        
        //评论发布框
        var _formBox = this.tpl.formBox;
        if( this.param.commentBox.find('.fresh-parentComment-formBox').length == 0 ){
            this.param.commentBox.prepend(_formBox);
        }

        var _closeBtn = this.param.commentBox.find('.fresh-comment-close-btn');
        this.param.commentBox.find('.fresh-comment-form:eq(0) textarea').focus();
        var bar_type = this.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').data('type');

        //判断关闭按钮显示与否
        if ( bar_type && bar_type == 2) {
            _closeBtn.hide();
        } else {
            _closeBtn.show();
        }
    }

    /**
     * 评论框文本域属于字数限制方法
     * @param  {string} dom 任意子节点
     */
    fc.textareaNum = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(that.val());
        var len = val.length;
        var form = that.closest('.fresh-comment-form'),
            size = form.find('.fresh-comment-size .fresh-comment-text-num');

        if (len > 140) {
            that.val(val.substring(0, 140));
            size.text(0);
            return false;
        } else {
            size.text(140 - len);
        }
    };

    /**
     * 设置评论数量方法
     * @param  {string} dom 任意子节点
     */
    fc.setcount = function() {
        var countbox = this.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').next('em').find('i');
        if( countbox.length == 0){
            return false;
        }
        var _num = Number(countbox.text());
        _num++;
        countbox.text(_num);
    };
    
    /**
     * 发布评论方法
     * @param  {string} dom 任意子节点
     */
    fc.post = function(dom){

        //判断元素节点是否存在
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        
        var val = $.trim(this.param.form.val());
        var len = val.length;
        if( len == 0 ){
           alert('请您填写内容');
           return false; 
        }
        
        //验证码的值
        var vd = $('#verificationCode').val() || '';
        var _tipCode = $('#fresh-dialog-tips-Code');

        var _params = fc.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').data('params');

       
        $.ajax({
            //url: fresh.path.url + 'ajaxAddDynComment.json',//添加成功与否验证ajax
            //data: param + '&content=' + encodeURIComponent(val) + '&verificationCode=' + vd,
            //type: 'get',
            url: fresh.path.url + 'ajaxAddDynComment',//添加成功与否验证ajax
            data: _params + "&content="+encodeURIComponent(val)+"&verificationCode="+vd,
            type: 'post',
            dataType: 'json',
            beforeSend: function() {
                fc.param.form.before('<div class="fresh-comment-status"><span class="fresh-comment-loading">Loading...</span></div>');
                fc.param.submit.before('<span class="fresh-comment-submit-disabled"></span>');
                $('.fresh-dialog-verificationCode .fresh-dialog-sure-btn a').addClass('fresh-dialog-btn-disabled');
                //重新设置参数才能获取到动态增加的元素状态
                fc.setParam(dom);
            },
            success: function(data) {
                var tp = data.sign,
                    msg = data.msg;
                if( tp === 0 ){
                    alert(msg);
                    //fc.param.form.val('');
                    //fc.param.textSzie.text(140);
                    return false;
                } else if( tp === 1 ) {
                    //关闭验证弹出层
                    $('#fresh-dialog-verificationCode').modal('hide');
                    fc.param.form.val('');
                    fc.param.status.html('<span class="fresh-comment-success">发布成功</span>');
                    //获取信息列表
                    fc.getList(dom);
                    fc.setcount();
                    //文本框清空后可属于数字还原
                    fc.param.textSzie.text(140);
                } else if( tp === 2 ) {
                    //跳转页面
                    window.location.href = msg;
                } else if( tp === 3 ) {
                    _tipCode.text(msg);
                    $('#verificationCode').focus();
                    $('.fresh-dialog-verificationCode .fresh-dialog-sure-btn a').removeClass('fresh-dialog-btn-disabled');
                    return false;
                } else{
                    return false;
                }  
            },
            error: function(a, b, c) {
                  fc.param.form.before('<div class="fresh-comment-status"><span class="fresh-comment-warning">' + c + '</span></div>');
            },
            complete: function() {
                setTimeout(function() {
                    fc.param.status.fadeOut('fast', function() {
                        $(this).remove();
                    });
                    fc.param.submit.closest('.fresh-comment-func').find('.fresh-comment-submit-disabled').remove();
                    $('#verificationCode').focus();
                }, 1000);
            }
        });
    }

    /**
     * 验证码弹出层方法
     * @param  {string} code 任意文本字符串
     */
    fc.VerificationBox = function(code){
        var codeHtml = '<div class="fresh-dialog-verificationCode">\
                            <div class="fresh-dialog-content">\
                               <div class="fresh-dialog-medal">\
                                   <div class="fresh-dialog-medal-tips">\
                                       <span>您连续评论次数太多了，请输入验证码完成发布。</span>\
                                   </div>\
                                   <div class="fresh-dialog-medal-img">\
                                        <span>验证码</span>\
                                        <input type="text" autocomplete="off" maxlength="4" id="verificationCode" name="verificationCode">\
                                        <span>\
                                          <img width="60" height="20" id="verificationImg" alt="验证码" src="http://www.xueersi.com/verifications/show?AY2N5mp5im13" title="(看不清，换一张)">\
                                        </span>\
                                    </div>\
                                    <span id="fresh-dialog-tips-Code"></span>\
                                    <div class="fresh-dialog-sure-btn">\
                                        <a href="###" class="blue-radius-btn">确定</a>\
                                    </div>\
                               </div>\
                            </div>\
                        </div>'
        return codeHtml;              
    }  

    /**
     * 发布评论检测是否需要验证码
     * @param  {string} dom 任意子节点
     */
    fc.sendComment = function(dom){

        //判断元素节点是否存在
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }

        var val = $.trim(this.param.form.val());
        var len = val.length;
        if( len == 0 ){
           this.param.tips.removeClass('hide').html('请您填写内容');
           return false; 
        }
        this.param.tips.addClass('hide').html('');
        var _dataInfo = $(dom).closest('.fresh-comment-box').prev('.fresh-barinfo').find('.fresh-comment-expand-btn');
        var _par = _dataInfo.data('params');
        var _ty = _dataInfo.data('codetype');
        $.ajax({
            //url: fresh.path.url + 'ajaxCheckVerCode.json',
            //type: 'get',
            url: fresh.path.url + 'ajaxCheckVerCode',
            type: 'post',
            dataType: 'JSON',
            data: _par + '&codetype='+_ty,
            success: function(data) {
                var tp = data.sign,
                    msg = data.msg;
                if( tp === 0 ){//错误提醒   
                    alert(msg);
                    // fc.param.form.val(val);
                    fc.param.textSzie.text(140);
                    return false;
                } else if( tp === 1 ) {//不需要验证码验证直接提交
                    fc.post(dom);
                } else if( tp === 2 ) {//跳转页面
                    window.location.href = msg;
                } else if( tp === 3 ) {//需要验证码 弹出证码提示框
                    //弹出层现实效果
                    createModal.show({
                           id:'fresh-dialog-verificationCode',
                           cls:'fresh-dialog--modal-verification',
                           title:'提示',
                           content:fc.VerificationBox()
                    });
                    // $('#fresh-dialog-verificationCode').modal('show');
                    $('#fresh-dialog-verificationCode').modal({backdrop: 'static', keyboard: false,show: true})
                    fc.changeVerificationImg('verificationImg');
                    
                    //切换验证码
                    $('#verificationImg').off('click').on('click', function(){
                          fc.changeVerificationImg('verificationImg');
                    })
                    
                    //点击验证码弹出层中的确定按钮
                    $('body').off('click').on('click' , '.fresh-dialog-sure-btn a' , function(){
                        if( $(this).hasClass('fresh-dialog-btn-disabled') ){
                            return false;
                        }
                        var _val = $('#verificationCode').val();  
                        var _tipCode = $('#fresh-dialog-tips-Code');
                        if( _val == '' ){
                            _tipCode.text('请输入验证码'); 
                            $('#verificationCode').focus();
                            return false;
                        } else if( !/^[a-zA-Z0-9]{4,4}$/.test(_val) ) {
                             _tipCode.text('验证码错误，请重新输入'); 
                             $('#verificationCode').focus();
                              return false;
                        }else{
                            fc.post(dom);
                            //$('#fresh-dialog-verificationCode').modal('hide');
                        }

                    })
                } else{
                    return false;
                }
            }
        });
    }

    /**
     * 调用验证码方法
     * @param  {imgId} dom 任意子节点
     */
    fc.changeVerificationImg = function(imgId){
        $.ajax({
            url: fresh.path.url + 'ajaxGetVerCode',
            type: 'post',
            dataType: 'json',
            success  : function(data){
                if(data.sign == 1){
                  $('img[id="' + imgId + '"]').attr('src', data.msg);
                }
            }
        })
    }

    /**
     * 评论列表里回复区域评论切换
     * @param  {string} dom 任意子节点
     */
    fc.replyToggle = function(dom){
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        var _tpl = this.tpl.replyForm,
            _wraper = this.param.wraper,
            _text = _wraper.find('.fresh-text .fresh-info')
            _user = _wraper.find('.fresh-text .fresh-uesr'),
            _bar  = _wraper.find('.fresh-barinfo');

        //将HTML大写标签转换为小写
        _text = _text.html().replace(/<[^>].*?>/g,function(a1){
            var dom = a1.toLowerCase();
            return dom;
        });

        //查找img标签，替换为img的title
        _text = _text.replace(/<img.*?>/g,function(a1){
            var img = $(a1),
                tit = img.attr('title');
            if(img.attr('src').indexOf('http://img04.xesimg.com/icon/emoji') > -1){
                return '[' + tit + ']';
            }else{
                return a1;
            }
        });

        // 再去掉内容中的所有标签
        _text = _text.replace(/<[^>].*?>/g,'');
        _tpl = _tpl.replace('$textarea$', '//@' + _user.data('user') + ' ' + _text);

        var form = _bar.next('.fresh-comment-repley');
        if (form.length == 0) {
            _bar.after(_tpl);
            _bar.next().find('.fresh-comment-textarea textarea').focus();
        } else {
            form.remove();
        }
    }

    /**
     * 点击表情按钮插入表情方法
     * @param  {string} dom 任意子节点
     * @param  {Object} event event对象
     * @param  {number} send 判断是发送新鲜事表情还是评论中的表情,send存在是发送新鲜事的表情，不存在是评论
     */
    fc.emote = function(dom, event, send){
        //当前文本框textarea
        var _currentTextarea = null;
        //判断是评论中表情还是发送新鲜事表情
        if( send ){
            _currentTextarea = $(dom).closest('.fresh-send-box').find('.fresh-send-textareaBox');
        } else {
            if (dom) {
                this.setParam(dom);
            } else {
                return false;
            }
            _currentTextarea = this.param.form;
        }

        var e = window.event || event;
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
        
        if( !fresh.emoteHmtl ){
            $.ajax({
                  //url: fresh.path.url + 'emote.html',
                  //type: 'get',
                  url: fresh.path.url + 'ajaxGetEmoList',
                  type: 'post',
                  dataType: 'html',
                  success: function(data) {
                          fresh.emoteHmtl = data;
                          fresh.emote.show(dom , _currentTextarea);
                  }
            })
        }else{
            fresh.emote.show(dom , _currentTextarea);
        }

    }

    /**
     * tab标枪切换方法
     * @param  {Object} tabTit 任意子节点
     * @param  {Object} on 任意类名
     * @param  {Object} tabCon 任意子节点
     */
    fc.emoteTabs = function(tabTit, on, tabCon){
        $(tabTit).children().click(function(){
            $(this).addClass(on).siblings().removeClass(on);
            var index = $(tabTit).children().index(this);
            $(tabCon).children().eq(index).show().siblings('ul').hide();
        });
    }

    /**
     * 删除新鲜事或者评论弹出层方法
     * @param {string} cont 提示文本
     * @return {html} html元素
     */
    fc.delDialog = function(cont){
       var delComment_html = '<div class="fresh-dialog-delete">\
                                 <div class="fresh-dialog-delete-content">\
                                      <p class="fresh-dialog-delete-tips">'+cont+'</p>\
                                      <div class="fresh-dialog-delete-btn">\
                                         <a href="javascript:void(0);" class="fresh-btn fresh-sure-btn">确定</a>\
                                         <a href="javascript:void(0);" class="fresh-btn fresh-cancel-btn">取消</a>\
                                      </div>\
                                 </div>\
                             </div>'
        return delComment_html;                   
    }

    /**
     * 删除新鲜事和评论方法
     * @param  {string} dom 任意子节点
     */
    fc.delComment = function(dom){
        var that = $(dom);
        if(dom){
          this.setParam(dom);
        }else{
          return false;
        }
        //判断删除的是新鲜事还是评论中的删除
        var _type = $(dom).data().sign;
        //需要传递的参数
        var _data = $(dom).data('params');
        var _url = $(dom).data('url');
        
        //提示信息
        var tipInfo = null;
        if( _type == 1){
            tipInfo = '你确定删除该新鲜事吗?';
        } else if( _type == 2 ){
            tipInfo = '你确定删除该评论吗?';
        }
        //提示弹出层显示
        popoverTips.show({
            dom: that,
            placement: 'top',
            trigger: 'click', 
            con: fc.delDialog(tipInfo)
        });
        
        //点击确认按钮删除
        $('body').off('click', '.fresh-dialog-delete .fresh-sure-btn').on('click', '.fresh-dialog-delete .fresh-sure-btn', function(){
              $.ajax({
                  //url: fresh.path.url + "ajaxDelDynamic.json",
                  //type: 'get',
                  url: fresh.path.url + _url,
                  type: 'post',
                  dataType: 'json',
                  data: _data,
                  success: function(data) {
                      var _tp = data.sign;
                          _msg = data.msg;
                      if( _tp ==0 ){
                          alert(_msg);
                          return false;
                      } else if( _tp == 1 ){
                          if( _type == 2 ){
                               var changebox = fc.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').next('em').find('i');
                               if( changebox.length == 0){
                                    return false;
                                }
                                var _num = Number(changebox.text());
                                _num--;
                                changebox.text(_num);
                                fc.getList(dom);
                          } else if( _type == 1 ){
                                 var changeText = "抱歉，该新鲜事已被删除";
                                 var changeBox = fc.param.wraper.find('.fresh-text:eq(0) .fresh-info');
                                 changeBox.html(changeText);
                                 //删除右侧文本中除了文本头部和显示时间的地方
                                 fc.param.commentBox.remove();//删除评论框所有信息
                                 fc.param.wraper.find('.fresh-media').remove();//删除图片
                                 fc.param.wraper.find('.fresh-barinfo:eq(0) .fresh-right').remove();//删除评论和删除以及收藏按钮
                          } else {
                                 return false;
                          }
                      } else if( _tp == 2 ){
                          window.location.href = _msg;
                          return false;
                      } else {
                           return false;
                      }  
                      popoverTips.destroy(dom);
                  }
              });
        })
        
        //点击取消按钮
        $('body').off('click', '.fresh-dialog-delete .fresh-cancel-btn').on('click', '.fresh-dialog-delete .fresh-cancel-btn', function(){
            popoverTips.destroy(dom);
        })

    }
    
})(fresh.comment);


/**
 * 
 * 添加收藏和取消收藏相关业务
 * @param {Object} fc fresh.collect
 * 
 */
fresh.collect = fresh.collect || {};

(function(fl){

    /**
     * 收藏相关的弹出层方法
     * @param  {html | string} cont html字符串
     */
    fl.dialogBox = function(cont){
       var collect_html = '<div class="fresh-dialog-collect">\
                               <div class="fresh-dialog-collect-content">\
                                   <div class="fresh-dialog-success">\
                                      <i class="fresh-dialog-collect-icon"></i>\
                                      '+cont+'\
                                   </div>\
                               </div>\
                           </div>';
        return collect_html;                   
    }
    
    /**
     * 添加收藏方法
     * @param  {string} dom 任意子节点
     */
    fl.add = function(dom){
        var that = $(dom);
        var params = $(dom).data().params;
        if( !params ){
           return false;
        }
        that.removeClass('fresh-collect-add-btn');
        $.ajax({
            //url: fresh.path.url + 'ajaxAddCollect.json',
            //type : 'get',
            url: fresh.path.url + 'ajaxAddCollect',
            type : 'post',
            data:params,
            dataType:'json',
            success:function(data){
                var _sign = data.sign;
                if( _sign == 0){
                    alert(data.msg);
                    return false;
                }else if( _sign == 2 ){
                    window.location.href = data.msg;
                    return false;
                }
                if(data){
                    popoverTips.show({
                        dom: that,
                        placement: 'top',
                        trigger: 'click', 
                        con: fl.dialogBox(data.msg)
                    });
                    var collectBox = that.nextAll('em').find('i');
                    setTimeout(function(){
                        that.html('取消收藏');
                        //改变收藏的数量
                        if(collectBox.length > 0){
                            var _num = Number(collectBox.text());
                            _num++;
                            collectBox.text(_num);
                        }
                        that.addClass('fresh-collect-cancel-btn');
                        popoverTips.destroy(dom);
                    }, 1000);
                }else{
                    popoverTips.destroy(dom);
                    that.addClass('fresh-collect-cancel-btn');
                }      
            },
            error : function(){
                popoverTips.destroy(dom);
            }
        });
    }

    /**
     * 取消收藏方法
     * @param  {string} dom 任意子节点
     */
    fl.cancel = function(dom){
        var that = $(dom);
        var params = $(dom).data().params;
        if( !params ){
           return false;
        }
        that.removeClass('fresh-collect-cancel-btn');
        $.ajax({
            //url: fresh.path.url + 'ajaxCancelCollect.json',
            //type : 'get',
            url: fresh.path.url + 'ajaxCancelCollect',
            type : 'post',
            data:params,
            dataType:'json',
            success:function(data){
                var _sign = data.sign;
                if( _sign == 0){
                    alert(data.msg);
                    return false;
                }else if( _sign == 2 ){
                    window.location.href = data.msg;
                    return false;
                }
                if(data){
                    //取消收藏成功弹出层显示
                     popoverTips.show({
                        dom: that,
                        placement: 'top',
                        trigger: 'click', 
                        con: fl.dialogBox(data.msg)
                    });
                    var collectBox = that.nextAll('em').find('i');
                    setTimeout(function(){
                        that.html('收藏');
                        //改变收藏的数量
                        if(collectBox.length > 0){
                            var _num = Number(collectBox.text());
                            if( _num >0 ){
                                _num--;
                            } else {
                                return false;
                            }
                            collectBox.text(_num);
                        }
                        that.addClass('fresh-collect-add-btn');
                        popoverTips.destroy(dom);
                    }, 1000);
                }else{
                    popoverTips.destroy(dom);
                    that.addClass('fresh-collect-add-btn');
                }      
            },
            error : function(){
                popoverTips.destroy(dom);
            }
        });
    }

})(fresh.collect)


/**
 * 
 * 发送新鲜事相关业务
 * @param {Object} fc fresh.send
 * 
 */
fresh.send = fresh.send || {};

(function(fs){

    /**
     * 限制发送新鲜事文本域可输入字数方法
     * @param  {string} dom 任意子节点
     */
    fs.limitNum = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(that.val());
        var len = val.length;
        var sendBox = that.closest('.fresh-send-box'),
            size = sendBox.find('.fresh-send-text-num');
        if (len > 140) {
            that.val(val.substring(0, 140));
            size.text(0);
            return false;
        } else {
            size.text(140 - len);
        }
    };

    /**
     * 发布新鲜事图片上传方法
     * @param  {string} dom 任意子节点
     */
    fs.fileupload = function(dom) {
        var that =$(dom);
        if( that.length == 0 ){
          return false;
        }
        if(that.val() == ''){
          return false;
        }
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(dom.value)) {
            alert('图片格式无效！');
            return false;
        }
        //显示图片预览区域
        $('#fresh-send-preview').removeClass('hiding');
        $('.fresh-send-preview-imgvideo').find('img').attr('src', 'http://img04.xesimg.com/loading.gif');
        this.setImagePreview('fresh-fileToUpload', 'fresh-send-preview-imgvideo',120, 36);
    };

    /**
     * 上传图片本地预览方法
     * @param {Object} fileObj 上传文件file的id元素  fresh-fileToUpload 
     * @param {Object} previewObj 预览图片的父层id元素  fresh-send-preview-imgvideo
     * @param {Number} maxWidth 预览图最大宽  
     * @param {Number} minWidth 预览图最小宽  
     */
    fs.setImagePreview =function(fileObj, previewObj, maxWidth, minWidth) {
          var docObj = document.getElementById(fileObj);
          var imgObjPreview = document.getElementById(previewObj);

          if (docObj.files && docObj.files[0]) {
              //火狐下，直接设img属性
              //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
              imgObjPreview.innerHTML ='<img id="fresh-send-preview-img"><i class="fresh-preview-close"></i>';
              var img = document.getElementById('fresh-send-preview-img');
              img.src = window.URL.createObjectURL(docObj.files[0]);
          } else {
              //IE下，使用滤镜
              try {
                  var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
                  docObj.select();
                  imgObjPreview.focus();//防止在ie9下拒绝访问，解决办法是让其他的div元素获取焦点
                  var imgSrc = document.selection.createRange().text;
                  imgObjPreview.innerHTML ='<img id="fresh-send-preview-img"><i class="fresh-preview-close"></i>';
                  var img = document.getElementById('fresh-send-preview-img');
                  img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc;
                  //var rate = (maxWidth/img.height>maxWidth/img.width?maxWidth/img.width:maxHeight/img.height);
                  //等比例缩放图片的大小
                  var rate = (img.offsetWidth>maxWidth)?(maxWidth/img.offsetWidth):(img.offsetWidth>minWidth?1:minWidth/img.offsetWidth);
                  imgObjPreview.innerHTML = "<div id='fresh-send-preview-img' style='width:"+img.offsetWidth*rate+"px;height:"+img.offsetHeight*rate+"px;"+sFilter+imgSrc+"\"'></div><i class='fresh-preview-close'></i>";
              } catch (e) {
                  alert("您上传的图片格式不正确，请重新选择!");
                  return false;
              }
              //document.selection.empty();
          }
          //return true;
    }

    /**
     * 点击发送按钮，弹出发送新鲜事弹出框的方法
     * @param  {string} dom 任意子节点
     */
    fs.box = function(dom) {
        //虚拟弹出层显示新鲜事弹出层
        var _sendBox = '<form class="fresh-send-box" method="POST" action="/Dynamic/addDynamic" enctype="multipart/form-data" name="formsubmitf">\
                            <textarea class="fresh-send-textareaBox" name="content"></textarea>\
                            <div class="fresh-send-preview hiding" id="fresh-send-preview">\
                                 <div class="fresh-send-preview-imgvideo" id="fresh-send-preview-imgvideo">\
                                     <img id="fresh-send-preview-img" src="">\
                                     <i class="fresh-preview-close"></i>\
                                 </div>\
                            </div>\
                            <div class="fresh-send-form">\
                                 <div class="fresh-send-emote-click-btn fresh-emote-current" flag="0">\
                                    <i class="fresh-send-emote"></i>\
                                    <a href="javascript:void(0);">表情</a>\
                                 </div>\
                                 <div class="fresh-send-upload">\
                                    <input class="fresh-fileToUpload" id="fresh-fileToUpload" type="file" size="45" autocomplete="off"  name="dynImg" accept="image/*" />\
                                 </div>\
                                 <a href="javascript:void(0);">图片</a>\
                                 <em class="pull-left">（支持类型 JPG、PNG，大小不超过5M）</em>\
                                 <div class="fresh-send-submit-box pull-right">\
                                  <button class="blue-radius-btn fresh-send-submit-btn" type="button">发布</button>\
                                 </div>\
                                 <span class="pull-right">\
                                    <em class="pull-left">您还可以输入</em>\
                                    <em class="fresh-send-text-num pull-left">140</em>\
                                    <em class="pull-left">字</em>\
                                 </span>\
                                 <span class="fresh-comment-tips hiding"></span>\
                            </div>\
                            <input type="hidden" value="0" name="mypretime">\
                        </form>'
        createModal.show({
               id:'fresh-sendInfo-box',
               cls:'fresh-send-box-modal-dialog',
               title:'发新鲜事',
               width:800,
               content:_sendBox
        });

        //点击关闭图片区域按钮
        $('body').off('click', '.fresh-send-box .fresh-preview-close').on('click', '.fresh-send-box .fresh-preview-close', function(){
            //删除图片同时清空file的值。以防再次上传同一张图片的时候change不改变无法正常运行
            $('.fresh-send-upload').html('<input class="fresh-fileToUpload" id="fresh-fileToUpload" type="file" size="45" autocomplete="off"  name="dynImg" accept="image/*" />')
            $('#fresh-send-preview').addClass('hiding');
        });                
    };

    /**
     * 提交新鲜事方法
     * @param  {string} dom 任意子节点
     */
    fs.submit = function(dom) {
        var _form = $(dom);
        if( _form.length == 0 ){
            return false;
        }
        var textarea = _form.find('textarea.fresh-send-textareaBox'),
            content = $.trim(textarea.val()),
            len = content.length;

        if(len < 10 || len > 140 || len == 0){
            _form.find('.fresh-comment-tips').removeClass('hide').html('请填写内容，长度在10~140之间');
            return false;
        }else{
            _form.find('.fresh-comment-tips').addClass('hide').html('');
            _form.submit();
            $('#fresh-sendInfo-box').modal('hide');
        }
    };

    /**
     * 发送新鲜事检测数据时间方法
     * @param  {string} dom 任意子节点
     */
    fs.checkData = function(){
        Today = new Date(); 
        var NowHour = Today.getHours(); 
        var NowMinute = Today.getMinutes(); 
        var NowSecond = Today.getSeconds(); 
        var mysec = (NowHour*3600)+(NowMinute*60)+NowSecond; 
        var a = document.formsubmitf.mypretime.value;
        
        if((mysec-document.formsubmitf.mypretime.value)>60){//600只是一个时间值，就是5秒钟内禁止重复提交，值随你高兴设  
            document.formsubmitf.mypretime.value=mysec; 
        } else {
            //alert(' 按一次就够了，请勿重复提交！请耐心等待！谢谢合作！'); 
            return false; 
        }
        document.forms.formsubmitf.submit(); 
    }
  
})(fresh.send)


/**
 * 
 * 关注新鲜事相关业务
 * @param {Object} fc fresh.attention
 * 
 */
fresh.attention = fresh.attention || {};

(function(fa){
    
    /**
     * 关注和取消新鲜事方法
     * @param  {string} dom 任意子节点
     */
    fa.addCancel = function(dom){
        var _type = $(dom).data().type;
        var _params = $(dom).data().params + '&type=' + _type;
        $.ajax({
            //url: fresh.path.url + 'ajaxFollow.json',
            //type: "get",
            url: fresh.path.url + 'ajaxFollow',
            type: "post",
            timeout: 7000,
            dataType: 'json',
            data: _params,
            success: function(data) {
                if (data.sign == 2) {
                    window.location.href = data.msg;
                }else if(data.sign == 1) {
                    switch(_type){
                        case 1:
                            $(e).html('<em>已关注</em>');
                            break;
                        case 2:
                            $(dom).html('<a href="javascript:void(0)" class="fresh-attention-btn fresh-add-attention-btn"><span class="fresh-add left">+</span><span class="left">关注</span></a>');
                            $(dom).data({type:3});
                            break;
                        case 3:
                            $(dom).html('<em>已关注</em><i class="fresh-course-line">|</i><a href="javascript:void(0)" class="fresh-add-cancel-btn">取消</a>');
                            $(dom).data({type:2});
                            break;
                    }
                }else{
                    alert(data.msg);
                    return false;
                }
            },
            error: function() {
                alert('数据读取错误..');
            }
        });
    }

})(fresh.attention)


/**
 * 
 * 表情相关业务
 * @param {Object} fe fresh.emote
 * 
 */
fresh.emote = fresh.emote || {};

(function(fe){
    
    /**
     * 表情弹出层显示方法
     * @param  {string} dom 任意子节点
     * @param  {string} textarea 任意子节点
     */
    fe.show = function(dom, textarea){
        popoverTips.show({
              dom: dom,
              placement: 'bottom',
              trigger: 'click',
              con: fresh.emoteHmtl
        })

        //表情按钮距离左边框的距离
        var _emoteLeft = $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').prevAll('.fresh-emote-current').offset().left;
        //表情弹出层宽度的一半
        var dialog_emoteW = $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').outerWidth()/2;
        var _popoverW = 0;

        if( _emoteLeft < dialog_emoteW ){
            _popoverW = _emoteLeft;
        }else{
            _popoverW = dialog_emoteW - 25;
        }

        //箭头靠左显示
        $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').css('marginLeft',_popoverW);
        $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').find('.arrow').css('left','25px');

        //点击表情插入文本框
        $('.fresh-dialog-emote').off('click', '.fresh-jsSmilies li').on('click', '.fresh-jsSmilies li', function(){
              var _val = $(this).data('action');
              textarea.focus();
              textarea.insertContent(_val);
              popoverTips.destroy(dom);
        })

        //关闭表情层(关闭表情弹出层)
        $('.fresh-dialog-emote').off('click', '.fresh-smilies-close').on('click', '.fresh-smilies-close', function(){
            popoverTips.destroy(dom);
        });

         //tabs和分页切换
         fresh.comment.emoteTabs(".fresh-smilies-tabs","current",".fresh-dialog-smilies-box");
         fresh.comment.emoteTabs(".fresh-smilies-page-box","current",".fresh-dialog-smilies-con");
    }

})(fresh.emote)

/*******************************************
 *
 * 插入光标处的插件
 * @authors Du xin li
 * @update    2015-10-25
 *
*********************************************/

$.fn.extend({  
    insertContent : function(myValue, t) {  
        var that = $(this);
        var $t = $(this)[0];  
        if (document.selection) {  
            this.focus();  
            var sel = document.selection.createRange();  
            sel.text = myValue;  
            this.focus();  
            sel.moveStart('character', -l);  
            var wee = sel.text.length;  
            if (arguments.length == 2) {  
            var l = $t.value.length;  
            sel.moveEnd("character", wee + t);  
            t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);  
            sel.select();  
            }  
        } else if ($t.selectionStart || $t.selectionStart == '0') {  
            var startPos = $t.selectionStart;  
            var endPos = $t.selectionEnd;  
            var scrollTop = $t.scrollTop;  
            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos,$t.value.length);  
            this.focus();  
            $t.selectionStart = startPos + myValue.length;  
            $t.selectionEnd = startPos + myValue.length;  
            $t.scrollTop = scrollTop;  
            if (arguments.length == 2) { 
                $t.setSelectionRange(startPos - t,$t.selectionEnd + t);  
                this.focus(); 
            }  
        } else {                              
            this.value += myValue;                              
            this.focus();  
        }  
    }  
})



;/*!/widget/Public.Dynamic/fresh.load.min.js*/
/*******************************************
 *
 * 新鲜事所有事件绑定功能
 * @authors Du xin li
 * @date    2015-10-22
 * @version $Id$
 *
*********************************************/


$(function(){

    //清楚tab键盘获取焦点
   /* $('body').off('keydown').on('keydown', function(e){
         var ev = e || event;
        if (ev.keyCode == 9) {
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            else {
                window.event.returnValue = false;
            }
        }    
     })*/
   

	//动态大小图片切换功能
    $('.fresh-main-wrapper').off('click', '.fresh-type-img div').on('click', '.fresh-type-img div', function(){
        var that = $(this).closest('.fresh-type-img');
        fresh.media.img.toggle(that);
    })
	
	// 动态中点击“作答”切换做题效果
    $('.fresh-main-wrapper').off('click', '.fresh-answer-btn').on('click', '.fresh-answer-btn', function(){
        fresh.media.answer.btnToggle(this);
    });

    // 点击动态试题图片切换方法
    $('.fresh-main-wrapper').off('click', '.fresh-type-answer .fresh-media-small-img').on('click', '.fresh-type-answer .fresh-media-small-img', function(e){
        var that = $(this).closest('.fresh-type-answer');
        fresh.media.answer.imgToggle(that, e);
    });

    $('.fresh-main-wrapper').off('click', '.fresh-big-img-answer').on('click', '.fresh-big-img-answer', function(e){
        fresh.media.answer.imgToggle(this, e);
    });

    // 选择动态试题答案：提交答案
    $('.fresh-main-wrapper').off('click', '.fresh-big-selectAnswer a[data-type="radio"]').on('click', '.fresh-big-selectAnswer a[data-type="radio"]', function(){
        if( !$(this).hasClass('fresh-Answer-disabled') ){
               fresh.media.answer.answerSubmit(this);
        }
    });
    
    //点击视频小图显示视频大图效果
    $('.fresh-main-wrapper').off('click', '.fresh-type-video .fresh-media-small-video').on('click', '.fresh-type-video .fresh-media-small-video', function(){
        fresh.media.video.videoPlay(this);
    });
   
    //点击视频大图上的收起显示小图视频效果
    $('.fresh-main-wrapper').off('click', '.fresh-packUp-video').on('click', '.fresh-packUp-video', function(){
         fresh.media.video.videoHide(this);
    });


    /* ================= 评论相关 ============= */

    //点击父级评论按钮切换评论框区域和消息
    $('.fresh-main-wrapper').off('click', '.fresh-comment-expand-btn').on('click', '.fresh-comment-expand-btn', function(){
        var that = $(this);
        if(that.data('type') && that.data('type') == 2){
            return false;
        }
        fresh.comment.toggle(this);
    });

    //点击关闭评论框按钮
    $('.fresh-main-wrapper').off('click', '.fresh-comment-close-btn').on('click', '.fresh-comment-close-btn', function(){
        fresh.comment.close(this);
    });

    //限制文本域字数显示
    $('.fresh-main-wrapper').off('input keyup paste focus', '.fresh-comment-textarea textarea').on('input keyup paste focus', '.fresh-comment-textarea textarea', function(){
        var that = this;
        setTimeout(function(){
            fresh.comment.textareaNum(that);
        }, 10);
    });

    //点击发布评论内容按钮
    $('.fresh-main-wrapper').off('click', '.fresh-comment-submit-btn a').on('click', '.fresh-comment-submit-btn a', function(){
        fresh.comment.sendComment(this);
    });


    // 点击评论列表里回复区域评论切换
    $('.fresh-main-wrapper').off('click', '.fresh-comment-list .fresh-barinfo .fresh-childComment-expand-btn').on('click', '.fresh-comment-list .fresh-barinfo .fresh-childComment-expand-btn', function(){
        fresh.comment.replyToggle(this);
    });

    // 点击表情按钮,弹出表情弹出层
    $('.fresh-main-wrapper').off('click', '.fresh-comment-emote-smiles-btn').on('click', '.fresh-comment-emote-smiles-btn', function(event){
          fresh.comment.emote(this, event);
    });

    //点击删除新鲜事和评论的删除
    $('.fresh-main-wrapper').off('click', '.fresh-barinfo a.fresh-del-msg').on('click', '.fresh-barinfo a.fresh-del-msg', function(){
         fresh.comment.delComment(this);
    });


    /* ================= 收藏相关 ============= */
    
    //点击添加收藏按钮
    $('.fresh-main-wrapper').off('click', '.fresh-collect-add-btn').on('click', '.fresh-collect-add-btn', function(){
         fresh.collect.add(this);
    });
    

    //点击取消收藏按钮
    $('.fresh-main-wrapper').off('click', '.fresh-collect-cancel-btn').on('click', '.fresh-collect-cancel-btn', function(){
         fresh.collect.cancel(this);
    });
    

    /* ================= 发布新鲜事相关 ============= */

    //限制发布新鲜事文本域字数显示
    $('body').off('input keyup paste focus', '.fresh-send-textareaBox').on('input keyup paste focus', '.fresh-send-textareaBox', function(){
        var that = this;
        setTimeout(function(){
            fresh.send.limitNum(that);
        }, 10);
    });

    // 点击表情按钮,弹出表情弹出层
    $('body').off('click', '.fresh-send-emote-click-btn').on('click', '.fresh-send-emote-click-btn', function(event){
             fresh.comment.emote(this, event, 'send');
    });

    // 发布新鲜事里面的选择上传图片
    $('body').off('change', '.fresh-send-form #fresh-fileToUpload').on('change', '.fresh-send-form #fresh-fileToUpload', function(){
        fresh.send.fileupload(this);
    });


    //点击发送新鲜事按钮应该是弹出层
    $('#freshPost').bind('click',function(){
        fresh.send.box(this);
    })
    
    //发送新鲜事提交表单前的数据时间验证
    $('body').off('submit', 'form.fresh-send-box').on('submit', 'form.fresh-send-box', function(){
        fresh.send.checkData();
    })

    //点击发送按钮
    $('body').off('click', '.fresh-send-box .fresh-send-submit-btn').on('click', '.fresh-send-box .fresh-send-submit-btn', function(){
        var that = $(this);
        var form = that.closest('form.fresh-send-box');
        fresh.send.submit(form);
    })

    /* ================= 关注相关 ============= */

    //点击添加关注按钮
   /* $('.fresh-main-wrapper').off('click', '.fresh-course-attention .fresh-add-attention-btn').on('click', '.fresh-course-attention .fresh-add-attention-btn', function(){
        var that = $(this).closest('.fresh-course-attention');
        fresh.attention.addCancel(that);
    })

    //点击添加取消关注按钮
    $('.fresh-main-wrapper').off('click', '.fresh-course-attention .fresh-add-cancel-btn').on('click', '.fresh-course-attention .fresh-add-cancel-btn', function(){
        var that = $(this).closest('.fresh-course-attention');
        fresh.attention.addCancel(that);
    })*/

    //默认展开评论直接走fresh.getList.getList(dom);并且一个页面只有一个fresh-list评论

   /* var dom = $('.fresh-list').find('.fresh-barinfo');
    fresh.comment.getList(dom);*/


    //点击详情区域事件
    $('.fresh-hover-item').off('click').on('click', function(event){
         if($(event.target).attr('href') || $(event.target).attr('date-role') == 'fresh-avatar'){
            return;//return 把控制权返回给页面,不响应这个点击事件，不能用return false,否则正常的链接无法点击使用
         }else{
            var url = $(this).find('.fresh-barinfo a').attr('href');
            window.open(url);
         }
    })

})

;/*!/widget/Mall.courseInfo/xue.mousewheel.js*/
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));


;/*!/widget/Mall.courseInfo/xue.sidescroll.min.js*/
/*!
 * jScrollPane - v2.0.19 - 2013-11-16
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2013 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */
!function(a,b){var c=function(c){return a(c,b)};"function"==typeof define&&define.amd?define(["jquery"],c):"object"==typeof exports?module.exports=c:c(jQuery)}(function(a,b,c){a.fn.jScrollPane=function(d){function e(d,e){function f(b){var e,h,j,l,m,n,q=!1,r=!1;if(P=b,Q===c)m=d.scrollTop(),n=d.scrollLeft(),d.css({overflow:"hidden",padding:0}),R=d.innerWidth()+tb,S=d.innerHeight(),d.width(R),Q=a('<div class="jspPane" />').css("padding",sb).append(d.children()),T=a('<div class="jspContainer" />').css({width:R+"px",height:S+"px"}).append(Q).appendTo(d);else{if(d.css("width",""),q=P.stickToBottom&&C(),r=P.stickToRight&&D(),l=d.innerWidth()+tb!=R||d.outerHeight()!=S,l&&(R=d.innerWidth()+tb,S=d.innerHeight(),T.css({width:R+"px",height:S+"px"})),!l&&ub==U&&Q.outerHeight()==V)return void d.width(R);ub=U,Q.css("width",""),d.width(R),T.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}Q.css("overflow","auto"),U=b.contentWidth?b.contentWidth:Q[0].scrollWidth,V=Q[0].scrollHeight,Q.css("overflow",""),W=U/R,X=V/S,Y=X>1,Z=W>1,Z||Y?(d.addClass("jspScrollable"),e=P.maintainPosition&&(ab||db),e&&(h=A(),j=B()),g(),i(),k(),e&&(y(r?U-R:h,!1),x(q?V-S:j,!1)),H(),E(),N(),P.enableKeyboardNavigation&&J(),P.clickOnTrack&&o(),L(),P.hijackInternalLinks&&M()):(d.removeClass("jspScrollable"),Q.css({top:0,left:0,width:T.width()-tb}),F(),I(),K(),p()),P.autoReinitialise&&!rb?rb=setInterval(function(){f(P)},P.autoReinitialiseDelay):!P.autoReinitialise&&rb&&clearInterval(rb),m&&d.scrollTop(0)&&x(m,!1),n&&d.scrollLeft(0)&&y(n,!1),d.trigger("jsp-initialised",[Z||Y])}function g(){Y&&(T.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'),a('<div class="jspDragBottom" />'))),a('<div class="jspCap jspCapBottom" />'))),eb=T.find(">.jspVerticalBar"),fb=eb.find(">.jspTrack"),$=fb.find(">.jspDrag"),P.showArrows&&(jb=a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",m(0,-1)).bind("click.jsp",G),kb=a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",m(0,1)).bind("click.jsp",G),P.arrowScrollOnHover&&(jb.bind("mouseover.jsp",m(0,-1,jb)),kb.bind("mouseover.jsp",m(0,1,kb))),l(fb,P.verticalArrowPositions,jb,kb)),hb=S,T.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){hb-=a(this).outerHeight()}),$.hover(function(){$.addClass("jspHover")},function(){$.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",G),$.addClass("jspActive");var c=b.pageY-$.position().top;return a("html").bind("mousemove.jsp",function(a){r(a.pageY-c,!1)}).bind("mouseup.jsp mouseleave.jsp",q),!1}),h())}function h(){fb.height(hb+"px"),ab=0,gb=P.verticalGutter+fb.outerWidth(),Q.width(R-gb-tb);try{0===eb.position().left&&Q.css("margin-left",gb+"px")}catch(a){}}function i(){Z&&(T.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'),a('<div class="jspDragRight" />'))),a('<div class="jspCap jspCapRight" />'))),lb=T.find(">.jspHorizontalBar"),mb=lb.find(">.jspTrack"),bb=mb.find(">.jspDrag"),P.showArrows&&(pb=a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",m(-1,0)).bind("click.jsp",G),qb=a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",m(1,0)).bind("click.jsp",G),P.arrowScrollOnHover&&(pb.bind("mouseover.jsp",m(-1,0,pb)),qb.bind("mouseover.jsp",m(1,0,qb))),l(mb,P.horizontalArrowPositions,pb,qb)),bb.hover(function(){bb.addClass("jspHover")},function(){bb.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",G),bb.addClass("jspActive");var c=b.pageX-bb.position().left;return a("html").bind("mousemove.jsp",function(a){t(a.pageX-c,!1)}).bind("mouseup.jsp mouseleave.jsp",q),!1}),nb=T.innerWidth(),j())}function j(){T.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){nb-=a(this).outerWidth()}),mb.width(nb+"px"),db=0}function k(){if(Z&&Y){var b=mb.outerHeight(),c=fb.outerWidth();hb-=b,a(lb).find(">.jspCap:visible,>.jspArrow").each(function(){nb+=a(this).outerWidth()}),nb-=c,S-=c,R-=b,mb.parent().append(a('<div class="jspCorner" />').css("width",b+"px")),h(),j()}Z&&Q.width(T.outerWidth()-tb+"px"),V=Q.outerHeight(),X=V/S,Z&&(ob=Math.ceil(1/W*nb),ob>P.horizontalDragMaxWidth?ob=P.horizontalDragMaxWidth:ob<P.horizontalDragMinWidth&&(ob=P.horizontalDragMinWidth),bb.width(ob+"px"),cb=nb-ob,u(db)),Y&&(ib=Math.ceil(1/X*hb),ib>P.verticalDragMaxHeight?ib=P.verticalDragMaxHeight:ib<P.verticalDragMinHeight&&(ib=P.verticalDragMinHeight),$.height(ib+"px"),_=hb-ib,s(ab))}function l(a,b,c,d){var e,f="before",g="after";"os"==b&&(b=/Mac/.test(navigator.platform)?"after":"split"),b==f?g=b:b==g&&(f=b,e=c,c=d,d=e),a[f](c)[g](d)}function m(a,b,c){return function(){return n(a,b,this,c),this.blur(),!1}}function n(b,c,d,e){d=a(d).addClass("jspActive");var f,g,h=!0,i=function(){0!==b&&vb.scrollByX(b*P.arrowButtonSpeed),0!==c&&vb.scrollByY(c*P.arrowButtonSpeed),g=setTimeout(i,h?P.initialDelay:P.arrowRepeatFreq),h=!1};i(),f=e?"mouseout.jsp":"mouseup.jsp",e=e||a("html"),e.bind(f,function(){d.removeClass("jspActive"),g&&clearTimeout(g),g=null,e.unbind(f)})}function o(){p(),Y&&fb.bind("mousedown.jsp",function(b){if(b.originalTarget===c||b.originalTarget==b.currentTarget){var d,e=a(this),f=e.offset(),g=b.pageY-f.top-ab,h=!0,i=function(){var a=e.offset(),c=b.pageY-a.top-ib/2,f=S*P.scrollPagePercent,k=_*f/(V-S);if(0>g)ab-k>c?vb.scrollByY(-f):r(c);else{if(!(g>0))return void j();c>ab+k?vb.scrollByY(f):r(c)}d=setTimeout(i,h?P.initialDelay:P.trackClickRepeatFreq),h=!1},j=function(){d&&clearTimeout(d),d=null,a(document).unbind("mouseup.jsp",j)};return i(),a(document).bind("mouseup.jsp",j),!1}}),Z&&mb.bind("mousedown.jsp",function(b){if(b.originalTarget===c||b.originalTarget==b.currentTarget){var d,e=a(this),f=e.offset(),g=b.pageX-f.left-db,h=!0,i=function(){var a=e.offset(),c=b.pageX-a.left-ob/2,f=R*P.scrollPagePercent,k=cb*f/(U-R);if(0>g)db-k>c?vb.scrollByX(-f):t(c);else{if(!(g>0))return void j();c>db+k?vb.scrollByX(f):t(c)}d=setTimeout(i,h?P.initialDelay:P.trackClickRepeatFreq),h=!1},j=function(){d&&clearTimeout(d),d=null,a(document).unbind("mouseup.jsp",j)};return i(),a(document).bind("mouseup.jsp",j),!1}})}function p(){mb&&mb.unbind("mousedown.jsp"),fb&&fb.unbind("mousedown.jsp")}function q(){a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"),$&&$.removeClass("jspActive"),bb&&bb.removeClass("jspActive")}function r(a,b){Y&&(0>a?a=0:a>_&&(a=_),b===c&&(b=P.animateScroll),b?vb.animate($,"top",a,s):($.css("top",a),s(a)))}function s(a){a===c&&(a=$.position().top),T.scrollTop(0),ab=a;var b=0===ab,e=ab==_,f=a/_,g=-f*(V-S);(wb!=b||yb!=e)&&(wb=b,yb=e,d.trigger("jsp-arrow-change",[wb,yb,xb,zb])),v(b,e),Q.css("top",g),d.trigger("jsp-scroll-y",[-g,b,e]).trigger("scroll")}function t(a,b){Z&&(0>a?a=0:a>cb&&(a=cb),b===c&&(b=P.animateScroll),b?vb.animate(bb,"left",a,u):(bb.css("left",a),u(a)))}function u(a){a===c&&(a=bb.position().left),T.scrollTop(0),db=a;var b=0===db,e=db==cb,f=a/cb,g=-f*(U-R);(xb!=b||zb!=e)&&(xb=b,zb=e,d.trigger("jsp-arrow-change",[wb,yb,xb,zb])),w(b,e),Q.css("left",g),d.trigger("jsp-scroll-x",[-g,b,e]).trigger("scroll")}function v(a,b){P.showArrows&&(jb[a?"addClass":"removeClass"]("jspDisabled"),kb[b?"addClass":"removeClass"]("jspDisabled"))}function w(a,b){P.showArrows&&(pb[a?"addClass":"removeClass"]("jspDisabled"),qb[b?"addClass":"removeClass"]("jspDisabled"))}function x(a,b){var c=a/(V-S);r(c*_,b)}function y(a,b){var c=a/(U-R);t(c*cb,b)}function z(b,c,d){var e,f,g,h,i,j,k,l,m,n=0,o=0;try{e=a(b)}catch(p){return}for(f=e.outerHeight(),g=e.outerWidth(),T.scrollTop(0),T.scrollLeft(0);!e.is(".jspPane");)if(n+=e.position().top,o+=e.position().left,e=e.offsetParent(),/^body|html$/i.test(e[0].nodeName))return;h=B(),j=h+S,h>n||c?l=n-P.horizontalGutter:n+f>j&&(l=n-S+f+P.horizontalGutter),isNaN(l)||x(l,d),i=A(),k=i+R,i>o||c?m=o-P.horizontalGutter:o+g>k&&(m=o-R+g+P.horizontalGutter),isNaN(m)||y(m,d)}function A(){return-Q.position().left}function B(){return-Q.position().top}function C(){var a=V-S;return a>20&&a-B()<10}function D(){var a=U-R;return a>20&&a-A()<10}function E(){T.unbind(Bb).bind(Bb,function(a,b,c,d){var e=db,f=ab,g=a.deltaFactor||P.mouseWheelSpeed;return vb.scrollBy(c*g,-d*g,!1),e==db&&f==ab})}function F(){T.unbind(Bb)}function G(){return!1}function H(){Q.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(a){z(a.target,!1)})}function I(){Q.find(":input,a").unbind("focus.jsp")}function J(){function b(){var a=db,b=ab;switch(c){case 40:vb.scrollByY(P.keyboardSpeed,!1);break;case 38:vb.scrollByY(-P.keyboardSpeed,!1);break;case 34:case 32:vb.scrollByY(S*P.scrollPagePercent,!1);break;case 33:vb.scrollByY(-S*P.scrollPagePercent,!1);break;case 39:vb.scrollByX(P.keyboardSpeed,!1);break;case 37:vb.scrollByX(-P.keyboardSpeed,!1)}return e=a!=db||b!=ab}var c,e,f=[];Z&&f.push(lb[0]),Y&&f.push(eb[0]),Q.focus(function(){d.focus()}),d.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(d){if(d.target===this||f.length&&a(d.target).closest(f).length){var g=db,h=ab;switch(d.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:c=d.keyCode,b();break;case 35:x(V-S),c=null;break;case 36:x(0),c=null}return e=d.keyCode==c&&g!=db||h!=ab,!e}}).bind("keypress.jsp",function(a){return a.keyCode==c&&b(),!e}),P.hideFocus?(d.css("outline","none"),"hideFocus"in T[0]&&d.attr("hideFocus",!0)):(d.css("outline",""),"hideFocus"in T[0]&&d.attr("hideFocus",!1))}function K(){d.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")}function L(){if(location.hash&&location.hash.length>1){var b,c,d=escape(location.hash.substr(1));try{b=a("#"+d+', a[name="'+d+'"]')}catch(e){return}b.length&&Q.find(d)&&(0===T.scrollTop()?c=setInterval(function(){T.scrollTop()>0&&(z(b,!0),a(document).scrollTop(T.position().top),clearInterval(c))},50):(z(b,!0),a(document).scrollTop(T.position().top)))}}function M(){a(document.body).data("jspHijack")||(a(document.body).data("jspHijack",!0),a(document.body).delegate("a[href*=#]","click",function(c){var d,e,f,g,h,i,j=this.href.substr(0,this.href.indexOf("#")),k=location.href;if(-1!==location.href.indexOf("#")&&(k=location.href.substr(0,location.href.indexOf("#"))),j===k){d=escape(this.href.substr(this.href.indexOf("#")+1));try{e=a("#"+d+', a[name="'+d+'"]')}catch(l){return}e.length&&(f=e.closest(".jspScrollable"),g=f.data("jsp"),g.scrollToElement(e,!0),f[0].scrollIntoView&&(h=a(b).scrollTop(),i=e.offset().top,(h>i||i>h+a(b).height())&&f[0].scrollIntoView()),c.preventDefault())}}))}function N(){var a,b,c,d,e,f=!1;T.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(g){var h=g.originalEvent.touches[0];a=A(),b=B(),c=h.pageX,d=h.pageY,e=!1,f=!0}).bind("touchmove.jsp",function(g){if(f){var h=g.originalEvent.touches[0],i=db,j=ab;return vb.scrollTo(a+c-h.pageX,b+d-h.pageY),e=e||Math.abs(c-h.pageX)>5||Math.abs(d-h.pageY)>5,i==db&&j==ab}}).bind("touchend.jsp",function(){f=!1}).bind("click.jsp-touchclick",function(){return e?(e=!1,!1):void 0})}function O(){var a=B(),b=A();d.removeClass("jspScrollable").unbind(".jsp"),d.replaceWith(Ab.append(Q.children())),Ab.scrollTop(a),Ab.scrollLeft(b),rb&&clearInterval(rb)}var P,Q,R,S,T,U,V,W,X,Y,Z,$,_,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,nb,ob,pb,qb,rb,sb,tb,ub,vb=this,wb=!0,xb=!0,yb=!1,zb=!1,Ab=d.clone(!1,!1).empty(),Bb=a.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";"border-box"===d.css("box-sizing")?(sb=0,tb=0):(sb=d.css("paddingTop")+" "+d.css("paddingRight")+" "+d.css("paddingBottom")+" "+d.css("paddingLeft"),tb=(parseInt(d.css("paddingLeft"),10)||0)+(parseInt(d.css("paddingRight"),10)||0)),a.extend(vb,{reinitialise:function(b){b=a.extend({},P,b),f(b)},scrollToElement:function(a,b,c){z(a,b,c)},scrollTo:function(a,b,c){y(a,c),x(b,c)},scrollToX:function(a,b){y(a,b)},scrollToY:function(a,b){x(a,b)},scrollToPercentX:function(a,b){y(a*(U-R),b)},scrollToPercentY:function(a,b){x(a*(V-S),b)},scrollBy:function(a,b,c){vb.scrollByX(a,c),vb.scrollByY(b,c)},scrollByX:function(a,b){var c=A()+Math[0>a?"floor":"ceil"](a),d=c/(U-R);t(d*cb,b)},scrollByY:function(a,b){var c=B()+Math[0>a?"floor":"ceil"](a),d=c/(V-S);r(d*_,b)},positionDragX:function(a,b){t(a,b)},positionDragY:function(a,b){r(a,b)},animate:function(a,b,c,d){var e={};e[b]=c,a.animate(e,{duration:P.animateDuration,easing:P.animateEase,queue:!1,step:d})},getContentPositionX:function(){return A()},getContentPositionY:function(){return B()},getContentWidth:function(){return U},getContentHeight:function(){return V},getPercentScrolledX:function(){return A()/(U-R)},getPercentScrolledY:function(){return B()/(V-S)},getIsScrollableH:function(){return Z},getIsScrollableV:function(){return Y},getContentPane:function(){return Q},scrollToBottom:function(a){r(_,a)},hijackInternalLinks:a.noop,destroy:function(){O()}}),f(e)}return d=a.extend({},a.fn.jScrollPane.defaults,d),a.each(["arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){d[this]=d[this]||d.speed}),this.each(function(){var b=a(this),c=b.data("jsp");c?c.reinitialise(d):(a("script",b).filter('[type="text/javascript"],:not([type])').remove(),c=new e(b,d),b.data("jsp",c))})},a.fn.jScrollPane.defaults={showArrows:!1,maintainPosition:!0,stickToBottom:!1,stickToRight:!1,clickOnTrack:!0,autoReinitialise:!1,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:c,animateScroll:!1,animateDuration:300,animateEase:"linear",hijackInternalLinks:!1,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:3,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:!1,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:!0,hideFocus:!1,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:.8}},this);
;/*!/widget/Mall.FindTeacher/find-teacher.js*/
/**
 * Created by yangmengyuan on 15/10/20.
 */
$(function(){
    var
        $body = $('body'),
        $ftlist = $(".find-teacher-list");
    $ftlist.each(function(){
        $body.on({
                mouseenter:function(){
                    $(this).find(".find-teacher-hover").stop().animate({"top":0},300);
                },
                mouseleave:function(){
                    $(this).find(".find-teacher-hover").stop().animate({"top":200},300);

                }},'.find-teacher-hover-container'
        );
    });
    //$body.on("click",'.find-teacher-follow',function(){
    //    var followId = $(this).closest('.find-teacher-card').attr('id');
    //    //console.log(followId);
    //    $.ajax({
    //        url : '/teacher/follow',
    //        type : 'post',
    //        dataType : 'json',
    //        data : {
    //            followId : followId
    //        },
    //        success : function(msg){
    //            if(msg.sign == 2){
    //                window.location.href = '';
    //            }else if(msg.sign == 1){
    //                $(this).addClass("find-teacher-have-followed").html("已关注");
    //            }
    //        }
    //    })
    //});
    var $ftname = $('.find-teacher-name');
    $ftname.each(function(){
        var
            str = $(this).text(),
            str_char = /[a-zA-Z]/g,
            str_chin = /[\u4e00-\u9fa5]/g;

        var
            str_char_num = str.match(str_char),
            str_chin_num = str.match(str_chin);
        if(str_char_num){
            var char_maxwidth = 8;
            if(str_char_num.length>char_maxwidth){
                $(this).text(str.substring(0, char_maxwidth));
                $(this).html($(this).html() + '...');
            }
            //console.log(str_char_num.length)
        }else if(str_chin_num){
            var chin_maxwidth = 4;
            if(str_chin_num.length>chin_maxwidth){
                $(this).text(str.substring(0,chin_maxwidth));
                $(this).html($(this).html()+'...');
            }
        }
    });
    $('.find-teacher-course a').each(function(){
        var maxwidth=20;
        if($(this).text().length>maxwidth){
            $(this).text($(this).text().substring(0,maxwidth));
            $(this).html($(this).html()+'...');
        }
    });

});


;/*!/widget/Public.Module/glory.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */
 var glory = glory || {};

/**
 * 初始化三级联动下拉框
 *
 * @return
 */
 function initSelects(params) {
    $.ajax({
        type: "post", 
        url: params.jsonUrl,
        dataType: "json",
        timeout: 7000,
        success: function(result) {
            // 如果有系统模块,则显示
            if (result != '') {
                var str = '';
                str += '<select id="' + params.level_1_id + '" name="' + params.level_1_id + '" onchange="selectType1(this)">';
                str += '<option value="" selected>--请选择--</option>';
                
                $.each(result, function(i, j) {
                    if (params.level_1_default != '') {
                        str += '<option value="' + i + '"';
                        if (params.level_1_default == i) {
                            str += ' selected ';
                            if (params.level_2_default != '') {
                                initSelects_2(params, i);
                            }
                        }
                        str += '>' + j['name'] + '</option>';
                    } else {
                        if (j['child'] != '') {
                            var isShow = 0;
                        } else {
                            var isShow = 1;
                        }
                        str += '<option ' +' show="'+isShow+'" description="'+j['description']+ '" value="' + i + '">' + j['name'] + '</option>';
                    }
                });
                str += '</select>';
                
                $(params.container + '[id="' + params.container_id + '"]').html(str);
                $(params.container + ' select[id="' + params.level_1_id + '"]').bind("change", function() {
                    initSelects_2(params, $(this).val());
                }); 
            }
        },
        error: function() {
            // alert('数据读取错误..');
        }
    });
};


/**
 * 初始化二级联动下拉框
 */
 function initSelects_2(params, pid) {
    if(pid == '') {
        // 如果没有选择一级,则删除二级,三级下拉框
        $(params.container + ' select[id="' + params.level_2_id + '"]').remove();
        $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
    } else {
        $.ajax({
            type: "GET", 
            url: params.jsonUrl,
            dataType: "json",
            timeout: 7000,
            success: function(result) {
                // 如果有子类别,则显示
                if (result[pid]['child'] != '') {
                    var str = '';
                    str += '<select id="' + params.level_2_id + '" name="' + params.level_2_id + '" onchange="selectType2(this)">';
                    str += '<option value="" selected>--请选择--</option>';

                    $.each(result[pid]['child'], function(i, j) {
                        if (params.level_2_default != '') {
                            str += '<option value="' + i + '"';
                            if (params.level_2_default == i) {
                                str += ' selected ';
                                if (params.level_3_default != '') {
                                    initSelects_3(params, pid, i);
                                }
                            }
                            str += '>' + j['name'] + '</option>';
                        } else {
                            if (j['child'] != '') {
                                var isShow = 0;
                            } else {
                                var isShow = 1;
                            }
                            str += '<option ' +' show="'+isShow+'" description="'+j['description']+ '" value="' + i + '">' + j['name'] + '</option>';
                        }
                    });
                    str += '</select>';
                    $(params.container + ' select[id="' + params.level_2_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_1_id + '"]').after(str);

                    $(params.container + ' select[id="' + params.level_2_id + '"]').bind("change", function(){
                        initSelects_3(params, pid, $(this).val());
                    }); 
                }else{
                    $(params.container + ' select[id="' + params.level_2_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                }
            },
            error: function() {
                // alert('数据读取错误..');
            }
        });
}
};


/**
 * 初始化三级联动下拉框
 */
 function initSelects_3(params, ppid, pid) { 
    if(pid == '') {
        // 如果没有选择二级,则删除三级下拉框
        $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
    } else {
        $.ajax({
            type: "GET", 
            url: params.jsonUrl,
            dataType: "json",
            timeout: 7000,
            success: function(result) {
                // 如果有子类别,则显示
                if (result[ppid]['child'][pid]['child'] != '') {
                    var str = '';
                    str += '<select id="' + params.level_3_id + '" name="' + params.level_3_id + '" onchange="selectType3(this)">';
                    str += '<option value="" selected>--请选择--</option>';
                    
                    $.each(result[ppid]['child'][pid]['child'], function(i, j) {
                        if (params.level_3_default != '') {
                            str += '<option val ="100" value="' + i + '"';
                            if (params.level_3_default == i) {
                                str += ' selected ';
                            }
                            str += '>' + j['name'] + '</option>';
                        } else {
                            str += '<option gold ="' + j['gold_num'] +'" description="'+j['description']+ '" value="' + i + '">' + j['name'] + '</option>';
                        }
                    });
                    str += '</select>';
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_2_id + '"]').after(str);
                }else{
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                }
            },
            error: function() {
                // alert('数据读取错误..');
            }
        });
}
};


// 生成随机字符串
function generateMixed(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
};

function winContorl(t,b,bl,h,that){
 var left=that.offset().left,
 top=that.offset().top,
 h=-5;
 t.children().each(function(){
  var ch=$(this).innerHeight();
  h+=ch;
}).last().removeClass('hasborder_1');;

 if($('.glory_window_come').length == 0){
  $(document.body).append('<div class="glory_window_come"></div>');
}
var content=t.html(); 
if(bl){
  that.attr('id','window_sign');
  $('.glory_window_come').html(content).offset({
   left:left,
   top:top-h-10
}).height(h).fadeIn();

}else if(typeof that.attr('id')=='undefined'){
  $('#window_sign').removeAttr('id');
  that.attr('id','window_sign');
  $('.glory_window_come').html(content).height(h).offset({
   left:left,
   top:top-h-10
});

}else{
  $('.glory_window_come').html('').remove();
  $('#window_sign').removeAttr('id');

}
}
$(function(){
 $(document.body).on('click',function(event){
  var a=$(event.target).hasClass('show-course'),
  b=$(event.target).hasClass('glory_window_come');
  if (!a && !b && $('.glory_window_come').length!==0){

   $('.glory_window_come').remove();
   $('#window_sign').removeAttr('id');

}

})
}); 

glory.comment = glory.comment || {};
/**
* 评论框文本域属于字数限制方法
* @param  {string} dom 任意子节点
*/
(function(fc){
    fc.textareaNum = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(that.val());
        var len = val.length;
        var form = that.closest('.fresh-comment-form'),
        size = form.find('.fresh-comment-size .fresh-comment-text-num');
        if (len > 140) {
            that.val(val.substring(0, 140));
            size.text(0);
            return false;
        } else {
            size.text(140 - len);
        }
    };
})(glory.comment);
//限制文本域字数显示
$('.glory_log_submit').off('input keyup paste focus', '.comment_textarea textarea').on('input keyup paste focus', '.comment_textarea textarea', function(){
        // alert(111)
        var that = this;
        setTimeout(function(){
            glory.comment.textareaNum(that);
        }, 10);
    });
;/*!/widget/Mall.live/live.js*/
/**
 * Created by yangmengyuan on 15/10/22.
 */
$(function(){
    var $body = $('body');
    $('.carousel:gt(0)').carousel({
        interval:'10000'
    });
    $('.closeH').bind('click',function(){
        $('.closeH').parent().css({display:'none'})
    })
    var $liveScrollBtn = $('.live-scroll-btn-container li');
    $liveScrollBtn.on('click',function(e){
        var $target = $(e.target);
        var index = $target.index();
        $liveScrollBtn.removeClass('live-scroll-btn-on').eq(index).addClass('live-scroll-btn-on');
        $('.live-scroll-box-container').animate({top:(-1*291*index) + 'px'},300)
    });
    $('.problem .answer').eq(0).css({display:'block'});
    $('.problem .title').each(function(index){
        $(this).bind('mouseenter',function(){
            $('.answer').css({display:'none'}).eq(index).css({display:'block'});
            $('.problem .title a').removeClass('font-blue');       
            $(this).find('a').addClass('font-blue');
        })
    })
    var $livecourseshowtitle = $('.live-course-show-title');
    $livecourseshowtitle.each(function(){
        var maxwidth=16;
        if($(this).text().length>maxwidth){
            $(this).text($(this).text().substring(0,maxwidth));
            $(this).html($(this).html()+'…');
        }
    });
    var $liveCourseContent = $('.live-course-content');
    $liveCourseContent.each(function(){
        var maxwidth=47;
        if($(this).text().length>maxwidth){
            $(this).text($(this).text().substring(0,maxwidth));
            $(this).html($(this).html()+'…');
        }

    });
var liveOrderAjax = liveOrderAjax || {};
    liveOrderAjax = function(that,ajaxUrl){
        var liveOrderId = $(that).closest('.live-card').attr('id'),
            url = $(that).closest('.live-card').attr('data-url'),
            timer;
        var t = $(that);
        if(t.hasClass('success_join') === true){
            return false;
        }
        $.ajax({
            url : ajaxUrl,
            type : 'post',
            dataType : 'json',
            data : {
                liveId: liveOrderId,
                url: url
            },
            success : function(msg,event){
                if(msg.sign == 0){
                   alert('您已预约过此类课程或无此直播');
                }
                if(msg.sign == 2){
                    window.location.href = msg.msg;
                    return;
                }
                if(msg.sign == 1){
                    t.attr("data-target","#liveOrderSuccessModal");
                    liveOrderSuccessModal.showModal();
                    var tim = 5;
                    timer = setInterval(function(){
                        tim --;
                        $('.orderSuccessTip span').html(tim);
                        if(tim == 0){
                            $("#liveOrderSuccessModal").modal("hide");
                            clearInterval(timer);
                        }
                    },1000);
                    t.closest('.live-course-title').addClass('success_join');
                    t.find('span').html("已预约，请耐心等待");
                }
                if(msg.sign == 3){
                    t.attr("data-target","#liveOrderFailModal");
                    liveOrderFailModal.showModal();
                    var tim = 5;
                    timer = setInterval(function(){
                        tim --;
                        $('.orderFailTip span').html(tim);
                        if(tim == 0){
                            $("#liveOrderFailModal").modal("hide");
                            clearInterval(timer);
                        }
                        $('#liveOrderFailModal').on('hidden.bs.modal',function(){
                            clearInterval(timer);
                        });
                    },1000);
                }
            }
        });
    };
   
    var liveOrderSuccessModal = liveOrderSuccessModal || {};

    liveOrderSuccessModal.showModal = function(con){
        var that = $(this), data = that.data();
        var con = "<img src='/static/img/orderSuccess_A.png'><span class='orderSuccessTip'><span>5</span>秒钟后关闭</span>";
        //console.log(data);
        createModal.show({
            id : 'liveOrderSuccessModal',
            width : '560',
            title : "预约直播",
            cls : "liveOrderSuccessModal aaa ccc",
            content : con
        });
        $('#liveOrderSuccessModal').modal({backdrop: 'static', keyboard: false})

    };

    var liveOrderFailModal = liveOrderFailModal || {};

    liveOrderFailModal.showModal = function(timer){
        var that = $(this), data = that.data();
        var con = "<img src='/static/img/orderFail_A.png'><span class='orderFailTip'><span>5</span>秒钟后关闭</span>";
        //console.log(data);
        createModal.show({
            id : 'liveOrderFailModal',
            width : '560',
            title : "预约直播",
            cls : "liveOrderFailModal aaa ccc",
            content : con
        });
        $('#liveOrderFailModal').modal({backdrop: 'static', keyboard: false})

    };
     $('body').off('click', '.live-order').on('click', '.live-order', function () {
        var ajaxUrl = '/Lecture/ajaxFollow/';
        liveOrderAjax(this,ajaxUrl);
    });
    $('body').off('click', '.live-order-course').on('click', '.live-order-course', function () {
        var ajaxUrl = '/Index/ajaxFollow/';
        liveOrderAjax(this,ajaxUrl);
    });
});
;/*!/widget/Mall.help/ui-help.js*/
$(function() {
    $(".ui_tabs_help li a").each(function(index) { //带参数遍历各个选项卡
      $(this).click(function() { //注册每个选卡的单击事件
        $(".ui_tabs_help li a.current").removeClass("current"); //移除已选中的样式
        $(this).addClass("current"); //增加当前选中项的样式
        //显示选项卡对应的内容并隐藏未被选中的内容
        $("ul.ui_help_main li:eq(" + index + ")").show()
          .siblings().hide();
      });
    });

    //名师列表鼠标效果
    $(".help_guide dl").hover(function() {
      $(this).addClass("current");
    }, function() {
      $(this).removeClass("current");
    });
    //显示和隐藏
    function inforShow(ccc) {
      var con = $(ccc);
      var don = con.next('.infor_spot');
      if (don.is(':visible')) {
        con.removeClass('current');
        don.hide();
      } else {
        con.addClass('current');
        don.show();
      };
    }
    $('.title_spot').click(function() {
      inforShow(this);
    });
});
;/*!/widget/Mall.personCenter/personalCenter.js*/
var personCenter = personCenter || {};
personCenter.opt={
    forGuyTab: '.forGuyTab',
    focusGuy : '.focusGuyTab',
    notFocus : '.centerHeader-notFoucs-btn',
    alFocus  : '.centerHeader-alFocus',
    willFocus: '.centerHeader-willFocus-btn',
    stuInfo  : '.center-info-stud',
    stuNum   : '.center-info-stud-num',
    visitGuy : '.center-visit-person',
    visitName: '.center-visit-name',
}

/*选项卡交互*/
// $(personCenter.opt.forGuyTab).on('click',function(){
//     var that = this;
//     if($(that).hasClass('current')){
//         $(that).siblings('li').removeClass('current');
//     }else{
//         $(that).addClass('current').siblings('li').removeClass('current');
//     }
//     var index = $(personCenter.opt.forGuyTab).index(that);
//     $(personCenter.opt.focusGuy).eq(index).removeClass('hide').siblings().addClass('hide');
// });

/* 老师主页在售课程以及新鲜事 */
//$('#fresh-filter-nav li').click(function(){
//    var that = this;
//    if(!$(that).hasClass('current')){
//        $(that).addClass('current');
//        $(that).siblings('li').removeClass('current');
//    }
//})

/* 关注会遇到ajax与后台进行交互 */
//$(personCenter.opt.notFocus).on('click',function(){
//	/* 隐藏自己，显示其兄弟节点 */
//	var that = this;
//	$(that).addClass('hide');
//
//	$(personCenter.opt.alFocus).removeClass('hide');
//});

//$(personCenter.opt.willFocus).on('click',function(){
//	var that = this;
//	$(that).parent().addClass('hide');
//	$(personCenter.opt.notFocus).removeClass('hide');
//});



//$(personCenter.opt.stuInfo).on('mouseover',function(){
//    var num = $(personCenter.opt.stuNum).text();
//    $(this).attr('title','最近3个月消耗了'+num+'金币');
//});

//$(personCenter.opt.visitGuy).on('mouseover', function(){
//        //鼠标划过显示用户页卡，蓝V和红V用户可点击，点击后跳转到客人页
//        var that = this;
//        if($(that).hasClass('blueRed-v')) {
//            var nickname = $(that).find(personCenter.opt.visitName);
//            nickname.css({
//                'color': '#1e89e0'
//            });
//            $(that).on('click', function () {
//                window.location.href = '###';
//            });
//        }
//    });
//$(personCenter.opt.visitGuy).on('mouseout', function(){
//    var that = this;
//    var nickname = $(that).find(personCenter.opt.visitName);
//    nickname.css({'color': '#222'});
//});

/* 点击"老师介绍"弹出视频 */

//function videoPlay(videoUrl,flashplayerUrl){
//    var _html = '<script type="text/javascript">'
//        +'var swfVersionStr = "10.2.0";'
//        +'var xiSwfUrlStr = "playerProductInstall.swf";'
//        +'var flashvars = {};'
//        +'flashvars.url = "'+videoUrl+'";'
//        +'flashvars.autoPlay = "true";'
//        +'var params = {};'
//        +'params.quality = "high";'
//        +'params.bgcolor = "#666666";'
//        +'params.wmode = "transparent";'
//        +'params.allowscriptaccess = "sameDomain";'
//        +'params.allowfullscreen = "true";'
//        +'var attributes = {};'
//        +'attributes.id = "EncryptPlayer";'
//        +'attributes.name = "EncryptPlayer";'
//        +'attributes.align = "middle";'
//        +'swfobject.embedSWF("'+flashplayerUrl+'", "flashContent", "530px", "314px", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);'
//        +'swfobject.createCSS("#flashContent", "display:block;text-align:left;");'
//            +'<\/script>';
//
//             _html +=   '<div class="player_live">'
//                        +'<div id="VideoPlay" style="width:530px;height:314px">'
//                                +'<div class="lyrics-con-video" id="flashContent">'
//                                        +'<script type="text/javascript">'
//                                                +'var pageHost = ((document.location.protocol == "https:") ? "https://" :   "http://"); '
//                                                +'document.write("<a href=\'http://www.adobe.com/go/getflashplayer\'><img src=\'" + pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif\' alt=\'Get Adobe Flash player\' /></a>" ); '
//                                        +'<\/script>'
//                                +'<\/div>'
//                        +'<\/div>'
//                +'<\/div>';
//            createModal.show({
//                content : _html,
//                id : 'video-lay',
//                cancel : false,
//                width  : 530,
//                height : 314,
//                title : "老师风采"
//        });
//}

;/*!/widget/Module.Modal/swfobject.js*/
/**
 * swfobject
 */
/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

var swfobject = swfobject || function () {

    var UNDEF = "undefined",
        OBJECT = "object",
        SHOCKWAVE_FLASH = "Shockwave Flash",
        SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE = "application/x-shockwave-flash",
        EXPRESS_INSTALL_ID = "SWFObjectExprInst",
        ON_READY_STATE_CHANGE = "onreadystatechange",

        win = window,
        doc = document,
        nav = navigator,

        plugin = false,
        domLoadFnArr = [main],
        regObjArr = [],
        objIdArr = [],
        listenersArr = [],
        storedAltContent,
        storedAltContentId,
        storedCallbackFn,
        storedCallbackObj,
        isDomLoaded = false,
        isExpressInstallActive = false,
        dynamicStylesheet,
        dynamicStylesheetMedia,
        autoHideShow = true,

        /* Centralized function for browser feature detection
		- User agent string detection is only used when no good alternative is possible
		- Is executed directly for optimal performance
	*/
        ua = function () {
            var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
                u = nav.userAgent.toLowerCase(),
                p = nav.platform.toLowerCase(),
                windows = p ? /win/.test(p) : /win/.test(u),
                mac = p ? /mac/.test(p) : /mac/.test(u),
                webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
                ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
                playerVersion = [0, 0, 0],
                d = null;
            if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
                d = nav.plugins[SHOCKWAVE_FLASH].description;
                if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                    plugin = true;
                    ie = false; // cascaded feature detection for Internet Explorer
                    d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                    playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                    playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                }
            } else if (typeof win.ActiveXObject != UNDEF) {
                try {
                    var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                    if (a) { // a will return null when ActiveX is disabled
                        d = a.GetVariable("$version");
                        if (d) {
                            ie = true; // cascaded feature detection for Internet Explorer
                            d = d.split(" ")[1].split(",");
                            playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                        }
                    }
                } catch (e) {}
            }
            return {
                w3: w3cdom,
                pv: playerVersion,
                wk: webkit,
                ie: ie,
                win: windows,
                mac: mac
            };
        }(),

        /* Cross-browser onDomLoad
		- Will fire an event as soon as the DOM of a web page is loaded
		- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
		- Regular onload serves as fallback
	*/
        onDomLoad = function () {
            if (!ua.w3) {
                return;
            }
            if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
                callDomLoadFunctions();
            }
            if (!isDomLoaded) {
                if (typeof doc.addEventListener != UNDEF) {
                    doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
                }
                if (ua.ie && ua.win) {
                    doc.attachEvent(ON_READY_STATE_CHANGE, function () {
                        if (doc.readyState == "complete") {
                            doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
                            callDomLoadFunctions();
                        }
                    });
                    if (win == top) { // if not inside an iframe
                        (function () {
                            if (isDomLoaded) {
                                return;
                            }
                            try {
                                doc.documentElement.doScroll("left");
                            } catch (e) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            callDomLoadFunctions();
                        })();
                    }
                }
                if (ua.wk) {
                    (function () {
                        if (isDomLoaded) {
                            return;
                        }
                        if (!/loaded|complete/.test(doc.readyState)) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        callDomLoadFunctions();
                    })();
                }
                addLoadEvent(callDomLoadFunctions);
            }
        }();

    function callDomLoadFunctions() {
        if (isDomLoaded) {
            return;
        }
        try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
            var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
            t.parentNode.removeChild(t);
        } catch (e) {
            return;
        }
        isDomLoaded = true;
        var dl = domLoadFnArr.length;
        for (var i = 0; i < dl; i++) {
            domLoadFnArr[i]();
        }
    }

    function addDomLoadEvent(fn) {
        if (isDomLoaded) {
            fn();
        } else {
            domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
        }
    }

    /* Cross-browser onload
		- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
		- Will fire an event as soon as a web page including all of its assets are loaded 
	 */
    function addLoadEvent(fn) {
        if (typeof win.addEventListener != UNDEF) {
            win.addEventListener("load", fn, false);
        } else if (typeof doc.addEventListener != UNDEF) {
            doc.addEventListener("load", fn, false);
        } else if (typeof win.attachEvent != UNDEF) {
            addListener(win, "onload", fn);
        } else if (typeof win.onload == "function") {
            var fnOld = win.onload;
            win.onload = function () {
                fnOld();
                fn();
            };
        } else {
            win.onload = fn;
        }
    }

    /* Main function
		- Will preferably execute onDomLoad, otherwise onload (as a fallback)
	*/
    function main() {
        if (plugin) {
            testPlayerVersion();
        } else {
            matchVersions();
        }
    }

    /* Detect the Flash Player version for non-Internet Explorer browsers
		- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
		  a. Both release and build numbers can be detected
		  b. Avoid wrong descriptions by corrupt installers provided by Adobe
		  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
		- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
	*/
    function testPlayerVersion() {
        var b = doc.getElementsByTagName("body")[0];
        var o = createElement(OBJECT);
        o.setAttribute("type", FLASH_MIME_TYPE);
        var t = b.appendChild(o);
        if (t) {
            var counter = 0;
            (function () {
                if (typeof t.GetVariable != UNDEF) {
                    var d = t.GetVariable("$version");
                    if (d) {
                        d = d.split(" ")[1].split(",");
                        ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                } else if (counter < 10) {
                    counter++;
                    setTimeout(arguments.callee, 10);
                    return;
                }
                b.removeChild(o);
                t = null;
                matchVersions();
            })();
        } else {
            matchVersions();
        }
    }

    /* Perform Flash Player and SWF version matching; static publishing only
     */
    function matchVersions() {
        var rl = regObjArr.length;
        if (rl > 0) {
            for (var i = 0; i < rl; i++) { // for each registered object element
                var id = regObjArr[i].id;
                var cb = regObjArr[i].callbackFn;
                var cbObj = {
                    success: false,
                    id: id
                };
                if (ua.pv[0] > 0) {
                    var obj = getElementById(id);
                    if (obj) {
                        if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                            setVisibility(id, true);
                            if (cb) {
                                cbObj.success = true;
                                cbObj.ref = getObjectById(id);
                                cb(cbObj);
                            }
                        } else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                            var att = {};
                            att.data = regObjArr[i].expressInstall;
                            att.width = obj.getAttribute("width") || "0";
                            att.height = obj.getAttribute("height") || "0";
                            if (obj.getAttribute("class")) {
                                att.styleclass = obj.getAttribute("class");
                            }
                            if (obj.getAttribute("align")) {
                                att.align = obj.getAttribute("align");
                            }
                            // parse HTML object param element's name-value pairs
                            var par = {};
                            var p = obj.getElementsByTagName("param");
                            var pl = p.length;
                            for (var j = 0; j < pl; j++) {
                                if (p[j].getAttribute("name").toLowerCase() != "movie") {
                                    par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                }
                            }
                            showExpressInstall(att, par, id, cb);
                        } else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
                            displayAltContent(obj);
                            if (cb) {
                                cb(cbObj);
                            }
                        }
                    }
                } else { // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
                    setVisibility(id, true);
                    if (cb) {
                        var o = getObjectById(id); // test whether there is an HTML object element or not
                        if (o && typeof o.SetVariable != UNDEF) {
                            cbObj.success = true;
                            cbObj.ref = o;
                        }
                        cb(cbObj);
                    }
                }
            }
        }
    }

    function getObjectById(objectIdStr) {
        var r = null;
        var o = getElementById(objectIdStr);
        if (o && o.nodeName == "OBJECT") {
            if (typeof o.SetVariable != UNDEF) {
                r = o;
            } else {
                var n = o.getElementsByTagName(OBJECT)[0];
                if (n) {
                    r = n;
                }
            }
        }
        return r;
    }

    /* Requirements for Adobe Express Install
		- only one instance can be active at a time
		- fp 6.0.65 or higher
		- Win/Mac OS only
		- no Webkit engines older than version 312
	*/
    function canExpressInstall() {
        return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
    }

    /* Show the Adobe Express Install dialog
		- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
	*/
    function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
        isExpressInstallActive = true;
        storedCallbackFn = callbackFn || null;
        storedCallbackObj = {
            success: false,
            id: replaceElemIdStr
        };
        var obj = getElementById(replaceElemIdStr);
        if (obj) {
            if (obj.nodeName == "OBJECT") { // static publishing
                storedAltContent = abstractAltContent(obj);
                storedAltContentId = null;
            } else { // dynamic publishing
                storedAltContent = obj;
                storedAltContentId = replaceElemIdStr;
            }
            att.id = EXPRESS_INSTALL_ID;
            if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) {
                att.width = "310";
            }
            if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) {
                att.height = "137";
            }
            doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
            var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
                fv = "MMredirectURL=" + encodeURI(window.location).toString().replace(/&/g, "%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
            if (typeof par.flashvars != UNDEF) {
                par.flashvars += "&" + fv;
            } else {
                par.flashvars = fv;
            }
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            if (ua.ie && ua.win && obj.readyState != 4) {
                var newObj = createElement("div");
                replaceElemIdStr += "SWFObjectNew";
                newObj.setAttribute("id", replaceElemIdStr);
                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                obj.style.display = "none";
                (function () {
                    if (obj.readyState == 4) {
                        obj.parentNode.removeChild(obj);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            }
            createSWF(att, par, replaceElemIdStr);
        }
    }

    /* Functions to abstract and display alternative content
     */
    function displayAltContent(obj) {
        if (ua.ie && ua.win && obj.readyState != 4) {
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            var el = createElement("div");
            obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
            el.parentNode.replaceChild(abstractAltContent(obj), el);
            obj.style.display = "none";
            (function () {
                if (obj.readyState == 4) {
                    obj.parentNode.removeChild(obj);
                } else {
                    setTimeout(arguments.callee, 10);
                }
            })();
        } else {
            obj.parentNode.replaceChild(abstractAltContent(obj), obj);
        }
    }

    function abstractAltContent(obj) {
        var ac = createElement("div");
        if (ua.win && ua.ie) {
            ac.innerHTML = obj.innerHTML;
        } else {
            var nestedObj = obj.getElementsByTagName(OBJECT)[0];
            if (nestedObj) {
                var c = nestedObj.childNodes;
                if (c) {
                    var cl = c.length;
                    for (var i = 0; i < cl; i++) {
                        if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                            ac.appendChild(c[i].cloneNode(true));
                        }
                    }
                }
            }
        }
        return ac;
    }

    /* Cross-browser dynamic SWF creation
     */
    function createSWF(attObj, parObj, id) {
        var r, el = getElementById(id);
        if (ua.wk && ua.wk < 312) {
            return r;
        }
        if (el) {
            if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
                attObj.id = id;
            }
            if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
                var att = "";
                for (var i in attObj) {
                    if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
                        if (i.toLowerCase() == "data") {
                            parObj.movie = attObj[i];
                        } else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            att += ' class="' + attObj[i] + '"';
                        } else if (i.toLowerCase() != "classid") {
                            att += ' ' + i + '="' + attObj[i] + '"';
                        }
                    }
                }
                var par = "";
                for (var j in parObj) {
                    if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
                        par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                    }
                }
                el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
                r = getElementById(attObj.id);
            } else { // well-behaving browsers
                var o = createElement(OBJECT);
                o.setAttribute("type", FLASH_MIME_TYPE);
                for (var m in attObj) {
                    if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
                        if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            o.setAttribute("class", attObj[m]);
                        } else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
                            o.setAttribute(m, attObj[m]);
                        }
                    }
                }
                for (var n in parObj) {
                    if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
                        createObjParam(o, n, parObj[n]);
                    }
                }
                el.parentNode.replaceChild(o, el);
                r = o;
            }
        }
        return r;
    }

    function createObjParam(el, pName, pValue) {
        var p = createElement("param");
        p.setAttribute("name", pName);
        p.setAttribute("value", pValue);
        el.appendChild(p);
    }

    /* Cross-browser SWF removal
		- Especially needed to safely and completely remove a SWF in Internet Explorer
	*/
    function removeSWF(id) {
        var obj = getElementById(id);
        if (obj && obj.nodeName == "OBJECT") {
            if (ua.ie && ua.win) {
                obj.style.display = "none";
                (function () {
                    if (obj.readyState == 4) {
                        removeObjectInIE(id);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            } else {
                obj.parentNode.removeChild(obj);
            }
        }
    }

    function removeObjectInIE(id) {
        var obj = getElementById(id);
        if (obj) {
            for (var i in obj) {
                if (typeof obj[i] == "function") {
                    obj[i] = null;
                }
            }
            obj.parentNode.removeChild(obj);
        }
    }

    /* Functions to optimize JavaScript compression
     */
    function getElementById(id) {
        var el = null;
        try {
            el = doc.getElementById(id);
        } catch (e) {}
        return el;
    }

    function createElement(el) {
        return doc.createElement(el);
    }

    /* Updated attachEvent function for Internet Explorer
		- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
	*/
    function addListener(target, eventType, fn) {
        target.attachEvent(eventType, fn);
        listenersArr[listenersArr.length] = [target, eventType, fn];
    }

    /* Flash Player and SWF content version matching
     */
    function hasPlayerVersion(rv) {
        var pv = ua.pv,
            v = rv.split(".");
        v[0] = parseInt(v[0], 10);
        v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
        v[2] = parseInt(v[2], 10) || 0;
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }

    /* Cross-browser dynamic CSS creation
		- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
	*/
    function createCSS(sel, decl, media, newStyle) {
        if (ua.ie && ua.mac) {
            return;
        }
        var h = doc.getElementsByTagName("head")[0];
        if (!h) {
            return;
        } // to also support badly authored HTML pages that lack a head element
        var m = (media && typeof media == "string") ? media : "screen";
        if (newStyle) {
            dynamicStylesheet = null;
            dynamicStylesheetMedia = null;
        }
        if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
            // create dynamic stylesheet + get a global reference to it
            var s = createElement("style");
            s.setAttribute("type", "text/css");
            s.setAttribute("media", m);
            dynamicStylesheet = h.appendChild(s);
            if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
            }
            dynamicStylesheetMedia = m;
        }
        // add style rule
        if (ua.ie && ua.win) {
            if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
                dynamicStylesheet.addRule(sel, decl);
            }
        } else {
            if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
            }
        }
    }

    function setVisibility(id, isVisible) {
        if (!autoHideShow) {
            return;
        }
        var v = isVisible ? "visible" : "hidden";
        if (isDomLoaded && getElementById(id)) {
            getElementById(id).style.visibility = v;
        } else {
            createCSS("#" + id, "visibility:" + v);
        }
    }

    /* Filter to avoid XSS attacks
     */
    function urlEncodeIfNecessary(s) {
        var regex = /[\\\"<>\.;]/;
        var hasBadChars = regex.exec(s) != null;
        return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
    }

    /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
     */
    var cleanup = function () {
        if (ua.ie && ua.win) {
            window.attachEvent("onunload", function () {
                // remove listeners to avoid memory leaks
                var ll = listenersArr.length;
                for (var i = 0; i < ll; i++) {
                    listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                }
                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                var il = objIdArr.length;
                for (var j = 0; j < il; j++) {
                    removeSWF(objIdArr[j]);
                }
                // cleanup library's main closures to avoid memory leaks
                for (var k in ua) {
                    ua[k] = null;
                }
                ua = null;
                for (var l in swfobject) {
                    swfobject[l] = null;
                }
                swfobject = null;
            });
        }
    }();

    return {
        /* Public API
			- Reference: http://code.google.com/p/swfobject/wiki/documentation
		*/
        registerObject: function (objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
            if (ua.w3 && objectIdStr && swfVersionStr) {
                var regObj = {};
                regObj.id = objectIdStr;
                regObj.swfVersion = swfVersionStr;
                regObj.expressInstall = xiSwfUrlStr;
                regObj.callbackFn = callbackFn;
                regObjArr[regObjArr.length] = regObj;
                setVisibility(objectIdStr, false);
            } else if (callbackFn) {
                callbackFn({
                    success: false,
                    id: objectIdStr
                });
            }
        },

        getObjectById: function (objectIdStr) {
            if (ua.w3) {
                return getObjectById(objectIdStr);
            }
        },

        embedSWF: function (swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
            var callbackObj = {
                success: false,
                id: replaceElemIdStr
            };
            if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                setVisibility(replaceElemIdStr, false);
                addDomLoadEvent(function () {
                    widthStr += ""; // auto-convert to string
                    heightStr += "";
                    var att = {};
                    if (attObj && typeof attObj === OBJECT) {
                        for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                            att[i] = attObj[i];
                        }
                    }
                    att.data = swfUrlStr;
                    att.width = widthStr;
                    att.height = heightStr;
                    var par = {};
                    if (parObj && typeof parObj === OBJECT) {
                        for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                            par[j] = parObj[j];
                        }
                    }
                    if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                        for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                            if (typeof par.flashvars != UNDEF) {
                                par.flashvars += "&" + k + "=" + flashvarsObj[k];
                            } else {
                                par.flashvars = k + "=" + flashvarsObj[k];
                            }
                        }
                    }
                    if (hasPlayerVersion(swfVersionStr)) { // create SWF
                        var obj = createSWF(att, par, replaceElemIdStr);
                        if (att.id == replaceElemIdStr) {
                            setVisibility(replaceElemIdStr, true);
                        }
                        callbackObj.success = true;
                        callbackObj.ref = obj;
                    } else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                        att.data = xiSwfUrlStr;
                        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        return;
                    } else { // show alternative content
                        setVisibility(replaceElemIdStr, true);
                    }
                    if (callbackFn) {
                        callbackFn(callbackObj);
                    }
                });
            } else if (callbackFn) {
                callbackFn(callbackObj);
            }
        },

        switchOffAutoHideShow: function () {
            autoHideShow = false;
        },

        ua: ua,

        getFlashPlayerVersion: function () {
            return {
                major: ua.pv[0],
                minor: ua.pv[1],
                release: ua.pv[2]
            };
        },

        hasFlashPlayerVersion: hasPlayerVersion,

        createSWF: function (attObj, parObj, replaceElemIdStr) {
            if (ua.w3) {
                return createSWF(attObj, parObj, replaceElemIdStr);
            } else {
                return undefined;
            }
        },

        showExpressInstall: function (att, par, replaceElemIdStr, callbackFn) {
            if (ua.w3 && canExpressInstall()) {
                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
            }
        },

        removeSWF: function (objElemIdStr) {
            if (ua.w3) {
                removeSWF(objElemIdStr);
            }
        },

        createCSS: function (selStr, declStr, mediaStr, newStyleBoolean) {
            if (ua.w3) {
                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
            }
        },

        addDomLoadEvent: addDomLoadEvent,

        addLoadEvent: addLoadEvent,

        getQueryParamValue: function (param) {
            var q = doc.location.search || doc.location.hash;
            if (q) {
                if (/\?/.test(q)) {
                    q = q.split("?")[1];
                } // strip question mark
                if (param == null) {
                    return urlEncodeIfNecessary(q);
                }
                var pairs = q.split("&");
                for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                        return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                    }
                }
            }
            return "";
        },

        // For internal usage only
        expressInstallCallback: function () {
            if (isExpressInstallActive) {
                var obj = getElementById(EXPRESS_INSTALL_ID);
                if (obj && storedAltContent) {
                    obj.parentNode.replaceChild(storedAltContent, obj);
                    if (storedAltContentId) {
                        setVisibility(storedAltContentId, true);
                        if (ua.ie && ua.win) {
                            storedAltContent.style.display = "block";
                        }
                    }
                    if (storedCallbackFn) {
                        storedCallbackFn(storedCallbackObj);
                    }
                }
                isExpressInstallActive = false;
            }
        }
    };
}();
;/*!/widget/Mall.LiveApply/LiveApply.js*/

// $(function(){
//     $('.applyinfo a').on('click', function() {
//          var success_arr = [
//             'baoming_success',
//             'number_full',
//             'yuyue_success'
//         ];

//         var hide_arr = [
//             'baoming_nostart',
//             'baoming_over',
//             'yuyue_nostart',
//             'yuyue_over'
//         ];
//         var pattern = /button\/(.*?)\.png/g;
//         var imgSrc = $('.applyinfo a img').attr('src');
//         var imgName = pattern.exec(imgSrc)[1];
//         if ($.inArray(imgName, hide_arr) != -1) {
//             $('.settime .baoming_detail').remove();
//         }
//         if ($.inArray(imgName, hide_arr) != -1 || $.inArray(imgName, success_arr) != -1) {
//             $('.applyinfo a').addClass('failapply');
//         }
//         if ($.inArray(imgName, hide_arr) != -1 || $.inArray(imgName, success_arr) != -1) {
//             return false;
//         }
//         var alowGrade = 1;
//         var gradeNames = '一年级';
//         if(alowGrade==0){
//             alert('本次活动是为了'+gradeNames+'年级学员准备的，如果您年级填写错误，请修改年级');
//             return false;
//         }
//         $('.apply_container .special').css('display', 'block');
//         $('.applyinfo').css('border-bottom', '1px dashed #cbcbcb');
//         var windowHeight = parseInt($("body").css("height"));//整个页面的高度
//         $( "html,body").animate({ "scrollTop" : windowHeight }, 1000);
//     })
//     $('#apply_button').on('click', function(){
//         var f=$('.usersinfo');
//         var tpl='<span class="sub-wrong">请填写此信息</span>';
//         var tpl1='<span class="sub-wrong">请填写正确手机号码</span>';
//         var box=$('input[type=tel]');
//         var isPhone = (/^(13|15|16|18)[0-9]{9}$/.test(box.val()) ? true : false);
//         f.find('input').each(function() {
//             if(this.value === ""){
//                 $(this).addClass('error');
//                 if($(this).parent().find('.sub-wrong').length === 0){
//                     $(this).parent().append(tpl);
//                 }
//                 return false;
//             }else{
//                 if($(this).attr('type') == 'tel'){
//                     if(!isPhone){
//                         $(this).addClass('error');
//                         if($(this).parent().find('.sub-wrong').length === 0){
//                             $(this).parent().append(tpl1);
//                         }
//                         return false;
//                     }
//                 }
//             }
//             f.find('.sub-wrong').remove();
//             f.find('input').removeClass('error');
//         });

//         if(f.find('input.error').length === 0){
//             var formData = $("#form").serialize();
//             $.ajax({
//                 url	: '/Signup/join/',
//                 type: 'POST',
//                 data: formData,
//                 dataType:'json',
//                 success: function(result){
//                     if(result.sign == 1){
//                         xue.alert(result.msg, function(){
//                             //							window.location = '/Signup/detail/' + 823;
//                             window.location.reload();
//                         });
//                         setTimeout(function(){
//                             window.location.reload();
//                         }, 3000);
//                     }else if(result.sign == 2) {
//                         window.location.href = result.msg;
//                     }else{
//                         xue.alert(result.msg);
//                         return false;
//                     }
//                 }
//             });
//         }
//     })

//    // updateEndTime();
// });

// // function updateEndTime(){
// //     xue.date.clock.start({
// //         date : '2015-12-23 17:26:04',
// //         tpl : 'yyyy-MM-dd HH:mm:ss',
// //         endTime : '2015-12-24 18:00:00',
// //         endCallback : function(d){
// //             location.href = location.href;
// //             //			if(xue.isIE){
// //             //				window.navigate(document.URL);
// //             //			}else{
// //             //				location.href = location.href;
// //             //				document.execCommand('Refresh');
// //             //				$('head').append('<meta http-equiv="refresh" content="3">');
// //             //			}

// //         },
// //         callback : function(c){
// //             var box = $('.settime');
// //             var a = c / 1000;
// //             var second = Math.floor(a % 60);
// //             var minute = Math.floor((a / 60) % 60);
// //             var hour = Math.floor((a / 3600) % 24);
// //             var day = Math.floor((a / 3600) / 24);
// //             box.html(
// //                 '剩余：<span>' + day + '</span>天'
// //                 + '<span>' + hour + '</span>时'
// //                 + '<span>' + minute + '</span>分'
// //                 + '<span>' + second + '</span>秒'
// //             );
// //         }
// //     });
// // }
;/*!/widget/Public.Module/collectApp.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */

 var colect = colect || {};


/**
 * 
 * 动态切换大小图片、视频、作答效果
 * @param {Object} fm colect.media前缀
 * 
 */
 colect.media = colect.media || {};
 (function(fm){
 	fm.img = fm.img || {};
	/**
	 * 切换大小图片方法
	 * @param  {Object} dom 页面元素
	 */
	 fm.img.toggle = function(dom){
	 	var _img = $(dom);
        //判断是否存在图片，如果不存在则返回false
        if( _img.length == 0 ){ 
        	return false; 
        } else {
        	var _url = _img.find('img').attr('src');
        	if( _img.hasClass('colect-media-img-list') ){
        		if( _img.siblings('.colect-type-img').find('img').length == 0 ){
        			var _tpl ='<div class="colect-media-big-img">\
        			<img src="'+ _url.replace("_small", "_big")+ '">\
        			</div>';
        			_img.siblings('.colect-type-img').html(_tpl);   
        		}
        	}
        	_img.hide();
        	_img.siblings('.colect-type-img').show();    
        }
    }

    fm.answer = fm.answer || {};
})(colect.media);

$('.collect-feed').off('click', '.colect-type-img').on('click', '.colect-type-img', function(){
	colect.media.img.toggle(this);
});


//音频时间长短控制背景长度
$(function(){
	var $times = $('.icoVoiceCon .voiceTime em');
	$times.each(function() {
		var $len = $(this).text();
		var $con = $(this).parents('.icoVoiceCon');
		if($len > 0){
			$con.css('width','80px');  
		}
		if ($len > 20) {
			$con.css('width','100px');
		}
		if($len > 40){
			$con.css('width','120px'); 
		}	
	});
	//点击播放音频
	$('.content-collect').on('click', '.icoVoiceCon span.icoVoice', function(){
		var that = $(this),
		par = that.parents('.collect-feed'),
		len = par.hasClass('icoVoicePlaying'),
		_url = $('#audioUrl');
		var times = that.next().find('em').text();
		// alert(times);
		var ur = that.parents('.icoVoiceCon').find('#voiceUrl').val();
		if (len === false) {
			// alert(1111)
			par.addClass('icoVoicePlaying').siblings().removeClass('icoVoicePlaying');
			_url.attr('src', ur);
		}else{
			// alert(222)
			par.removeClass('icoVoicePlaying');
			_url.attr('src', 'http://img04.xesimg.com/xuelibugou_logo.png');
		};
		setTimeout(function(){
			par.removeClass('icoVoicePlaying');
			_url.attr('src', 'http://img04.xesimg.com/xuelibugou_logo.png');
		}, times +'000');
	});

	$('.content-collect').on('click', '.feed-media', function(){
		$(this).addClass('hide').siblings('').removeClass('hide');
	});
});

;/*!/widget/Public.Topbar/topbar.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-30 14:50:51
 * @version $Id$
 */

$(function(){
    dropdown.init();
});
;/*!/widget/Public.Video/video.js*/

var xue = xue || {};
xue.video = xue.video || {};
(function(){
    var v = xue.video;
    v.opt = {
        url : '',
        dom : '.video-player-wrap'
    };
    v.get = function(url){
        var _url = $(v.opt.dom).data('url') || url || v.opt.url;
        var _params = $(v.opt.dom).data('params') || '';
        if(_url == '' || !_url){
            return this;
        }
//        if(window.XDomainRequest){
//            xdr = new XDomainRequest();
//            if (xdr) {
//                xdr.onerror = function(){
//                    alert('error！');
//                };
////                    xdr.ontimeout = 10000;
//                xdr.onprogress = function(){
//                    alert('progress……');
//                };
//                xdr.onload = function(){
//                    $(v.opt.dom).html(xdr.responseText);
//                };
//                xdr.timeout = 10000;
//                xdr.open("get", _url);
//                xdr.withCredentials = true;
//                xdr.send();
//            } else {
//                alert("Failed to create");
//            }
//        }else{
            $.ajax({
                url : _url,
                type : 'GET',
                dataType : 'html',
                xhrFields: {
                    withCredentials: true
                },
                success : function(result){
                    $(v.opt.dom).html(result);
                }
            });
//        }
        return this;
//        $(v.opt.dom).get(_url, _params);
    };
}());

$(function(){
    if($(xue.video.opt.dom).length > 0){
        xue.video.get();
    }
});
;/*!/widget/UserHome.testShow/testShow.js*/
var testShow = testShow||{};
