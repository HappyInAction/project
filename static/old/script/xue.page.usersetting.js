/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-17 13:39:17
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name 
 * @description 
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */

$(function(){

    // 金币换礼
    $('.layout').off('mouseover', '.gift-item img').on('mouseover', '.gift-item img', function(){
        var that = $(this).parents('.gift-item'),
            html = that.find('dl.biggift').clone(),
            wrap = $('<div></div>');
            html.show();
            wrap.html(html);

        var size = {
            w : that.outerWidth(),
            h : that.outerHeight(),
            l : that.offset().left,
            t : that.offset().top
        };
        var left = Number(size.l + size.w) > Number($(window).width() / 2) ? (size.l - size.w - 170) : (size.l + size.w);
        var arrow = Number(size.l + size.w) > Number($(window).width() / 2) ? 'rt' : 'lt';

        var opt = {
            id    : 'gift',
            cls   : 'dialog_gift',
            title : false,
            close : false,
            submit: false,
            cancel: false,
            lock  : false,
            left  : left,
            top   : size.t,
            arrow : arrow,
            content : wrap.html()
        };

        xue.win(opt);

        if(xue.isIE6){
            $('.dialog_gift').find('.dialog_arrow').height($('.dialog_gift').height());
        }

        $(this).on('mouseout', function(){
            xue.win('gift').close();
        });

    });

    // $('.coin_deal').on('click', function(){
    //     xue.alert('adfafas');
    // });
    if($("div#avatars_list dl").length <= 3){
        $("span.next,span.prev").hide();
    }else{
        $("span.next,span.prev").show();
    }
    $("#avatarList span.next").on('click', function(){
        var content = $("div#avatars");   
        var content_list = $("div#avatars_list");
        var items = content_list.find('dl');
        if(items.length < 3){ return false; }
        //$(this).removeClass('nextdisable');
        //$('span.prev').addClass('prevdisable');
        var v_width = content.width();   
        var len = content.find("dl").length; 
        if( !content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画  
           content_list.animate({ left : '-='+v_width }, "slow", function(){
                items.slice(0, 3).appendTo($(this));
                content_list.css('left',0);
           });  
        }  
    });  
    //往前按钮  
    $("#avatarList span.prev").on('click', function(){
        
        var content = $("div#avatars");   
        var content_list = $("div#avatars_list");  
        var items = content_list.find('dl');
        
        if(items.length < 3){ return false; }

        //$(this).removeClass('prevdisable');
        //$('span.next').addClass('nextdisable');
        var v_width = content.width();  
        var len = content.find("dl").length;  
        // var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数  
        if(!content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画  
            items.slice(-3).prependTo(content_list);
            content_list.css({
                left: -493
            }).animate({ left : '+='+v_width}, "slow", function(){
                content_list.css('left',0);
            });  
        }  
    });
});