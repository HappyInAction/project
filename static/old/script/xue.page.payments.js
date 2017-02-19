/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-14 12:45:29
 * @version $Id$
 * 
 * @links http://xesui.com
 */


/**
 * @name xue.page.payments.js
 * @description 支付页面交互
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */


xue.pay = xue.pay || {};
// (function(){

//     var pay = xue.pay;

//     pay.opt = {
//         type : 10001

//     };

//     pay.dom = {
//          order   : '.p_order'                   // 订单金额
//         ,course  : '#t_course'                  // 课程金额
//         ,card    : '#p_card'                    // 代金卡
//         ,express : '#p_express'                 // 快递费
//         ,balance : '#p_balance'                 // 余额
//         ,pay     : '#p_pay'                     // 支付总额
//         ,gift    : '.gift_info input'   // 赠品
//         ,entity  : '.gift_info input.entity'    // 实物
//         ,card    : '.table_card input'          // 代金卡
//     };

//     pay.input = {
//          type         : '#pay_type'              // 支付方式
//         ,dbank        : '#default_bank'          // 默认银行
//         ,typeID       : '#paytype_id'            // 支付类型ID: 402001
//         ,invoiceTitle : '#invoice_head'      // 发票抬头
//         ,isInovice    : '.bill_checked'      // 是否需要发票
//         ,invoiceType  : '.tab_change'        // 发票类型
//         ,bankType     : '#onlinePayType'     // 在线支付类型：网银、平台、借记卡、快捷
//         ,address      : '.address input'     // 收货地址  
//     };
    
//     // 价格
//     pay.price = {
//          course  : 0    // 课程总金额（不含代金卡）
//         ,order   : 0    // 订单金额
//         ,express : 0    // 快递费
//         ,card    : 0    // 代金卡
//         ,balance : 0    // 余额
//         ,pay     : 0    // 最后支付金额
//     };
    
//     pay.init = function(o){
//         $.extend(pay.opt, o);
//         $.each(pay.dom, function(k, v){
//             pay.dom[k] = $(v);
//         });
//         $.each(pay.input, function(k, v){
//             pay.input[k] = $(v);
//         });
//     };

//     // 计算价格
//     pay.count = function(){};

//     // 支付方式
//     // pay.type = function(){};

//     // 收货地址
//     pay.address = function(){};

//     // 支付银行
//     pay.bank = function(){};

//     // 发票
//     pay.invoice = function(){};

//     // 赠品
//     pay.gift = function(){};

//     // 代金卡
//     pay.card = function(){};



// })();








var addressInput = '#realname, #add_province, #add_city, #address, #zipcode, #phone';
var paytpl = '课程总金额：￥<u class="p_order">$course$</u>.00 + 快递费：￥<u id="p_express">$express$</u>.00 - 帐户余额：￥<u id="p_balance">$balance$</u>.00 = 您需支付：<strong>￥<u id="p_pay">$pay$</u>.00</strong><input type="hidden" id="carriage_hidden" value="8" autocomplete="off" />'

var paytype   = 1;    // 1：在线；2：货到；3：余额； paytypeData[paytype]
var paytypeData = [0, 10001, 200000, 301000];      // 10001:在线 200000: 货到  余额301000；

var price = {
    course  : 0,    // 课程总金额（不含代金卡）
    order   : 0,    // 订单金额
    express : 0,    // 快递费
    old_express : 0,
    card    : 0,    // 代金卡
    balance : 0,    // 余额
    old_balance : 0,
    pay     : 0 , // 最后支付金额
    pfav    : 0    //优惠金额
};

var pbox = {
    //order   : '.p_order',
    course  : '#t_course',      // 课程金额
    card    : '#p_card',        // 代金卡
    express : '#p_express',     // 快递费
    balance : '#p_balance',     // 余额
    pay     : '#p_pay',        // 支付总额
    pfav    : '#p_favorable' //优惠金额        
};

// 初始化价格
function initPrice(){
    price.course = Number($(pbox.course).text());
    price.balance = Number($('#balance').text());
    price.card = Number($('#p_card').text());
    price.old_balance = Number($('#balance').text());
    price.old_express = Number($('#carriage_hidden').val());
    price.pfav = Number($('#xb_favorable').text());
    //price.order = price.course - price.card;
}
//设置订单金额（顶部的）优化后不再需要===14-06-27
// function setOrderPrice(){
//     // 代金卡金额不能小于0；
//     price.card = price.card < 0 ? 0 : price.card;

//     price.order = price.course - price.card;
//     $(pbox.card).text(price.card);
//     $(pbox.order).text(price.order);
// }


// 设置支付金额（底部的）
// function setPayPrice(){
//     // setBalance();
//     var _pay = price.course + price.express;
//     if(price.balance > 0){
//         price.balance = price.old_balance > _pay ? _pay : price.old_balance;
//     }
//     price.pay = price.order + price.express - price.balance;

//     //$(pbox.order).text(price.order);
//     $(pbox.express).text(price.express);
//     $(pbox.balance).text(price.balance);
//     $(pbox.pay).text(price.pay);
// }

/**
 * 检查是否要快递费
 */
function setExpress(){
    //var isCOD = ($('#pay_type_200000:visible').hasClass('current')) ? true : false;
    var isCOD = $('input#pay_type_select_collect:checked').length > 0 ? true : false;
    var isEntity = $('.gift_info input.entity:checked').length > 0 ? true : false;
    // xue.log('isCOD : ' + isCOD);
    price.express = 0;
    if(isCOD || isEntity){
        if(price.order <= 29){
            price.express = price.old_express;
        }
    }
    // return price.express;
}
/**
 * 检查是否余额支付
 */
// function setBalance(){
//     var isBalance = (price.order + price.express) <= price.old_balance ? true : false;
//     if(isBalance){
//         $('.ui_payment,.paytype_title').hide();
//         price.balance = price.old_balance;
//     }else{
//         $('.ui_payment,.paytype_title').show();
//         var paytab = $('.payment_tabs li.current');
//         price.balance = (paytab.index() == 0) ? 0 : price.old_balance;
//     }
// }
//获取支付方式
// function getPayType(){
//     var oldtp = paytypeData[paytype];
//     var isBalance = (price.order + price.express) <= price.old_balance ? true : false;
//     if(isBalance){
//         oldtp = paytypeData[3];
//     }else{
//         var paytab = $('.payment_tabs li.current');
//         oldtp = paytab.attr('id').replace('pay_type_', '');
//     }
//     oldtp = Number(oldtp);
//     return oldtp;
// }

// function setPayType(val){
//     var tp = val || getPayType();
//     $('#pay_type').val(tp);
// }


/**
 * 设置地址信息栏是否展示
 * 1. 货到付款
 * 2. 实物礼品
 * 3. 开发票
 *
 * 计算运费：货到、实物
 */
function setAddressBox(){
    // var isCOD = ($('#pay_type').val() == 200000) ? true : false;
    //var isCOD = ($('#pay_type_200000:visible').hasClass('current')) ? true : false;
    var isCOD = $('input#pay_type_select_collect:checked').length > 0 ? true : false;
    var isEntity = $('.gift_info input.entity:checked').length > 0 ? true : false;
    var isInvoice = $('.bill_checked').prop('checked') == true ? true : false;
    var _addressShow = isCOD || isEntity || isInvoice;
    if(_addressShow){
        $('.express_title, .order_address').show();
    }else{
        $('.express_title, .order_address').hide();
    }
}

// function initPay(){
//     alert(1112);
//     console.clear();
//     setOrderPrice();
//     paylog(1 + '_topPrice : ');

//     setBalance();
//     setExpress();
//     paylog(2 + '_express : ');

//     setBalance();
//     paylog(3 + '_balance : ');
    
//     setPayPrice();
//     paylog(4 + '_payPrice : ');
    
//     setAddressBox();
//     paylog(5 + '_address : ');

//     setPayType();
//     paylog(6 + '_payType : ');
// }
// 
// 计算货到付款时订单小于等于50元加运费20元，并显示货到付款说明 
// function collectPay(){
//     var isCOD = $('input#pay_type_select_collect:checked').length > 0 ? true : false;
//     if (isCOD) {
//         //price.balance = 0;
//         $(pbox.balance).text(price.balance = 0);
//         $(pbox.pay).text(price.pay)
//       if (price.course <= 50) {
//             $('.all_express_fee').show();
//             $(pbox.express).text(price.old_express);
//             $(pbox.pay).text(price.pay)
//       }
//     }else{
//         $('.all_express_fee').hide();
//         $(pbox.express).text(price.express);
//         $(pbox.balance).text(price.old_balance);
//         $(pbox.pay).text(price.pay)
//       }
// }

function initPay(){
    // 计算订单金额
    //price.card = price.card < 0 ? 0 : price.card;
    setAddressBox();
   
  
//是否收快递费说明
//
  var isCOD = $('input#pay_type_select_collect:checked').length > 0 ? true : false;
  var isEntity = $('.gift_info input.entity:checked').length > 0 ? true : false;
  var order = price.course - price.card;
  //xue.log(order);
    if (isEntity) {

      var savePrice = parseInt($("#savePrice").val());
      var Total = parseInt(order) + savePrice;
       if (Total <= 29) {
         $('.all_express_fee').hide();
           price.express = price.old_express;
       }else{
            $('.all_express_fee').hide();
            price.express = 0;
       }
    }else{
            $('.all_express_fee').hide();
            price.express = 0;
       }
   
     //xue.log('运费：' + price.express);

   //是否余额够支付
    var payPrice = price.course + price.express;
    var isBalance = (payPrice) <= price.balance ? true : false;
    if(isBalance){
        price.pay = 0;
        $('.payment_bank_item,.pay_on_delivery').hide();
    }else{
        price.pay = price.pay;
        $('.payment_bank_item,.pay_on_delivery').show();
    }

     
    var payTP = "";
    //var paytypeData = [0, 10001, 200000, 301000];      // 10001:在线 200000: 货到  余额301000；
    var allPayTPData = price.course - price.card + price.express <= price.old_balance;
   // 支付方式：
    if(allPayTPData){
         payTP = 301000;
         price.balance = price.course - price.card + price.express;
    }else{
        payTP = 10001;
        price.balance = price.old_balance;
        $('#pay_type_select_web').attr('checked','checked');
        $('.payment_bank_item').addClass('borderBlue');
        $('.payment_content').removeClass('hidden');
    }

if (isCOD) {
    payTP = 200000;
     price.balance = 0;
         $('#pay_type_select_collect').attr('checked','checked');
         $('#pay_type_select_web').removeAttr('checked','checked');
         $('.payment_bank_item').removeClass('borderBlue');
         $('.payment_content').addClass('hidden');
    if (payTP = 200000) {
       if (order <= 29) {
         $('.all_express_fee').show();
           price.express = price.old_express;
       }
    }
    
}

  // 计算最终支付价格
    price.pay = price.course - price.card  + price.express - price.balance;
  //课程金额加快递费总额小于等于代金卡加优惠加余额的总额则应付价格为零
  if (price.course + price.express <= price.card  + price.balance) {
     price.pay = 0;
  }
  //计算网上支付时，应付金额为零，切换为余额支付，网上支付和货到付款隐藏
    if (price.course + price.express - price.card - price.balance === 0) {
        payTP = 301000;
        $('.payment_bank_item,.pay_on_delivery').hide();
    }
    // 渲染页面中的价格
    //$(pbox.order).text(price.order);
   
    $(pbox.express).text(price.express);//快递
    $(pbox.card).text(price.card);//代金卡
    //$(pbox.pfav).text(price.pfav);//优惠
    $(pbox.balance).text(price.balance);//余额
    $(pbox.pay).text(price.pay);//应付
    $('#p_pay_all').text(price.pay);
    $('#numMoney').text(price.card);
    $('#pay_type').val(payTP)

};




// function paylog(n){
//     var isBalance = (price.order + price.express) <= price.old_balance ? true : false;
//     var isEntity = $('.gift_info input.entity:checked').length > 0 ? true : false;
//     var isCOD = ($('#pay_type_200000:visible').hasClass('current')) ? true : false;
//     var p = price;

//     xue.log(n + ' ------------------------------ : ');
//     xue.log('tp : ' + $('#pay_type').val() + ' || isBalance : ' + isBalance + ' || isCOD : ' + isCOD + ' || balance : ' + p.balance + ' || express : ' + p.express + ' || order : ' + p.order + ' || isEntity : ' + isEntity);

// }


(function(){
     // 实物礼品
    $('input.entity').on('change', function(){
        initPay();
    });
    // 设置在线银行状态
    setOlineBank();
    // 初始化价格
    initPrice(); 
    //计算订单金额
    initPay();

    // 0元课程
    // if(price.order === 0){
    //     $('.paytype_title, .ui_payment, .ui_folds, .express_title, .order_address').hide();
    // }

  
    // 展开/收起效果
    var foldtab = $('.ui_folds');
    foldtab.off('click', '.folds_title span').on('click', '.folds_title span', function(){
        var _fold = $(this).parents('.ui_folds');
        var cls = 'folds_open';
        if(_fold.hasClass('folds_open')){
            _fold.removeClass(cls);
        }else{
            _fold.addClass(cls);
        }
    });

   
    /* ================== 代金卡 ============== */

    // 设置代金卡列表高度
    setCardListWrapHeight();
    // 代金卡点击事件
    $('body').on('change', '#card_list input:checkbox', function(){
        var that = $(this);
        var ischeck = this.checked,
            _card   = Number(that.attr('price')),
            _price  = price.card,
            _max    = Math.round(price.course * 0.5),
            _list    = $('#card_list input').not(':checked'),
            _checked = $('#card_list input:checked');
     
            
        var _getCheckedPrice = function(){
            var _num = $(_checked).length;
            $("#numCard").text(_num);
            var _p = 0;
            _checked.each(function(){
               _p += Number($(this).attr('price'));
            });
            return _p;
        };
        var checkedPrice = _getCheckedPrice();
        if(checkedPrice >= _max){
            _list.each(function(){
                this.disabled = true;
            });
        }else{
            _list.each(function(){
                this.disabled = false;
            });
        }
            that.each(function() {
                 if (_checked.length > 0) {
                    _list.prop('disabled','disabled');
                 }else{
                     _list.prop('disabled','');
                 };
            });
        price.card = checkedPrice < 0 ? 0 : checkedPrice;
        price.card = checkedPrice > _max ? _max : checkedPrice;
        
        initPay();
        
    });

    // 激活代金卡
    $('#btn_submit').on('click', function(){
        var card_num = $('#giftCardNo').val();
        var card_pwd = $('#giftCardPwd').val();
        if(card_num ==''){
            card_num = 0;
        }
        if(card_pwd ==''){
            card_pwd = 0;
        }

        $.ajax({
            url : "/MyCards/ajaxActiveGift/",
            type: 'POST',
            data: {cardNo: card_num,cardPwd: card_pwd},
            dataType:'json',
            success: function(result){
                var msg = xue.ajaxCheck.json(result);
                if(msg){
                    var tb = $('#card_list');
                    var l = $('.table_card input').not(':checked');
                    var _disabled = l.length > 0 && l[0].disabled == true
                    ? 'disabled="' + l[0].disabled + '"' 
                    : '';
                    var tpl = '<tr id="coupon_'+ msg.coupon_id +'" class="text_l">'
                           + '        <td style="text-align:left;">'
                           + '            <input type="checkbox" value="'+ msg.coupon_id +'" price="'+ msg.price +'" ' + _disabled + ' name="data[coupon][]">'
                           + '             '+ msg.coupon_code +'</td>'
                            + '    <td>'+ msg.price +'</td>'
                            + '    <td>'+ msg.receive_date +'</td>'
                            + '    <td>'+ msg.expire_date +'</td>'
                            + '   </tr>';
                    if(tb.find('tr#coupon_' + msg.coupon_id).length > 0){
                        alert('此代金卡已经存在');
                        return false;
                    }
                    
                    tb.find('tbody').prepend(tpl);

                    $('#addNotice').text('激活成功');
                    
                    var _hi = $('#card_list td input').length;
                    if (_hi > 0) {
                          $(".gift_card .clsHidden").removeClass('hidden');
                    };
                    setTimeout(function(){
                        $('#addNotice').empty();
                    }, 2000);
                    $('#giftCardNo').val('');
                    $('#giftCardPwd').val('');
                    setCardListWrapHeight();
                    if(xue.isFirefox){
                        // 火狐下禁止缓存表单
                        $('input').prop('autocomplete', 'off');
                    }

                }

            }
        });
    });



    // //支付方式切换效果
    // $('.payment_tabs').off('click', 'li').on('click', 'li', function(){
    //     // var index = $('.payment_tabs').find('li').index(this);

    //     $(this).addClass('current').siblings('li').removeClass('current');
    //     var index = $('.payment_tabs li.current').index();

    //     $('.payment_content .payment_bank').eq(index).removeClass('hidden').siblings('.payment_bank').addClass('hidden');
        
    //     initPay();

    // });

    //在线支付方式
    $('input[name="bank_id"]').click(function(){
        var that = $(this);
        var payid = that.attr('payid'),
            paytp = that.attr('paytype');
        $('#paytype_id').val(payid);
        $('#onlinePayType').val(paytp);
        $('.bank_list li').removeClass('current');
        $(this).parent('li').addClass('current');
    });

    $('.bank_list li').click(function(){
        var that = $(this).find('input[name="bank_id"]');
        var payid = that.attr('payid'),
            paytp = that.attr('paytype');
        that.prop('checked', true);
        $('#paytype_id').val(payid);
        $('#onlinePayType').val(paytp);
        $('.bank_list li').removeClass('current');
        $(this).addClass('current');
    });

    /* ============= 收货地址 ============ */


    // 收货地址点击切换
    $('.address_list_news input:radio').on('click', function(){
        var newAddress = $('#details-form');
        
        if(this.id === 'addid_0'){
            newAddress.show();

            $(addressInput).val('');
            $('#add_id').val(0);
            renderAreaSelect();
            
        }else{
            newAddress.hide();
        }
        $(addressInput).removeClass('error');
        $('.error_tips_address').empty();
        $('.address_list li').removeClass('current');
    });

    // 保存收货地址
    $('#address_submit_btn').on('click', function(){
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
    
    /* ============= 发票 ============ */
    var invoice = $('#invoice_head'), invoice_box = $('.invoices');
    // 如果发票有值则显示第二个div
    if(invoice.val()){
        invoice_box.eq(0).addClass('hidden');
        invoice_box.eq(1).removeClass('hidden');
    }

    // 修改发票
    $('.bill_mod').on('click', function(){
        var _tp = $('.invoice_bill_type .bill_type').text();
        var _type = _tp == '培训费' ? 1 : 2;
        $('#invoice_type').val(_type);
        var _tit = $('.bill_notice').text();
        $('#invoice_head').val(_tit);

        invoice_box.eq(1).addClass('hidden');
        invoice_box.eq(0).removeClass('hidden');
         $('.invoice_title').find('.balance_tips').find('a').css('visibility','visible');
    });
//添加发票
    $('.invoice_title a.addInvo').click(function() {
        if ($('.invoice_info').is(':hidden')) {
            $('.invoice_info').show();
            $(this).text('收起');
        } else{
          $('.invoice_info').hide();
         $(this).text('展开');  
        };
    });
    // 保存发票
    $('body').on('click', '.bill_save', function(){
        var _tp = $('#invoice_type').val(),
            _tit = $('#invoice_head').val();
           var  _va = $('#invoice_type').find('option:selected').val();

        _tp = _tp == 0 ? 1 : _tp;

        if (_va == 0 ) {
            xue.alert('请选择发票类型');
            return false;
        };
        if($.trim(_tit) == ''){
            xue.alert('发票信息不能为空');
            return false;
         };
        var _type = _tp == 1 ? '培训费' : '资料费';
        $('.invoice_bill_type .bill_type').text(_type);
        $('.bill_notice').text(_tit);

        invoice_box.eq(0).addClass('hidden');
        invoice_box.eq(1).removeClass('hidden');
        $('.bill_checked').prop('checked', true);
        $('.invoice_title').find('.balance_tips').find('a').css('visibility','hidden');
        // $('.express_title, .order_address').show();
        setAddressBox();
    });

    // 发票复选框
    $('body').on('change', '.bill_checked', function(){
        setAddressBox();
    });

    // 表单提交
    $('#pay_submit').on('click', function(){
        var saveInvoice = $('.invoices:first')
            ,saveAddress = $('#details-form')
            ,errorText = '请先保存'
            ,errorList = [];
        if(saveInvoice.is(':visible')){
            // xue.alert('请先保存发票信息');
            $('#bill_err').text('请保存发票信息').show();
            // setTimeout(function(){
            //     $('#bill_err').hide();
            // }, 3000);
            errorList.push('bill');
            errorText += '<span class="red"> 发票 </span>';
        }
        if(saveAddress.is(':visible')){
            $('.error_tips_address').text('请保存收货人信息').show();
            // setTimeout(function(){
            //     $('.error_tips_address').hide();
            // }, 3000);   
            errorList.push('address');
            if(errorList.length > 1){
                errorText += '和';
            }
            errorText += '<span class="red"> 收货人 </span>';
        }
        if ($('.order_address').is(':visible')) {
             if ($('.address_list li.current').length !== 1) {
               alert('请选择收货人地址');
               return false;
           }
        }
        if(errorList.length > 0){
            xue.alert(errorText += '信息');
        }else{
            $('#confirmForm').submit();
        }

    });


})();

/**
 * 设置余额支付
 */

/**
 * 设置在线支付银行状态
 */
function setOlineBank(){

    var bankList_wrap = $('.paylists:not(.hasCkecked)').find('.bank_list');
    // 收起多余的银行
    bankList_wrap.each(function(i){
        var that = $(this);
        // var eq = (i == 0) ? 7 : 3;
        var eq = 11;
        that.find('li:gt('+ eq +')').hide().addClass('list_more');
        if(that.find('li').length <= 12){
            that.next('.bank_more').hide();
        }else{
            that.next('.bank_more').find('span').text('更多银行');
        }
    });
    // 更多银行展开收起效果
    $('.bank_more').on('click', function(){
        var that = $(this),
            list = that.prev().find('li.list_more');
        if(that.hasClass('open')){
            list.hide();
            that.removeClass('open');
            that.find('span').text('更多银行');
        }else{
            list.show();
            that.addClass('open');
            that.find('span').text('收起');
        }
    });
    // 设置上次支付过的银行
    var old_bank = $('#default_bank'),
        bankList = bankList_wrap.find('input[name="bank_id"]');
    // 根据上次支付的银行设置默认银行
    if(old_bank.val() != ''){
        bankList.each(function(){
            var that = $(this), tp = that.attr('paytype'), id = that.attr('payid');
            if(that.val() == old_bank.val() && tp == old_bank.attr('paytype')){
                var defalut_bank_dom = that.parent().html();
                $('.hasCkecked li').html(defalut_bank_dom);
                $('.hasCkecked li').find('input').prop('checked', true);
            }
        });
        $('.hasCkecked').show();
        $('.paylists:not(.hasCkecked)').hide();
    }else{
        $('.hasCkecked').hide();
        $('.paylists:not(.hasCkecked)').show();
    }
    // 选择其他银行的点击事件
    $('#chose_other').on('click', function(){
        bankList.each(function(){
            var that = $(this), tp = that.attr('paytype'), id = that.attr('payid');
            if(that.val() == old_bank.val() && tp == old_bank.attr('paytype')){
                that.prop('checked', true);
            }
        });
        $('.hasCkecked').hide();
        $('.paylists:not(.hasCkecked)').show();
    });
}
//设置代金卡列表高度
function setCardListWrapHeight(){
    var card_list = $('#card_list input:checkbox');
    if(card_list.length <= 5){
        $('.table_card_scroll').height('auto');
    }else{
        $('.table_card_scroll').height(205);
    }
}


/**
 * [updateAddress description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 *
 *  value="100372"
    data-username="李丽" 
    data-province="1" 
    data-city="1" 
    data-county="8" 
    data-area="北京市市辖区海淀区" 
    data-address="北京市海淀区中关村大街32号和盛大厦808" 
    data-zipcode="100010" 
    data-phone="15110217302" 
 */
$('#container').on('click', '.order_address li', function(event) {
   $(this).addClass('current').siblings().removeClass('current');
   $('.info_from').hide();
   $('#addid_0').removeAttr('checked','checked');
});
$('.order_address').on('click', '.detted a', function(event) {
     $(this).parents('li').remove();
     $('.info_from').hide();
});
function delAddress(id) {
    var _data = id;
    //var _die =$('.address_list li').attr('id');
   //$('.address_list li#' + _die).remove();
   $.ajax({
       url: '/ShoppingCart/delStuAddress',
       type: 'POST',
       dataType: 'json',
       data: {id: _data},
       success:function(result){
        var resData = xue.ajaxCheck.JSON(result);
       }
   })
   
}
function updateAddress(id){
    $(addressInput).removeClass('error');
    $('.error_tips_address').empty();
    
    var box = $('#addid_' + id);
    if(box.length == 0){ return ; }

    box.prop('checked', true);

    var data = box.data();
    var inputs = $(addressInput);
    // renderAreaSelect();

    inputs.each(function(){
        var _id = this.id;
            _id = _id.replace('add_','');

        if(this.id == 'add_province' || this.id == 'add_city' || this.id == 'add_country'){

            $(this).find('option[value="' + data[_id] + '"]').prop('selected', true);
            
            $('#' + _id).val(data[_id]);

        }else{
            $(this).val(data[_id]);
        }
    });
    renderAreaSelect();
 
    $('#add_id').val(id);
    var newAddress = $('#details-form');
    newAddress.show();
   
}

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
                    +'      id="addid_$id$" checked=true'
                    +'      style="display:none;"'
                    +'  />'
                    +'  <p class="name">$realname$</p>'
                    +'  <p class="address">$province_text$ $city_text$ $country_text$</p>'
                    +'  <p class="address_con">$address$</p>'
                    +'  <p>$phone$</p>'
                    +'  <span class="eidt"><a href="javascript:updateAddress($id$);">修改</a></span>'
                    +' <span class="detted"><a href="javascript:void(0);" onclick="delAddress($id$)">删除</a></span>'
                    +'</label>';

    var o = {
        id : data.id,
        realname : data.realname,
        province_id : data.province,
        city_id : data.city,
        country_id : data.country,
        address : data.address,
        zipcode : data.zipcode,
        phone : data.phone
    };
  
    $.ajax({
        url : '/shoppingCart/saveStuAdds',
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
        
            if(result.type === 1){
                $('<li class="current">'+ tp + '</li>').prependTo('ul.address_list');
                 var _li = $('.address_list li');
                 var _index = _li.eq(0);
                _li.not(_index).removeClass('current');
            }else if(result.type === 2){
                $('#addid_'+data.id).parent().html(tp);
            }
          
            $('.info_from').hide();
           $('#addid_0').removeAttr('checked','checked');
        }
    });
}

//选择送货时间
$("#container").on('click', '.delivery_time li', function(event) {
    var that=$(this);
    $(this).addClass('current').siblings().removeClass('current');
});

//选择支付方式
$('#container').on('click', 'input.pay_type_select', function() {
    setAddressBox();//执行是否显示收货地址
    initPay();
    var that = $(this);
    var _web = $('.payment_bank_item'),
         _wc = $('.payment_content');//网上支付
        _del = $('.pay_on_delivery'),
        _con = $('.delivery_content'),//货到付款
        _bal  = $('#pay_type_select_balance');//余额
        if (that.val() == 1) {
            that.parents('.account_money').next('.payment_content').removeClass('hidden');
            _web.addClass('borderBlue');
            _del.removeClass('borderBlue');
            _con.addClass('hidden');
            _bal.removeAttr('disabled','disabled');
            document.getElementById('pay_type_select_balance').checked=true;
            
        }else{
             that.parents('.account_money').next('.delivery_content').removeClass('hidden');
              _del.addClass('borderBlue');
              _web.removeClass('borderBlue');
              _wc.addClass('hidden');
              _bal.attr('disabled','disabled');
              _bal.removeAttr('checked','checked');
        };
});
