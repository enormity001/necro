
images.requestScreenCapture();
sleep(300);
events.on("exit",function(){
  events.broadcast.emit("done",3);
})

auto.waitFor(); //415,217
var storage = storages.create("pref");
var xoff = leftBlack() - 246;
var Recoverflag = storage.get("Recoverflag", false);//从一键日常传入的flag，true表示覆盖本来的吃药flag不进行嗑药
var chipstype = storage.get("chipstype",0)
var storage = storages.create("pref")
var rebattleflag= storage.get("rebattleflag",false);//重复刷还是刷一次 和chipspattern绑定// true为单刷一种颜色，false为全颜色周回
var superchip = storage.get("superchip",false)//刷超上级
var partflag = true;
var parttype = storage.get("partflag1",false)
var speedtype = 2;
var speedflag = true;
var autoflag = true;
var autotype = 1;
var teamflag = storage.get("teamflag",false);
var teamtype = storage.get("teamtype4",1);
var recoverflag = storage.get("recoverflag1",true);
var autoorspeedflag = storage.get("autoorspeedflag", false);
var timeflag = storage.get("timeflag1",false);
var timelimit = (parseInt(storage.get("hour1",0)) * 60  + parseInt(storage.get("minute1",0)))*60*1000;
var teamregion = [269+xoff,166,16,16];//队伍找色数组
var teamx = 43; //队伍图标间隔x上距离
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
var time = new Date()

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
        sleep(4000)

        engines.execScriptFile("./芯片本.js");
        exit();
      }
    }
    sleep(10343);
  }
});

    while (true) {
      var questImg = images.read("./quest.jpg");

        
      var quest = FindImageInRegion( questImg, 1869+xoff, 972, 137, 65,0.8);
      
      questImg = undefined;
     
      if (!quest) {
        log("not found quest");
        back()//用于关闭第进入游戏时的活动弹窗
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
    click(1907+xoff,538);
    sleep(2000);


while(true){

    
    if(DetectsColor("#00ffa0",1230+xoff,208)){
      
      break;
    }else{
      log("not found limited quest")
      press(1940+xoff,1033,1);
        sleep(50)
        press(2111+xoff,480,1);
      sleep(800);
    }
    
   
}

log("found limited quest")

sleep(600);
//选择chips颜色
chips:while(true){

      
      //chips颜色
      switch(chipstype){
          case 0:
             var chipbattle = FindMultiColors("#a239ce",[[113,-18,"#752692"]]);
              break;
          case 1:
             var chipbattle = FindMultiColors("#9e2030",[[121,-27,"#9b1f2c"]]);
          break;
          case 2:
            var chipbattle = FindMultiColors("#184a9a",[[-127,18,"#1b4f9e"]]);
             
          break;
          case 3:
            var chipbattle = FindMultiColors("#3e701c",[[119,-22,"#36681d"]]);
          break;
          case 4:
            var chipbattle = FindMultiColors("#aa781c",[[123,-21,"#a67b19"]]);
          break;
      }
      
      
    if(chipbattle){
        log("found chipbattle")
        click(chipbattle.x,chipbattle.y)
        chipbattle = null
        sleep(1000)
        // 等待具体某颜色chips界面
       re: while(true){

          
            var chips = FindMultiColors("#ff8100",[[-1,16,"#ff8100"],[0,32,"#ff5400"]],{
                region :[943+xoff,839,120,60]
            })
            
        if(chips){
          chips = null
            log("chips interface on")
    //超上级chips
    if(superchip){
      superchip = null;
        if(DetectsColor("#ffffcc",1813+xoff,286)){
            log("found superchallenge")
            click(1808+xoff,354)
            log("open superchallenge")
            //存在超上级时 调速flag 和 再战flag  助战flag要关闭
        normalbattleprc(false,parttype,false,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,false)//
         continue re;
        }else {
            
            click(1760+xoff,580)
            log("open exchallenge1")
            normalbattleprc(partflag,parttype,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag)
            sleep(1000);
            while(true){

                
              var chips = FindMultiColors("#ff8100",[[-1,16,"#ff8100"],[0,32,"#ff5400"]],{
                region :[943+xoff,839,120,60]
            })
            
            if(chips){
              chips = null
              break;
            }
              sleep(1000)
            }
            back();
            switch(chipstype){
                case 0:
                    chipstype = 1
                break;
                case 1:
                    chipstype = 2
                break;
                case 2:
                    chipstype = 3
                break;
                case 3:
                    chipstype = 4
                break;
                case 4:
                    chipstype = 0
                break;
            }

            continue chips;


        }
        
    }else{
        //首次刷非超上级第一次开启调速flag

        click(1760+xoff,580)
        log("open exchallenge2")
        normalbattleprc(partflag,parttype,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag)

        while(true){

            
            if(FindMultiColors("#ff8100",[[-1,16,"#ff8100"],[0,32,"#ff5400"]],{
              region :[943+xoff,839,120,60]
            })){
              
              break;
            }else{
              sleep(200)
            }
            
        }

        back();
        switch(chipstype){
                case 0:
                  chipstype = 1
              break;
              case 1:
                  chipstype = 2
              break;
              case 2:
                  chipstype = 3
              break;
              case 3:
                  chipstype = 4
              break;
              case 4:
                  chipstype = 0
              break;
            }

            continue chips;
        }

        }else{
            log("wait for chips")
        }
        sleep(1000)
        }
     }else{
        swipe(1818+xoff,938,1818+xoff,558,300);
        sleep(300)
    }
    sleep(1000);
}
    
    

    


    function normalbattleprc(partflag,parttype,speedflag,speedtype,autoflag,autotype,teamflag,teamtype,recoverflag,rebattleflag){ //从寻找battle界面到战斗结束页面过程函数
        re: while (true) {
                            

                
                var simple = FindColorInRegion("#ffffcc",1805+xoff,238,10,6)
                
           
              
              if (!simple) {
                  log("not found simple");
                  click(409+xoff, 227);
              } else {
                  log("found simple");
                  simple = null
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
                      empty = null;
                      click(1639+xoff, 592); // click(1624,439) 石头
                      
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
                      // sleep(700);
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
                      simple = null;
                      click(1873+xoff, 997);
                      log("吃药成功，再次开始")
                      sleep(400)
                      break;
                    }
                    sleep(500);
                  }
                }
            
                //根据设备调等待时间
                sleep(1000);
                while (true) {
                  

                    
                    var esc = FindMultiColors("#ffffff",[[-68,96,"#598ad9"],[-42,135,"#60c160"]],{threshold:25})

                    
               
                
                  if (!esc) {
                    log("not found esc");
                    click(345+xoff, 353);
                  } else {
                    log(esc);
                    //调节任务行动状态
                    log("found esc");
                    esc = null;
                 
                    sleep(3000);
                    while (true) {

                        
                        var next = FindColorInRegion("#ffffff",1473+xoff,1007,3,3,2)
                        
                      if (!next) {
                        log("not found next");
                        press(1790 + xoff, 186,1);
                        press(1818 + xoff, 186,1)
                      } else {
                        nextImg = undefined;
                        log("found next");
                        
                            //判断助战

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
                         //是否再战，影响是否周回全颜色
                         if(!rebattleflag){
                            log("rebattle")
                            click(996+xoff,1009)
                         }else{
                            log("next")
                            click(next.x,next.y)

                            break re;
                         }  
                         next = null;                   
                      continue re;
                      }
                      sleep(1000);//非限时本，间隔可以调大
                    }
                  }
                  sleep(1000);
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
