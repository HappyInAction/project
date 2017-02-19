//bingphone绑定手机验证
//time:2014-08-14
//neme:liuyanbin
// 更新验证码图片
	function changeVerificationImg(imgId) {
		var newVerificationImg = '/verifications/show?' + generateMixed(12);
		$('img[id="' + imgId + '"]').attr('src', newVerificationImg);
	}
 
	// 生成随机字符串
	function generateMixed(n) {
		var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		var res = "";
		for(var i = 0; i < n ; i ++) {
			var id = Math.ceil(Math.random() * 35);
			res += chars[id];
		}
		return res;
	}
	function checkImgCode(){
		var v = $('#verificationCode').val();
		if(v == ''){
			xue.formCheck.setTips('verificationCode', '请输入校验码');
			return false;
		}
		// if(!/^[1-9]\d*|0$/.test(v)){
		if(!/^[a-zA-Z0-9]{4,4}$/.test(v)){
			xue.formCheck.setTips('verificationCode', '校验码错误，请重新输入');
			return false;
		}
		xue.formCheck.clearTips('verificationCode');
 
		var url = '/MyInfos/getVerificationCode/';
		$.ajax(url, {
			type : 'POST',
			data : {verifyCode: v},
			dataType : 'json',
			success  : function(result){
                
				if(result.sign == 1){
					xue.formCheck.clearTips('verificationCode');
				}else{
					xue.formCheck.setTips('verificationCode', result.msg);
				}
			}
		});
		return true;
	}

	/* 获取验证码部分 */
	var fromCode = fromCode || {};
	(function(){
		var f = fromCode;
 
		f.time = 90;
 
		f.interval = null;
 
		f.box = '#vcode';
 
		f.cls = { btn : 'vcode', count : 'vcode_countdown' };
 
		f.count = function(){
			var that = this, box = $(that.box);
			//        f.box.form = box.parents('form');
			if(box.length == 0){ return; }
			that.clear();
			box.addClass(that.cls.count).text('90秒后重新获取');
			//        $('#phone').prop('readonly', true);
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
					$('.msg_tip').show();
					$('.get_phonecode').css('height','30px');
				}else{
					that.clear();
					box.removeClass('vcode_countdown');
					changeVerificationImg('verificationImg');
					$('#verificationCode').val('');
					$('.msg_tip').hide();
					$('.get_phonecode').css('height','50px');
				}
			}, 1000);
		};
 
		f.clear = function(){
			var that = this, box = $(that.box);
			if(box.length == 0){ return; }
 
			that.time = 90;
			clearInterval(that.interval);
			//        $('#phone').prop('readonly', false);
			box.removeClass().addClass(that.cls.btn).text('获取短信验证码');
			$('#vcode_mask').remove();
		};
    
	})()
 
	$(function(){
		changeVerificationImg('verificationImg');
		$('#phone, #phonecode').off('blur').on('blur', function(){
			var that = $(this), id = this.id;
			var check = xue.formCheck;
			check.box[id] = that;
			check[id]();
      
			if(id == 'username'){
				check.username( that.val(), function(){
					$.ajax({
						type: "POST",
						url: "/user/aCheckEmail",
						data: 'email=' + $('#username').val(),
						dataType: "json",
						timeout: 7000,
						success: function(result) {
							if (result.sign == false) 
							{
								check.setTips('username', result.msg, 'error');
							}       
							else
							{
								check.setTips('username', result.msg, 'success');
							}
						},
						error: function() {
							alert('数据读取错误,请重试..');
							return false;
						}
					});
				});
			}
			check.isError();
		});
 
		$('.getCode').on('click', '.vcode', function(){
			var check = xue.formCheck;
			var vcode = xue.formCheck.vcode;
			fromCode.clear();
			check.box.phone = $('#phone');
			if(check.phone() && checkImgCode()){
				fromCode.box = $(this);
				var url = '/user/getPassCode';
				$.ajax(url, {
					type : 'POST',
					dataType : 'json',
					data : {phone: $('#phone').val(),code:$('#verificationCode').val()},
					error : function( a, b, c, d ){
						xue.alert(d);
					},
					success : function( result ){
                                
						var msg = xue.ajaxCheck.JSON(result);
						if(msg){
							$('.get_phonecode').show();
							fromCode.count();
							$('#phonecode').prop('readonly',false);
						}else{
							changeVerificationImg('verificationImg');
							$('#verificationCode').val('').focus();
						}
					}
				});
			}
		});
		//验证验证码是否正确
		$('#verificationCode').on('blur',function(){
			checkImgCode();
		});
	}); 
 
	
	//绑定验证码弹窗展示
	function phoneLayer(data) {
        var html = '<div class="phone_tipe_text">亲爱的学员：不绑定手机您将无法收到直播辅导提醒，老师的各种学习提醒您也会全部错过，请三思而后行哦！</div>'
            +'<div class="content_phone" id="form_register">'
            +'    <p>'
            +'        <label for="phone" placeholder="手机号"> <i>*</i>手机号</label>'
            +'        <input id="phone" name="phone" type="text" />'
            +'       <span id="tips_phone" class="tips"></span>'
            +'    </p>'
            +'<p class="getCode">'
            +'     <label> <i>*</i>校验码</label>'
            +'     <input type="hidden" id="strength" name="strength" value="" />'
            +'     <input type="text" maxlength="4" id="verificationCode" class="yzm_kuang"  name="verificationCode" />'
            +'     <span class="imgCodeWrap">'
            +'           <img height="20" width="60" id="verificationImg" alt="验证码" src=""  onClick=\"changeVerificationImg(\'verificationImg\'); return false;\" title="(看不清，换一张)">'
            +'     </span>' 
            +'      <span class="vcode" id="vcode">获取短信验证码</span>'  
            +'      <span id="tips_verificationCode" class="tips"></span>'
		
            +'</p>'
            +'<p class="get_phonecode">'
            +'    <label for="phonecode" placeholder="密码"><i>*</i>短信验证码</label>'
            +'    <input id="phonecode" name="code" type="text" readonly="true" />'
            +'    <span id="tips_phonecode" class="tips"></span>'
            +'</p>'
            +' <p class="msg_tip" style="display: none;height:20px;color:#999;">'
            +'     <label for=""></label>'
            +'      目前获取验证码用户较多，您的验证码已经在路上，请耐心等待。'
            +'</p>'
            +'<p class="btn_submit_phone">'
			+'     <label for=""></label>'
            +'<button class="btn btn_blue" type="submit" name="savebtn"  onClick="submitBindPhone();">提交</button>'
            +'</p>'
            +'</div>'
            +'<div id="phoneCheckBox"><input name="" id="noTip" type="checkbox" onclick="submitTip();"/>我已经知道了，暂时不用提示</div>';
        xue.win({
            id : 'phoneCode',
            title : '绑定手机提示',
            content : html,
            lock : true,
            close : true,
            submit : false,
            cancel : false,
            width:500,
            height:310
        });
        $('#phone').val(data);
	}	