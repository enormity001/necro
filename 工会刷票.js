importClass("android.app.PendingIntent");
importClass("android.app.AlarmManager");
importClass("java.lang.System");


var storage = storages.create("pref")
events.on("exit", function() {
  storage.put("ongoingscript","");
})
auto.waitFor(); //415,217
auto.setMode("normal");
images.requestScreenCapture();
sleep(300);

storage.put("ongoingscript","./工会刷票.js");
let starttime = new Date();//脚本运行开始时间
let restartflag = storage.get("restartflag",false);//定时重启flag
let restarttime = (storage.get("restarttime",3)+1) *60*60*1000;//定时重启时间间隔
var xoff = leftBlack() - 246;
var partflag = true;//助战检测
var parttype = storage.get("partflag2",false);
var rebattleflag= true;//
var speedtype = 2;
var autotype = 1;
var teamtype = storage.get("teamtype4",0);//0~5 队伍顺序
var autoorspeedflag = storage.get("autoorspeedflag", false);

var speedflag = true;
var autoflag = true;
var teamflag = storage.get("teamflag",false);
var recoverflag =  storage.get("recoverflag5",false);
var usediamond =  storage.get("usediamond5",false);
var timeflag = storage.get("timeflag6",false);
var timelimit = (parseInt(storage.get("hour6",0)) * 60  + parseInt(storage.get("minute6",0)))*60*1000;
var time = new Date()
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
var teamregion = [269+xoff,166,16,16];//队伍找色数组
var teamx = 43; //队伍图标间隔x上距离

if(timeflag){
threads.start(function(){
  setInterval(function(){
    if((new Date()-time)>timelimit){
      exit();
    }
  },60000)
})}

threads.start(function () {
  //断线检测
  sleep(111);
  while (true) {
    var relineImg = images.read("./reline.jpg");

      
      try {
        var reline = FindImageInRegion(
          
          relineImg,
          1442 + xoff,
          710,
          87,
          41,0.75
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
          56,0.75
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

        engines.execScriptFile("./工会刷票.js");
        exit();
      }
    }
    sleep(10343);
  }
});

while (true) {
  var questImg = images.read("./quest.jpg");

    
    var quest = FindImageInRegion(
      
      questImg,
      1869+xoff,
      972,
      137,
      65,0.75
    );
    
  questImg = undefined;

  if (!quest) {
    log("not found quest");
    back(); //用于关闭第进入游戏时的活动弹窗
  } else {
    log(quest);
    click(quest.x, quest.y);
    quest = null;
    log("open quest");
    break;
  }
  sleep(1500);
}
sleep(1000);
click(1913+xoff, 887);
sleep(3000);

while (true) {


    
    var solo = FindColorInRegion("#65d5e6",1499+xoff,897,6,6,threshold = 18)
    
  

  if (!solo) {
    log("not found solo");
    press(1933+xoff,950,1);

  } else {
    log(solo);
    click(solo.x, solo.y);
    solo = null;
    log("open solo");
    break;
  }
  sleep(800);
}

sleep(1000);
click(1745+xoff, 355);
sleep(3000);

//循环刷票，建议关闭助战
re: while (true) {
  normalbattleprc(partflag,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag)
  sleep(1000);
}


function normalbattleprc(partflag,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag){ //从寻找battle界面到战斗结束页面过程函数
  re: while (true) {
                      

          
          var simple = FindColorInRegion("#ffffcc",1805+xoff,238,10,6)
          
     
        
        if (!simple) {
            log("not found simple");
            click(409+xoff, 227);
        } else {
            log("found simple");
            simple = null;
            //选择队伍
            if(teamflag){
               global.teamflag = false;
               teamflag = false;
            

            
            while (
              !FindColorInRegion("#ffffff",teamregion[0]+teamx*teamtype,teamregion[1],teamregion[2],teamregion[3])
            ) {
              click(258+xoff,582);
              sleep(500);
            }
            
          log("队伍设置成功")
        
    
        }
    
    
          //选择倍速
          if(speedflag){//判断是否调过速
           global.speedflag = false;
              speedflag = false;
         

            
           switch(speedtype){
            case 0:
                while (!DetectsColor("#ffffff", 1489+xoff,1009, threshold = 20)) {
                    click(1371+xoff,964);
                    sleep(400);
                  }
              log("调速为1x")
              break;
            case 1:
                while (!DetectsColor("#e85533", 1570+xoff,1017, threshold = 20)) {
                    click(1371+xoff,964);
                    sleep(400);
                  }
              log("调速为2x")
              break;
            case 2:
                while (!DetectsColor("#f85533", 1558+xoff,1014, threshold = 20)) {
                    click(1371+xoff,964);
                    sleep(400);
                  }
              log("调速为3x")
              break;
            default:
                while (!DetectsColor("#f85533", 1558+xoff,1014, threshold = 20)) {
                    click(1371+xoff,964);
                    sleep(400);
                  }
              log("调速为3x")
              break;
        }
        
          log("调速成功") 
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
          click(1873+xoff,997);
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
                  empty = null;
                  if(usediamond){
                    click(1624+xoff,439);
                  }else{
                    click(1639+xoff, 592); // click(1624+xoff,439) 石头
                  }
                  
                  log("clicked use");
        
                  while(true){

                      
                    var ensure = DetectsColor("#ff5533",1255+xoff,818,threshold = 16)
                    
                    if(!ensure){
                      if(new Date()- time > 4500){//寻找决定按钮7s未找到，结束脚本
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
                  recoverthread.interrupt()
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
         
    
          //bug判定
          //``````
    
         
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
                click(1873+xoff, 997);
                log("吃药成功，再次开始")
                sleep(400)
                break;
              }
              sleep(500);
            }
          }
      


 
          //根据设备调等待时间
          while (true) {
           

              
              var esc = FindMultiColors("#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:25})

              
          
          
            if (!esc) {
              log("not found esc");
             press(345+xoff, 353,1);
            } else {
              log(esc);
              esc = null;
              //调节任务行动状态
              log("found esc");
              
              sleep(4000);
              //判断关卡结束
               //boss 的HP字体颜色
               while(!DetectsColor("#ff5533",1137+xoff,56,threshold = 2)){
                log("not found boss")
                sleep(700)
              }
              log("found boss")
              
              while(DetectsColor("#ff5533",1137+xoff,56,threshold = 2)){
                log("boss not died")
                sleep(700)
              }
              log("boss  died")


              while (true) {

                  
                  var next = FindMultiColors( "#ffffff", [
                    [21, 5, "#ffffff"],
                    [-149, -993, "#ffff22"],
                    [-2, -962, "#ffff22"],
                  ]);
                  
                if (!next) {
                  log("not found next");
                    press(1790 + xoff, 186,1);
                    press(1929 + xoff, 186,1)
                
                } else {
                 
                  log("found next");
                  //定时重启助手(在退出战斗时判断便于重启后再运行脚本)
                    if(restartflag){
                      threads.start(function(){
                      //重启助手
                      if(new Date()-starttime>restarttime){
                          restart(context);
                      }
                    })
                    }
                     //判断是否关闭助战

                     if(partflag){
                      sleep(100)
                     
                     if(parttype){

                         
                        
                         while (!DetectsColor("#88dddd",647+xoff,1037))
                         {
                             click(699+xoff,978);
                             sleep(100)
                         }   
                         
                       log("助战开启")
                     }else{
                     

                         
                         while (!DetectsColor("#666666",598+xoff,1037))
                         {
                          click(699+xoff,978);
                         sleep(100)
                         }
                         
                       log("助战关闭")
                     }
                     global.partflag = false;
                     partflag = false;
                    
                  }
                   //是否再战
                   if(rebattleflag){
                      log("rebattle")
                      click(996+xoff,1009)
                   }else{
                      log("next")
                      click(next.x,next.y)
                      next = null;
                      break re;
                   }    
                   next = null;                 
                continue re;
                }
                sleep(600);//next间隔
              }
            }
            sleep(1500);
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
