/* global plat */
/**
 * Created by wangzhw on 2017/5/09.
 */
import homeApi from '../../../../common/js/home'

let $ = window.$
const shopId = homeApi.getUrlParams('shopId')
let $advContainer = $('.guide-container')
let $advItem = $('.row', $advContainer)
const $advertCon = $('.guide-img .row')
let x1
let x2

/**
 * 获取触摸起点
 */
$advContainer.on('touchstart', (e) => {
  let _touch = e.targetTouches[0]
  x1 = _touch.pageX
})

/**
 * 滑动结束点
 */
$advContainer.on('touchend', (e) => {
  let _touch = e.changedTouches[0]
  x2 = _touch.pageX
  if ($advItem.children().length < 3) {
    return
  }
  if (x2 - x1 > 30) {
    swiper('right')
  } else if (x2 - x1 < -30) {
    console.log('left')
    swiper('left')
  }
})

/**
 * 侧滑函数
 * @param type
 */
let swiper = (type) => {
  let childNodes = $advItem.children()
  let lastC = $advItem.children().eq(2)
  let firstC = $advItem.children().eq(0)
  Array.prototype.forEach.call(childNodes, function (el, i) {
    $(el).remove()
    if (type === 'right') {
      $(el).removeClass('slideInRight').addClass('slideInLeft')
      if (i < 2) {
        $advItem.append($(el))
      }
    } else {
      $(el).removeClass('slideInLeft').addClass('slideInRight')
      if (i > 0) {
        $advItem.append($(el))
      }
    }
  })
  if (type === 'right') {
    $advItem.prepend(lastC)
  } else {
    $advItem.append(firstC)
  }
}

/**
 * 广告位图片
 */
homeApi.getAdvert({shopId, position: 'AD'}).then(res => {
  if (res.data && !res.data.code) {
    if (res.data.data === null || res.data.data.length === 0) {
      if (plat === 0) {
        $('.img-loading').remove()
      } else {
        // return
      }
    } else {
      res.data.data.forEach((obj, i) => {
        let advert = ''
        let itemClass = 'col-xs-4 col-sm-4'
        if (i < 3) {
          if (i === 1) {
            itemClass = 'col-xs-4 col-sm-4'
          }
          let isIEOrEdge = navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === 'Netscape' && navigator.appVersion.indexOf('Edge') > -1)
          let index = i + 1
          if (isIEOrEdge) {
            let imgclass = 'square-img' + index
            if (obj.linkTag === 0) {
              advert = `<div class="${itemClass} ${imgclass} img animated"><a href="${obj.linkUrl}" target="_blank" style="background-image: url(${obj.pircUrlWhole})"><img src="${obj.pircUrlWhole}"></a></div>`
            } else if (obj.linkTag === 1) {
              advert = `<div class="${itemClass} ${imgclass} img animated"><a href="/detail?shopId=${shopId}&productId=${obj.linkUrl}" style="background-image: url(${obj.pircUrlWhole})" target="_blank"><img src="${obj.pircUrlWhole}"></a></div>`
            } else if (obj.linkTag === -1) {
              advert = `<div class="${itemClass} ${imgclass} img animated"><a href="javascript:;" style="background-image: url(${obj.pircUrlWhole})" target="_blank"><img src="${obj.pircUrlWhole}"></a></div>`
            }
          } else {
            let imgclass = ' img' + index
            if (obj.linkTag === 0) {
              advert = `<div class="${itemClass} ${imgclass} img animated"><a href="${obj.linkUrl}" target="_blank" style="background-image: url(${obj.pircUrlWhole})"><img src="${obj.pircUrlWhole}"></a></div>`
            } else if (obj.linkTag === 1) {
              advert = `<div class="${itemClass} ${imgclass} img animated"><a href="/detail?shopId=${shopId}&productId=${obj.linkUrl}" style="background-image: url(${obj.pircUrlWhole})" target="_blank"><img src="${obj.pircUrlWhole}"></a></div>`
            } else if (obj.linkTag === -1) {
              advert = `<div class="${itemClass} ${imgclass} img animated"><a href="javascript:;" style="background-image: url(${obj.pircUrlWhole})" target="_blank"><img src="${obj.pircUrlWhole}"></a></div>`
            }
          }
          $advertCon.append(advert)
        }
        $('.img-loading').remove()
      })
    }
  }
})
