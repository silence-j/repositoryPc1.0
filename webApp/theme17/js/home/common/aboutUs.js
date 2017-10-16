/**
 * Created by wangzhw on 2017/5/09.
 */
import homeApi from '../../../../common/js/home'

const $ = window.$
const shopId = homeApi.getUrlParams('shopId')
const $describe = $('.discrible-text')
// const $img = $('#img-left')

/**
 * about us 图标+描述
 */
homeApi.getAboutus({shopId: shopId, previewTag: 0}).then(res => {
  if (res.data && !res.data.code) {
    let aboutImg = res.data.data.wholeDescImgUrl
    if (aboutImg === '' || aboutImg === null) {
      // 主题默认图片
      aboutImg = '/assets/theme16/images/default_home_shopDesc17.png'
      // aboutImg = '/images/CombinedShape.png'
    }

    let apImg = `<img class="img-left" src="${aboutImg}">`
    $('.ab-img-container').append(apImg)
    // $img.attr('src', res.data.data.wholeDescImgUrl)
    $('.img-hold').remove()
    let desc = res.data.data.shopDesc
    if (desc !== '' && desc !== null) {
      if (desc && desc.indexOf('\n') >= 0) {
        desc = desc.replace(/\n/g, '<br/>')
      }
      $describe.html(desc)
      // $('.discrible').append(`<p class="btn-wrapper"><a href="/profile?shopId=${shopId}" target="_blank" class="btn btn-default jump-to">LEARN MORE</a><p>`)
      // $('.discrible').append(`<p class="btn-wrapper"><a href="/profile?shopId=${shopId}" target="_blank" class="btn btn-default jump-to"><i class="glyphicon glyphicon-plus"></i><span class="text">LEARN MORE</text></a><p>`)
      $('.discrible').append(`<p class="btn-wrapper"><a href="/profile?shopId=${shopId}" target="_blank" class="btn btn-default jump-to"><i class="glyphicon glyphicon-plus"></i><span class="text">More</text></a><p>`)
      $('.text-loading').remove()
    }

    // image height of about us
    let $abImg = $('.ab-img-container')
    let $descText = $('.discrible-container')
    let discHeight = $descText.height() + 90 * 2
    let abImgWidth = $abImg.width()
    $abImg.css('padding-bottom', ((discHeight - 80) / abImgWidth * 100) + '%')
  }
})
