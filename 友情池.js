function leftBlack(){var e=images.captureScreen(),a=e.height,f=0,o=a/2;if(1920==e.width)return 0;for(;f<e.width-1;){if(e.pixel(f,o)!=e.pixel(f+1,o))return 0==f?f:f+1;f++}return f+1}events.on("exit",function(){events.broadcast.emit("done",0)}),auto.waitFor(),images.requestScreenCapture(),sleep(300);var storage=storages.create("pref"),xoff=leftBlack()-246,gachaflag=!0,flag=!0,gachatime=storage.get("gachatime",null);if(!gachatime){var a=new Date,year=a.getFullYear(),month=a.getMonth(),day=a.getDate(),hour=4,gachatime=Date.parse(new Date(year,month,day,hour));storage.put("gachatime",gachatime)}if(Date.parse(new Date)>gachatime){for(threads.start(function(){for(sleep(111);;){var e=images.read("./reline.jpg");if(flag){flag=!1;try{var a=images.findImageInRegion(captureScreen(),e,1442+xoff,710,87,41)}catch(e){flag=!0;continue}flag=!0}if(e.recycle(),a){log(a),click(a.x,a.y),log("open reline"),sleep(2e3);var f=images.read("./error.jpg");if(flag){flag=!1;var o=images.findImageInRegion(captureScreen(),f,1105+xoff,517,56,56);flag=!0}if(f.recycle(),o){for(log(o),click(o.x,o.y),log("click error");;){if(flag){flag=!1;try{var c=images.detectsColor(captureScreen(),"#7ae6f4",2094+xoff,78,thresholdd=15)}catch(e){flag=!0;continue}flag=!0}if(c)break;click(1112+xoff,512),sleep(2e3)}engines.execSciptFile("./友情池.js"),exit()}else log("not found error")}else log("not found reline");sleep(9999)}});;){var scoutImg=images.read("./scout.jpg");if(flag){flag=!1;var scout=images.findImageInRegion(captureScreen(),scoutImg,1399+xoff,767,47,41);flag=!0}if(scoutImg.recycle(),scout){log(scout),click(scout.x,scout.y),log("open scout"),sleep(2e3);break}log("not found scout"),back(),sleep(2e3)}for(;;){if(flag){flag=!1;var info=images.detectsColor(captureScreen(),"#82e1db",533+xoff,111);flag=!0}if(info){log("found info");break}log("not found info"),sleep(1e3)}for(click(2135+xoff,1016);;){if(flag){flag=!1;var friend=images.findMultiColors(captureScreen(),"#00aa99",[[6,7,"#11222a"],[63,-30,"#ffffff"],[207,-106,"#f76600"]],{region:[1719+xoff,203,400,800]});flag=!0}if(friend){log(friend),click(friend.x,friend.y),log("found friend");break}log("not found friend"),sleep(1e3)}for(;;){if(flag){flag=!1;var gacha=images.findMultiColors(captureScreen(),"#ffffcc",[[-15,1,"#ffffcc"],[18,1,"#ffffcc"],[-37,-48,"#ffffff"]],{region:[1178+xoff,981,80,50]});flag=!0}if(gacha){log(gacha),click(gacha.x,gacha.y),log("found gacha");break}log("not found gacha"),sleep(1e3)}for(;;){if(flag){flag=!1;var decide=images.findMultiColors(captureScreen(),"#ffffff",[[-172,0,"#ff613b"],[213,-6,"#ff613b"],[-807,-506,"#88dddd"]],{threshold:15});flag=!0}if(decide){log(decide),click(decide.x,decide.y),log("found decide");break}log("not found decide"),sleep(1e3)}for(sleep(800);!images.detectsColor(captureScreen(),"#88dddd",1997+xoff,181);)sleep(500);for(click(1997+xoff,181),sleep(1e3);!images.detectsColor(captureScreen(),"#88dddd",1997+xoff,181);)sleep(500);sleep(500),click(1997+xoff,181),log("gacha end"),gachaflag=!1,sleep(2e3),log("back home"),click(2062+xoff,66),storage.put("gachatime",gachatime+864e5),exit()}
