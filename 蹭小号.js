
importClass("android.app.PendingIntent");
importClass("android.app.AlarmManager");
importClass("java.lang.System");
var storage = storages.create("pref");
events.on("exit", function() {
  storage.put("ongoingscript","");
})
auto.waitFor(); //415,217
auto.setMode("normal");
images.requestScreenCapture();
sleep(300);
var xoff = leftBlack() - 246;
storage.put("ongoingscript","./蹭小号.js");
let starttime = new Date();//脚本运行开始时间
let restartflag = storage.get("restartflag",false);//定时重启flag
let restarttime = (storage.get("restarttime",3)+1) *60*60*1000;//定时重启时间间隔
var stuckorloseflag = storage.get("stuckorloseflag",false);
var autoorspeedflag = storage.get("autoorspeedflag", false);


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

var sellflag = false;
var teamflag = storage.get("teamflag", false);
var teamtype = storage.get("teamtype3", false); //0~5 队伍顺序
var guildflag = storage.get("guildflag", false); //工会战flag
var teamregion = [269 + xoff, 166, 16, 16]; //队伍找色数组
var teamx = 43;
var time = new Date();
var timelimit = storage.get("", false);
var recoverflag = storage.get("", false);
var autoflag = true;
var autotype = 1;
if (!guildflag) {
  var timeflag = storage.get("timeflag7", false);
  var timelimit =
    (parseInt(storage.get("hour7", 0)) * 60 +
      parseInt(storage.get("minute7", 0))) *
    60 *
    1000;
  var recoverflag = storage.get("recoverflag6", false);
  if (timeflag) {
    threads.start(function () {
      setInterval(function () {
        if (new Date() - time > timelimit) {
          exit();
        }
      }, 60000);
    });
  }
} else {
  var timeflag = storage.get("timeflag8", false);
  var timelimit =
    (parseInt(storage.get("hour8", 0)) * 60 +
      parseInt(storage.get("minute8", 0))) *
    60 *
    1000;
  var recoverflag = storage.get("recoverflag7", false);
  if (timeflag) {
    threads.start(function () {
      setInterval(function () {
        if (new Date() - time > timelimit) {
          exit();
        }
      }, 60000);
    });
  }
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
 
          engines.execScriptFile("./蹭小号.js");
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
 
         engines.execScriptFile("./蹭小号.js");
         exit();
       }
 
       
     }
     sleep(10343);
   }
 });
 

start: while (true) {
  help: while (true) {

      
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
        while (true) {

                
                var refresh = FindColorInRegion(
                    
                    "#55bbcc",
                    2036 + xoff,
                    248,
                    5,
                    5,2
                );
                
           if(refresh) {
              if(guildflag){
                
                press(1943+xoff,537,1);
                sleep(500);
              }else{
                press(1943+xoff,397,1);
                sleep(500);
              }
                refresh = null;
                break;
            }
            sleep(600); //正常速度为1500ms
        }
        help = null;
        log("open help");
        break;
      }
    } else {
      if(guildflag){
                
        press(1943+xoff,537,1);
        sleep(500);
      }else{
        press(1943+xoff,397,1);
        sleep(500);
        }
      refreshbotton = null;
      break;
    }

    sleep(2000);
  }

  shiro: while (true) {
    if(!shiroImg){
      var shiroImg = images.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAMcAAABHCAYAAACztVMeAAAABHNCSVQICAgIfAhkiAAAIABJREFUeJzlnXl4ldW97z/r3TvJzjyTmZ0EwhDGJCAz4oCiOKEeq63YirbgPe1p1dPrueePc89zn/bcnrHtrfeIrW1t9VhxFkSqCIggCoEwJiFkBjLPIdNO9n7f+8c77DnZSXYi9n59dmneYU3v+q31m5cIi45VmACEAEkIHIrL6woI7Z4QAllRUCZUerAxuUYIIRAIFEX2KkkgkCQJhywHWJeYwJ3gYazWSUIgANnlwymobZOE2kJZUSY5ok6MfPQc8qrZQSotuJAm8pI++X1BQUHRBtYkJlR8kBEEwhACtWe+y1cUBSEFOrUVv7/p+G+0+l165PWOoijIioyCohHJWGUF9jM/8yo4ZK5HSOPpiBDaDwBF2zVcfkLdOhShrzz6teAM5MR+44Fw+6n/qZCN++5QEOqEAVT6EB6/rwfUnQFAQfY1bGJiIzpmvaVXkfacDnKpwYEIi44ZV38NFgOVZXJdTz2ngkBorNf0rwzB+IgS6q6hoLixGa4Qrv8KgexjZvnZZK8rCKH2VwGPvupMlfezjiDxzEpiFMO1vwhKWcGEyRwW9o+BPy5Ulgp8zj5/xKFPsK8bhNZfZZRJoI+FKmup/b0+5KzAoX5TlTAUL3nCN2VL2iLpc5cZLwZHwGZH2TA/CIUFD+PaOYTONiiaXCGE20D6GkZdkAvWKhMoJl6b+qaxayiyOgGMzgm3Z10XClU+AUdQZsz0QWhCOIoSMOuk7h5S8L5rqJnhqn+H+MjglBcESOPj3DVtBaB4EAZ+3pO1n05I4xEPp0vScOuBorNIIKMgI7RVwYcMoaCxlq59FeMQzr96GJwAgROGDkUo2oIZhC82PIL5798IQo+Ch8AFcm0QAtN4uF9TUPxqt65PaG0dbab4WjH1HfVrJIjrkBV/X8/PF1Y02cTHd50oiYi3jiPOXp6K7k0IAelahRDOB+WxhGvvSaNomivJa0Wdyr1jgvuNvlEoCooiez+jKL4Jw6NP6u4x8T0s+PDur66Sn/gerpbr7Oskf0PDmJ5+ZQrHYHwwmULHFsh1laZTMJ3YyigCWZG/SmhaGND6qmgXxwX1PUlIE3h3CuFjzAVC07IrHtf9/3D5Vy9T13IF47uK1l7ITERZPHPyhU22LdblNyhLNt9JVGISXVevUnPiBFfOncNus6kP6Nomg2VwouC+e1mzdSuW6Gjaaus49sorVB496rMiySRhCgkhxBwCZhMhlnAsMTFExMQQHhdHTHIyCdaZxCQnU7r/E87/+c9+Gx2VmMiSu+4iYWYWlUePcuXMWfq7utyeMZnNrH5sKysefhiAvo4Ojr36Kuf2fuh/MPz0dcldd7F666NExsfTWFbOsVdeoe7UKT+lqO/5V2NPjGBmLl3C6q1byVy0CICS997j2CuvMnTt2jhLUolXXe2FtghMYlYL5+Ipa+VPVkZX8lKxn/6nyRUSBJhT5+SRf+utxKWlITscyA4H9dqHFy5qWF+q2LCISKKTkwmPjWWwpwdzaCgAeWvXsv6JbaTn5yOZTEgmE0IK3FpuHx6hsbycjvp6n/dT584l/9ZbyFq8mOUPPkjN8eMc2vki9SUlzoeEICwykpiUFPVPSSLEYvFbp9DYKV+LQKjFQnRSElFJSXQ3NWMKDXG7n7N8OXPWryM0PNy9TH1F9TF2tSeKuXTkCMODg/4HwgWmkFAi4uON/lhiYkaV4xJmZiEQdF654tUfYSgYXNmjyUEIVbsju/TaE4HWJGpakf55D/JzdwelbROFOdFqJTY1FYCe5ma6GhuQPeWKcY5hb0sL/Z2do07G0ZBdVIi1sNAncQhJIm3ePFLnzDGutdfX015XN6G6XEoGBClzZpO1aDGhERHGnawliwnRJn7MjGQWbryN1Dxn/dbCQmatXkVIWFjAtcl2BzUnjhvEYYmKIj4ri8j4eJ/Pp86dQ0RsrPF3XGoauStWYOvvN645hofpuHKFEIuFm3bswFpYQPEbb3LqnXfcd1adNmTtDy9RcHwEo6AK9JK6uvh9zhcp+3zaIWPaeQD5iQ2QFD2utgQT5iSr1ViBuhoa6G5oBMbeNUZDV0MDXQ0Noz+kKAwPDTGgfbQQi4XmiktUHTtGe309LZWVBovjioz8fLKLCg3C6+/spLWqiv7OznG10RWuu0bGwoVs2LGd6ORkn8/GpadT9MD9E67Lo2bj/yVlZ7Nhxw7mrFsb0JvzbtrAvJs2uF271tbGZ7/9LaHhEcy9cT1hkZHc/P2/JiYlhU9//Wv62ts1BkizVfltli4bjn9XkdDZq8Cgj4BXTW29mH7yHo5fbB13G4IFc1J2tvFH6pw53PHjv2V4aMiNym0DA5S89x6l+/cTl55OyuzZhISHkzZ/HiaNlbLExGAtLAABrdXVfPHaazRdvMjiO+8ke9kyyvZ/woldu9TJdf8W0vLzOfH66xz9/csUPXA/N+3YQe7KFUghZhp3vkh3Y6N3Y8PCmL1mDdnLlxvXZFkmb+1aUvLy3J6VJBPp+U6LqyU6miV3biZ9vrcVdrCnl8ojR6g/e2ZCg9jT3Ex7XT3DAwMIIUjKtpKYnY0QAofdTkdtHZ1Xr7ipeZsrL+EYGZlQfaNh1oqVRCUnERapGtM66uqpO1lMX3sboLNUfvynPOGTbfP1okpoDsXp1asoCor2vj82y60qHyVLb59A/uZqlBtmBdDY4MOc6EIcEXFxRMTFeT00dO0aVceOAZBdVMRN27cTn5np9kxsaiqrt26l4J57OPTii1z4+GNmFhSQt3YtQgiyly+j88oVYlNTyV25EiEE+bfcgt02TErebCzR0SiKQnttLe21tT4bm11URN7aNQb7MmKz0dPcTHx6OnPXrx+1oyEWC9nLisheVuR1r6e5ma4rV6g/c4aBrm6aL12it7XNuB+ZEE/MjBlIJhPDg4Nca2tj6Fqfcb/y86OcfOtteltaSJiZxU07dpCUkwNAc0UFn+58kaojR7DLsn9vZkVGttsNRYgnhC676W7jsvq86+oeGhHhxt4N9fVx9oM9XDx8WC0Dp1/cxOGHYBRAKCgInzt+oCW7vdXdj/SLfThe+/7EmjpJmE1m85QU3NfeTtmBA6Tk5ZG1eDFdDQ1cvXCB5spLpM6bR2xqCnUnTxKXlsqs1asBuHL2LGWffMK19nav8uIzM1l8xx2GtgagvqSExtJSZq1aPen26hOm/OBByg8edLu3/MEHuempHUQlJdFccYlDO1+g+osvjfthkZGsfmwrRVu2YA4LM1ZtgJTZs7n3H/+nOpE1FL/1Fsf++AojQ0PGtYbSMl770Y/8ti9n+XJuemoH2UUqcZ94/XUOvbCTwd5eQBXAb3ziSRbftRkA+/AwZ/bs4fT777toHjXxcSpU6QZ/pNo9hA8PikCLcX1POlSG8m4x8pbl/l6ZMpgBZIeDpooKWiurQEBCRgYpc+diiYpiZGiIxrIyWqurAy7UZDYzb8MG8taswRwaRtfVq/S2tDB3/XpCLGE4RkZoq6khPDaOjIULDEEzJCyM/I0bCYuMovLoUUa0jxoaEcHSu+8if+Otxspp6++n5vhxWquqyFy0iIHubkAV2EPDwzGFhHi1S5ZlRgYHvdiZwd5e7MPDmgFQIjk3F1d2M23+fMzaahwZH4e1sJCwyCi1TIeda61tWKKjDU2S2wCHhRHlIahboqLGpb0bCzNmzWLD9u+xYONGhCQhyzLn9u7l2B9fMRYaY9cIYqCSL6jEp3lE+LSLjZPF6htCev5j5M0FEDo1C7k/mAEkk4ma48c5vPNF7MPDFN53LxsyM7FERdF5+TLHd+2i+kt1paw4fJiGCxcwhYSw6I47uOGhhwiLjKTj8mWK33yTqi++wNbXx4qHH2b5X/2VUVGi1TpmY9Lmzydt/nzsNhs1xScYsdkwh4ZScM/dFG3Z4qYq7Wtvp7elhUtHjnLpiNO2Mnf9ejbs2EHGgnxkWaajrh7JJJFotdLb3MzBF17gzJ49hhetyhE4J4wpJIQlm+9k3bZtPtuYaLWy4XvfM/629ffzxauvun1zRZaRHQ4UTesnJMlLna0rAPNWr6Zwy31+FQA6wqOjiU1LM/5esHEjGQsXosgysSmpxKSmGAuHY3iYmUuX8sA//VStyyFzZvf7nNm9Z1zCcuBwZ7UURY0NMaH54Xk8618Brbg85fxLnK1Hevkz5O/dHJzmBgiDFGNTUohJSaHzyhUsMbGEa6t5b1s7fe3t6AMw2HuNwV7V8JS9bJnBLtiHbHQ1NNJaVa3yvEFYnkxmM0vvuZs13/mOz1XZE2GRkViLikibPw+Ajro6ao6fIHlWLolWK1GJiUQlJakdDw0jPiODEZuNrsYxNGvjxLl9+zj0wk46r1wBICknh5t2bGfRpk3OhzSlUVRiIhn5+V4y3FiITk72S1AhFgtJOTkkaX/LDlVtPF1hA6pqV3MXGpeHsvD5l2JzID2/H/meIkiN9X5tiuBCHKnEpqXS29JCeGysoSrta29zE07HhKLgGB7m3L4PaSwvJywykgUbb2W2JlfUl5RQ9skBdbvXem/SYiD0CO32ujpGBgcxh4WRlJ1NnMuKORpyV6wgb/UqJG2Fbiwro/r4l0QlJaqdDQsjKjGR8Kho0ubPZ/2TT9DV0MDhl17yqR2TZZm+9nZku52opCTMoaHY+vvp7+gkNDKCqMRErcvuE2Dm0qVsevZZbAOqDcISFUWKi11GMLo9YEoQPHvfuOqUAMckixEAta2YfvURjp8+NPl2BQizIssISSI+K5OEzCy6GxuJmTEDUD96b1sbfR0dYxYUEm4hb81qsosK6W1ppaepifDoaEIjIzGHOnluIZkIsVgIj452WygkoQfOKGQsWABA88UKuhsaGejuISJu9BUj0WplwcaNxiQc6uuj6eJFGsvKmbvOqcmKTkwkMSeb2atXYS0sxFpUhCzLHH7pJXqam93KHO7v5/M//IHe1lZufuopknNzuXzmDJ+99Fvy1qxm/ZNPqn3y0EDFZ2QQn5Hhv7GabAPQfOkSx19/nfCYsVfEqKREZi4tIDHbaiwAAG01tdSVnGKgs8v7Jc2Jsv50ybTShuvuIYKQaEMApteOIX9j5bT5XZlL9+8nf+NGYmbMIHlWLsMDAyRlq/LBQHc3fW3tAenjE7KySMhSiau1pob49HSSc3O9npu5dAkzly4ZtSy7zcahnTtprqigq7GBrsYG7LYhRmw2YlJS3C3RQmWnlty1mXkbbjQut9XU0FpTw0BPNwM93cb1mBkprHzkEayFhYbQnpCZSVxKCr3NzYG5PnmGdSjKuFymFEWLOQeaL1XQfKnC77OR8fFkL1vGwttuI2f5cjdVe1dDAyffepsze/Zwrc25u+vWlNH84qYD+mYlaZloJo32a5j+927sf5oe1a654tPDpM2bR6LVSnJuLjHJMwwdfcfly3Rcdvevj4iNJT0/n9yVK5izZg1h0VNr3u+8epXmixe51NqKEILVW90tpubQUArvu4/lDz7o5vLhGBnBMTKCXbOF9Hd2EpmQQFbBUrLAWHk7Ll/m9O7dXD571qvuEIuFhbffzsjQkMHfp8yezbrHH3eTgTx3jrN793Jop4fMsd1V5hBusfiuEEIQlZSEtbCQ/JtvJmf5ciITErza1nH5MlXHjmEftrHwttuM63ppDpuNhtILNF2smHbCcK1NVhTMQlKDx4LQDunPZxHHLqGsnjP2w5OEuaW6itaqKhKtVrKWqCu6rhVqq1ZXXx2hERGs27aNNd9+zG+Bgz09tFy6REd9Pa3V1cSmpTFj1ixCw8MZGRqitaaGbj+uJULz83GMjBi+Ul0NDXzy/PPYbTaWPfCAe+PDwii6/35Wb93qcwLp6GpspKuhgciEBDd2ZLC3l9Pvv+9l19BhCgkha/Fit2sxmuJiNKTn57N+2zbDBhERF0favHkuTyiGutNkNhOfmUnW4sVYCwrIWrKEhMxMn6poVyTOnEniTP/sxWBPD5+++CJNFy+OWs6UQ5Mlxy2b+4NdxvTPe9TdIyJwX7aJwNxZf5nW6mrmbtjgpiod7OmhtbqK3pYW49rwQD99He0MDwy4rdIA/V1dlLz7Lsd37TLeEUKw5tvfJmW2mrSrva6Oz19+2bC2+4KkwMiwjRGNlbPbbD6txqGRkaz61reITk72adV3RVdDA92NjW4GxP6uLr549VWOv/66mzEuGEjOySFZ2339Q8ESHc36732Xld/8ZlDtHl7wFWM2jVDZTkkjkMlXLg6WQb9t6onDPjxMa1U1HZcvu33QK+fPc+XsOTxH8lpbG9fa20mcOdPYroUQ9LW1cfXCBTdiiklJISk729B8pc2bx0P/8i+jNqitpoZPd6ruJ6OpHiVJIiI+HktMDIBBQGYfnrE9jY1u2qiRoSFO7NrFF//1X16EIY+MUH38OPbhYYQQWIuKyC4sdJu8jpER6k6d4vKZM9iHh2muqDC0cYFAF1Ztvb00XbxIV0MjCVm+VbnDAwPUnz5Nc4V/uURHcm4uM5cudVssfI7geEJKJjCXfdGijKKxkk7hfKKhcwIIzX1a/f9GXIpsFBgs2jcDtNbV0lZTYxCHw26n4cIFmi6We73QePEiB//zP+ltacFaVMSarVsNm4gnknNyDPllvNAtrP46OnTtGlfPnyfRaiU9P5+ze/cimc0U3HOP17N22zAdly/T09xMbGoqIRYLsSkphMfGehOHLFNz/Dg1x4+TsWAB6fn5Xqu6KSQEIQQ1J05QX1KCJTrajTgufPwxR373O7quXgVUTdq6xx8n/9Zb1b6pHURB4crZs1w5d5aErEwGe3qoLS7GPjJCzvLlRCclYevvp+zAAU69886YY7Zg40YSZ840iCMokyTQmTtKZYbmSgiEkLTw48nDSCmkRW16Ettk+28GSJ83z81b1WQ2k5yTQ3xWlpcToKtjYJoPD1cdIRYLMwsKvLxgFVnm6oULNJSWGhbkhMxMMhctIjIhwUg7KQBFaGpAP3XUnjpFV0MD7XV1HHv1VRbdfrvXM7rWprmiguaKCiN2JeeGG8gtKeHMnj0+y7ZER5N/yy3k3nCD23U91iXnhhvoaWmht6XFkC10xGdmkn/LLYZLS2R8vF/VbueVq5zZvZuaL49TU3yCnuZmlt59N1kaCxiVlMSdzz3H7U8/7WcUnDCFhBgBZ9OOAIhIl7OMuPXJBCC6qMP9BVVMlkjMuatWsuzBB4lLT3e7MWf9elqrq/n8D380fJzGaK7LD6wFhcxaudL4WK6uFKGWcOpOnqL84EFiU1O58btPYomJQVEUrp47x9Xz5zV15OgepPYhG1/812sAWrio6xfS3KU1TVJbdQ2N5eXMWrUKc2go8RkZ5N5wA3WnSrwMgKaQEJbedRdL77kHc1gYdtuwOlhhobRVVSM77KTMncuSzZuRJBPHd+1yez8jP5+M/PyAxkpBofZEMQCyIuM5y4QQhISFjSuQyruurxqK9j21r6p77RpNG28bndlsnLH+/jE+zy4nzBu2b/fSyICqsVq0aRNttXWU7t8/jiJV7Uze2rVkLFwIqP5Hp955B1NICEVb7idlTh63/uD7pOfnk5ClrrKSycTV8+cpPXBAM8YJ1XI+RnSZvmp7u4IrzsAe1M/TcKGUq+fPG56ts1evprG8nOI33sShucGEWCwse+B+1nz720QnJdHd2Mi19nbi0zOICkvENjhAc0UFQpJInTuXxZvvJDIxYVICtdNY5r0YOEZG6G5spLdtdC8FAUQmJBCXnj7hCMypgnD5BobXruIrgsM/VGd41/L0PGiAGM1fy7Mtenlj12ieucRpkKs7dYrhgQGyi4oIjYggOTeXNY9tZXhwgMqjn3u9bjKbDZWj3nHVcW8zi++8w1Cb1p06xbl9++jv7MIUEkLhffeRlJ3N+ieczn3ttXV8+dqfqDr2Bc4J7TGwAXRIR1hEBNaCpWQvKyJn+XKEyUTxG29SW3ySzIWLMIeFEpWYSNGWLfS2tFJ24ACW6GhWPPwwq771TYNvry85zbUOlTh0XDl7DkVRjACra62tNJZfpK+tnYwFCwgJt9BYVkZfhxqdmJybw4xZs2irVWW7K+fOubmwqwyzMBwhXTHQ3c3RP/xxFJlDfUESggUbb2PDju0+ja/XB4Qe9uHm9DkWvG1B+o2J82Vjk6Zw+lY1lpXz+R9foeNyPTdt38GiTSr/nrloEeu3bcMxMkLN8RMkZWdjLSwgde5ccpcvN1S6jpERZFlm/s03s+yB+41Y6K6GBsoPHaKvo5PknByEEAz29rrFSiuyTFdDAw77CLEpKfS2tCDLsmpJdsaw+uxCeEwMiVYrCZmZpLuwMrqHr46mixex9fdTefQomQsXkrd2DQApeXmse2IbDrudga5OrAVObU9bbS0Vn31GuKYR09HX0UHZ/k9ImT0byWTi3If76GltIW3uXGJSU5AkE91NzRz9/e9JtFq56akdRMTFkZCZSX3JaRrLy1UXeRe49tV1FbTExFBw7z1jehUI1BDeaM3153qGfmSDIUyPA8auEQTX+7EIxAzQdfUqx19/nUtHjqDIMmUHPiElbzYzZqnhialz55I+bz51J08RYrEwd/2Nbq4aoE7wRZtuJ3PhIje1ZHRSMpv/7u8wh4b6jYITkkTe2jXkrV2DoiiMDA5y5oMPOPryy/Q0NWl5kXy/mzZ/Hjdt3461sHDUgXDY7ch2Ow2lpZQdPMCM2bMM4TzJaiUlbzbHXn2V0k8OMGPWLMxhYZS89x4XD39Kwd3eGrC6khKK33yTjIULKbj3HmavXu2mQp2zbi3djQ3EZ2QabYtOTmb9E9so2nIfZz/8kOI33qTjcr06fuhRdO71hISFMXPJElx3+K87dGFcCJ2VDBzBzpw5GoGY22vr+Ox3v+XCRx8bQnPFZ58Rm5LKum2PE5mQQMXhw5QfOoTscNBWU0PzpUvMWbcWyWQyCmqrraWnqRlrQQGgrg7lBw/iGB5h/s03u3VKlmWaL1ZQffxLEjKzyFuz2tiBhBD0d3Zy9fx5uhubADUW2d+g9DS30ONiW/GE7oBY9skBWqqqtHYdIjknhxUPP4xkNlO6fz/n9n6IfchG+cGDJGRlosgKp9973xDGPaHIMuf//BHt9Ze5ecd2N8K4euECh3/zEpVHjhCVnIx9ZJiiLVuMHSg0MhL7kE1LCuHkgmVFRuI6SwY3RdDlcT1Ztwo/i6fxr5PFDqYd00/gL+bdP/mJV4Iyu22YU+++S1hUFLNWrqDswEHDx8o+PEzzpQraa2uZMXu2yqp8/jkn33qLxrJyupuauPHJJ2itqeGz3/4Wc2gYEQnxzFqxgv6uLupLSjj7wV5qTpzA1t+PyWwma8kSlj34ALNWriQ8NpaLhz9zCWASTpbDB3o1dSqoBNnf2UlrdTUNFy5QW3ySxrIyBnp63N4Z6O7m1LvvEZOSQmR8PGf27KG7qcm49+nOFwEC0tI1lZdz4s03iUxIID4jg9N79lD8xptG9pXelhYO/Op5ak+cYN22bcwsKKDsk084vXs3Q319LiU5tS+uPR3o6eHc3g+55JUsT1U46MMiK5BdWMiSuzYbO+L1C2df/SkivN8QSJIYOxtrEFsoQkc5giAyIYEQi4X+zk43Y1lYZCQRcXHYh4cZ6O5289qVJIkZeXkoskxLZSWSyURKXh7m0FBaqqoYHhjw26DIhASSsrPp7+z0yEOlIAmJ7KIicleuwBQSSn9XF9VffknTxYukzMkjZsYM2mpq6GtrQ3E4nImOR0FKXh4IaK2sGpX3tRYUkLdmDWFRkXRdbeDS50dpr3W2T0gSiVbVz6mjrt5vWZHx8aTNn09/VxdN5d4GVr2vWYsWk7d2DeGxsQz19VF55KgPx0h1TITmkqEoqgfCnLVriUpKZGRoiMqjn1N78uSoY/DVQtHSpjKGDKH3VahHr02T+8uoxHH9QF8l1RVntFOWXPXfX4OO+YDaV0n4OmXJib+ovmo7wvXW1+vhRMuAoA+JGEX+0HmMYPOk0w29/f/f9FUXzv2JWl/RIvA1IQ6n+g7N/dlzHIWLCvTrduyYO1z76nZJ67TiYtr8y+qrEN7GPJ1ovooo3+nNdRIEuK4yrtZO52T5Ws8WN6iKCFAUlynjsrz+pfVVaKue23fVMjR+FauA+WulNVRcnNck7WwJ/QYYR5D9pUAlDsmd3dC1U1+zcwfHgqql8/yuKr6qrnqxVdlWKzt/9Star1zhSmUllRcu8Porr7BuzZqvon1e0HlwD/c8ryvTBjHJ32hFj2LwmtZj5Kawj0YVQvh9XO/qlPdY98bQfl5slSRJhIaGEhsTA5rRqrGpibCAvEIn3/y7N9/J1ke+SXx8PCaTCZNJQpIkTCYTZsmEOcSsXpfU65LJZNzXr5u0vLI1tbX863/8B+/u3j3pdo0XAY+E54OK87Lkyjt6viYwQk+VKZw1QSl6rEVAwf1IPI/nVU2lYhgOwbPPwRkAz1LMniKQJCQvg5vD7kB2yHiLS6MXPl4oAtLT0li14gZmBMFHKDYmBkuYZcx2jxfBLM1zYut/SgHtLMaBY1OKYHxX3+WqN3wpWDwhCQnZhd+auvXAKfGYPQnBJElGEIkOh6ymtvRnpQ4mHHYHjjEP5QwMZrOZELN5WtodPIwveNSXhucvFdPbU4HZ8xQnXzmYHHYHw5rX7VRCEQK7w47DMXaOvJGREXp7e+nr7ycmOpp4HycitbW309bePuXtnhT8sFUyjEHUqk9SUPJBjYVJz8nRC3Bqpfy/r6D11VU1OcUwew2tD8OT3WHHbrdrgSVT2RyFkyUl/ORnP8NsMtHX36/++vro7++nv6+fgYEBenp7GOjvJzUlhae2b+c7j7mnChocHOS93bv5t1/+kgulpV+ZrD4RuKqkNf2NW/OdZjDFSJ86cZnj+hgYWddUGVfc26V6CuCmivTnpR1MeAnkerIxV9jtLqu5KzXph5U7AAAK/0lEQVRNQfsulJaqE9oH9CAZkySxds1qnvvbH3Pj+nVuuaguVVbyH7/8P7z19ttcG+j3WY4/XB9TxQlFVnX/7kOutlJ2ybYxtZLg9EBWFEzCt6Ala8Zf11vT0SufRkDPncPhcGB32L0fHB97HBTExsbwnUe38t+e2sHMrCzj+pDNpu4WP/855/0Qlz9cV9PHpTHuzhJOWw7Cl03suurF+KHltlLZencqcD0ubjrhe+fwZKvsjtHlgGlq+5LFi/jxM89wz113EeqSZaOyqopfPv9/2fXmm1xzcwMfHdf1dFIAbddQZNlJKIquNBHan1/NxAk2hJBU9kmW3YhDSBKTP6ptYgiQOOzY7WMIyVO4i0SEh/Pg/ffz7A9/yLy5c43rQ0ND7N67l3/7+c85d/4CkiS5uR6MhevRxuw6fCYhqe7orneEmtLfZKS38ebPr3d4ThEhQEgCWXYesmlAi/mQHa7S1vQgIOJwyGPsHK4I8kI2e9YsfvSDH/DIQw8R5XLWXnVNDb98/nn+9MYb9F67ptWtaJFlekO+bnAOnG4U8+k/pSgogq9sRQ02hJAM1yBPqBniVbcSZZr9SLx8qySTpKVYdMJutzNiH5nW3Ts8PJzNmzbxt08/TYFL/LTNZuPAoUO8/8EHhIeH87/+4R9ISkoiUUsS3d3dTV1dPSdPn+aL419y1SNp9fXHgPhu0Vgnshp+V7hPquuvf2NjrImvRgxKCCF7RUpOJbx3DnwL5AHvHEHA4oULeeaHP+Teu+8mwiW5NYBDltlw443c6XqEmB90dXez76OPeOHXv6b41KnrzL/b/yd2BnV5J3nToap6ldESs1zHcPLger6v0ew1ihYbG4xMieOBH1WuO9xUuRNAdFQUQgiu9fWNuhomJSby2KOPsuPJJ7H6Sa/vSSyjIT4ujm9+4xtsWLeOn//qV/zu5ZfpHyVMd+rhnyB09kgSahSgYywNjRCqoZAgHg4zTdBbKgm17Q5ZVrVS2nVPr1wAhyKr/nSKMOw7U42A4jkcsox9EsSx+Y47uHvzZna99Ra7P/jA635ISAgb1q/nvz/zDGtWrcLkktXEZ3scDtrb26mqqaH+8mWGh4dJSkzEarVinTmTGI8DddLT03nu2WcB2Pmb3xjHG0wfAmcEDHbKz2Q3SEZBnUWKU1D/eokfAklX3QYCl3AFpmn38LlzSB6pLR12u5Euc7zISE9nw/r1PLhlC7k5OciyzAcffmjcn5Wbyw+eeoqHH3qIeD/nbDgcDi5VVvLBvn38+eOPuVBaRk9vr89s3Rnp6dx/7708/thjLHBJ8paUlMQD991HWXk5Bw4dmlBfxofxc8aqDCGQxzgQ2ZVAFJzpNb9OwrkkqW7hiuwg0LEyYnmmSRExDlXu+InDbDZz3z33cNcddwBQuHQp/+PHP8bhcLDvo48AleXKysz0SRhtbW3s2fshL7/yCufOn2fIZhtzSBoaG3n+hZ2cKC7m75/7OzbdttG4t3TJEpYVFnLo8OEp9reamMg4Ho2MG9Ol2c2+Lko64blrjKPNqpw1RbKHx2cze9on/BHHRGSOW2++mUceeohkl/OylxUWsum22zhZcpq2tjbOnDvPSy//gdTUVJZpmQHb2tp4+/33+c1LL3Gx4hIO2R+X6UdYBU6cPMX7e3azIH8+WdoZ3xaLhbS0NOLjE+gI4ITc6YRJSAhFO5Z4lI/uy09R11wF6+SkoKuDPJqkq6mdjoRulpxRi1E0NxNJSJrsMXWrgdmVEHSq9CQOWZbHTRx5s2fzyEMPsVzLaK6j+NQp9n30MW0uWcM/2r+ftNQU4uPiKCu/yL/+/OcUnzyppqfRWKeJsNTdPT1c020gGsJCw7BMOJ3/FEG47BoTmdxCJxA9GYGbh17AZUwZPOaTJCTnzi3G/2WdWenHenNynTLYKiftehcYERFBREQkA4OBnZ03Y8YMnvzO49x7191u17u6u3n7vfc4+OmnbtdlWeaNt95m30cfM9DfT++1ay55isbTHXekp6WT5pH9r7unhx6PDIgTRpAmlFvGcR9HKQQGPdeuZgTVB85nG6fbGuJkT/R8XO5uL+Ntj6qIcI7b1MBL5hiyDTHocRRYdHQ00dHRtAfAiqSkpPDs3/wN331iG+Hh7udEfPDhPt59fzfDw975Z/v6++nv17xoha61mZhcIIClixdz0403usV52Gw2urq66Osfn7eu70qCM8F0u5J/WSOQenTeXdFCDnzJH1+1eVDLSyWEkZN5MmWpC4mmOJoiNbYZ1MAafegGBgYZGBh0eyhv9mzm5OVR65ai0xtFBQU89+yz3LnpdkI8jgo+9uWXvLZrF3X19X7f17to0txO5QmuCgvy5/PMj37oJowDnC8t5VxZqZs7ki+d+qiYJFF4VmfSZrKq7phorJs6WRQUza1fjXdQhDKJMoMH3aYt6d8VmAyxymqhmITKSjpQ3OgjWP01S1qUvl52a2srra2tbg8VLl3KnZtu5+z58zQ3N3sVkpuTw7ce/gaPPvII2Var1/3zpaX84vnnvdgpXzBpaXfsjvGvLhnp6Tz04ANse+wx5mgHy+hwOBycKC6m+OQpP28HCINdmfwnMKHuGiNB0ZypvLuMggkJkwCHzqoZ9786mDTj5ogsB60lDlnBLKkngHkSSDBgNrZ1reSBwUFqamtpbm4mVePXzWYz3338cZYsWsSHf/6I2ro6wsMtZFutLC8qoqiwkMSEBJ8VnLtwgZ/+7J/Zs/dDn/ddkZWZyY++/9fcuG4dldXVVFVXU1dXT2t7G93d3XR1d9PT08uI3U58XBzZViu5OTnMzs1h4YKFLFq4wK+t5OMDB/jTG2/Q2RkkLZVn3MEEIEnjMIIFBJVAnIfDuHIcvuqZPoKZKiu+gqaIcFsIggOzrH1jV8n/eHExXxYXc9/dToHaZDKxasUKVq1YEXDhh48c4Sc/+xmf+TgyzReam5ro6OxkTl4ei7TzBCcLRVE4fOQI//6LX3Cq5DR6vo6gDOQkCMSEOt72oE8Y1b1CKALdgd9/X12vTx2hmLQxckwBcTi0aEkJgq7YNetRVuopO+owlpaVsXffPgqWLPHr4zQa2js6+MMrr/Kfv/61l1esKzx1FbKiUFlVTW1dnVvcxkTR1d3Nn3bt4vkXdlJTWwva1i4gADVggHBjdseeYJJeq5CMI6WDCaH9rx5RZ1jSx6zIczQm3zL99Fg0X7Fg9dWzHFmRtfmrS1/BqUnTVimaSV77S1F48+13CA0J5cfPPO1TjvCFru5uPtq/n52/eYkTJ0+Oyzaiq26rq6uprqmdFHE0NTWz+8O9/P4Pf+Ts+fNO7YgeBzFVFtYACcXtmOApWrF1VanuSDr+nTIYxKLbzJQpzevrekpUMD+rCIuJVcDpjeua5l0BlixaxHe2PsqdmzaRmZGB2eyu/W1rb+dUSQmfHDrER/s/obJq9INg3CrX/lXdbNSVNCoyiscefZRvPfIwKTNmkJiQgGWUo4NHRkZobmmhtKyM02fP8ulnRyg5fdoZAOVZn0A7MEVxWminGi6EIoF2CItx0MAUVaqWLblMzqnpqv/2S9pCJMtT3Ve15LHO+Rh3mU7iwNg99MntWUVUZCQZGRnExsRwra+P9o4Oenp6fNotAqpc+9ekCaaenVJQZZ3IiAiio6OxWCxYLGGEmEMYHhmmo7OL7u5ubAEcT+Zan9DYK/VEpGl0RhLCCG919nUqiUP3Y1LZrOly9TbqNSbr6Gf+BQe6h4BOjJPH/wPTKh9HvjiKEQAAAABJRU5ErkJggg==")
    }

      
      
      var shiro = FindImageInRegion(
        
        shiroImg,
        1367 + xoff,
        211,
        247,
        572,0.8
      );
      

    
    if (!shiro) {
      log("not found shiro and refresh");
    } else {
      shiroImg = undefined;
      click(shiro.x, shiro.y);
      shiro = null;
      log("open shiro");
      sleep(1500);

      battle();
      if (sellflag) {
        sellflag = false;
        continue start;
      }
      continue shiro;
    }
      //刷新按钮颜色
      while (true) {

            
        var refresh = DetectsColor(
            "#55bbcc",
            2037 + xoff,
            249
        );
        
    if (!refresh) {
        log("not  found refresh and wait");
    } else {
        click(2037 + xoff,249); //refresh button
        refresh = null;
        log("has found refresh");
        break;
    }
    sleep(1500); //正常速度为1500ms
}
//灰色刷新按钮
while (true) {
        var grefresh = DetectsColor(
            "#666666",
            2037 + xoff,
            249
        );
        

    if (!grefresh) {
        log("not  found grefresh and wait");
    } else {
        grefresh = null;
        log("has found grefresh");
        break;
    }
    sleep(30);
}
  }
}

function battle() {
  re: while (true) {
    //

      
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
            if (recoverflag) {
              log(empty);
              empty = null;
              click(1639 + xoff, 592); // click(1624,439) 石头
              click(1639 + xoff, 592); // click(1624,439) 石头

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
                sleep(199);
              }

              click(1759 + xoff, 530);
              sleep(700);
              log("clicked max");

              click(1442 + xoff, 838);
              log("clicked recover");

              // sleep(1000);

              //重新进入循环
              loopflag.setAndNotify("re"); //吃药成功发送battle事件
              log("吃药线程结束1");
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
        log("吃药线程结束2");
      });

      if (loopflag.blockedGet() == "re") {
        while (true) {

            
            var simple = FindColorInRegion(
              
              "#ffffcc",
              1805 + xoff,
              238,
              10,
              6
            );
            
          if (simple) {
            simple = null;
            click(1873 + xoff, 997);
            log("吃药成功，再次开始");
            sleep(400);
            break;
          }
          sleep(500);
        }
      }

      var stuckorlose = false; //触发lose 或者stuck 关闭 退出奖励页面和0贡献的点击

   
      if(stuckorloseflag){
        var stuckthread = threads.start(function () {
          sleep(14999);
          log("卡死检测开始");
          while (true) {

              
              var bosshpimg = Clip(1173+xoff, 42, 157, 22);
              
            if(bosshpimg){
              log("boss hp clipped down")
              log("waitting....")
              sleep(30999)

                
              if(FindImageInRegion(bosshpimg,1173+xoff,42,157,22,0.9)){
                  bosshpimg = undefined
                  losethread.interrupt()
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
                              
                              stuckthread.interrupt()
                      }else{
                          sleep(297);
                      }
                      
                  }
              }
              
              }else{
                continue;
              }
            log("not stuck");
  
            sleep(3197);
          }
        });
  
        var losethread = threads.start(function () {
          sleep(20009);
          while (true) {

              
              var lose = FindMultiColors( "#ffffff", [
                  [306, -2, "#ffffff"],
                  [479, 5, "#ffffff"],
                  [-425, -185, "#88dddd"],
                  [963, -185, "#88dddd"],
              ],{region:[934+xoff,424,60,35],threshold:15});
              
            if (lose) {
              lose = null;
              stuckorlose = true;
              stuckthread.interrupt();
              log("关闭卡死检测");
              log("已团灭");
              sleep(500);
              while (!click(767 + xoff, 734)); //撤退
              while (!click(767 + xoff, 734)); //撤退
              log("团灭返回界面");
              sleep(500);
              stuckorlose = false;
              losethread.interrupt();
            } else {
              log("未团灭");
            }
            sleep(8307);
          }
        });
      }


      while (true) {

          
          var esc = FindMultiColors( "#ffffff", [
            [-68, 96, "#598ad9"],
            [-42, 135, "#60c160"],
          ],{threshold:25});

          

        if (!esc) {
          log("not found esc");
          click(1873 + xoff, 997);
        } else {
          log(esc);
          //调节人物行动状态
          esc = null;
          log("found esc");
     
          break;
        }
        sleep(1000);
      }

      sleep(1000);
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
          if (guildflag) {

              
              var full = FindMultiColors( "#ffffff", [
                [-174, 24, "#ff6840"],
                [208, 17, "#ff6840"],
                [-449, -160, "#ff5533"],
                [454, -154, "#ff5533"],
                [-681, -534, "#88dddd"],
                [706, -536, "#88dddd"],
              ]);

              
            if (full) {
                if(stuckorloseflag){ 
                    if(stuckthread){stuckthread.interrupt();}
                    if(losethread){losethread.interrupt();}}
              click(full.x, full.y);
              sleep(2500);
              click(2043 + xoff, 68);
              sleep(2500); //back home
                while (!sell()){
                  sleep(2000)
                }; 


              sellflag = true;
              return;
            } else {
              log("not full");
            }
          }


            
            var refresh = FindColorInRegion(
              
              "#55bbcc",
              2036 + xoff,
              248,
              5,
              5,2
            );
            
          if (!refresh) {
            log("not found refresh");
            if (!stuckorlose) {
              // click(837,762)//团灭退出
              // sleep(500)
              // click(1830,220);//工会战0贡献退出
              // sleep(500);
              press(2103 + xoff, 865,1); //退出奖励页面
            }
          } else {
            
            refresh = null;
            //定时重启助手(在退出战斗时判断便于重启后再运行脚本)
            if(restartflag){
              threads.start(function(){
              //重启助手
              if(new Date()-starttime>restarttime){
                  restart(context);
              }
            })
            }
            //  click(refresh.x, refresh.y);
            //  log("click refresh");
            // sleep(1500);
            break re;
          }
        } else {
          log("raid未结束");
          sleep(1001);
        }
        sleep(700)
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
