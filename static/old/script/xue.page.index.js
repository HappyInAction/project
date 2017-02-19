/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-12 16:52:31
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name xue.page.index.js
 * @description 首页文件
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */
// 邮箱后缀提示@@@
function mailAutoName () {
 $("#username").mailAutoComplete({
            boxClass: "out_box", //外部box样式
            listClass: "list_box", //默认的列表样式
            focusClass: "focus_box", //列表选样式中
            markCalss: "mark_box", //高亮样式
            autoClass: false,
            textHint: true, //提示文字自动隐藏
            hintText: "请输入邮箱地址"
        });    
}
// 课程详情页
function courseInfo(id){
    var _box = $(id),
    _t = (id == '#course_content') ? 39 : 39,
    _top = _box.offset().top - _t;
    $(window).scrollTop(_top);
}

function setCourseHandleCurrent(d){
    d.addClass('current').siblings().removeClass('current');
}
// 课程列表
function filterDown(aaa) {
    var con = $(aaa).next();
    var icon = $(aaa).find('.icon_course_down');
    if(con.is(':visible')) {
        con.hide();
        icon.removeClass('icon_course_up');
    } else {
        con.show();
        icon.addClass('icon_course_up');
    }
}
function headSelectCourse(d){}
//更多条件
function filterTextMore(d) {
    if($(d).length === 0){ return; }
    
    var con = $(d).parent().prevAll(".filter_other");
    var bord = $(d).parent().prevAll(".filter_item").eq(3);
    var icon = $(d);
    if(icon.hasClass('up')){
        con.hide();
        icon.removeClass("up");
        bord.addClass("border_none");
    }else{
        con.show();
        icon.addClass("up");
        bord.removeClass("border_none");
    }
}

function showRadomDiv(){
  var tos =$("#newCurTabs li");
      var total=tos.length;//获得li的总个数
      var showDiv=Math.round(Math.random()*(total));//获得显示li的随机数
      tos.eq(showDiv-1).addClass('current');
      $(".index_new_content").children().eq(showDiv-1).css('display','block');

  }


// 切换改为鼠标移入后执行
function tabs(tabTit, on, tabCon){

    var items = $(tabTit).children();

    items.each(function(){
        var that = $(this),
        con  = $(tabCon).children(),
        link = that.find('a'),
        index = that.index(),
        grade = 5;

        // 此处为动态修改a标签的链接地址，上线时修改php内容后可去掉   
        if(tabTit == '#newCurTabs'){
            if(index >= 0 && index < 6){
                grade = 'xiao' + (index + 1);
            }else if(index >= 6 && index < 9){
                grade = 'chu' + (index - 5);
            }else if(index >= 8 && index < 12){
                grade = 'gao' + (index - 8);
            }
            link.attr({'href' : 'http://' + xue.host + '/' + grade, 'target' : '_blank'});
        // }else if(tabTit == '#newTeacherTabs'){
        //     if(index == 0){
        //         grade = '';
        // }
    }
        // 修改a标签的href地址结束

        // 改为鼠标移入后切换
        that.on('mouseenter', function(){
            that.addClass(on).siblings().removeClass(on);
            con.eq(index).show().siblings().hide();
        });
    });

}


$(function(){
    tabs("#newCurTabs", "current", ".index_new_content");
    tabs("#openCourseTabs", "current", ".open_course_content");
    tabs("#newTeacherTabs", "current", ".teacher_new_content");
    tabs(".tabs_trends", "current", ".side_tab_body");
    tabs("#learningClassTabs", "current", ".learning_class_content");
    tabs("#gloryCourseTabs", "current", "#gloryContent");
    tabs("#newTeacherTabs","current",".channel_content");
    tabs("#newfreshTabs","current",".fresh_content");
    tabs("#newspecialTabs","current",".special_content");
    tabs("#promotelistTab","current",".elastic_laye_box");
    tabs("#newLiveBackTabs","current",".liveback_content");
    tabs("#FreeCurTabs","current",".freeDirect_wrap");
    showRadomDiv();
    mailAutoName();//执行邮箱后缀提示
    //课程详情页
    $('.tabs_title_item li').click(function(){
        var _id = $(this).attr('con');
        if(_id){
            setCourseHandleCurrent($(this));
            courseInfo('#' + _id);
        }
    });

    //课程列表
    $('.filter_down').click(function(){
        filterDown(this);
    });
    // 点击空白处，隐藏课程筛选下拉框
    $(document).on('click', function(e){
        var p = $(e.target).parents('.filter_handle');
        if(p.length === 0){
            var con = $('.filter_handle .filter_handle_items');
            var icon = $('.filter_handle .icon_course_down');
            if(con.is(':visible')) {
                con.hide();
                icon.removeClass('icon_course_up');
            }
        }
    });
});
    
    //更多条件
    // $('.filter_more p').click(function(){
    //     filterTextMore(this);    

    //  });

    // xue.use('userAutoComplete', function(){
    //     if (!xue.userAutoComplete.opt.isLoad) {
    //         userAutoCompleteOnload();

    //          var _config = {
    //             id: 'xes_autoTips',
    //             itemCls: 'item',
    //             curCls: 'cur',
    //             curBg: '#FFD4D7',
    //             tips: '请选择邮箱类型',
    //             userCls: '#username',
    //             passCls: '#password',
    //             subCls: '#loginsubmit',
    //             formCls: '#form_indexlogin'
    //         };
    //         var _autoComplete = xue.userAutoComplete;
    //         _autoComplete.ready(_config);
    //         _autoComplete.opt.isLoad = true;   
    //     }
    // });

    // 签到
    function showAlert(dom){
        var _day =dom.data('day'),
        _gold= dom.data('gold'),
        _nextgold= dom.data('ngold'),
        _nextdays=dom.data('ndays');
        // 成功后的提一条提示：奖励10金币
        tpl = '<p>今日签到成功！获得<strong>10</strong>金币</p>';
        // alert(tpl);
        // 当额外奖励 > 0时出现下面的第二条信息
        if(Number(_nextgold) > 0){
            tpl += '<p>再连续签到<strong>'+ _nextdays +'</strong>天可额外获得<strong>'+_nextgold+'</strong>金币！</p>';
        // }else if(Number(_gold) > 0){
        }else{
            tpl += '<p>连续签到<strong>'+ _day +'</strong>天，额外获得<strong>'+_gold+'</strong>金币！</p>';
        }
        $('.classcard').addClass('classdisable finish');
        xue.win({
            id: 'signTips',
            cls: 'signTips',
            title: false,
            cancel: false,
            submit: false,
            arrow: 'tc',
            close: false,
            lock: false,
            follow: dom,
            // time: 2500,
            content: tpl
        });
        // 设置弹窗定位
        xue.win('signTips').position(0, dom.offset().top + dom.height() + 10);
        var _tips = $('#xuebox_signTips');
        _tips.css('position', 'absolute');
        var tipsOut = setTimeout(function(){
            _tips.fadeOut(100,function(){
                xue.win('signTips').close();
                tipsOut = null;
            });
        },2000);
    }

    $('.classcard:not(.classdisable)').on({
        mouseover: function(){
            $(this).addClass('hoverclass');
        },
        mouseout: function(){
            $(this).removeClass('hoverclass');
        },
        click: function(){
            // 声明模板
            var tpl, that = $(this);
            if($(this).hasClass('classdisable')){return false;}
            var url = 'http://' + xue.host + '/LearningCenter/signInAjax';
                // var url = 'http://v04.xesui.com/source/json/sign.json';
                $.ajax(url, {
                    type:'post',
                    dataType: 'json',
                    //timeout : 7000,
                    error: function(){
                        alert('Date Error!');
                    },
                    success: function(d){
                        var singAlert = xue.ajaxCheck.json(d);
                        if(singAlert){
                            // 给“签到”标签增加data数据内容
                            that.data({
                                day : singAlert.days,       // 连续天数，有可能是0
                                gold: singAlert.gold,       // 额外奖励金币，有可能是0
                                ngold: singAlert.nextGold,  //下次额外奖励的金币数
                                ndays: singAlert.nextDays   //距离下次额外奖励的天数
                            });
                            // 执行弹出提示效果
                            showAlert(that);
                            //showGift();
                        }
                    }
                });
            }
        });
$('#container').on('mouseenter', '.classcard.classdisable', function(){
    var that = $(this);
    showAlert(that);
});
// $(".qrcode_new").click(function(){
//     showGift();
// })
// 签到有礼
// function showGift(){
//     var mask='<div class="gift_wrap">'
//         mask+='<div class="gift_box">'
//         mask+='<div class="gift_box_inner">'
//         mask+='<img src="http://img04.xesimg.com/giftbox.png">'
//         mask+='<a href="http://bbs.xueersi.com/viewthread.php?tid=392441&highlight=6.26" class="go_gift"></a>'
//         mask+='<a href="###" class="gift_close"><img src="http://img04.xesimg.com/gift_close.png"></a>'
//         mask+='</div>'
//         mask+='</div>'
//         mask+='<div class="gift_box_bg"></div>'
//         mask+='</div>'
//     $('body').append(mask);
//     $(".gift_box").show();    //弹框先显示出来
//     var height = $(".gift_box").height(); //弹框的高
//     var width = $(".gift_box").width();  //弹框的宽
//     //定位垂直水平居中
//     $(".gift_box").css("top", ($(window).height() - height) / 2).css("left", ($(window).width() - width) / 2);
//     $('.gift_wrap').show();
//     $('.gift_close').on('click',function(){
//         $('.gift_wrap').remove();
//    });
// }


//新鲜事整区域增加链接
var a = $('.hover_feed_item');
a.on('mouseover', function(){
    $(this).addClass('hover_feed');
});
a.on('mouseout', function(){
    $(this).removeClass('hover_feed');
});
a.find('.feed_detail').off('click').on('click', function(event){
    var t = $(event.target);
    if(t.attr('href')){
        return;
    }else{
        var b = $(this).find('.feed_bar a');
        window.open(b.attr('href'));
    }
})
//最新公开课区域增加链接
var a = $('.new_panel_content .ui_feed');
a.on('mouseover', function(){
    $(this).addClass('hover_feed');
});
a.on('mouseout', function(){
    $(this).removeClass('hover_feed');
});
a.find('.course_detail').off('click').on('click', function(event){
    var t = $(event.target);
    if(t.attr('href')){
        return;
    }else{
        var b = $(this).find('.course_title a');
        window.open(b.attr('href'));
    }
})


    //文章页评论字数
    $('.article_comments_item').off('keyup', '.comment_textarea textarea').on('keyup', '.comment_textarea textarea', function(){
        var that = $(this);
        xue.use('comment', function(){
            setTimeout(function(){
                xue.comment.countsize(that);
            }, 10);
        });
    });   

    // // 每日五题：首页提示
    // $('#container').off('mouseenter', '.task_fiveQuestions').on('mouseenter', '.task_fiveQuestions', function(){
    //     var that = $(this);
    //     if(that.find('.task_days').length > 0){ return false; }
    //     xue.use('feed', function(){
    //         xue.feed.extend.fiveQuestionTips(that);
    //     });
    // });

    // // 每日五题：首页领奖
    // $('.task_fiveQuestions').off('click', '.task_days_btn').on('click', '.task_days_btn', function(){
    //     var that = this;

    //     xue.use('feed', function(){
    //         xue.feed.extend.fiveQuestionSubmit(that);
    //     });
    // });

    // // 每日五题：点击显示功能提示弹层
    // $('.task_fiveQuestions').on('click', function(){
    //     var that = $(this);
    //     if(that.find('.task_days').length === 0){ return false; }
    //     xue.win({
    //         id : 'fiveQuestions',
    //         title : false,
    //         cancel : false,
    //         // width : 531,
    //         // height: 305,
    //         submitVal : '去看看',
    //         padding : '10px 10px 0 10px',
    //         content : '<img src="http://img04.xesimg.com/tips_five.jpg" />',
    //         submit : function(){
    //             window.location.href = '/LearningCenter/dynamic';
    //         }
    //     });
    // });
    $('.list_title_info').on('click', ' ul li:last', function() {//点击最后一个li添加一个类
        $(this).find('.liveCoachInfo').addClass('liveImg');
        
    });
     $('.list_title_info').on('click', ' ul li:first', function() {//点击第一个li添加一个类
        $(this).next().find('.liveCoachInfo').removeClass('liveImg');
    });

 



    // 学习计划 划过
    function studyPlanAlert(obj,classname){
        var dom=obj,
        tpl_1 = '<p>您今天没有学习计划哦</p>',
        tpl_2='<p>完成今天的学习计划可以获得<strong>5</strong>金币奖励哦，加油少年！</p>',
        tpl_3='<p>您的学习计划已完成，快领取金币奖励吧</p>',
        tpl_4='<p>您的学习计划任务已完成。</p>';
        function alertMod(dom,str){
            xue.win({
                id: 'signTips',
                cls: 'signTips',
                title: false,
                cancel: false,
                submit: false,
                arrow: 'tc',
                close: false,
                lock: false,
                follow: dom,
            // time: 2500,
            content: str,
            width:200
        });
        // 设置弹窗定位
        xue.win('signTips').position(0, dom.offset().top + dom.height() + 10);
        var _tips = $('#xuebox_signTips');
        _tips.css('position', 'absolute');
        var tipsOut = setTimeout(function(){
            _tips.fadeOut(100,function(){
                xue.win('signTips').close();
                tipsOut = null;
            });
        }, 2000);
    }

    switch (classname) {
        case 'sp_exist':
        alertMod(dom,tpl_2);
        break;
        case 'sp_noexist':
        alertMod(dom,tpl_1);
        break;
        case 'sp_get':
        alertMod(dom,tpl_3);
        break;
        case 'sp_got':
        alertMod(dom,tpl_4); 
        break;
        default:
    }
}

$('#container').on('mouseenter', '#study_plan', function(){
    var that = $(this),
    classname=that.attr('class').replace(/task_3\s/, '');

    studyPlanAlert(that,classname);
});

    //公开课程整体加链接
    var open_class= $('.ul_openclass li');
    open_class.on('mouseover', function(){
        $(this).addClass('hover_feed');
    });
    open_class.on('mouseout', function(){
        $(this).removeClass('hover_feed');
    });
    open_class.off('click').on('click', function(event){
        var t = $(event.target);
        if(t.attr('href')){
            return;
        }else{
            var b = $(this).find('.title_link');
            window.open(b.attr('href'));
        }
    })

//实验班频道 js
$(function(){
    var s_con =$(".starTeacher"),
    s_prev = s_con.find('span.prev'),
    s_next = s_con.find('span.next');
    s_prev.hover(function() {
     if ($('starTeacher span.disabled').length < 1) {
        $(this).addClass('hover_p')
    };
}, function() {
    $(this).removeClass('hover_p')
});
    s_next.hover(function() {
     if ($('starTeacher span.disabled').length < 1) {
        $(this).addClass('hover_n')
    };
}, function() {
    $(this).removeClass('hover_n')
});

//明星学员的hover效果
$('.starStudent .starlist').hover(function() {
          $(this).addClass('hover');//增加类
      }, function() {
        $(this).removeClass('hover');//减去类
    });
});
// 任性购分享微信
function shareWeiXin(){
 var courseId=$("#courseId").val();
 var isShareval=$("#isShare").val();
 con='<div class="code_wrap"><p>打开微信“扫一扫”，打开网页后点击屏幕右上角分享按钮</p><div id="code" ></div></div>'
 xue.win({
          id : 'shareWeiXin',           // 多个弹窗需要设置id
          title : '',        // 弹窗标题
          content : con,         // 弹窗里面的内容
          lock: true,            // 背景遮罩
          width: 500,
          height : 420,
          submit : false,
          cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
          close : true          // 点击关闭时的事件
      });

 var qrcode = new QRCode(document.getElementById("code"), {
            width : 180,//设置宽高
            height : 180
        });
var str = 'http://touch.xueersi.com/kc/' + courseId + '.html';//生成二维码的链接 

qrcode.makeCode(str);

if(isShareval=="0"){       
    $.ajax({
        url : "/shoppingCart/addShare/",
        type: 'post',
        dataType:'json',
        data : {courseId:courseId},
        success: function(result){
            $("#isShare").val(1);
        }
    });
}
}

//广州大课堂-----打包课程
 function tabszt(tabTit,on,tabCon){
           $(tabTit).children().click(function(){
              $(this).addClass(on).siblings().removeClass(on);
               var index = $(tabTit).children().index(this);
               $(tabCon).children().eq(index).show().siblings().hide();
          });
     }

    $(function(){
        $('.zt_tab li:first').addClass('current');
         $('.courseCon_list .courseCon_repeat:first').css('display','block');
         tabszt(".zt_tab","current",".courseCon_list");
         tabszt(".coures_title_info","current",".ui_scrolls_assign_live");
     //选择课程
        $('body').on('click', '.courseCon_list .course_item', function(event) {
                var that = $(this);
                var cur = that.hasClass('currentItem');
                var curid = that.data('id');
                var curm = that.data('money');
                var curtit = that.find('.course_title a').text();
                var curname = that.find('.course_info span a').text();
                var _html = '<div class="course_list_repeat" data-id="'+curid+'">'
                                + '<p>课程名称：<em>'+curtit+'</em></p>'
                                +  '<p>课程老师：<em>'+curname+'</em></p>'
                                + '<p>课程优惠价：<strong class="">'+curm+'</strong>元</p>'
                                //+ '<a href="javascript:void(0);" class="closest">删除</a>'
                                + '</div>';
              if (cur == false) {
                                that.addClass('currentItem');
                                $(_html).appendTo('#repeat_course');
                                if ($('.course_list_repeat').length > 0) {
                                    $('.course_error_tips').hide();
                                };
                                  var users = [];
                                  $('.course_list_repeat').each(function(index, el) {
                                         users.push(encodeURIComponent($(this).data('id')));
                                 });
                                $('#course_price').val(users);
              }else{
                //删除课程
                        var ide =that.data('id');
                        $('.course_list_repeat').each(function(index, el) {
                              var ids = $(this).data('id'); 
                              if(ide == ids){
                                    $(this).remove();
                                    that.removeClass('currentItem');
                                } 

                         });
                        var num =  $('#course_price').val();
                        $('#course_price').val(num.replace(ide,''));
                         if ($('.course_list_repeat').length < 1) {
                              $('.course_error_tips').show();
                         };
              }
        });

    });