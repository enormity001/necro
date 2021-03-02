
importClass("android.app.PendingIntent");
importClass("android.app.AlarmManager");
importClass("java.lang.System");
var storage = storages.create("pref");
events.on("exit", function() {
  storage.put("ongoingscript","");
})
auto.waitFor(); //415,217
auto.setMode("normal");
images.requestScreenCapture();
sleep(300);
var xoff = leftBlack() - 246;
storage.put("ongoingscript","./蹭小号.js");
let starttime = new Date();//脚本运行开始时间
let restartflag = storage.get("restartflag",false);//定时重启flag
let restarttime = (storage.get("restarttime",3)+1) *60*60*1000;//定时重启时间间隔
var stuckorloseflag = storage.get("stuckorloseflag",false);
var autoorspeedflag = storage.get("autoorspeedflag", false);


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

var Clip = sync(function(a,b,c,d){
  return images.clip(images.captureScreen(),a,b,c,d)
})

var sellflag = false;
var teamflag = storage.get("teamflag", false);
var teamtype = storage.get("teamtype3", false); //0~5 队伍顺序
var guildflag = storage.get("guildflag", false); //工会战flag
var teamregion = [269 + xoff, 166, 16, 16]; //队伍找色数组
var teamx = 43;
var time = new Date();
var timelimit = storage.get("", false);
var recoverflag = storage.get("", false);
var autoflag = true;
var autotype = 1;
if (!guildflag) {
  var timeflag = storage.get("timeflag7", false);
  var timelimit =
    (parseInt(storage.get("hour7", 0)) * 60 +
      parseInt(storage.get("minute7", 0))) *
    60 *
    1000;
  var recoverflag = storage.get("recoverflag6", false);
  if (timeflag) {
    threads.start(function () {
      setInterval(function () {
        if (new Date() - time > timelimit) {
          exit();
        }
      }, 60000);
    });
  }
} else {
  var timeflag = storage.get("timeflag8", false);
  var timelimit =
    (parseInt(storage.get("hour8", 0)) * 60 +
      parseInt(storage.get("minute8", 0))) *
    60 *
    1000;
  var recoverflag = storage.get("recoverflag7", false);
  if (timeflag) {
    threads.start(function () {
      setInterval(function () {
        if (new Date() - time > timelimit) {
          exit();
        }
      }, 60000);
    });
  }
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
 
                  
                      var close = DetectsColor(
                          
                          "#7ae6f4",
                          2094 + xoff,
                          78,
                          (thresholdd = 15)
                      );
                  
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
 
          engines.execScriptFile("./蹭小号.js");
          exit();
      }
      sleep(311)
 
     var relineImg = images.read("./reline.jpg");
 
       
         var reline = FindImageInRegion(
           
           relineImg,
           1442 + xoff,
           710,
           87,
           41,0.8
         );
       
 
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
 
             
               var close = DetectsColor(
                 
                 "#7ae6f4",
                 2094 + xoff,
                 78,
                 (thresholdd = 15)
               );
             
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
 
         engines.execScriptFile("./蹭小号.js");
         exit();
       }
 
       
     }
     sleep(10343);
   }
 });
 

start: while (true) {
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


        
          var help = FindImageInRegion(
            
            helpImg,
            1187 + xoff,
            261,
            36,
            34,0.8
          );
        
      helpImg = undefined;
      if (!help) {
        log("not found help");
        back(); //用于关闭第进入游戏时的活动弹窗
      } else {
        log(help);
        click(help.x, help.y);
        while (true) {

                
                var refresh = FindColorInRegion(
                    
                    "#55bbcc",
                    2036 + xoff,
                    248,
                    5,
                    5,2
                );
                
           if(refresh) {
              if(guildflag){
                
                press(1943+xoff,537,1);
                sleep(500);
              }else{
                press(1943+xoff,397,1);
                sleep(500);
              }
                refresh = null;
                break;
            }
            sleep(600); //正常速度为1500ms
        }
        help = null;
        log("open help");
        break;
      }
    } else {
      if(guildflag){
                
        press(1943+xoff,537,1);
        sleep(500);
      }else{
        press(1943+xoff,397,1);
        sleep(500);
        }
      refreshbotton = null;
      break;
    }

    sleep(2000);
  }

  shiro: while (true) {
    if(!shiroImg){
      var shiroImg = images.fromBase64("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")
    }

      
      
      var shiro = FindImageInRegion(
        
        shiroImg,
        1390 + xoff,
        263,
        200,
        600,0.95
      );
      

    
    if (!shiro) {
      log("not found shiro and refresh");
    } else {
      shiroImg = undefined;
      click(shiro.x, shiro.y);
      shiro = null;
      log("open shiro");
      sleep(1500);

      battle();
      if (sellflag) {
        sellflag = false;
        continue start;
      }
      continue shiro;
    }
      //刷新按钮颜色
      while (true) {

            
        var refresh = DetectsColor(
            "#55bbcc",
            2037 + xoff,
            249
        );
        
    if (!refresh) {
        log("not  found refresh and wait");
    } else {
        click(2037 + xoff,249); //refresh button
        refresh = null;
        log("has found refresh");
        break;
    }
    sleep(1500); //正常速度为1500ms
}
//灰色刷新按钮
while (true) {
        var grefresh = DetectsColor(
            "#666666",
            2037 + xoff,
            249
        );
        

    if (!grefresh) {
        log("not  found grefresh and wait");
    } else {
        grefresh = null;
        log("has found grefresh");
        break;
    }
    sleep(30);
}
  }
}

function battle() {
  re: while (true) {
    //

      
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
      //选择队伍
      if (teamflag) {
        global.teamflag = false;
        teamflag = false;

          
          while (
            !FindColorInRegion(
              
              "#ffffff",
              teamregion[0] + teamx * teamtype,
              teamregion[1],
              teamregion[2],
              teamregion[3]
            )
          ) {
            click(258 + xoff, 582);
            sleep(500);
          }
          
        log("队伍设置成功");
      }
      //倍速 行动状态检测
      if(autoorspeedflag){ 
        if(autoflag){//是否调节过行动状态
         global.autoflag = false;
              autoflag = false;
              sleep(800)
         click(512+xoff,923)
         sleep(1500)
         //2倍速检测
         a:while(true){
             var temptime = new Date;
             while(new Date - temptime <1000){
                 if(DetectsColor("#ff5533",1713+xoff,977,threshold = 15)){
                     break a;
                 }
             
                 sleep(100)
             }

             press(1863+xoff,1000,1)
             sleep(1000)
         }
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
       }}
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
            if (recoverflag) {
              log(empty);
              empty = null;
              click(1639 + xoff, 592); // click(1624,439) 石头
              click(1639 + xoff, 592); // click(1624,439) 石头

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
                sleep(199);
              }

              click(1759 + xoff, 530);
              sleep(700);
              log("clicked max");

              click(1442 + xoff, 838);
              log("clicked recover");

              // sleep(1000);

              //重新进入循环
              loopflag.setAndNotify("re"); //吃药成功发送battle事件
              log("吃药线程结束1");
              recoverthread.interrupt();
            } else {
              back();
              sleep(500);
              back();
              exit();
            }
          }
          sleep(497);
        }
        loopflag.setAndNotify("null"); //无事发生
        log("吃药线程结束2");
      });

      if (loopflag.blockedGet() == "re") {
        while (true) {

            
            var simple = FindColorInRegion(
              
              "#ffffcc",
              1805 + xoff,
              238,
              10,
              6
            );
            
          if (simple) {
            simple = null;
            click(1873 + xoff, 997);
            log("吃药成功，再次开始");
            sleep(400);
            break;
          }
          sleep(500);
        }
      }

      var stuckorlose = false; //触发lose 或者stuck 关闭 退出奖励页面和0贡献的点击

   
      if(stuckorloseflag){
        var stuckthread = threads.start(function () {
          sleep(14999);
          log("卡死检测开始");
          while (true) {

              
              var bosshpimg = Clip(1173+xoff, 42, 157, 22);
              
            if(bosshpimg){
              log("boss hp clipped down")
              log("waitting....")
              sleep(30999)

                
              if(FindImageInRegion(bosshpimg,1173+xoff,42,157,22,0.9)){
                  bosshpimg = undefined
                  losethread.interrupt()
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
                              
                              stuckthread.interrupt()
                      }else{
                          sleep(297);
                      }
                      
                  }
              }
              
              }else{
                continue;
              }
            log("not stuck");
  
            sleep(3197);
          }
        });
  
        var losethread = threads.start(function () {
          sleep(20009);
          while (true) {

              
              var lose = FindMultiColors( "#ffffff", [
                  [306, -2, "#ffffff"],
                  [479, 5, "#ffffff"],
                  [-425, -185, "#88dddd"],
                  [963, -185, "#88dddd"],
              ],{region:[934+xoff,424,60,35],threshold:15});
              
            if (lose) {
              lose = null;
              stuckorlose = true;
              stuckthread.interrupt();
              log("关闭卡死检测");
              log("已团灭");
              sleep(500);
              while (!click(767 + xoff, 734)); //撤退
              while (!click(767 + xoff, 734)); //撤退
              log("团灭返回界面");
              sleep(500);
              stuckorlose = false;
              losethread.interrupt();
            } else {
              log("未团灭");
            }
            sleep(8307);
          }
        });
      }


      while (true) {

          
          var esc = FindMultiColors( "#ffffff", [
            [-68, 96, "#598ad9"],
            [-42, 135, "#60c160"],
          ],{threshold:25});

          

        if (!esc) {
          log("not found esc");
          click(1873 + xoff, 997);
        } else {
          log(esc);
          //调节人物行动状态
          esc = null;
          log("found esc");
     
          break;
        }
        sleep(1000);
      }

      sleep(1000);
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
          if (guildflag) {

              
              var full = FindMultiColors( "#ffffff", [
                [-174, 24, "#ff6840"],
                [208, 17, "#ff6840"],
                [-449, -160, "#ff5533"],
                [454, -154, "#ff5533"],
                [-681, -534, "#88dddd"],
                [706, -536, "#88dddd"],
              ]);

              
            if (full) {
                if(stuckorloseflag){ 
                    if(stuckthread){stuckthread.interrupt();}
                    if(losethread){losethread.interrupt();}}
              click(full.x, full.y);
              sleep(2500);
              click(2043 + xoff, 68);
              sleep(2500); //back home
                while (!sell()){
                  sleep(2000)
                }; 


              sellflag = true;
              return;
            } else {
              log("not full");
            }
          }


            
            var refresh = FindColorInRegion(
              
              "#55bbcc",
              2036 + xoff,
              248,
              5,
              5,2
            );
            
          if (!refresh) {
            log("not found refresh");
            if (!stuckorlose) {
              // click(837,762)//团灭退出
              // sleep(500)
              press(1879+xoff,172,1)//工会战0贡献退出//工会战0贡献退出
              sleep(100);
              press(2103 + xoff, 865,1); //退出奖励页面
            }
          } else {
            
            refresh = null;
            //定时重启助手(在退出战斗时判断便于重启后再运行脚本)
            if(restartflag){
              threads.start(function(){
              //重启助手
              if(new Date()-starttime>restarttime){
                  restart(context);
              }
            })
            }
            //  click(refresh.x, refresh.y);
            //  log("click refresh");
            // sleep(1500);
            break re;
          }
        } else {
          log("raid未结束");
          sleep(1001);
        }
        sleep(700)
      }
    }
    sleep(1000);
  }
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

function sell(){

  var emptyflag = false; //判断邮箱是否空了
  var atkflag = true;
  var starflag = true;
  sleep(500);
  while (true) {
    var equipImg = images.read("./equip.jpg");

      
      var equip = FindImageInRegion(
        
        equipImg,
        1332+xoff,
        530,
        106,
        52,0.75
      );
      

    equipImg = undefined;

    if (!equip) {
      log("not found equip");
      back()
    } else {
      log(equip);
      click(equip.x, equip.y);
      equip = null;
      log("open equip");
      break;
    }
    sleep(2000);
  }
  sleep(2000);

  //进入卖装备界面
  for(let counter = 0;;counter++){
    if(counter > 20){return;}//sell查找次数
    var sellImg = images.read("./sell.jpg");

      
      var sell = FindImageInRegion(
        
        sellImg,
        1734+xoff,
        895,
        159,
        53,0.75
      );
      
    sellImg = undefined;

    if (!sell) {
        press(1419+xoff,544,1);
      log("not found sell");
    } else {
      sleep(1500)
      click(sell.x, sell.y);
      
        click(sell.x, sell.y);
      sell = null;
      log("open sell");
      break;
    }
    sleep(1000);
  }
  sleep(1500);

  for(let counter = 0;;counter++) {
    if(counter > 20){return;}//oma查找次数
    //找oma
      var oma = FindMultiColors(
        
        "#ffffff",
        [
          [20, 2, "#0b100f"],
          [63, -5, "#ffffff"],
          [265, -20, "#ff5533"],
        ],
        {
          region: [348+xoff, 999, 12, 12],
        }
      );
      

    if (!oma) {
      log("not found oma");
    } else {
      log("found oma");
      oma = null;
      //设定为atk排序
      if (atkflag) {
        click(1475+xoff, 1009);

        //   
        //   while (!DetectsColor( "#ff5533", 1252+xoff, 879)) {
        //     sleep(200);
        //   }

        //   
        // }
        while(true){

            
          var redbt = DetectsColor( "#ff5533", 1255+xoff, 772,threshold = 30)
            
          if(!redbt){
            sleep(200);
          }else{
            break;
          }
        }

        press(829+xoff, 611,1);
        press(1441+xoff, 748,1);
        log("设置为atk排序");

        sleep(1000);

      //     
      //   while (!DetectsColor( "#ffffff", 1654+xoff, 1017)) {
      //     //是否为递增排序
      //     click(1693+xoff, 987);
      //     sleep(300);
      //   }
      //   
      // }
      while(true){

          
        var atkod = DetectsColor( "#ffffff", 1654+xoff, 1017)
          
        if(!atkod){
          press(1693+xoff, 987,1);
          sleep(600);
        }else{
          break;
        }
      }

        log("设置为递增排序");
        atkflag = false;
      }
      break;
    }
    sleep(1000);
  }

  //sell主体部分（循环
  oma:  for(let counter = 0;;counter++) {
    if(counter > 20){return;}//oma查找次数
    //先omakase售卖

      
      var oma = FindMultiColors(
        
        "#ffffff",
        [
          [20, 2, "#0b100f"],
          [63, -5, "#ffffff"],
          [265, -20, "#ff5533"],
        ],
        {
          region: [348+xoff, 999, 12, 12],
        }
      );
      

    if (!oma) {
      log("not found oma");
    } else {
      click(oma.x, oma.y);
      log("open oma");
      sleep(1000);

      for(let counter = 0;;counter++) {
        if(counter > 20){return;}//ensure查找次数
        //判断oma是否弹出界面

          
          var ensure = FindMultiColors(
            
            "#ff5533",
            [
              [292, -6, "#ff5533"],
              [67, -245, "#88dddd"],
            ],
            {
              region: [622+xoff, 371, 5, 5],
            }
          );
          
        if (!ensure) {
          press(oma.x, oma.y,1);
          sleep(300);
          oma = null;
          log("not found ensure");
        } else {
          log("found ensure");
          ensure = null;
          //判断3，4星装备勾选

          if (starflag) {

            //   while (
            //     !DetectsColor( "#ff5533", 1223+xoff, 382)
            //   ) {
            //     click(1399+xoff, 370);
            //     sleep(200);
            //   }
            //   while (
            //     !DetectsColor( "#ff5533", 1528+xoff, 376)
            //   ) {
            //     click(1700+xoff, 372);
            //     sleep(200);
            //   }
            //   
            // }
            while(true){//3星

              
              var redbt1 = DetectsColor( "#ff5533", 1223+xoff, 382)
              
            if(!redbt1){
              press(1399+xoff, 370,1);
              sleep(200);
            }else{break;}
          }
            while(true){//4星

              
              var redbt2 = DetectsColor( "#ff5533", 1528+xoff, 376)
              
            if(!redbt2){
              press(1700+xoff, 372,1);
              sleep(200);
            }else{break;}
          }

            starflag = false;
          }
          //点击确定
          click(1404+xoff, 900);

          //4星以下是否卖完
          equiploop:  for(let counter = 0;;counter++) {
            if(counter > 25){return;}//查找次数
            //judge按钮

            //按钮是否为红色

              
              var onensure = DetectsColor(
                
                "#ff7045",
                1772+xoff,
                1011,threshold = 30
              );
              

            //按钮为红色，进行售卖后迭代oma
            if (onensure) {
              //点击确定
              onensure = null;
              
              press(1876+xoff, 1013,1);
              sleep(100);
              log("open onensure");
              //白色cancel按钮
              var starimg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAABHNCSVQICAgIfAhkiAAAAiBJREFUOI21lLtvE0EQh787n2/x7RpjHEEkFJzg89kFDeFvoKaioE+FlAoJUaFUCAEVj7+BlNTQIdJSIYgUEkwRCcUPydi5PPw4irOT2Le+xEH8yp2Zb2dmZ8fIplXARIWmtGXyyJ3hwfxl3lYaPP9Ro9Xt61yPZOphwYinpwQlKTCAshR4jj3qpknNjPMYnnjSxlP24BKbkhKTi5yc8egVTsLEUzZzqSQAc6kkRWWTSmhDJ4PHq/KkTVmFbQDCdiiBJ+2zg3WvWFICT4rIWUmdEayDCtPAkzb5QRuGyqeSlJRAmIYmSpPxuLxBZuPxphE+YjGmHdbS9aw2W4CbacGtTEprW8xcYCmf5WvrQGs3gnu3Yz7I+RU/M/8C3vIP/ws48W2/t3JVWCw40Uc6j3oBfKi2STQCY+VT3We/H+ApG3nKj4pT9bDLm0qDpxtVjEvKCQCShsGdK4qHhRyLEyYhTl+ae7zcrPNxp00nCI7BQ5WV4HFxhruzF88Mff/7D882aqy3j0cvUncvCOhOOYDdIIw7qQjYlQL3lAUTiXFsCmMxEXBBJqcGF5UdiRkBzwoLV4qpJ0MmTFwpmBWWHuzKaEkQbr61hs+LzRprDV+7W1w5mrUVZwTwe33ebTd5tVXn116HeSfJ8kKO+9cyOCcqGyb1ueGPgpVlUhgrp+J3eP2zzup2k91e/+jsyfoO31sHLN/IHe3qsI3hB9vt9fkLhOecQDQZ96cAAAAASUVORK5CYII=")
              for(let counter = 0;;counter++) {
                if(counter > 50){return;}//star查找次数

              
              var star = FindImageInRegion(starimg,966+xoff,529,30,30,0.83)
            
          if(star){
            sleep(200)
            break;
          }else{sleep(300)}

          }
          starimg = undefined;
              press(1013+xoff, 648,1);
              press(1443+xoff, 762,1);

              // sleep(2000);//sell等待时间
              continue oma;
            }
            //判断按钮是否为灰色

              
              var offensure = DetectsColor(
                
                "#888888",
                1772+xoff,
                1011
              );
              

            //按钮为灰色，进行5星素材售卖
            if (offensure) {
              log("found offensure");
              offensure = null;
              sleep(1300)
        adsell: while (true) {
              if(!box1Img){ var box1Img = images.read("./box1.jpg");}
              if(!box2Img){ var box2Img = images.read("./box2.jpg");}

                
                  var mbox1 = MatchTemplate( box1Img, {
                    max: 21,
                    region: [411+xoff, 243, 1617, 621],
                    threshold:0.75
                  });
                  var mbox2 = MatchTemplate( box2Img, {
                    max: 21,
                    region: [411+xoff, 243, 1617, 621],
                    threshold:0.75
                  });
                
                log("正在检测5星材料");
              //结束sell循环
              if (mbox1.matches.length == 0 && mbox2.matches.length == 0) {
                box1Img=undefined;
                box2Img=undefined;
                log("5星材料已卖完，回到主界面");
                break oma;
              }else{
                  if(mbox1!=[] && mbox1.matches.length != 0){
                  mbox1.matches.forEach((match) => {
                    press(match.point.x, match.point.y,1);
                    sleep(30);
                  });
                }
                  if(mbox2!=[] &&mbox2.matches.length != 0){
                    mbox2.matches.forEach((match) => {
                      press(match.point.x, match.point.y,1);
                      sleep(30);
                    });
                  }
                  sleep(100);
                  press(1876+xoff, 1013,1);
                  sleep(100);
                  //红五角星
                  var starimg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAABHNCSVQICAgIfAhkiAAAAiBJREFUOI21lLtvE0EQh787n2/x7RpjHEEkFJzg89kFDeFvoKaioE+FlAoJUaFUCAEVj7+BlNTQIdJSIYgUEkwRCcUPydi5PPw4irOT2Le+xEH8yp2Zb2dmZ8fIplXARIWmtGXyyJ3hwfxl3lYaPP9Ro9Xt61yPZOphwYinpwQlKTCAshR4jj3qpknNjPMYnnjSxlP24BKbkhKTi5yc8egVTsLEUzZzqSQAc6kkRWWTSmhDJ4PHq/KkTVmFbQDCdiiBJ+2zg3WvWFICT4rIWUmdEayDCtPAkzb5QRuGyqeSlJRAmIYmSpPxuLxBZuPxphE+YjGmHdbS9aw2W4CbacGtTEprW8xcYCmf5WvrQGs3gnu3Yz7I+RU/M/8C3vIP/ws48W2/t3JVWCw40Uc6j3oBfKi2STQCY+VT3We/H+ApG3nKj4pT9bDLm0qDpxtVjEvKCQCShsGdK4qHhRyLEyYhTl+ae7zcrPNxp00nCI7BQ5WV4HFxhruzF88Mff/7D882aqy3j0cvUncvCOhOOYDdIIw7qQjYlQL3lAUTiXFsCmMxEXBBJqcGF5UdiRkBzwoLV4qpJ0MmTFwpmBWWHuzKaEkQbr61hs+LzRprDV+7W1w5mrUVZwTwe33ebTd5tVXn116HeSfJ8kKO+9cyOCcqGyb1ueGPgpVlUhgrp+J3eP2zzup2k91e/+jsyfoO31sHLN/IHe3qsI3hB9vt9fkLhOecQDQZ96cAAAAASUVORK5CYII=")
                  for(let counter = 0;;counter++) {
                    if(counter > 50){return;}//star查找次数

                  
                  var star = FindImageInRegion(starimg,966+xoff,529,30,30,0.83)
                
              if(star){
                sleep(200)

                break;
              }else{sleep(300)}

              }
              starimg = undefined;
                  press(1013+xoff, 648,1);
                  // sleep(100);
                  press(1443+xoff, 762,1);
                  log("正在售卖5材料");
                  mbox1 = [];
                  mbox2 = [];
                  //判断sell完成

                  for(let counter = 0;;counter++) {
                    if(counter > 50){return;}//star查找次数

                      var gbt = DetectsColor( "#888888", 1772+xoff, 1011)
                      
                    if(!gbt){
                      sleep(400);
                    }else{gbt = null;break;}
                  }

                  log("5星材料sell完毕");
                  sleep(1500)
                  //返回返回adsell，
                  continue adsell;
                }
              
                
                sleep(500);
              }
            }

            sleep(600); //判断按钮颜色间隔
          }
        }
        sleep(800); //ensure 判断间隔
      }
    }
    sleep(1000); //omakase判断间隔
  }
  sleep(500);
  click(2043+xoff, 68); //返回home

  //POST
  reciv: while (true) {
    //进入post
    while (true) {
      var postImg = images.read("./post.jpg");

        
        var post = FindImageInRegion(
          
          postImg,
          1965+xoff,
          743,
          179,
          102,0.7
        );
        
      postImg = undefined;
      if (!post) {
        log("not found post");
        back()
      } else {
        sleep(500);

          

          var still99 = DetectsColor(
            
            "#ff5533",
            2077+xoff,
            774,20
          );
          
        if (!still99) {
          //邮箱已清空结束post循环
          log("post is empty1");
          emptyflag = true;
          break reciv;
        } //进入邮箱
        log(post);
        click(post.x, post.y);
        post = null;
        log("open post");
        break;
      }
      sleep(2000);
    }

    //收取操作
    re: for (var i = 0; i < 20000; i++) {

          
          var nospace = FindMultiColors("#ffffff",[[-646,89,"#88dddd"],[-647,-481,"#88dddd"],[745,-480,"#88dddd"],[743,91,"#88dddd"]],{region:[1150+xoff,708,43,41]})
          
        //背包满了，返回home
        if (nospace) {
          press(2115+xoff, 93,1);
          sleep(500);
          press(2115+xoff, 93,1);
          nospace = null;
          break reciv;
        }else{
            sleep(400);
            press(1916+xoff,989,1);
        }
      

        
        var offreciv = DetectsColor("#888888",2045+xoff,1013)
        

      //reciv为灰色，返回home
      if (offreciv) {
        log("post is empty2");
        press(2115+xoff, 93,1);
        sleep(500);
        press(2115+xoff, 93,1);
        break reciv;
      }
      sleep(500);
    }
  }
  return emptyflag;
}
