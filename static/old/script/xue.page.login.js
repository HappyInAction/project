/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-25 10:54:18
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
    $('body').off('click', '.error_close').on('click', '.error_close', function(){
        $('#login_error').hide();
    });
});


xue.formCheck = xue.formCheck || {};

(function(){
    var f = xue.formCheck;

    f.box = {
        form       : '#form_register',
        username   : '#username',
        password   : '#password',
        repassword : '#repassword',
        phone      : '#phone',
        phonecode  : '#phonecode',
        grade      : '#grade',
        username   : '#username'
    };

    f.disable = function( expr ){
        var btn = expr ? $(expr) : f.box.form.find('#form_submit, .btn_submit');
        
        var mask = $('<div class="form_submiting"></div>');
        mask.css({
            width : btn.outerWidth(),
            height: btn.outerHeight(),
            left  : btn.offset().left,
            top  : btn.offset().top,
            background : '#fff',
            opacity : 0.3,
            zIndex:100000
        });

        if($('.form_submiting').length == 0){
            mask.prependTo('body');
        }

        btn.addClass('btn_disable');
    };

    f.enable = function(){
        f.box.form.find('#form_submit, .btn_submit').removeClass('btn_disable');
        $('.form_submiting').remove();
    };

    f.isError = function(){
        var form = $(f.box.form), error = form.find('.error');
        if(error.length == 0){
            f.enable();
            return false;
        }else{
            f.disable();
            return true;
        }
    };
    f.username = function( val, fn ){
        var box = $(f.box.username), val = box.val(), id = box.attr('id');
        f.box.form = box.parents('form');
        if(val == ''){
            f.setTips(id, '用户名不能为空');
        }else{
            var isEmail = f.email();
            if(isEmail){
                if(val.length > 30){
                    f.setTips(id, '邮箱地址请控制在30个字以内');
                }else{
                    f.clearTips(id);
                    if(fn && typeof fn == 'function'){
                        fn();
                    }
                }
            }
        }
        return this;
    };

    f.email = function(){
        var reg = /^\w+([\.\-]\w+)*\@\w+([\.\-]\w+)*\.\w+$/;
        var box = $(f.box.username), val = box.val(), id = box.attr('id');
        f.box.form = box.parents('form');
        
        if(reg.test(val)){
            f.clearTips(id);
            return true;
        }else{
            f.setTips(id, '请输入正确的邮箱地址');
            return false;
        }
    };

    f.password = function(){
        var box = $(f.box.password), id = box.attr('id');
        var usr = $(f.box.username);
        var pv = $.trim(box.val()), uv = $.trim(usr.val());
        f.box.form = box.parents('form');

        // f.setTips('password', '', '');
        if(pv == ''){
            f.setTips(id, '密码不能为空');
        }else{
            if(pv == uv){
                f.setTips(id, '密码不能与用户名相同');
                return this;
            }
            if(pv.length < 6){
                f.setTips(id, '密码长度不能少于6个字符');
            }else{
                f.setTips(id, '', 'success');
                xue.formCheck.checkStrength();
            }
        }
        return this;
    };

    f.repassword = function(){
        var box = $(f.box.repassword), val = box.val(), id = box.attr('id');
        f.box.form = box.parents('form');
        if(val == ''){
            f.setTips(id, '确认密码不能为空');
        }else if(val != $(f.box.password).val()){
            f.setTips(id, '两次输入的密码不相同');
        }else{
            f.clearTips(id);
        }
        return this;
    };

    f.phone = function(){
        var box = $(f.box.phone), id = box.attr('id'), tips = $('#tips_phone');
        f.box.form = box.parents('form');
        if(box.val() == ''){
            f.setTips(id, '手机号不能为空');
            f.vcode.clear();
            return false;
        }else{
            var isPhone = (/^(13|15|18|14|17)[0-9]{9}$/.test(box.val()) ? true : false);
            if(isPhone){
                f.clearTips(id);
                return true;
            }else{
                f.setTips(id, '请输入正确的手机号');
                f.vcode.clear();
                return false;
            }
        }
    };

    f.phonecode = function(){
        var box = $(f.box.phonecode), id = box.attr('id'), tips = $('#tips_phonecode');
        f.box.form = box.parents('form');
        if(box.length == 0){ return; }
        var val = box.val();
        if(val == ''){
            f.setTips(id, '手机验证码不能为空');
        }else{
            if(val.length == 4 && /^[1-9]\d*|0$/.test(Number(val))){
                f.clearTips(id);
            }else{
                f.setTips(id, '手机验证码不正确');
            }
        }
        return this;
    };

    f.getPhoneCode = function(){

    };

    /* 获取验证码部分 */

    f.vcode = f.vcode || {};

    f.vcode.time = 90;

    f.vcode.interval = null;

    f.vcode.box = '#vcode';

    f.vcode.cls = { btn : 'vcode', count : 'vcode_countdown' };

    f.vcode.count = function(){
        var that = this, box = $(that.box);
        f.box.form = box.parents('form');
        if(box.length == 0){ return; }
        that.clear();
        box.addClass(that.cls.count).text('90秒后重新获取');
        $(f.box.phone).prop('readonly', true);
        $('#phonecode').focus();
        // $('#vcode_mask').remove();
        if($('#vcode_mask').length == 0){
            $('body').prepend('<div id="vcode_mask"></div>');
        }
        $('#vcode_mask').css({
            position : 'absolute',
            left : box.offset().left,
            top : box.offset().top,
            width : box.width(),
            height : box.height(),
            background : '#fff',
            opacity : 0.3,
            // overflow : 'hidden',
            filter : 'alpha(opacity=30)',
            zIndex : 100
        });
        that.interval = setInterval(function(){
            if(that.time > 0){
                that.time--;
                box.text(that.time + '秒后重新获取');
                $(".msg_tip").show();
            }else{
                that.clear();
                box.removeClass('vcode_countdown');
                $(".msg_tip").hide();
            }
        }, 1000);
    };

    f.vcode.clear = function(){
        var that = this, box = $(that.box);
        if(box.length == 0){ return; }

        that.time = 90;
        clearInterval(that.interval);
        $(f.box.phone).prop('readonly', false);
        box.removeClass().addClass(that.cls.btn).text('获取短信验证码');
        $('#vcode_mask').remove();
    };

    f.vcode.ajax = function(){};

    f.grade = function(){
        var box = $(f.box.grade), val = box.val();
        f.box.form = box.parents('form');
        if(val == ''){
            f.setTips('grade', '请选择年级');
             $('.grade_promote').text('选择正确的年级，专属活动和咨询等着你');
        }else{
            f.clearTips('grade');
            $('.grade_promote').html('<strong>注意：请选择开学后即将升入的年级！</strong>');
        }
        return this;
    };


    f.tips = {
        empty : '$val$不能为空',
        email : '',                     //'Email格式不正确',
        username : '',                  //'请输入正确的用户名',
        password : '',
        repassword : '',                //'两次输入的密码不相同',
        phone : '请输入正确的手机号',                     //'请输入正确的手机号',
        phoneCode : '',                 //'手机验证码不正确',
        grade : '',                     //'请选择正确的年级',
        strength : {
            0 : '太短',
            1 : '弱',
            2 : '一般',
            3 : '很好'
        }
    }

    f.clearTips = function( id ){
        var box = $('#tips_' + id);
        if(box.length == 0){ return; }
        box.removeClass().addClass('tips').empty();
        f.setTips(id, '&nbsp;', 'success');
        return this;
    };

    f.setTips = function( id, tips, tp ){
        var box = $('#tips_'+id), cls = tp || 'error';
        if(box.length == 0){ return; }
        // console.log(cls);
        box.removeClass().addClass('tips ' + cls);
        box.html(tips || f.tips[id]);
        return this;
    };



    f.checkStrength = function(pwd){
        var pwd = $(f.box.password), val = $.trim(pwd.val());
        var score = f.strength(val);
        var s = pwd.nextAll('.tips_strength');
        if(val.length >= 6){
            s.removeClass('hidden').show();
            var tp = score < 34 ? 1 : (score < 68 ? 2 : 3);
            s.find('strong').removeClass().addClass('strength_' + tp);
        }else{
            s.addClass('hidden').hide();
        }
    };

    f.strength = function(password, username){
        var score = 0;
        if (password.length < 4) { return -4; }
        if (typeof(username) != 'undefined' && password.toLowerCase() == username.toLowerCase()) { return -2 }
        score += password.length * 4;
        score += (repeat(1, password).length - password.length) * 1;
        score += (repeat(2, password).length - password.length) * 1;
        score += (repeat(3, password).length - password.length) * 1;
        score += (repeat(4, password).length - password.length) * 1;
        if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) { score += 5; }
        if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) { score += 5; }
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) { score += 10; }
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) { score += 15; }
        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) { score += 15; }
        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) { score += 15; }
        if (password.match(/^\w+$/) || password.match(/^\d+$/)) { score -= 10; }
        if (score < 0) { score = 0; }
        if (score > 100) { score = 100; }
        return score;

        function repeat(len, str) {
            var res = "";
            for (var i = 0; i < str.length; i++) {
                var repeated = true;
                for (var j = 0, max = str.length - i - len; j < len && j < max; j++) { repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + len)); }
                if (j < len) { repeated = false; };
                if (repeated) { i += len - 1; repeated = false; } else { res += str.charAt(i); }
            }
            return res;
        }
    };

})();
$(function(){
    /*我要体验按钮点击切换状态*/
    function experienceChange(obj){
        var val=obj.text()
        if (val=="我要体验") {
            obj.parents(".course_item").addClass("selected_item").siblings().removeClass("selected_item");
            obj.addClass("cancer_exp").text("取消体验").parents(".course_item").siblings().children().find(".will_exp").removeClass("cancer_exp").text("我要体验");
        }else{
            obj.removeClass("cancer_exp").text("我要体验").parents(".course_item").removeClass("selected_item");
        }
    }
    /*点击换一批按钮要封装的方法*/
    function changeMethod(Obj){
        var dataSubject=$(Obj).data("subject");
        var dataNum=$(Obj).data("num");
        var selectIterm=$(Obj).parent().siblings('.course_item_inner').children(".course_item.selected_item").data('courseid') || '';
        $.ajax({
            type: "POST",
            url: "/Guide/ajaxGetFreeCourse",
            data: {
                "num":dataNum,
                "subjectId":dataSubject,
                "courseId":selectIterm
            },
            dataType: "html",
            success: function(result) {
                $(Obj).parent().siblings('.course_item_inner').html(result);
                $('.will_exp').off('click').on('click',function(){
                    var This = $(this);
                    experienceChange(This);
                    if($(".course_item").hasClass("selected_item")){
                        $(".submit_exper").attr('disabled',false).removeClass("unsubmit");
                    }else{
                        $(".submit_exper").attr('disabled',true).addClass("unsubmit");
                    }
                });
            },
            error: function() {
                alert('数据读取错误,请重试..');
                return false;
            }
        });
    }
    /*点击换一批按钮*/
    $(".course_item_list a").click(function(){
        var This = $(this);
        changeMethod(This)
    }).trigger('click');





    // 点击下一步提交
    $(".submit_exper").click(function(){
        var dataUrl=$(".submit_exper").data("url")|| ''; // 获取完成按钮的url  
        

        // 获取所选中的课程的ID
        var selectItermId = '';
        var ItermArr = [];
        $(".course_item.selected_item").each(function(){
            ItermArr.push($(this).data('courseid'));
        });
        selectItermId = ItermArr.join(',');

        _ty=$(".submit_exper").data("params")|| '';

        var _data = 'courseIds=' + selectItermId + '&url=' + dataUrl;
        
        if(_ty!=""){
            _data += '&' + _ty;
        }
        $.ajax({
            type: "POST",
            url: "/Guide/ajaxGiveFreeCourse",
            data: _data,
            dataType: "json",
            success: function(d) {
               if(d.sign=="0") 
               {
                alert(d.msg);
            }
            else if(d.sign=="1")
            {
                window.location.href=d.msg;
            }
        },
        error: function() {
            alert('数据读取错误,请重试...');
            return false;
        }
    });
    });
// 注册页面解释免费体验周
$('.exp_logo').on('mouseenter', '.exp_anasisy_wrap .exp_anasisy', function(){
    var that = $(this), con = that.next('.exp_anasisy_para').html();
    xue.win({
        id : 'examTips',
        title : false,
        arrow : 'tc',
        follow : that,
        content : '<div class="exp_anasisy_para"> ' + con + '</div>',
        lock : false,
        close : false,
        submit : false,
        cancel : false,
        width: 375
    });
    var box = $('#xuebox_examTips'),
    size = xue.win('examTips').getSize(),
    o = {
        left : that.offset().left + (that.width() / 2) - (size.width / 2),
        top : that.offset().top + that.height() + 7
    };
    xue.win('examTips').position(o.left, o.top);
    $(this).on('mouseleave', function(e){

            if($(e.relatedTarget).attr('id') != 'exp' && $(e.relatedTarget).parents('#xuebox_examTips').length === 0){
                xue.win('examTips').close();
            }
        });
        $('#xuebox_examTips').on('mouseleave', function(){
            xue.win('examTips').close();
        });
    });

});