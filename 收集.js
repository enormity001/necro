function battleprc(e,f,a,l,t,o,i,r,g,n,c){e:for(;;){if(flag){flag=!1;var s=images.findColorInRegion(captureScreen(),"#ffffcc",1805+xoff,238,10,6);flag=!0}if(s){if(log("found simple"),s=void 0,i){if(global.teamflag=!1,i=!1,flag){for(flag=!1;!images.findColorInRegion(captureScreen(),"#ffffff",teamregion[0]+teamx*r,teamregion[1],teamregion[2],teamregion[3]);)click(258+xoff,582),sleep(500);flag=!0}log("队伍设置成功")}if(a){if(a=!1,flag){switch(flag=!1,l){case 0:for(;!images.detectsColor(captureScreen(),"#ffffff",1489+xoff,1009,threshold=20);)click(1371+xoff,964),sleep(400);log("调速为1x");break;case 1:for(;!images.detectsColor(captureScreen(),"#e85533",1570+xoff,1017,threshold=20);)click(1371+xoff,964),sleep(400);log("调速为2x");break;case 2:default:for(;!images.detectsColor(captureScreen(),"#f85533",1558+xoff,1014,threshold=20);)click(1371+xoff,964),sleep(400);log("调速为3x")}flag=!0}log("调速成功")}if(click(1798+xoff,999),log("open battle"),g&&(log("检测副本超时中"),flag)){if(flag=!1,images.findColorInRegion(captureScreen(),"#888888",1888+xoff,998,5,3)){for(back(),log("已超时");!images.findMultiColors(images.captureScreen(),"#88dddd",[[-18,-19,"#88dddd"],[58,28,"#88dddd"]],{region:[2105+xoff,182,6,6]});)sleep(1e3);flag=!0;break e}flag=!0}if(aporticket){var d=threads.disposable(),p=threads.start(function(){var e=new Date;f:for(;new Date-e<4500;){var f=0;if(flag){flag=!1;var a=images.findMultiColors(captureScreen(),"#ffffff",[[-4,-7,"#020202"],[-647,94,"#88dddd"],[-645,-477,"#88dddd"],[745,-476,"#88dddd"],[745,94,"#88dddd"]]);flag=!0}if(a){for(;!click(a.x,a.y);)a=void 0;for(;f<1;f++){for(;!images.detectsColor(captureScreen(),"#ffffff",1489+xoff,1009,threshold=20);)click(1371+xoff,964),sleep(400);log("调速为1x"),click(1798+xoff,999),log("open battle");continue f}d.setAndNotify("back"),p.interrupt()}else log("ticket enough");sleep(497)}d.setAndNotify("undefined")});if("back"==d.blockedGet())for(;;){if(flag){flag=!1;var u=images.findMultiColors(images.captureScreen(),"#88dddd",[[-18,-19,"#88dddd"],[58,28,"#88dddd"]],{region:[2105+xoff,182,6,6]});flag=!0}if(u){log("回到人物列表"),u=void 0;break e}back(),sleep(400)}}else{var d=threads.disposable(),m=threads.start(function(){for(var e=new Date;new Date-e<5e3;){if(flag){flag=!1;var f=images.detectsColor(captureScreen(),"#ff5533",1609+xoff,137);flag=!0}if(f)if(A.interrupt(),recoverflag){for(log(f),click(1639+xoff,592),log("clicked use");;){if(flag){flag=!1;var a=images.detectsColor(captureScreen(),"#ff5533",1255+xoff,818,threshold=16);flag=!0}if(a)break;new Date-e>5e3&&(log("药吃完结束脚本"),exit()),sleep(199)}for(;!click(1759+xoff,530);)log("clicked max");for(;!click(1442+xoff,838);)log("clicked recover");d.setAndNotify("re"),m.interrupt()}else back(),sleep(500),back(),exit();else log("ap enough");sleep(497)}d.setAndNotify("null")}),A=threads.start(function(){var e=new Date;for(sleep(3);new Date-e<5e3;){if(flag){flag=!1;var f=images.findMultiColors(captureScreen(),"#ffffff",[[-647,94,"#88dddd"],[-647,-480,"#88dddd"],[747,-481,"#88dddd"],[747,94,"#88dddd"]]);flag=!0}f&&(m.interrupt(),click(f.x,f.y),f=void 0,log("close pop"),sleep(200),d.setAndNotify("break"),log("超时线程结束1"),A.interrupt()),log("not found pop"),sleep(597)}d.setAndNotify("null"),log("超时线程结束2")});if("re"==d.blockedGet()){bonusflag=storage.get("partflag3",!1);continue e}if("break"==d.blockedGet())break e}for(sleep(2e3);;){if(flag){flag=!1;var x=images.findMultiColors(captureScreen(),"#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]]);flag=!0}if(x){if(log(x),log("found esc"),x=void 0,t){switch(global.autoflag=!1,t=!1,o){case 0:var v=images.read("./still.jpg");break;case 1:default:var v=images.read("./autoskill.jpg")}if(flag){for(flag=!1;!images.findImageInRegion(captureScreen(),v,1700+xoff,50,153,36);)click(1786+xoff,68),sleep(500);flag=!0}v.recycle(),log("人物状态设置完成")}for(;;){if(flag){flag=!1;var k=images.findMultiColors(captureScreen(),"#ffffff",[[-174,24,"#ff6840"],[208,17,"#ff6840"],[-449,-160,"#ff5533"],[454,-154,"#ff5533"],[-681,-534,"#88dddd"],[706,-536,"#88dddd"]]);flag=!0}if(k){for(log("邮箱满了"),click(k.x,k.y),sleep(3e3),click(2043+xoff,68),sleep(3e3);!sell(););sellflag=!0;break e}if(flag){flag=!1;var C=images.findMultiColors(captureScreen(),"#ffffff",[[21,5,"#ffffff"],[-149,-993,"#ffff22"],[-2,-962,"#ffff22"]]);flag=!0}if(C){if(log("found next"),e){if(sleep(100),f){if(flag){for(flag=!1;!images.detectsColor(captureScreen(),"#88dddd",647+xoff,1037);)click(699+xoff,978),sleep(100);flag=!0}log("助战开启")}else{if(flag){for(flag=!1;!images.detectsColor(captureScreen(),"#666666",598+xoff,1037);)click(699+xoff,978),sleep(100);flag=!0}log("助战关闭")}e=!1}if(sleep(150),n){if(flag){flag=!1;var S=images.findMultiColors(images.captureScreen(),"#ff5533",[[-180,-965,"#ffff22"],[-33,-934,"#ffff22"]]);flag=!0}if(S){click(S.x,S.y),S=void 0;break e}click(1156+xoff,1006),log("restart battle"),bonusflag=storage.get("partflag3",!1);continue e}if(click(1156+xoff,1006),c){for(var y=new Date;new Date-y<1e3;){if(flag){flag=!1;var b=images.findMultiColors(captureScreen(),"#ffffcc",[[26,6,"#ffffcc"],[74,7,"#ffffcc"],[-21,10,"#ff5533"]],{region:[920+xoff,947,90,30],threshold:15});flag=!0}if(b){click(b.x,b.y+random(12,15)),b=null,bonusflag=storage.get("partflag3",!1);continue e}sleep(50)}log("rare end"),click(C.x,C.y),C=null;break e}bonusflag=storage.get("partflag3",!1);continue e}log("not found next"),press(1790+xoff,186,1),press(1825+xoff,186,1),sleep(400)}}else log("not found esc"),click(345+xoff,353);sleep(600)}}else if(log("not found simple"),bonusflag){if(flag){flag=!1;var I=images.findMultiColors(captureScreen(),"#95eaea",[[15,1,"#86dbdb"],[32,-2,"#88dddd"],[49,2,"#22ccdd"]],{threshold:20});flag=!0}if(I)click(I.x+random(5,10),I.y+random(5,10)),I=void 0,log("助战 选择完成");else{if(flag){flag=!1;var h=images.detectsColor(captureScreen(),"#88dddd",2098+xoff,883);flag=!0}h?click(498+xoff,761):press(2100+xoff,850,1)}}else click(409+xoff,227);sleep(700)}}function leftBlack(){var e=images.captureScreen(),r=e.height,t=0,i=r/2;if(1920==e.width)return 0;for(;t<e.width-1;){if(e.pixel(t,i)!=e.pixel(t+1,i))return 0==t?t:t+1;t++}return t+1}auto.waitFor(),images.requestScreenCapture(),sleep(300);var xoff=leftBlack()-246,sell=require("卖装备.js"),storage=storages.create("pref"),material1flag=storage.get("material1flag",!1),material2flag=storage.get("material2flag",!1),ticketfbflag=storage.get("ticketfbflag",!1),clearmaterialflag=storage.get("clearmaterialflag",!1),changecoins=storage.get("changecoins",!1),flag=!0,partflag=!0,bonusflag=storage.get("partflag3",!1),parttype=storage.get("partflag3",!1),speedtype=storage.get("speedtype1",2),speedflag=!0,autoflag=!0,autotype=2,teamflag=!0,teamtype=storage.get("teamtype2",1),teamregion=[269+xoff,166,16,16],teamx=43,overtimeflag=!0,rareflag=!0,sellflag=!1,timeflag=storage.get("timeflag9",!1),timelimit=60*(60*parseInt(storage.get("hour9",0))+parseInt(storage.get("minute9",0)))*1e3,dailyflag=storage.get("dailyflag",!1),aporticket=!(!ticketfbflag&&!clearmaterialflag),rarefb=!clearmaterialflag,time=new Date,timeflag=storage.get("timeflag9",!1),timelimit=60*(60*parseInt(storage.get("hour9",0))+parseInt(storage.get("minute9",0)))*1e3,recoverflag=storage.get("recoverflag8",!0);timeflag&&threads.start(function(){setInterval(function(){new Date-time>timelimit&&exit()},6e4)}),threads.start(function(){for(sleep(111);;){var e=images.read("./reline.jpg");if(flag){flag=!1;try{var f=images.findImageInRegion(captureScreen(),e,1442+xoff,710,87,41)}catch(e){flag=!0;continue}flag=!0}if(e.recycle(),f){log(f),click(f.x,f.y),log("open reline"),sleep(2e3);var a=images.read("./error.jpg");if(flag){flag=!1;var l=images.findImageInRegion(captureScreen(),a,1105+xoff,517,56,56);flag=!0}if(a.recycle(),l){for(log(l),click(l.x,l.y),log("click error");;){if(flag){flag=!1;try{var t=images.detectsColor(captureScreen(),"#7ae6f4",2094+xoff,78,thresholdd=15)}catch(e){flag=!0;continue}flag=!0}if(t)break;click(1112+xoff,512),sleep(2e3)}engines.execSciptFile("./收集.js"),exit()}else log("not found error")}else log("not found reline");sleep(19999)}});e:for(;;){if(flag){flag=!1;var evenoff=images.findMultiColors(images.captureScreen(),"#88dddd",[[-18,-19,"#88dddd"],[58,28,"#88dddd"]],{region:[2105+xoff,182,6,6]});flag=!0}if(!evenoff){var questImg=images.read("./quest.jpg");if(flag){flag=!1;try{var quest=images.findImageInRegion(captureScreen(),questImg,1869+xoff,972,137,65)}catch(e){flag=!0;continue}flag=!0}if(questImg.recycle(),!quest){log("not found quest"),back(),sleep(2e3);continue e}for(log(quest),click(quest.x,quest.y),quest=void 0,log("open quest"),sleep(1e3),click(1927+xoff,863),sleep(3e3);;){if(flag){flag=!1;var evenoff=images.findMultiColors(images.captureScreen(),"#88dddd",[[-18,-19,"#88dddd"],[58,28,"#88dddd"]],{region:[2105+xoff,182,6,6]});flag=!0}if(evenoff){log(evenoff),evenoff=void 0,log("found evenoff");break}log("not found evenoff"),click(1958+xoff,923),sleep(1e3)}}evenoff=void 0,sleep(1e3);f:for(;;){for(;;){if(flag){flag=!1;var evenoff=images.findMultiColors(images.captureScreen(),"#88dddd",[[-18,-19,"#88dddd"],[58,28,"#88dddd"]],{region:[2105+xoff,182,6,6]});flag=!0}if(evenoff){evenoff=void 0;break}sleep(300)}if(flag){flag=!1;var questbottom=images.detectsColor(captureScreen(),"#88dddd",2130+xoff,987);flag=!0}if(questbottom)for(;!images.detectsColor(captureScreen(),"#88dddd",2130+xoff,232);)click(2130+xoff,232),sleep(800);if(ticketfbflag)for(;;){var zeroticketimg=images.fromBase64("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");if(flag){flag=!1;var zeroticket=images.findImageInRegion(captureScreen(),zeroticketimg,1829+xoff,189,210,54);flag=!0}if(zeroticketimg.recycle(),zeroticket)zeroticket=void 0,log("装备票用完，退出脚本"),exit();else{if(flag){flag=!1;var ticketfb=images.findMultiColors(captureScreen(),"#101727",[[49,-1,"#ffffc8"],[-20,-1,"#032260"]]);flag=!0}if(ticketfb)click(ticketfb.x,ticketfb.y),ticketfb=void 0,battleprc(partflag,!1,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,!1,!1,!0);else for(;!swipe(1958+xoff,923,1958+xoff,600,400););}sleep(1e3)}if(dailyflag){if(flag){flag=!1;var daily=images.findMultiColors(captureScreen(),"#000000",[[7,0,"#ffffff"],[94,-4,"#ffffff"],[117,1,"#ffffcc"],[-170,21,"#ffffcc"]]);flag=!0}if(daily){for(;!click(daily.x,daily.y););if(log("open daily"),daily=void 0,global.dailyflag=!1,battleprc(!1,parttype,!1,2,!1,autotype,!1,teamtype,!1,!1,!0),sellflag){sellflag=!1;continue e}continue f}log("not found daily")}if(rarefb){if(flag){flag=!1;var rare=images.findMultiColors(captureScreen(),"#ffffcc",[[-56,6,"#ff5533"],[79,4,"#ffffcc"],[132,6,"#ff5533"],[-450,40,"#ffffff"]]);flag=!0}if(rare){for(log(rare);!click(rare.x,rare.y););if(log("open rare"),rare=void 0,battleprc(partflag,parttype,speedflag,2,!1,autotype,!1,teamtype,overtimeflag,!1,!0),sellflag){sellflag=!1;continue e}continue f}log("not found rare")}if(clearmaterialflag){if(flag){flag=!1;var ticket300=images.findMultiColors(captureScreen(),"#ffffc8",[[-4,-6,"#ffffc8"],[-5,6,"#ffffc8"],[-2,-1,"#2f7176"],[-1,1,"#aac5a7"]]);flag=!0}if(ticket300){if(log("找到门票本"),click(ticket300.x,ticket300.y),tticket300=void 0,log("刷材料"),battleprc(partflag,parttype,speedflag,2,autoflag,autotype,teamflag,teamtype,!1,!1,!0),log("材料用完"),sellflag){sellflag=!1;continue e}continue f}var red300img=images.fromBase64("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");for(log("未找到300票，开始下滑");!swipe(1958+xoff,923,1958+xoff,623,400););if(sleep(700),flag){flag=!1;var red300=images.matchTemplate(captureScreen(),red300img,{region:[1481+xoff,304,140,500]});flag=!0}red300img.recycle(),2==red300.points.length&&(log("票用完"),exit()),sleep(300)}if(material1flag){var material1img=images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAACEAAAAiCAYAAADRcLDBAAAABHNCSVQICAgIfAhkiAAABLBJREFUWIXNmEtonFUUx3/n3vtNJpnWtDaNVlMt9VVRhEhRQexGVNAiCG584a6i6EbpRnAlIm5cunChC8GCOzfiRmmVWhFLKVb6sIkvEtvGNCRN5vV99xwX32SSb/IaQrQemMVc7jnnf8/5n8eMjBzYbWyQmPMgDhFBRHDOEWPENCIaV9QL6/LmPKUb78BXtrSPmmNnyOam284R6drcukC4UpltTx2k96597bOLH7xE9ecjiBMIATRiWQZqiK0e7AAgSQ9h6/VIqa87ED19SHlT0dDATnqH9kDwxJBgWQr1xoo24swEOjuVp2rkwG4rDd3JwHNvU9493BWIjZCpz99n5ptPibNTuP/M6yqSc8IUa9bRRrUrJSFPIc63zyxtQKsCuik3iym0uCKLS9SVN+XG12C2K1cYeOFdem+/v302eegtaqcOY1mGqq7iXdHalZwz849aDGLg+XfYfN+TSE93BF2PxOlLXProdWpnjrXP/kecaEnj95+QUEJCaVUl8YHyLffi+wcXdEeOk01dwNboCVqbIc78XQQhoURpaA+usoXs8jizl8fXRO5KZZKBoQKI2umj1EdPdEVKv3UHvVt3kI6fI5uegD8OPmDV09/Z1ZBLn7xpo6/dbQ7v8pq7ihIsCWSTYzTHz3WtJAjmWsjV6K4zLBWdmwZV5LeDw2b1OpqmmBqS9CA+QWQhQIa0e4dzQvCe6D0GaKMBq/WFxWKGNWtYx1gPiUJ0AfMQLWPbE6/Sv++ZwpjeKMmmLjDx8RvUzn5fOHdpmncu565eywgxy3BJgnOuBaTIUmvWsLSJmS50c+uOBeIc0lNB/OprSzAzoipOhCRJcK4IYvrLD5n59hCxNk2SlDCNZI16nt+1Xjiwk8EX36O8aMYsew/AVDHncN7TGYn+x1+h/7EDWE5PoPtaEJE1u28bxPzUW44XEhIISQHaRreVQNpAnAdJMGvlcZGb5thZ0ouj+b5glqfBuitJ6anQe9te/DXb22e5iWIsAxoR5/MGJK4FaOFC+tcvVE9+3d4HVTOwSGu1mXe3LAjfv53SdbsKIJa7H8Qn4AOEkLO4o0Iqe/dT2bu/q5evKRZBJH9oEURA5gH4APLv9Qutz+UroO8AQQjgE9pgXHGg1U4dpnb2GDo3g2mGxQzTDJalajHXycBNbH7waZLBXTmI2izz6S+AEN+KQkjAJ61ILDjIJseoj54gzkxgaYplTSxrsJQPAugCEOdIHnoWKZXbtqxZBVOkMxKGgmUQpcWHzqmYfzcTdJ7ZqgXnYdsQleFHCNfegHiP6+snGdxFMrAzX5xbEq9Mos0a1jHwgqZzSCp5FGIvljXbq3iumUEzRRsNmmkTSRv4WC8YySZ+pbTjVirDj67cnMyonfuBdOJPrFnUd5hilpdelqVox5g1VbS1xpu2ekTHx9IGc8e/IJv4Y0UAV45+Rv30Uawxt0Q/LNwzNOqSRqKqqOY/77FFOe+Q6qkj9N3zMFLKo6mNKlqfJb0wQvXkV9TP/4jWZ5fVlfMv35xbdQENvfiknBM1Wr41xZT5gknTFMtSnKbLGluv5L/KJSeldx6LKbFZx8XY3pjmR71HUdmw/1Ta8g8pGrKwSjrUEwAAAABJRU5ErkJggg==");if(flag){flag=!1;var material1=images.findImageInRegion(captureScreen(),material1img,1365+xoff,297,500,650);flag=!0}if(material1img.recycle(),material1){for(log(material1);!click(material1.x,material1.y););if(log("open material1"),material1=void 0,battleprc(partflag,parttype,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,!1,rareflag,!1),sellflag){sellflag=!1;continue e}continue f}for(log("not found material1");!swipe(1958+xoff,923,1958+xoff,600,400););sleep(600)}if(material2flag){var material2img=images.fromBase64("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");if(flag){flag=!1;var material2=images.findImageInRegion(captureScreen(),material2img,1365+xoff,297,500,650);flag=!0}if(material2img.recycle(),material2){for(log(material2);!click(material2.x,material2.y););if(log("open material2"),material2=void 0,battleprc(partflag,parttype,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,!1,rareflag,!1),sellflag){sellflag=!1;continue e}continue f}for(log("not found material2");!swipe(1958+xoff,923,1958+xoff,600,400););sleep(600)}if(changecoins)for(;;){
var coinsimg=images.fromBase64("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");if(flag){flag=!1;var coins=images.findImageInRegion(captureScreen(),coinsimg,1868+xoff,330,210,600,.95);flag=!0}if(coins){if(flag){flag=!1;var exchange=images.findMultiColors(captureScreen(),"#666666",[[24,-3,"#020303"],[58,3,"#5f5f5f"],[138,3,"#88dddd"],[110,-2,"#888888"]]);flag=!0}if(exchange)log("coins交换完毕"),exit();else{for(click(coins.x,coins.y+90);!images.detectsColor(captureScreen(),"#ff5634",1241+xoff,902,threshold=15);)press(1505+xoff,652,4e3);for(click(1241+xoff,902);!images.detectsColor(captureScreen(),"#ff7045",1248+xoff,830,threshold=15);)click(1248+xoff,830)}}else for(;!swipe(1958+xoff,923,1958+xoff,600,400););sleep(1e3)}sleep(1e3)}}
