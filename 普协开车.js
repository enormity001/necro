importClass("android.app.PendingIntent");
importClass("android.app.AlarmManager");
importClass("java.lang.System");

var storage = storages.create("pref")
events.on("exit",function(){
    events.broadcast.emit("done",3);
      storage.put("ongoingscript","");
    })
    
    auto.waitFor(); //415,217
    
    images.requestScreenCapture();
    sleep(300);
    
    var xoff = leftBlack() - 246;
    storage.put("ongoingscript","./普协开车.js");
  let starttime = new Date();//脚本运行开始时间
  let restartflag = storage.get("restartflag",false);//定时重启flag
  let restarttime = (storage.get("restarttime",3)+1) *60*60*1000;//定时重启时间间隔
  var autoflag = true;
  var teamregion = [269+xoff, 166, 16, 16]; //队伍找色数组
  var teamx = 43;
  var Recoverflag = storage.get("Recoverflag", false);//从一键日常传入的flag，true表示覆盖本来的吃药flag不进行嗑药
  var teamflag = storage.get("teamflag",false);
  var teamtype = storage.get("teamtype3",0);//0~5 队伍顺序
  var recoverflag = storage.get("recoverflag3",false);//吃药flag
  var helpflag = storage.get("helpflag1",false);
  var helptype = storage.get("forhelp1",0);
  var autotype = storage.get("autotype1",1);
  var timeflag = storage.get("timeflag3",false);
  var timelimit = (parseInt(storage.get("hour3",0)) * 60  + parseInt(storage.get("minute3",0)))*60*1000;
  var stuckorloseflag = storage.get("stuckorloseflag",false);
  var sideacctflag = storage.get("sideacctflag",false);
  // var nortype = storage.get("nortype",0);
  var nortype = storage.get("nortype",4);
  var usediamond =  storage.get("usediamond3",false);

  var FindImageInRegion = sync(function(a,b,c,d,e,f){
    return images.findImageInRegion(images.captureScreen(),a,b,c,d,e,f)
})

var DetectsColor = sync(function(a,b,c,d,e){
    return images.detectsColor(images.captureScreen(),a,b,c,d,e)
})
var FindColorInRegion = sync(function(a,b,c,d,e,f){
    return images.findColorInRegion(images.captureScreen(),a,b,c,d,e,f)
})
var FindMultiColors = sync(function(a,b,c){
    return images.findMultiColors(images.captureScreen(),a,b,c)
})
var MatchTemplate = sync(function(a,b){
  return images.matchTemplate(images.captureScreen(),a,b)
})

  var time = new Date();
  
  if(Recoverflag){//Recoverflag为真覆盖recoverflag为false表示不嗑药
    recoverflag = false;
  }
  storage.put("Recoverflag",false)//重制Recoverflag为false
  
  if(timeflag){
  threads.start(function(){
    setInterval(function(){
      if((new Date()-time)>timelimit){
        exit();
      }
    },60000)
  })
  }
  threads.start(function () {
    //断线检测
    sleep(111);
    while (true) {
   //raid err
   var raiderrimg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAEAAAAAhCAYAAABpwa0hAAAABHNCSVQICAgIfAhkiAAAA5JJREFUaIHlWT1I81wUfhJbsAWDowVNqUIHhS5qhWpxsIJKBxF00EUXJ0e1Y8VN0UHBwcFBXHSqkyASqkNAcSh10FqwqIPaH7EO0iFNzjd8qG9a7dv69ifYBw5JnxvuyX1uzzm9pwwAQhWDrfQLVBq6Sr/Ad7DZbOju7gbHcWAYBgzDAIDq+hX31TWTe3h4gN/vx/X1NYD/Q0BzNjU1RXd3d1QKnJ+fk9vtJgCk43kedXV1/7RbhSCRSCAWi4FIG6lHt7GxAbfbXTaHy8vLWFhYQCqVKpvPXKhIEvwzNisNzSZBn88HURSh1+uLPncqlUI8HgegYQGSySSSyWTJ/ej29vYQCARARB+J6f0+05xOJ/r6+lS78vj4CEEQcHV19VGaMg34LFuiKEKSpJIvrBDkXZrm5ubo7e1NVVICgQANDw9XvGz+1DQVAna7Hf39/aivry+bT00J0NbWhunpafA8XzafVX8WqHoBNBUCxQYRQVEUyLIMANDpdGBZ9Z5rSoCDgwMEg0Ho9Xqk02nIsgxFUT7u36/vfCb3p6XTadV5Y3x8HF6vF1ar9YNTFEVbAkSjUUSj0ZLM3djYiKamJhV3f39fHTmgoaEBzc3NMBgMKj4SiVSHAF1dXbDb7Vn8zc3N7xeA4zg4HA7YbDYVH4/HcXFx8bsFYBgGIyMjGB0dRU1NjWrs5OQEfr//dwvQ29uLyclJWCwWFR+LxXB8fIzLy0ttVYFiwuVywev1oqenJ2vM7/dDEAQQ0e8ToLa2FmNjY/B4PGhtbc0aPzs7w/b2NkKhEABAZzQaoSgKAHUfQFEU1ed8kHn+Z1k2qy/w/ktMkqSi9gVYloXdbsfs7CyGhoaySh4A3N7eYnNzE4eHh59kSfrOf0E8HqeZmZminOc5jqPBwUHa3d2lRCLxrc/n52fyeDxkNBq12w/IBwzDwGQyobOzEy6XCwMDA2hpacnZaI1EIlhaWsLOzk5WN1qzAhiNRphMJvA8D7PZDLPZDKvVio6ODlgslrybpaIoYnFxEUdHR1+Hcvm++J/IJwQmJiYoHA7/2EcsFqO1tTWyWq25W2Knp6f/vFuF4vX1FU9PTzmf8fl8sFgsmJ+fL+ifq5eXF+zv72N9fR3BYDCvBF7xxuR3ZjabaWtrixRFybnbsixTOBymlZUVam9vJ5ZlC/FT+YXmMqfTSYIgZC1akiQKhUK0urpKDoeDDAbDj+b/DyegRvX7LhXoAAAAAElFTkSuQmCC")

       
       var raiderr = FindImageInRegion(
           
           raiderrimg,
           1237 + xoff,
           495,
           80,
           55,0.8
       );
       
   raiderrimg = undefined;
   if (!raiderr) {
       log("not found raiderr");
   } else {
       log(raiderr);
       click(raiderr.x, raiderr.y);
       raiderr = null;
       log("click raiderr");
       //重启游戏
       while (true) {

               
               try {
                   var close = DetectsColor(
                       
                       "#7ae6f4",
                       2094 + xoff,
                       78,
                       (thresholdd = 15)
                   );
               } catch (err) {
                   
                   continue;
               }
               
           if (!close) {
               click(1112 + xoff, 512);
               sleep(2000);
           } else {
               close = null;
               break;
           }
       }
       back();
            sleep(4000)

       engines.execScriptFile("./普协开车.js");
       exit();
   }
  
      var relineImg = images.read("./reline.jpg");

        
        try {
          var reline = FindImageInRegion(
            
            relineImg,
            1442 + xoff,
            710,
            87,
            41,0.8
          );
        } catch (err) {
          
          continue;
        }
        
  
      relineImg = undefined;
  
      if (!reline) {
        log("not found reline");
      } else {
        log(reline);
        click(reline.x, reline.y);
        reline = null;
        log("open reline");
        sleep(2000);
  
        var errorImg = images.read("./error.jpg");

          
          var error = FindImageInRegion(
            
            errorImg,
            1105 + xoff,
            517,
            56,
            56,0.8
          );
          
        errorImg = undefined;
  
        if (!error) {
          log("not found error");
        } else {
          log(error);
          click(error.x, error.y);
          error = null;
          log("click error");
          //重启游戏
          while (true) {

              
              try {
                var close = DetectsColor(
                  
                  "#7ae6f4",
                  2094 + xoff,
                  78,
                  (thresholdd = 15)
                );
              } catch (err) {
                
                continue;
              }
              
            if (!close) {
              click(1112 + xoff, 512);
              sleep(2000);
            } else {
              close = null;
              break;
            }
          }
          back();
            sleep(4000)

          engines.execScriptFile("./普协开车.js");
          exit();
        }
      }
      sleep(10343);
    }
  });
  
  help: while (true) {

      
      var refreshbotton = FindColorInRegion(
        
        "#55bbcc",
        2036 + xoff,
        248,
        5,
        5,2
      );
      
    if (!refreshbotton) {
      var helpImg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAABS9JREFUSImdlVtsVFUUhr+zz5k57TADHab3K6WUIiIgGIViohjRSFBMvEaJqMCDYqI8AIag8qBoorxgggkJxvCA0QR9kZCYgCngBVsuIqRQuXSope303rl0zpzL9mGGMz0VTHC97Z211r/Xv9b6tyKEkFJKpJRMtLBfZf/99ayqmAaA4UjahpIsKw66Po6EjkSaZUcvYUnJznlVbJxVAoDpSFr64zx27C8EtzFdCJZGprjnkYzFa62d7LhwwwWIpgw2ne1i1LRpDOqsn1ns+sctm10dfUhAEwqU6D4E+Uo0RWFxOEDErwFgS0lP2iRlOxy4PkRAEywvCfHWmS7+GEkR0gTvzilHFwoAElAVhaerilhdWYRSHyyQ7Y/PdR3uxGKGxaMtHTQEdQ4ubeB2KcSicOB/ATgS+g0TW0r2LKq9LQCAaJ7A+51YxnHoiBt8fm8tFQW+//TV+tImX3UO5lEVqCn0s7w05L64ezzDkVjcE6gq0BgsYMmER46ZNu9fuMHFeBqAiF/ji0W1aJ91xNCFQmWBxpWEwRRN8HZjqQuSdhy+6Rpm87m/CftV1tZF+LJzkIdLQhxsnjmpOsmx/gRnRlLoQuGpyiKm+lS056vDfDC3nGtJg5XHL+MXCksj+V0wbMmvgwmKfCq7F9byQk2YNXURKgp8aIq3ERIwc/sW0AQv1U7P0vX1AzPc0hYWBehLm579yDgOf46Os2l2GWvqskGLw4Fbci/JLqFQoLzAx8rcIrvLWKgKnqycRlOowN0PS0r6DIvna6bz/twKN1HadrAmKQSAkutVQBWsrYvgz42cC6ILhSfKp9FcnK9CoFBd6OPDeZUuQF/a5NXWTq4mDIYzNt90Def9FSjWNeoCOm/m5MWSMg+Sdhxah5I8XBJyg1J2tumDGQuAAcPi9dYoP/aN8dtQkg2norT056dOoDAjoLO5qYyQpgIQNx1E23CKsyMpnvnlKqaUrCib6gYlLZud7b2sOnGZsyMpNrRFOdw7ypjpsPVcN4d6RknZjuvvFwrLS0O8nOtdxpEcH4ijLCkOymjCYOucct5uLHUDLCk5OZjkwZ8uoZAVOdPx9sEvFFZWTOP75gb3zpG429+XNrMq3D6WZttdXoCbrzg5lGROqIDvmht4sWY6k82WEE1mPHc3AZKWw96rA5wbHUfbNb+KdfXF/0qgALUBPyceaSLi13ioJIThOHw7odG2lPQZJoYjPfpnSUnbcJKP2nuywOvqi935nmiFquDZ6rA7zmG/yu6FNR4ZAbAcSVfKW02/YbHxdBdGLqeYWNrEl1yKpz2TA9l/Z+/iOkr1LHBAFaypi9AQ1L2UAUnbzp/jls0nF3vpSZvuZcaR/NAzyvq2KFeTRp5CBab6VBqCOgFV8EZDCZ/Or2ayyk/RVF6pi+RBvrw2yJ4rMQ8Nhi35eSBBNJXhzdPXsaTEkpLfh5KsaOmgfSzNrgXVfLag+pb/SEAVvFgz3e2TeiSW2BHSVD6+p4qAmt3NMdNm+/kbjJk2sbSFTyh0j5u8fLKTqkI/B5bUs7qqyE3qyOyfrufiFSWrIDHD4tRwKiukd0/16tXlhEFvjr64ZfPe+RuU6Bpbmsp4Z3aZZ5LGbYevrw+x79ogx5bPRs0pc8insqWpnEM9o2ibGkt5rjrsoer4QGICv4K3ZpWytamcsF/10JK0HHZfjrH9fDdFPo2jsbirGDdXYN99MxCf3FPlke6043C4d9Q9a4pCY1D/F0Dcstl+vpttf3bjyKwE7Y8OMtk0ofAP82Y2pQzz9G4AAAAASUVORK5CYII=")
  

        
        try {
          var help = FindImageInRegion(
            
            helpImg,
            1187 + xoff,
            261,
            36,
            34,0.8
          );
        } catch (err) {
          
          continue;
        }
        
      helpImg = undefined;
      if (!help) {
        log("not found help");
        back(); //用于关闭第进入游戏时的活动弹窗
      } else {
        click(help.x, help.y);
        while (true) {

                
                var refresh = FindColorInRegion(
                    
                    "#55bbcc",
                    2036 + xoff,
                    248,
                    5,
                    5,2
                );
                
            if(refresh){
                refresh = null;
                break;
            }
            sleep(1000); //正常速度为1500ms
        }
        help = null;
        log("open help");
        break;
      }
    } else {
      refreshbotton = null;
      break;
    }
  
    sleep(2000);
  }
  
  press(1943+xoff,397,1);
  sleep(700);
  press(1970+xoff,1020,1);
  
  while(true){

      
      var list = DetectsColor("#49c0c0",2106+xoff,190);
      
      if(list){
        break;
      }
      sleep(300);
    }
  
  
  
    limit:while (true) {
      switch(nortype){
        case 0://hell
        var limithellImg =images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAADAAAAAZCAYAAAB3oa15AAAABHNCSVQICAgIfAhkiAAAA85JREFUWIXVlz2rZEUQhp+3us/M9YNlUVD0IkZisImwkRgYi6GsqamphoLgL9jAH2BkIpiYmBgumGwggoKygqCwi1dUVnfZO3NOdxn0mTPna+Z+eFfxhcPM6VPVVW93VXW1rr/5hQPg5Ul1ZhbKOA0hhO7JOZNSIifDgoFaWQfPTk7gUjeFBSEr72aGmQ1M5JRxHPV0Bt9zxt23Aw7y3sivP97j43dv7iCQcKsJIXTGU0qklCFH3vrwZZ44fLQT/+nrP/j0g69IZCRhZrz+zhVefOWp+fnPgdvf3yWOvCRYtYOAgYkqVkiGe8YRyEERMVw1SQSLiIxkmGki808haUhAgqDInB1ThZlYxgWSsV6vMByXk82nCojKllgbMghMNiN3fhia24E4KxxCoKoCOOTs4IZwpMJ3sgOIoEA/nC96BxgTKEbnCVQxUFUVq9UxTdMMvhlhOrWEyXB2FAXg+K+Gz97/bmujqjAz6qYhNU3Jrz3ITR7vAKChkgQyK5UhA67y9DCoDJPx3auek3P3zqrYAWKV28rk1E09WaiyxMP5RgTaWtqXkQihxG7TNHj2IjbR2zHmpxfL7YpbMEIIuPugdGqGwIlZJalMhrNer0kpnaRybpQzJQHe5lw1OSvG2PtVEpLKKowPkYeEvoVdB1ofewlYG/s5Z3Len1AXBi+504VNu4i7MMiBy4ePcO36le59o9it/J4NuPT08sy+Hjweee29F6Yf1BYPGbRktrtffLp14zd+uPH7kECoxOVnD87syHlhUTz30qVz6R7dulfmuEiH/gv87wkMQujPX1Z8+dHPWDBijDRNTbMpm669OfDq28/z2JOLMxmvHyRufnJ7ONjGf/faJrEkcsqljQGObt2fEqgfZO58ex8LpV1er9fb09D3d5P18dmrVL3KfPP50ZRALy42rXhVVdTrhqYetzEjZTPDceq6JqXUqwAP/wyYg/eq0IZMv6wOCKjdv5wy6/X636v9J8DdSSkhSlfcx7AXktOkGs/Ta51ckAe98WZ6XDuauVEnOis10RXe9Ay0PyllbGlYFHERunNhRACy51kCJQfmnBTMtMwl6MbOzVAYT+ptJIxE3R3kqBLBtrswupGpu+tO7JjKyTjoVEE4KZ/cs5wWpX0flaKNLSvVKMbYNXlxrF0tKgyVmJMhlRuYGPUk2v6RMVnJjaHB2KizrA4CV984BOiSdDT5AFZBiMIsdLKTO/FyuaB24e7EGJHUldLOwMTZOAk5k1gshudCmBAwrl57ZtbZ02L2/mhmnfOb+wBzi7P5f4EhdFb8DSHqhJpYNcsnAAAAAElFTkSuQmCC")
        break;
        case 1://黄
              var limithellImg = images.fromBase64("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")
        break;
        case 2://绿
              var limithellImg = images.fromBase64("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");
        break;
        case 3://蓝
              var limithellImg = images.fromBase64("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")
        break;
        case 4://红
              var limithellImg = images.fromBase64("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")
          // limithell = true;
        break;
       
      }
  
        var limithell = FindImageInRegion(
          
          limithellImg,
          974+xoff,
          252,
          800,
          722,0.83
        );
        
      limithellImg = undefined;
    
      if (!limithell) {
        log("not found limithell");
          var bottom = DetectsColor(
            
            "#88dddd",
            2152 + xoff,
            1012
          ); //检测滑到底部
          
        if (bottom) {
          click(2152 + xoff, 311);
          click(2152 + xoff, 311);
         
        } else {
          //点击滚动条
            bottom = null;

              
            var pullbar = FindColorInRegion("#88dddd",2145+xoff,299,5,610);
            
            if(pullbar){
              swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+250,200);
              pullbar = null;
            }
        }
  
      } else {
        // if(nortype != 4){
        click(limithell.x,limithell.y);
        // }else{
        //   click(2152 + xoff, 1019);
        //   click(2152 + xoff, 1019);
        //   sleep(700);
        // if(DetectsColor("#88dddd",2152 + xoff,848)){
        //   click(1766+xoff,888);
        // }
  
        // }
        log("open limithell ");
        limithell = null
  
        var onbattle = threads.disposable();
  
        var onbattlethread = threads.start(function(){
          sleep(117)
          let time = new Date;
          while (new Date - time < 4000) {

                  
                  var onprc = FindMultiColors( "#ffffff", [
                      [-643, 99, "#88dddd"],
                      [-646, -473, "#88dddd"],
                      [742, -471, "#88dddd"],
                      [742, 97, "#88dddd"]
                  ], {
                      region: [1126 + xoff, 704, 163, 48]
                  })
                  
              if (onprc) {
               if(limithellthread) limithellthread.interrupt();
               log("limithellthread线程结束");
               if(sideacctflag){
                onbattle.setAndNotify("continue");
                onprc = null;
               if(onbattlethread) onbattlethread.interrupt();
               log("onbattlethread线程结束");
               }else{
  
                 onbattle.setAndNotify("back");
                 onprc = null;
                if(onbattlethread) onbattlethread.interrupt();
                log("onbattlethread线程结束");
               }
              }
              sleep(500);
          }
      
      })
         var limithellthread = threads.start(function(){
           sleep(137)
           re: while (true) {

               
               var simple = FindColorInRegion(
                 
                 "#ffffcc",
                 1805+xoff,
                 238,
                 10,
                 6
               );
               
             
       
             if (!simple) {
               log("not found simple");
               // press(2117+xoff,365,1)
             } else {
              if(onbattlethread) onbattlethread.interrupt();
               log("onbattlethread线程结束");
               log("found simple");
               simple = null 
               //选择队伍
             if (teamflag) {
               global.teamflag = false;//全局
               teamflag = false;//局部

                 
                 while (
                   !FindColorInRegion(
                     
                     "#ffffff",
                     teamregion[0] + teamx * teamtype,
                     teamregion[1],
                     teamregion[2],
                     teamregion[3]
                   )
                 ) {
                   click(258+xoff, 582);
                   sleep(500);
                 }
                 
               log("队伍设置成功");
             }

             if(autoflag){//是否调节过行动状态
              global.autoflag = false;
                     autoflag = false;
              sleep(800)
              click(512+xoff,923)
              sleep(1500)
              switch(autotype){
                case 0:
                  
                  while(true){
              
                        
                    var movemode = DetectsColor("#091010",2030+xoff,990,threshold = 25)
                        
                      if(!movemode){
                            press(1890+xoff,964,1);
                            sleep(1000);
                      }else{
                        break;
                      }
                    }
                  break; 
                  case 1:
                    while(true){
              
                          
                      var movemode = DetectsColor("#000000",2027+xoff,969);
                          
                        if(!movemode){
                          press(1890+xoff,964,1);
                              sleep(1000);
                        }else{
                          break;
                        }
                      }
              
                  break; 
                        
                }
            click(487+xoff,1047);
            while(!DetectsColor("#88dddd",516+xoff,915)){
              sleep(500)
            }
            log("人物状态设置完成")
            }
    

             click(1873+xoff, 997);
             log("open battle");
           
             
             var loopflag =threads.disposable();
             var recoverthread = threads.start(function(){//吃药子线程
             let time = new Date()
             while(new Date()-time < 5000){

                 
                 var empty = DetectsColor( "#ff5533", 1609+xoff, 137);
                 
         
               if (!empty) {
                 log("ap enough");
               } else {
                 if (recoverflag) {
                   log(empty);
                   empty = null
                   if(usediamond){
                    click(1624+xoff,439);
                  }else{
                    click(1639+xoff, 592); // click(1624+xoff,439) 石头
                  }
                   
                   log("clicked use");
         
                   while(true){

                       
                     var ensure = DetectsColor("#ff5533",1255+xoff,818,threshold = 16)
                     
                     if(!ensure){
                       if(new Date()- time > 5000){//寻找决定按钮7s未找到，结束脚本
                         log("药吃完结束脚本")
                         exit()
                       }
                     }else{ensure = null; break;}
                     sleep(199);
                   }
     
                   click(1759+xoff, 530);
                   sleep(700);
                   log("clicked max");
       
                   click(1442+xoff, 838);
                   log("clicked recover");
         
                  // sleep(1000);
         
                   //重新进入循环
                   loopflag.setAndNotify("re")//吃药成功发送battle事件
                  if(recoverthread) recoverthread.interrupt()
                 } else {
                   back();
                   sleep(500);
                   back();
                   exit();
                 }
               }
               sleep(500)
             }
             loopflag.setAndNotify("null")//无事发生
           })
          
             if(loopflag.blockedGet()=="re"){
               while(true){

                   
                   var simple = FindColorInRegion(
                     
                     "#ffffcc",
                     1805+xoff,
                     238,
                     10,
                     6
                   );
                   
                 if(simple){
                   simple = null
                   if(autoflag){//是否调节过行动状态
                    global.autoflag = false;
                     autoflag = false;
                    sleep(800)
                    click(512+xoff,923)
                    sleep(1500)
                    switch(autotype){
                      case 0:
                        
                        while(true){
                    
                              
                          var movemode = DetectsColor("#091010",2030+xoff,990,threshold = 25)
                              
                            if(!movemode){
                                  press(1890+xoff,964,1);
                                  sleep(1000);
                            }else{
                              break;
                            }
                          }
                        break; 
                        case 1:
                          while(true){
                    
                                
                            var movemode = DetectsColor("#000000",2027+xoff,969);
                                
                              if(!movemode){
                                press(1890+xoff,964,1);
                                    sleep(1000);
                              }else{
                                break;
                              }
                            }
                    
                        break; 
                              
                      }
                  click(487+xoff,1047);
                  while(!DetectsColor("#88dddd",516+xoff,915)){
                    sleep(500)
                  }
                  log("人物状态设置完成")
                  }
                   click(1873+xoff, 997);
                   log("吃药成功，再次开始")
                   sleep(400)
                   break;
                 }
                 sleep(500);
               }
             }
     
             
          var stuckorlose = false;//触发lose 或者stuck 关闭 退出奖励页面和0贡献的点击
          if(stuckorloseflag){
          var stuckthread = threads.start(function(){
         sleep(30999)
         log("卡死检测开始")
         while(true){

                 
                 var a = captureScreen()
                 var bosshpimg = images.clip(a,1173+xoff,42,157,22)
                 
             if(bosshpimg){
              log("boss hp clipped down")
              log("waitting....")
              sleep(30999)

                
              if(FindImageInRegion(bosshpimg,1173+xoff,42,157,22,0.9)){
                  bosshpimg = undefined
                 if(losethread) losethread.interrupt()
                  stuckorlose = true
                  sleep(500)
                  log("get stuck")
                  log("关闭团灭检测")
                  click(2066+xoff,90)
     
                  let time = new Date()
                  while(true){
                    if(new Date()- time > 3500){break;}//4s内未找到撤退按钮退出循环
                      if(DetectsColor("#85dee1",1494+xoff,828,threshold = 15)){
                              click(1606+xoff,846)
                              sleep(1500)
                              click(1375+xoff,721)
                              log("卡死已退出")
                              sleep(500)
                              stuckorlose = false
                              
                             if(stuckthread) stuckthread.interrupt()
                      }else{
                          sleep(297);
                      }
                      
                  }
              }
              
              }else{
                continue;
              }
             log("not stuck")
             
            sleep(3197)
         }
     })
     
         var losethread = threads.start(function(){
        sleep(20009)
        while(true){

                
                var lose = FindMultiColors( "#ffffff", [
                  [306, -2, "#ffffff"],
                  [479, 5, "#ffffff"],
                  [-425, -185, "#88dddd"],
                  [963, -185, "#88dddd"],
              ],{region:[934+xoff,424,60,35],threshold:15});
                
            if(lose){
             lose = null
             stuckorlose = true
               // stuckthread.interrupt()
               // log("关闭卡死检测")
               log("已团灭")
               sleep(500)
               click(1350+xoff,734)//再战
              //  click(767+xoff,734));//撤退
               log("再战")
               sleep(500)
               stuckorlose = false
              //  losethread.interrupt();
            }else{
              log("未团灭")
     
            }
            sleep(8307)
        }
     })
          }
             while (true) {

               
         
               var esc = FindMultiColors("#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:25})
     
             
           
     
             if (!esc) {
               log("not found esc");
               click(345+xoff, 353);
             } else {
               log(esc);
               esc = null
               log("have found esc");
               break;
             }
             sleep(1000);
           }
     

           if(helpflag){
           

             
             var rescue = FindMultiColors("#ff5533",[[-50,-14,"#ff5533"],[-30,-123,"#c5c577"]])
             
         
     
           if (!rescue) {
             log("not found rescue");
             click(345+xoff, 353);
           } else {
             log(rescue);
             log("have found rescue");
             click(rescue.x, rescue.y);
             rescue = null
             sleep(300);
             switch(helptype){
               case 0://全员
                 click(2098+xoff,334)
               break; 
               case 1://工会
                 click(2098+xoff,469)
               break; 
               case 2://好友
                 click(2098+xoff,625)
             }
             
           }
           sleep(1000);
     
           }
           sleep(1000)
           
           while(true){

               
         
               var esc = FindMultiColors( "#ffffff", [
                [-68, 96, "#598ad9"],
                [-42, 135, "#60c160"]
            ], {
                threshold: 25
            })
     
             
           if(!esc){
            if(stuckorloseflag){ 
              if(stuckthread){stuckthread.interrupt();}
              if(losethread){losethread.interrupt();}}
             log("raid结束")
             //refresh
             while (true) {

                  
                  var refresh = FindColorInRegion(
                      
                      "#55bbcc",
                      2036 + xoff,
                      248,
                      5,
                      5,2
                  );
                  
              if (!refresh) {
                press(2103 + xoff, 865, 1); //退出奖励页面
              } else {
                  refresh = null;
                  press(1970+xoff,1020,1);
  
                  while(true){

                      
                      var list = DetectsColor("#49c0c0",2106+xoff,190);
                      
                      if(list){
                        break;
                      }
                      sleep(300);
                    }
                  }
                  onbattle.setAndNotify("continue");
            if(limithellthread) limithellthread.interrupt();
             log("limithell线程结束");
                  break;
              }
              sleep(1000); //正常速度为1500ms
          }
             
           else{
             log("raid 未结束")
           }
     
           sleep(1001)
     
           }
         
             
           }
     
           sleep(1500);
     
         }
         })
         
      if(onbattle.blockedGet()=="back"){
        log("开催中")
          click(1250+xoff,738);
          continueraid();
          engines.execScriptFile("./普协开车.js");
          exit();
  
      }else if(onbattle.blockedGet() == "continue"){
        switch(nortype){
          case 0://hell
          while(true){
            var yellowpt = DetectsColor("#ffcc00",964+xoff,937,threshold = 5);
            if(yellowpt){
              break;
            }else{
             press(2125+xoff,357,1)

            }
            sleep(800);
          }
          
          break;
          case 1://黄
          case 2://绿
          case 3://蓝
          case 4://红
            while(true){
              var refreshbt = FindColorInRegion(
                "#55bbcc",
                2036 + xoff,
                248,
                5,
                5,2
              );

              if(refreshbt){
                press(1943+xoff,397,1);
                sleep(700);
                press(1970+xoff,1020,1);
                
                while(true){
              
                    
                    var list = DetectsColor("#49c0c0",2106+xoff,190);
                    
                    if(list){
                      break;
                    }
                    sleep(300);
                  }
                
                break;
                
              }else{
             press(2125+xoff,357,1)

              press(1830 + xoff, 220, 1); //0

              }
              sleep(800);
            }
          break;
         
        }
        //定时重启助手(在退出战斗时判断便于重启后再运行脚本)
        if(restartflag){
          threads.start(function(){
          //重启助手
          if(new Date()-starttime>restarttime){
              restart(context);
          }
        })
        }
        continue limit;
      }
  
    }
    
    sleep(1000);
  }
  
  //左侧黑边检测
  function leftBlack() {
    let a = images.captureScreen();
    let Y = a.height;
    let x = 0;
    let y = Y / 2;
    if(a.width == 1920 ){
        return 0;
    }else{
        
        while (x < a.width - 1) {
          if (a.pixel(x, y) != a.pixel(x + 1, y)) {
            if (x == 0) return x;
            else return x + 1;
          }
          x++;
        }
        return x + 1;
    }
  }

  function restart(context) {
    toast("即将重启应用");
    // 获取启动的intent
  var intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
    var restartIntent =PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_ONE_SHOT);
    // 设置杀死应用后2秒重启
    var mgr =  context.getSystemService(context.ALARM_SERVICE);
    mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 2000, restartIntent);
    // 重启应用
    android.os.Process.killProcess(android.os.Process.myPid());
  }
  
  function continueraid() {
  
    while (true) {

            
      var refreshbotton = FindColorInRegion(
        
        "#55bbcc",
        2036 + xoff,
        248,
        5,
        5,2
      );
            
        if (!refreshbotton) {
            var helpImg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAABS9JREFUSImdlVtsVFUUhr+zz5k57TADHab3K6WUIiIgGIViohjRSFBMvEaJqMCDYqI8AIag8qBoorxgggkJxvCA0QR9kZCYgCngBVsuIqRQuXSope303rl0zpzL9mGGMz0VTHC97Z211r/Xv9b6tyKEkFJKpJRMtLBfZf/99ayqmAaA4UjahpIsKw66Po6EjkSaZUcvYUnJznlVbJxVAoDpSFr64zx27C8EtzFdCJZGprjnkYzFa62d7LhwwwWIpgw2ne1i1LRpDOqsn1ns+sctm10dfUhAEwqU6D4E+Uo0RWFxOEDErwFgS0lP2iRlOxy4PkRAEywvCfHWmS7+GEkR0gTvzilHFwoAElAVhaerilhdWYRSHyyQ7Y/PdR3uxGKGxaMtHTQEdQ4ubeB2KcSicOB/ATgS+g0TW0r2LKq9LQCAaJ7A+51YxnHoiBt8fm8tFQW+//TV+tImX3UO5lEVqCn0s7w05L64ezzDkVjcE6gq0BgsYMmER46ZNu9fuMHFeBqAiF/ji0W1aJ91xNCFQmWBxpWEwRRN8HZjqQuSdhy+6Rpm87m/CftV1tZF+LJzkIdLQhxsnjmpOsmx/gRnRlLoQuGpyiKm+lS056vDfDC3nGtJg5XHL+MXCksj+V0wbMmvgwmKfCq7F9byQk2YNXURKgp8aIq3ERIwc/sW0AQv1U7P0vX1AzPc0hYWBehLm579yDgOf46Os2l2GWvqskGLw4Fbci/JLqFQoLzAx8rcIrvLWKgKnqycRlOowN0PS0r6DIvna6bz/twKN1HadrAmKQSAkutVQBWsrYvgz42cC6ILhSfKp9FcnK9CoFBd6OPDeZUuQF/a5NXWTq4mDIYzNt90Def9FSjWNeoCOm/m5MWSMg+Sdhxah5I8XBJyg1J2tumDGQuAAcPi9dYoP/aN8dtQkg2norT056dOoDAjoLO5qYyQpgIQNx1E23CKsyMpnvnlKqaUrCib6gYlLZud7b2sOnGZsyMpNrRFOdw7ypjpsPVcN4d6RknZjuvvFwrLS0O8nOtdxpEcH4ijLCkOymjCYOucct5uLHUDLCk5OZjkwZ8uoZAVOdPx9sEvFFZWTOP75gb3zpG429+XNrMq3D6WZttdXoCbrzg5lGROqIDvmht4sWY6k82WEE1mPHc3AZKWw96rA5wbHUfbNb+KdfXF/0qgALUBPyceaSLi13ioJIThOHw7odG2lPQZJoYjPfpnSUnbcJKP2nuywOvqi935nmiFquDZ6rA7zmG/yu6FNR4ZAbAcSVfKW02/YbHxdBdGLqeYWNrEl1yKpz2TA9l/Z+/iOkr1LHBAFaypi9AQ1L2UAUnbzp/jls0nF3vpSZvuZcaR/NAzyvq2KFeTRp5CBab6VBqCOgFV8EZDCZ/Or2ayyk/RVF6pi+RBvrw2yJ4rMQ8Nhi35eSBBNJXhzdPXsaTEkpLfh5KsaOmgfSzNrgXVfLag+pb/SEAVvFgz3e2TeiSW2BHSVD6+p4qAmt3NMdNm+/kbjJk2sbSFTyh0j5u8fLKTqkI/B5bUs7qqyE3qyOyfrufiFSWrIDHD4tRwKiukd0/16tXlhEFvjr64ZfPe+RuU6Bpbmsp4Z3aZZ5LGbYevrw+x79ogx5bPRs0pc8insqWpnEM9o2ibGkt5rjrsoer4QGICv4K3ZpWytamcsF/10JK0HHZfjrH9fDdFPo2jsbirGDdXYN99MxCf3FPlke6043C4d9Q9a4pCY1D/F0Dcstl+vpttf3bjyKwE7Y8OMtk0ofAP82Y2pQzz9G4AAAAASUVORK5CYII=")
  

                
                try {
                    var help = FindImageInRegion(
                        
                        helpImg,
                        1187 + xoff,
                        261,
                        36,
                        34,0.8
                    );
                } catch (err) {
                    
                    continue;
                }
                
            helpImg = undefined;
            if (!help) {
                log("not found help");
                back(); //用于关闭第进入游戏时的活动弹窗
            } else {
                log(help);
                click(help.x, help.y);
                help = null;
                log("open help");
                break;
            }
        } else {
            refreshbotton = null;
            break;
        }
  
        sleep(2000);
    }
  
    while (true) {
        //刷新按钮颜色
        while (true) {

                
                var refresh = FindColorInRegion(
                    
                    "#55bbcc",
                    2036 + xoff,
                    248,
                    5,
                    5,2
                );
                
            if (!refresh) {
                log("not  found refresh and wait");
            } else {
                click(refresh.x, refresh.y); //refresh button
                refresh = null;
                log("has found refresh");
                break;
            }
            sleep(1500); //正常速度为1500ms
        }
        //灰色刷新按钮
        while (true) {

                
                var grefresh = FindColorInRegion(
                    
                    "#666666",
                    2036 + xoff,
                    248,
                    5,
                    5
                );
                
  
            if (!grefresh) {
                log("not  found grefresh and wait");
            } else {
                grefresh = null;
                log("has found grefresh");
                break;
            }
            sleep(20);
        }

            
            var onattend = FindMultiColors( "#ff5533", [
                [81, 2, "#ffffcc"],
                [163, 1, "#ff5533"]
            ]);
            
        if (onattend) {
            log("fonud onattend");
            click(onattend.x + 20, onattend.y + 20);
            onattend = null;
            c: while (true) {

                    
                    var simple = FindColorInRegion(
                        
                        "#ffffcc",
                        1805 + xoff,
                        238,
                        10,
                        6
                    );
                    
  
                if (!simple) {
                    log("not found simple");
  
                } else {
                    log("found simple");
                    simple = null;
                    if(autoflag){//是否调节过行动状态
                      global.autoflag = false;
                     autoflag = false;
                    sleep(800)
                      click(512+xoff,923)
                      sleep(1500)
                      switch(autotype){
                        case 0:
                          
                          while(true){
                      
                                
                            var movemode = DetectsColor("#091010",2030+xoff,990,threshold = 25)
                                
                              if(!movemode){
                                    press(1890+xoff,964,1);
                                    sleep(1000);
                              }else{
                                break;
                              }
                            }
                          break; 
                          case 1:
                            while(true){
                      
                                  
                              var movemode = DetectsColor("#000000",2027+xoff,969);
                                  
                                if(!movemode){
                                  press(1890+xoff,964,1);
                                      sleep(1000);
                                }else{
                                  break;
                                }
                              }
                      
                          break; 
                                
                        }
                    click(487+xoff,1047);
                    while(!DetectsColor("#88dddd",516+xoff,915)){
                      sleep(500)
                    }
                    log("人物状态设置完成")
                    }

                    click(1873 + xoff, 997);
                    log("open battle");
  
                    var loopflag = threads.disposable();
                    var recoverthread = threads.start(function () {
                        //吃药子线程
                        let time = new Date();
  
                        while (new Date() - time < 5000) {

                                
                                var empty = DetectsColor(
                                    
                                    "#ff5533",
                                    1609 + xoff,
                                    137
                                );
                                
  
                            if (!empty) {
                                log("ap enough");
                            } else {
                               if(bugthread) bugthread.interrupt();
                               if(teninthread) teninthread.interrupt();
                                log(empty);
                                empty = null;
                                click(1639 + xoff, 592); // click(1624+xoff,439) 石头
  
                                log("clicked use");
  
                                while (true) {

                                        
                                        var ensure = DetectsColor(
                                            
                                            "#ff5533",
                                            1255 + xoff,
                                            818,
                                            (threshold = 16)
                                        );
                                        
                                    if (!ensure) {
                                        if (new Date() - time > 5000) {
                                            //寻找决定按钮7s未找到，结束脚本
                                            log("药吃完结束脚本");
                                            exit();
                                        }
                                    } else {
                                        ensure = null;
                                        break;
                                    }
                                    sleep(109);
                                }
  
                                click(1759 + xoff, 530);
  
                                log("clicked max");
  
                                click(1442 + xoff, 838);
                                log("clicked recover");
  
                                // sleep(1000);
  
                                //重新进入循环
                                loopflag.setAndNotify("re"); //吃药成功发送battle事件
                                log("吃药线程结束1");
                               if(recoverthread) recoverthread.interrupt();
                            }
                            sleep(497);
                        }
                        loopflag.setAndNotify("null"); //无事发生
                        log("吃药线程结束2");
                    });
  
                    if (loopflag.blockedGet() == "re") {
                        log("收到再次战斗信息");
  
                        continue c;
                    }
  
                    var stuckorlose = false; //触发lose 或者stuck 关闭 退出奖励页面和0贡献的点击
                    if (stuckorloseflag) {
                        var stuckthread = threads.start(function () {
                            sleep(30999)
                            log("卡死检测开始")
                            while (true) {

                                    
                                    var a = captureScreen()
                                    var bosshpimg = images.clip(a, 1173+xoff, 42, 157, 22)
                                    
                                if(bosshpimg){
                                  log("boss hp clipped down")
                                  log("waitting....")
                                  sleep(30999)

                                    
                                  if(FindImageInRegion(bosshpimg,1173+xoff,42,157,22,0.9)){
                                      bosshpimg = undefined
                                     if(losethread) losethread.interrupt()
                                      stuckorlose = true
                                      sleep(500)
                                      log("get stuck")
                                      log("关闭团灭检测")
                                      click(2066+xoff,90)
                         
                                      let time = new Date()
                                      while(true){
                                        if(new Date()- time > 3500){break;}//4s内未找到撤退按钮退出循环
                                          if(DetectsColor("#85dee1",1494+xoff,828,threshold = 15)){
                                                  click(1606+xoff,846)
                                                  sleep(1500)
                                                  click(1375+xoff,721)
                                                  log("卡死已退出")
                                                  sleep(500)
                                                  stuckorlose = false
                                                  
                                                 if(stuckthread) stuckthread.interrupt()
                                          }else{
                                              sleep(297);
                                          }
                                          
                                      }
                                  }
                                  
                                  }else{
                                    continue;
                                  }
                                log("not stuck")
  
                                sleep(3197)
                            }
                        })
  
                        var losethread = threads.start(function () {
                            sleep(20009)
                            while (true) {

                                    
                                    var lose = FindMultiColors( "#ffffff", [
                                      [306, -2, "#ffffff"],
                                      [479, 5, "#ffffff"],
                                      [-425, -185, "#88dddd"],
                                      [963, -185, "#88dddd"],
                                  ],{region:[934+xoff,424,60,35],threshold:15});
                                    
                                if (lose) {
                                    lose = null
                                    stuckorlose = true
                                    // stuckthread.interrupt()
                                    // log("关闭卡死检测")
                                    log("已团灭")
                                    sleep(500)
                                    while (!click(1350 + xoff, 734)); //再战
                                    //  click(767+xoff,734));//撤退
                                    log("再战")
                                    sleep(500)
                                    stuckorlose = false
                                    //  losethread.interrupt();
                                } else {
                                    log("未团灭")
  
                                }
                                sleep(8307)
                            }
                        })
                    }
                    while (true) {

                            
  
                            var esc = FindMultiColors( "#ffffff", [
                                [-68, 96, "#598ad9"],
                                [-42, 135, "#60c160"]
                            ], {
                                threshold: 25
                            })
  
                            
  
  
                        if (!esc) {
                          if(stuckorloseflag){ 
                              if(stuckthread){stuckthread.interrupt();}
                              if(losethread){losethread.interrupt();}}
                            log("not found esc");
                            click(345 + xoff, 353);
                        } else {
                            log(esc);
                            esc = null
                            log("have found esc");
                            break;
                        }
                        sleep(1000);
                    }
  
           
  
                    if (helpflag) {
  

                            
                            var rescue = FindMultiColors( "#ff5533", [
                                [-50, -14, "#ff5533"],
                                [-30, -123, "#c5c577"]
                            ])
                            
  
  
                        if (!rescue) {
                            log("not found rescue");
                            click(345 + xoff, 353);
                        } else {
                            log(rescue);
                            log("have found rescue");
                            click(rescue.x, rescue.y);
                            rescue = null
                            sleep(300);
                            switch (helptype) {
                                case 0: //全员
                                    click(2098 + xoff, 334)
                                    break;
                                case 1: //工会
                                    click(2098 + xoff, 469)
                                    break;
                                case 2: //好友
                                    click(2098 + xoff, 625)
                            }
  
                        }
                        sleep(1000);
  
                    }
                    sleep(1000)
  
                    while (true) {

                            
  
                            var esc = FindMultiColors( "#ffffff", [
                              [-68, 96, "#598ad9"],
                              [-42, 135, "#60c160"]
                          ], {
                              threshold: 25
                          })
  
                            
                        if (!esc) {
                            log("raid结束/shibai")
                            
                            //刷新按钮颜色
                            while (true) {

                                    
                                    var refresh = FindColorInRegion(
                                        
                                        "#55bbcc",
                                        2036 + xoff,
                                        248,
                                        5,
                                        5,2
                                    );
                                    
                                if (!refresh) {
                                    log("not  found refresh and wait");
                                    press(1830 + xoff, 220, 1); //退出奖励页面
                                } else {
                              
                                    click(refresh.x, refresh.y); //refresh button
                                    refresh = null;
                                    log("has found refresh");
                                    break;
                                }
                                sleep(1500); //正常速度为1500ms
                            }
                            return;
                        } else {
                          esc = null;
                            log("raid 未结束")
                        }
  
                        sleep(1001)
  
                    }
  
                }
                sleep(400);
            }
        } else {
            log("out of time");
            break;
        }
    }
  
  }
