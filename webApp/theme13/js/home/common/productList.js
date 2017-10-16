/* global plat */
/**
 * Created by wangzhw on 2017/5/09.
 */
import homeApi from '../../../../common/js/home'
import productListT from '../../../views/components/list.jade'

const $ = window.$
const shopId = homeApi.getUrlParams('shopId')
const size = 8 // 默认显示的条目数

// $('.productList').on('mouseenter', '.p-item', function () {
//   let pList = $(this).parent()
//   if (pList.find('.p-item.over-copy').length < 1) {
//     $(this).clone().addClass('over-copy').appendTo(pList)
//   }
// })
// $('.productList').on('mouseleave', '.p-list', function () {
//   let pItem = $(this).find('.p-item.over-copy')
//   if (pItem.length > 0) {
//     pItem.remove()
//   }
// })
$('.showMore-products').on('click', '.show-all', function () {
  window.location = `/products?shopId=${shopId}`
})

homeApi.getProductList({shopId, size}).then((res) => {
  if (res.data && !res.data.code) {
    let records = res.data.data
    if ((records.length === 0 || records === null)) {
      if (plat !== 2) {
        $('.newest-products').hide()
      }
      if (plat === 0) {
        $('.list-loading').remove()
      }
    } else {
      records.forEach((item) => {
        let products = {
          shopId,
          index: true,
          src: item.wholeProductFirstPic,
          desc: item.productName,
          productId: item.productId
        }

        let $productList = $(productListT(products))
        $productList.data(products)
        $('.productList').append($productList)
      })
      $('.list-loading').remove()
    }
  }
})
