/**
 * Created by wangzhw on 2017/5/09.
 */
import Utils from '../../../common/js/serveice'
import homeApi from '../../../common/js/home'
import '../home/common/header'
import productListT from '../../views/components/list.jade'
import pagerT from '../../views/components/pager.jade'
import emptyResult from '../../views/search/search/search-empty.jade'
import {clickBindDom} from '../../../common/js/pagination'

const $ = window.$

let NProgress = window.NProgress
NProgress.done()

let $topSearchInput = $('.top-search input')
let $listContainer = $('.search-result-list')
let $searchText = $('.search-text')
let $searchTitle = $('.search-title')
let $searchNum = $('.num')
let $loadingTitle = $('.loading-search-title')

let totalPage
let shopId = homeApi.getUrlParams('shopId')
let productName = decodeURI(homeApi.getUrlParams('searchText'))
let currentPage = 1
let size = 8

$searchText.text(`"${productName}"`)
if ($topSearchInput.length > 0) {
  $topSearchInput.val(productName)
}

// $('.search-result-list').on('mouseenter', '.p-item', function () {
//   let pList = $(this).parent()
//   if (pList.find('.p-item.over-copy').length < 1) {
//     $(this).clone().addClass('over-copy').appendTo(pList)
//   }
// })
// $('.search-result-list').on('mouseleave', '.p-list', function () {
//   let pItem = $(this).find('.p-item.over-copy')
//   if (pItem.length > 0) {
//     pItem.remove()
//   }
// })

let getProductListByPage = (page, loadingPage, append) => {
  currentPage = page

  // 如果存在商品列表 则清空
  if ($('.p-list')) {
    $('.list-loading').show()
    if (!append) {
      $listContainer.empty()
    }
  }

  homeApi.getProductNum({shopId, productName, size, page}).then((res) => {
    if (res.data && !res.data.code) {
      let records = res.data.data.records // 商品记录
      $searchNum.text(res.data.data.totalCount)
      $loadingTitle.remove()
      $searchTitle.show()

      /**
       * 分页信息
       * @type {{currentPage: *, pages: *}}
       */
      let pages = {
        currentPage: page,
        pages: res.data.data.totalPages
      }

      totalPage = pages.pages // 总页数

      /**
       * 循环渲染列表
       */
      records.forEach((item) => {
        let products = {
          index: true,
          src: item.productFirstPic,
          desc: item.productName,
          productId: item.productId
        }
        let $productList = $(productListT(products))
        $productList.data(products)
        $listContainer.append($productList)
      })

      $('.list-loading').hide()

      if (!res.data.data.totalCount && $('.p-list').length < 1) {
        $('.search-result').empty()
        let $empty = $(emptyResult({searchText: productName}))
        $empty.data(productName)
        $('.search-result').append($empty)
      }

      /**
       * 判断是否要加载分页列表
       * 首次渲染列表需要显示分页的话 需要设置loadingPage = true
       */
      if (loadingPage && res.data.data.totalCount > 0) {
        let $pagerT = $(pagerT(pages))
        $pagerT.data(pages)
        $('.search-container').append($pagerT)
        // 为分页绑定点击回调事件
        clickBindDom(totalPage, getProductListByPage)
      }

      // 记录当前页码
      let loadBtn = $('.search-container .load-more')
      if (loadBtn.length > 0) {
        if (records.length > 0) {
          loadBtn.data('currentpage', page)
        } else if (append) {
          Utils.alert('No more to load')
          loadBtn.prop('disabled', true)
          loadBtn.hide()
        }
      }
    }
  })
}

getProductListByPage(currentPage, true)

$('.search-container').on('click', '.load-more', function () {
  let loadBtn = $(this)
  let currentPage = loadBtn.data('currentpage')
  getProductListByPage(parseInt(currentPage) + 1, false, true)
})
