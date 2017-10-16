/**
 * Created by hideyoshi on 2017/7/7.
 */
import './loginbyfg.js'
import homeApi from '../home'

const $ = window.$
const plat = window.plat
const $header = $('.header')
const $bottom = $('.bottom', $header)
$(function () {
  $(window).scroll(function () {
    /**
     * 如果是seller端 ，禁止pin效果
     * @param  {[type]} plat [description]
     * @return {[type]}      [description]
     */
    if (plat === 2) {
      return
    }
    let $topContainer = $('.top', $header)
    let offset = $topContainer.css('height')
    let visible = $topContainer.css('display')
    if (visible === 'none') {
      offset = 0
    }
    if ($(this).scrollTop() >= parseInt(offset) - 1) {
      $bottom.pin({
        containerSelector: 'body',
        minWidth: 767,
        active: true
      })
    } else {
      $bottom.pin({
        active: false
      })
    }
  })
  var isTouch = ('ontouchstart' in window)
  if (isTouch) {
    $('.carousel').on('touchstart', function (e) {
      var that = $(this)
      var touch = e.originalEvent.changedTouches[0]
      var startX = touch.pageX
      var startY = touch.pageY
      $(document).on('touchmove', function (e) {
        touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
        var endX = touch.pageX - startX
        var endY = touch.pageY - startY
        if (Math.abs(endY) < Math.abs(endX)) {
          if (endX > 10) {
            $(this).off('touchmove')
            that.carousel('prev')
          } else if (endX < -10) {
            $(this).off('touchmove')
            that.carousel('next')
          }
          return false
        }
      })
    })
    $(document).on('touchend', function () {
      $(this).off('touchmove')
    })
  }
})
// 登出
$('.signOut').on('click', () => {
  homeApi.signout({}).then((res) => {
    if (!res.data.code) {
      window.location.href = res.data.data + '?shopId=' + window.shopId
      localStorage.removeItem('isLogin')
      localStorage.removeItem('buyer')
      localStorage.removeItem('ggClick')
    }
  })
})
/**
 * 获取登录用户信息
 */
homeApi.getUserInfo({}).then(res => {
  if (res.data && !res.data.code) {
    let usename = $('.username')
    usename.text(res.data.data.nickName || res.data.data.loginAccount)
    usename.attr('href', apiHost + '/b2b_pc/static/view/account/myCenter.html')
    $('.user-loged').show()
    $('.user-opration').hide()
    // 存用户信息
    localStorage.setItem('isLogin', 1)
    localStorage.setItem('buyer', JSON.stringify(res.data.data))
  } else {
    localStorage.removeItem('isLogin')
    localStorage.removeItem('buyer')
    $('.user-loged').hide()
    $('.user-opration').show()
  }
})
