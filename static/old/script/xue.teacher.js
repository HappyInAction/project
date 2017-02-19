//教师大赛
$(function(){
	function ajaxLoadClass() {
		if ($('#grades_mod').length == 1) {
			$.ajax({
				url: '/teacherContests/ajaxClass',
				type: 'post', //数据发送方式
				dataType: 'html', //接受数据格式 (这里有很多,常用的有html,xml,js,json)
				success: function(d) { //成功
					var resData = xue.ajaxCheck.HTML(d);
					if (resData) {
						$('#grades_mod').html(resData);
					}
				}
			});
		}
	}
// 班级投票
	$("#container").on('click', '.btn_votes a', function() {
		var that = $(this);
		var id = that.data('classid');
		var _number = $('#teacher_data_group .now_num').data('num');
		$.ajax({
			url: '/teacherContests/ajaxClassVote',
			type: 'post', //数据发送方式
			dataType: 'json', //接受数据格式
			data: {
				num: _number,
				classId: id,
			}, //要传递的数据
			success: function(d) { //成功
				var resData = xue.ajaxCheck.JSON(d);
				if (resData) {
					//that.find('img').attr('src','http://img04.xesimg.com/teacher/banjitoupiao_02.jpg');
					ajaxLoadClass();
					alert(resData);
				}
			}
		});

	});
//班级关注
	$("#container").on('click','.right_mod ul.people_list li span.toupiao:not(.follow_cancel)', function() {
		var that = $(this),
			id = that.data('id');
		$.ajax({
			url: '/TeacherContests/ajaxFollow',
			type: 'post', //数据发送方式
			dataType: 'json', //接受数据格式
			data: {
				folId: id,
				type: 1 //1代表添加关注2取消关注
			}, //要传递的数据
			success: function(d) { //成功
				var resData = xue.ajaxCheck.JSON(d);
				if (resData) {
					that.addClass('follow_cancel');
				}
			}
		});

	});
// 班级投票

if ($('#grades_mod').length == 1) {
	ajaxLoadClass();//班级老师投票
}

	
	getTeacherData();
	postTeacherData();
	getTeacherFow();
	getTeacherTema();//老师队长页关注
	getTeacherInfor();//老师详情页关注

	function tabs(tabTit, on, tabCon) { //tabs
		$(tabTit).children().hover(function() {
			$(this).addClass(on).siblings().removeClass(on);
			var index = $(tabTit).children().index(this);
			$(tabCon).children().eq(index).show().siblings().hide();
		});
	}
	tabs('.tabs_teacher', 'current', '#tabs_teacher_class');
	//往期回顾
	$('.review_list li').click(function() {
		$(this).addClass('current').siblings().removeClass('current');
		var _data = $(this).data('params');
		var _number = $('#teacher_data_group .now_num').data('num');
		$.ajax({
			url: '/TeacherContests/ajaxHistory',
			type: 'post', //数据发送方式
			dataType: 'html', //接受数据格式 (这里有很多,常用的有html,xml,js,json)
			data: 'num='+ _number + '&' +_data, //要传递的数据
			success: function(d) { //成功
				var resData = xue.ajaxCheck.HTML(d);
				if (resData) {
					$('#judgeContent').html(resData);
				}
			}
		});
	});
	// 投票
	$(".pk_guan .btn_vote:not(.vote_cancel)").on('click', function() {
		var that = $(this),
			id = that.data('userid');
		var datVot = $('#teacher_data_group .teacher_data').data('phase');
		//xue.log(datVot);
		var par = that.parents('.teacher_pk_content'),
			group = par.index();
		$.ajax({
			url: '/TeacherContests/ajaxVote',
			type: 'post', //数据发送方式
			dataType: 'json', //接受数据格式
			data: {
				groupId: group,
				teacherId: id,
				num: datVot
			}, //要传递的数据
			success: function(d) { //成功
				var resData = xue.ajaxCheck.JSON(d);
				if (resData) {
					that.addClass('vote_cancel');
					var num = $(that).parent('.pk_guan').prev('.pk_name').find('.num');
					num.text(Number(num.text()) + 1);
					// num.text(resData);
					alert(resData);
				}
			}
		});

	});

	// 关注
	$(".judge_pk .btn_follow:not(.follow_cancel)").on('click', function() {
		var that = $(this),
			id = that.data('userid');
		var par = that.parents('.teacher_pk_content'),
			group = par.index();
		$.ajax({
			url: '/TeacherContests/ajaxFollow',
			type: 'post', //数据发送方式
			dataType: 'json', //接受数据格式
			data: {
				folId: id,
				type: 1 //1代表添加关注2取消关注
			}, //要传递的数据
			success: function(d) { //成功
				var resData = xue.ajaxCheck.JSON(d);
				if (resData) {
					that.addClass('follow_cancel');
				}
			}
		});

	});

	//首页新鲜事关注
		$('.right_title .btn_follows:not(.follows_cancel)').click(function() {
			var _dat = $(this).data("id");
			$.ajax({
				url:'/TeacherContests/ajaxFollow',
				type:'post', //数据发送方式
				dataType:'json', //接受数据格式
				data: {
					folId : _dat,
					type : 1 //1代表添加关注2取消关注
				}, //要传递的数据
				success: function(d){ //成功
					var resData = xue.ajaxCheck.JSON(d);
					if(resData){
						$('.btn_follows').addClass('follows_cancel');
					}
				}
			});
		});

	//队长关注
	$('.captain_title .btn_follows:not(.follows_cancel)').click(function() {
		var _dat = $(".home_fol").data("id");
		$.ajax({
			url: '/TeacherContests/ajaxFollow',
			type: 'post', //数据发送方式
			dataType: 'json', //接受数据格式
			data: {
				folId: _dat,
				type: 1 //1代表添加关注2取消关注
			}, //要传递的数据
			success: function(d) { //成功
				var resData = xue.ajaxCheck.JSON(d);
				if (resData) {
					$('.btn_follows').addClass('follows_cancel');
				}
			}
		});
	});

	//老师详情页关注
	$('.teacherInfor .pk_guan .btn_follow:not(.follow_cancel)').click(function() {
		var _dat = $(".home_fol").data("id");
		var that = $(this);
		if (that.hasClass('follow_cancel')) {
			return;
		}
		$.ajax({
			url: '/TeacherContests/ajaxFollow',
			type: 'post', //数据发送方式
			dataType: 'json', //接受数据格式
			data: {
				folId: _dat,
				type: 1 //1代表添加关注2取消关注
			}, //要传递的数据
			success: function(d) { //成功
				var resData = xue.ajaxCheck.JSON(d);
				if (resData) {
					that.addClass('follow_cancel');
				}
			}
		});
	});

	// 计算评论字数
    $('.teacher_comment_content').off('keyup', '.comment_textarea textarea').on('keyup', '.comment_textarea textarea', function(){
        var that = $(this);
        xue.use('comment', function(){
            setTimeout(function(){
                xue.comment.countsize(that);
            }, 10);
        });
    });
	$('.review_list li:eq(0)').click();
	
});


function getTeacherFow (d) {
	var that = $(".right_title .btn_follows");
	var _stat = that.data("stat");
		if(_stat == 1){
			that.addClass('follows_cancel');
		}else{
			that.removeClass('follows_cancel');
		}
}

function getTeacherTema (d) {
	var that = $(".captain_title .btn_follows");
	var _stat = $(".home_fol").data("stat");
		if(_stat == 1){
			that.addClass('follows_cancel');
		}else{
			that.removeClass('follows_cancel');
		}
}
function getTeacherInfor (d) {
	var that = $(".teacherInfor .pk_guan .btn_follow");
	var _number =  $(".teacherInfor .num");
	var _num =$(".home_vote_num").data("num");
	_number.text(_num);
	var _stat = $(".home_fol").data("stat");
		if(_stat == 1){
			that.addClass('follow_cancel');
		}else{
			that.removeClass('follow_cancel');
		}
}


function getTeacherData(d){
	var group = $('.teacher_pk_content');
	var datas = $('#teacher_data_group .teacher_data');
	datas.each(function(){
		var that = $(this), d = that.data();
		var box = group.eq(d.group -1);
		if(box.length > 0){
			var item = box.find('.judge_pk').eq(d.ranking -1);
			if(item.length > 0){
				// 人气数
				item.find('.pk_name .num').text(d.num);
				
				var btn = item.find('.pk_guan');
				// 投票
				var btn_vote = btn.find('.btn_vote');
				if(d.vote == 1){
					btn_vote.addClass('vote_cancel');
					btn_vote.data('userid', d.id);
				}else{
					btn_vote.removeClass('vote_cancel');
					btn_vote.data('userid', d.id);
				}

				// 关注
				var btn_follow = btn.find('.btn_follow');
				if(d.fol == 1){
					btn_follow.addClass('follow_cancel');
				}else{
					btn_follow.removeClass('follow_cancel');
					btn_follow.data('userid', d.id);
				}
				// 老师头像
				item.find('.pk_pic img').attr('src', d.img);
				item.find('.pk_pic a').attr('href', d.url);
				// 老师名字
				item.find('.pk_name .name a').text(d.name);
				item.find('.pk_name .name a').attr('href', d.url);
			}
		}
	});

}


function postTeacherData(d){
	var group = $('.teacher_pk_content_item');
	var datas = $('#home_data_group .home_data');
	datas.each(function(){
		var that = $(this), d = that.data();
	    var _index = that.index();
			var item = group.find('.judge_pk').eq(_index-3);
				// 人气数
				item.find('.pk_name .num').text(d.num);
				var btn = item.find('.pk_guan');
				// 投票
				var btn_vote = btn.find('.btn_vote');
				if(d.vote == 1){
					btn_vote.addClass('vote_cancel');
					btn_vote.data('userid', d.id);
				}else{
					btn_vote.removeClass('vote_cancel');
					btn_vote.data('userid', d.id);
				}

				// 关注
				var btn_follow = btn.find('.btn_follow');
				if(d.fol == 1){
					btn_follow.addClass('follow_cancel');
				}else{
					btn_follow.removeClass('follow_cancel');
					btn_follow.data('userid', d.id);
				}
				// 老师头像
				item.find('.pk_pic img').attr('src', d.img);
				item.find('.pk_pic a').attr('href', d.url);
				// 老师名字
				item.find('.pk_name .name a').text(d.name);
				item.find('.pk_name .name a').attr('href', d.url);
	});

}



jQuery(function(){
        jQuery('.qrcode').append('<div class="hit_qrcode"><a href="javascript:void(0)" class="close" title="关闭"></a></div>');
        jQuery('.qrcode .close').on('click', function() {
            jQuery('.qrcode').remove();
        });
    });