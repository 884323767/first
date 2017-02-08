// import '../common-module/rubberize/rubberize.js'
import './styles/main.less'

import * as control from './app/control.js'
import * as wxShare from './app/wxShare.js'
import $ from 'n-zepto'
import 'zepto-touch'
import director from 'director'

require('script!./vendor/jweixin-1.0.0');

var wait = require('bundle?name=[name]!../node_modules/fastclick/lib/fastclick.js')
wait(function(FastClick) {
    FastClick.attach(document.body);
});

window.onload = function () {
    console.log('ready');
    init();
}

function init() {
  wxShare.setWxShare();
  document.ontouchmove = function(e) {
    e.preventDefault();
  }

  location.href = '#/first'
  var routes = {
    '/first': control.showfirst,
    '/second': control.showSecond,
    '/third': control.showThird,
  }
  var router = director.Router(routes);
  router.init();

  $('#first').on('click', control.showSecond);
  $('#second').on('click', control.showThird);
  $('#third').on('click', control.showfirst);
  $('.share').on('click', control.showShareMask);
  $('.share-mask').on('click', control.hideShareMask);
  $('.before').on('click', control.goBefore);
  $('.next').on('click', control.goNext);
}
