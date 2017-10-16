/**
 * @author monkeywang
 * Date: 17/4/19
 * desc: 首页
 */
const $ = window.$
import homeApi from '../../../common/js/home'
import '../home/common/header'
import productListT from '../../views/components/list.jade'
import pagerT from '../../views/components/pager.jade'
import {clickBindDom} from '../../../common/js/pagination'

let $listContainer = $('.products-container-list')
let $loadingTitle = $('.loading-search-title')
let $productBg = $('#products-topBanner')

let NProgress = window.NProgress
NProgress.done()

let totalPage
let currentPage = 1 // 当前页
const size = 12
const shopId = homeApi.getUrlParams('shopId')
const productGroupId = homeApi.getUrlParams('groupId') || ''

/**
 * product背景图
 * @param page
 * @param loadingPage
 */
homeApi.getAdvert({shopId, position: 'BACKGROUND'}).then(res => {
  if (!res.data.code) {
    if (res.data.data !== null && res.data.data.length !== 0) {
      res.data.data.forEach((obj, i) => {
        if (i === 0) {
          let img = `<img src="${obj.pircUrlWhole}", alt="">`
          $productBg.append(img)
        }
      })
    } else {
      let img = `<img src="/images/defaultPro.png", alt="" class="default-product">`
      $productBg.append(img)
    }
  }
})

let getProductListByPage = (page, loadingPage, isMobile) => {
  currentPage = page
  // 如果存在商品列表 则清空
  if ($('.p-list') && !isMobile) {
    $('.list-loading').show()
    $listContainer.empty()
  }
  homeApi.getProductNum({shopId, size, productGroupId, page, productStatus: -1}).then((res) => {
    if (!res.data.code) {
      let records = res.data.data.records // 商品记录
      if (records.length === 0 || records === null) {
        $('.list-loading').hide()
        $loadingTitle.remove()
        let noList = '<div class="boxImg"><img src="/images/empty.png" alt=""><p>The product is empty...</p></div>'
        $listContainer.append(noList)
      }
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
          shopId,
          index: false,
          i: i + 1 === records.length,
          src: item.productFirstPic,
          desc: item.productName,
          productId: item.productId
        }
        let $productList = $(productListT(products))
        $productList.data(products)
        $listContainer.append($productList)
      })
      $('.num').text(res.data.data.totalCount)
      $('.list-loading').hide()
      $('.product-desc').show()
      $loadingTitle.remove()
      /**
       * 判断是否要加载分页列表
       * 首次渲染列表需要显示分页的话 需要设置loadingPage = true
       */
      if (loadingPage && res.data.data.totalCount > 0 && res.data.data.totalPages > 1) {
        let $pagerT = $(pagerT(pages))
        $pagerT.data(pages)
        $('.product-list').append($pagerT)
        // 为分页绑定点击回调事件
        clickBindDom(totalPage, getProductListByPage)
        if (!$('.loader-more').length) {
          $('.product-list').append(`<div class="loader-more">点击加载更多...</div>`)
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
      /* 点击 Menu 事件 */
      $('.caret-link').on('click', function () {
        if ($(this).parent().hasClass('reverse')) {
          $(this).parent().removeClass('reverse')
        } else {
          $(this).parent().addClass('reverse')
        }
      })
    }
  })
}

getProductListByPage(currentPage, true)
