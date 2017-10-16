/**
 * @author shaohuan
 * Date: 17/3/27
 */
import api from '../../../../common/js/detail/detailApi'
import Utils from '../../../../common/js/serveice'
import pagerT from '../../../views/components/pager.jade'
import {clickBindDom} from '../../../../common/js/pagination'
import downTpl from '../../../views/detail/indexTemplate/downloadtpl.jade'
let $ = window.$
let shopId = Utils.getUrlParams('shopId')
let totalPage
// let currentPage = 1 // 当前页
let getDown = (page, first) => {
  // currentPage = page
  // let p = 149468631254729157
  let map = {xlsx: 'excel', xls: 'excel', xlsm: 'excel', txt: 'tex', pdf: 'pdf', ppt: 'ppt', doc: 'word', docx: 'word', rar: 'rar', zip: 'rar', gt: 'rar'}
  api.getDownload({shopId, page}).then(res => {
    let rec = res.data.data.records
    /**
     * 分页信息
     * @type {{currentPage: *, pages: *}}
     */
    let pages = {
      currentPage: page,
      pages: res.data.data.totalPages
    }
    totalPage = pages.pages // 总页数
    let downList = $('#down-list')
    let ul = downList.find('ul:eq(0)')
    ul.html('')
    rec.forEach((item) => {
      let p = map[item.attachType]
      if (p) {
        item.icon = p
      } else {
        item.icon = 'weizhi'
      }
      let $down = $(downTpl(item))
      // $productList.data(products)
      ul.append($down)
    })
    downList.parents('.detail-loading').removeClass('detail-loading')
    // 分页
    if (first) {
      let $pagerT = $(pagerT(pages))
      $pagerT.data(pages)
      downList.append($pagerT)
      // 为分页绑定点击回调事件
      clickBindDom(totalPage, getDown)
    }
  })
}
getDown(1, true)
