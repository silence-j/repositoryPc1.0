// 公共了除1之外的模板
import ContactsApi from '../detail/detailApi'
import Utils from '../serveice'
/**
 * 点击发送
 */
let $send = $('.send')
$send.on('click', (e) => {
  if (!$send.hasClass('able')) {
    return
  }

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
    if (res.data && !res.data.code) {
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
