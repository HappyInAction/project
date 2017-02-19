;
! function(j) {
  var pn = 1, //滚屏数
      prepn = null, //上一屏
      playing = false, //正在运动
      height = 0,      //高度
      pause = false,   //暂停
      show = 1,        //当前屏 
      moveFn = {} ,
      animate = true;   //是否有动画效果
  var warp,arc,navdot,c1,a2,a3,a4,a5,adog,atitle,abg,b1,b2,b3,b4,b5,bdog,btitle,bbg,c1,c2,c3,c4,cdog,ctitle,cbg,d1,d2,d3,d4,ddog,dtitle,dbg;

  function init() { //初始化
    animate === true ? (initEle(),initHeight(),move()) : staticHtml();
    bindEvent()
    changeVerificationImg('verificationImg')
  }

  function isStatic() {  //判断是否是低版本ie或者移动端，取消动画
    var ua = navigator.userAgent;
    var rv = -1;
    if (!!window.ActiveXObject || "ActiveXObject" in window) { //IE10之前都有，IE11没有
      var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      re.exec(ua) != null ? rv = parseFloat(RegExp.$1) : rv = rv;
      rv >= 0 && rv <= 9 ? animate = false : animate = true;
    }
    if (isPhone()) {
      animate = false;
    }
  }
  function isChrome(){
    var ua = navigator.userAgent.toLowerCase();
    if(/chrome/ig.test(ua)){
      return true
    }else{
      return false
    }
  }

  function isPhone() {   //判断是否是移动端
    var flag = false;
    var ua = navigator.userAgent.toLowerCase();
    var app = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
    for (var i = 0; i < app.length; i++) {
      if (ua.indexOf(app[i]) > 0) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  function initHeight() { //初始化高度
    var h = j(window).height()
    height = h
    j('.row').css('height', h)
    j('.warp').velocity({translateY:-height*(pn-1)+'px'}, {duration: 0,easing: "ease-out",complete: null})
  }

  function staticHtml() { //无动画初始化html
    var con = j('.con'),
    nav = j('.scroll-nav');
    nav.css('display','none')
    j('body').css('overflow', 'auto');
    con.each(function() {
      j(this).addClass('no-animate')
    })
  }
  //监测滚轮事件函数
  var scrollFunc = function(event) {
    event = event || window.event
    dir = event.wheelDelta || event.detail
    // console.log('dir:' + dir)
    if(!isChrome()){
      dir % 120 == 0 ? dir = dir : dir = -dir
    }
    if (!playing && !pause) {
      if (dir < 0) {
        if (pn == 4) {
          return false
        }
        prepn = pn
        pn++
      } else {
        if (pn == 1) {
          return false
        }
        prepn = pn
        pn--
      }
      move()
    }
  }
  
  //键盘事件
  var keydownFunc = function(event) {
    event = event || window.event;
    var c = event.keyCode;
    if (c == 37 || c == 38 || c == 39 || c == 40) {
      event.preventDefault()
      if (playing || pause) {
        return false;
      }
      if (pn == 1 && c == 38) {
        return false;
      }
      if (pn == 4 && c == 40) {
        return false;
      }
      c == 38 ? (prepn = pn, pn--, move()) : (c == 40 ? (prepn = pn, pn++, move()) : 1 == 1)
    }
  }

  //点击事件
  function clickFunc(num){
    if(num == pn){
      return false;
    }
    if(playing || pause){
      return false;
    }
    prepn = pn;
    pn = num;
    move()
  }

  function showWin() { //开始弹窗
      var dur, size;
      pause = true;
      animate === false ? (dur = 0, size = 1) : (dur = 300, size = 0.3);
      j('.shade-mod').css('display', 'block');
      j('.shade-mod-top').css('display', 'block');
      j('.down-win').css('display', 'block').velocity({scale: size}, {duration: 0,easing: "ease-out",complete: function() {
        j('.down-win').velocity({scale: 1}, {duration: dur,easing: "ease-out",complete: function() {
              j('.shade-mod-top').css('display', 'none');
          }})
      }})
  }

 
  function closeWin() { //关闭弹窗
      var dur, size;
      animate === false ? (dur = 0, size = 1) : (dur = 300, size = 0.3);
      j('.shade-mod-top').css('display', 'block');
      j('.down-win').velocity({scale: size}, {duration: dur,easing: "ease-out",complete: function() {
          j(this).css('display', 'none');
          j('.shade-mod').css('display', 'none');
          j('.shade-mod-top').css('display', 'none');
          j('#phone_enter').val('');
          j('#verify_enter').val('');
          pause = false;
      }})
    }

  
  function bindEvent() {  //绑定事件
    if (animate) {
      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
      }
      window.onmousewheel = document.onmousewheel = scrollFunc;

      document.onkeydown = keydownFunc;

      navdot.click(function(){
        var num = parseInt(j(this).data('num'))
        // alert(num)
        clickFunc(num)
      })
      
      j(window).on('resize', function() {initHeight()});
    }
    j('.download-btn a.phone').click(function() {showWin()})

    j('.down-win .close').click(function() {closeWin()})

    j('a.send-msg').click(function() {sendMsg(j(this))})

    j('#verificationImg').click(function() {changeVerificationImg('verificationImg')})

    j('.shade-mod').click(function(){ closeWin() })
  }

  /*业务*/
  function changeVerificationImg(imgId) {   // 更新验证码图片
    var newVerificationImg = '/verifications/show?' + generateMixed(12);
    j('img[id="' + imgId + '"]').attr('src', newVerificationImg);
  }

  
  function generateMixed(n) {  // 生成随机字符串
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  }

  function sendMsg(b) { //发送短信
    var data = {
      phone: j('#phone_enter').val(),
      code: j('#verify_enter').val()
    };
    if (!b.hasClass('usual')) {
      return false
    }
    if (data.phone == '') {
      alert('请填写手机号')
      return false
    }
    if (!/^1[3|4|7|8]\d{9}$/.test(data.phone) && !/^15[0-35-9]\d{8}$/.test(data.phone)) {
      alert('请填写正确的手机号码')
      return false
    }
    if (data.code == '') {
      alert('请填写验证码')
      return false
    }
    if (!/^[a-zA-Z0-9]{4,4}$/.test(data.code)) {
      alert('请填写正确格式的验证码')
      return false
    }
    b.removeClass('usual')
    j.ajax({
      type: "POST",
      url: "/Jzhs/sendMsg",
      data: data,
      dataType: "json",
      success: function(result) {
        var sign = result['sign'];
        switch (sign) {
          case 0:
            alert(result['msg']);
            break;
          case 1:
            alert('短信已发送')
            break;
          default:
        }
        changeVerificationImg('verificationImg');
        j('#verify_enter').val('');
        b.addClass('usual')
      },
      error: function() {
        alert('网络连接异常,请稍后再试');
        return false;
      }
    });
  }
  //切屏运动函数
  function move(dir) {
    playing = true
    if (prepn == null) {
      moveFn.fn1In()
    } else {
      moveFn.screenMove();
      moveFn.nav();
      moveFn['fn' + prepn + 'Out']();
      moveFn['fn' + pn + 'In']();
    }
  }

   function initEle(){
    warp = j('.warp');
    arc = j('.scroll-nav span');
    navdot = j('.scroll-nav div');
    //第一屏
    a1 = j('.r1-p-1'); //蓝色气球
    a2 = j('.r1-p-2'); //紫色气球-活动通知
    a3 = j('.r1-p-3'); //粉色气球-学习动态
    a4 = j('.r1-p-4'); //青色气球-教师大一群
    a5 = j('.r1-p-5'); //说话框
    adoc = j('.r1-doc'); //第一屏老师
    atitle = j('.r1-title'); //第一屏标题
    abg = j('.r1-bg'); //第一屏北京

    //第二屏
    b1 = j('.r2-p-1'); //大伙箭
    b2 = j('.r2-p-2'); //小火箭
    b3 = j('.r2-p-3'); //漂浮的纸
    b4 = j('.r2-p-4'); //黑板
    b5 = j('.r2-p-5'); //指挥棒
    bdoc = j('.r2-doc'); //第二屏老师
    btitle = j('.r2-title'); //第二屏标题
    bbg = j('.r2-bg'); //第二屏背景

    //第三屏
    c1 = j('.r3-p-1'); //贴纸-孩子上周
    c2 = j('.r3-p-2'); //贴纸-金牌实验班
    c3 = j('.r3-p-3'); //贴纸-周三晚上
    c4 = j('.r3-p-4'); //喇叭
    cdoc = j('.r3-doc'); //第三屏老师
    ctitle = j('.r3-title'); //第三屏标题
    cbg = j('.r3-bg'); //第三屏背景

    //第四屏
    d1 = j('.r4-p-1'); //垃圾桶
    d2 = j('.r4-p-2'); //台灯
    d3 = j('.r4-p-3'); //闪电
    d4 = j('.r4-p-4'); //耳机
    ddoc = j('.r4-doc'); //第四屏老师
    dtitle = j('.r4-title'); //第四屏标题
    dbg = j('.r4-bg'); //第四屏北京

     moveFn = {
        nav:function(){
            arc.velocity({top:-11+(pn-1)*42+'px'}, {duration: 200,easing: "ease-out",complete: null})
        },
        screenMove:function(){
            (prepn < pn) && (pn - prepn > 1) ? warp.velocity({translateY:-height*(pn-2)+'px'}, {duration: 0,complete:function(){
                warp.velocity({translateY:-height*(pn-1)+'px'}, {duration: 200,easing: "ease-out",complete: null})
            }}) : ((prepn > pn) && (prepn - pn > 1) ? warp.velocity({translateY:-height*(pn)+'px'}, {duration: 0,complete:function(){
                warp.velocity({translateY:-height*(pn-1)+'px'}, {duration: 200,easing: "ease-out",complete: null})
            }}) : warp.velocity({translateY:-height*(pn-1)+'px'}, {duration: 200,easing: "ease-out",complete: null}));
        },
        fn1In: function() { //第一屏进入
          atitle.velocity({opacity:1}, {duration: 800,easing: "ease-out"})
          abg.velocity({translateY:'-160px',opacity:1}, {duration: 800,easing: "ease-out"})
          adoc.velocity({translateY:'133px',opacity:1}, {duration: 1000,easing: "ease-out",complete: function(){
            a1.velocity({translateY:'-71px',translateX:'-100px',opacity:1}, {duration: 800,easing: "ease-out",complete: function(){
               a5.velocity({translateY:'120px',translateX:'-87px',opacity:1}, {duration: 800,easing: "ease-out",complete:function(){
                playing == true ? playing = false :playing = playing
              }})
            }})
            a2.velocity({translateY:'-138px',translateX:'36px',opacity:1}, {duration: 750,easing: "ease-out",complete: null})
            a3.velocity({translateY:'-168px',translateX:'-86px',opacity:1}, {duration: 1000,easing: "ease-out",complete: null})
            a4.velocity({translateY:'-218px',translateX:'94px',opacity:1}, {duration: 1100,easing: "ease-out",complete: null})
          }})
        },
        fn1Out : function(){  //第一屏退出
          a1.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          a2.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          a3.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          a4.velocity({translateY:'-0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          atitle.velocity({opacity:0}, {duration: 500,easing: "ease-out"})
          adoc.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
          a5.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
          abg.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
        },
       fn2In : function(){   //第二屏进入
            btitle.velocity({opacity:1}, {duration: 800,easing: "ease-out"})
            b5.velocity({translateY:'100px',translateX:'-60px',opacity:1}, {duration: 1000,easing: "ease-out"})
            bdoc.velocity({translateY:'180px',opacity:1}, {duration: 800,easing: "ease-out",complete: function(){
            bbg.velocity({translateY:'-85px',opacity:1}, {duration: 800,easing: "ease-out"})
            b1.velocity({translateY:'-175px',translateX:'130px',opacity:1}, {duration: 1000,easing: "ease-out",complete:function(){
                playing == true ? playing = false :playing = playing
              }})
            b2.velocity({translateY:'-160px',translateX:'170px',opacity:1}, {duration: 800,easing: "ease-out",complete: null})
            b3.velocity({translateY:'-160px',translateX:'35px',opacity:1}, {duration: 600,easing: "ease-out",complete: null})
            // b3.velocity({top:'-50px',left:'-445px',opacity:1}, {duration: 600,easing: "ease-out",complete: null})
            b4.velocity({translateY:'-140px',translateX:'-160px',opacity:1}, {duration: 800,easing: "ease-out",complete: null})
          }})

        },
      fn2Out : function(){  //第二屏退出
          b1.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          b2.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          b3.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          b4.velocity({translateY:'-0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          btitle.velocity({opacity:0}, {duration: 500,easing: "ease-out"})
          bdoc.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
          b5.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
          bbg.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
        },
       fn3In : function(){   //第三屏进入
           ctitle.velocity({opacity:1}, {duration: 800,easing: "ease-out"})
           cbg.velocity({translateY:'-260px',opacity:1}, {duration: 800,easing: "ease-out",complete: function(){
            cdoc.velocity({translateY:'160px',opacity:1}, {duration: 600,easing: "ease-out"})
             c4.velocity({translateY:'-14px',translateX:'-210px',opacity:1}, {duration: 800,easing: "ease-out",complete:function(){
               c1.velocity({translateY:'-115px',translateX:'-210px',opacity:1}, {duration: 800,easing: "ease-out",complete: null})
               c2.velocity({translateY:'-80px',translateX:'90px',opacity:1}, {duration: 700,easing: "ease-out",complete: null})
               c3.velocity({translateY:'-80px',translateX:'80px',opacity:1}, {duration: 600,easing: "ease-out",complete:function(){
                playing == true ? playing = false :playing = playing
               }})
             }})
           }})

        },
       fn3Out : function(){  //第三屏退出
          c1.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          c2.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          c3.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          c4.velocity({translateY:'-0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          ctitle.velocity({opacity:0}, {duration: 500,easing: "ease-out"})
          cdoc.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
          cbg.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
        },
       fn4In : function(){   //第四屏进入
          d1.velocity({translateY:'0px',translateX:'135px',opacity:1}, {duration: 800,easing: "ease-out",complete: null})
          d2.velocity({translateY:'-120px',translateX:'-215px',opacity:1}, {duration: 800,easing: "ease-out",complete: null})
          d3.velocity({translateY:'-90px',translateX:'-280px',opacity:1}, {duration: 800,easing: "ease-out",complete: null})
          dtitle.velocity({opacity:1}, {duration: 800,easing: "ease-out"})
          dbg.velocity({translateY:'-160px',opacity:1}, {duration: 800,easing: "ease-out",complete: function(){
              ddoc.velocity({translateY:'210px',opacity:1}, {duration: 800,easing: "ease-out",complete: function(){
                d4.velocity({translateY:'163px',translateX:'0px',opacity:1}, {duration: 800,easing: "ease-out",complete:function(){
                playing == true ? playing = false :playing = playing
              }})
            }}) 
          }})
        },
       fn4Out : function(){  //第四屏退出
          d1.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          d2.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          d3.velocity({translateY:'0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          d4.velocity({translateY:'-0px',translateX:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete: null})
          dtitle.velocity({opacity:0}, {duration: 500,easing: "ease-out"})
          ddoc.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
          dbg.velocity({translateY:'0px',opacity:0}, {duration: 500,easing: "ease-out",complete:null})
      }
    }
  }

   isStatic() //判断是否有动画
  //页面即在完成
  j(document).ready(function() {
    init()
  })
}(window.jQuery)