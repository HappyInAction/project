/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 22:11:01
 * @version $Id$
 */

/**
    var PAGE_CONFIG = {
        ID: 'Index',
        MODULE:'UserHome',
        TITLE: '学习中心',
    };
 **/
var PAGE_CONFIG = PAGE_CONFIG || {};

PAGE_CONFIG.NAV_URL = '/data/Public.Nav.json';

$(function(){
//    document.title = PAGE_CONFIG.TITLE;
    dropdown.init();
    try{
        nav.init({
            dataUrl : PAGE_CONFIG.NAV_URL
            ,fixed : PAGE_CONFIG.NAV_FIXED || false
        });
    }catch(e){}
    try{
        sidebar.setActive(PAGE_CONFIG.ID);
    }catch(e){}
    try{
        sideNav.setActive(PAGE_CONFIG.ID);
    }catch(e){}
    
    $('.ui_follow').follow();
//    try{
//        subNav.setActive(PAGE_CONFIG.SUBJECT);
//    }catch(e){}
});
