auto.waitFor(),images.requestScreenCapture(),sleep(300);var xoff=leftBlack()-246,flag=!0,scale=2/3,recoverflag=!1;for(threads.start(function(){for(sleep(300);;){var b=images.read("./reline.jpg");if(flag){flag=!1;var c=images.findImageInRegion(captureScreen(),b,1442+xoff,710,87,41);flag=!0}if(b.recycle(),!c)log("not found reline");else{log(c),click(c.x,c.y),log("open reline"),sleep(2e3);var d=images.read("./error.jpg");if(flag){flag=!1;var e=images.findImageInRegion(captureScreen(),d,1105+xoff,517,56,56);flag=!0}d.recycle(),e?(log(e),click(e.x,e.y),log("click error"),engines.execSciptFile("./autoprc.js"),exit()):log("not found error")}sleep(1e4)}});;){var newquestimg=images.fromBase64("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");if(flag){flag=!1;var newquest=images.findImage(captureScreen(),newquestimg,0.4);flag=!0}if(newquestimg.recycle(),newquest){click(newquest.x,newquest.y+random(10,20));var athread=threads.start(function(){for(;;){if(flag){flag=!1;var b=images.findColorInRegion(captureScreen(),"#ffffcc",1805+xoff,238,10,6);flag=!0}if(b){newquest=null,bthread.interrupt(),log("b\u7EBF\u7A0B\u7ED3\u675F"),click(1873+xoff,997),log("open battle");break}else log("not found simple"),click(newquest.x,newquest.y+random(10,20));sleep(1300)}var c=threads.disposable(),d=threads.start(function(){for(var g=new Date;5e3>new Date-g;){if(flag){flag=!1;var h=images.detectsColor(captureScreen(),"#ff5533",1609+xoff,137);flag=!0}if(!h)log("ap enough");else{back(),sleep(500),back(),exit()}sleep(500)}c.setAndNotify("null")});if("re"==c.blockedGet())for(;;){if(flag){flag=!1;var b=images.findColorInRegion(captureScreen(),"#ffffcc",1805+xoff,238,15,15);flag=!0}if(b){for(;!click(1873+xoff,997););log("\u5403\u836F\u6210\u529F\uFF0C\u518D\u6B21\u5F00\u59CB"),sleep(400);break}sleep(500)}for(sleep(3e3);;){var e=images.read("./next.jpg");if(flag){flag=!1;var f=images.findImageInRegion(captureScreen(),e,1404+xoff,991,38,38);flag=!0}if(f){log("found next"),click(f.x,f.y),log("a\u7EBF\u7A0B\u7ED3\u675F");break}else log("not found next"),click(1424+xoff,791),sleep(100),click(345+xoff,353);sleep(1500)}}),bthread=threads.start(function(){for(;;){var b=images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAB0AAAAeCAYAAADQBxWhAAAABHNCSVQICAgIfAhkiAAAAsFJREFUSImtl81PE1EQwH/TEJQIPXAzJHD1Aw60VC/+B+CNULReEGPi36BFwkY5gg1Wrg2GtBA9mOJJjGcLJYG0epUoesKEQPTk87Dd3bdf/aCdTfu2b3bnNzNvdvZVursvKAS/KO3cq1f6fE2pAm4QfU7TTi4uqu1MhrPjY4+xmvEgh9wmQmcUsFCt8OfkhJ5o1B4jY1NT3Ftd5fKVqwH2vAY9v5X9ZV+u32Kd9kSjrjECMDA8zKO3b7hxZzoAINoR5IP43RHLA38cNtSSibk5xp88dpnQly1M9GvEdjNcIt6Jm6kUD16vMRSLuYGifVziLZaGReCHAgzGYqReZUm40m0a1DNnReVE6VKE4gOhABf7+phIp5lIp7nU348vZKtqbMvW2mqHBJsPhVqSmJ4mlc0ycP1ajeMUlVNCop17HDsPFGBgZISHGxskkkktqPC1E4FIRBART9NoAWrJeC3dNtgTiXgqTwKuaRkKMJZMMpPLMTg66sBqo9YmPA60CQUYise5v7ZGYirpRCNaZYsF7iDUkvG5NLfn57nY2+sss5gRK5TvCe4IFCA+Ocnd7EsG4zFzQiOF9aW2oWA2k5lcjluzs3Z8ShEaa0egPlFmgsOkqxOMHwcHbBkGR9WqOSGAEvgXDG4bWioU+LSywtnxbxuoFIiooL7QHvTv6SnbS8uUCvnw7UtI0zoX9LBc5sPyCw7LZRMiSlvCxnuclqGf19d5/+x5sNKOWKEQJCS/LUGLhsFOvuBj6CKWQsKbQ1PQo0qFd0/n+fX1ix8g4uB1Sp0sN4TubG7yMZNxqtNl1RnERRWXriVocWGBUmGjkV8eabxHCoR+291le2mZw709tOTVlab25WHQUj7PlmHgTZjbvE5q5v9HHWjRMCjlCwFvh2ZidUu9DHUBfN/fp2gY/KxU7fdhw1t9056taB1f/wMYXcr5QC0zdQAAAABJRU5ErkJggg==");if(flag){flag=!1;var c=images.findImageInRegion(captureScreen(),b,1965+xoff,765,35,35);flag=!0}if(c){athread.interrupt(),log("a\u7EBF\u7A0B\u7ED3\u675F"),click(c.x,c.y),sleep(1e3),click(3117/2+xoff,735),log("skip.."),log("b\u7EBF\u7A0B\u7ED3\u675F");break}else log("not found skip");sleep(1500)}});athread.join(),bthread.join()}else swipe(1621+xoff,539,1621+xoff,870,300);sleep(1e3)}function leftBlack(){var b=images.captureScreen(),c=b.height,d=0,e=c/2;if(1920==b.width)return 0;for(;d<b.width-1;){if(b.pixel(d,e)!=b.pixel(d+1,e))return 0==d?d:d+1;d++}return d+1}
