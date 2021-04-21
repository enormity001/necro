importClass("android.app.PendingIntent");
importClass("android.app.AlarmManager");
importClass("java.lang.System");

var storage = storages.create("pref");
events.on("exit", function() {
  storage.put("ongoingscript","");
})
auto.waitFor(); //415,217

images.requestScreenCapture();
sleep(300);
var xoff = leftBlack() - 246;
storage.put("ongoingscript","./积分.js");
let starttime = new Date();//脚本运行开始时间
let restartflag = storage.get("restartflag",false);//定时重启flag
let restarttime = (storage.get("restarttime",3)+1) *60*60*1000;//定时重启时间间隔
var partflag = true; //助战检测falg
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

var parttype = storage.get("partflag5", false); //true为开启，off为关闭
var speedtype = storage.get("speedtype", 0); //倍速类型 x3,x2,x1
var autoorspeedflag = storage.get("autoorspeedflag", false);

var speedflag = true; //倍速检测flag
var autoflag = true; //行动状态检测flag
var autotype = 1; //人物行动状态 0为不动，1为autoskill
var teamflag = true; //队伍检测flag
var teamtype = storage.get("teamtype2", 1); //队伍序数 0，1，2，3，4，5
var teamregion = [269 + xoff, 166, 16, 16]; //队伍找色数组
var teamx = 43; //队伍图标间隔x上距离
var overtimeflag = true; //副本超时检测flag
//新旧积分flag
var newscore = storage.get("newscore", true);
//新积分
var equipflag = storage.get("equipflag", true); //稀有装备本
var designflag = storage.get("designflag", false); //刷设计图rare的flag
//旧积分
var droprareexflag =storage.get("droprareexflag", true);//旧积分2分钟稀有
var droprareflag = storage.get("droprareflag", false);//旧积分5分钟稀有
var scorerare = storage.get("scorerare", false);//旧积分10分钟稀有
//
var rareflag = true; //rare本检测flag
var sellflag = false;
var bonusflag = storage.get("partflag5", false);
var time = new Date();
var timeflag = storage.get("timeflag10", false);
var timelimit =
  (parseInt(storage.get("hour10", 0)) * 60 +
    parseInt(storage.get("minute10", 0))) *
  60 *
  1000;
var recoverflag = storage.get("recoverflag9", false);
var usediamond = storage.get("usediamond9", false);

if (timeflag) {
  threads.start(function () {
    setInterval(function () {
      if (new Date() - time > timelimit) {
        exit();
      }
    }, 60000);
  });
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
        back();
            sleep(4000)

        engines.execScriptFile("./积分.js");
        exit();
      }
    }
    sleep(10343);
  }
});

start: while (true) {
  
  var evenoff = FindMultiColors("#49c0c0", [
    [-18, -19, "#49c0c0"],
    [58, 28, "#49c0c0"]
  ], {
    region: [2105 + xoff, 182, 6, 6]
  });
  if (!evenoff) {
    var questImg = images.read("./quest.jpg"),
      quest = FindImageInRegion(questImg, 1869 + xoff, 972, 137, 65, .8);
    if (questImg = void 0, !quest) {
      log("not found quest"), back(), sleep(2500);
      continue start
    }
    for (click(quest.x, quest.y), quest = null, log("open quest"), sleep(1e3), click(1913 + xoff, 887), sleep(3e3);;) {
      var evenoff = FindMultiColors("#49c0c0", [
        [-18, -19, "#49c0c0"],
        [58, 28, "#49c0c0"]
      ], {
        region: [2105 + xoff, 182, 6, 6]
      });
      if (evenoff) {
        log(evenoff), evenoff = null, log("found evenoff");
        break
      }
      log("not found evenoff"), click(1958 + xoff, 923), sleep(3000)
    }
  }
  evenoff = null, sleep(3000);

  while (true) {

      
      var evenoff = FindMultiColors(
        
        "#49c0c0",
        [
          [-18, -19, "#49c0c0"],
          [58, 28, "#49c0c0"],
        ],
        {
          region: [2105 + xoff, 182, 6, 6],
        }
      );
      
    if (!evenoff) {
      log("not found evenoff");
      click(1958 + xoff, 923);
    } else {
      log(evenoff);
      evenoff = null;
      log("found evenoff");
      break;
    }
    sleep(1000);
  }

  sleep(1000);
  
  rare: while (true) {
    //返回任务列表，等待X出现
    while (true) {

        
        var evenoff = FindMultiColors(
          
          "#49c0c0",
          [
            [-18, -19, "#49c0c0"],
            [58, 28, "#49c0c0"],
          ],
          {
            region: [2105 + xoff, 182, 6, 6],
          }
        );
        
      if (evenoff) {
        evenoff = null;
        break;
      } else {
        sleep(300);
      }
    }
    //检测滚动条到达最底部

      
      var questbottom = DetectsColor(
        
        "#88dddd",
        2130 + xoff,
        987
      );
      
    if (questbottom) {
      questbottom = null;
      while (true) {
        

        
      var top = DetectsColor( "#88dddd", 2130 + xoff, 232);
      
    if(!top){
        //点击滚动条最顶部，直到检测到滚动条颜色
        click(2130 + xoff, 232);
        sleep(800);
    }else{
      top = undefined;
      break;
    }
    }
  }
//新积分
if(newscore){
    //是否有装备rare
    if (equipflag) {
   if(!equiprareImg){ var equiprareImg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAXCAYAAAD+4+QTAAAABHNCSVQICAgIfAhkiAAAA6NJREFUSImVlU9IHFccx7/vzezs6or7N1uxdMsuxCCWWlIEKR40lEQhLY0SSkP0pBfBU5UsOdSbl5rk1KAXwYILCylaPHgQhOBhrVkW4x7cpOrFyNIocYtZVlZ3vj0ksXk7u8b84Aczb77f95n3fvObB4/Hw4mJCb4fpmlydnaWTqeTUkpqUtIhJWs1jZ8YBmt1nYaUDIdCXF9ft3iHh4fpcDgopaSUkgDAUCjEeDyuiHO5HEdGRigB2gDWCEG3ptGn63RISU3TODU1xWKxqPhisRj9fj8BvJ9vLjo6Ori3t6cYdnZ22N7Wxhoh6NN1enWdNULQBrC3t5fZbFbRp9NpNjU1lQL+h9hsNg4NDVnebPnxY4b9fnqlpEtKGgAvXbzIjY0Ny8p7enoohKgMAUCv18vp6WnFXCgU+Nu9e/QIwWqAhmEwGo3SNE1FNzY2xurq6nIAFQKADQ0NXFtbUybY39vjTzdu0AA4MDDAw8ND5fni4iLr6+srAawQIQS7urp4cHCgTLT+9Cm/u36dm5ubyvju7i5bW1vPAlghAGi323n3zh1lS4rFIlOplDJ2fHzM/v5+6rr+cRABUAf4eSDAPx894lkxOTlJl8v1IUB5SBVAl5Rsa27ms5Kv6F0kEgmGw+HzAChREgKABCBMExupFJ6l06USAMDCwgK2t7fLPisXp0QNoB1grRB0C8Hvr17l7osXZVeSTCbPvRIFYgfoAuiVkl+Ew1xdXa1Yj2KxyFgsRqfT+XGQKiHokZJ1VVWMzczw5OREmXhlZUW5z+VyHB0dPR9EvN0qpxD0aRp/iUTKNlxLSwuTyaQynslk2N3d/WGIBrAaoFsI9nR2WuqQyWROG66zs9PSqKlUqtKP8U3aAToBegF+FQox+eSJZe8HBwdPG85utzMSiShNaZom5+fn6Xa7y0N8AC8ADDkc/CMatdRhZmaGHo9HMQUCAc7NzSm6fD7P8fHxd4eUmpcBfgnw10iEudevFWM6nWZjY2PZt2tububW1pai39/fZ19fn1X/LcCfr13jPyV1yOfz/PHmTdqEoAFY0iEl+27d4tHRkeL7+/lzftPSomhxOxRiOpFgaTx88IAXnE7WAvRVyGBNDR/ev2/xLi8t8VIgcKrDUjRKs+Q0TMbj/DoYpBugH2CdEBXzcjDIv5aXFX+hUODvExP8zDBYJwSRL6nDv69e8faVK/z0LSAgBOukPDN/aG/n/suX6jzZLO8ODbFOSv4H7RLNU8773sgAAAAASUVORK5CYII=");}

        

        var equiprare = FindImageInRegion(
          
          equiprareImg,
          1602 + xoff,
          331,
          200,
          42,0.85
        );
        
      
      if (!equiprare) {
        log("not found equiprare");
      }
      else {
        equiprareImg=undefined;
          var white = FindColorInRegion("#ffffff",1602 + xoff,331,47,42,1);
        if(white){
          whiite = undefined;
       click(equiprare.x, equiprare.y);
        log("open equiprare");
        battleprc(
          partflag,
          false,
          speedflag,
          2,
          false,
          autotype,
          false,
          teamtype,
          overtimeflag,
          false,
          true
        );

        if (sellflag) {
          sellflag = false;
          continue start;
        }
        continue rare;
      }
    }
    }

    //是否有设计图rare
    if (designflag) {
    if(!designrareImg){var designrareImg = images.read("./designrare.jpg");}

        var designrare = FindImageInRegion(
          designrareImg,
          1602 + xoff,
          334,
          200,
          260,0.85
        );
      if (!designrare) {
        log("not found designrare");
      } else {
        designrareImg=undefined;
          var white = FindColorInRegion("#ffffff",1602 + xoff,331,47,42,1);
          
        if(white){
          white = undefined;
        while (!click(designrare.x, designrare.y));
        designrare = null;
        log("open designrare");
        battleprc(
          partflag,
          parttype,
          speedflag,
          2,
          false,
          autotype,
          false,
          teamtype,
          overtimeflag,
          false,
          true
        );
        if (sellflag) {
          sellflag = false;
          continue start;
        }
        continue rare;
      }
    }
    }

    //risky本

      
      if(!riskyImg){var riskyImg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAACMAAAAXCAYAAACBMvbiAAAABHNCSVQICAgIfAhkiAAAA8lJREFUSIm9lk1vW0UUhp/58P3wVxzHTpM0SlpKQ6lKqxYQErBBQixYIP4E6n/qgh17VlRCYoNAiC5CoaLQQkjblDSpE9uxHfvavneGxU1urttCnVbmtSxrju2ZZ859z5kRb33xlb1UneazN17lnbkKAENj+HLtbz7/9U92ugHWWp6lE1mPqxdX+OTMYhK7WWtw7Ze73Hi0A8aglEQphRASBGAtobFExvDR8gJXL55luZgDQCvX4Xy1zMp0MZlwvd1ldbdJM4yQGY0FDOJpGscBKUdjQoDOxN+ZCCslRkqklAgh4ndkENaCVpjUX+VCzuf1cpEpJ3OQFcvNWoOfdxqYf8nIOBJCoJRCHsAaY5IMCxlDWQvpFfS5UoFzpQJSxDuvBX1+b7apB0NsnNeDz+PLEi+YCiCIQaS02Cem1UuFHPM5Lwk83O9xr9UlTGZ5UZDRXR9KEGftcNa0H2XVd3GVSgIPWl0edrovBPBcQGuJoghjTAwk5ehjqnpuQtkehGx09tkbDCcGY61FCIkA5BOelDOekwz2BkMa/SHRSxh3XAlrUcaSNpXOZXQy2A9DOsNw4iDWGEIE5uBRJTCOOhr0woggjCYOY6zBGoGVYqQ8pCNHYXrR5GEO/aKxZNKZSZMZa/8fvxzUkK8UWX1UyXJojhqyoyTuk+19QtJSUPYcCinPykF0BONrhZ8inaQqnstCziftWR2kPOKr48G0B0O+3thmrdVJYrVenwdjNM2VUoGVUmEkphv9QTIoOpnkwBxHQWT4aafBrfpeEjPWks72s1TxXN6cLbNUyI7C1Hr9ZFByM8xlPXwt6Y5R4pG1RBFwjAr0lOK9hQrvz1fwUsdQsz9EPu4FhCZ2d0ZKFvM+s1kXO4FXVis+OFnl09MnWcj5I5B3mi301n5Avd9n1o9P7qV8jlP5PBvtYOzdjqMTWY8PF2f5eHmeU4VscmUBqAcDbmzX0eutff7a209gFvM+Z0sFVnf2CF6yAQpgxnN5e3aad+dmuFAuMuu7IyC9MOLbzcd8t1lDb3Z6/NFsc7lawlWKXEZzaWaK1VqT243WsQEcJal6LmemcrxWKvBKMcepQpYTvjdSxhDftX/c2uH6+ia7vT46CCPuNto8aHc5WyoggPPlIleqJe53ugTPqQwp4Fwp/n3Fcyg5GYqOZtp1mPEc8hmNEk9f0OrBgO8f1bh+7xH323Er0Ba402zzW73F6WIeLQVFJ8OV6jS36i1uN9r/CSOArFZcrkxxoVzElYpnrJ0ospa1vQ7fbGzzw9Yu292ACEAI/gF08akdrTd2+AAAAABJRU5ErkJggg==")}
        var risky = FindImageInRegion(
        riskyImg,
        1506 + xoff,
        328,
        300,
        675,0.75
      );
    if (!risky) {
      log("not found risky");
      //点击滚动条
        var pullbar = FindColorInRegion("#88dddd",2126+xoff,232,5,690)
        
      if(pullbar){
        swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+100,200)
      }
    } else {
      riskyImg=undefined;
      while (!click(risky.x, risky.y));
      risky = null;
      log("open risky");
      battleprc(
        partflag,
        parttype,
        speedflag,
        speedtype,
        autoflag,
        autotype,
        teamflag,
        teamtype,
        false,
        rareflag,
        false
      );
      if (sellflag) {
        sellflag = false;
        continue start;
      }
      continue rare;
    }
  }else{//旧积分
    if(droprareexflag){
      var exdroprare = FindMultiColors("#ff5533",[[82,-1,"#ffffcc"],[187,1,"#ff5533"],[80,60,"#ffffff"],[85,60,"#000000"]])
           if (!exdroprare) {
             log("not found exdroprare");
           }
           else {
               var white = FindColorInRegion("#ffffff",1602 + xoff,331,47,42,1);
             if(white){
               whiite = undefined;
            click(exdroprare.x, exdroprare.y);
             log("open exdroprare");
             battleprc(
               partflag,
               false,
               speedflag,
               2,
               false,
               autotype,
               false,
               teamtype,
               overtimeflag,
               false,
               true
             );
     
             if (sellflag) {
               sellflag = false;
               continue start;
             }
             continue rare;
           }
         }
    }
    if(droprareflag){
      var droprare = FindMultiColors("#ff5533",[[82,-1,"#fffecb"],[188,1,"#ff5533"],[39,61,"#ffffff"],[47,63,"#000000"]])
          if (!droprare) {
            log("not found droprare");
          } else {
              var white = FindColorInRegion("#ffffff",1602 + xoff,331,47,42,1);
            if(white){
              white = undefined;
            while (!click(droprare.x, droprare.y));
            droprare = null;
            log("open droprare");
            battleprc(
              partflag,
              parttype,
              speedflag,
              2,
              false,
              autotype,
              false,
              teamtype,
              overtimeflag,
              false,
              true
            );
            if (sellflag) {
              sellflag = false;
              continue start;
            }
            continue rare;
          }
        }
    }

    if(scorerare){
      var scorerare = FindMultiColors("#ff5533",[[81,-2,"#ffffcc"],[186,0,"#ff5533"],[5,62,"#ffffff"],[2,77,"#ffffff"],[1,62,"#000000"]])

      if (!scorerare) {
        log("not found scorerare");
      } else {
          var white = FindColorInRegion("#ffffff",1602 + xoff,331,47,42,1);
        if(white){
          white = undefined;
        while (!click(scorerare.x, scorerare.y));
        scorerare = null;
        log("open scorerare");
        battleprc(
          partflag,
          parttype,
          speedflag,
          2,
          false,
          autotype,
          false,
          teamtype,
          overtimeflag,
          false,
          true
        );
        if (sellflag) {
          sellflag = false;
          continue start;
        }
        continue rare;
      }
    }
    }
    //刷drop本
    if(droprareexflag || droprareflag){
      var dropimg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABHNCSVQICAgIfAhkiAAABQ5JREFUSImVlstvXEUWxn+nqvr2w+1uu9uPODYYEpAQEA8QhFAEUmA2I6HRLNjw581yxIaZWcxiQGKB0AwoIBwGy0mEwcrDaae73e/HvbeqWNy23Q93wnzSvVddXXW++s6pc07J23/9u2eEG5vrfPLqFbYL+dMh/nHvkL/tHdCLY+bBOUc+CPjwxS3+uL3Bo3aXz+78wt16E0EA8N7jnMOML8wYzVouw+V87myskA4QmcsFgFaKhXSKK0uLvLFW4trKEqVMwKd7B/xwXMd5j4ggIpgJa3L2moQI81gv53PcfH6DyHu+P66xlA64+dw6NzbXyRqN2Tvg1lEV5z1Ka4wEwbldY2YMi9ZIECCiZsiWMwEfXX2ev1zdYmgd/77/mC8eVuhZy5+2N3jr0iq1YcyTyHLY6gJgROtzC2rWKCIJqfMzf/Wd57DbpxFGvFxc5M8vXMYoxVdHVRzwWqnIfrPNSRQjJuExM1b+Dwyt49tKDaU1H1/ZZKdU4KPtDcDz9VGNz+9XeNTt047OD5wREbyf3f0pPIIbPdNQInSs51alhrcWXnqOnXKRyws5asMKB80OLnHTOaEShfV2LmHOaLJG04km00JEQCmUVvSHEd8dVYm9Z7daYLfW5GG3z0VWn+nSG5fKlDIBd07a3K41udto0wgjlNaICB4YAv3Y8p9Knd1ak24U04svFvFMwvVchnImzbVykQ+21jjuDThoddlrdthvdHgyGBICDuhGMd1ofoH4XYQARgmldEApHXC1sMC1cpH3hxG1Yciv7R63qw12qyccdQfYp5yHxJZSWDc/htNQIhSCFIUgxfZijleKed5ZXeJx7xL3Gh2+e3LC/+pN6oOQi6iNqKTkzDupDzp9Btaylc+SGc9ZkrO3kDIspAybC1leWS7w7qUyj7p99uot/lupcbfRYWDPBRnvPVprnHNcVNZ+qDb41+ERa9k0OytF3lxZZiufJTVVJJQIiynDYsqwvZjj1VKB9zZW2G+0+fqoym6tQWMYJTHUUzsfRzOM+OmkxY91z4/1Jp8/OObFxQVeLxfZKRXZWMigp8qhliTmy+mA7cUcb6wscbvW4J+/PBpT6N1cUoDQeSqDkONByL1mh28rNdayaa4W81xfLbGzUqSUDibWnLr8SspQHQzRIhjnPN47lCi00nOahaCUQikhji3tKKLVH3C/1WG/3uSbSo0XCnmury7z7nqZrXx2QrXznoNml1/bPYx3jji2KKUQJRfG0YgQi0dE4V08ijd4oB1GtCLLg86AvXqLLx8e84fyEjc3V3mpmCelFEe9AXcabZphhHHOEUURxpiLxCFA2jms90ldnNOMQ+d43Btw3B/yc7PLrScnXF9d5ubmKg86ffZPWjjvkxh663HK4YHpBmWUYLRB4pg4jvGj7j0OL+BHWWe9pz4c0ghDDttdbh3XGVjLYaeLx2NOJzrnwLmZxm6UxqQM3lriKDqL6ST8TJKPE0MSR5gpbbMxVEpdQDAJJQo1z9dnc0YCzOjqoJVCK5lZppWgRZKv0md6xiuTEjX3zjMNkzWJSG00wQVqxENKhEBr4tHmnHfY2OIZ+WTiknU6Oo7zMaNGE7WoxH1TU2Wk3miDFpcoc4CenDPv1/SYOXOMJPGbKeEyFkcR/CgH1Xgt9R55elc6Jxw6CwixjQmtnTlvDhhYSy8M6Y3SYgb+7PVswth7RMA7R+wd0/ac80TWJs9Trvu/F78BhN1TESHU4okAAAAASUVORK5CYII=")
      var drop = FindImageInRegion(
        dropimg,
        1456 + xoff,
        328,
        250,
        640,0.8
      );
      if (!drop) {
        log("not found drop");
        //点击滚动条
  
          
          var pullbar = FindColorInRegion("#88dddd",2126+xoff,232,5,690)
          
        if(pullbar){
          swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+100,200)
        }
      } else {
        dropimg=undefined;
        while (!click(drop.x, drop.y));
        drop = null;
        log("open drop");
        battleprc(
          partflag,
          parttype,
          speedflag,
          speedtype,
          autoflag,
          autotype,
          teamflag,
          teamtype,
          false,
          rareflag,
          false
        );
        if (sellflag) {
          sellflag = false;
          continue start;
        }
        continue rare;
      }
    }else if(scorerare){//刷分数本
        var scoreimg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAABHNCSVQICAgIfAhkiAAABC9JREFUSImtlttvW0UQxn+z5/ge24kd17Hj3HpRKeVSoFL7gqqqEQK1Qgh44j/gv+IRCQkheKkAISoVlCKQWkACtaGNkpo6ju3Ed/tcdnmwY8ekFNrwSeesjmbPt7Oz38ysnP/oM8MRoLVGKUUwEMRg0FrjeR7GGNRRiAGUUiilQAbfxhjAgAF7birKlaU8Z2enn41dBEEQAWPAYGj3Xb7eKGLHY1FezKa5NJ896iZG2Gy2uFWuYctwW7aS/4282nOpOu7RY/447PT6VHoOdsPx+HG7RsNx0cZgkMFoDJpxHPVwNAa0GQgsGQryyuw0S/HoiNjxNcV2l3LPwd7tO3xT3Ob7UgWNYNg/cTD7jxmr1QAigojwamaG08mpCa8ftrvcb7Tp+Rrb1ZpazwEYkT8JIoJlWSgR4kGbTDQ8Yb/faPFHvQXw9DEfyE7IRsOcTsaZCQVGto7ns15vUWx3n418H2em47yQSmDJWGXr9Ra/VOv0fQ2A/TSE+9mYiYQ4l06wEIuMbI6vuV3Z47fd5ni+yH/TtwzJA5bF+cwMF7MpgtZ44+uNFrcrezQdd0xuWdawNvzzIgIoAYXhdCLK5VyafHTsddv1WCtVuVPZmxDEmPxJXotgKUU+GuaNQpZzs9MTGX2nWufmowqNA16PyOVfUl9EmAmHWF3Icnk+QzwwPirfGLY7Pcrd/iEZK2M0ShS2ZfO4+IsIqXCINxfnuLo4x2wkNGkHLmRTfHBqkVPJKQ4y2J7nD1RgKUTrQb4f+DEXDXNtOc+1pRxz0RB/X16JkI9FuLqcYyEe5YsHf7K2XaXj+diu62LbNoPwKJQBbTQCnEzEeHdlnksLWTKRMbFvDH3fxxIhZFkAJIMBLhxLMRcNs5yIcX2zhK19jVbDVqUEgyIsiou5Wd5aynF2JkHyQBa6WrNWqnKjWOZsOsmVQpZEcGAPWooTiRjTJwpkoyHs/b5ntCYeDHA8HuP1XJoLc2nysQjBA0pyfM3NRzt8fG+Tu3tN7lT32O27XF3KkR3WGCVCJhJitZAdZGhAKZ6bTnBlIcvL6SSFWIR40J6Ib9fz+bZY5pP1Le7tNXG0ZqvZ4dP7D6k7Lu+szLOSiI3mJ4MB7NWFHK9lUzyfSlKYipAIBA7lU6nT4/pmia+2ttlstXGNGSmr2nP5cqtMy/N5//g8Z2YSY7V8+NJJ0uEQMds+ROppw++7Ta5vbbO2s0ut7yKWjWX8QV0fSrXp+XxXqmGLELQsTgx3IOZgJxjCADvdPj+Ud7lVqnG32aHiuIPupDVa6wm57iMRDLBaOMZ7x/MUYpHDVbHWd7ldqfNTZY8HjS71vkPP1yCCGZJOlAtjkKF7LcfjRrFCzLJ4eyWHvdFosxiP8qjT4+dag19rLTbaXXb7Ln1/cHvquC6d4S3qEMzoBUDXc/l8o4it4C+zcsaFTmHCIAAAAABJRU5ErkJggg==")
        var score = FindImageInRegion(
          scoreimg,
        1456 + xoff,
        328,
        250,
        640,0.8
      );

      if (!score) {
        log("not found score");
        //点击滚动条
  
          
          var pullbar = FindColorInRegion("#88dddd",2126+xoff,232,5,690)
          
        if(pullbar){
          swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+100,200)
        }
      } else {
        scoreimg=undefined;
        while (!click(score.x, score.y));
        score = null;
        log("open score");
        battleprc(
          partflag,
          parttype,
          speedflag,
          speedtype,
          autoflag,
          autotype,
          teamflag,
          teamtype,
          false,
          rareflag,
          false
        );
        if (sellflag) {
          sellflag = false;
          continue start;
        }
        continue rare;
      }
    }else{
      toast("请至少选择一种副本");
      exit();
    }
    

  }

    sleep(800);
  }
}

function battleprc(
  partflag,
  parttype,
  speedflag,
  speedtype,
  autoflag,
  autotype,
  teamflag,
  teamtype,
  overtimeflag,
  rareflag,
  rareingflag
) {
  //从寻找battle界面到战斗结束页面过程函数
  var selectflag = true;
  re: while (true) {
    bonusflag = storage.get("partflag5", false);
      
      var simple = FindColorInRegion(
        
        "#ffffcc",
        1805 + xoff,
        238,
        10,
        6
      );
      

    if (!simple) {
      log("not found simple");
      if (!equiprare && bonusflag) {
        //选择bonus
        equiprare = null;

          
          var bonus = FindMultiColors("#88dddd",[[0,1,"#87dcdc"],[0,3,"#86dbdb"],[0,5,"#95eaea"]],{
            threshold:1
          })
          
        if (!bonus) {

            
            var bottom = DetectsColor(
              
              "#88dddd",
              2098 + xoff,
              887
            ); //检测滑到底部
            
          if (bottom) {
            //滑到底部不选择助战
            click(498 + xoff, 882);
          } else {
            //点击滚动条
              bottom = null;

                
              var pullbar = FindColorInRegion("#88dddd",2097+xoff,161,5,600)
              
              if(pullbar){
                swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+240,150);

                pullbar = null;
              }
          }
        } else {
          click(bonus.x + random(5, 10), bonus.y + random(5, 10)); //选择bonus
          bonusflag = false;
          log("助战 选择完成");
          bonus = null;
        }
      } else {
        if(selectflag){
        //助战页面右下角白三角
        while (!DetectsColor("#ffffff", 2065 + xoff, 1013)){
          sleep(300);
        }
        //不选择助战
        press(2098 + xoff, 915, 200)
        sleep(250)
        press(479 + xoff, 831, 1)
        //改变flag防止再次进入
        selectflag = false;
        }
      }
    } else {
      log("found simple");
      simple = null;
      //选择队伍
      if (teamflag) {
        global.teamflag = false;
        teamflag = false;
        while(true){

            
            var teampoint = FindColorInRegion("#ffffff",teamregion[0] + teamx * teamtype,teamregion[1],teamregion[2],teamregion[3]);
            
          if(!teampoint){
            press(258+xoff, 582,1);
            sleep(500);
          }else{
            break;
          }
         }
        log("队伍设置成功");
      }

      //选择倍速
      if (speedflag) {
        //判断是否调过速
        speedflag = false; //全局flag不能改


          
          switch (speedtype) {
            case 0:
              while (
                !DetectsColor(
                  
                  "#ffffff",
                  1489 + xoff,
                  1009,
                  (threshold = 20)
                )
              ) {
                click(1371 + xoff, 964);
                sleep(400);
              }
              log("调速为1x");
              break;
            case 1:
              while (
                !DetectsColor(
                  
                  "#e85533",
                  1570 + xoff,
                  1017,
                  (threshold = 20)
                )
              ) {
                click(1371 + xoff, 964);
                sleep(400);
              }
              log("调速为2x");
              break;
            case 2:
              while (
                !DetectsColor(
                  
                  "#f85533",
                  1558 + xoff,
                  1014,
                  (threshold = 20)
                )
              ) {
                click(1371 + xoff, 964);
                sleep(400);
              }
              log("调速为3x");
              break;
          }
          
        log("调速成功");
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
      press(1798 + xoff, 999, 1);
      log("open battle");

      //判断副本是否超时1
      if (overtimeflag) {
        log("检测副本超时中");
        while (true) {

            
            var outoftime =  FindColorInRegion(
              
              "#888888",
              1888 + xoff,
              998,
              5,
              3
            );
            
            if (outoftime) {
              outoftime = undefined;
              back();
              log("已超时");

              while (true) {

                  
                  var evenoff = FindMultiColors(
                    
                    "#49c0c0",
                    [
                      [-18, -19, "#49c0c0"],
                      [58, 28, "#49c0c0"],
                    ],
                    {
                      region: [2105 + xoff, 182, 6, 6],
                    }
                  );
                  
                if(!evenoff){
                  back()
                  //找到活动页面X
                  sleep(1000);
                }else{
                  evenoff = undefined;
                 break re;
                }
                
              }
            } else {
              log("未超时");
              break;
            }
          
        }
      }

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
            overtimethread.interrupt();
            if (recoverflag) {
              log(empty);
              if(usediamond){
                click(1624+xoff,439);
              }else{
                click(1639+xoff, 592); // click(1624+xoff,439) 石头
              }

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
                  break;
                }
                sleep(199);
              }
              while (!click(1759 + xoff, 530))
                // sleep(700);
                log("clicked max");

              while (!click(1442 + xoff, 838)) log("clicked recover");

              // sleep(1000);

              //重新进入循环
              loopflag.setAndNotify("re"); //吃药成功发送battle事件
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
      });

      //超时2判定
      var overtimethread = threads.start(function () {
        let time = new Date();
        sleep(3);
        while (new Date() - time < 5000) {

            
            var overtime = FindMultiColors( "#ffffff", [
              [-647, 94, "#88dddd"],
              [-647, -480, "#88dddd"],
              [747, -481, "#88dddd"],
              [747, 94, "#88dddd"],
            ],{region:[880,699,140,59]});
            
          if (overtime) {
            recoverthread.interrupt();
            click(overtime.x, overtime.y);

            overtime = null;
            log("close pop");
            sleep(200);
            loopflag.setAndNotify("break"); //满人发送break事件
            log("超时线程结束1");
            overtimethread.interrupt();
          }
          log("not found pop");
          sleep(597);
        }
        loopflag.setAndNotify("null"); //无事发生
        log("超时线程结束2");
      });

      if (loopflag.blockedGet() == "re") {
        continue re;
      } else if (loopflag.blockedGet() == "break") {
        break re;
      }

      //根据设备调等待时间
      sleep(1000);
      while (true) {

          
          var esc = FindMultiColors(
            
            "#ffffff",
            [
              [-68, 96, "#598ad9"],
              [-42, 135, "#60c160"],
            ],
            {
              threshold: 25,
            }
          );
          

        if (!esc) {
          log("not found esc");
          press(345 + xoff, 353,1);
        } else {
          log(esc);
          //调节任务行动状态
          esc = null;
          log("found esc");
        
            sleep(4000);
            //判断关卡结束
             //boss 的HP字体颜色
             while(!DetectsColor("#ff5533",1157+xoff,57,threshold = 2)){
              log("not found boss")
              sleep(700)
            }
            log("found boss")
            
            while(DetectsColor("#ff5533",1157+xoff,57,threshold = 2)){
              log("boss not died")
              sleep(700)
            }
            log("boss  died")

          while (true) {
            //卖装备

            var full = FindMultiColors( "#ffffff", [
              [-174, 24, "#ff6840"],
              [208, 17, "#ff6840"],
              [-449, -160, "#ff5533"],
              [454, -154, "#ff5533"],
              [-681, -534, "#88dddd"],
              [706, -536, "#88dddd"],
          ],{threshold:20});

              
            if (full) {
              log(full);
              click(full.x, full.y);
              sleep(3000); //间隔尽量大一点，容易卡住
              click(2043 + xoff, 68);
              sleep(3000); //
              while (!sell()){
                sleep(2000)
              }; ////
              sellflag = true;
              break re;
            }


              
              var next = FindMultiColors( "#ffffff", [
                [21, 5, "#ffffff"],
                [-149, -993, "#ffff22"],
                [-2, -962, "#ffff22"],
              ]);
              
            if (!next) {
              log("not found next");
              // click(345, 353);

              press(1790 + xoff, 186, 1);
              press(1916 + xoff, 186, 1);
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
              //判断助战

              if (partflag) {
                sleep(100);

                if(parttype){
                  while(true){

                    
                    var onpart = DetectsColor("#88dddd",647+xoff,1037)
                    
                    if(!onpart){
                      onpart = null;
                      press(699+xoff,978,1);
                      sleep(100)
                    }else{
                      break;
                    }
                  }
                  log("助战开启")
                }else{
                  while(true){

                      
                      var onpart = DetectsColor("#666666",598+xoff,1037)
                      
                      if(!onpart){
                        onpart = null;
                        press(699+xoff,978,1);
                        sleep(100)
                      }else{
                        break;
                      }
                    }
                  log("助战关闭")
                }
                partflag = false;
              }

              sleep(13);
              //是否出现rare
              if (rareflag) {

                  
                  var rareon = FindMultiColors(
                    
                    "#ff5533",
                    [
                      [-180, -965, "#ffff22"],
                      [-33, -934, "#ffff22"],
                    ]
                  );
                  
                if (rareon) {
                  click(rareon.x, rareon.y);
                  break re;
                } else {
                  press(1156 + xoff, 1006, 1);
                  log("restart battle");
                  continue re; //再战
                }
              }

              press(1156 + xoff, 1006, 1);
              if (rareingflag) {
                //rare副本结算页面
                let time = new Date();
                while (new Date() - time < 1500) {

                    
                  var rare2 = DetectsColor("#ffffff",940+xoff,1019,threshold = 0)
                    
                  if (rare2) {
                    click(940+xoff,1019);
                        rare2 = null
                    continue re;
                  }
                  sleep(50);
                }
                log("rare end");
                click(next.x, next.y);
                next = null;
                break re;
              }
              next = null;
              continue re;
            }
            sleep(300);
          }
        }
        sleep(300);
      }
    }
    sleep(400);
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
