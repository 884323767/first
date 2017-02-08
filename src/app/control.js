import $ from 'n-zepto'
import * as wxShare from './wxShare.js'

// const drawList = drawCard.drawList;
var fishList = {}
var canGetFishNum = 2;
// var drawResult = loadDrawResult();
var startY, endY, diff;

// for (let i = 0; i < drawList.length; i++) {
//   let fishPic = "https://m.youyu.cn/acts/new-year-draw/sharePics/" + drawList[i].fishPic + ".png",
//     fishPicName = drawList[i].fishPic;
//   fishList[fishPicName] = fishPic
// }



function touchStart(e) {
  if (e.touches && e.touches.length === 1) {
    startY =  e.touches[0].clientY;
  } else {
    startY = e.clientY;
  }
}

function touchEnd(e) {
  var moveThreshold = 5;
  var fishingRod = $('.fishing-rod')
  var rodUpTimeout;
  if (e.changedTouches) {
    endY =  e.changedTouches[0].clientY
  } else {
    endY = e.clientY
  }
  diff = endY - startY
  if (Math.abs(diff) < moveThreshold) {
    return
  }
  if (diff < 0) {
    console.log('canGetFishNum', canGetFishNum)
    if (game.getFish() <= canGetFishNum) {
      if (!fishingRod.hasClass('rod-up')) {
        clearTimeout(rodUpTimeout);
        $('.fishing-rod').off('touchstart mousedown', touchStart)
        $('.fishing-rod').off('touchend mouseup', touchEnd)
        animation.showFish()
        // drawResult = drawList[game.getDrawResult()];
        setResultPage()
        canGetFishNum = 2;
      }
    } else {
      fishingRod.addClass('rod-up');
      clearTimeout(rodUpTimeout);
      rodUpTimeout = setTimeout(() => {
        fishingRod.removeClass('rod-up');
        canGetFishNum++
      }, 500)
    }
  }
}

export function showfirst() {
  location.href = '#/first';
  $('#third').hide()
  $('#second').hide()
  $('#first').show()
  event.stopPropagation();
}

export function showSecond() {
  location.href = '#/second';
  $('#first').hide()
  $('#third').hide()
  $('#second').show()
  event.stopPropagation();
}
export function showThird() {
  location.href = '#/third';
  $('#first').hide()
  $('#second').hide()
  $('#third').show()
  event.stopPropagation();
}


export function showShareMask() {
  event.stopPropagation();
  $('.share-mask').show()
}

export function hideShareMask() {
  $('.share-mask').hide()
  event.stopPropagation();

}

export function goNext() {
  // event.stopPropagation();
  window.history.go(1);
}

export function goBefore() {
  event.stopPropagation();
  window.history.back();
}
