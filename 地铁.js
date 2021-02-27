var storage = storages.create("pref");
events.on("exit",function(){
    events.broadcast.emit("done",1);
      storage.put("ongoingscript","");
})
  auto.waitFor(); //415,217
  
  images.requestScreenCapture();
  sleep(300);
  
  
  var xoff = leftBlack() - 246;
  var metrotime = storage.get("metrotime",null)
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
  
  if(!metrotime){
    let a = new Date()
    let year = a.getFullYear()
    let month = a.getMonth()
    let day = a.getDate()
    let hour = 4
    var metrotime = Date.parse(new Date(year,month,day,hour))
    storage.put("metrotime",metrotime)
  }
  if(Date.parse(new Date()) > metrotime){
  
  
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
            sleep(4000)

            engines.execScriptFile("./地铁.js");
            exit();
          }
        }
        sleep(10343);
      }
    });
    
  
  while (true) {
    var questImg = images.read("./quest.jpg");

      
      try{
        var quest = FindImageInRegion(
          
          questImg,
          1869+xoff,
          972,
          137,
          65,0.75
        );
  
      }catch(err){
        
        continue}
      
    questImg = undefined;
  
    if (!quest) {
      log("not found quest");
      back()
    } else {
      log(quest);
      click(quest.x, quest.y);
      
      quest = null;
      log("open quest");
      break;
    }
    sleep(1500);
  }
  //点击地铁logo
  sleep(1000)
  click(1416+xoff,771)
  sleep(2000);
  //找当周开放的地铁
  while(true){

          
          var under = FindMultiColors("#ffbb00",[[32,2,"#000000"],[59,0,"#ffbb00"]]);
          
        if(!under){
          // press(1940+xoff,995,1);
          // press(1257+xoff,793,1);
              log("not found under")
        }else{
          log(under)
          log("open under")
          click(under.x,under.y)
          break;
        }
        sleep(1000)
  }
  
  sleep(1000)
  
  re :while(true){
      //判断次数是否用完

          
          if(FindMultiColors("#ff5533",[[140,-27,"#ffffff"],[31,0,"#ff5533"]],{region:[1993+xoff,687,3,3]})){
                  log("本次次数用完");
                  click(2080+xoff,57)
                  //metrotime + 一天
                  storage.put("metrotime",metrotime+24*60*60*1000);
                  exit()
          }
          
        log("次数未用完")
  
      sleep(1000)
  //点击开始出击

          
          var startbattle = FindMultiColors("#ff5533",[[-2,92,"#ff5733"],[156,89,"#ff5733"]],{
              region:[1881+xoff,853,50,50],
              threshold : 15
          });
          
        if(!startbattle){
              log("not found startbattle")
              click(1300+xoff,983)
        }else{
          log(startbattle)
          log("open startbattle")
          click(startbattle.x,startbattle.y)
          startbattle = null
          sleep(1000);

            
          while(!DetectsColor("#ff6f45",1675+xoff,1000,threshold = "13")){
              sleep(500)
              log("not found battle ")
          }
          
          click(1675+xoff,1000);
          log("open battle")
          
  //  检测队伍编成
  var emptyteamthread = threads.start(function(){
    let time = new Date()
    var teamsetimg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAACEAAAAiCAYAAADRcLDBAAAABHNCSVQICAgIfAhkiAAABRxJREFUWIW1V01oU1kU/t7Lm6QvsSFpTRvzIzYaU6UVSkWZygyhswojgkhdOd1IZWBmZUEKA904UmEYxYUbN1YQxMVQpKuZ0U4qilRmjP1LUGpKY9ImtlP0tY22vtwzi2luk/blp7V+cBfnvHPv/e653z33PsFkMhHKwMePH7GysgIAMBqNMBqNWGBMM1YnihAAZIhAVHp4qVTA6dOn0dbWBiICYwzhcBh9fX2YmJgo2CdDBJ0glJyckxBFsWiA1+tFIBDgtsViweDgYNE+9V4vmg4dwhd6PaiMbJTMxFbwjd+Pny5cQJXVWla8JEkSPB4P3G63ZoDH48mzrVYrmpubYTKZ8H7dCt/MzuJVNLp51i6Xi65fv07bgd/u3aOmlhY639VF/87Pl91PymQyYAVUvl1YXFxEdGoKc3NzAIA9u3ejbs8eCKviFQVB4MbnwkQ0ip8vX8a3p07hu44O/DEwkDenxBjDzMwMRkZGYLVaUVNTA4PBAABQVRWpVArz8/NgjIGIoNPpYLfbYbPZ+CDvFAWpN28wFYvhw/KyJpHsYg/4fKjfv5/7Z5JJoLKykrLt5MmT9PTpU75X6XSauru7yWw2k8FgIADkcrmot7c3b097b9+mvY2NZKiqIkNV1QZNPBseprYzZ8i4cyf9eP48zSST/NufAwOUVyTi8Tji8Ti3ZVmG0+lEdXU197ndbrhcLm5nMhm8TiSQTKWKbgkRwWq14kB9Pey1tdw/Fg6jKAkAcDqdcDgcBUkkUynEEwmoqlqShG/fPtR7vdw3FYthPBKByBhDtimKgng8DkVReKDD4YDD4eBVz+12w+l0rhFPJBBPJIoSyMLn88GXo4fxSATj4TAki8UCa05lU1UVs7OzMJvNfNLGxkaMjo6ioqICDQ0N2LFjB49XFhYgSRI8dXUgIrx9+1aTQKXZDJ/XC+dqVhljGItEEHn5Erh06RJlMpmtVad1WF5epu6LFzWFefnKFfr9/n3uezkxQe0dHWSoriaRyrhqtwMOux2OXbu4XWEwwCjLAADpcxeqLP4JhcAYQ8PBgwAAt8uF44EAQiMjn+cW1UI8kYCysICvWlrgqasDALT6/Xj2/Dmknp4e9PT0aHbM3arNvKx+OHdO0z/46BG+PnaMk5ArKvDl0aMo/qLZZiSmpzH4+DFeTU5y35Hm5rWXVWtrKzo7O9HU1KQ5wHoBC4KAXM+DYBC/XL2Kv0OhokSeDA3hydAQ9q5mw2w2r2lCkiTIsgyTybSp1WVhlGWIOl3JuKlYDJEXL7CUTsNkNAIARFp9A37qUS23PxEh9vp1XpXdNk1s5qgvpdNYXFritlRoBaqq4s6dO7h79y63s5eUxWJBe3s7Tpw4weM3k0l7bS125dykXBPrt4Qxhmg0imAwCCD/iNpsNvj9/ryBS2VCFEXU2Gw4Hgjg+7Nn86onr5hazzxBEJA9PbnftGKLZcLn9aL3xg1epjcQLHeg9XFaR7YQopOTGA+H8f7DB82x8kiUK65Cj2NRFCGK4v/fc/yqqiI0PIzRsbENfULDw4U1odfr0dXVhc7OTv49l4Rer99IDOBNazIAOHL4MPeNjo/j12vX1k6H1ur0ev2GyQqBMYbMamNEedWUAMzOzeGvhw/hdDjwTlHwIBjEg2AQyVQq/xb9lIJVzlb29fejr79/g19ar/qt4lMWUFATqqri5s2buHXrFgRBgKqqWFlZgSAIkGUZsiyv/RALAhRFQWJ6eksk/gNGrT4QqQvaRAAAAABJRU5ErkJggg==")
    while(new Date() - time  < 3000){

            
        if(FindImageInRegion(teamsetimg,805+xoff,544,45,45)){//队伍未编成字样
            click(461+xoff,416)//第一个人物格
            while(!DetectsColor("#ffffcc",354+xoff,1009));//人物列表页面黄色字体
            click(463+xoff,375)//人物列表第一个
            while(!FindColorInRegion("#ffffcc",1805+xoff,238,10,6)){//找战斗力黄色字体
              sleep(500)
              log("not found battle ")
            }
          
            click(1464+xoff,993)//omakase equip
          
            while(!DetectsColor("#ff5734",1256+xoff,812,threshold = "20")){//找决定按钮
              sleep(500)
              log("not found ensure ")
            }
          
            click(1648+xoff,830)//决定
          
            
            while(!FindColorInRegion("#ffffcc",1805+xoff,238,10,6)){//找战斗力黄色字体
              sleep(500)
              log("not found battle ")
            }
          
          
            click(1828+xoff,973);//出击
            emptyteamthread.interrupt()
            log("结束队伍检测线程")
        }else{
            sleep(300)
        }
  
  
            
      }
      teamsetimg = undefined
   
   
  })
  
  emptyteamthread.join()
   
          sleep(3000);
          continue re;
        }
        sleep(1500)
        continue re;
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
