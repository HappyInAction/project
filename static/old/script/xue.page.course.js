/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-14 09:53:41
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name xue.page.course.js
 * @description 听课页交互
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */
$(function(){
    
    var briefTab = $('.list_title_info li');
    var briefBox = $('.scrolls_item');

    // 滚动条用的
    // var outline = { 0 : null, 1 : null };

    // 大概切换效果
    xue.briefToggle = function(index){
        var index = index || 1;
        $('#outline'+index).removeClass('hidden').siblings('.scrolls_item').addClass('hidden');
        briefTab.eq(index-1).addClass('current').siblings('li').removeClass('current');
        // 切换大纲的时候需要重新计算下隐藏部分的高度
        $('#outline1').jScrollPane();
        $('#outline2').jScrollPane();
     }
    // 大纲头部绑定切换效果
    briefTab.off('click', 'a').on('click', 'a', function(){
        var _tab = $(this).parent('li'), 
            _index = briefTab.index(_tab[0]);
           // xue.log(_index+1);
        xue.briefToggle(_index+1);
    });
    // 当前讲点击时的大纲切换
    $('.scrolls_con_list').off('click', 'li').on('click', 'li', function(){
        if($(this).hasClass('current')){
            var _this = $(this).parents('.scrolls_item')[0];
            var _eq = briefBox.index(_this);
            xue.briefToggle(_eq);
        }
    });
    var course_tab = $('#course_tab');
    if(course_tab.length > 0){
        xue.tabs('course_tab', function(d){
            var index = $(d).index();
            var box = $('#course_info_box .course_detail');
            box.hide()
            box.eq(index).show();
            box.eq(index).find('textarea').trigger('focus');
        });
    }
});


//发布看点
var $btnSub = $('#btnSubmitFocus');
var $one = $('.lookFocusShow');
var $two = $('.lookFocusPush');
function FocusPushItem(){
    if ($btnSub.hasClass('btn_disabled')) {
        return false;
    }else{
        $one.hide();
        $two.show();  
        $btnSub.hide(); 
    }
}
//转换时间
 function formatTime(s) {
      var t;
      if (s > -1) {
        hour = Math.floor(s / 3600);
        min = Math.floor(s / 60) % 60;
        sec = s % 60;
        day = parseInt(hour / 24);
        if (day > 0) {
          hour = hour - 24 * day;
          t = day + "day " + hour + ":";
        } else t = hour + ":";
        if (min < 10) {
          t += "0";
        }
        t += min + ":";
        if (sec < 10) {
          t += "0";
        }
        t += sec;
      }
      return t;
    }
//parameters:false/true关闭评论和显示评论接口
function showLookFocus(parameters){
  var that = $('.lookFocusItem');
   if (parameters !== 'ture') {
        that.hide();
   };
   if(parameters !== 'false'){
       that.show();
   };
  
}
function showTimeSubTitle(content,time_point,create_name,id){
  var $con =$('.focusCon'),
      $name = $con.find('.name'),
      $text = $con.find('.text'),
      $reply = $con.find('a.js_reply');
       $name.text(create_name);
       $('<em>：</em>').appendTo($name)
       $text.html(content);
        setTimeout(function() {
           $name.empty();
           $text.empty();
           $reply.hide();
        }, 4600);
    if ($('.focusCon .text').text().length > 0) {
        $reply.show();
    } else {
        $reply.hide();
    }
  //回复
  $('body').on('click', '.js_reply', function() {
      FocusPushItem();
      var c = formatTime(time_point);
      $('.lookFocusPush').find('.timeEnd').text('0'+c).attr('alt',time_point);
      $con.attr('alt',id);
  });  
}
//发布评价
$('body').on('click', '#btnSubmitFocus', function() {
    FocusPushItem()
    var a = $('#EncryptPlayer')[0];
    var b = a.videoPlayingTime();
    var c = formatTime(b);
    $('.lookFocusPush').find('.timeEnd').text('0'+c).attr('alt',b);
    $('.focusCon').removeAttr('alt');
});
$('body').on('mouseenter','#btnSubmitFocus',function() {
    var that = $(this),
        _left = that.offset().left + (that.width() / 2),
        _top = that.offset().top + that.height(),
        _html = $('.contentTxt').html();
     xue.win({
            id : 'focusTips',
            title : false,
            arrow : 'bl',
            follow : that,
            content : _html,
            lock : false,
            close : false,
            submit : false,
            cancel : false
        });
      var _tips = $('#xuebox_focusTips');
        _tips.css({
            'position': 'absolute'
        });
        // 设置弹窗定位
        xue.win('focusTips').position(_left - (_tips.width() / 3), _top - 100);

});
$('body').on('mouseleave', '#btnSubmitFocus', function(){
        if($('#xuebox_focusTips').length > 0){
             xue.win('focusTips').close();
        }
    });

//取消发布
$('body').on('click', '.lookFocusPush .btn_cancel', function() {
     $btnSub.show(); 
     $one.show();
     $two .hide();  
});

//提交 
$('body').on('click', '.lookFocusPush .btn_submit', function(event) {
    var that = $(this);
    var _con = $.trim(that.prev('input.inputText').val());
    var _len =_con.length;
    var _err = $('.errorTips');
    function tipsErr(){
        setTimeout(function() {
           _err.hide();
        }, 3000);
    }
     if (_len == 0) {
            _err.show().text('少年,什么也不写无法发布哦！');
            tipsErr();
            return false;
      }
      if (_len <= 4) {
            _err.show().text('少年,请至少输入5个字哦！');
            tipsErr();
            return false;
      }
      if (_len > 40) {
            _err.show().text('少年,请不要超过40个字哦！');
            tipsErr();
            return false;
      }
      var $mask = $('<div class="form_submiting"></div>');
       $mask.css({
              width : that.outerWidth(),
              height: that.outerHeight(),
              left  : that.offset().left,
              top  : that.offset().top,
              background : '#fcfcfc',
              opacity : 0.3,
              filter : 'alpha(opacity=30)',
              zIndex:100000
          });
       if($('.form_submiting').length !== 0){
            $mask.prependTo('body');
        }
        //通过验证以后，使用ajax进行提交数据，成功后返回
        if (_con !== '请输入看点，(5-40个字)') {
                  ajaxHighlight();
        }else{
           _err.show().text('少年,什么也不写无法发布哦！');
            tipsErr();
            return false;
        };
});


