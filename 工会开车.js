importClass("android.app.PendingIntent");
importClass("android.app.AlarmManager");
importClass("java.lang.System");

var storage = storages.create("pref")
events.on("exit", function() {
  storage.put("ongoingscript","");
})
auto.waitFor(); //415,217

images.requestScreenCapture();
sleep(300);

storage.put("ongoingscript","./工会开车.js");
let starttime = new Date();//脚本运行开始时间
let restartflag = storage.get("restartflag",false);//定时重启flag
let restarttime = (storage.get("restarttime",3)+1) *60*60*1000;//定时重启时间间隔

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

var xoff = leftBlack() - 246;
// var partflag = true;//助战检测
// var rebattleflag= true;
// var speedflag = true;//倍速检测
// var speedtype = 2;
// var autotype = 1;
var autoflag = true;
// var autoflag = true;
var autotype1 = storage.get("autotype2",1);
// var parttype = storage.get("partflag2",false);
// var teamtype = storage.get("teamtype4",0);//0~5 队伍顺序
var teamtype1 = storage.get("teamtype3",0);//0~5 队伍顺序
// var teamflag = storage.get("teamflag",false);
var teamflag1 = storage.get("teamflag",false);
// var recoverflag = storage.get("recoverflag5",false);
var teamregion = [269+xoff,166,16,16];//队伍找色数组
var teamx = 43; //队伍图标间隔x上距离
var autoticket = false; // var autoticket = storage.get("autoticket",false)
var helpflag = storage.get("helpflag2",false);
var helptype = storage.get("forhelp2",0);
var difficulty = storage.get("difficulty",2);
var bosstype =storage.get("bosstype",0);
var stuckorloseflag = false;//var stuckorloseflag = storage.get("stuckorloseflag",false);
var sideacctflag = storage.get("sideacctflag1",false);
// var time1= new Date();

// var timeflag = storage.get("timeflag5",false);
// var timelimit1 = (parseInt(storage.get("hour5",0)) * 60  + parseInt(storage.get("minute5",0)))*60*1000;
// var timelimit2 = (parseInt(storage.get("hour6",0)) * 60  + parseInt(storage.get("minute6",0)))*60*1000;
// var namearr = [0,1,2,3,4];
// var colorarr = ["yellow","red","blue","green","purple"];
// for(let i = 0;i<colorarr.length;i++){
//     namearr[i]  = storage.get(colorarr[i],["0","0"])
// }


//断线检测

threads.start(function () {
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
 
          engines.execScriptFile("./工会开车.js");
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
 
         engines.execScriptFile("./工会开车.js");
         exit();
       }
     }
 
     
     sleep(10343);
   }
 });
 
 


start:while (true) {

  var questImg = images.read("./quest.jpg");

    
      var quest = FindImageInRegion(
        
        questImg,
        1869+xoff,
        972,
        137,
        65,0.8
      );
  
    
  questImg = undefined;

  if (!quest) {
    log("not found quest");
    back()
    sleep(1500);
    continue;
  } else {
    click(quest.x, quest.y);
    quest = null
    log("open quest");
  
  }
  sleep(1000);

sleep(1000);
click(1913+xoff, 887);
sleep(2500);

for(let counter = 0;;counter++) {
  if(counter >20){continue start;}

    
    var muti = FindColorInRegion("#ffcf3f",1862+xoff,894,6,6,threshold = 18)
    

  if (!muti) {
    log("not found muti");
    press(1933+xoff,950,1);
  } else {
    click(muti.x, muti.y);
    muti = null
    log("open muti");
    break;
  }
  sleep(1500);
}
sleep(1000);

switch(bosstype){
  case 0://黄
    // click(Number(namearr[0][0])+xoff,Number(namearr[0][1]));
    click(1290+xoff,290)
  break;
  case 1://红
    // click(Number(namearr[1][0])+xoff,Number(namearr[1][1]));
    click(1570+xoff,290)
  break;
  case 2://蓝
    // click(Number(namearr[2][0])+xoff,Number(namearr[2][1]));
    click(1850+xoff,290)
  break;
  // case 3://绿
  //   click(Number(namearr[3][0])+xoff,Number(namearr[3][1]));
  // break;
  // case 4://紫
  //   click(Number(namearr[4][0])+xoff,Number(namearr[4][1]));
  // break;
  // case 5://灰
  // click(2020+xoff,290)
  // break;

}

//hell
//click(2020,290)
sleep(1000);

re: while(true){
  switch(difficulty){
    case 0:
      

      
      var boss = FindMultiColors("#ffffcc",[[-33,-25,"#9955cc"]],{region:[1201+xoff,390,100,546]}) //1661,631,231,48 vh  //1666,417,137,45 ex //1632,860,75,36 h
      
    
    break;
    case 1:
      

      
      var boss = FindMultiColors("#ffffcc",[[-33,-25,"#dd6622"]],{region:[1201+xoff,390,100,546]})//1661,631,231,48 vh  //1666,417,137,45 ex //1632,860,75,36 h
      
    
    break;
    case 2:
      

      
      var boss = FindMultiColors("#ffffcc",[[-33,-25,"#33aabb"]],{region:[1201+xoff,390,100,546]})//1661,631,231,48 vh  //1666,417,137,45 ex //1632,860,75,36 h
      
    
    break;
  }

  if (!boss) {
    log("not found boss");
    click(1831+xoff, 215);
  } else {
    log(boss);
    click(boss.x, boss.y);//+633
    boss = null;
    log("open boss");

    var onbattle = threads.disposable();
//无用代码
    if(stuckorloseflag){
//     var onbattlethread = threads.start(function(){
//       sleep(77)
//       while (true) {

              
//                 var onprc = FindMultiColors( "#ffffff", [
//                     [-643, 99, "#88dddd"],
//                     [-646, -473, "#88dddd"],
//                     [742, -471, "#88dddd"],
//                     [742, 97, "#88dddd"]
//                 ], {
//                     region: [1126 + xoff, 704, 163, 48]
//                 });
              
//           if (onprc) {

//             //  if(ticketoffthread) ticketoffthread.interrupt();
//               if(guildbattlethread) guildbattlethread.interrupt();
//               log("门票和battle线程结束");
//               if(sideacctflag){
//                 onbattle.setAndNotify("sideacc");
//                 log("onbattle线程结束1");
//                if(onbattlethread) onbattlethread.interrupt();
//               }else{

//                 onbattle.setAndNotify("back");
//                 log("onbattle线程结束2");
//                 if(onbattlethread) onbattlethread.interrupt();
//               }
//           }
//           sleep(501);
//       }
//       // log("onbattle线程结束1");
//   })
}
  //不自动补票则关闭线程
  if(autoticket){
    // var ticketoffthread = threads.start(function(){
    //   sleep(57);
    //   // let time = new Date;
    //   while(true){

          
    //         var ticketoff = FindMultiColors("#ffffff",[[-190,-239,"#ff5533"],[-408,-133,"#ff5533"]],{
    //           region:[823+xoff,337,744,423]
    //         })
          
    //     if(ticketoff){
    //       if(onbattlethread) onbattlethread.interrupt();
    //       if(guildbattlethread) guildbattlethread.interrupt();
    //       log("onbattle和guildbattle线程结束");
    //       if(autoticket){
    //         click(ticketoff.x,ticketoff.y);
    //         ticketoff = null;
    //         sleep(1000);
    //         click(1745+xoff, 355);
    //         sleep(3000);
            
    //         normalbattleprc(partflag,parttype,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag);
    //         sleep(1000);
    //         while(true){

                
    //             var a = FindMultiColors("#ffffff",[[-24,-17,"#9955cc"]])
                
    //           if(a){a = null;break;}
    //           else{sleep(100)}
    //         }
    //         back();
    //         sleep(1500);
            
    //         while (true) {

                
    //             var muti = FindColorInRegion("#ffcf3f",1862+xoff,894,6,6,threshold = 18)
                
            
    //           if (!muti) {
    //             log("not found muti");
    //           } else {
    //             log(muti);
    //             click(muti.x, muti.y);
    //             muti = null
    //             log("open muti");
    //             break;
    //           }
    //           sleep(1500);
    //         }
    //         sleep(1000);
            
    //         switch(bosstype){
    //           case 0://黄
    //           click(Number(namearr[0][0])+xoff,Number(namearr[0][1]));
    //           break;
    //           case 1://红
    //           click(Number(namearr[1][0])+xoff,Number(namearr[1][1]));
    //           break;
    //           case 2://蓝
    //           click(Number(namearr[2][0])+xoff,Number(namearr[2][1]));
    //           break;
    //           case 3://绿
    //           click(Number(namearr[3][0])+xoff,Number(namearr[3][1]));
    //           break;
    //           case 4://紫
    //           click(Number(namearr[4][0])+xoff,Number(namearr[4][1]));
    //           break;
    //           case 5://灰
    //           click(2020+xoff,290)
    //           break;
            
    //         }
  
    //         onbattle.setAndNotify("re")
    //         log("门票线程结束1");
    //        if(ticketoffthread) ticketoffthread.interrupt();
            
    //       }else{
    //         back();
    //         sleep(1000);
    //         click(2100+xoff,50)
    //         exit();
    //       }
    //     }else{
    //       log("ticket enough")
    //     }

    //     sleep(499);
    //   }
    //   log("门票线程结束1");
    // })
  } 
//不开启卡死则关闭线程
 
   var guildbattlethread = threads.start(function(){
      sleep(47)
      for(let counter = 0;;counter++) {
        if(counter >20){
          onbattle.setAndNotify("start");
          if(guildbattlethread) guildbattlethread.interrupt();
        }

          //不开启补票线程则在主线程加上判断
          if(!autoticket){

              
                var ticketoff = FindMultiColors("#ffffff",[[-190,-239,"#ff5533"],[-408,-133,"#ff5533"]],{
                  region:[823+xoff,337,744,423]
                })
              
            if(ticketoff){
              back();
                sleep(1000);
                click(2100+xoff,50)
                exit();
            }
          }
           //不开启卡死再在
           if(!stuckorloseflag){

              
                var onprc = FindMultiColors( "#ffffff", [
                    [-643, 99, "#88dddd"],
                    [-646, -473, "#88dddd"],
                    [742, -471, "#88dddd"],
                    [742, 97, "#88dddd"]
                ], {
                    region: [1126 + xoff, 704, 163, 48]
                });
              
          if (onprc) {

              if(sideacctflag){
                onbattle.setAndNotify("sideacc");
                guildbattlethread.interrupt()
              }else{

                onbattle.setAndNotify("back");
                guildbattlethread.interrupt()

              }
          }
           }


         
           var simple = FindColorInRegion(//战斗界面 战斗力文字颜色
             
             "#ffffcc",
             1805+xoff,
             238,
             10,6
           );
         
   
       if (!simple) {
         log("not found simple");
        //  click(1945+xoff,218);
        //  sleep(100)
        //  click(boss.x, boss.y);
       } else {
         log("found simple");
         simple = null

        //  if(onbattlethread){onbattlethread.interrupt();}
        //  if(ticketoffthread){ticketoffthread.interrupt();}
         log("onbattle和门票线程结束");
         //选择队伍
         if (teamflag1) {
           global.teamflag1 = false;//全局
           teamflag1 = false;//局部

          //    
          //    while (
          //      !FindColorInRegion(
          //        
          //        "#ffffff",
          //        teamregion[0] + teamx * teamtype1,
          //        teamregion[1],
          //        teamregion[2],
          //        teamregion[3]
          //      )
          //    ) {
          //      click(258+xoff, 582);
          //      sleep(500);
          //    }
          //    
          //  }
           while(true){

              
              var teampoint = FindColorInRegion("#ffffff",teamregion[0] + teamx * teamtype1,teamregion[1],teamregion[2],teamregion[3]);
              
            if(!teampoint){
              press(258+xoff, 582,1);
              sleep(500);
            }else{
              break;
            }
           }

           log("队伍设置成功");
         }
         if(autoflag){//是否调节过行动状态
          global.autoflag = false;
          autoflag = false;
          sleep(800)
          click(512+xoff,923)
          sleep(1500)
          switch(autotype1){
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
         break;
       }
       sleep(803);
   }
//删除点卡斯检测
     var stuckorlose = false;//触发lose 或者stuck 关闭 退出奖励页面和0贡献的点击
     if(stuckorloseflag){
     var stuckthread = threads.start(function(){
     sleep(30999)
     log("卡死检测开始")
     while(true){

             
             var bosshpimg = Clip(1173+xoff,42,157,22)
             
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
   
 sleep(4000);

     while (true) {
       //计数器
       var i= 0
       while (true) {
           var esc = FindMultiColors("#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:25,region:[2051+xoff,91,22,22]})
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
     
   
        press(2128+xoff,308,1);
         sleep(700);
         switch(helptype){
           case 0://全员
             press(2098+xoff,334,1)
           break; 
           case 1://工会
           press(2098+xoff,469,1)
           break; 
           case 2://好友
           press(2098+xoff,625,1)

           break; 
         }
       }
       sleep(2000);

       while (true) {
           var esc = FindMultiColors("#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:25,region:[2051+xoff,91,22,22]})

       if(!esc){
        if(stuckorloseflag){ 
          if(stuckthread){stuckthread.interrupt();}
          if(losethread){losethread.interrupt();}}
         log("raid 结束")
         //每3次进行满仓和超时检测
        if(i%3==0){
           //满仓检测
           var full = FindMultiColors( "#ffffff", [
            [-174, 24, "#ff6840"],
            [208, 17, "#ff6840"],
            [-449, -160, "#ff5533"],
            [454, -154, "#ff5533"],
            [-681, -534, "#88dddd"],
            [706, -536, "#88dddd"],
        ],{threshold:20});

         if (full) {
          if(stuckorloseflag){ 
              if(stuckthread){stuckthread.interrupt();}
              if(losethread){losethread.interrupt();}}
           click(full.x, full.y);
           sleep(3000);//间隔尽量大一点，容易卡住
           click(2043+xoff,68);
           sleep(3000);//
             while (!sell()){
               sleep(2000)
             }; 
             
            
            
          onbattle.setAndNotify("start");
          if(guildbattlethread) guildbattlethread.interrupt();
          log("guild线程结束");
         }
         //超时检测
         var deadline = FindMultiColors("#ffffff",[[327,-96,"#88dddd"],[-103,-211,"#88dddd"],[-101,117,"#88dddd"],[745,18,"#ffffff"],[884,116,"#88dddd"],[884,-209,"#88dddd"]],
          {
            region:[812+xoff,570,30,30]
          })
          //超时重新开车
        if(deadline){
          press(deadline.x,deadline.y,1)
          log("outoftime")
          deadline = null;
          //定时重启助手(在退出战斗时判断便于重启后再运行脚本)
         if(restartflag){
           threads.start(function(){
           //重启助手
           if(new Date()-starttime>restarttime){
               restart(context);
           }
         })
         }
          onbattle.setAndNotify("re");
          if(guildbattlethread) guildbattlethread.interrupt();
          log("guild线程结束2");
        }
      }
         switch(difficulty){
           case 0://extra
             

             
             var boss2 = FindMultiColors("#ffffcc",[[-33,-25,"#9955cc"]],{region:[1201+xoff,390,100,546]}) //1661,631,231,48 vh  //1666,417,137,45 ex //1632,860,75,36 h
             
           
           break;
           case 1://vh
             

             
             var boss2 = FindMultiColors("#ffffcc",[[-33,-25,"#dd6622"]],{region:[1201+xoff,390,100,546]})//1661,631,231,48 vh  //1666,417,137,45 ex //1632,860,75,36 h
             
           
           break;
           case 2://hard
             

             
             var boss2 = FindMultiColors("#ffffcc",[[-33,-25,"#33aabb"]],{region:[1201+xoff,390,100,546]})//1661,631,231,48 vh  //1666,417,137,45 ex //1632,860,75,36 h
             
           
           break;
         }
       
       
         if (!boss2) {
           log("not found boss2");
           if(!stuckorlose){
             //奖励页面
             press(1831+xoff, 215,1);
             // sleep(200);
             press(2075+xoff,347,1);
             // sleep(200);
           }
         } else {
          
           boss2 = undefined;
           //定时重启助手(在退出战斗时判断便于重启后再运行脚本)
          if(restartflag){
            threads.start(function(){
            //重启助手
            if(new Date()-starttime>restarttime){
                restart(context);
            }
          })
          }
           onbattle.setAndNotify("re");
           if(guildbattlethread) guildbattlethread.interrupt();
           log("guild线程结束2");
         }

       }else{
         log("raid 未结束")
         //检测是否再次救援
         if(helpflag&&DetectsColor("#ff5533",2094+xoff,304,threshold = 3)){
          click(2128+xoff,308);
          sleep(700);
          switch(helptype){
            case 0://全员
              click(2098+xoff,334)
            break; 
            case 1://工会
              click(2098+xoff,469)
            break; 
            case 2://好友
              click(2098+xoff,625)
   
            break; 
          }
         }
      }
        i++
         sleep(1001);
       }


     
   }

   })
  

   if(onbattle.blockedGet()=="back"){
    log("开催中")
      click(1250+xoff,738);
      continueraid();
      engines.execScriptFile("./工会开车.js");
      exit();

  
  }else if(onbattle.blockedGet()=="sideacc"){
    continue re;
  }
  else if (onbattle.blockedGet()=="re"){
    continue re;
  }else if(onbattle.blockedGet()=="start"){
    continue start;
  }

  }
  sleep(1000)
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
                  click(512+xoff,923)
                  sleep(1500)
                  switch(autotype1){
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
                let stuckorlose = false;
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
                                stuckorlose = true;
                                // stuckthread.interrupt()
                                // log("关闭卡死检测")
                                log("已团灭")
                                sleep(500)
                                while (!click(1350 + xoff, 734)); //再战
                                //  click(767+xoff,734));//撤退
                                log("再战")
                                sleep(500)
                                stuckorlose = false;
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
                        sleep(500);
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

                  
                        var esc = FindMultiColors("#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:25})
                        
                    if (!esc) {
                      if(stuckorloseflag){ 
                          if(stuckthread){stuckthread.interrupt();}
                          if(losethread){losethread.interrupt();}}
                        log("raid结束/shibai")
                    
                        //刷新按钮颜色
                        while (true) {
                          
                                
                          var full = FindMultiColors( "#ffffff", [
                            [-174, 24, "#ff6840"],
                            [208, 17, "#ff6840"],
                            [-449, -160, "#ff5533"],
                            [454, -154, "#ff5533"],
                            [-681, -534, "#88dddd"],
                            [706, -536, "#88dddd"],
                        ],{threshold:20});
                              if (full) {
                                  if(stuckorloseflag){ 
                                      if(stuckthread){stuckthread.interrupt();}
                                      if(losethread){losethread.interrupt();}}
                                      click(full.x, full.y);
                                sleep(3000);//间隔尽量大一点，容易卡住
                                click(2043+xoff,68);
                                sleep(3000);//
                                  while (!sell()){
                                    sleep(2000)
                                  }; 
                                return;
                              }


                                
                                var refresh = FindColorInRegion(
                                    
                                    "#55bbcc",
                                    2036 + xoff,
                                    248,
                                    5,
                                    5,2
                                );
                                
                            if (!refresh) {
                                log("not  found refresh and wait");
                                if(!stuckorlose){
                                  //奖励页面
                                  press(1831+xoff, 215,1);
                                  // sleep(200);
                                  press(2075+xoff,347,1);
                                  // sleep(200);
                                }
                              } else {
                           
                                log("has found refresh");
                                break;
                            }
                            sleep(1500); //正常速度为1500ms
                        }
                        return;
                      } else {
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

// function normalbattleprc(partflag,parttype,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag){ //从寻找battle界面到战斗结束页面过程函数
//   var time2 = new Date();
//   re: while (true) {
                      

          
//           var simple = FindColorInRegion("#ffffcc",1805+xoff,238,10,6)
          
    
        
//         if (!simple) {
//             log("not found simple");
//             click(409+xoff, 227);
//         } else {
//             log("found simple");
//             simple = null;
//             //选择队伍
//             if(teamflag){
//               global.teamflag = false;
//               teamflag = false;
            
//               while(true){

                  
//                   var teampoint = FindColorInRegion("#ffffff",teamregion[0] + teamx * teamtype,teamregion[1],teamregion[2],teamregion[3]);
                  
//                 if(!teampoint){
//                   press(258+xoff, 582,1);
//                   sleep(500);
//                 }else{
//                   break;
//                 }
//                  }
//            log("队伍设置成功")
        
    
//         }
    
    
//           //选择倍速
//           if(speedflag){//判断是否调过速
//           global.speedflag = false;
//               speedflag = false;
        

            
//           switch(speedtype){
//             case 0:
//                 while (!DetectsColor("#ffffff", 1489+xoff,1009, threshold = 20)) {
//                     click(1371+xoff,964);
//                     sleep(400);
//                   }
//               log("调速为1x")
//               break;
//             case 1:
//                 while (!DetectsColor("#e85533", 1570+xoff,1017, threshold = 20)) {
//                     click(1371+xoff,964);
//                     sleep(400);
//                   }
//               log("调速为2x")
//               break;
//             case 2:
//                 while (!DetectsColor("#f85533", 1558+xoff,1014, threshold = 20)) {
//                     click(1371+xoff,964);
//                     sleep(400);
//                   }
//               log("调速为3x")
//               break;
//             default:
//                 while (!DetectsColor("#f85533", 1558+xoff,1014, threshold = 20)) {
//                     click(1371+xoff,964);
//                     sleep(400);
//                   }
//               log("调速为3x")
//               break;
//         }
        
//           log("调速成功") 
//         }
    
//           click(1873+xoff,997);
//           log("open battle");
          
    
//           var loopflag =threads.disposable();
//           var recoverthread = threads.start(function(){//吃药子线程
//           let time = new Date()
//           while(new Date()-time < 5000){

              
//               var empty = DetectsColor( "#ff5533", 1609+xoff, 137);
              
      
//             if (!empty) {
//               log("ap enough");
//             } else {
//               if (recoverflag) {
//                 log(empty);
//                 empty = null
//                 click(1639+xoff, 592); // click(1624+xoff,439) 石头
                
//                 log("clicked use");
      
//                 while(true){

                    
//                   var ensure = DetectsColor("#ff5533",1255+xoff,818,threshold = 16)
                  
//                   if(!ensure){
//                     if(new Date()- time > 5000){//寻找决定按钮7s未找到，结束脚本
//                       log("药吃完结束脚本")
//                       exit()
//                     }
//                   }else{ensure = null; break;}
//                   sleep(199);
//                 }

//                 click(1759+xoff, 530);
//                 sleep(700);
//                 log("clicked max");
    
//                 click(1442+xoff, 838);
//                 log("clicked recover");
      
//               // sleep(1000);
      
//                 //重新进入循环
//                 loopflag.setAndNotify("re")//吃药成功发送battle事件
//                 if(recoverthread) recoverthread.interrupt()
//               } else {
//                 back();
//                 sleep(500);
//                 back();
//                 exit();
//               }
//             }
//             sleep(500)
//           }
//           loopflag.setAndNotify("null")//无事发生
//         })
      
  
        
//           if(loopflag.blockedGet()=="re"){
//             while(true){

                
//                 var simple = FindColorInRegion(
                  
//                   "#ffffcc",
//                   1805+xoff,
//                   238,
//                   10,
//                   6
//                 );
                
//               if(simple){
//                 simple = null
//                 click(1873+xoff, 997);
//                 log("吃药成功，再次开始")
//                 sleep(400)
//                 break;
//               }
//               sleep(500);
//             }
//           }
      
//           //根据设备调等待时间
    

//           while (true) {
            

              
//               var esc = FindMultiColors("#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:25})

              
          
          
//             if (!esc) {
//               log("not found esc");
//               click(345+xoff, 353);
//             } else {
//               log(esc);
//               esc = null
//               //调节任务行动状态
//               log("found esc");

    
//               sleep(3000);
//               while (true) {

                  
//                   var next = FindMultiColors( "#ffffff", [
//                     [21, 5, "#ffffff"],
//                     [-149, -993, "#ffff22"],
//                     [-2, -962, "#ffff22"],
//                   ]);
                  
//                 if (!next) {
//                   log("not found next");
//                   if(!stuckorlose){
//                     press(1790 + xoff, 186,1);
//                   press(1818 + xoff, 186,1)

//                   }
//                 } else {
//                   log("found next");
                  
//                   //判断助战

//                   if(partflag){
//                     sleep(100)
                  
//                   if(parttype){
//                     while(true){

                      
//                       var onpart = DetectsColor("#88dddd",647+xoff,1037)
                      
//                       if(onpart){
//                         onpart = null;
//                         press(699+xoff,978,1);
//                         sleep(100)
//                       }else{
//                         break;
//                       }
//                     }
//                     log("助战开启")
//                   }else{
//                     while(true){

                        
//                         var onpart = DetectsColor("#666666",647+xoff,1037)
                        
//                         if(onpart){
//                           onpart = null;
//                           press(699+xoff,978,1);
//                           sleep(100)
//                         }else{
//                           break;
//                         }
//                       }
//                     log("助战关闭")
//                   }
//                   global.partflag = false;
//                   partflag = false;
                  
//                 }

//                   if((new Date()-time2) > timelimit2){
//                     click(next.x,next.y);
//                     break re;
//                   }
//                   //是否再战
//                   if(rebattleflag){
//                       log("rebattle")
//                       click(996+xoff,1009)
//                   }else{
//                       log("next")
//                       click(next.x,next.y)
//                       next = null;
//                       break re;
//                   }    
//                   next = null;                 
//                 continue re;
//                 }
//                 sleep(1000);//非限时本，间隔可以调大
//               }
//             }
//             sleep(1000);
//           }
//         }
//         sleep(1000);
//     }
// }
