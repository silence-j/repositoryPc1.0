/**
 * Created by wangzhw on 2017/5/09.
 */
import Utils from '../../../../common/js/serveice'
import homeApi from '../../../../common/js/home'
import collectApi from '../../../../common/js/collect/collectAPI'
import groupT from '../../../views/components/group.jade'
import productMenu from '../../../views/products/products/product-menu.jade'
import '../../../../common/js/sw-config'
import '../../../../common/js/home/index'

let $ = window.$
let $searchBar = $('.search-bar')
let $hiddenSearch = $('.hidden-search')
let $logoImg = $('.logo-img')
let $pcSearch = $('.hidden-search')
let $mbSearch = $('.mbSearch')
let $mbSearchCntr = $('.mbSearch-wrapper')

/**
 * footer区域
 */
const $footer = $('.footer-container')
const $iconTop = $('.icon-top')
const $tel = $('.tel', $footer)
const $email = $('.email', $footer)
const $location = $('.location', $footer)
const $icon = $('.icon-num', $footer)

var isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)
if (isSafari) {
  $('html').addClass('safari')
}

/**
 * 获取头部banner
 */
const shopId = homeApi.getUrlParams('shopId')
homeApi.getCompanyDetail({shopId}).then((res) => {
  if (res.data && !res.data.code) {
    if (res.data.data) {
      $logoImg.show()
      localStorage.setItem('sellerId', res.data.data.sellerId)
      if (res.data.data.shopLogoWhole !== null && res.data.data.shopLogoWhole !== '') {
        $logoImg.attr('src', res.data.data.shopLogoWhole)
      } else {
        $logoImg.attr('src', '/images/DefaultLogo.png')
      }
      $tel.text(res.data.data.contactTelephone)
      $email.text(res.data.data.contactEmail)
      $location.text(res.data.data.address)

      if ((res.data.data.facebookUrl === null || res.data.data.facebookUrl === '') && (res.data.data.twitterUrl === null || res.data.data.twitterUrl === '') && (res.data.data.linkedinUrl === null || res.data.data.linkedinUrl === '')) {
        $('#footer').hide()
      }

      if (res.data.data.facebookUrl !== null && res.data.data.facebookUrl !== 'null' && res.data.data.facebookUrl !== '') {
        $icon.append(`<a href="${res.data.data.facebookUrl}" target="_blank"><i class="glyphicon glyphicon-facebook"></i></a>`)
        $iconTop.append(`<a href="${res.data.data.facebookUrl}" target="_blank"><i class="glyphicon glyphicon-facebook"></i></a>`)
      } else {
        $icon.append(`<a><i class="glyphicon glyphicon-facebook"></i></a>`)
        $iconTop.append(`<a><i class="glyphicon glyphicon-facebook"></i></a>`)
      }
      if (res.data.data.twitterUrl !== null && res.data.data.twitterUrl !== 'null' && res.data.data.twitterUrl !== '') {
        $icon.append(`<a href="${res.data.data.twitterUrl}" target="-_blank"><i class="glyphicon glyphicon-twitter"></i></a>`)
        $iconTop.append(`<a href="${res.data.data.twitterUrl}" target="_blank"><i class="glyphicon glyphicon-twitter"></i></a>`)
      } else {
        $icon.append(`<a><i class="glyphicon glyphicon-twitter"></i></a>`)
        $iconTop.append(`<a><i class="glyphicon glyphicon-twitter"></i></a>`)
      }
      if (res.data.data.linkedinUrl !== null && res.data.data.linkedinUrl !== 'null' && res.data.data.linkedinUrl !== '') {
        $icon.append(`<a href="${res.data.data.linkedinUrl}" target="_blank"><i class="glyphicon glyphicon-linkedIn"></i></a>`)
        $iconTop.append(`<a href="${res.data.data.linkedinUrl}" target="_blank"><i class="glyphicon glyphicon-linkedIn"></i></a>`)
      } else {
        $icon.append(`<a><i class="glyphicon glyphicon-linkedIn"></i></a>`)
        $iconTop.append(`<a><i class="glyphicon glyphicon-linkedIn"></i></a>`)
      }
    }
  }
})

/**
 * 获取登录用户信息
 */
// homeApi.getUserInfo({}).then(res => {
//   console.log(res.data)
//   console.log(res.data.data)
//   if (res.data && !res.data.code) {
//     let usename = $('.username')
//     usename.text(res.data.data.nickName)
//     usename.attr('href', apiHost + '/b2b_pc/static/view/account/myCenter.html')
//     $('.user-loged').show()
//     $('.user-opration').hide()
//     // 存用户信息
//     localStorage.setItem('isLogin', 1)
//     localStorage.setItem('buyer', JSON.stringify(res.data.data))
//   } else {
//     localStorage.removeItem('isLogin')
//     localStorage.removeItem('buyer')
//     $('.user-loged').hide()
//     $('.user-opration').show()
//   }
// })

/**
 * 获取分组列表
 */
homeApi.getGroup({shopId}).then((res) => {
  if (res.data && !res.data.code) {
    let groups = res.data.data
    if (groups.length > 0) {
      let $groups = $(groupT({groups, shopId}))
      $groups.data(groups)
      $('.drop-menu').append($groups)
      // products列表分组
      if (window.location.href.indexOf('/products') !== -1) {
        let $productMenu = $(productMenu({groups: groups, shopId: shopId}))
        $productMenu.data(groups)
        $('.product-menu-loading').remove()
        $('.product-menu').append($productMenu)

        let gid = Utils.getUrlParams('groupId')
        let gidNode = $(`[gid="${gid}"]`)
        if (gidNode.length > 0) {
          gidNode.addClass('active')
          if (gidNode.parent().is('li')) {
            gidNode.closest('.panel').find('.panel-heading [data-toggle]').trigger('click')
          } else {
            gidNode.siblings('a').addClass('active')
          }
        }
      }
    }
  }
})

$searchBar.on('click', (e) => {
  e.preventDefault()
  $hiddenSearch.removeClass('zoomOut').addClass('zoomIn')
  $hiddenSearch.css('display', 'block')
  $('.search-tip-list').hide()
})
$('.close-input', $hiddenSearch).on('click', (e) => {
  $hiddenSearch.removeClass('zoomIn').addClass('zoomOut').one('animationend', () => {
    $hiddenSearch.css('display', 'none')
    $hiddenSearch.find('input').val('')
  })
})

$('.search-menu').on('click', (e) => {
  e.preventDefault()
  $mbSearchCntr.removeClass('zoomOut').addClass('zoomIn')
  $mbSearchCntr.css('display', 'block')
})
$('.header').on('click', '.close-input', (e) => {
  $mbSearchCntr.removeClass('zoomIn').addClass('zoomOut').one('animationend', () => {
    $mbSearchCntr.css('display', 'none')
    $mbSearchCntr.find('input').val('')
  })
})

$('.header').on('input', '#input-down, .mbSearch .form-control', (e) => {
  let $inputDown = $(e.currentTarget)
  let $searchTipCntr = $inputDown.closest('.input-group').find('.search-tip-list')
  $searchTipCntr.empty()

  let productName = $inputDown.val()
  if (productName.length > 0) {
    $inputDown.addClass('inputed')
  } else {
    $inputDown.removeClass('inputed')
    $searchTipCntr.hide()
    return
  }

  // 关键词列表加载
  homeApi.getProductNum({shopId, productName}).then((res) => {
    if (res.data && !res.data.code) {
      let records = res.data.data.records
      if (records.length < 1) {
        $(`<li class="empty">No related products...</li>`).appendTo($searchTipCntr)
        return
      }

      records.forEach((item) => {
        $(`<li data-id="${item.productId}">${item.productName}</li>`).appendTo($searchTipCntr)
      })
    } else {
      $(`<li class="empty">No related products...</li>`).appendTo($searchTipCntr)
    }
  })

  $searchTipCntr.show()
})
.on('click', '.search-tip-list li', (e) => {
  let $clickLi = $(e.currentTarget)
  if ($clickLi.hasClass('empty')) {
    return
  }

  let keywords = $clickLi.text()
  if (keywords) {
    // $clickLi.closest('.input-group').find('.form-control').val(keywords)
    // $clickLi.closest('.input-group').find('.search-btn').trigger('click')
    let productId = $clickLi.data('id')
    window.location.href = `/detail?shopId=${shopId}&productId=${productId}`
  }
})

$('.navbar-toggle').on('click', function (e) {
  if (!$(this).hasClass('active')) {
    $(this).addClass('active')
    $('.menu-close').show()
    $('.menu-open').hide()
  } else {
    $(this).removeClass('active')
    $('.menu-close').hide()
    $('.menu-open').show()
  }
})

let searchFn = function () {
  let searchValue = encodeURI(encodeURI($('input', $(this).closest('.input-group')).val()))
  if (!searchValue) return
  window.location.href = `/search?searchText=${searchValue}&shopId=${shopId}`
}

$('.search-btn', $pcSearch).on('click', searchFn)
$('.search-btn', $mbSearch).on('click', searchFn)
$('.hidden-search input').on('keyup', function (event) {
  if (event.keyCode === 13) {
    $('.search-btn', $pcSearch).trigger('click')
  }
})

/**
 * 初始化回到页面顶部
 * @param {string} tarBtn       触发按钮
 * @param {string} resHeight    触发高度
 */
let initGoTop = function (tarBtn, resHeight) {
  let offset = resHeight // 触发按钮显示的页面上卷高度
  let offsetOpacity = 3840 // 降低按钮透明的页面上卷高度
  let scrollTopDuration = 500 // 执行动画时间
  let $backToTop = $(tarBtn)

  // 显示/隐藏按钮
  $(window).scroll(function () {
    ($(this).scrollTop() > offset)
      ? $backToTop.addClass('cd-is-visible')
      : $backToTop.removeClass('cd-is-visible cd-fade-out')

    if ($(this).scrollTop() > offsetOpacity) {
      $backToTop.addClass('cd-fade-out')
    } else {
      $backToTop.removeClass('cd-fade-out')
    }
  })

  // 执行下拉动作
  $backToTop.on('click', function (event) {
    event.preventDefault()
    $('html, body').animate({
      scrollTop: 0
    }, scrollTopDuration)
  })
}
initGoTop('.cd-top', 100)

collectApi.getCollect({'shopId': shopId})
