/**
 * Created by wangzhw on 2017/5/09.
 */
import homeApi from '../../../../common/js/home'

const $ = window.$
const $container = $('.carousel-container')
const shopId = homeApi.getUrlParams('shopId')
const $carouselInner = $('.carousel-inner', $container)
const $carouselDirCtrl = $('.carousel-dir-controls', $container)
const $carouselIndicators = $('.carousel-indicators', $container)

/**
 * banner轮播
 */
$('#carousel-banner').carousel({
  interval: 5000
})

homeApi.getAdvert({shopId, position: 'BANNAER'}).then((res) => {
  if (res.data && !res.data.code) {
    let carouselNd = ''
    let carouselIdc = ''
    let active = 'active'

    // 当返回data为null或者返回为空数组的时候
    if (!res.data.data || res.data.data.length === 0) {
      // $('.glyphicon-chevron-right').hide()
      // $('.glyphicon-chevron-left').hide()
      // $('#carousel-banner', $container).show()
      $('#carousel-banner', $container).hide()
      $('.banner-loading', $container).remove()
      return
    }
    if (res.data.data.length === 1) {
      // $('.glyphicon-chevron-right').hide()
      // $('.glyphicon-chevron-left').hide()
      $carouselDirCtrl.hide()
      $carouselIndicators.hide()
    }
    if (res.data.data.length !== 0) {
      $carouselInner.html('')
    }

    res.data.data.forEach((obj, i) => {
      if (i === 0) {
        let img = new Image()
        img.src = obj.pircUrlWhole
        img.onload = () => {
          $('#carousel-banner', $container).show()
          $('.banner-loading', $container).remove()
        }
      } else {
        active = ''
      }

      if (obj.linkTag === 0) {
        carouselNd += `<div class="item ${active}"><a href="${obj.linkUrl}" target="_blank"><img src="${obj.pircUrlWhole}", alt=""></a></div>`
      } else if (obj.linkTag === 1) {
        carouselNd += `<div class="item ${active}"><a href="/detail?shopId=${shopId}&productId=${obj.linkUrl}" target="_blank"><img src="${obj.pircUrlWhole}", alt=""></a></div>`
      } else if (obj.linkTag === -1) {
        carouselNd += `<div class="item ${active}"><a><img src="${obj.pircUrlWhole}", alt=""></a></div>`
      }

      if (i === 0) {
        carouselIdc += `<li data-target="#carousel-banner" data-slide-to="${i}" class="active">${i + 1}</li>`
      } else {
        carouselIdc += `<li data-target="#carousel-banner" data-slide-to="${i}">${i + 1}</li>`
      }
    })
    $carouselInner.append(carouselNd)
    $carouselIndicators.html(carouselIdc)
  }
})
