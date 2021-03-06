;(function (win, globalApi) {
  var doc = win.document
  var docEl = doc.documentElement
  var rubberizeEl = doc.querySelector('meta[name="rubberize"]')
  var baseWidth = 0
  var baseCell = 10
  var baseFontSize = 12
  var dpr = 0
  var platform = ''
  var scale = 0
  var minDpr = 1
  var maxDpr = 3
  var minRwidth = 320
  var maxRwidth = 1024
  var userScalable = 'yes'
  var tid
  var rubberize = globalApi.rubberize || (globalApi.rubberize = {})
  var isMobile = !!win.navigator.appVersion.match(/iphone|ipad|android/gi)
  var isDesktop = !isMobile

  platform = isMobile ? 'mobile' : 'desktop'

  if (rubberizeEl) {
    var content = rubberizeEl.getAttribute('content')

    if (content) {
      var tmpBaseWidth = getMatchNeed(content.match(/base-width=([\d.]+)/))
      if (tmpBaseWidth) {
        baseWidth = tmpBaseWidth
      } else {
        console.error('[rubberize: invalid base-width]')
        return false
      }

      var tmpBaseFontSize = getMatchNeed(content.match(/base-font_size=([\d.]+)/))
      if (tmpBaseFontSize) { baseFontSize = tmpBaseFontSize }

      var tmpMinDpr = getMatchNeed(content.match(/min-dpr=([\d.]+)/))
      if (tmpMinDpr) { minDpr = tmpMinDpr }

      var tmpMaxDpr = getMatchNeed(content.match(/max-dpr=([\d.]+)/))
      if (tmpMaxDpr) { maxDpr = tmpMaxDpr }

      var tmpMinRwidth = getMatchNeed(content.match(/min-rwidth=([\d.]+)/))
      if (tmpMinRwidth) { minRwidth = tmpMinRwidth }

      var tmpMaxRwidth = getMatchNeed(content.match(/max-rwidth=([\d.]+)/))
      if (tmpMaxRwidth) { maxRwidth = tmpMaxRwidth }

      // forceDpr也受到min/maxDpr的制约，只能是整数
      var tmpForceDpr = getMatchNeed(content.match(/force-dpr=([\d.]+)/))
      if (tmpForceDpr) {
        tmpDpr = tmpForceDpr
        tmpDpr = tmpDpr > maxDpr ? maxDpr : tmpDpr
        tmpDpr = tmpDpr < minDpr ? minDpr : tmpDpr

        dpr = tmpDpr
        scale = parseFloat((1 / dpr).toFixed(2))
      }

      var tmpUserScalable = content.match(/user-scalable=([yes|no]+)/)
      if (tmpUserScalable && tmpUserScalable[1]) {
        userScalable = tmpUserScalable[1]
      }
    }
  } else {
    console.error('[rubberize: invalid meta]')
    return false
  }

  // 如果配置forceDpr则不会执行这里
  // 这里根据devicePixelRatio配置dpr和scale，受约束
  if (!dpr && !scale) {
    var devicePixelRatio = win.devicePixelRatio

    if (devicePixelRatio) {
      var tmpDpr = Math.floor(devicePixelRatio)
      tmpDpr = tmpDpr > maxDpr ? maxDpr : tmpDpr
      tmpDpr = tmpDpr < minDpr ? minDpr : tmpDpr

      dpr = tmpDpr
    } else {
      dpr = minDpr
    }

    scale = parseFloat((1 / dpr).toFixed(2))
  }

  docEl.setAttribute('data-dpr', dpr)
  docEl.setAttribute('data-platform', platform)

  var metaEl = doc.createElement('meta')
  metaEl.setAttribute('name', 'viewport')
  metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=' + userScalable)
  if (docEl.firstElementChild) {
    docEl.firstElementChild.appendChild(metaEl)
  } else {
    var wrap = doc.createElement('div')
    wrap.appendChild(metaEl)
    doc.write(wrap.innerHTML)
  }

  function refreshRem () {
    var width = isDesktop ? baseWidth : docEl.getBoundingClientRect().width

    if (isMobile) {
      if (width / dpr > maxRwidth) {
        width = maxRwidth * dpr
      }
      if (width / dpr < minRwidth) {
        width = minRwidth * dpr
      }
    }

    var rem = width / baseCell

    docEl.style.fontSize = rem + 'px'
    rubberize.rem = rem
    if (typeof rubberize.onRefreshRem === 'function') {
      rubberize.onRefreshRem()
    }
  }

  function getMatchNeed (matched) {
    if (!matched) {
      return false
    }
    return Math.abs(parseInt(matched[1]))
  }

  win.addEventListener('resize', function () {
    clearTimeout(tid)
    tid = setTimeout(function () {
      refreshRem()
    }, 300)
  }, false)

  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      clearTimeout(tid)
      tid = setTimeout(function () {
        refreshRem()
      }, 300)
    }
  }, false)

  if (doc.readyState === 'complete') {
    if (isMobile) { doc.body.style.fontSize = baseFontSize * dpr + 'px' }
    if (isDesktop) { doc.body.style.fontSize = baseFontSize + 'px' }
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      if (isMobile) { doc.body.style.fontSize = baseFontSize * dpr + 'px' }
      if (isDesktop) { doc.body.style.fontSize = baseFontSize + 'px' }
    }, false)
  }

  refreshRem()

  rubberize.dpr = dpr
  rubberize.platform = platform
  rubberize.refreshRem = refreshRem
  rubberize.onRefreshRem = function () {}
  // rebuid match less
  rubberize.px2rem = function (d) {
    let tmpRem = baseWidth / baseCell
    var val = parseFloat(d) / tmpRem
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem'
    }
    return val
  }
})(window, window['GLOBAL_API'] || (window['GLOBAL_API'] = {}))
