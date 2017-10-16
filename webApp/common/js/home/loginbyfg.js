/**
 * Created by shaohuan on 2017/8/11.
 */

import loginTpl from '../../components/loginbyfg.jade'
import userApi from '../user/userApi'
// import Utils from '../serveice'

const $ = window.$
const plat = window.plat
const $footer = $('.footer-container')
// 非卖家端编辑页面
if (plat === 0) {
  let noFaceGgLogin = localStorage.getItem('noFaceGgLogin')
  /**
 * 登陆弹框
 */
  setTimeout(() => {
    let isLogin = localStorage.getItem('isLogin')
    // 未登陆 并且没有叉掉登陆弹框
    if ((isLogin === null || +isLogin !== 1) && noFaceGgLogin !== '1') {
      let $loginStr = $(loginTpl({}))
      $footer.append($loginStr)
      $('#login-panel').show()
      $footer.on('click', '.close', (e) => {
        $('#login-panel').hide()
        $('#login-bar').css('display', 'block')
        $footer.addClass('has-login-bar')
        localStorage.setItem('noFaceGgLogin', 1)
      })
    }
  }, 5000)
  setTimeout(() => {
    let isLogin = localStorage.getItem('isLogin')
    // 未登陆
    // if ((isLogin === null || +isLogin !== 1)) {
    //   let $loginStr = $(loginTpl({}))
    //   $footer.append($loginStr)
    //   $('#login-bar').css('display', 'block')
    //   $footer.addClass('has-login-bar')
    // }
    // 未登陆已叉掉登陆弹框
    if ((isLogin === null || +isLogin !== 1) && noFaceGgLogin === '1') {
      let $loginStr = $(loginTpl({}))
      $footer.append($loginStr)
      $('#login-bar').css('display', 'block')
      $footer.addClass('has-login-bar')
    }
  }, 320)

  /**
 * facebook登录
 */
  let url = location.protocol + '//' + window.location.host + '/users/facebookBack/?shopId=' + window.shopId
  userApi.facebookOuth(url).then(res => {
    if (res.data.code === 0) {
      // if (plat === 1) {
      //   localStorage.removeItem('ggClick') // 习惯fb登陆的 去掉gg自动登陆
      //   window.location.href = res.data.data
      // } else {
      $footer.on('click', '.btn-face', (e) => {
        window.open(res.data.data, 'newwindow', 'height=400, width=600, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
      })
    }
  })
  /**
   * Google 登录
   */
  let callbackHtml = location.protocol + '//' + window.location.host + '/users/ggBack/?shopId=' + window.shopId
  userApi.ggLoginj({callbackHtml: callbackHtml}).then(res => {
    if (res.data.code === 0) {
      $footer.on('click', '.btn-gg', (e) => {
        window.open(res.data.data, 'newwindow', 'height=400, width=600, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
      })
    }
  })
}

window.Fshop = {
  loginSuccess: function () {
    localStorage.setItem('isLogin', 1)
    window.location.href = '/?shopId=' + window.shopId
  },
  loginFail: function (errMsg) {
    alert(errMsg)
  }
}
window.GGshop = {
  loginSuccess: function () {
    localStorage.setItem('isLogin', 1)
    window.location.href = '/?shopId=' + window.shopId
  },
  loginFail: function (errMsg) {
    alert(errMsg)
  }
}
