// /**
//  * Created by admin on 2017/4/20.
//  */
import Validator from '../../../common/js/verification'
import ContactsApi from '../../../common/js/detail/detailApi'
import homeApi from '../../../common/js/home'
import Utils from '../../../common/js/serveice'
import '../home/common/header.js'

let NProgress = window.NProgress
NProgress.done()
/**
 * 询盘表单
 */
let $ = window.$
const shopId = homeApi.getUrlParams('shopId')
const $containerImg = $('#contacts-topImg')
let form = $('#form')
form.on('click', '.form-group>label', function () {
  $(this).parents('.form-group').find('.empty-input').focus()
})
form.on('focus', '.empty-input', function () {
  $(this).parents('.form-group').addClass('form-group-focus')
  console.log(0)
})
form.on('blur', '.empty-input', function () {
  let group = $(this).parents('.form-group').removeClass('form-group-focus')
  if ($(this).val()) {
    group.addClass('form-group-min')
  }
})

/**
 * contacts背景图
 */
homeApi.getAdvert({shopId, position: 'CONTACTS'}).then(res => {
  if (!res.data.code) {
    if (res.data.data !== null && res.data.data.length !== 0) {
      res.data.data.forEach((obj, i) => {
        if (i === 0) {
          let img = `<img src="${obj.pircUrlWhole}", alt="">`
          $containerImg.append(img)
        }
      })
    } else {
      let img = `<img src="/images/defaultPro.png", alt="" class="default-product">`
      $containerImg.append(img)
    }
  }
})
/**
 * 表单验证
 */
// let $send = $('.send')
let $validateInput = $('.validate-input')
/**
 * send表单验证
 */
function validateSend () {
  let firstName = $('#first-name').val()
  let lastName = $('#last-name').val()
  let company = $('#company').val()
  let email = $('#email').val()
  let phone = $('#phone').val()
  let msg = $('#msg').val()
  if (phone === '') {
    return Validator.checkEmail(email) && company.length > 0 && msg.length > 0 && firstName.length > 0 && lastName.length > 0
  } else {
    return Validator.checkEmail(email) && phone.length > 0 && company.length > 0 && msg.length > 0 && firstName.length > 0 && lastName.length > 0
  }
}
console.log(123)
/**
 * 输入验证
 */
$validateInput.on('input', (e) => {
  if (validateSend()) {
    $('.send').addClass('able')
  } else {
    $('.send').removeClass('able')
  }
}).on('blur', (e) => {
  let $thisObj = $(e.target)
  let inputValue = $thisObj.val()
  let name = $thisObj.attr('name')
  switch (name) {
    case 'firstName':
      // let ifFirst = Validator.checkName(inputValue)
      if (inputValue.length === 0) {
        console.log('输入错误')
        $thisObj.parent().addClass('error')
        $thisObj.next().addClass('hid')
      } else {
        $thisObj.parent().removeClass('error')
        $thisObj.next().removeClass('hid')
      }
      break
    case 'lastName':
      // let ifLast = Validator.checkName(inputValue)
      if (inputValue.length === 0) {
        console.log('输入错误')
        $thisObj.parent().addClass('error')
        $thisObj.next().addClass('hid')
      } else {
        $thisObj.parent().removeClass('error')
        $thisObj.next().removeClass('hid')
      }
      break
    case 'company':
      if (inputValue.length === 0) {
        console.log('输入错误')
        $thisObj.parent().addClass('error')
        $thisObj.next().addClass('hid')
      } else {
        $thisObj.parent().removeClass('error')
        $thisObj.next().removeClass('hid')
      }
      break
    case 'content':
      if (inputValue.length === 0) {
        console.log('输入错误')
        $thisObj.parent().addClass('error')
        $thisObj.next().addClass('hid')
      } else {
        $thisObj.parent().removeClass('error')
        $thisObj.next().removeClass('hid')
      }
      break
    case 'email':
      let ifEmial = Validator.checkEmail(inputValue)
      if (!ifEmial) {
        console.log('输入错误')
        $thisObj.parent().addClass('error')
        $thisObj.next().addClass('hid')
      } else {
        $thisObj.parent().removeClass('error')
        $thisObj.next().removeClass('hid')
      }
      break
    case 'phone':
      if (inputValue === '') {
        break
      } else {
        // let ifPhone = Validator.checkPhone(inputValue)
        // if (!ifPhone) {
          // $thisObj.parent().addClass('error')
          // $thisObj.next().addClass('hid')
        // } else {
          // $thisObj.parent().removeClass('error')
          // $thisObj.next().removeClass('hid')
        // }
      }
      break
  }
})

/**
 * 点击发送
 */
$('.contacts-list').unbind('click').on('click', '.able', (e) => {
  e.stopPropagation()
  let params = {}
  let form = $('#form')
  let data = form.serializeArray()
  for (let i = 0, len = data.length; i < len; i++) {
    params[data[i].name] = data[i].value
  }
  params['shopId'] = Utils.getUrlParams('shopId')
  params['source'] = 'Contact Us'
  let buyer = JSON.parse(localStorage.getItem('buyer')) // 买家信息
  let cook = localStorage.getItem('pageviewCookie') 
  if (buyer) {
    params['buyerId'] = buyer.id
    params['buyerChannel'] = buyer.channel === 'FACEBOOK'? 1 : (buyer.channel === 'GOOGLE' ? 2 : 0)
  }
  if (cook) {
    params['analyticsCookie'] = cook
  }
  ContactsApi.submitSupplier(params).then(res => {
    if (!res.data.code) {
      $('#first-name').val('').parent().removeClass('valid')
      $('#last-name').val('').parent().removeClass('valid')
      $('#company').val('').parent().removeClass('valid')
      $('#email').val('').parent().removeClass('valid')
      $('#phone').val('').parent().removeClass('valid')
      $('#msg').val('').parent().removeClass('valid')
      $('.send').removeClass('able')
      Utils.alert('Thanks for your feedback, we will have sales contact later')
    } else {
      Utils.alert(res.data.message, 'info')
    }
  })
})
