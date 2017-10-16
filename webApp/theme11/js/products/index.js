/**
 * Created by wangzhw on 2017/5/09.
 */
import Utils from '../../../common/js/serveice'
import homeApi from '../../../common/js/home'
import '../home/common/header'
import productListT from '../../views/components/list.jade'
import pagerT from '../../views/components/pager.jade'
import {clickBindDom} from '../../../common/js/pagination'

const $ = window.$
let $listContainer = $('.products-container-list')
let $loadingTitle = $('.loading-search-title')
let $productBg = $('#products-topBanner')

let NProgress = window.NProgress
NProgress.done()

let totalPage
let currentPage = 1 // 当前页

const size = 9
const shopId = homeApi.getUrlParams('shopId')
const productGroupId = homeApi.getUrlParams('groupId') || ''

$('.products-container-list').on('mouseenter', '.p-item', function () {
  let pList = $(this).parent()
  if (pList.find('.p-item.over-copy').length < 1) {
    $(this).clone().addClass('over-copy').appendTo(pList)
  }
})
$('.products-container-list').on('mouseleave', '.p-list', function () {
  let pItem = $(this).find('.p-item.over-copy')
  if (pItem.length > 0) {
    pItem.remove()
  }
})

/**
 * product背景图
 * @param page
 * @param loadingPage
 */
homeApi.getAdvert({shopId, position: 'BACKGROUND'}).then(res => {
  if (res.data && !res.data.code) {
    // 主题默认图片
    res.data.data.push({
      // pircUrlWhole: '/assets/theme16/images/default_product_bg.png'
      pircUrlWhole: '/images/defaultPro.png'
    })

    res.data.data.forEach((obj, i) => {
      if (i === 0) {
        let img = `<img src="${obj.pircUrlWhole}", alt="">`
        $productBg.append(img)
      }
    })
  }
})

let getProductListByPage = (page, loadingPage, append) => {
  currentPage = page

  // 如果存在商品列表 则清空
  if ($('.p-list')) {
    $('.list-loading').show()
    if (!append) {
      $listContainer.empty()
    }
  }

  homeApi.getProductNum({shopId, size, productGroupId, page}).then((res) => {
    if (res.data && !res.data.code) {
      let records = res.data.data.records // 商品记录

      if ((records.length === 0 || records === null) && $('.p-list').length < 1) {
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
      records.forEach((item) => {
        let products = {
          shopId,
          index: false,
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
      if (loadingPage && res.data.data.totalCount > 0 && res.data.data.totalPages > 0 && res.data.data.totalPages > 1) {
        console.log(1111)
        let $pagerT = $(pagerT(pages))
        $pagerT.data(pages)
        $('.product-list').append($pagerT)
        // 为分页绑定点击回调事件
        clickBindDom(totalPage, getProductListByPage)
      }

      // 记录当前页码
      let loadBtn = $('.product-list .load-more')
      if (loadBtn.length > 0) {
        if (records.length > 0) {
          loadBtn.data('currentpage', page)
        } else if (append) {
          Utils.alert('No more to load')
          loadBtn.prop('disabled', true)
        }
      }
      // 点击menu事件
      let isReverse = false
      $('.caret-link').on('click', function () {
        if (!isReverse) {
          isReverse = true
          $(this).parent().addClass('reverse')
        } else {
          isReverse = false
          $(this).parent().removeClass('reverse')
        }
      })
    }
  })
}

getProductListByPage(currentPage, true)

$('.product-list').on('click', '.load-more', function () {
  let loadBtn = $(this)
  let currentPage = loadBtn.data('currentpage')
  getProductListByPage(parseInt(currentPage) + 1, false, true)
})
