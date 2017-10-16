/**
 * @author monkeywang
 * Date: 17/4/20
 */
const $ = window.$
import homeApi from '../../../common/js/home'
import '../home/common/header'
import productListT from '../../views/components/list.jade'
import pagerT from '../../views/components/pager.jade'
import emptyResult from '../../views/search/search/search-empty.jade'
import {clickBindDom} from '../../../common/js/pagination'

let NProgress = window.NProgress
NProgress.done()

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

let getProductListByPage = (page, loadingPage, isMobile) => {
  currentPage = page
  // 如果存在商品列表 则清空
  if ($('.p-list') && !isMobile) {
    $('.list-loading').show()
    $listContainer.empty()
  }
  homeApi.getProductNum({shopId, productName, size, page}).then((res) => {
    if (!res.data.code) {
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
      records.forEach((item, i) => {
        let products = {
          index: true,
          i: i + 1 === records.length,
          src: item.productFirstPic,
          desc: item.productName,
          productId: item.productId
        }
        let $productList = $(productListT(products))
        $productList.data(products)
        $listContainer.append($productList)
      })
      $('.list-loading').hide()
      if (!res.data.data.totalCount) {
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
        if (!$('.loader-more').length) {
          $('.search-container').append(`<div class="loader-more">点击加载更多...</div>`)
          $('.loader-more').on('click', function () {
            currentPage++
            if (currentPage === totalPage) {
              $('.loader-more').text('已加载全部')
            } else if (currentPage > totalPage) {
              return
            }
            getProductListByPage(currentPage, true, true)
          })
        }
      }
    }
  })
}

getProductListByPage(currentPage, true)
