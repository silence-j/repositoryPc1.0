import Validator from '../../../common/js/verification'
import ContactsApi from '../../../common/js/detail/detailApi'
import BlogAPI from '../../../common/js/blog/blogAPI'
import Utils from '../../../common/js/serveice'
import homeApi from '../../../common/js/home'
import pagerT from '../../../theme1/views/components/pager.jade'
import {clickBindDom} from '../../../common/js/pagination'

let NProgress = window.NProgress
NProgress.done()

let $ = window.$
const shopId = homeApi.getUrlParams('shopId')
let pagei = homeApi.getUrlParams('page') || 1
let form = $('#form')
/**
 * 请求页码信息 ，初始化分页
 */
let blogInfoObj = {
  page: pagei,
  paging: true,
  size: 10,
  shopId: shopId
}
BlogAPI.getBlogs(blogInfoObj).then(res => {
  setPage(res.data.data.page, res.data.data.totalPages)
})
/**
 * 设置背景图
 */
let blogBgQueryObj = {
  shopId: shopId,
  position: 'BLOG'
}
BlogAPI.getBlogBg(blogBgQueryObj).then(res => {
  let imgUrl = res.data.data[0].pircUrlWhole
  $('#blog-bg-img').attr('src', imgUrl)
})

/**
 * 伸缩博客图片
 * @type {[type]}
 */
var blogImgs = $('.blog-content img')
for (let img of blogImgs) {
  $(img).css('height', 'auto')
  $(img).css('max-width', '100%')
}
/**
 * 设置页码
 */
function setPage (current, totalpages) {
  var pages = {
    currentPage: current,
    pages: totalpages
  }
  var $pagerT = $(pagerT(pages))
  $pagerT.data(pages)
  $('.page-wraper').append($pagerT)
  clickBindDom(totalpages, function (page) {
    console.log(page)
    window.location.href = '/blog/' + shopId + '?page=' + page
  })
}

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
  let msg = $('#msg').val()
  return Validator.checkEmail(email) && company.length > 0 && msg.length > 0 && firstName.length > 0 && lastName.length > 0
}
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
$(document).on('click', '.able', (e) => {
  e.stopPropagation()
  let params = {}
  let form = $('#form')
  let data = form.serializeArray()
  for (let i = 0, len = data.length; i < len; i++) {
    params[data[i].name] = data[i].value
  }
  params['shopId'] = Utils.getUrlParams('shopId')
  params['source'] = 'Blog'
  params['blogId'] = $('#blogId').val()
  let buyer = JSON.parse(localStorage.getItem('buyer')) // 买家信息
  let cook = localStorage.getItem('pageviewCookie')
  if (buyer) {
    params['buyerId'] = buyer.id
    params['buyerChannel'] = buyer.channel === 'FACEBOOK' ? 1 : (buyer.channel === 'GOOGLE' ? 2 : 0)
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
