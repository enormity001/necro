
auto.waitFor(); //415,217
images.requestScreenCapture();
sleep(300);
var xoff = leftBlack() - 246;
var scale = 2 / 3;
var FindImageInRegion = sync(function(a,b,c,d,e,f){
    return images.findImageInRegion(images.captureScreen(),a,b,c,d,e,f)
})
var FindImage = sync(function(a,b,c){
    return images.findImage(images.captureScreen(),a,b,c)
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

var recoverflag = true;
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
        engines.execScriptFile("./自动推图.js");
        exit();
      }
    }
    sleep(10343);
  }
});

while (true) {
  var newquestimg1 = images.fromBase64(
    "iVBORw0KGgoAAAANSUhEUgAAACkAAAAWCAYAAABdTLWOAAAABHNCSVQICAgIfAhkiAAAAjZJREFUSIm9l81r1EAYxn8bG6P9WLpIi7gu3hTxuKjHXnpQPAj5B6oovUkvBf+AUkT0pCCCeCj0oKh7K7QUr1JLBS8injysgYKXtbtbWGMbD9mQrzczyW7pA0My7zOTeTJ55p1JyfMcD84horEI/AHaMg9w4z6MzsZjX1/Azo5/f3sOpmay++eAAUY2az/w9TUVpSX0c13o7vvFdYcS2Be5p6AvDD3AUcCAsrrF3LPjUaLAiL7JaaidB8fxq4denJY+556G3/0Ib1/1K4FfDOAwcg2hMGQE9lOoVmXONNV9JT4mfLJfyolrWARPOsBvQehDWYQ0U2MHal73YgnInmw8FppOybMpDdg9oeYLrnjhc1eh+Qta39KU/QgqlWIDSnztSn6FkxOKhbOyBAurxNeWCdevwfpGJDSAJ6nBwpvcOtV5svUjHbt0F8oTYX0QTxaEOk+uLMnxm/Ph/SCeLAh9Cvr+Oh07e9XPnUYJOiV1/yOYSX0y396Cy/fScXsZnt+B8XF1f2kmm5+gEdnJNC+i2bv7aCwKQctPSZ1Omop68uCf/vmmqSz6vTuA8y4ds5ehLRzjjt2TrbafN99/APYTpAV1zVmx9zcds07lFgh59+4AWy+FYEWIRWCdLDSEhHyeDPB5G36u6dtFPSnC0/BxjIBmdSaxuQHzt9Rtop5MHu0ApuuFdhw5BZ3pgpn1mRzofQGrnv3Ui67/awQw3cstJguGqHN0LEwBAaJpYe0JsDv04HnxH3pBktZrWJYkAAAAAElFTkSuQmCC"
  );
  var newquestimg2 = images.fromBase64(
    "iVBORw0KGgoAAAANSUhEUgAAACYAAAAUCAYAAADhj08IAAAABHNCSVQICAgIfAhkiAAAAuJJREFUSIm9lV9LFFEYxn+7s+nkCM3ILqYlLiIIWiiZFSRCoEFQBgV+ghC676p7v4TQjbcbQRRKVhTVhWiSRGwX5apXuhnOIg57dnV2uji6s7Ozs+6K9MBh5v133mfOPOeckLOz42AYuBDwegZeJYCstIPQexPuTUJXn7SX38GLZ7CxIe3+G/DwEXT1Bs8RgIjfpbJ9/Q5sbxP7OCe5BaFSzLYhn3ffT4gKxCAW64BYx4knPQ1UJAbA3QnIZiAxc3rdslkwTRBV5OEjZppYe3vQ0oKmaYAKxnmEYSAyGQBUx0EtKbZtG2wbpdgYjyR98c01SEzD8peSAoAQ4JQ8y1ZMW3oLhg63HkjH6AQqIUhMF8mVQlEUUBSfPyjuI8rZwNpwqWH9SZNOrWJZVtEnBkcRQ7crFtu2LZsdobEADYXAuKIokmwNCJc7mhfn0RbfFG1V19HjcVRd9xX7GuXCkA8Hxn0fUhMxw0CLRtFME+vbClYqBfv7EAqRuTrG1sh9RFOTp/i4RuVx02hjx2iriVjFXaktzEJrK3RMAqDrOvrAAPxahGSymFevxqLRKDx+Kscx8P3KI1jpNNbWluvoG4bBUVDdfVmvxupBIDFtYRZtYc7r7BuW4xD1aqweBB+wAD8+QzwO3UPSbm+HwSuI1DIik0HNhVCrXFm+42F3Vw43IfDaqk5sfQ3W1lxigBgeR2ym5UXf2Oj5teUo15iVTuMkpmle+eAlXzcxgPfP5XNsAgBVVVHbWhG6Drmc93op11ihUHagyrPdR74CAjXmwepX+L1UNMXwuBxCIEqJ/TeNZYUcpgkXLsHlEeBw1a6NwH4esqabH/Kuh31wAPZBccX2IxGInKmJWG0rBnIjfP/k2j390DNQtUSJRFCU49VSCd4qxwnOXF+H+ZdwrlWSAujs9OY02B6NVUaVHoHEQuXS9OLvzyROMknsiNjFbm9CXvFoTH6oS0SPx+HJFDDl9gvo+Q+roCbjIBrSTgAAAABJRU5ErkJggg=="
  );
 

    
    var newquest1 = FindImage( newquestimg1, 0.1);
    var newquest2 = FindImage( newquestimg2, 0.1);
    var newquest = newquest1?newquest1:newquest2
  newquestimg1 = undefined
  newquestimg2 = undefined
  if (newquest) {
      click(newquest.x, newquest.y + random(60, 70));
      
      var athread = threads.start(function(){
        while(true){

            
            var white = DetectsColor("#ffffff",2065+xoff,1008,threshold = 1)
            
          if(white){
            white = null;
            bthread.interrupt()
            log("b线程结束")
            break;
          }else{
            sleep(400);
          }
        }

        while (true) {

              
              var simple = FindColorInRegion(
                
                "#ffffcc",
                1805+xoff,
                  238,
                  10,
                  6,2
              );
              
            if (simple) {
                
                press(1873+xoff, 997,1);
              newquest = null;
              log("open battle");
              break;
            } else {
              log("not found simple");
             press(600+xoff,435,1)
             
          }
              sleep(1300);
          }
          
          var loopflag = threads.disposable();
          var recoverthread = threads.start(function () {
            //吃药子线程
            let time = new Date();
            while (new Date() - time < 5000) {

                
                var empty = DetectsColor(
                  
                  "#ff5533",
                  1609+xoff ,
                  137 
                );
                
          
              if (!empty) {
                log("ap enough");
              } else {
                if (recoverflag) {
                 empty = null;
                  click(1639+xoff , 592 ); // click(1624,439) 石头
          
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

                  click(1759+xoff, 530 );
                  sleep(700);
                  log("clicked max");
          
                  click(1442+xoff , 838 );
                  log("clicked recover");
          
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
              sleep(500);
            }
            loopflag.setAndNotify("null"); //无事发生
          });
          
          if (loopflag.blockedGet() == "re") {
            while (true) {

                
                var simple = FindColorInRegion(
                  
                  "#ffffcc",
                  1805+xoff ,
                  238 ,
                  15 ,
                  15 
                );
                
              if (simple) {
                simple = null;
                while (!click(1873 +xoff, 997));
                log("吃药成功，再次开始");
                sleep(400);
                break;
              }
              sleep(500);     
            }
          }
          
          sleep(3000)
            while (true) {
              if(!nextimg){
                var nextimg = images.fromBase64("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")
              }

                
                var next = FindImageInRegion(nextimg,1393+xoff,985,65,49);
                
              nextimg = undefined;
              if(next){
                  log("found next")
                  click(next.x,next.y)
                  next = null;
                  log("a线程结束")
                  break;
              }else{
                  log("not found next")
                  click(1424+xoff,791)
                  sleep(100)
                  click(345+xoff, 353);
    
              }
              sleep(1500)
    }})
    
    var bthread = threads.start(function(){
        while(true){
            var skipimg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAB0AAAAeCAYAAADQBxWhAAAABHNCSVQICAgIfAhkiAAAAsFJREFUSImtl81PE1EQwH/TEJQIPXAzJHD1Aw60VC/+B+CNULReEGPi36BFwkY5gg1Wrg2GtBA9mOJJjGcLJYG0epUoesKEQPTk87Dd3bdf/aCdTfu2b3bnNzNvdvZVursvKAS/KO3cq1f6fE2pAm4QfU7TTi4uqu1MhrPjY4+xmvEgh9wmQmcUsFCt8OfkhJ5o1B4jY1NT3Ftd5fKVqwH2vAY9v5X9ZV+u32Kd9kSjrjECMDA8zKO3b7hxZzoAINoR5IP43RHLA38cNtSSibk5xp88dpnQly1M9GvEdjNcIt6Jm6kUD16vMRSLuYGifVziLZaGReCHAgzGYqReZUm40m0a1DNnReVE6VKE4gOhABf7+phIp5lIp7nU348vZKtqbMvW2mqHBJsPhVqSmJ4mlc0ycP1ajeMUlVNCop17HDsPFGBgZISHGxskkkktqPC1E4FIRBART9NoAWrJeC3dNtgTiXgqTwKuaRkKMJZMMpPLMTg66sBqo9YmPA60CQUYise5v7ZGYirpRCNaZYsF7iDUkvG5NLfn57nY2+sss5gRK5TvCe4IFCA+Ocnd7EsG4zFzQiOF9aW2oWA2k5lcjluzs3Z8ShEaa0egPlFmgsOkqxOMHwcHbBkGR9WqOSGAEvgXDG4bWioU+LSywtnxbxuoFIiooL7QHvTv6SnbS8uUCvnw7UtI0zoX9LBc5sPyCw7LZRMiSlvCxnuclqGf19d5/+x5sNKOWKEQJCS/LUGLhsFOvuBj6CKWQsKbQ1PQo0qFd0/n+fX1ix8g4uB1Sp0sN4TubG7yMZNxqtNl1RnERRWXriVocWGBUmGjkV8eabxHCoR+291le2mZw709tOTVlab25WHQUj7PlmHgTZjbvE5q5v9HHWjRMCjlCwFvh2ZidUu9DHUBfN/fp2gY/KxU7fdhw1t9056taB1f/wMYXcr5QC0zdQAAAABJRU5ErkJggg==")

                
                var skip = FindImageInRegion(skipimg,1965+xoff,765,35,35,0.65)
                
            if(skip){
                athread.interrupt()
                log("a线程结束")
                click(skip.x,skip.y)
                sleep(1000)
                click((793+246)*3/2+xoff,490*3/2)
                log("skip..")
                log("b线程结束")
                break;
            }else{
                log("not found skip")
            }
            sleep(1500)
        }
    })
    athread.join()
    bthread.join()//一定要等待线程结束，不然会进入下个循环导致线程卡死
  } else {
    swipe(1621+xoff,539,1621+xoff,770,250)
    }
    sleep(2000);
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
