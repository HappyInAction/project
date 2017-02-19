(function() {
	var ua = navigator.userAgent.toLowerCase();
	var isjzh = !!/jzh/i.test(ua);
	var isaxh = !!/axh/i.test(ua);
	var iswx = !!/MicroMessenger/i.test(ua);
	var isan = !!/android|Linux/i.test(ua);
	var aclick = $('.datum_download a');
	var href = aclick.length == 0 ? null : aclick.attr('href');
	var tpltop = '<a class="fixed_content" href="http://click.hm.baidu.com/app.gif?ap=45924&ch=16557&au=http%3A%2F%2Fjzh.xueersi.com%2Fd" target="_blank">' + '<img src="http://static.xesimg.com/images/parents_chat_icon.png" alt="">' + '<div class="info_content">' + '<div class="info_title">家长会</div>嘘，老师正在分享牛孩培养诀窍!</div>' + '<span>立即加入</span>' + '</a>';
	var tplbottom = '<a class="bottom_link" href="http://click.hm.baidu.com/app.gif?ap=45924&ch=16558&au=http%3A%2F%2Fjzh.xueersi.com%2Fd" target="_blank">喜欢这个吗？下载家长会，发现更多精彩</a>';
	var w = $(window).width();
	//console.log(ua);
	if (!isjzh && !isaxh && w <= 720) {
		var first = $('.article_main').children().eq(0);
		var last = $('.article_main').children().last();
		$('.article_main').css('padding-top', 48);
		first.before(tpltop);
		last.after(tplbottom);
	}
	if (href && isan && iswx && !/\.png/i.test(href) && !/\.jpg/i.test(href) && !/\.gif/i.test(href)) {
		var style = '<style>.text-danger{color:#a94442;}.speech{width:60%;position:fixed;top:9px;right:10px;background:#f5f5dc;padding:10px;border-radius: 7px 7px 7px 7px;z-index:5000;}.speech .right-top{position:absolute;right:10px;top:-7px;border-left: 7px solid transparent;border-right: 7px solid transparent;border-bottom: 7px solid #f5f5dc;}</style>';
		var tpl = '<p class="speech"><span class="right-top"></span>我很努力，但微信不让下载。<br />请点击<span class="text-danger">右上角</span>，选择“<span class="text-danger">在$there$中打开</span>”就能下载了。</p>';
		$('head').append(style);
		aclick.on('click', function() {
			$('.speech').length == 0 ? (tpl = tpl.replace(/\$there\$/i, '浏览器'), $('body').append(tpl)) : tpl = tpl;
		})
	}
})()
