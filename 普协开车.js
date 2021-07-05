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
        press(1968+xoff,1003,1);
        sleep(1500)
        press(1935+xoff,593,1);
        while (true) {

                
                var limitraid = DetectsColor("#00ffa0",1242+xoff,206,threshold = 2)
                
            if(limitraid){
              limitraid = null;
              press(1416+xoff,569,1)
                break;
            }
            sleep(1000); //正常速度为1500ms
        }
        help = null;
        log("open limitraid");
        break;
      }
      sleep(3000);
    }
  
 
 
  
  while(true){

      
      var hellplus = DetectsColor("#ffcc00",744+xoff,944);
      
      if(hellplus){
        break;
      }
      sleep(500);
    }
  
  
  
    limit:while (true) {
      switch(nortype){
        case 0://紫
        var limithell = FindMultiColors("#9161cc",[[16,21,"#9b57cf"],[38,18,"#9955cc"],[38,11,"#f7fcfd"],[40,18,"#9955cc"],[58,1,"#9260cc"],[62,27,"#9955cc"],[31,27,"#9955cc"],[39,1,"#9364cd"],[31,21,"#9957cb"],[19,23,"#ffffff"],[33,30,"#9955cc"],[46,10,"#955bcc"],[54,26,"#a369d2"],[30,18,"#9955cc"],[46,30,"#9c5acd"],[52,15,"#fbfdfe"],[40,19,"#9954cd"],[52,25,"#ad73d8"],[31,18,"#9955cc"]],{region:[1128+246+xoff,317,75,523],threshold:[26]})

        break;
        case 1://黄
        var limithell = FindMultiColors("#9955cc",[[21,6,"#ffffff"],[70,18,"#9954cd"],[64,5,"#9f5cd1"],[41,14,"#ffffff"],[57,8,"#9955cc"],[2,2,"#9955cc"],[62,4,"#9a56cd"],[40,3,"#ffffff"],[17,16,"#ffffff"],[25,28,"#9955cc"],[17,22,"#9f5dd1"],[11,20,"#ffffff"],[66,13,"#9955cc"],[95,22,"#a168d2"],[89,24,"#a15fd2"],[71,15,"#9955cc"],[51,6,"#9955cc"],[33,20,"#9957cb"],[48,26,"#9b59cd"],[28,13,"#9955cc"],[93,25,"#9a58cc"],[40,14,"#ffffff"],[6,28,"#9f5dce"],[94,21,"#9a5ccb"],[88,9,"#ffffff"],[50,20,"#a563d7"],[94,15,"#a05ed2"],[13,7,"#9b59cd"],[63,3,"#9c58cf"]],{region:[1129+xoff+246,418,103,431],threshold:[36]})
        break;
        case 2://绿
        var limithell = FindMultiColors("#9955cc",[[78,12,"#9955cc"],[92,12,"#9e5cd0"],[11,16,"#9955cc"],[40,13,"#ffffff"],[52,13,"#9957cb"],[0,9,"#9955cc"],[48,20,"#ffffff"],[57,14,"#9e5ad1"],[56,27,"#9757c9"],[8,25,"#a563ce"],[40,8,"#9957cb"],[16,25,"#9b57cd"],[62,13,"#9955cc"],[95,20,"#a467d5"],[74,12,"#9955cc"],[94,14,"#9b59cd"],[3,21,"#ffffff"],[81,7,"#9955cc"],[91,24,"#9f5dd1"],[2,12,"#9a58cc"],[71,17,"#9955cc"],[25,20,"#ffffff"],[94,24,"#a76bd8"],[40,0,"#9856ca"],[80,25,"#9a57cd"],[37,20,"#9b57cf"],[88,5,"#ffffff"],[24,15,"#ffffff"],[17,26,"#9955cc"]],{region:[1129+xoff+246,418,103,431],threshold:[36]})
        break;
        case 3://蓝
        var limithell = FindMultiColors("#9955cc",[[86,36,"#9955cc"],[36,2,"#9c58cf"],[32,21,"#9955cc"],[96,34,"#9e5ccf"],[97,0,"#9955cc"],[70,21,"#ffffff"],[47,3,"#9955cc"],[56,12,"#ffffff"],[17,36,"#9955cc"],[25,37,"#9955cc"],[17,2,"#9955cc"],[44,18,"#ffffff"],[1,26,"#9755c9"],[96,36,"#a361d4"],[63,3,"#9955cc"],[74,21,"#ffffff"],[16,23,"#ffffff"],[65,31,"#9956cc"],[5,0,"#9955cc"],[2,17,"#9c59ce"],[2,16,"#9a56cd"],[77,31,"#ffffff"],[65,36,"#9955cc"],[24,0,"#a15fd3"],[82,21,"#ffffff"],[40,37,"#9955cc"],[67,10,"#9c59ce"],[62,0,"#9955cc"],[93,36,"#9957cb"]],{region:[1129+xoff+246,418,103,431],threshold:[35]})
        break;
        case 4://红
        var limithell =  FindMultiColors("#9955cc",[[53,5,"#ffffff"],[49,5,"#ffffff"],[24,33,"#9955cc"],[52,32,"#9b5bcd"],[74,32,"#9955cc"],[62,13,"#9b59cd"],[30,3,"#9955cc"],[30,18,"#9955cc"],[64,34,"#9955cc"],[54,32,"#9e5ecf"],[41,33,"#9955cc"],[86,23,"#ffffff"],[94,6,"#9955cc"],[50,31,"#a464d5"],[86,5,"#ffffff"],[62,21,"#9955cc"],[52,5,"#ffffff"],[14,33,"#9955cc"],[16,34,"#9955cc"],[85,32,"#9955cc"],[5,25,"#ffffff"],[50,33,"#9e5cd0"],[84,5,"#ffffff"],[54,31,"#9f64d1"],[59,26,"#ffffff"],[1,34,"#9e5ccf"],[32,10,"#9955cc"],[36,1,"#9d5bd0"],[58,1,"#9955cc"]],{region:[1129+xoff+246,418,103,431],threshold:[36]})
        break;
       
      }
  
    
        
    
      if (!limithell) {
        var bottom1 = DetectsColor( 
          "#88dddd",
          2124 + xoff,
          1023
        ); //检测滑到底部
        var bottom2 = DetectsColor( 
          "#83d4d4",
          2124 + xoff,
          1023
        ); //检测滑到底部
        if(bottom1==true) bottom = bottom1
        else bottom = bottom2
        if (bottom) {
        click(2124 + xoff, 246);
        
        log("bottom")
        } else {
        //点击滚动条
        
        
            log("not bottom")
          var pullbar1 = FindColorInRegion("#88dddd",2124+xoff,246,11,775);
          var pullbar2 = FindColorInRegion("#83d4d4",2124+xoff,246,11,775);
         pullbar = pullbar1!=null?pullbar1:pullbar2
          log("pullbar"+pullbar)
          if(pullbar){
        
            swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+150,200);
            sleep(440)
            log("swipe ")
            pullbar = null;
          }
        }
  sleep(300)
      } else {
      
        click(limithell.x,limithell.y);
       
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
            
             while (true) {

                  
                  var jiemian = FindMultiColors("#ffcc00",[[333,-350,"#ffffff"],[520,-151,"#990000"],[-239,-244,"#580000"]],{region:[307+xoff,453,811,571],threshold:[26]})
                  
              if (!jiemian) {
                press(2103 + xoff, 865, 1); //退出奖励页面
              } else{
                break;
              }
         
                 sleep(800)
              }
              onbattle.setAndNotify("continue");
              if(limithellthread) limithellthread.interrupt();
               log("limithell线程结束");
              
          }else{
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
