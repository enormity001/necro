function leftBlack(){var e=images.captureScreen(),l=e.height,f=0,a=l/2;if(1920==e.width)return 0;for(;f<e.width-1;){if(e.pixel(f,a)!=e.pixel(f+1,a))return 0==f?f:f+1;f++}return f+1}events.on("exit",function(){events.broadcast.emit("done",3)}),auto.waitFor(),images.requestScreenCapture(),sleep(300);var flag=!0,xoff=leftBlack()-246,storage=storages.create("pref"),autoflag=!0,teamregion=[269+xoff,166,16,16],teamx=43,Recoverflag=storage.get("Recoverflag",!1),teamflag=storage.get("teamflag",!1),teamtype=storage.get("teamtype3",0),recoverflag=storage.get("recoverflag3",!1),helpflag=storage.get("helpflag1",!1),helptype=storage.get("forhelp1",0),autotype=storage.get("autotype1",1),timeflag=storage.get("timeflag3",!1),timelimit=60*(60*parseInt(storage.get("hour3",0))+parseInt(storage.get("minute3",0)))*1e3,stuckorloseflag=storage.get("stuckorloseflag",!1),time=new Date;for(Recoverflag&&(recoverflag=!1),storage.put("Recoverflag",!1),timeflag&&threads.start(function(){setInterval(function(){new Date-time>timelimit&&exit()},6e4)}),threads.start(function(){for(sleep(111);;){var e=images.read("./reline.jpg");if(flag){flag=!1;try{var l=images.findImageInRegion(captureScreen(),e,1442+xoff,710,87,41)}catch(e){flag=!0;continue}flag=!0}if(e.recycle(),l){log(l),click(l.x,l.y),log("open reline"),sleep(2e3);var f=images.read("./error.jpg");if(flag){flag=!1;var a=images.findImageInRegion(captureScreen(),f,1105+xoff,517,56,56);flag=!0}if(f.recycle(),a){for(log(a),click(a.x,a.y),log("click error");;){if(flag){flag=!1;try{var o=images.detectsColor(captureScreen(),"#7ae6f4",2094+xoff,78,thresholdd=15)}catch(e){flag=!0;continue}flag=!0}if(o)break;click(1112+xoff,512),sleep(2e3)}engines.execSciptFile("./普协开车.js"),exit()}else log("not found error")}else log("not found reline");sleep(9999)}});;){var questImg=images.read("./quest.jpg");if(flag){flag=!1;var quest=images.findImageInRegion(captureScreen(),questImg,1869+xoff,972,137,65);flag=!0}if(questImg.recycle(),quest){log(quest),click(quest.x,quest.y),quest=null,log("open quest");break}log("not found quest"),back(),sleep(1500)}for(sleep(1e3),click(1927+xoff,546),sleep(2e3);;){var homeImg=images.read("./home.jpg");if(flag){flag=!1;var home=images.findImageInRegion(captureScreen(),homeImg,2015+xoff,50,63,37);flag=!0}if(homeImg.recycle(),home){home=null,click(1943+xoff,409),log("open hell raid");break}log("not found home"),sleep(1e3)}sleep(1e3);e:for(;;){var limithellImg=images.read("./limithell.jpg");if(flag){flag=!1;var limithell=images.findImageInRegion(captureScreen(),limithellImg,1299+xoff,321,49,46);flag=!0}if(limithellImg.recycle(),limithell)for(click(limithell.x,limithell.y),log("open limithell "),limithell=null,sleep(2e3);;){if(flag){flag=!1;var simple=images.findColorInRegion(captureScreen(),"#ffffcc",1805+xoff,238,10,6);flag=!0}if(simple){if(log("found simple"),simple=null,teamflag){if(global.teamflag=!1,teamflag=!1,flag){for(flag=!1;!images.findColorInRegion(captureScreen(),"#ffffff",teamregion[0]+teamx*teamtype,teamregion[1],teamregion[2],teamregion[3]);)click(258+xoff,582),sleep(500);flag=!0}log("队伍设置成功")}click(1873+xoff,997),log("open battle");var loopflag=threads.disposable(),recoverthread=threads.start(function(){for(var e=new Date;new Date-e<5e3;){if(flag){flag=!1;var l=images.detectsColor(captureScreen(),"#ff5533",1609+xoff,137);flag=!0}if(l)if(recoverflag){for(log(l),l=null,click(1639+xoff,592),log("clicked use");;){if(flag){flag=!1;var f=images.detectsColor(captureScreen(),"#ff5533",1255+xoff,818,threshold=16);flag=!0}if(f){f=null;break}new Date-e>5e3&&(log("药吃完结束脚本"),exit()),sleep(199)}click(1759+xoff,530),sleep(700),log("clicked max"),click(1442+xoff,838),log("clicked recover"),loopflag.setAndNotify("re"),recoverthread.interrupt()}else back(),sleep(500),back(),exit();else log("ap enough");sleep(500)}loopflag.setAndNotify("null")});if("re"==loopflag.blockedGet())for(;;){if(flag){flag=!1;var simple=images.findColorInRegion(captureScreen(),"#ffffcc",1805+xoff,238,10,6);flag=!0}if(simple){simple=null,click(1873+xoff,997),log("吃药成功，再次开始"),sleep(400);break}sleep(500)}var stuckorlose=!1;if(stuckorloseflag)var stuckthread=threads.start(function(){for(sleep(30999),log("卡死检测开始");;){if(flag){flag=!1;var e=captureScreen(),l=images.clip(e,1173,42,157,22);flag=!0}if(l){if(log("boss hp clipped down"),log("waitting...."),sleep(18003),flag){if(flag=!1,images.findImageInRegion(captureScreen(),l,1173+xoff,42,157,22,.9)){for(l.recycle(),losethread.interrupt(),stuckorlose=!0,sleep(500),log("get stuck"),log("关闭团灭检测");!click(2066+xoff,90););for(var f=new Date;;){if(new Date-f>3500)break;if(images.detectsColor(captureScreen(),"#85dee1",1494+xoff,828,threshold=15)){for(;!click(1606+xoff,846););for(sleep(1500);!click(1375+xoff,721););log("卡死已退出"),sleep(500),stuckorlose=!1,flag=!0,stuckthread.interrupt()}else sleep(297)}}flag=!0}log("not stuck"),sleep(3197)}}}),losethread=threads.start(function(){for(sleep(20009);;){if(flag){flag=!1;var e=images.findMultiColors(captureScreen(),"#ffffff",[[306,-2,"#ffffff"],[479,5,"#ffffff"],[-425,-185,"#88dddd"],[963,-185,"#88dddd"]]);flag=!0}if(e){for(e=null,stuckorlose=!0,log("已团灭"),sleep(500);!click(1350+xoff,734););log("再战"),sleep(500),stuckorlose=!1}else log("未团灭");sleep(8307)}});for(;;){if(flag){flag=!1;var esc=images.findMultiColors(captureScreen(),"#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:15});flag=!0}if(esc){log(esc),esc=null,log("have found esc");break}log("not found esc"),click(345+xoff,353),sleep(1e3)}if(autoflag){switch(autotype){case 0:var autoimage=images.read("./still.jpg");click(1786+xoff,68),sleep(200);break;case 1:var autoimage=images.read("./autoskill.jpg");global.autoflag1=!1,autoflag1=!1}if(flag){for(flag=!1;!images.findImageInRegion(captureScreen(),autoimage,1700+xoff,50,153,36);)click(1786+xoff,68),sleep(500);flag=!0}autoimage.recycle(),log("人物状态设置完成")}if(helpflag){if(flag){flag=!1;var rescue=images.findMultiColors(captureScreen(),"#ff5533",[[-50,-14,"#ff5533"],[-30,-123,"#c5c577"]]);flag=!0}if(rescue)switch(log(rescue),log("have found rescue"),click(rescue.x,rescue.y),rescue=null,sleep(300),helptype){case 0:click(2098+xoff,334);break;case 1:click(2098+xoff,469);break;case 2:click(2098+xoff,625)}else log("not found rescue"),click(345+xoff,353);sleep(1e3)}for(sleep(1e3);;){if(flag){flag=!1;var esc=images.findMultiColors(captureScreen(),"#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]]);flag=!0}if(!esc){log("raid结束"),stuckorloseflag&&(stuckthread.interrupt(),losethread.interrupt());continue e}log("raid 未结束"),sleep(1001)}}else log("not found simple"),press(2069+xoff,365,1);sleep(1500)}else log("not found limithell"),press(1830+xoff,220,1);sleep(2e3)}
