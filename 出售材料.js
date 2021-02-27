    var storage = storages.create("pref")
    events.on("exit", function() {
      storage.put("ongoingscript","");
    })
    images.requestScreenCapture();
    var xoff = leftBlack() - 246;
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
              engines.execScriptFile("./出售材料.js");
              exit();
            }
          }
          sleep(10343);
        }
      });
      

    while(!sell());
    exit();


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
        for(let counter = 0;;){
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
      
        for(let counter = 0;;) {
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
        oma:  for(let counter = 0;;) {
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
      
            for(let counter = 0;;) {
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
                equiploop:  for(let counter = 0;;) {
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
                    for(let counter = 0;;) {
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
                        for(let counter = 0;;) {
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
      
                        for(let counter = 0;;) {
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
