/**
 * Created by wangzhw on 2017/5/09.
 */
import homeApi from '../../../../common/js/home'

const $ = window.$
const shopId = homeApi.getUrlParams('shopId')
const $describe = $('.discrible-text .text')
// const $img = $('#img-left')

/**
 * about us 图标+描述
 */
homeApi.getAboutus({shopId: shopId, previewTag: 0}).then(res => {
  if (res.data && !res.data.code) {
    let aboutImg = res.data.data.wholeDescImgUrl
    if (aboutImg === '' || aboutImg === null) {
      // 主题默认图片
      aboutImg = '/assets/theme16/images/default_home_shopDesc19.png'
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
      // 样式截字符串截不了 js截了 英文370 中文200
      let shortdesc = desc.substr(0, 371)
      let lett = getLetterLen(shortdesc)
      let alllen = shortdesc.length
      let ellp = ''
      if (lett < 50) {
        if (alllen > 200) {
          ellp = '...'
        }
        $describe.html(shortdesc.substr(0, 200) + ellp)
      } else {
        if (alllen > 370) {
          ellp = '...'
        }
        $describe.html(shortdesc + ellp)
      }
      // $('.discrible').append(`<p class="btn-wrapper"><a href="/profile?shopId=${shopId}" target="_blank" class="btn btn-default jump-to">LEARN MORE</a><p>`)
      $('.discrible').append(`<p class="btn-wrapper"><a href="/profile?shopId=${shopId}" target="_blank" class="btn btn-default jump-to"><i class="glyphicon glyphicon-plus"></i><span class="text">LEARN MORE</text></a></p>`)
      $('.text-loading').remove()
    }
  }
})

function getLetterLen (str) {
  if (/[a-z]/i.test(str)) {
    return str.match(/[a-z]/ig).length
  }
  return 0
}
