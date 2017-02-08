import 'fetch-ie8'
import appShare from '../common/share.js'
import controlPage from './control.js'

const GET_WXINFO_URL = 'http://m.messtime.top/application/weixin?url=' + encodeURIComponent(location.href.split('#')[0])
const sharePicUrl = "http://m.messtime.top/test/sharePic.png"

export function setWxShare() {
  fetch(GET_WXINFO_URL).then((res) => {
    return res.json();
  }).then((data) => {
    console.log('data', data)
    if (data.code === 0) {
      wxConfig(data.data);
    }
  }).catch(function(e) {
    console.log("Oops, error", e);
  });
}

function wxConfig(data) {
  wx.config({
    // debug: true,
    appId: data.appId,
    timestamp: data.timestamp,
    nonceStr: data.nonceStr,
    signature: data.signature,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
  });
  wx.ready(() => {
    setShareInfo('测试分享后回调', sharePicUrl)

  });
  wx.error(function(res){
    console.log('err', res)
  });
}

export function setShareInfo(shareTitle, imgUrl) {
  // var shareUrl = location.href.split('#')[0],
  //   shareDesc = '测试分享后回调'
  // appShare.set({
  //   loginType: 'wx',
  //   imgWidth: 90,
  //   imgHeight: 90,
  //   imgUrl,
  //   shareUrl,
  //   shareTitle,
  //   shareDesc
  // })
  wx.onMenuShareTimeline({
      title: shareTitle, // 分享标题
      link: location.href, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
          // 用户确认分享后执行的回调函数
          alert('分享朋友圈成功，跳转到第三页');
          controlPage.showThird();
      },
      cancel: function () {
          // 用户取消分享后执行的回调函数
          alert('取消分享，留在本页');
      }
  });
  wx.onMenuShareAppMessage({
      title: shareTitle, // 分享标题
      desc: shareTitle, // 分享描述
      link: location.href, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
          alert('分享朋友成功，跳转到第三页');
          controlPage.showThird();
      },
      cancel: function () {
          alert('取消分享，留在本页');
      }
  });
}
