
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
        1360 + xoff,
        180,
        340,
        550,0.8
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
              // click(1830,220);//工会战0贡献退出
              // sleep(500);
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
