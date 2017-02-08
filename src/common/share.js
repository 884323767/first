/*global define, mqq, WeixinJSBridge */
/**
 * 自选股、微信、QQ分享
 */
import _ from 'underscore';

var share;

(function() {
  'use strict';
  var EF = function () {},
    conf = {
      //PKG_NAME : 'com.tencent.portfolio',
      //PKG_SIG : '98a6788beeaeaa9446e0a7d146d222be',
      //PKG_URL : 'qqstock://qqstockweixincallback',
      //APPID : 'wxcbc3ab3807acb685',
      PKG_NAME : '',
      PKG_SIG : '',
      PKG_URL : '',
      APPID : '',
      isIOS : /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(navigator.userAgent.toLowerCase()),
      imgWidth : 90,
      imgHeight : 90,
      imgUrl : 'http://mat1.gtimg.com/finance/st/w/jiashi/img/share_90x90_151113.png',
      shareUrl : 'http://127.0.0.1',
      shareTitle : 'title',
      shareDesc : 'desc',
      loginType : 'qq'
    };

  function getData() {
    return {
      width : conf.imgWidth,
      height : conf.imgHeight,
      img_url : conf.imgUrl,
      bimg_url : '',
      link : conf.shareUrl,
      desc : conf.shareDesc,
      title : conf.shareTitle
    };
  }

  share = {
    setData : function (data) {
      _.extend(conf, data);
    },
    set : function (data) {
      var loginType = data.loginType;

      this.setData(data);

      if (loginType === 'qq') {
        this.setQQShare();
        this.checkInstallInQQ();
      } else if (loginType === 'wx') {
        this.setWxShare();
        this.checkInstallInWx();
      }
    },

    checkInstallInQQ : function () {
      if (typeof mqq === 'object') {
        mqq.app.isAppInstalled(conf.isIOS ? 'qqstock' : conf.PKG_NAME, function (res) {
          if (res) {
            share.setInstallState();
          }
        });
      }
    },

    checkInstallInWx : function () {
      this.afterWxReady(function () {
        if (!window.WeixinJSBridge) {
          return;
        }
        var cnt,
          checkIsInstall = function () {
            window.WeixinJSBridge && window.WeixinJSBridge.invoke('getInstallState', {
              'packageUrl': conf.PKG_URL,
              'packageName': conf.PKG_NAME
            }, function (res) {
              if (/system:access_denied/i.test(res.err_msg) && cnt < 5) {
                return setTimeout(function () {
                  cnt = cnt || 0;
                  checkIsInstall(cnt++);
                }, 100);
              }
              if (/get_install_state:yes/i.test(res.err_msg)) {
                share.setInstallState();
              }
            });
          };

        checkIsInstall();
      });
    },

    setInstallState : function () {
      this.stockAppInstalled = true;
    },

    openQqstock: function () {
      var result = false;

      if (this.stockAppInstalled && window.WeixinJSBridge) {
        if (conf.loginType === 'wx') {
          if (conf.isIOS) {
            window.WeixinJSBridge.invoke('launch3rdApp', {
              'appID': conf.APPID,
              'messageExt': '',
              'extInfo': ''
            }, EF);
          } else {
            window.WeixinJSBridge.invoke('launch3rdApp', {
              'packageName': conf.PKG_NAME,
              'signature': conf.PKG_SIG,
              'type': 1
            }, EF);
          }
          result = true;
        } else if (conf.loginType === 'qq') {
          if (typeof mqq === 'object') {
            mqq.app.launchApp({
              name: conf.isIOS ? 'qqstock' : conf.PKG_NAME
            });
            result = true;
          }
        }
      }

      return result;
    },

    setWxShare : function () {
      if (!this.wxSetted) {
        this.wxSetted = true;
        this.afterWxReady(function () {
          if (!window.WeixinJSBridge) {
            return;
          }
          var getShareData = function () {
            var data = getData();
            return {
              img_url: data.img_url,
              img_width: data.width,
              img_height: data.height,
              link : data.link,
              desc : data.desc,
              title : data.title,
              // success: function() {
              //   alert('分享成功，调到第三页');
              // },
              // cancel: function() {
              //   alert('取消分享，留在第二页');
              // }
            };
          };
          window.WeixinJSBridge.on("menu:share:appmessage", function () {
            window.WeixinJSBridge.invoke("sendAppMessage", getShareData(), EF);
          });
          window.WeixinJSBridge.on("menu:share:timeline", function () {
            window.WeixinJSBridge.invoke("shareTimeline", getShareData(), EF);
          });
        });
      }
    },
    setQQShare : function () {
      var data;
      if (!this.qqSetted) {
        this.qqSetted = true;

        if (typeof mqq === 'object') {
          data = getData();
          mqq.data.setShareInfo({
            share_url : data.link,
            title : data.title,
            desc : data.desc,
            image_url : data.img_url
          }, EF);
        }
      }
    },
    afterWxReady : function (callback) {
      if (window.WeixinJSBridge && window.WeixinJSBridge.invoke) {
        callback();
      } else {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", callback, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", callback);
          document.attachEvent("onWeixinJSBridgeReady", callback);
        }
      }
    }
  };
}());
export default share;
