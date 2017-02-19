/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-08 16:51:28
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name ui.examination.js
 * @description 这里是：考试、试卷的内容
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */


// 已做过的试题
var wrong_answer = {};
var wrong_info = $('.wrong_info');
var wrong_data = wrong_info.data();
var wrongbar = $('#wrong_progress');

$(function(){
    // 检查进度
    countWrongProgress();
    // 检查填空
    $('.answer[data-type="input"]').each(function(){
        checkInputOver(this);
    });

    $('.answer a.current').each(function(){
        var item = $(this).parents('.answer'), id = item.data('id');
        wrong_answer[id] = item;
    });
    // 检查进度
    countWrongProgress();

    if(wrong_info.length > 0){
        // 选择题点击
        $('.answer a').on('click', function(){
            var that = $(this), tp = that.data('type');
            if(that.length > 0){
                var item = that.parents('.answer'),
                    id = item.data('id');

                setTimeout(function(){
                    if(that.hasClass('current')){
                        wrong_answer[id] = item;
                    }else{
                        if(that.siblings('a.current').length > 0){
                            wrong_answer[id] = item;
                        }else{
                            if(wrong_answer[id]){
                                delete wrong_answer[id];
                            }
                        }
                    }
                    countWrongProgress();
                }, 0);
            }
        });

        


        $('.answer input').off('blur').on('blur', function(){
            var item = $(this).parents('.answer');
            checkInputOver(item);
        });        
    }
});

// 试卷信息滚动
if(wrong_info.length > 0){
    var wrong_info_top = wrong_info.offset().top, wrong_info_left= wrong_info.offset().left;
    $(window).scroll(function(){
        var wintop = $(this).scrollTop();
        if(wintop >= wrong_info_top){
            if($('.wrong_info_empty').length == 0){
                $('.student_overview').after('<div class="wrong_info_empty"></div>')
            }
            $('.wrong_info').css({
                width: '100%',
                top : 0,
                left: wrong_info_left,
                zIndex:10,
                // opacity:0.9,
                position:'fixed'
            });
        }else{
            $('.wrong_info_empty').remove();
            $('.wrong_info').removeAttr('style');
        }
    });
}



// 倒计时
if($('#wrong_remain').length > 0){


    xue.use('date', function(){
        var a = xue.date.timeRemain({
            time: wrong_data.time,
            expr: '#wrong_remain',
            stop: function(){
                var urlStr = wrong_data.url,
                    urlKey = wrong_data.key;
                if(urlStr && urlKey){
                    xue.win({
                        id: 'wrong_submit',
                        title: false,
                        content : '时间已到，系统将自动提交您的试卷',
                        close: false,
                        submit: false,
                        cancel : false,
                        lock : true
                    });
                    setTimeout(function(){
                        ajaxMonthlyExamSubmit( urlStr, urlKey, true);
                    }, 1000);
                }else{
                    return;
                }
            }

        }).start();
        var b = xue.date.timeCount({
            time: wrong_data.time,
            expr: '#wrong_used',
            stop: true
        }).start();
    }); 
}

// 进度条

function countWrongProgress(data){

    var answer = wrong_answer, arr = [], len = 0;
    $.each(answer,function(){
        len++;
    });

    var all = Number(wrong_info.data('questions'));
    var pro = 0;
    len = len < all ? len : all;
    pro = pro < 100 ? Math.round(len/all * 100) : 100;

    var box = $('.pro_bar_bg'),
        txt = $('.pro_bar_text');
    box.width((pro - 1)+'%');
    txt.text(pro+'%');
    if(pro > 54){
        txt.css('color', '#FFF');
    }else{
        txt.removeAttr('style');
    }
}
// 检查填空题是否完成
function checkInputOver( wrap ){
    var item = $(wrap), id = item.data('id');

    var inputs = item.find('input'), err = 0;

    inputs.each(function(){
        var val = $.trim($(this).val());
        if(val.length == 0){
            err++
        }
    });
    if(err == 0){
        wrong_answer[id] = item;
    }else{
        if(wrong_answer[id]){
            delete wrong_answer[id];                
        }
    }
    countWrongProgress();
}