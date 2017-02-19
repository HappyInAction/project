/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2014-09-09 16:49:12
 * @version $Id$
 */
$.fn.iVaryVal=function(iSet,CallBack){
    /*
     * Minus:点击元素--减小
     * Add:点击元素--增加
     * Input:表单元素
     * Min:表单的最小值，非负整数
     * Max:表单的最大值，正整数
     */
    var _maxNum = $('#exchange_max').val();
    iSet=$.extend({Minus:$('.J_minus'),Add:$('.J_add'),Input:$('.J_input'),Min:1,Max:_maxNum},iSet);
    var C=null,O=null;
    //插件返回值
    var $CB={};
    //增加
    iSet.Add.each(function(i){
        $(this).click(function(){
            O=parseInt(iSet.Input.eq(i).val());
            (O+1<=iSet.Max) || (iSet.Max==null) ? iSet.Input.eq(i).val(O+1) : iSet.Input.eq(i).val(iSet.Max);
            //输出当前改变后的值
            $CB.val=iSet.Input.eq(i).val();
            $CB.index=i;
            //回调函数
            if (typeof CallBack == 'function') {
                CallBack($CB.val,$CB.index);
            }
             subtract();
        });
    });
    //减少
    iSet.Minus.each(function(i){
        $(this).click(function(){
            O=parseInt(iSet.Input.eq(i).val());
            O-1<iSet.Min ? iSet.Input.eq(i).val(iSet.Min) : iSet.Input.eq(i).val(O-1);
            $CB.val=iSet.Input.eq(i).val();
            $CB.index=i;
            //回调函数
            if (typeof CallBack == 'function') {
                CallBack($CB.val,$CB.index);
            }
             subtract();
        });
    });
    //手动
    iSet.Input.bind({
        'click':function(){
            O=parseInt($(this).val());
            $(this).select();
        },
        'keyup':function(e){
            if($(this).val()!=''){
                C=parseInt($(this).val());
                //非负整数判断
                if(/^[1-9]\d*|0$/.test(C)){
                    $(this).val(C);
                    O=C;
                }else{
                    $(this).val(O);
                }
            }
            //键盘控制：上右--加，下左--减
            if(e.keyCode==38 || e.keyCode==39){
                iSet.Add.eq(iSet.Input.index(this)).click();
            }
            if(e.keyCode==37 || e.keyCode==40){
                iSet.Minus.eq(iSet.Input.index(this)).click();
            }
            //输出当前改变后的值
            $CB.val=$(this).val();
            $CB.index=iSet.Input.index(this);
            //回调函数
            if (typeof CallBack == 'function') {
                CallBack($CB.val,$CB.index);
            }
            subtract();
        },
        'blur':function(){
            $(this).trigger('keyup');
            if($(this).val()==''){
                $(this).val(O);
            }
            //判断输入值是否超出最大最小值
            if(iSet.Max){
                if(O>iSet.Max){
                    $(this).val(iSet.Max);
                }
            }
            if(O<iSet.Min){
                $(this).val(iSet.Min);
            }
            //输出当前改变后的值
            $CB.val=$(this).val();
            $CB.index=iSet.Input.index(this);
            //回调函数
            if (typeof CallBack == 'function') {
                CallBack($CB.val,$CB.index);
            }
            subtract();
        }
    });
}

function subtract(){
       var that = $('.numCon .J_minus');
       var it =  $('.numCon .J_add');
       var _num = that.next('input.inputTxt').val();
       var _number = it.prev('input.inputTxt').val();
       var _money = $('.exchange_price').find('input').val();
       var _input = $('input.inputTxt').val();
       var _text = _money * _input;
       var _maxNum = $('#exchange_max').val();
       $('.exchange_price .price').html(_text);
       if (_num > 1) {
            that.addClass('subtract_cur')
       }else{
            that.removeClass('subtract_cur')
       };
        if (_number === _maxNum) {
            it.addClass('add_cur')
       }else{
            it.removeClass('add_cur')
       };
    };

$(function(){

    if($('#details-form').is(':visible')){
           $('.exchange_affirm').hide(); 
        }
   	var addressInput = '#realname, #add_province, #add_city, #add_country, #address, #zipcode, #phone';
     // 收货地址点击切换
    $('body').on('click', '.address_list_news input:radio',function(){
        var newAddress = $('#details-form');
        if(this.id === 'addid_0'){
            newAddress.show();
            $(addressInput).val('');
            $('#add_id').val(0);
            renderAreaSelect();
            $('.exchange_affirm').hide();
            
        }else{
            newAddress.hide();
            $('.exchange_affirm').show();
        }
        $(addressInput).removeClass('error');
        $('.error_tips_address').empty();
        $('.address_list li').removeClass('current');
         $('.address_list li').find('input').removeAttr('checked','checked');
    });

    // 保存收货地址
    $('body').off('click','#address_submit_btn').on('click','#address_submit_btn', function(){
        var inputs = $(addressInput),
            errorbox  = $('.error_tips_address');

        var ids = {
            realname     : '收货人姓名',
            province : '省份',
            city     : '城市',
            country  : '地区',
            address      : '详细地址',
            zipcode      : '邮政编码',
            phone        : '手机',
            add_province : '省份',
            add_city     : '城市',
            add_country  : '地区'
        };
        var _reg = {
            phone : (/^(13|15|18)[0-9]{9}$/.test($('#phone').val()) ? true : false),
            zipcode: (/^[0-9][0-9]{5}$/.test($('#zipcode').val()) ? true : false)
        };
                     //邮编
        var id, error = [], error_text = '', tpl = '$input$ 不能为空', error_reg = [], reg_text = '';
        inputs.each(function(){
            id = this.id;
            if($(this).val() === ''){
                error.push(ids[id]);
                $(this).addClass('error');
            }else{
                // 判断手机号与邮编格式
                if(id == 'phone' || id == 'zipcode'){
                    if(!_reg[id]){
                        error_reg.push(ids[id]);
                        reg_text += ids[id];
                        $(this).addClass('error');
                    }else{
                        $(this).removeClass('error');
                    }
                }else{
                    $(this).removeClass('error');
                }

            }
        });
        // var error_reg_text = reg_text != '' ? reg_text + '格式不正确' : '';
        var temp_text = '';
        if(error.length > 0){
            error_text = error.toString();
            temp_text = tpl.replace('$input$', error_text);
            // errorbox.text(tpl.replace('$input$', error_text));  
            // return;
        }
        // 判断手机号与邮编格式
        if(error_reg.length > 0){
            reg_text = error_reg.toString() + '格式不正确';
            if(error.length > 0){
                temp_text += ', ';
            }
            temp_text += reg_text;
            // errorbox.text(reg_text);        
            // return;            

        }
        if(temp_text != ''){
            errorbox.text(temp_text);
            return;
        }

        errorbox.empty();

        saveNewAddress(inputs);

    });
//点击选中单选-----隐藏新地址输入框，显示提交按钮
$('#container').on('click', '.order_address li', function(event) {
   $(this).addClass('current').siblings().removeClass('current');
   $('#details-form').hide();
   $('.exchange_affirm').show();
   $('#addid_0').removeAttr('checked','checked');
});
//提交数据显示添加地址
function saveNewAddress(inputs){
    var input = inputs || $(addressInput);
    var data = { id : 0 };
    data.id = $('#add_id').val();

    var id;
    inputs.each(function(){
        id = this.id;
        id = id.replace('add_', '');
        data[id] = $(this).val();
    });

    data['province_text'] = $('#add_province option:checked').text();
    data['city_text'] = $('#add_city option:checked').text();
    data['country_text'] = $('#add_country option:checked').text();

    var _tpl = '<label for="addid_$id$">'
                    +'  <input type="radio" '
                    +'      data-phone="$phone$" '
                    +'      data-zipcode="$zipcode$" '
                    +'      data-address="$address$" '
                    +'      data-area="$province_text$ $city_text$ $country_text$" '
                    +'      data-county="$country$" '
                    +'      data-city="$city$" '
                    +'      data-province="$province$" '
                    +'      data-realname="$realname$" '
                    +'      value="$id$" '
                    +'      name="data[addid]" '
                    +'      id="addid_$id$" checked= true'
                    +'  />'
                    +'  <p class="name">$realname$</p>'
                    +'  <p class="address">$province_text$ $city_text$ $country_text$</p>'
                    +'  <p class="address_con">$address$</p>'
                    +'  <p>$phone$</p>'
                    +'</label>';

    var o = {
        id : data.id,
        realname : data.realname,
        province_id : data.province,
        city_id : data.city,
        country_id : data.country,
        address : data.address,
        zipcode : data.zipcode,
        phone : data.phone,
        aId   : $('#exchange_id').val()
    };
    $.ajax({
        url : '/LearningShop/saveStuAdds/',
        type: 'POST',
        dataType:'json',
        data : o,
        success:function(result){
            if(!result.sign){
                return;
            }
            var _id = result.addId;
            var tp = _tpl;
            tp = tp.replace(/\$id\$/g, _id);
            tp = tp.replace(/\$phone\$/g, data.phone);
            tp = tp.replace(/\$zipcode\$/g, data.zipcode);
            tp = tp.replace(/\$address\$/g, data.address);
            tp = tp.replace(/\$country\$/g, data.country);
            tp = tp.replace(/\$city\$/g, data.city);
            tp = tp.replace(/\$province\$/g, data.province);
            tp = tp.replace(/\$realname\$/g, data.realname);
            tp = tp.replace(/\$province_text\$/g, data.province_text);
            tp = tp.replace(/\$city_text\$/g, data.city_text);
            tp = tp.replace(/\$country_text\$/g, data.country_text);
                if (result.sign === 2) { //跳转地址
                    window.location.href = result.msg;
                    return false;
                }
            if(result.type === 1){
                var _urlID = $('#exchange_id').val(); 
                    var url = '/LearningShop/realAwardDetail/' ;
                    $('.set_tar_rain').hide();
                    param = "id="+_urlID;
                    $.ajax({
                        url : url,
                        data : param,
                        type: "POST",
                        dataType: 'html',
                        success: function(d){
                            var resData = xue.ajaxCheck.HTML(d);
                            if(resData){
                                $('.deal_width').html(resData);
                            }
                        }
                    });
            }
            $('#details-form').hide();
            $('#addid_0').removeAttr('checked','checked');
        }
    });
}
//end saveNewAddress
    $('.numCon').iVaryVal();
    //执行加减
    subtract();
    $('body').off('click','#affirm_submit').on('click','#affirm_submit', function(){
        var id = $('#exchange_id').val();
        var num = $('.J_input').val();
        var addId = $('.address_list li.current').attr('id');
        var _max = $('#exchange_max').val(); //库存数
        var _money = $('.exchange_price .price').text();
        var _awardType = $('#award_type').val();
        var _myMoney = $('.my_have').text(); //我拥拥有的金币数 //兑换金币数总数
         var a = parseFloat(_myMoney),
             b = parseFloat(_money);
        if ($('.order_address').is(':visible')) {
             if ($('.address_list li.current').length !== 1 && _awardType == 1) {
               alert('请选择收货人地址!');
               return false;
           }
        }
         if (a < b){//金币不足
            alert('>_<你的金币数不足哦~');
            return false;
        }
         if (num == 0) {//库存不足
            alert('库存不足哦，暂时不能进行兑换~');
            return false;
        }
       if(confirm('您确定兑换嘛？')){
         $.ajax({
               url: '/LearningShop/ajaxExchange/',
               type: 'POST',
               dataType: 'json',
               data: {
                      id : id,
                      num : num ,
                      addId : addId,
                      award_type:_awardType
                },
               success: function(d) { //成功
                var _resUrl = xue.ajaxCheck.JSON(d);
                 if (_resUrl) {
                        $('#awardList').removeClass('current');
                        $('#exchange').addClass('current');
                        $('.set_tar_rain').hide();
                        $('.set_tar_rain_colth').hide();
                        $('#main_tab').val("category=2");
                        if (_awardType == '1') {
                            $('.nav_use').hide()
                            $('.nav_expire').hide()
                        }
                        if (_awardType == 2) {
                            $('.nav_use').show();
                            $('.nav_expire').hide()
                        }
                        if (_awardType == 3) {
                            $('.nav_use').hide();
                            $('.nav_expire').show()
                        }
                        url = _resUrl,
                        param = '';
                        if (url) {
                            $.ajax({
                                url: url,
                                data: param,
                                type: "POST",
                                dataType: 'html',
                                success: function(d) {
                                    var resDat = xue.ajaxCheck.HTML(d);
                                    if (resDat) {
                                        $('.deal_width').html(resDat);
                                    } else {
                                        $('.deal_width').html('');
                                    }
                                    var pages = $('#class').val();
                                    xue.pages('ui_pages').config({
                                        pages: pages,
                                        current: 1,
                                        pageNum: 12,
                                        callback: function(current) {
                                            $.ajax({
                                                url: url,
                                                data: param + '&curpage=' + current,
                                                type: "POST",
                                                dataType: 'html',
                                                success: function(d) {
                                                    var res = xue.ajaxCheck.HTML(d);
                                                    if (res) {
                                                        $('.deal_width').html(res);
                                                    }
                                                    xue.pages('ui_pages').go(current);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }

                        //window.location.href = '/LearningCenter/goldShop/2';
                    }
               }
           });
       }
           

        // var _html ='<div class="tips_img"><img src="http://img04.xesimg.com/tips_img.png" alt="您的金币数不足哦~"/></div>'
        //           +'<div class="tips_btn">'
        //           +'   <span id="xueWinPrice" class="btn btn_blue">确定</span>'
        //           +'</div>'
        // var my_have = $('.my_have').text(),
        //     price   = $('.price').text();
        // if( my_have < price){
        //        xue.win({
        //           id : 'winPrice',           // 多个弹窗需要设置id
        //           title : '温馨提示',        // 弹窗标题
        //           content : _html,         // 弹窗里面的内容
        //           lock:true,            // 背景遮罩
        //           width: 450,
        //           height : 150,
        //           submit : false,
        //           cancel : false,        // 取消按钮的事件，如果true则直接关闭，如果false则不显示
        //           close : true          // 点击关闭时的事件
        //       });
        //     $('#xueWinPrice').on('click', function(){
        //         xue.win('winPrice').close();
        //     });
        // }else{
        
        // }
    });
});




