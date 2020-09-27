
const PJYSDK = (function(){
  function PJYSDK(app_key, app_secret){
      http.__okhttp__.setMaxRetries(0);
      http.__okhttp__.setTimeout(10*1000);

      this.event = events.emitter();

      this.debug = true;
      this._lib_version = "v1.08";
      this._protocol = "https";
      this._host = "api.paojiaoyun.com";
      this._device_id = this.getDeviceID();
      this._retry_count = 4;
      
      this._app_key = app_key;
      this._app_secret = app_secret;
      
      this._card = null;
      this._username = null;
      this._password = null;
      this._token = null;
      
      this.is_trial = false;  
      this.login_result = {
          "card_type": "",
          "expires": "",
          "expires_ts": 0,
          "config": "",
      };

      this._auto_heartbeat = true;  
      this._heartbeat_gap = 60 * 1000; 
      this._heartbeat_task = null;
      this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};

      this._prev_nonce = null;
  }
  PJYSDK.prototype.SetCard = function(card) {
      this._card = card.trim();
  }
  PJYSDK.prototype.SetUser = function(username, password) {
      this._username = username.trim();
      this._password = password;
  }
  PJYSDK.prototype.getDeviceID = function() {
      let id = device.serial;
      if (id == null || id == "" || id == "unknown") {
          id = device.getAndroidId();
      }
      if (id == null || id == "" || id == "unknown") {
          id = device.getIMEI();
      }
      return id;
  }
  PJYSDK.prototype.MD5 = function(str) {
      try {
          let digest = java.security.MessageDigest.getInstance("md5");
          let result = digest.digest(new java.lang.String(str).getBytes("UTF-8"));
          let buffer = new java.lang.StringBuffer();
          for (let index = 0; index < result.length; index++) {
              let b = result[index];
              let number = b & 0xff;
              let str = java.lang.Integer.toHexString(number);
              if (str.length == 1) {
                  buffer.append("0");
              }
              buffer.append(str);
          }
          return buffer.toString();
      } catch (error) {
          alert(error);
          return "";
      }
  }
  PJYSDK.prototype.getTimestamp = function() {
      try {
          let res = http.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp");
          let data = res.body.json();
          return Math.floor(data["data"]["t"]/1000);
      } catch (error) {
          return Math.floor(new Date().getTime()/1000);
      }
  }
  PJYSDK.prototype.genNonce = function() {
      const ascii_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let tmp = '';
      for(let i = 0; i < 20; i++) {
          tmp += ascii_str.charAt(Math.round(Math.random()*ascii_str.length));
      }
      return this.MD5(this.getDeviceID() + tmp);
  }
  PJYSDK.prototype.joinParams = function(params) {
      let ps = [];
      for (let k in params) {
          ps.push(k + "=" + params[k])
      }
      ps.sort()
      return ps.join("&")
  }
  PJYSDK.prototype.CheckRespSign = function(resp) {
      if (resp.code != 0 && resp.nonce === "" && resp.sign === "") {
          return resp
      }

      let ps = "";
      if (resp["result"]) {
          ps = this.joinParams(resp["result"]);
      }

      let s = resp["code"] + resp["message"] + ps + resp["nonce"] + this._app_secret;
      let sign = this.MD5(s);
      if (sign === resp["sign"]) {
          if (this._prev_nonce === null) {
              this._prev_nonce = resp["nonce"];
              return {"code":0, "message":"OK"};
          } else {
              if (resp["nonce"] > this._prev_nonce) {
                  this._prev_nonce = resp["nonce"];
                  return {"code": 0, "message": "OK"};
              } else {
                  return {"code": -98, "message": "轻点，疼~"};
              }
          }
      }
      return {"code": -99, "message": "轻点，疼~"};
  }
  PJYSDK.prototype.retry_fib = function(num) {
      if (num > 9) {
          return 34
      }
      let a = 0;
      let b = 1;
      for (i = 0; i < num; i++) {
          let tmp = a + b;
          a = b
          b = tmp
      }
      return a
  }
  PJYSDK.prototype._debug = function(path, params, result) {
      if (this.debug) {
          log("\n" + path, "\nparams:", params, "\nresult:", result);
      }
  }
  PJYSDK.prototype.Request = function(method, path, params) {
      
      params["app_key"] = this._app_key;

      method = method.toUpperCase();
      let url = this._protocol + "://" + this._host + path
      let max_retries = this._retry_count;
      let retries_count = 0;

      let data = {"code": -1, "message": "连接服务器失败"};
      do {
          retries_count++;
          let sec = this.retry_fib(retries_count);

          delete params["sign"]
          params["nonce"] = this.genNonce();
          params["timestamp"] = this.getTimestamp();
          let ps = this.joinParams(params);
          let s = method + this._host + path + ps + this._app_secret;
          let sign = this.MD5(s);
          params["sign"] = sign;

          let resp, body;
          try {    
              if (method === "GET") {
                  resp = http.get(url + "?" + ps + "&sign=" + sign);
              } else {  
                  resp = http.post(url, params);
              }
              body = resp.body.string();
              data = JSON.parse(body);
              this._debug(method+'-'+path+':', params, data);
              
              let crs = this.CheckRespSign(data);
              if (crs.code !== 0) {
                  return crs;
              } else {
                  return data;
              }
          } catch (error) {
              log("[*] request error: ", error, sec + "s后重试");
              this._debug(method+'-'+path+':', params, body)
              sleep(sec*1000);
          }
      } while (retries_count < max_retries);

      return data;
  }
  /* 通用 */
  PJYSDK.prototype.GetHeartbeatResult = function() {
      return this._heartbeat_ret;
  }
  PJYSDK.prototype.GetTimeRemaining = function() {
      let g = this.login_result.expires_ts - this.getTimestamp();
      if (g < 0) {
          return 0;
      } 
      return g;
  }
  /* 卡密相关 */
  PJYSDK.prototype.CardLogin = function() {  
      if (!this._card) {
          return {"code": -4, "message": "请先设置卡密"};
      }
      let method = "POST";
      let path = "/v1/card/login";
      let data = {"card": this._card, "device_id": this._device_id};
      let ret = this.Request(method, path, data);
      if (ret.code == 0) {
          this._token = ret.result.token;
          this.login_result = ret.result;
          if (this._auto_heartbeat) {
              this._startCardHeartheat();
          }
      }
      return ret;
  }
  PJYSDK.prototype.CardHeartbeat = function() {  
      if (!this._token) {
          return {"code": -2, "message": "请在卡密登录成功后调用"};
      }
      let method = "POST";
      let path = "/v1/card/heartbeat";
      let data = {"card": this._card, "token": this._token};
      let ret = this.Request(method, path, data);
      if (ret.code == 0) {
          this.login_result.expires = ret.result.expires;
          this.login_result.expires_ts = ret.result.expires_ts;
      }
      return ret;
  }
  PJYSDK.prototype._startCardHeartheat = function() {  
      if (this._heartbeat_task) {
          this._heartbeat_task.interrupt();
          this._heartbeat_task = null;
      }
      this._heartbeat_task = threads.start(function(){
          setInterval(function(){}, 10000);
      });
      this._heartbeat_ret = this.CardHeartbeat();
      
      this._heartbeat_task.setInterval((self) => {
          self._heartbeat_ret = self.CardHeartbeat();
          if (self._heartbeat_ret.code != 0) {
              self.event.emit("heartbeat_failed", self._heartbeat_ret);
          }
      }, this._heartbeat_gap, this);

      this._heartbeat_task.setInterval((self) => {
          if (self.GetTimeRemaining() == 0) {
              self.event.emit("heartbeat_failed", {"code": 10210, "message": "卡密已过期！"});
          }
      }, 1000, this);
  }
  PJYSDK.prototype.CardLogout = function() {  
      this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};
      if (this._heartbeat_task) { 
          this._heartbeat_task.interrupt();
          this._heartbeat_task = null;
      }
      if (!this._token) {
          return {"code": 0, "message": "OK"};
      }
      let method = "POST";
      let path = "/v1/card/logout";
      let data = {"card": this._card, "token": this._token};
      let ret = this.Request(method, path, data);
      
      this._token = null;
      this.login_result = {
          "card_type": "",
          "expires": "",
          "expires_ts": 0,
          "config": "",
      };
      return ret;
  }
  PJYSDK.prototype.CardUnbindDevice = function() { 
      if (!this._token) {
          return {"code": -2, "message": "请在卡密登录成功后调用"};
      }
      let method = "POST";
      let path = "/v1/card/unbind_device";
      let data = {"card": this._card, "device_id": this._device_id, "token": this._token};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.SetCardUnbindPassword = function(password) { 
      if (!this._token) {
          return {"code": -2, "message": "请在卡密登录成功后调用"};
      }
      let method = "POST";
      let path = "/v1/card/unbind_password";
      let data = {"card": this._card, "password": password, "token": this._token};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.CardUnbindDeviceByPassword = function(password) { 
      let method = "POST";
      let path = "/v1/card/unbind_device/by_password";
      let data = {"card": this._card, "password": password};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.CardRecharge = function(card, use_card) { 
      let method = "POST";
      let path = "/v1/card/recharge";
      let data = {"card": card, "use_card": use_card};
      return this.Request(method, path, data);
  }
  /* 用户相关 */
  PJYSDK.prototype.UserRegister = function(username, password, card) {  
      let method = "POST";
      let path = "/v1/user/register";
      let data = {"username": username, "password": password, "card": card, "device_id": this._device_id};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.UserLogin = function() {  
      if (!this._username || !this._password) {
          return {"code": -4, "message": "请先设置用户账号密码"};
      }
      let method = "POST";
      let path = "/v1/user/login";
      let data = {"username": this._username, "password": this._password, "device_id": this._device_id};
      let ret = this.Request(method, path, data);
      if (ret.code == 0) {
          this._token = ret.result.token;
          this.login_result = ret.result;
          if (this._auto_heartbeat) {
              this._startUserHeartheat();
          }
      }
      return ret;
  }
  PJYSDK.prototype.UserHeartbeat = function() {  
      if (!this._token) {
          return {"code": -2, "message": "请在用户登录成功后调用"};
      }
      let method = "POST";
      let path = "/v1/user/heartbeat";
      let data = {"username": this._username, "token": this._token};
      let ret = this.Request(method, path, data);
      if (ret.code == 0) {
          this.login_result.expires = ret.result.expires;
          this.login_result.expires_ts = ret.result.expires_ts;
      }
      return ret;
  }
  PJYSDK.prototype._startUserHeartheat = function() {  
      if (this._heartbeat_task) {
          this._heartbeat_task.interrupt();
          this._heartbeat_task = null;
      }
      this._heartbeat_task = threads.start(function(){
          setInterval(function(){}, 10000);
      });
      this._heartbeat_ret = this.UserHeartbeat();

      this._heartbeat_task.setInterval((self) => {
          self._heartbeat_ret = self.UserHeartbeat();
          if (self._heartbeat_ret.code != 0) {
              self.event.emit("heartbeat_failed", self._heartbeat_ret);
          }
      }, this._heartbeat_gap, this);

      this._heartbeat_task.setInterval((self) => {
          if (self.GetTimeRemaining() == 0) {
              self.event.emit("heartbeat_failed", {"code": 10250, "message": "用户已到期！"});
          }
      }, 1000, this);
  }
  PJYSDK.prototype.UserLogout = function() {  
      this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};
      if (this._heartbeat_task) { 
          this._heartbeat_task.interrupt();
          this._heartbeat_task = null;
      }
      if (!this._token) {
          return {"code": 0, "message": "OK"};
      }
      let method = "POST";
      let path = "/v1/user/logout";
      let data = {"username": this._username, "token": this._token};
      let ret = this.Request(method, path, data);
      
      this._token = null;
      this.login_result = {
          "card_type": "",
          "expires": "",
          "expires_ts": 0,
          "config": "",
      };
      return ret;
  }
  PJYSDK.prototype.UserChangePassword = function(username, password, new_password) {  
      let method = "POST";
      let path = "/v1/user/password";
      let data = {"username": username, "password": password, "new_password": new_password};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.UserRecharge = function(username, card) { 
      let method = "POST";
      let path = "/v1/user/recharge";
      let data = {"username": username, "card": card};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.UserUnbindDevice = function() { 
      if (!this._token) {
          return {"code": -2, "message": "请在用户登录成功后调用"};
      }
      let method = "POST";
      let path = "/v1/user/unbind_device";
      let data = {"username": this._username, "device_id": this._device_id, "token": this._token};
      return this.Request(method, path, data);
  }
  /* 配置相关 */
  PJYSDK.prototype.GetCardConfig = function() { 
      let method = "GET";
      let path = "/v1/card/config";
      let data = {"card": this._card};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.UpdateCardConfig = function(config) { 
      let method = "POST";
      let path = "/v1/card/config";
      let data = {"card": this._card, "config": config};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.GetUserConfig = function() { 
      let method = "GET";
      let path = "/v1/user/config";
      let data = {"user": this._username};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.UpdateUserConfig = function(config) { 
      let method = "POST";
      let path = "/v1/user/config";
      let data = {"username": this._username, "config": config};
      return this.Request(method, path, data);
  }
  /* 软件相关 */
  PJYSDK.prototype.GetSoftwareConfig = function() { 
      let method = "GET";
      let path = "/v1/software/config";
      return this.Request(method, path, {});
  }
  PJYSDK.prototype.GetSoftwareNotice = function() { 
      let method = "GET";
      let path = "/v1/software/notice";
      return this.Request(method, path, {});
  }
  PJYSDK.prototype.GetSoftwareLatestVersion = function(current_ver) { 
      let method = "GET";
      let path = "/v1/software/latest_ver";
      let data = {"version": current_ver};
      return this.Request(method, path, data);
  }
  /* 试用功能 */
  PJYSDK.prototype.TrialLogin = function() {  
      let method = "POST";
      let path = "/v1/trial/login";
      let data = {"device_id": this._device_id};
      let ret = this.Request(method, path, data);
      if (ret.code == 0) {
          this.is_trial = true;
          this.login_result = ret.result;
          if (this._auto_heartbeat) {
              this._startTrialHeartheat();
          }
      }
      return ret;
  }
  PJYSDK.prototype.TrialHeartbeat = function() {  
      let method = "POST";
      let path = "/v1/trial/heartbeat";
      let data = {"device_id": this._device_id};
      let ret = this.Request(method, path, data);
      if (ret.code == 0) {
          this.login_result.expires = ret.result.expires;
          this.login_result.expires_ts = ret.result.expires_ts;
      }
      return ret;
  }
  PJYSDK.prototype._startTrialHeartheat = function() {  
      if (this._heartbeat_task) {
          this._heartbeat_task.interrupt();
          this._heartbeat_task = null;
      }
      this._heartbeat_task = threads.start(function(){
          setInterval(function(){}, 10000);
      });
      this._heartbeat_ret = this.TrialHeartbeat();

      this._heartbeat_task.setInterval((self) => {
          self._heartbeat_ret = self.CardHeartbeat();
          if (self._heartbeat_ret.code != 0) {
              self.event.emit("heartbeat_failed", self._heartbeat_ret);
          }
      }, this._heartbeat_gap, this);

      this._heartbeat_task.setInterval((self) => {
          if (self.GetTimeRemaining() == 0) {
              self.event.emit("heartbeat_failed", {"code": 10407, "message": "试用已到期！"});
          }
      }, 1000, this);
  }
  PJYSDK.prototype.TrialLogout = function() {  
      this.is_trial = false;
      this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};
      if (this._heartbeat_task) { 
          this._heartbeat_task.interrupt();
          this._heartbeat_task = null;
      }
      
      this._token = null;
      this.login_result = {
          "card_type": "",
          "expires": "",
          "expires_ts": 0,
          "config": "",
      };
      return {"code": 0, "message": "OK"};;
  }
  /* 高级功能 */
  PJYSDK.prototype.GetRemoteVar = function(key) { 
      let method = "GET";
      let path = "/v1/af/remote_var";
      let data = {"key": key};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.GetRemoteData = function(key) { 
      let method = "GET";
      let path = "/v1/af/remote_data";
      let data = {"key": key};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.CreateRemoteData = function(key, value) { 
      let method = "POST";
      let path = "/v1/af/remote_data";
      let data = {"action": "create", "key": key, "value": value};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.UpdateRemoteData = function(key, value) { 
      let method = "POST";
      let path = "/v1/af/remote_data";
      let data = {"action": "update", "key": key, "value": value};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.DeleteRemoteData = function(key, value) { 
      let method = "POST";
      let path = "/v1/af/remote_data";
      let data = {"action": "delete", "key": key};
      return this.Request(method, path, data);
  }
  PJYSDK.prototype.CallRemoteFunc = function(func_name, params) { 
      let method = "POST";
      let path = "/v1/af/call_remote_func";
      let ps = JSON.stringify(params);
      let data = {"func_name": func_name, "params": ps};
      let ret = this.Request(method, path, data);
      if (ret.code == 0 && ret.result.return) {
          ret.result = JSON.parse(ret.result.return);
      }
      return ret;
  }
  return PJYSDK;
})();
let pjysdk = new PJYSDK("btjd46so6itf6875667g", "Z6t9zAATkPCLJUVW2ulctb3jGdyVhGGW"); 
pjysdk._protocol = "https"
pjysdk.debug = false;
let reg = /[蹭地工积车片友收自悬]/g
let storage2 = storages.create("pref");
let card_pass = storage2.get("cardpass",null);
pjysdk.event.on("heartbeat_failed", function(hret) {
      log("心跳失败，尝试重登...")
      sleep(2000);
      let login_ret = pjysdk.CardLogin();
      storage2.put("exdate",pjysdk.GetTimeRemaining());
      if (login_ret.code == 0) {
          log("重登成功");
      } else {
          toastLog(login_ret.message);  
          sleep(200);
          var en = engines.all()
          for(let i = 0;i<en.length;i++){
          if(reg.test(en[i])){
              en[i].forceStop()
          }
          }
          
        }
      });
      
      events.on("exit", function(){
        pjysdk.CardLogout(); 
        try{
          var en = engines.all()
          for(let i = 0;i<en.length;i++){
          if(reg.test(en[i])){
              en[i].forceStop()
          }
          }
        }catch(e){}
        log("结束运行");
});

if(card_pass){
  pjysdk.SetCard(card_pass)
      let login_ret = pjysdk.CardLogin();
      storage2.put("exdate",pjysdk.GetTimeRemaining());
      if(login_ret.code == 0){
          toastLog("登陆中");
          float();
      }else{
          toastLog(login_ret.message)
          
      }

}else{
  let trial_ret = pjysdk.TrialLogin();
  storage2.put("exdate",pjysdk.GetTimeRemaining());
    if(trial_ret.code == 0){
        float();
    }else{
        toastLog(trial_ret.message)
    }
}















function float(){

importClass(android.view.WindowManager);
//activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
importClass(java.lang.Runnable);
importClass(android.animation.ObjectAnimator)
importPackage(android.animation.pertyValuesHolder)
importClass(android.animation.ValueAnimator)
importClass(android.animation.AnimatorSet)
importClass(android.view.animation.AccelerateInterpolator)
importClass(android.view.animation.TranslateAnimation)
importClass(android.animation.ObjectAnimator)
importClass(android.animation.TimeInterpolator)
importClass(android.os.Bundle)
importClass(android.view.View)
importClass(android.view.Window)

importClass(android.view.animation.AccelerateDecelerateInterpolator)
importClass(android.view.animation.AccelerateInterpolator)
importClass(android.view.animation.AnticipateInterpolator)
importClass(android.view.animation.AnticipateOvershootInterpolator)
importClass(android.view.animation.BounceInterpolator)
importClass(android.view.animation.CycleInterpolator)
importClass(android.view.animation.DecelerateInterpolator)
importClass(android.view.animation.LinearInterpolator)
importClass(android.view.animation.OvershootInterpolator)
importClass(android.view.animation.PathInterpolator)

importClass("androidx.viewpager.widget.ViewPager");


var logo_switch = false;
var logo_buys = false;
var logo_fx = true

var logo_ms = 200

/**
 * 需要三个悬浮窗一起协作达到Auto.js悬浮窗效果
 * win  子菜单悬浮窗 处理子菜单选项点击事件
 * win_1  主悬浮按钮
 * win_2  悬浮按钮动画替身,只有在手指移动主按钮的时候才会被触发
 * 触发时,替身Y值会跟主按钮Y值绑定一起,手指弹起时代替主按钮显示跳动的小球动画
 */

var reg1 = /界/g
let reg = /[蹭地工积车片友收自]/g
var PrefCheckBox = require('./能保存配置的多选框.js');
var PrefSpinner = require('./能保存配置的spinner.js');
var Prefinput = require('./能保存配置的input.js');
var PrefRadio = require('./能保存配置的单选框.js');
var PrefRadio = require('./能保存配置的seekbar.js');


threads.start(function(){
    setInterval(()=>{
      let heartret = pjysdk.GetHeartbeatResult()
   
     
    }, 1000);
})


var x = 0,
    y = 0;

var windowX, windowY; G_Y = 0

var downTime; yd = false;

var storage = storages.create("pref")

var scriptarr = ["./友情池.js","./地铁.js","./蹭车.js","./芯片本.js","./普协开车.js"]
var mainegine = engines.myEngine();


var win = floaty.rawWindow(
    <frame >
        <frame id="id_logo" w="150" h="160" alpha="0"  >
            
            <frame id="id_4" w="44" h="44" margin="5 10 0 0" alpha="1" gravity="bottom" layout_gravity="left|center">
                <img w="44" h="44" src="#DDDBDF" alpha = "0.5" circle="true" />
                <text w="28" h="28" text = "脚本" tint="#ffffff" margin="8" gravity="center"/>
                <img id="id_4_click" w="*" h="*" src="#ffffff" circle="true" alpha="0" />
            </frame>
            <frame id="id_5" w="44" h="44" margin="46 45 0 0" alpha="1" gravity="bottom" layout_gravity="left">
                <img w="44" h="44" src="#DDDBDF" alpha = "0.5" circle="true" />
                <img w="28" h="28" src="@drawable/ic_clear_black_48dp" tint="#ffffff" margin="8" gravity="center"/>
                <img id="id_5_click" w="*" h="*" src="#ffffff" circle="true" alpha="0" />
            </frame>
            <frame id="id_6" w="44" h="44" margin="50 0 0 0" alpha="1" gravity="cneter" layout_gravity="top">
                <img w="44" h="44" src="#DDDBDF" alpha = "0.5" circle="true" />
                <text w="28" h="28" text = "界面" tint="#ffffff" margin="8" gravity="center"/>
                <img id="id_6_click" w="*" h="*" src="#ffffff" circle="true" alpha="0" />
            </frame>
            
        </frame>
        <frame id="logo" w="44" h="44" marginTop="83" alpha="1" />
        <frame id="logo_1" w="44" h="44" margin="0 83 22 0" alpha="1" layout_gravity="right" />
    </frame>
)
win.setTouchable(false);

var win_1 = floaty.rawWindow(
    <frame id="logo" w="44" h="44" alpha="0.4" marginTop ="0">
        <img w="44" h="44" src="#ffffff" circle="true" alpha="0.8" />
        <img id="img_logo" w="32" h="32" src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAACLCAYAAACa7kxEAAAACXBIWXMAABJ0AAASdAHeZh94AAA572lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjAtMDgtMjhUMTc6NTg6NDMrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMC0wOC0yOFQxODowMzoxNCswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjAtMDgtMjhUMTg6MDM6MTQrMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NzhhZDFkMzUtZDRiMy0zMTQzLTkxMDgtMWExZDdlMDllNTA0PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YTRhMmY0MWMtZTkxNS0xMWVhLThmMzAtYjNiYTcyNjY2NTg2PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YWQ2MjNiMTgtZjEzNS00YjQxLWI4ZGItMzNmZjlmZjAwOWE5PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmFkNjIzYjE4LWYxMzUtNGI0MS1iOGRiLTMzZmY5ZmYwMDlhOTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMC0wOC0yOFQxNzo1ODo0MyswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3OGFkMWQzNS1kNGIzLTMxNDMtOTEwOC0xYTFkN2UwOWU1MDQ8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjAtMDgtMjhUMTg6MDM6MTQrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj4xMjAwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj4xMjAwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj45ODwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xMzk8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PrQ0Is8AAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAQTJJREFUeNrs3XlYU3eiN3Cf+8zcp9Pe97nTdm57He1zp7SjPi7tXGln6qXadsROtVRtNVrZwxL2XUgQAoi2Qq8iIG64sS8JkIQAIQmLKLiBu7hUBZU1ZDlZQIrb9/3jnBxyEhAXbHvf9+Z5vg+gkJzz+5zfmnNOpgCYMtnZy3FsC184DeELp4HLsm99Ea/x/1peyJOGL5x2+8j2EOzlOILLsm/9X4xfGOLI9hDkJLj+L8YvAZHCsj9zKHhZ2829LNzcy8KNPatRx/sAHJZ9K+d/MX4+iIhF02+ZEcwQlhj/WzN+Boi0Q4eWjAdhxvjfZupngPCMiPg+hWWPm3tZSGHZ41DwMgbEjT2rsTt61f/3GBsayv+DqxTMeGEQXJbdDSWXhDhdJ8TmKC90HXKxSZrLAiSvmHcuzWXByf/fEJI+/t1A0se/G3BwmHpLKs1If2EQ57ctxfltS4FHWpyuE6IgYsVj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" gravity="center" layout_gravity="center" />
        <img id="logo_click" w="*" h="*" src="#ffffff" alpha="0" />
    </frame>
)


var win_2 = floaty.rawWindow(
    <frame id="logo" w="{{device.width}}px" h="44" alpha="0">
        <img w="44" h="44" circle="true" alpha="0.8" />
        <img id="img_logo" w="32" h="32" src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAACLCAYAAACa7kxEAAAACXBIWXMAABJ0AAASdAHeZh94AAA572lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjAtMDgtMjhUMTc6NTg6NDMrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMC0wOC0yOFQxODowMzoxNCswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjAtMDgtMjhUMTg6MDM6MTQrMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NzhhZDFkMzUtZDRiMy0zMTQzLTkxMDgtMWExZDdlMDllNTA0PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YTRhMmY0MWMtZTkxNS0xMWVhLThmMzAtYjNiYTcyNjY2NTg2PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YWQ2MjNiMTgtZjEzNS00YjQxLWI4ZGItMzNmZjlmZjAwOWE5PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmFkNjIzYjE4LWYxMzUtNGI0MS1iOGRiLTMzZmY5ZmYwMDlhOTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMC0wOC0yOFQxNzo1ODo0MyswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3OGFkMWQzNS1kNGIzLTMxNDMtOTEwOC0xYTFkN2UwOWU1MDQ8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjAtMDgtMjhUMTg6MDM6MTQrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj4xMjAwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj4xMjAwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj45ODwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xMzk8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PrQ0Is8AAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAQTJJREFUeNrs3XlYU3eiN3Cf+8zcp9Pe97nTdm57He1zp7SjPi7tXGln6qXadsROtVRtNVrZwxL2XUgQAoi2Qq8iIG64sS8JkIQAIQmLKLiBu7hUBZU1ZDlZQIrb9/3jnBxyEhAXbHvf9+Z5vg+gkJzz+5zfmnNOpgCYMtnZy3FsC184DeELp4HLsm99Ea/x/1peyJOGL5x2+8j2EOzlOILLsm/9X4xfGOLI9hDkJLj+L8YvAZHCsj9zKHhZ2829LNzcy8KNPatRx/sAHJZ9K+d/MX4+iIhF02+ZEcwQlhj/WzN+Boi0Q4eWjAdhxvjfZupngPCMiPg+hWWPm3tZSGHZ41DwMgbEjT2rsTt61f/3GBsayv+DqxTMeGEQXJbdDSWXhDhdJ8TmKC90HXKxSZrLAiSvmHcuzWXByf/fEJI+/t1A0se/G3BwmHpLKs1If2EQ57ctxfltS4FHWpyuE6IgYsVj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" margin="6 6" />
    </frame>
)
win_2.setTouchable(false);

/**
 * 脚本广播事件
 */
var XY = [], XY1 = [], TT = [], TT1 = [], img_dp = {}, dpZ = 0, logo_right = 0, dpB = 0, dp_H = 0
events.broadcast.on("定时器关闭", function (X) { clearInterval(X) })
events.broadcast.on("悬浮开关", function (X) {
    ui.run(function () {
        switch (X) {
            case true:
                win.id_logo.setVisibility(0)
                win.setTouchable(true);
                logo_switch = true
                break;
            case false:
                win.id_logo.setVisibility(8)
                win.setTouchable(false);
                logo_switch = false
        }
    })

});

events.broadcast.on("悬浮显示", function (X1) {
    ui.run(function () {
        win_2.logo.attr("alpha", "0");
        win_1.logo.attr("alpha", "0.4");
    })
});

/**
 * 等待悬浮窗初始化
 */
var terid = setInterval(() => {
    log("悬浮窗初始化中")
    toast("拖动舔狗3秒退出")
    if (TT.length == 0 && win.logo.getY() > 0) {
        ui.run(function () {
            TT = [win.logo.getX(), win.logo.getY()], TT1 = [win.logo_1.getLeft(), win.logo_1.getTop()], anX = [], anY = []
            XY = [
                [win.id_4, TT[0] - win.id_4.getX(), TT[1] - win.id_4.getY()],
                [win.id_5, TT[0] - win.id_5.getX(), TT[1] - win.id_5.getY()],
                [win.id_6, TT[0] - win.id_6.getX(), TT[1] - win.id_6.getY()]]
           
            dpZ = XY[0][2] / 83
            dpB = dpZ * 22
            XY1 = [
                [parseInt(dpZ * 41), TT1[0] - win.id_4.getLeft(), TT1[1] - win.id_4.getTop()],
                [parseInt(dpZ * 41), TT1[0] - win.id_5.getLeft(), TT1[1] - win.id_5.getTop()],
                [parseInt(dpZ * 41), TT1[0] - win.id_6.getLeft(), TT1[1] - win.id_6.getTop()]]
            img_dp.h_b = XY[0][2]
            img_dp.w = parseInt(dpZ * 9)
            img_dp.ww = parseInt(dpZ * (44 - 9))
            logo_right = win.id_4.getX() - parseInt(dpZ * 22)
           // win_1.setPosition(0 - img_dp.w, device.height / 2)
           
            
            win.id_logo.setVisibility(8)
            win.id_logo.attr("alpha", "1")
            events.broadcast.emit("定时器关闭", terid)
        })
    }
}, 100)


/**
 * 子菜单点击事件
 */
function img_down() {
    win_1.logo.attr("alpha", "0.4")
    logo_switch = false
    动画()
}

win.id_4_click.on("click", () => {
   
  var en = engines.all()
  for(let i = 0;i<en.length;i++){
   if(reg.test(en[i])){
    en[i].forceStop()
   }
  }

    if(w.off.visibility == 8){
      var en = engines.all()
      for(let i = 0;i<en.length;i++){
     if(reg.test(en[i])){
      en[i].forceStop()
     }
    }
    w.off.setVisibility(0)
    w.setTouchable(true)
    toast("打开脚本界面")
    }else{
    w.off.setVisibility(8)
    w.setTouchable(false)
    toast("关闭脚本界面")
    }
    img_down();
})
win.id_5_click.on("click", () => {
   toast("关闭运行中脚本")
   var en = engines.all()
    for(let i = 0;i<en.length;i++){
   if(reg.test(en[i])){
    en[i].forceStop()
   }
  }
    img_down();
})
win.id_6_click.on("click", () => {
   toast("打开主界面")
   var en = engines.all()
  for(let i = 0;i<en.length;i++){
   if(reg1.test(en[i])){
    en[i].forceStop()
   }
  }
  app.launchApp("necro助手");
    img_down();
})



function 动画() {
    var anX = [], anY = [], slX = [], slY = []
    if (logo_switch) {
        if (logo_fx) {
            for (let i = 0; i < XY.length; i++) {
                anX[i] = ObjectAnimator.ofFloat(XY[i][0], "translationX", parseInt(XY[i][1]), 0);
                anY[i] = ObjectAnimator.ofFloat(XY[i][0], "translationY", parseInt(XY[i][2]), 0);
                slX[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleX", 0, 1)
                slY[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleY", 0, 1)
            }
        } else {
            for (let i = 0; i < XY.length; i++) {
                anX[i] = ObjectAnimator.ofFloat(XY[i][0], "translationX", XY1[i][1], XY1[i][0]);
                anY[i] = ObjectAnimator.ofFloat(XY[i][0], "translationY", XY1[i][2], 0);
                slX[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleX", 0, 1)
                slY[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleY", 0, 1)
            }
        }
    } else {
        if (logo_fx) {
            for (let i = 0; i < XY.length; i++) {
                anX[i] = ObjectAnimator.ofFloat(XY[i][0], "translationX", 0, parseInt(XY[i][1]));
                anY[i] = ObjectAnimator.ofFloat(XY[i][0], "translationY", 0, parseInt(XY[i][2]));
                slX[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleX", 1, 0)
                slY[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleY", 1, 0)
            }
        } else {
            for (let i = 0; i < XY.length; i++) {
                anX[i] = ObjectAnimator.ofFloat(XY[i][0], "translationX", XY1[i][0], XY1[i][1]);
                anY[i] = ObjectAnimator.ofFloat(XY[i][0], "translationY", 0, XY1[i][2]);
                slX[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleX", 1, 0)
                slY[i] = ObjectAnimator.ofFloat(XY[i][0], "scaleY", 1, 0)
            }
        }
    }
    set = new AnimatorSet();
    set.playTogether(
        anX[0],anX[1],anX[2],
         anY[0],anY[1],anY[2],
         slX[0],slX[1],slX[2],
        slY[0],slY[1],slY[2])
    set.setDuration(logo_ms);
    threads.start(function () {
        logo_buys = true
        if (logo_switch) {
            
            events.broadcast.emit("悬浮开关", true)
            sleep(logo_ms)
        } else {
            
            sleep(logo_ms + 100)
            events.broadcast.emit("悬浮开关", false)
        }
        logo_buys = false
    });
    set.start();
}



win_1.logo.setOnTouchListener(function (view, event) {
    if (logo_buys) { return false}
  
    switch (event.getAction()){
        case event.ACTION_DOWN:
            
            x = event.getRawX();
            y = event.getRawY();
            windowX = win_1.getX();
            windowY = win_1.getY();
            downTime = new Date()
            return true;
        case event.ACTION_MOVE:
             if(new Date()-downTime > 2500){
                toastLog("关闭程序")
                pjysdk.CardLogout(); 
                engines.stopAll();
             }
            if (logo_switch) { return true; }
            if (!yd) {
                if (Math.abs(event.getRawY() - y) > 30 || Math.abs(event.getRawX() - x) > 30) { win_1.logo.attr("alpha", "1"); yd = true }
            } else {
                win_1.setPosition(windowX + (event.getRawX() - x),
                    windowY + (event.getRawY() - y));
                win_2.setPosition(0, windowY + (event.getRawY() - y));
            }
            return true;
        case event.ACTION_UP:   
                         
            
            if (logo_buys) { return false}
            if (Math.abs(event.getRawY() - y) < 30 && Math.abs(event.getRawX() - x) < 30) {
               
                if (logo_switch) {
                    logo_switch = false
                    win_1.logo.attr("alpha", "0.4")
                } else if (logo_fx) {
                   
                    win.setPosition(windowX + (event.getRawX() - x),
                        windowY + (event.getRawY() - y) - img_dp.h_b);
                    win.id_logo.setVisibility(0)
                    logo_switch = true
                    win_1.logo.attr("alpha", "0.9")
                } 
                动画()
            } else if (!logo_switch) {
                
                G_Y = windowY + (event.getRawY() - y)
                win_1.logo.attr("alpha", "0.4")

             
                    
                    logo_fx = true
                    animator = ObjectAnimator.ofFloat(win_2.logo, "translationX", windowX + (event.getRawX() - x), 0 - img_dp.w);
                    mTimeInterpolator = new BounceInterpolator();
                    animator.setInterpolator(mTimeInterpolator);
                    animator.setDuration(300);
                    win_2.logo.attr("alpha", "0.4")
                    win_1.logo.attr("alpha", "0");
                    win_1.setPosition(0 - img_dp.w, G_Y)
                    animator.start();
               
                threads.start(function () {
                    logo_buys = true
                    sleep(logo_ms + 100)
                    events.broadcast.emit("悬浮显示", 0)

                    logo_buys = false
                });
            }
            yd = false
            return true;
    }
    return true;
});


var w = floaty.rawWindow(
    <frame id = "off" w = "*" h = "*">
    <vertical  h = "300" w = "300" >
        <card cardBackgroundColor = "#FEFEEF" cardCornerRadius = "7"  foreground="?selectableItemBackground">
        <horizontal>
        <text id = "t4" text = "设置" w = "50" gravity = "center" layout_weight = "1" bg ="#C4F6F6"/>
        <text id = "t0" text = "日常" w = "50" gravity = "center" layout_weight = "1" />
        <text id = "t1" text = "会战" w = "50" gravity = "center" layout_weight = "1"/>
        <text id = "t2" text = "收集" w = "50" gravity = "center" layout_weight = "1"/>
        <text id = "t3" text = "积分" w = "50" gravity = "center" layout_weight = "1"/>
        </horizontal>
        </card>
    <viewpager id="viewpager" marginTop = "5">
      <horizontal  id = "f5" bg = "#FDFDF0" alpha = "0.8"  h = "300" w = "*">
        
      </horizontal>
      <horizontal>
        <vertical>
          <radiogroup id = "r1" bg = "#FDFDF0" alpha = "0.8"  h = "300" w = "100" >
            <radio  text = "一键日常" textColor="black" checked = "true" />bg
            <radio  text = "自开hell"  textColor="black" />
            <radio  text = "蹭小号"  textColor="black" />
            <radio  text = "芯片本"  textColor="black" />
            <radio  text = "日常蹭车"  textColor="black" />
            <button id = "b1" text = "开始" h = "auto" layout_gravity = "center_horizontal"  />
          </radiogroup>
        </vertical>
        <frame id = "f1"  bg = "#EFF8FE" alpha="0.8" h = "*" layout_weight = "1" >
  
        </frame>
      </horizontal>
      <horizontal>
        <vertical>
          <radiogroup  id = "r2" bg = "#FDFDF0" alpha = "0.8"  h = "300" w = "100">
            <radio text = "会战蹭车" textColor="black" checked = "true" />
            <radio text = "自开" textColor="black" />
            <radio text = "刷票" textColor="black" />
            <radio  text = "蹭小号"  textColor="black" />
            <button id = "b2" text = "开始"   h = "auto" layout_gravity = "center_horizontal" textColor = "#000000" />
          </radiogroup>
        </vertical>
        <frame id = "f2"  bg = "#EFF8FE" alpha="0.8" h = "*" layout_weight = "1" >
  
        </frame>
      </horizontal>
      <horizontal>
        <vertical>
          <radiogroup  id = "r3" bg = "#FDFDF0" alpha = "0.8"  h = "300" w = "100">
            <radio text = "材料1" textColor="black" checked = "true"/>
            <radio text = "材料2" textColor="black" />
            <radio text = "装备本" textColor="black" />
            <radio text = "黄蓝门票周回" textColor="black" />
            <radio text = "红材料换金币" textColor="black" />
            <radio text = "自动推图" textColor="black" />
            <radio text = "收集(旧)" textColor="black" />
            <button id = "b3" text = "开始"   h = "auto" layout_gravity = "center_horizontal" textColor = "#000000" />
          </radiogroup>
        </vertical>
        <frame id = "f3"  bg = "#EFF8FE" alpha="0.8" h = "*" layout_weight = "1" >
  
        </frame>
      </horizontal>
      <horizontal>
        <vertical>
          <radiogroup  id = "r4" bg = "#FDFDF0" alpha = "0.8"  h = "300" w = "100">
            <radio text = "积分" textColor="black" checked = "true"/>
            <radio text = "自动推图" textColor="black" />
            <radio text = "积分(旧)" textColor="black" />
            <button  id = "b4" text = "开始"   h = "auto" layout_gravity = "center_horizontal" textColor = "#000000" />
          </radiogroup>
        </vertical>
        <frame id = "f4"  bg = "#EFF8FE" alpha="0.8" h = "*" layout_weight = "1" >
  
        </frame>
      </horizontal>
     
    </viewpager>
    </vertical>
    </frame>
    );
  
    w.off.setVisibility(8)
      
      
  ui.run(function(){
    ui.inflate( 
      <ScrollView margin = "5" id = "v5" w = "*">
      <vertical >
      <pref-checkbox id= "stuckorloseflag" text = "卡死检测" layout_weight = "1"/>
      <pref-checkbox id = "teamflag" text = "队伍匹配" checked = "true"/>
        <horizontal  layout_weight = "1">
        <text text = "蹭   车   队    伍 " marginLeft = "7" textColor = "black" layout_gravity = "center"/>
        <pref-spinner id = "teamtype1"  downWidth = "100" hOffset = "50" vOffset = "-150" entries = "1|2|3|4|5|6" textColor = "#0000ff" />
        <text text = "队" layout_gravity = "center"/>
        </horizontal>
        <horizontal layout_weight = "1">
        <text text = "积分/收集队伍 " marginLeft = "7" textColor = "black" layout_gravity = "center"/>
        <pref-spinner id = "teamtype2" downWidth = "100" hOffset = "50" vOffset = "-300" entries = "1|2|3|4|5|6" textColor = "#0000ff"/>
        <text text = "队" layout_gravity = "center"/>
        </horizontal>
        <horizontal layout_weight = "1">
        <text text = "r  a  i  d   队  伍 " marginLeft = "7" textColor = "black" layout_gravity = "center"/>
        <pref-spinner id = "teamtype3" downWidth = "100" hOffset = "50" vOffset = "-450" entries = "1|2|3|4|5|6" textColor = "#0000ff"/>
        <text text = "队" layout_gravity = "center"/>
        </horizontal>
        <horizontal layout_weight = "1">
        <text text = "日   常   割    草 " marginLeft = "7" textColor = "black"layout_gravity = "center"/>
        <pref-spinner id = "teamtype4" downWidth = "100" hOffset = "50" vOffset = "-550" entries = "1|2|3|4|5|6" textColor = "#0000ff"/>
        <text text = "队" layout_gravity = "center"/>
        </horizontal>
        <horizontal layout_weight = "1">
        <text text = "复                  刻 " marginLeft = "7" textColor = "black" layout_gravity = "center"/>
        <pref-spinner id = "teamtype5" downWidth = "100" hOffset = "50" vOffset = "-700" entries = "1|2|3|4|5|6" textColor = "#0000ff"/>
        <text text = "队" layout_gravity = "center"/>
        </horizontal>
      </vertical>
      </ScrollView>
      ,w.f5,true
    )
  })
  ui.run(
    function(){
      ui.inflate(
      <vertical margin = "5" id = "v11"> 
        <text text = "请选择日常内容:"  textColor="black" />
        <pref-checkbox id = "metro" text = "地铁"/>
        <horizontal>
        <pref-checkbox id = "dailyraid" text = "蹭车"/>
        <text textColor="black">(</text>
        <pref-checkbox id = "guildflag" />
        <text textColor="black">会战期间)</text>
        </horizontal>
        <pref-checkbox id = "friendpool" text = "友情池"/>
        <radiogroup>
          <pref-radio  id = "chips" text = "芯片本"/>
          <pref-radio id = "hellbattle" text = "自开hell"/>
          <pref-radio id = "noconsumeap" text = "不清理ap"/>
        </radiogroup>
      </vertical>
      ,w.f1,true
      );
    }
  )
  ui.run(
    function(){
      ui.inflate(
        <ScrollView margin = "5" id = "v21">
        <vertical > 
        <text text = "会战蹭车配置:"  textColor="black" />
         <horizontal>
        <pref-checkbox id = "timeflag4" text = "定时" />
        <pref-input id ="hour4" inputType = "number"/>
        <text text = "小时" textColor="black"/>
        <pref-input id ="minute4" inputType = "number"/>
         <text text = "分" textColor="black"/>
         </horizontal>
        <pref-checkbox id="optional2"  text="备选蹭车" />
        <pref-checkbox id="recoverflag4"  text="自动嗑药" />
         <horizontal>
        <text text="蹭车模式：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
        <pref-spinner id = "graidmethod" entries = "血条筛选|难度和血条筛选|难度、颜色和血条筛选" textColor = "#0000ff" textSize = "13" w = "170" downWidth = "580" hOffset = "10" vOffset = "10"/>
        </horizontal>
        <horizontal>
        <text text="蹭车血量：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
        <pref-seekbar id = "ghealth"  w = "120" />
        </horizontal>
        <horizontal>
        <text text="难度1：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
        <pref-spinner id = "gdifficulty1" entries = "Hell|Extra|VH" textColor = "#0000ff" textSize = "13" w = "100"downWidth = "200" hOffset = "10" vOffset = "-200"/>
        </horizontal>
        <horizontal>
        <text text="颜色1：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
        <pref-spinner id = "gbosstype1" entries = "黄|红|蓝|绿|紫|灰" textColor = "#0000ff" textSize = "13" w = "100" downWidth = "100" hOffset = "10" vOffset = "-450"/>
        </horizontal>
        <horizontal>
        <text text="难度2：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
        <pref-spinner id = "gdifficulty2" entries = "Hell|Extra|VH" textColor = "#0000ff" textSize = "13" w = "100"downWidth = "200" hOffset = "10" vOffset = "-200"/>
        </horizontal>
        <horizontal>
        <text text="颜色2：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
        <pref-spinner id = "gbosstype2" entries = "黄|红|蓝|绿|紫|灰" textColor = "#0000ff" textSize = "13" w = "100" downWidth = "100" hOffset = "10" vOffset = "-700"/>
        </horizontal>
       
        </vertical>
        </ScrollView>
      ,w.f2,true
      );
    })
    
  w.r1.setOnCheckedChangeListener(function(group,checkedid){
    if(w.v11) w.v11.setVisibility(8);
    if(w.v12) w.v12.setVisibility(8);
    if(w.v13) w.v13.setVisibility(8);
    if(w.v14) w.v14.setVisibility(8);
    if(w.v15) w.v15.setVisibility(8);
    switch(group.indexOfChild(w.findView(checkedid))){
      case 0:
          if(!w.v11){
            ui.run(
              function(){
                ui.inflate(
                  <vertical margin = "5" id = "v11"> 
                    <text text = "请选择日常内容:"  textColor="black" />
                    <pref-checkbox id = "metro" text = "地铁"/>
                    <horizontal>
                    <pref-checkbox id = "dailyraid" text = "蹭车"/>
                    <text textColor="black">(</text>
                    <pref-checkbox id = "guildflag" />
                    <text textColor="black">会战期间)</text>
                    </horizontal>
                    <pref-checkbox id = "friendpool" text = "友情池"/>
                    <radiogroup>
                      <pref-radio  id = "chips" text = "芯片本"/>
                      <pref-radio id = "hellbattle" text = "自开hell"/>
                      <pref-radio id = "noconsumeap" text = "不清理ap"/>
                    </radiogroup>
                  </vertical>
                  ,w.f1,true
                  );
              }
            )
          }else{
           w.v11.setVisibility(0)
          }
      break; 
      case 1:
         if(!w.v12){
          ui.run(
            function(){
              ui.inflate(
              <vertical margin = "5" id = "v12"> 
                <text text = "自开hell配置:"  textColor="black" />
                <text text = "(工会战期间不可用)"  textColor="black" marginBottom = "5"/>
                
                        <pref-checkbox id="recoverflag3"  text="自动嗑药"/>
                        <horizontal>
                        <pref-checkbox id = "timeflag3" text = "定时" />
                        <pref-input id ="hour3" inputType = "number"/>
                        <text text = "小时" textColor="black"/>
                        <pref-input id ="minute3" inputType = "number"/>
                         <text text = "分" textColor="black"/>
                         </horizontal>
                        <horizontal>  
                        <pref-checkbox id = "helpflag1" text="救援：" />
                        <pref-spinner id = "forhelp1" entries = "全员|工会|好友" textSize = "13" textColor = "#0000ff" w = "100" downWidth = "200" hOffset = "10" vOffset = "10"/>
                        </horizontal>
                        <horizontal>
                        <text text="行动状态：" textColor="black" marginLeft = "6"/>
                        <pref-spinner textSize = "13" id = "autotype1" entries = "不动|autoskill"  textColor = "#0000ff" w = "100" downWidth = "250" hOffset = "10" vOffset = "10"/>
                        </horizontal>
              </vertical>
              ,w.f1,true
              );
            }
          )
        
         }else{
          w.v12.setVisibility(0)
         }
      break; 
      case 2:
        if(!w.v13){
          ui.run(
            function(){
              ui.inflate(
              <vertical margin = "5" id = "v13"> 
                <text text = "蹭小号配置:"  textColor="black" />
                <text text = "(请把小号名字改为しろ)"  textColor="black" />
                <horizontal>
                  <pref-checkbox id = "timeflag7" text = "定时"/>
                  <pref-input id ="hour7" inputType = "number"/>
                  <text text = "小时" textColor="black"/>
                  <pref-input id ="minute7" inputType = "number"/>
                  <text text = "分" textColor="black"/>
                  </horizontal>
                  <pref-checkbox id="recoverflag6"  text="自动嗑药"/>
              </vertical>
              ,w.f1,true
              );
            }
          )
        }else{
         w.v13.setVisibility(0)
        }
      break; 
      case 3:
        if(!w.v14){
          ui.run(
            function(){
              ui.inflate(
              <vertical margin = "5" id = "v14"> 
                <text text = "芯片本配置:"  textColor="black" />
                <horizontal>
                  <pref-checkbox id = "timeflag1" text = "定时"/>
                  <pref-input id ="hour1" inputType = "number"/>
                  <text text = "小时" textColor="black"/>
                  <pref-input id ="minute1" inputType= "number"/>
                  <text text = "分" textColor="black"/>
                </horizontal>
                <pref-checkbox id="rebattleflag"  text="全颜色周回"/>
                <pref-checkbox id="superchip"  text="超上级" />
                <pref-checkbox id="recoverflag1"  text="自动嗑药" />
                <pref-checkbox id="partflag1"  text="助战"/>
                <horizontal>
                  <text text="颜色：" textColor="black" marginLeft = "6"/>
                  <pref-spinner id = "chipstype" textSize = "13" entries = "紫|红|蓝|绿|黄" textColor = "#0000ff" w = "100" downWidth = "100" hOffset = "10" vOffset = "-600"/>
                </horizontal>
              </vertical>
              ,w.f1,true
              );
            }
          )
        }else{
         w.v14.setVisibility(0)
        }
      break; 
      case 4:
        if(!w.v15){
          ui.run(
            function(){
              ui.inflate(
            <ScrollView margin = "5" id = "v15">
              <vertical > 
                 <text text = "日常蹭车配置:"  textColor="black" />
                  <horizontal>
                  <pref-checkbox id = "timeflag2" text = "定时"/>
                  <pref-input id ="hour2" inputType = "number"/>
                  <text text = "小时" textColor="black"/>
                  <pref-input id ="minute2" inputType = "number"/>
                  <text text = "分" textColor="black"/>
                  </horizontal>    
                  <pref-checkbox id="optional1"  text="备选蹭车"/>
                  <pref-checkbox id="recoverflag2"  text="自动嗑药" marginBottom = "5"/>
                  <horizontal > 
                  <text text="蹭车模式：" layout_gravity = "center" textColor="black" marginLeft = "6"/>
                  <pref-spinner id = "nraidmethod"  entries = "血条筛选|难度和血条筛选|难度、颜色和血条筛选" textColor = "#0000ff" textSize = "13"  w = "170" downWidth = "580" hOffset = "10" vOffset = "10"/>
                  </horizontal>
                  <horizontal>
                  <text text="蹭车血量：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-seekbar id = "nhealth"  w = "120" />
                  </horizontal>
                  <horizontal>
                  <text text="难度1：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "ndifficulty1" entries = "Hell|Extra" textColor = "#0000ff" textSize = "13" w = "100"downWidth = "200" hOffset = "10" vOffset = "-110"/>
                  </horizontal>
                  <horizontal>
                  <text text="颜色1：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "nbosstype1" entries = "黄|红|蓝|绿|紫" textColor = "#0000ff" textSize = "13" w = "100" downWidth = "100" hOffset = "10" vOffset = "-450"/>
                  </horizontal>
                  <horizontal>
                  <text text="难度2：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "ndifficulty2" entries = "Hell|Extra" textColor = "#0000ff" textSize = "13" w = "100"downWidth = "200" hOffset = "10" vOffset = "-110"/>
                  </horizontal>
                  <horizontal>
                  <text text="颜色2：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "nbosstype2" entries = "黄|红|蓝|绿|紫" textColor = "#0000ff" textSize = "13" w = "100" downWidth = "100" hOffset = "10" vOffset = "-600"/>
                  </horizontal>
                </vertical>
              </ScrollView>
              ,w.f1,true
              );
            }
          )
        }else{
         w.v15.setVisibility(0)
        }
      break;  
    }
  })
  
  w.r2.setOnCheckedChangeListener(function(group,checkedid){
    if(w.v21) w.v21.setVisibility(8);
    if(w.v22) w.v22.setVisibility(8);
    if(w.v23) w.v23.setVisibility(8);
    if(w.v24) w.v24.setVisibility(8);
    switch(group.indexOfChild(w.findView(checkedid))){
      case 0:
          if(!w.v21){
            ui.run(
              function(){
                ui.inflate(
                  <ScrollView margin = "5" id = "v21">
                  <vertical > 
                  <text text = "会战蹭车配置:"  textColor="black" />
                   <horizontal>
                  <pref-checkbox id = "timeflag4" text = "定时" />
                  <pref-input id ="hour4" inputType = "number"/>
                  <text text = "小时" textColor="black"/>
                  <pref-input id ="minute4" inputType = "number"/>
                   <text text = "分" textColor="black"/>
                   </horizontal>
                  <pref-checkbox id="optional2"  text="备选蹭车" />
                  <pref-checkbox id="recoverflag4"  text="自动嗑药" />
                   <horizontal>
                  <text text="蹭车模式：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "graidmethod" entries = "血条筛选|难度和血条筛选|难度、颜色和血条筛选" textColor = "#0000ff" textSize = "13" w = "170" downWidth = "580" hOffset = "10" vOffset = "10"/>
                  </horizontal>
                  <horizontal>
                  <text text="蹭车血量：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-seekbar id = "ghealth"  w = "120" />
                  </horizontal>
                  <horizontal>
                  <text text="难度1：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "gdifficulty1" entries = "Hell|Extra|VH" textColor = "#0000ff" textSize = "13" w = "100"downWidth = "200" hOffset = "10" vOffset = "-200"/>
                  </horizontal>
                  <horizontal>
                  <text text="颜色1：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "gbosstype1" entries = "黄|红|蓝|绿|紫|灰" textColor = "#0000ff" textSize = "13" w = "100" downWidth = "100" hOffset = "10" vOffset = "-450"/>
                  </horizontal>
                  <horizontal>
                  <text text="难度2：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "gdifficulty2" entries = "Hell|Extra|VH" textColor = "#0000ff" textSize = "13" w = "100"downWidth = "200" hOffset = "10" vOffset = "-200"/>
                  </horizontal>
                  <horizontal>
                  <text text="颜色2：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "gbosstype2" entries = "黄|红|蓝|绿|紫|灰" textColor = "#0000ff" textSize = "13" w = "100" downWidth = "100" hOffset = "10" vOffset = "-700"/>
                  </horizontal>
                 
                  </vertical>
                  </ScrollView>
                ,w.f2,true
                );
              }
            )
          }else{
           w.v21.setVisibility(0)
          }
      break; 
      case 1:
         if(!w.v22){
          ui.run(
            function(){
              ui.inflate(
              <ScrollView margin = "5" id = "v22">
              <vertical > 
                <text text = "自开配置：" textColor="black" />
                <horizontal>
                  <pref-checkbox id = "timeflag5" text = "定时"/>
                  <pref-input id ="hour5" inputType = "number"/>
                  <text text = "小时" textColor="black"/>
                  <pref-input id ="minute5" inputType = "number"/>
                   <text text = "分" textColor="black"/>
                </horizontal>
  
                <horizontal>
                  <pref-checkbox id = "helpflag2" text="救援："/>
                  <pref-spinner id = "forhelp2" entries = "全员|工会|好友" w = "100" textColor = "#0000ff" textSize = "13" downWidth = "200" hOffset = "10" vOffset = "10"/>
                </horizontal>
                <pref-checkbox id = "autoticket" text = "自动补票"  marginBottom = "5" />
                <horizontal>
                  <text text="行动状态：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "autotype2" entries = "不动|autoskill" w = "100" textColor = "#0000ff" textSize = "13" downWidth = "250" hOffset = "10" vOffset = "10"/>
                </horizontal>
                <horizontal>
                  <text text="颜色：" textColor="black"  marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "bosstype" entries = "黄|红|蓝|绿|紫" w = "100" textColor = "#0000ff" textSize = "13" downWidth = "100" hOffset = "10" vOffset = "-500"/>
                </horizontal>
                <horizontal>
                  <text text="难度选择：" textColor="black" marginLeft = "6" layout_gravity = "center"/>
                  <pref-spinner id = "difficulty" entries = "Extra|VH|Hard" w = "100" textColor = "#0000ff" textSize = "13" downWidth = "200" hOffset = "10" vOffset = "-300"/>
                </horizontal>
                  
              </vertical>
              </ScrollView>
              ,w.f2,true
              );
            }
          )
        
         }else{
          w.v22.setVisibility(0)
         }
      break; 
      case 2:
        if(!w.v23){
          ui.run(
            function(){
              ui.inflate(
              <vertical margin = "5" id = "v23"> 
                 <text text = "会战刷票配置:"  textColor="black" />
                <horizontal>
                  <pref-checkbox id = "timeflag6" text = "定时" />
                  <pref-input id ="hour6" inputType = "number"/>
                  <text text = "小时" textColor="black"/>
                  <pref-input id ="minute6" inputType = "number"/>
                  <text text = "分" textColor="black"/>
                </horizontal>
                  <pref-checkbox id="recoverflag5"  text="自动嗑药"  />
                  <pref-checkbox id="partflag2"  text="助战"  />
              </vertical>
              ,w.f2,true
              );
            }
          )
        }else{
         w.v23.setVisibility(0)
        }
      break; 
      case 3:
        if(!w.v24){
          ui.run(
            function(){
              ui.inflate(
              <vertical margin = "5" id = "v24"> 
                <text text = "芯片本配置:"  textColor="black" />
                <horizontal>
                  <pref-checkbox id = "timeflag8" text = "定时"/>
                  <pref-input id ="hour8" inputType = "number"/>
                  <text text = "小时" textColor="black"/>
                  <pref-input id ="minute8" inputType = "number"/>
                  <text text = "分" textColor="black"/>
                  </horizontal>
                  <pref-checkbox id="recoverflag7"  text="自动嗑药" /> 
              </vertical>
              ,w.f2,true
              );
            }
          )
        }else{
         w.v24.setVisibility(0)
        }
      break; 
    }
  })
  
  ui.run(function(){
      ui.inflate(
        <vertical margin = "5" id = "v3"> 
          <text text = "收集配置:"  textColor="black" />
          <horizontal>
          <pref-checkbox id = "timeflag9" text = "定时"/>
          <pref-input id ="hour9" inputType = "number"/>
          <text text = "小时" textColor="black"/>
          <pref-input id ="minute9" inputType = "number"/>
          <text text = "分" textColor="black"/>
          </horizontal>
          <pref-checkbox id="partflag3"  text="助战(bonus)"/>
          <pref-checkbox id="recoverflag8"  text="自动嗑药" />      
          <pref-checkbox id="dailyflag"  text="每日挑战" />      
          <horizontal>
          <text text="普通图倍速："  marginLeft = "6" textColor="black" layout_gravity = "center"/>
           <pref-spinner id = "speedtype1" entries = "1|2|3" w = "100" textColor = "#0000ff" downWidth = "100" hOffset = "10" vOffset = "-110"/>
          </horizontal>
        </vertical>
      ,w.f3,true
      );
  })
  
  ui.run(
    function(){
      ui.inflate(
        <vertical margin = "5" id = "v4"> 
          <text text = "积分配置:"  textColor="black" />
          <horizontal>
          <pref-checkbox id = "timeflag10" text = "定时"/>
          <pref-input id ="hour10" inputType = "number"/>
          <text text = "小时" textColor="black"/>
          <pref-input id ="minute10" inputType = "number"/>
          <text text = "分" textColor="black"/>
          </horizontal>
          <pref-checkbox id="equipflag"  text="装备レア" />
          <pref-checkbox id="designflag"  text="设计图レア" />
          <pref-checkbox id="partflag5"  text="助战(bonus)" />
          <pref-checkbox id="recoverflag9"  text="自动嗑药" />      
          <horizontal>
          <text text="普通图倍速：" marginLeft = "6" textColor="black" layout_gravity = "center"/>
           <pref-spinner id = "speedtype" entries = "1|2|3" textColor = "#0000ff" layout_gravity = "center"w = "100" downWidth = "100" hOffset = "10" vOffset = "-210"/>
          </horizontal>
        </vertical>
      ,w.f4,true
      );
    }
  )
  
  
  w.viewpager.addOnPageChangeListener(new ViewPager.OnPageChangeListener({
    onPageSelected:function(newposi){
      let textarr = [w.t4,w.t0,w.t1,w.t2,w.t3];
      for(let i = 0;i < textarr.length;i++){
        if(i == newposi){
          textarr[i].attr("bg","#C4F6F6")
        }else{
          textarr[i].attr("bg","#FEFEEF")
        }
      }
      // w.t0.attr("bg","#C4F6F6")
    }
  
    
    
    
    
      
    
  }))
  

  
w.b1.on("click",function(){
  let friendpool = storage.get("friendpool",false);
  let metro = storage.get("metro",false);
  let dailyraid = storage.get("dailyraid",false);
  let chips = storage.get("chips",false);
  let hellbattle = storage.get("hellbattle",false);
  let noconsumeap = storage.get("noconsumeap",false);
  let dailyarr = [friendpool,metro,dailyraid,[chips,hellbattle,noconsumeap]]

  w.off.setVisibility(8);
  switch(w.r1.indexOfChild(w.findView(w.r1.getCheckedRadioButtonId()))){
    case 0:
      
            events.broadcast.on("done",function(i){
           mainegine.emit("dailyexec",i+1)
         })
      
        
              events.on("dailyexec",function(i){
           if(i>dailyarr.length -1){
             events.broadcast.removeAllListeners("done");
             events.removeAllListeners("dailyexec");
            toastLog("日常完成")
          }
           else{
           switch(i){
             case 0:
               if(dailyarr[0]){
                 engines.execScriptFile(scriptarr[0])
               }else{
                 mainegine.emit("dailyexec",i+1)
               }
             break;
             case 1:
               if(dailyarr[1]){
                 engines.execScriptFile(scriptarr[1])
               }else{
                 mainegine.emit("dailyexec",i+1)
               }
             break;
             case 2:
               if(dailyarr[2]){
                 storage.put("Recoverflag",true);
                 engines.execScriptFile(scriptarr[2])
               }else{
                 mainegine.emit("dailyexec",i+1)
               }
             break;
             case 3:
               if(dailyarr[3][0]){
                 storage.put("Recoverflag",true);
                 engines.execScriptFile(scriptarr[3])
               }else if(dailyarr[3][1]){
                 storage.put("Recoverflag",true);
                 engines.execScriptFile(scriptarr[4])
               }else if(dailyarr[3][2]){
                 mainegine.emit("dailyexec",i+1)
                 toastLog("不消耗ap")
               }
             break;
           }
           }
         })
         
      mainegine.emit("dailyexec",0)
    break; 
    case 1:
      engines.execScriptFile("./普协开车.js")
    break; 
    case 2:
      storage.put("guildflag",false);
      engines.execScriptFile("./蹭小号.js")
    break; 
    case 3:
      engines.execScriptFile("./芯片本.js")
    break; 
    case 4:
      storage.put("guildflag",false);
      engines.execScriptFile("./蹭车.js")
    break; 
  }
})

w.b2.on("click",function(){
  w.off.setVisibility(8);
  switch(w.r2.indexOfChild(w.findView(w.r2.getCheckedRadioButtonId()))){
    case 0:
      storage.put("guildflag",true);
      engines.execScriptFile("./蹭车")
    break;
    case 1:
      engines.execScriptFile("./工会开车")
    break;
    case 2:
      engines.execScriptFile("./工会刷票")
    break;
    case 3:
      storage.put("guildflag",true);
      engines.execScriptFile("./蹭小号")
    break;
  }

})
w.b3.on("click",function(){
  w.off.setVisibility(8);
  switch(w.r3.indexOfChild(w.findView(w.r3.getCheckedRadioButtonId()))){
    case 0:
      storage.put("material1flag",true)
      storage.put("material2flag",false)
      storage.put("ticketfbflag",false)
      storage.put("clearmaterialflag",false)
      storage.put("changecoins",false)
      engines.execScriptFile("./收集.js")
    break;
    case 1:
      storage.put("material1flag",false)
      storage.put("material2flag",true)
      storage.put("ticketfbflag",false)
      storage.put("clearmaterialflag",false)
      storage.put("changecoins",false)
      engines.execScriptFile("./收集.js")
    break;
    case 2:
      storage.put("material1flag",false)
      storage.put("material2flag",false)
      storage.put("ticketfbflag",true)
      storage.put("clearmaterialflag",false)
      storage.put("changecoins",false)
      engines.execScriptFile("./收集.js")
    break;
    case 3:
      storage.put("material1flag",false)
      storage.put("material2flag",false)
      storage.put("ticketfbflag",false)
      storage.put("clearmaterialflag",true)
      storage.put("changecoins",false)
      engines.execScriptFile("./收集.js")
    break;
    case 4:
      storage.put("material1flag",false)
      storage.put("material2flag",false)
      storage.put("ticketfbflag",false)
      storage.put("clearmaterialflag",false)
      storage.put("changecoins",true)
      engines.execScriptFile("./收集.js")
    break;
    case 5:
      engines.execScriptFile("./自动推图.js")
    break;
  }

})
w.b4.on("click",function(){
  w.off.setVisibility(8);
  switch(w.r4.indexOfChild(w.findView(w.r4.getCheckedRadioButtonId()))){
    case 0:
      engines.execScriptFile("./积分.js")
    break;
    case 1:
      engines.execScriptFile("./自动推图.js")
    break;

  }

})

threads.start(function(){
    var isHorizontal = isHorizontalScreen();
 
setInterval(() => {
    if (isHorizontal != isHorizontalScreen()) {
        isHorizontal = isHorizontalScreen();
        if(isHorizontal){
            w.setPosition(device.height/4,50)
            win_1.setPosition(0,50)
        }else{
            w.setPosition(50,device.height/4)
          win_1.setPosition(0,0)
        }
    }
}, 1000)



function isHorizontalScreen() {
    let config = context.getResources().getConfiguration();
    let ori = config.orientation;
    if (ori == config.ORIENTATION_LANDSCAPE) {
        
        w.setPosition(device.height/4,50)
        return true;
    } else if (ori == config.ORIENTATION_PORTRAIT) {
        
        w.setPosition(50,device.height/4)
        return false;
    }
}


})

}
