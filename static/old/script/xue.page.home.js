/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-14 10:27:32
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name xue.page.home.js
 * @description 学习中心全局交互
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */

$(function(){
       // 绑定收藏事件
    $('.layout_body').off('click', '.feed_btn_fav.fav_add').on('click', '.feed_btn_fav.fav_add', function(){
        var d = $(this).data();
        var that = $(this);
        var url = window.location.hostname == 'v04.xesui.com' ? '../json/fav.json' : '/Homes/ajaxAddCollect';

        if(!d.params){ return; }
        that.removeClass('fav_add');

        $.ajax({
            url: url,
            data:d.params,
            type : 'POST',
            dataType:'json',
            success:function(result){
                var msg = xue.ajaxCheck.JSON(result);
                if(msg){
                    xue.poptips('收藏成功', that, true);

                    var re = /\(([^\(]*)\)/;
                    var countbox = that.next('strong');
                    if(countbox.length > 0){
                        //获取原来的内容
                        var oldtext = countbox.html();

                        // 获取括号内的数字，进行累加
                        var text = oldtext.match(re);
                        var num = Number(text[1]);
                        num++;
                    }
                    //

                    // 替换原来括号中的数字为累加后的数字
                    // var newtext = '取消收藏 <strong>(' + num + ')</strong>';

                    setTimeout(function(){
                        that.html('取消收藏');
                        if(countbox.length > 0){
                            that.next().html('(' + num + ')');
                        }

                        that.addClass('fav_end');
                    }, 1000);
                    
                }else{
                    that.addClass('fav_add');
                    return ;
                }
            }
        });
    });

    // 绑定取消收藏事件
    $('.layout_body').off('click', '.feed_btn_fav.fav_end').on('click', '.feed_btn_fav.fav_end', function(){

        var d = $(this).data();
        var that = $(this);
        var url = window.location.hostname == 'v04.xesui.com' ? '../json/fav.json' : '/Homes/ajaxCancelCollect';

        if(!d.params){ return; }
        that.removeClass('fav_end');

        $.ajax({
            url: url,
            data:d.params,
            type : 'POST',
            dataType:'json',
            success:function(result){
                var msg = xue.ajaxCheck.JSON(result);
                if(msg){
                    xue.poptips('已取消', that, true);

                    var re = /\(([^\(]*)\)/;
                    var countbox = that.next('strong');
                    if(countbox.length > 0){
                        //获取原来的内容
                        var oldtext = that.next().html();

                        // 获取括号内的数字，进行累加
                        var text = oldtext.match(re);
                        var num = Number(text[1]);
                        if(num > 0){ num--; }
                    }
                    // 替换原来括号中的数字为累加后的数字
                    setTimeout(function(){
                        that.html('收藏');
                        if(countbox.length > 0){
                            that.next('strong').html('(' + num + ')');
                        }
                        that.addClass('fav_add');
                    }, 1000);
                    
                }else{
                    that.addClass('fav_end');
                    return ;
                }
            }
        });
    });

    /**
     * 评论相关
     */
    
    // 切换评论区域
    $('.layout_body').off('click', '.feed_btn_comment').on('click', '.feed_btn_comment', function(){
        var that = $(this);
        if(that.data('type') && that.data('type') == 2){
            return ;
        }
        xue.use('comment', function(){
            xue.comment.toggle(that);
        });
    });
    // 评论关闭按钮
    $('.layout_body').off('click', '.comment_close').on('click', '.comment_close', function(){
        var that = $(this);
        xue.comment.close(that);
    });

    // 提交评论
    $('.layout_body').off('click', '.feed_comment:visible .comment_form .btn_submit').on('click', '.feed_comment:visible .comment_form .btn_submit', function(){
        var that = $(this);

        var _data = that.parents('.feed_comment').prev('.feed_bar').find('.feed_btn_comment');
        var _id =_data.data('id');
        var _ty =_data.data('codetype');
        var _par = _data.data('params');
     
        var _textarea =that.parents('.comment_func').prev('.comment_textarea:eq(0)').find('textarea').val();
        var _content = $.trim(_textarea);
        var _len = _content.length;
        var _err = that.parents('.comment_button').prev('.comment_tips').eq(0);
       
        if (_len == 0) {
           //alert(1)
            _err.text('请您填写内容');
        } else if (_len > 140) {
            _err.text('请不要超过140个字');
        } else {
            _err.empty();
        }
        if (_err.text() == '') {
            $.ajax({
                url: '/Homes/ajaxCheckVerCode',
                type: 'POST',
                dataType: 'JSON',
                data: _par + '&codetype='+_ty,
                //要传递的数值
                 success: function(result) {
                    var _tp = result.sign,
                            _msg = result.msg;
                       if (_tp === 2) {//跳转地址
                              window.location.href = result.msg;
                               return false;
                        }
                       if (_tp === 0) {//错误提醒
                              alert(_msg);
                              that.parents('.ui_feed').find('.text_num').text(140)
                              return false;
                        }
                        if (_tp === 1) {//不弹层直接提交
                            //alert(1);
                            xue.use('comment', function(){
                                xue.comment.post(that);
                            });
                        }
                         if (_tp === 3) {//弹验证码提示框
                            xueVerificationCode();//弹层
                            changeVerificationImg('verificationImg');//验证码
                            $('body').on('click' , '#xuebox_winCode .comments_medal_button .btn' , function(){
                                var vd = $('#verificationCode').val();
                                var _show = $('#tips_verificationCode');
                                if(vd == ''){
                                    _show.text('请输入验证码');
                                    $('#verificationCode').focus();
                                    return false;
                                }
                                if(!/^[a-zA-Z0-9]{4,4}$/.test(vd)){
                                    _show.text('验证码错误，请重新输入');
                                    $('#verificationCode').focus();
                                    return false;
                                }
                                if($(this).hasClass('btn_visible')){
                                    return false;
                                }
                                xue.use('comment', function(){
                                  xue.comment.post(that);
                                });
                            }); 
                        }
                       // that.parents('.ui_feed').find('.text_num').text(140) 
                 }
            });
        }
        
       
    });
    // 计算评论字数
    $('.layout_body').off('keyup', '.comment_textarea textarea').on('keyup', '.comment_textarea textarea', function(){
        var that = $(this);
        xue.use('comment', function(){
            setTimeout(function(){
                xue.comment.countsize(that);
            }, 10);
        });
    });

    $('.layout_body').off('keydown', '.comment_textarea textarea').on('keydown', '.comment_textarea textarea', function(e){
        var that = $(this);
        xue.use('comment', function(){
            if(e.ctrlKey && e.keyCode === 13){
                xue.comment.post(that);
            }
        });
    });

    // 动态大小图切换
    $('.layout').off('click', '.feed_media .media_item').on('click', '.feed_media .media_item', function(){
        var that = $(this);
        xue.use('feed', function(){
            xue.feed.img.toggle(that);
        });
    });

    // 动态中点击“作答”切换做题效果
    $('.layout').off('click', '.feed_btn_answer').on('click', '.feed_btn_answer', function(){
        var that = $(this), wrap = that.parent().parent().parent().prev('.feed_media_extend'), item = wrap.find('.extend_item');
        item.toggle();
         if(item.hasClass('extend_img_big')){
                item.find('.sign-remove').remove();
            }
    });


    // 动态试题切换
    $('.layout').on('click', '.extend_item', function(e){
        var that = $(this);
        if($(e.target).data('type') == 'radio'){
            return false;
        }else{
            that.hide().siblings('.extend_item').show();
            if(that.hasClass('extend_img_big')){
                that.find('.sign-remove').remove();
            }
        }
    });

    // 动态试题：提交答案
    $('.layout').off('click', '.extend_img_big .big_answer a[data-type="radio"]').on('click', '.extend_img_big .big_answer a[data-type="radio"]', function(){
        var that = this;
        xue.use('feed', function(){
            xue.feed.extend.answerSubmit(that);
        });
    });






    // 每日五题领奖
    // $('.task_con_items').off('click', '.btn_task').on('click', '.btn_task', function(){
    //     var that = this;
    //     xue.use('feed', function(){
    //         xue.feed.extend.fiveQuestionSubmit(that);
    //     });
    // });

    // 每日五题：个人中心
    // $('#container').off('mouseenter', '.daily_task_items').on('mouseenter', '.daily_task_items', function(){
    //     var that = $(this);

    //     if(that.find('.btn_task').length === 0 && that.find('span.finish').length === 0){ return false; }
    //     xue.use('feed', function(){
    //         xue.feed.extend.fiveQuestionTips(that);
    //     });
    // });

    // 每日五题：点击显示功能提示弹层
    // xue.log($('.task_con_items').find('.btn_task').length === 0  $('.task_con_items').find('span.finish').length === 0);
    // if($('.task_con_items').find('.btn_task').length === 0 && $('.task_con_items').find('span.finish').length === 0){
    //     $('.task_con_items').on('click', function(){
    //         var that = $(this);
    //         if(that.find('.btn_task').length > 0 || that.find('span.finish').length > 0){ return false; }
    //         xue.win({
    //             id : 'fiveQuestions',
    //             title : false,
    //             cancel : false,
    //             submitVal : '去看看',
    //             padding : '10px 10px 0 10px',
    //             content : '<img src="http://img04.xesimg.com/tips_five.jpg" />',
    //             submit : function(){
    //                 window.location.href = '/LearningCenter/dynamic';
    //             }
    //         });
    //     });
    // }
    

    // 发布活动/动态里面的选择上传图片
    $('.layout').off('change', '.ui_comment_event .comment_files').on('change', '.ui_comment_event .comment_files', function(){
        var that = this;
        xue.use('feed', function(){
            xue.feed.upload.chooseFile(that);
        });
    });


    //发布动态
    $('.layout').off('click', '.ui_comment_event .btn_submit').on('click', '.ui_comment_event .btn_submit', function(){
        var that = this;
        var feed_form = $(that).parents('form.comment_form');
        xue.use('feed', function(){
            xue.feed.post.submit(feed_form);
        });
    });
    

    // 绑定系统通知关闭事件
    $('.layout').off('click', '.ui_tips .close').on('click', '.ui_tips .close', function(){
        var that = $(this);
        var item = that.parents('.tips');
        var next = item.next();
        
        item.fadeOut(function(){
            if(next.length === 0){ return false; }
            next.show();
        });

    });

    // 金币换礼
    // $('.layout').off('mouseover', '.gift-item img').on('mouseover', '.gift-item img', function(){
    //     var that = $(this).parents('.gift-item'),
    //         html = that.find('dl.biggift').clone(),
    //         wrap = $('<div></div>');
    //         html.show();
    //         wrap.html(html);

    //     var size = {
    //         w : that.outerWidth(),
    //         h : that.outerHeight(),
    //         l : that.offset().left,
    //         t : that.offset().top
    //     };
    //     var left = Number(size.l + size.w) > Number($(window).width() / 2) ? (size.l - size.w - 170) : (size.l + size.w);
    //     var arrow = Number(size.l + size.w) > Number($(window).width() / 2) ? 'rt' : 'lt';

    //     var opt = {
    //         id    : 'gift',
    //         cls   : 'dialog_gift',
    //         title : false,
    //         close : false,
    //         submit: false,
    //         cancel: false,
    //         lock  : false,
    //         left  : left,
    //         top   : size.t,
    //         arrow : arrow,
    //         content : wrap.html()
    //     };
    //     xue.win(opt);

    //     if(xue.isIE6){
    //         $('.dialog_gift').find('.dialog_arrow').height($('.dialog_gift').height());
    //     }

    //     $(this).on('mouseout', function(){
    //         xue.win('gift').close();
    //     });

    // });


    // 评论的回复以及删除评论
    $('.layout_body').on('click', '.comment_list .feed_bar a', function(){
        var that=$(this);
        if(!that.hasClass('del_msg')){
            xue.comment.replyToggle(this);
        }
    });


    $('.layout_body').on('click', '.feed_comment:visible .comment_list .btn_submit', function(){
        var that = $(this);
        var _data = that.parents('.feed_comment').prev('.feed_bar').find('.feed_btn_comment');
        var _id =_data.data('id');
        var _ty =_data.data('codetype');
        var _par = _data.data('params');
        
        var _textarea = that.parents('.mention_func').prev('.mention_textarea:eq(0)').find('textarea').val();
        var _content = $.trim(_textarea);
        var _len = _content.length;
        var _err = that.parents('.mention_func').find('.comment_tips').eq(0);
       //xue.log(_id);
        if (_len == 0) {
           //alert(1)
            _err.text('请您填写内容');
        } else if (_len > 140) {
            _err.text('请不要超过140个字');
        } else {
            _err.empty();
        }
        if (_err.text() == '') {
            $.ajax({
                url: '/Homes/ajaxCheckVerCode',
                type: 'POST',
                dataType: 'JSON',
                data: _par + '&codetype='+_ty,//要传递的数值
                 success: function(result) {
                    var _tp = result.sign,
                            _msg = result.msg;
                       if (_tp === 2) {//跳转地址
                              window.location.href = result.msg;
                               return false;
                        }
                       if (_tp === 0) {//错误提醒
                              alert(_msg);
                              that.parents('.ui_feed').find('.text_num').text(140)
                              return false;
                        }
                        if (_tp === 1) {//不弹层直接提交
                           xue.comment.reply(that);
                        }
                         if (_tp === 3) {//弹验证码提示框
                            xueVerificationCodeCopy();//弹层
                            changeVerificationImg('verificationImg');//验证码
                            $('body').on('click' , '#xuebox_winCodeCopy .comments_medal_button .btn' , function(){
                                var vd = $('#verificationCode').val();
                                var _show = $('#tips_verificationCode');
                                if(vd == ''){
                                    _show.text('请输入验证码');
                                     $('#verificationCode').focus();
                                    return false;
                                }
                                if(!/^[a-zA-Z0-9]{4,4}$/.test(vd)){
                                    _show.text('验证码有误,请重新输入');
                                     $('#verificationCode').focus();
                                    return false;
                                }
                                if($(this).hasClass('btn_visible')){
                                    return false;
                                }
                                xue.use('comment', function(){
                                 xue.comment.reply(that);
                                });
                            }); 
                        }
                        // that.parents('.ui_feed').find('.text_num').text(140)
                 }
            });
        }
        
    });

    // 学习小组

//    $('.layout').on('mouseenter', '.group_link1', function(){
//
//        var that = $(this), con = that.nextAll('.lubo_list').html();
//        xue.win({
//            id : 'luboList',
//            title : false,
//            arrow : 'bc',
//            follow : that,
//            content : '<div class="lubo_list"> ' + con + '</div>',
//            lock : false,
//            close : false,
//            submit : false,
//            cancel : false
//        });
//        var box = $('#xuebox_luboList'),
//        size = xue.win('luboList').getSize(),
//        o = {
//            left : that.offset().left + (that.width() / 2) - (size.width / 2),
//            top : that.offset().top - box.height() -20
//        };
//        xue.win('luboList').position(o.left, o.top);
//        $(this).on('mouseleave', function(e){
//            if($(e.relatedTarget).attr('id') != 'xuebox_luboList' && $(e.relatedTarget).parents('#xuebox_luboList').length === 0){
//                xue.win('luboList').close();
//            }
//        });
//        $('#xuebox_luboList').on('mouseleave', function(){
//            xue.win('luboList').close();
//        });
//    });




//    $('.layout').on('mouseenter', '.learn_group .group_link2', function(){
//
//        var that = $(this), con = that.nextAll('.group_tips').html();
//        xue.win({
//            id : 'groupTips',
//            title : false,
//            arrow : 'bc',
//            follow : that,
//            content : '<div class="group_tips"> ' + con + '</div>',
//            lock : false,
//            close : false,
//            submit : false,
//            cancel : false
//        });
//        var box = $('#xuebox_groupTips'),
//            size = xue.win('groupTips').getSize(),
//            o = {
//            left : that.offset().left + (that.width() / 2) - (size.width / 2),
//            top : that.offset().top - box.height() -20
//        };
//        xue.win('groupTips').position(o.left, o.top);
//        $(this).on('mouseleave', function(e){
//            if($(e.relatedTarget).attr('id') != 'xuebox_groupTips' && $(e.relatedTarget).parents('#xuebox_groupTips').length === 0){
//                xue.win('groupTips').close();
//            }
//        });
//        $('#xuebox_groupTips').on('mouseleave', function(){
//            xue.win('groupTips').close();
//        });
//    });

    //学习小组 点击效果
     $('body').on('click', '.direct_guidance', function(event) {
                var that = $(this);
                var par = that.parents('.course_item');
                var index = that.index();
                that.addClass('current').siblings().removeClass('current');
               par.next('.nav_top_chapter').children().eq(index).show().siblings().hide();
    });
   
    // 考试
    // $('.layout').on('mouseenter', '.learn_exam .group_link', function(){

    //     var that = $(this), con = that.next('.group_tip').html();
    //     xue.win({
    //         id : 'examTips',
    //         title : false,
    //         arrow : 'tc',
    //         follow : that,
    //         content : '<div class="group_tip"> ' + con + '</div>',
    //         lock : false,
    //         close : false,
    //         submit : false,
    //         cancel : false
    //     });
    //     var box = $('#xuebox_examTips'),
    //         size = xue.win('examTips').getSize(),
    //         o = {
    //         left : that.offset().left + (that.width() / 2) - (size.width / 2),
    //         top : that.offset().top + that.height() + 10
    //     };
    //     xue.win('examTips').position(o.left, o.top);
    //     $(this).on('mouseleave', function(e){
    //         if($(e.relatedTarget).attr('id') != 'xuebox_gexamTips' && $(e.relatedTarget).parents('#xuebox_examTips').length === 0){
    //             xue.win('examTips').close();
    //         }
    //     });
    //     $('#xuebox_examTips').on('mouseleave', function(){
    //         xue.win('examTips').close();
    //     });
    // });


    //家长群
     $('.layout').on('mouseenter', '.parents_group .group_link', function(){

        var that = $(this), con = that.next('.group_tip').html();
        xue.win({
            id : 'examTips',
            title : false,
            arrow : 'tc',
            follow : that,
            content : '<div class="group_tip"> ' + con + '</div>',
            lock : false,
            close : false,
            submit : false,
            cancel : false,
            width:295
        });
        var box = $('#xuebox_examTips'),
            size = xue.win('examTips').getSize(),
            o = {
            left : that.offset().left + (that.width() / 2) - (size.width / 2),
            top : that.offset().top + that.height() + 10
        };
        xue.win('examTips').position(o.left, o.top);
        $(this).on('mouseleave', function(e){
            if($(e.relatedTarget).attr('id') != 'xuebox_gexamTips' && $(e.relatedTarget).parents('#xuebox_examTips').length === 0){
                xue.win('examTips').close();
            }
        });
        $('#xuebox_examTips').on('mouseleave', function(){
            xue.win('examTips').close();
        });
    });


    // 请假提示
    $('body').off('mouseenter', '.leave_tips').on('mouseenter', '.leave_tips', function(){
        var that = $(this),
            _left = that.offset().left + (that.width() / 2),
            _top = that.offset().top + that.height();
        var _con = '如果您短时间内无法学习该课程，为了让您<br />以后可以继续学习，您可以选择请假功能将<br />您的课程暂时冻结。这样您所学的该课程有<br />效期会从您的冻结时间开始往后顺延。';
        xue.win({
            id: 'signTips_leave',
            cls: 'signTips',
            title: false,
            cancel: false,
            submit: false,
            arrow: 'tc',
            close: false,
            lock: false,
            follow: that,
            content: _con
        });
        var _tips = $('#xuebox_signTips_leave');
        _tips.css({
            'position': 'absolute'
        });

        // 设置弹窗定位
        xue.win('signTips_leave').position(_left - (_tips.width() / 2), _top + 10);
    });
    $('body').off('mouseout', '.leave_tips').on('mouseout', '.leave_tips', function(){
        if($('#xuebox_signTips_leave').length > 0){
            xue.win('signTips_leave').close();
        }
    });


});




//新鲜事加视频
function videoThumb (f1) {//点击缩略图展开成视频
    var con = $(f1).parents(".feed_media_video");
    con.next().show();//视频显示
    con.hide();//图隐藏
    var url = con.next().data('url');
    var tl ='<div class="video_expand_box">'
        + '<p class="retract"><a href="javascript:void(0);">收起</a></p>'
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
    con.next().html(tl);
}
function videoHide (f2) {//点击收起，视频隐藏，缩略图显示
    var con = $(f2).parents(".feed_video_expand");
    con.hide();
    con.prev().show();
    con.find(".video_expand_box").remove();
} 
$(function(){
    $('.layout_body').off('click', '.video_item_small').on('click', '.video_item_small', function(){
        videoThumb(this);
    });
   
    $('.layout_body').off('click', '.retract a').on('click', '.retract a', function(){
        videoHide(this);
    });
});
//学员勋章浮层 start
function studenShow (dom) {
       var _data = dom.data('target');
        var _tpl1 = $("#"+_data).html();
        xue.win({
            id: 'studenTips',
            cls: 'studenTips',
            width:320,
            title: false,
            cancel: false,
            submit: false,
            arrow: 'tl',
            close: false,
            lock: false,
            follow: dom,
            content: '<div class="studentMedal_tips"> ' + _tpl1 + '</div>'
        });
        // 设置弹窗定位
        xue.win('studenTips').position( dom.offset().left + dom.height() - 115, dom.offset().top + dom.height() + 7);
        var _tips = $('#xuebox_studenTips');
        _tips.css('position', 'absolute');
        
       
}
 $('#container').on('mouseenter', '.studentMedal li img[data-target*="hidediv_"]', function(){
        var that = $(this);
        studenShow(that); 
          $(this).on('mouseleave', function(e){
            if($(e.relatedTarget).attr('id') != 'xuebox_studenTips' && $(e.relatedTarget).parents('#xuebox_studenTips').length === 0){
                xue.win('studenTips').close();
            }
        });
        $('#xuebox_studenTips').on('mouseleave', function(){
            xue.win('studenTips').close();
        });
    });
//学员勋章浮层 end

//五条评论后出验证码弹出层
var _htmlCodeCopy ='<div class="pop_comments_medal">'
                +'   <div class="comments_medal_list">'
                +'        <span>您连续评论次数太多了，请输入验证码完成发布。</span>'
                +'    </div>'
                +'<div class="comments_medal_img">'
                +'      <span>验证码</span>'
                +'       <input type="text" name="verificationCode" class="yzm_kuang" id="verificationCode" maxlength="4" autocomplete="off">'
                +'       <span class="imgCodeWrap">'
                +'<img width="60" height="20" title="(看不清，换一张)" src="" alt="验证码" id="verificationImg">'
                +'      </span>'

                +'</div>'    
                +'<span id="tips_verificationCode" class="tips"></span>'
                +'<div class="comments_medal_button">'
                +'     <button class="btn btn_submit btn_sky">确定</button>'
                +'</div>'
         +'</div>';
function xueVerificationCode() {
    // body...评论弹层
        xue.win({
          id : 'winCode',           // 多个弹窗需要设置id
          title : '提示',        // 弹窗标题
          content : _htmlCodeCopy,         // 弹窗里面的内容
          lock:true,            // 背景遮罩
          width: 375,
          height : 155,
          submit : false,
          cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
          close : true          // 点击关闭时的事件
      });
     $("#verificationImg").click(function() {//点击验证码图片更换验证码
         changeVerificationImg("verificationImg");
     });
}
function xueVerificationCodeCopy() {
    // body...@回复弹层
        xue.win({
          id : 'winCodeCopy',           // 多个弹窗需要设置id
          title : '提示',        // 弹窗标题
          content : _htmlCodeCopy,         // 弹窗里面的内容
          lock:true,            // 背景遮罩
          width: 375,
          height : 155,
          submit : false,
          cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
          close : true          // 点击关闭时的事件
      });
     $("#verificationImg").click(function() {//点击验证码图片更换验证码
         changeVerificationImg("verificationImg");
     });

}
// 老师答疑方法
function xueTeacherAnswer(obj) {
    var teacherAnswer=$(obj).next(".teacherAnswer").html();
        xue.win({
          id : 'teacherAnswer',           // 多个弹窗需要设置id
          title : '老师答疑',        // 弹窗标题
          content : teacherAnswer,         // 弹窗里面的内容
          lock: true,            // 背景遮罩
          width: 610,
          height : 315,
          submit : false,
          cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
          close : true          // 点击关闭时的事件
      });

}
// 作业作文方法
function xueHomeworkAdWriting(obj) {
    // body...@回复弹层
    var homeWriting=$(obj).next(".homeWriting").html();
    //con='<h3 class="homework_title">本服务将于暑假前上线，敬请期待！</h3><p class="homework_para">下载学而思网校app拍照提交作业／作文，考核学习效果，聆听老师语音批改详解。<a href="http://www.xueersi.com/app" target="_blank">详细介绍&gt;&gt;</a></p><div class="pics_wrap"><div class="ecode_wrap"><img src="http://img04.xesimg.com/home_code.png" class="home_code"><a href="http://www.xueersi.com/app" class="">更多下载方式</a></div><img src="http://img04.xesimg.com/homewok_pic.png" class="homewok_pic"></div>'
        xue.win({
          id : 'homeWriting',           // 多个弹窗需要设置id
          title : '什么是作业作文服务？',        // 弹窗标题
          content : homeWriting,         // 弹窗里面的内容
          lock: true,            // 背景遮罩
          width: 695,
          height : 445,
          submit : false,
          cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
          close : true          // 点击关闭时的事件
      });

}
// 作业作文无广告方法
function xueHomeworkWriting() {
    // body...@回复弹层
    con = '<table cellpadding="0" cellspacing="0" class="homework_table"><tr><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td></tr><tr><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td></tr><tr><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td></tr><tr><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td><td><p>第1讲:计算机爱空间上的课教案和时间肯</p><p><a href="#">下载作文</a><a href="#">下载作业</a></p></td></tr></table>'
        xue.win({
          id : 'HomeworkWriting',           // 多个弹窗需要设置id
          title : '作业作文',        // 弹窗标题
          content : con,         // 弹窗里面的内容
          lock: true,            // 背景遮罩
          width: 685,
          submit : false,
          cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
          close : true          // 点击关闭时的事件
      });

}
//调用验证码
function changeVerificationImg(imgId) {
    $.ajax({
        url: '/Homes/ajaxGetVerCode',
        type: 'post',
        dataType: 'json',
        //data: {param1: 'value1'},
        success  : function(result){
            if(result.sign == 1){
              $('img[id="' + imgId + '"]').attr('src', result.msg);
            }
        }
    })
} 

                          


//评论发表情
$(function() {
     //插入光标处的插件
    $.fn.extend({  
        insertContent : function(myValue, t) {  
            var that = $(this);
            xue.use('comment', function(){
                setTimeout(function(){
                    xue.comment.countsize(that);
                }, 10);
            });
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
     //插入光标处的插件end 
    
//点击表情按钮，弹出表情浮层
     $('#container').on('click', '.J_smilies', function(event) {
         var that = $(this);
         var e = window.event || event;
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble = true;
            }  
         $.ajax({
                url: '/Homes/ajaxGetEmoList',
                type: 'post',
                dataType: 'html',
                data: {type: '1'},
                success  : function(d){
                   var resData = xue.ajaxCheck.HTML(d);
                    if(resData){
                         xue.win({
                            id : 'smilies',
                            title : false,
                            arrow : 'tl',
                            follow : that,
                            content : resData,
                            lock : false,
                            close : false,
                            submit : false,
                            cancel : false,
                            width:476
                        });
                        // 设置弹窗定位
                        xue.win('smilies').position( that.offset().left + that.height() - 25, that.offset().top + that.height() + 10);
                            var _tips = $('#xuebox_smilies');
                            _tips.css('position', 'absolute');
                                //选种表情图当前状态hover效果
                        $('.smilies_list li').hover(function() {
                            $(this).addClass('current');
                        }, function() {
                            $(this).removeClass('current');
                        });
                        //当前文本框
                        var obj = that.parents('.comment_func').prev('.comment_textarea').find('.face_textarea');
                                //点击表情插入文本框
                             $('.jsSmilies li').click(function() {
                                    var _text = $(this).data('action');
                                    obj.focus();
                                    obj.insertContent(_text);
                                    $(this).parents('#xuebox_smilies').hide();
                                })
                             //关闭表情层
                             $('.smilies_close').click(function() {
                                 $(this).parents('#xuebox_smilies').hide();
                             });
                             //tabs切换
                            function faceTabs(tabTit,on,tabCon){
                                $(tabTit).children().click(function(){
                                    $(this).addClass(on).siblings().removeClass(on);
                                    var index = $(tabTit).children().index(this);
                                    $(tabCon).children().eq(index).show().siblings().hide();
                                });
                            }
                         faceTabs(".smilies_tabs","current",".smilies_medal");//表情种类扩展接口tab切换
                         faceTabs(".smiliesPage","current",".smilies_con");//翻页


                    }
            }
        })
   });
     
     // 点击空白处表情框隐藏
    $(document.body).on('click',function(e){
             var  c = $(e.target).hasClass() === 'current';
             var  b = $(e.target).attr('id') == 'xuebox_smilies';
             var  a = $(e.target).parents('#xuebox_smilies').length !== 0;
            if (!c && !b && !a){
                //$('.J_smilies').removeClass('current');
                $('#xuebox_smilies').hide();
            }
        
        })
});


//学习计划状态提示
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

    $('.sp_con').on('mouseenter',  function(){
        var that = $(this),
        classname=that.attr('class'),
        classname=classname.replace(/sp_con\s/, '');
        //alert(typeof that.children().eq(0).attr('class'))
        studyPlanAlert(that,classname);  
    });



//删除评论&&新鲜事公共方法
function delComment(obj) {
    var removeBox = null,
        box = null;

    //检测传入删除节点是否为jQuery对象
    if (obj.removebox instanceof jQuery) {
        removebox = obj.removebox;
    }

    //检测传入点击节点是否为jQuery对象
    if (obj.clickbox instanceof jQuery) {
        box = obj.clickbox;
    }

    //确定-取消弹窗
    xue.win({
        id: 'del_msg',
        title: false,
        content: '<div style="text-align:center;font-size:14px;">' + obj.tips + '</div>',
        follow: box,
        padding: '25px 10px 10px',
        lock: false,
        arrow: 'bc',
        close: false,
        submit: function() { //确定回调ajax
            xue.win('del_msg').close();
            $.ajax({
                url: obj.url,
                type: 'POST',
                dataType: 'JSON',
                data: obj.data,
                success: function(result) {
                    var _sign = result.sign;
                    _msg = result.msg;
                    if (_sign === 1) {
                        obj.changebox.html(obj.con);
                        removebox.remove();
                        if(obj.type == 1){
                            var mod = obj.changebox.parents('.ui_feed').find('.comment_content');
                            xue.comment.get(obj.changebox)
                        }
                        return true;
                    }
                     if (_sign === 2) {//跳转地址
                              window.location.href = _msg;
                               return false;
                        }
                   alert(_msg);
                },
                error: function() {
                    alert('网络连接错误');
                }
            });
        },
        cancel: function() {
            xue.win('del_msg').close();
        }
    });

    //定位弹窗位置 
    var size = xue.win('del_msg').getSize(),
        o = {
            left: box.offset().left + (box.width() / 2) - (size.width / 2),
            top: box.offset().top + box.height() - 140
        };
    xue.win('del_msg').position(o.left, o.top);

}

 //删除评论&新鲜事
  $('.layout_body').on('click', 'a.del_msg', function() {
      var that = $(this);
      var is_sign = that.parent().siblings('.feed_btn_comment');
      var capsule = that.parent();
      var _data = capsule.data('params');
      
      //判断是评论框删除
      if (is_sign.length == 0) {
          var str = '你确定删除该评论吗';
          var com_mod = that.parents('.comment_list');
          var _url = capsule.data('url');
          var changebox = that.parents('.ui_feed').find('.feed_btn_comment').find('strong');
          var changecon = '(' +(/[0-9]+/g.exec(changebox.text()) - 1)  + ')';
          delComment({
              'type': 1,
              'clickbox': that,
              'removebox': com_mod,
              'url': _url,
              'data': _data,
              'tips': str,
              'changebox': changebox,
              'con': changecon
          });
      } else {
          //判断是新鲜事删除                                                          
          var str = '你确定删除该新鲜事吗';
          var con = that.parents('.ui_feed').find('.my_info').length == 0 ? '"抱歉，该新鲜事已被删除"' : 
          '<span style="color:#999;">发布了新鲜事</span><br>"抱歉，该新鲜事已被删除"';
          //var con = '<span style="color:#999;">发布了新鲜事</span><br>"抱歉，该新鲜事已被删除"';
          var com_mod = that.parents('.ui_feed').find('.my_info').length == 0 ? that.parents('.ui_feed').find('.feed_text') : 
          that.parents('.ui_feed').find('.my_info');
          var remove = that.parents('.ui_feed').find('.feed_bar p,.feed_comment,.feed_media');
          delComment({
              'type': 2,
              'clickbox': that,
              'changebox': com_mod,
              'url': '/Homes/ajaxDelDynamic',
              'data': _data,
              'tips': str,
              'con': con,
              'removebox': remove
          });
      }
  });

// 课程升级
function tabs(tabTit, on, tabCon){

    var items = $(tabTit).children();

    items.each(function(){
        var that = $(this),
        con  = $(tabCon).children(),
        index = that.index()
        // 改为鼠标移入后切换
        that.on('mouseenter', function(){
            that.addClass(on).siblings().removeClass(on);
            con.eq(index).show().siblings().hide();
        });
    });

}
// 课程升级弹窗
function xueCourseUpgrade () {
    var con=$(".xueCourse_wrap").html();
    xue.win({
          id : '',           // 多个弹窗需要设置id
          title : '课程升级',        // 弹窗标题
          content : con,         // 弹窗里面的内容
          lock: true,            // 背景遮罩
          width: 721,
          height : 335,
          submit : false,
          cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
          close : true          // 点击关闭时的事件
      });
    tabs(".promote_list","current",".dialog_content .elastic_laye_box");
    $(".upgrade_packages").on("click",".servevalueItem .servevalue",function(){
        var This=$(this);
        var serveValue = parseInt(This.find("b").text());//套餐价位
        var moreValue = parseInt($("#xuebox_content .more_value").text());//再支付价格
        if($(this).hasClass('current')){
            moreValue -= serveValue;
            $("#xuebox_content .more_value").text(moreValue);
            $(this).removeClass("current");  
        }else{
            moreValue += serveValue;
            $("#xuebox_content .more_value").text(moreValue);
            $(this).addClass("current");
        }
        $('.servevalue').each(function(){
            if($(".servevalue").hasClass("current")){
                $(".go_pay .btn_orange").attr('disabled',false).removeClass("unsubmit");
            }else{
                $(".go_pay .btn_orange").attr('disabled',true).addClass("unsubmit");
           } 
       })
    });

    // 课程升级去支付按钮
    $(".upgrade_packages .go_pay").on('click', 'a.btn_orange', function(){
        var selectItermId = '';
        var ItermArr = [];
        //获取每个服务包的id
        $(".servevalue.current a").each(function(){
            ItermArr.push($(this).attr('pkid'));
        });
        selectItermId = ItermArr.join(',');
        //获取每个课程的id
        _ty=$(".upgrade_packages").data("id")|| '';

        var _data =  selectItermId 

        if(_ty!=""){
            _data += '&' + _ty;
        }
        $.ajax({
            type: "POST",
            url: "",
            data: _data,
            success: function(d) {
                window.location.href=d.msg;
            },
            error: function() {
                alert('数据读取错误,请重试...');
                return false;
            }
        });
    });
}

//更多直播场次

function meorLivePlayBack(tpe){
    var that = $(tpe);
    var _url = that.data('url');
    var params = that.data('params');
    $.ajax({
        url: _url,
        type: 'POST',
        dataType: 'html',
        data: params,
        success: function(d) {
             var con = xue.ajaxCheck.HTML(d);
               if(con){
                    xue.win({
                      id : 'meorLiveNum',           // 多个弹窗需要设置id
                      title : '更多直播场次和回放',  // 弹窗标题
                      content : con,         // 弹窗里面的内容
                      lock: true,            // 背景遮罩
                      width: 721,
                      height : 355,
                      submit : false,
                      cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
                      close : true          // 点击关闭时的事件
                  });
               }
        }
    });
}