function normalbattleprc(e,f,l,a,o,t,r,g,i){e:for(;;){if(flag){flag=!1;var s=images.findColorInRegion(captureScreen(),"#ffffcc",1805+xoff,238,10,6);flag=!0}if(s){if(log("found simple"),t){if(global.teamflag=!1,t=!1,flag){for(flag=!1;!images.findColorInRegion(captureScreen(),"#ffffff",teamregion[0]+teamx*r,teamregion[1],teamregion[2],teamregion[3]);)click(258+xoff,582),sleep(500);flag=!0}log("队伍设置成功")}if(f){if(global.speedflag=!1,f=!1,flag){switch(flag=!1,l){case 0:for(;!images.detectsColor(captureScreen(),"#ffffff",1489+xoff,1009,threshold=20);)click(1371+xoff,964),sleep(400);log("调速为1x");break;case 1:for(;!images.detectsColor(captureScreen(),"#e85533",1570+xoff,1017,threshold=20);)click(1371+xoff,964),sleep(400);log("调速为2x");break;case 2:default:for(;!images.detectsColor(captureScreen(),"#f85533",1558+xoff,1014,threshold=20);)click(1371+xoff,964),sleep(400);log("调速为3x")}flag=!0}log("调速成功")}click(1873+xoff,997),log("open battle");var c=threads.disposable(),n=threads.start(function(){for(var e=new Date;new Date-e<4500;){if(flag){flag=!1;var f=images.detectsColor(captureScreen(),"#ff5533",1609+xoff,137);flag=!0}if(f)if(g){for(log(f),f=null,click(1639+xoff,592),log("clicked use");;){if(flag){flag=!1;var l=images.detectsColor(captureScreen(),"#ff5533",1255+xoff,818,threshold=16);flag=!0}if(l){l=null;break}new Date-e>4500&&(log("药吃完结束脚本"),exit()),sleep(199)}click(1759+xoff,530),sleep(700),log("clicked max"),click(1442+xoff,838),log("clicked recover"),c.setAndNotify("re"),n.interrupt()}else back(),sleep(500),back(),exit();else log("ap enough");sleep(500)}c.setAndNotify("null")});if("re"==c.blockedGet())for(;;){if(flag){flag=!1;var s=images.findColorInRegion(captureScreen(),"#ffffcc",1805+xoff,238,10,6);flag=!0}if(s){click(1873+xoff,997),log("吃药成功，再次开始"),sleep(400);break}sleep(500)}for(;;){if(flag){flag=!1;var p=images.findMultiColors(captureScreen(),"#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:15});flag=!0}if(p){if(log(p),log("found esc"),a){switch(global.autoflag=!1,a=!1,o){case 0:var u=images.read("./still.jpg");break;case 1:default:var u=images.read("./autoskill.jpg")}if(flag){for(flag=!1;!images.findImageInRegion(captureScreen(),u,1700+xoff,50,153,36);)click(1786+xoff,68),sleep(500);flag=!0}u.recycle(),log("人物状态设置完成")}for(sleep(3e3);;){var d=images.read("./next.jpg");if(flag){flag=!1;var m=images.findImageInRegion(captureScreen(),d,1404+xoff,991,38,38);flag=!0}if(d.recycle(),m){if(log("found next"),e){if(sleep(100),parttype){if(flag){for(flag=!1;!images.detectsColor(captureScreen(),"#88dddd",647+xoff,1037);)click(699+xoff,978),sleep(100);flag=!0}log("助战开启")}else{if(flag){for(flag=!1;!images.detectsColor(captureScreen(),"#666666",598+xoff,1037);)click(699+xoff,978),sleep(100);flag=!0}log("助战关闭")}global.partflag=!1,e=!1}if(!i){log("next"),click(m.x,m.y);break e}log("rebattle"),click(996+xoff,1009);continue e}log("not found next"),stuckorlose||(press(1790+xoff,186,1),press(1818+xoff,186,1)),sleep(1e3)}}else log("not found esc"),click(345+xoff,353);sleep(1e3)}}else log("not found simple"),click(409+xoff,227);sleep(1e3)}}function leftBlack(){var e=images.captureScreen(),r=e.height,t=0,i=r/2;if(1920==e.width)return 0;for(;t<e.width-1;){if(e.pixel(t,i)!=e.pixel(t+1,i))return 0==t?t:t+1;t++}return t+1}auto.waitFor(),auto.setMode("normal"),images.requestScreenCapture(),sleep(300);var storage=storages.create("pref"),xoff=leftBlack()-246,partflag=!0,parttype=storage.get("partflag2",!1),flag=!0,rebattleflag=!0,speedtype=2,autotype=1,teamtype=storage.get("teamtype4",0),speedflag=!0,autoflag=!0,teamflag=storage.get("teamflag",!1),recoverflag=storage.get("recoverflag5",!1),timeflag=storage.get("timeflag6",!1),timelimit=60*(60*parseInt(storage.get("hour6",0))+parseInt(storage.get("minute6",0)))*1e3,time=new Date,teamregion=[269+xoff,166,16,16],teamx=43;for(timeflag&&threads.start(function(){setInterval(function(){new Date-time>timelimit&&exit()},6e4)}),threads.start(function(){for(;;){var e=images.read("./reline.jpg");if(flag){flag=!1;var f=images.findImageInRegion(captureScreen(),e,1442+xoff,710,87,41);flag=!0}if(e.recycle(),f){log(f),click(f.x,f.y),log("open reline"),sleep(2e3);var l=images.read("./error.jpg");if(flag){flag=!1;var a=images.findImageInRegion(captureScreen(),l,1105+xoff,517,56,56);flag=!0}l.recycle(),a?(log(a),click(a.x,a.y),log("click error"),engines.execSciptFile("./工会刷票.js"),exit()):log("not found error")}else log("not found reline");sleep(2e4)}});;){var questImg=images.read("./quest.jpg");if(flag){flag=!1;var quest=images.findImageInRegion(captureScreen(),questImg,1869+xoff,972,137,65);flag=!0}if(questImg.recycle(),quest){log(quest),click(quest.x,quest.y),log("open quest");break}log("not found quest"),back(),sleep(1500)}for(sleep(1e3),click(1927+xoff,863),sleep(3e3);;){if(flag){flag=!1;var solo=images.findColorInRegion(captureScreen(),"#65d5e6",1499+xoff,897,6,6,threshold=10);flag=!0}if(solo){log(solo),click(solo.x,solo.y),log("open solo");break}log("not found solo"),sleep(800)}for(sleep(1e3),click(1745+xoff,355),sleep(3e3);;)normalbattleprc(partflag,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag),sleep(1e3);
