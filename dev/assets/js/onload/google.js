/**
 * Created by ozknemoy on 22.11.2016.
 */

var local = /localhost/i.test(location.href);if(!local)(function(){ var widget_id = 'QUrXxvaX0D';var d=document;var w=window;function l(){var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);}if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
//https://browser-update.org/ru/#test-bu
var $buoop = {vs:{i:9,f:-9,o:-9,s:6,c:-9},api:4,reminder:24,text:"Ваш браузер устарел. Чтобы обновить его, нажмите здесь. Мобильная версия сайта тестировалась на браузере chrome"};//<a href=\"http://browsehappy.com/\">Обновите свой браузер</a>
function $buo_f(){var e = document.createElement("script");e.src = "//browser-update.org/update.min.js";document.body.appendChild(e);}try {document.addEventListener("DOMContentLoaded", $buo_f,false)} catch(e){window.attachEvent("onload", $buo_f)}
