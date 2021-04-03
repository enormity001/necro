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
//左侧黑边检测
var xoff = leftBlack() - 246;

storage.put("ongoingscript","./收集.js");
let starttime = new Date();//脚本运行开始时间
let restartflag = storage.get("restartflag",false);//定时重启flag
let restarttime = (storage.get("restarttime",3)+1) *60*60*1000;//定时重启时间间隔
var material1flag = storage.get("material1flag",false)
var material2flag = storage.get("material2flag",false)
var ticketfbflag = storage.get("ticketfbflag",false)
var clearmaterialflag = storage.get("clearmaterialflag",false)
// var changecoins = storage.get("changecoins",false)


var autoorspeedflag = storage.get("autoorspeedflag", false);
var partflag = true; //助战检测falg
var bonusflag = storage.get("partflag3",false);
var parttype = storage.get("partflag3", false); //true为开启，off为关闭
var speedtype = storage.get("speedtype1", 2); //倍速类型 x3,x2,x1
var speedflag = true; //倍速检测flag
var autoflag = true; //行动状态检测flag
var autotype = 1; //人物行动状态 0为不动，1为autoskill
var teamflag = true; //队伍检测flag
var teamtype = storage.get("teamtype2", 1); //队伍序数 0，1，2，3，4，5
var teamregion = [269 + xoff, 166, 16, 16]; //队伍找色数组
var teamx = 43; //队伍图标间隔x上距离
var overtimeflag = true; //副本超时检测flag
var rareflag = true; //rare本检测flag
var sellflag = false;
var timeflag = storage.get("timeflag9", false);
var dailyflag = storage.get("dailyflag", false);
var aporticket = ticketfbflag || clearmaterialflag ? true : false; //装备探索或者消耗黄蓝材料 true开启门票检测 false开启ap检测
var rarefb = clearmaterialflag ? false : true; //是否刷红材料rare本,由是否周回黄蓝门票本有关
var time = new Date();
var timelimit =
  (parseInt(storage.get("hour9", 0)) * 60 +
    parseInt(storage.get("minute9", 0))) *
  60 *
  1000;
var recoverflag = storage.get("recoverflag8", false);
var usediamond = storage.get("usediamond8", false);
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

        engines.execSciptFile("./收集.js");
        exit();
      }
    }
    sleep(10343);
  }
});



start: while (true) {

    
    var evenoff = FindMultiColors(
      
      "#88dddd",
      [
        [-18, -19, "#88dddd"],
        [58, 28, "#88dddd"],
      ],
      {
        region: [2105 + xoff, 182, 6, 6],
      }
    );
    
  if (!evenoff) {
    //未找到人物列表界面X

    var questImg = images.read("./quest.jpg");

      
      try {
        var quest = FindImageInRegion(
          
          questImg,
          1869 + xoff,
          972,
          137,
          65,0.8
        ); 
      } catch (err) {
        
        continue;
      }
      
    questImg = undefined;

    if (!quest) {
      log("not found quest");
      back(); //用于关闭第进入游戏时的活动弹窗
      sleep(2500);
      continue start;
    } else {
      click(quest.x, quest.y);
      quest = null;
      log("open quest");
      sleep(1000);
      click(1913 + xoff, 887);
      sleep(3000);
      while (true) {

          
          var evenoff = FindMultiColors(
            
            "#88dddd",
            [
              [-18, -19, "#88dddd"],
              [58, 28, "#88dddd"],
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
    }
  }
  evenoff = null;

  sleep(1000);

  rare: while (true) {
    //返回任务列表，等待X出现
    while (true) {

        
        var evenoff = FindMultiColors(
          
          "#88dddd",
          [
            [-18, -19, "#88dddd"],
            [58, 28, "#88dddd"],
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
      while (
        !DetectsColor( "#88dddd", 2130 + xoff, 232)
      ) {
        //点击滚动条最顶部，直到检测到滚动条颜色
        click(2130 + xoff, 232);
        sleep(800);
      }
    }

    //装备探索
    if (ticketfbflag) {
      var zeroticketimg = images.fromBase64(
        "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"
      );
      while (true) {
        //票为0

          
          var zeroticket = FindImageInRegion(
            
            zeroticketimg,
            1829 + xoff,
            189,
            210,
            54,0.8
          );
          
        if (zeroticket) {
          zeroticketimg = undefined;
          zeroticket = null;
          log("装备票用完，退出脚本");
          exit();
        } else {

            
            var ticketfb = FindMultiColors( "#101727", [
              [49, -1, "#ffffc8"],
              [-20, -1, "#032260"],
            ]);
            
          if (ticketfb) {
            click(ticketfb.x, ticketfb.y);
            ticketfb = null;
            battleprc(
              partflag,
              false,
              speedflag,
              speedtype,
              autoflag,
              autotype,
              teamflag,
              teamtype,
              false,
              false,
              true
            );
          } else {
             //点击滚动条

              
            var pullbar = FindColorInRegion("#88dddd",2126+xoff,232,5,690)
            
            if(pullbar){
              swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+100,200)
              pullbar = null;
            }
          }
        }

        sleep(1000);
      }
    }
    //每日挑战ben
    if (dailyflag) {

        
        var daily = FindMultiColors( "#000000", [
          [7, 0, "#ffffff"],
          [94, -4, "#ffffff"],
          [117, 1, "#ffffcc"],
          [-170, 21, "#ffffcc"],
        ]);
        
      if (!daily) {
        log("not found daily");
      } else {
        while (!click(daily.x, daily.y));

        log("open daily");
        daily = null;
        global.dailyflag = false;
        battleprc(
          false,
          parttype,
          false,
          2,
          false,
          autotype,
          true,
          teamtype,
          false,
          false,
          true
        ); //每日本开启rareingflag用来返回任务列表
        if (sellflag) {
          sellflag = false;
          continue start;
        }
        continue rare;
      }
    }

    //rare
    if (rarefb) {

        

        var rare = FindMultiColors( "#ffffcc", [
          [-56, 6, "#ff5533"],
          [79, 4, "#ffffcc"],
          [132, 6, "#ff5533"],
          [-450, 40, "#ffffff"],
        ]);
        
      if (!rare) {
        log("not found rare");
      } else {
        log(rare);
        while (!click(rare.x, rare.y));
        log("open rare");
        rare = null;
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

    //清材料
    if (clearmaterialflag) {

        //第一次进入任务列表，找300，找不到则滑动
        
        var ticket300 = FindMultiColors( "#ffffc8", [
          [-4, -6, "#ffffc8"],
          [-5, 6, "#ffffc8"],
          [-2, -1, "#2f7176"],
          [-1, 1, "#aac5a7"],
        ]);
        
      if (!ticket300) {
        var red300img = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAC0AAAAXCAYAAACf+8ZRAAAABHNCSVQICAgIfAhkiAAABnxJREFUWIWVl8tvJFcVxn/n3lvV7bZ7/Irn/fBgxEQRk0kgEoogJBKCTYQQArKBiYRALFix4D/gD8iGHUKwAglWjJDYsGAIIE1GIIYEEJNIIUNix54Zu2233V2Pew6Lqm53221l5ki16Krb3/nqPL5zSi597wcGIEDbSi5qn0+VO1wrd7msfea1oEVkypQpUwQjE0cfx7541l3KXd/iVpjlTmizJg0ycUwyB8xZwTPW4/miw9PFNudjnwXLaZoih85n4ngoCR+4Bv8Ibf4c5njTzyAD0otW8JV8g+vZGsuxdwTgo6xEuJnM85Pmef4W2uQcJX5GM76VrfGNfIOTmj2mB9iRwK8bpwgAKcrXsnW+na1y5hCYARFBEVTAEByGN8Njw5cLGF8oNlGE7tRF3vIzYzhNU76eb/BKvs6S5mPPFCr82ocAzgwHeGx47oSVvNpfrUg/Gfd5sdgaI9wTR0cStiWwJQld8fTEYeJoijGjBfMxZ8kK5rQgqcE/X27xejnHXd8ixyGACFyNXV4oO2OE++LYlIT7LmVXPD08mTg8RtOUOStY1IInrGDKIgIkWEX6WrnLJe2PEb4ZFvhNusTtcIJNl6K1cyeCdw41WIx9vpg/5Jv9Va7EPRzQMOVK3OeU5vzPNYeYV2OXC7E3/F0gvBFm+XnjLLfCLHvij5TDlClPx12uZ2u8VGwyY7HOKnBO+yxYMTz8pm/z0+Y5bocTR4AwUDUQYTM0+ZWc5oz2Od/PaFsJwIIVQwcDJyuxx8mRKL/rp/hZ4yx/SBZGCmDceuK4FWbpimfWSj5XbFWlI0BqRkToiqcrnn/6adZcOhHIMMysjrpDxbHuGuyMRKphOiwXgDkrmaccq883wixv+9axhEft336Gt12Lom7u4DH+Htpjh/6UzLElybEgFXEwqVymddMMbEcC+4M7IsxrybTGMYx7vskDmRyYw6bAqmuw5QKnNCeUCDfSJW6kS48EMCRuiqpjhsiy9pivy8uADZeyIwGoUjlrJc2RcjFgTzz5MXo+ydZdyrYETpFXNX3YHJW8NE0nAgiGiNAw5aWyw/NFZ3h20yW87Vt0fAUtztEQCHZQCJk4chyT0SfbvniyQXlMOjBlka/mGzxXbh9DutLdi9rngvZpmFIi7LjAjfQkt5NZCvGV3AEBxY1Ub4/HizJAjlCKHE86RXm23OHl/MEjg265hN82TvLLqbOs+haDjjDAqY01YSaO4jFnbi6Osv7Psa9bTSgmXpM6PsE4pxkrmjGLEcQRpB4u9c4ysBIhPiZpg+H8nRjpEuGea3LnkKoMzJuRYjRQ2haZ1ZI5LfhSdp+VuM+PZ1a42VyqyEUl1kE4eEElPJLYHVjCQbaCyNE37krCa61lXmN5/IEIUjtvmHJKM14sNnkl+5Anyy4eY6Xc44V8k3cas3zgp4h4zIUx0g1TUmCS7+MsxYbaH4IIwXRYJwaUckz6RBj4KXC876f4RXKe1Du+s/cep2O1Cnyi3OWC9vkwaeHMEZ0jjhBsYKRi+GNIT8pBAxtmJyxqzpW4x4JWOrsnnn+FadZdYwKYjCPWu8h/kjZroTUkfTJmnNASh0MweuKH0wwgNaWB0UCwCRQViIfuT1kkqWU1XNAe3+/d4zNFB6gGw4+mV/jdpGFjOg5loA66eLKRzDRrB1pfHTz7IxLnMdoxx2tBf8KiZIAdSsK8FUwPFqZtRkYu1VCZ0YgYR8R/YlRUORGzsYkXkar5VFGNbOHZrdtowOVyuc9iyHjXTx3BFAFno0FQluPBUuc2JYythU1TLsYei5oBho5cBtXOMXI1NXK52GMxHuziHZewi1CaoWbs4LnvUvoj0X6u3ObZuMu0He0eg6HPxCKfLjs8Ve4Op26olvxAiQwL/eX8Pnvi+WMyT6d+NqqTguGp6uypuMeXs3XOxYN9fNU1eGCeqIrVGbvrW6y5Bh+rd+pl7fNqtkpiyp3Qpid+KI3VFDUSUz6u+1zvr3Gt3B3ih8yEO77NZ12Hy1p9G17UPj/s/Zfv9t/nnmvywKX0cWT1sBjo86XY44xmY5rbE8dffZv3JEVV63QLb4U277gWF2N/eP6ZcpdPll0euISHUn+9iCetv1qesIJ5LUkPFWoQ4PUwz9Wky3xeMmsHfT5nJXOxC+Nb5bHWE8dfwhw3wzwbJIgZ4hxOhLt+mt+ni1zSPitx/0C+ME5rzmnyj0CvymZTEv4PJYgo843d4xMAAAAASUVORK5CYII=")
        log("未找到300票，开始下滑");
        //点击滚动条

          
        var pullbar = FindColorInRegion("#88dddd",2126+xoff,232,5,690)
        
        if(pullbar){
          swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+120,200)
          pullbar = null;
        }
        sleep(270)

            
        var red300 = MatchTemplate(red300img,{
          region:[1553+xoff,302,141,640],
      })
            
        red300img = undefined;
        if(red300.points.length == 2){
          log("票用完")
          exit();
        }
        red300 = [];
      } else {
            log("找到门票本");
              click(ticket300.x,ticket300.y);
              tticket300 = null;
              log("刷材料");
              battleprc(
                partflag,
                parttype,
                speedflag,
                2,
                autoflag,
                autotype,
                teamflag,
                teamtype,
                false,
                false,
                true
              );
              log("材料用完");
              if (sellflag) {
                sellflag = false;
                continue start;
              }
            continue rare;
      }
    }

    //材料1
    if (material1flag) {
      var material1img = images.fromBase64(
        "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"
      );

        
        var material1 = FindImageInRegion(
          
          material1img,
          1374 + xoff,
          330,
          74,
          400,0.8
        );
        
      material1img = undefined;
      if (!material1) {
        log("not found material1");
         //点击滚动条

        
      var pullbar = FindColorInRegion("#88dddd",2126+xoff,232,5,690)
      
      if(pullbar){
        swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+100,200)
        pullbar = null;
      }
        sleep(600);
      } else {
        log(material1);
        while (!click(material1.x, material1.y));
        log("open material1");
        material1 = null;
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
    }

    //材料2
    if (material2flag) {
      var material2img = images.fromBase64(
        "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"
      );

        
        var material2 = FindImageInRegion(
          
          material2img,
          1374 + xoff,
          550,
          74,
          400,0.8
        );
        
      material2img = undefined;
      if (!material2) {
        log("not found material2");
         //点击滚动条

        
      var pullbar = FindColorInRegion("#88dddd",2126+xoff,232,5,690)
      
      if(pullbar){
        swipe(pullbar.x,pullbar.y+10,pullbar.x,pullbar.y+100,200)
        pullbar = null;
      }
        sleep(600);
      } else {
        log(material2);
        while (!click(material2.x, material2.y));
        log("open material2");
        material2 = null;
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
    }

   

    sleep(1000);
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
  re: while (true) {

var bonusflag = storage.get("partflag3",false);
      
      var simple = FindColorInRegion(
        
        "#ffffcc",
        1805 + xoff,
        238,
        10,
        6
      );
      

    if (!simple) {
      log("not found simple");
      if (bonusflag) {
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
        click(409 + xoff, 227);
      }
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
            default:
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
      click(1798 + xoff, 999);
      log("open battle");

     //判断副本是否超时1
     if (overtimeflag) {
      log("检测副本超时中");
      for(let counter = 0;;counter++) {
        if(counter>20){break re;}

          
          if (FindColorInRegion(
              
              "#888888",
              1888 + xoff,
              998,
              5,
              3
            )
          ) {
            back();
            log("已超时");

            while (
              !FindMultiColors(
                
                "#49c0c0",
                [
                  [-18, -19, "#49c0c0"],
                  [58, 28, "#49c0c0"],
                ],
                {
                  region: [2105 + xoff, 182, 6, 6],
                }
              )
            ) {
              //找到活动页面X
              sleep(1000);
            }
            
            break re;
          } else {
            log("未超时");
            
            break;
          }
        }
      }
      if (!aporticket) {
        //表示普通体力本
        var loopflag = threads.disposable();
        var recoverthread = threads.start(function(){//吃药子线程
          let time = new Date()
          while(new Date()-time < 5000){
  
              
              var empty = DetectsColor( "#ff5533", 1609+xoff, 137);
              
      
            if (!empty) {
              log("ap enough");
            } else {
              empty  = null;
              overtimethread.interrupt();
              if (recoverflag) {
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
                  }else{break;}
                  sleep(199);
                }
              while(!click(1759+xoff, 530))
                // sleep(700);
                log("clicked max");
    
                while(!click(1442+xoff, 838))
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
            sleep(497)
          }
          loopflag.setAndNotify("null")//无事发生
        })
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
                loopflag.setAndNotify("break"); //
                log("超时线程结束1");
                overtimethread.interrupt();
              }
              log("not found pop");
              sleep(597);
            }
            loopflag.setAndNotify("null"); //无事发生
            log("超时线程结束2");
          });
        if(loopflag.blockedGet()=="re"){
          continue re;
        }else if(loopflag.blockedGet()=="break"){
          break re;
        }
      } else {
        //黄蓝材料本检测门票是否用完
        var loopflag = threads.disposable();
        var outofticketthread = threads.start(function () {
          let time = new Date();
          ticket: while (new Date() - time < 4500) {
            let i = 0;
  
              
              var outofticket = FindMultiColors(
                
                "#ffffff",
                [
                  [-4, -7, "#020202"],
                  [-647, 94, "#88dddd"],
                  [-645, -477, "#88dddd"],
                  [745, -476, "#88dddd"],
                  [745, 94, "#88dddd"],
                ]
              );
              
            if (!outofticket) {
              log("ticket enough");
            } else {
              while (!click(outofticket.x, outofticket.y))
                outofticket = null;
  
              for (; i < 1; i++) {
                //当票不足时，将倍速调为1x再尝试一次确保(武器)票用完
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
                click(1798 + xoff, 999);
                log("open battle");
                continue ticket;
              }
  
              loopflag.setAndNotify("back"); //票用完，返回
              outofticketthread.interrupt();
            }
            sleep(497);
          }
          loopflag.setAndNotify("null"); //无事发生
        });
        if (loopflag.blockedGet() == "back") {
          while (true) {
  
              
              var evenoff = FindMultiColors(
                
                "#88dddd",
                [
                  [-18, -19, "#88dddd"],
                  [58, 28, "#88dddd"],
                ],
                {
                  region: [2105 + xoff, 182, 6, 6],
                }
              );
              
            if (!evenoff) {
              back();
            } else {
              log("回到人物列表");
              evenoff = null;
              break re;
            }
            sleep(400);
          }
        }
      }
      
          //根据设备调等待时间
          sleep(2000);
          while (true) {
      
              
              var esc = FindMultiColors( "#ffffff", [
                [-68, 96, "#598ad9"],
                [-42, 135, "#60c160"],
              ],{threshold:15});
      
              
      
            if (!esc) {
              log("not found esc");
              press(345 + xoff, 353,1);
            } else {
              log(esc);
              //调节任务行动状态
              log("found esc");
              esc = null;
             
             
             sleep(4000)
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
            
            for(let counter = 0;;counter++) {
              if(counter>500){break re;}
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
                  log("邮箱满了")
                  click(full.x, full.y);
                  full = null;
                  sleep(3000); //间隔尽量大一点，容易卡住
                  click(2043 + xoff, 68);
                  sleep(3000); //
                  while (!sell()){
                    sleep(2000)
                  }; ////
                  sellflag = true;
                  break re;
                }
      
      
                  
                  var next = FindMultiColors("#ffffff",[[21,5,"#ffffff"],[-149,-993,"#ffff22"],[-2,-962,"#ffff22"]])
                  
                if (!next) {
                  log("not found next");
                  // click(345+xoff, 353);
                  press(1790 + xoff, 186,1);
                  press(1892 + xoff, 186,1)
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
                  //判断助战(小bug，第一次结束稀有本便结束时会卡住)
                  if (partflag) {
                    sleep(100);
      
                    if (parttype) {
      
                        
      
                        while (
                          !DetectsColor(
                            
                            "#88dddd",
                            647 + xoff,
                            1037
                          )
                        ) {
                          let counter = 0;
                          if(counter>50){break;}
                          click(699 + xoff, 978);
                          counter++;
                          sleep(100);
                        }
                        
                      log("助战开启");
                    } else {
      
                        
                        while (
                          !DetectsColor(
                            
                            "#666666",
                            598 + xoff,
                            1037
                          )
                        ) {
                          let counter = 0;
                          if(counter>50){break;}
                          click(699 + xoff, 978);
                          counter++;

                          sleep(100);
                        }
                        
                      log("助战关闭");
                    }
                    partflag = false;
                  }
      
                  sleep(13);
                  //是否出现rare
                  if (rareflag) {
      
                      
                      var rareon = FindMultiColors("#ff5533",[[-180,-965,"#ffff22"],[-33,-934,"#ffff22"]])
                      
                    if (rareon) {
                      click(rareon.x, rareon.y);
                      rareon = null;
                      break re;
                    } else {
                      press(1156 + xoff, 1006, 1);
                      log("restart battle");
                      continue re; //再战
                    }
                  }
      
                  // if(aporticket){
      
                  //    
                  //   var rebattle = FindMultiColors("#ffffff",[[132,-12,"#070f10"],[523,-970,"#ee9900"]])
                  //    
                  //  }
                  //  if(rebattle){
                  //    click(rebattle.x,rebattle.y)
                  //    rebattle = null
                  //  }else{
                  //    log("票用完，返回任务列表");
                  //    click(next.x,next.y)
                  //    break re;
                  //  }
                  // }
                  press(1156 + xoff, 1006, 1); //再战
                  if(rareingflag){//rare副本结算页面
                    let time = new Date()
                    while(new Date - time < 1500){
      
                        
                        var rare2 = DetectsColor("#ffffff",940+xoff,1019,threshold = 0)
                        
                      if(rare2){
                        click(940+xoff,1019);
                        rare2 = null
                        continue re;
                      }
                      sleep(50)
                    }
                    log("rare end")
                    click(next.x,next.y)
                    next = null
                    break re;
                   
                }
                next = null;
                  continue re;
                }
      
                sleep(500);
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
