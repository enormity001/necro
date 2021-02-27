
events.on("exit",function(){
    events.broadcast.emit("done",0);
  })
  auto.waitFor(); //415,217
  images.requestScreenCapture();
  sleep(300);
  var storage = storages.create("pref");
  var xoff = leftBlack() - 246;
  var gachaflag = true;
  var gachatime = storage.get("gachatime",null)
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
  if(!gachatime){
    let a = new Date()
    let year = a.getFullYear()
    let month = a.getMonth()
    let day = a.getDate()
    let hour = 4
    var gachatime = Date.parse(new Date(year,month,day,hour))
    storage.put("gachatime",gachatime)
  }
  
  if(Date.parse(new Date()) > gachatime){
  
  
  
  
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
            engines.execScriptFile("./友情池.js");
            exit();
          }
        }
        sleep(10343);
      }
    });
    
  //点击scout
  
  while (true) {
      var scoutImg = images.read("./scout.jpg");

        
        var scout = FindImageInRegion(
          
          scoutImg,
          1399+xoff,
          767,
          47,
          41,0.8
        );
        
  
      scoutImg = undefined;
  
      if (!scout) {
        log("not found scout");
        back()
      } else {
        log(scout);
        click(scout.x, scout.y);
        log("open scout");
        sleep(2000);
          break;
      }
      sleep(2000);
  }
  //是否在gacha界面找到info
  while(true){

          
          var info = DetectsColor("#82e1db",533+xoff,111)
          
      if(!info){
          log("not found info")
      }else{
          log("found info")
          break;
      }
      sleep(1000);
  }
  //到gacha最底部
  click(2135+xoff,1016);
  //找到友情池
  while(true){

          
          var friend = FindMultiColors("#00aa99",[[6,7,"#11222a"],[63,-30,"#ffffff"],[207,-106,"#f76600"]],{
              region:[1719+xoff,203,400,800]
          })
          
      if(!friend){
          log("not found friend")
      }else{
          log(friend)
          click(friend.x,friend.y)
          log("found friend")
          break;
      }
      sleep(1000);
  }
  //等待gacha 2000，并点击
  while(true){

      
      var gacha = FindMultiColors("#ffffcc",[[-15,1,"#ffffcc"],[18,1,"#ffffcc"],[-37,-48,"#ffffff"]],{
          region:[1178+xoff,981,80,50]
      })
      
  if(!gacha){
      log("not found gacha")
  }else{
      log(gacha)
      click(gacha.x,gacha.y)
      log("found gacha")
      break;
      
  }
    sleep(1000)
  }
  //等待确定按钮并点击
  while(true){

          
          var decide = FindMultiColors("#ffffff",[[-172,0,"#ff613b"],[213,-6,"#ff613b"],[-807,-506,"#88dddd"]],{
            threshold : 15
          })
          
      if(!decide){
          log("not found decide")
      }else{
          log(decide)
          click(decide.x,decide.y)
          log("found decide")
          break;
      }
        sleep(1000)
      }
  //两次skip
      sleep(800);
  
      while(!DetectsColor("#88dddd",1997+xoff,181)){
          sleep(500);
     
      }
      click(1997+xoff,181);
      sleep(1000);
      while(!DetectsColor("#88dddd",1997+xoff,181)){
          sleep(500);
     
      }
      sleep(500)
      click(1997+xoff,181);
  log("gacha end")
   
   gachaflag = false;
  sleep(2000);
  log("back home")
  
  click(2062+xoff,66)
  //gachatime 加一天时间
  storage.put("gachatime",gachatime+24*60*60*1000)
  
  exit()
  
  
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
