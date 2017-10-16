/* global plat */
/**
 * Created by wangzhw on 2017/5/09.
 */
// import Utils from '../../../common/js/serveice'
import ProfileApi from '../../../common/js/profile/profile'
import visibleList from '../../views/profile/profile/common/visible-xs-list.jade'
import hiddenList from '../../views/profile/profile/common/hidden-xs-list.jade'
import downLi from '../../views/profile/profile/common/downloadLi.jade'
// import pagerT from '../../views/components/pager.jade'
// import {clickBindDom} from '../../../common/js/pagination'
import '../home/common/header'

let NProgress = window.NProgress
NProgress.done()

const $ = window.$
let $slideContainer = $('.trademark')
let $downloadContainer = $('.download>ul')
let payList = []
const shopId = ProfileApi.getUrlParams('shopId')
// const productGroupId = ProfileApi.getUrlParams('groupId') || ''

// 获取支付方式
ProfileApi.getPayList({shopId}).then(res => {
  if (!res.data.code) {
    payList = res.data.data
  }

  // 公司业务信息
  ProfileApi.getBusinessInfo({shopId}).then(res => {
    if (res.data && !res.data.code) {
      let business = res.data.data
      let businessType = business.businessType
      if (businessType !== '' && businessType !== null) {
        switch (businessType) {
          case '0':
            businessType = 'Manufacturer'
            break
          case '1':
            businessType = 'Distribution and wholesale'
            break
          case '2':
            businessType = 'Investment agent'
            break
          case '3':
            businessType = 'Business services'
            break
          default:
            businessType = 'Other'
            break
        }
      } else {
        businessType = '-'
      }

      $('#profile-business .profile-value').html('<p></p>')
      let registeredTime = business.registeredTime
      if (business.registeredTime === '' || business.registeredTime === null) {
        registeredTime = '-'
      } else {
        registeredTime = ProfileApi.format(business.registeredTime, 'yyyy-MM-dd')
      }
      let totalEmployees = `${business.totalEmployees} Persons`
      if (business.totalEmployees === '' || business.totalEmployees === null) {
        totalEmployees = '-'
      }
      let registered = ''
      if (business.moneyCode === '' || business.moneyCode === null || business.registeredCapital === null || business.registeredCapital === '') {
        registered = '-'
      } else {
        registered = `${business.moneyCode} ${parseInt(business.registeredCapital) / 1000000} Million`
      }
      let annualOutput = ''
      if (business.moneyCode === '' || business.moneyCode === null || business.annualOutputValue === null || business.annualOutputValue === '') {
        annualOutput = '-'
      } else {
        annualOutput = `${business.moneyCode} ${parseInt(business.annualOutputValue) / 1000000} Million`
      }
      let totalExport = ''
      if (business.moneyCode === '' || business.moneyCode === null || business.totalExportRevenue === null || business.totalExportRevenue === '') {
        totalExport = '-'
      } else {
        totalExport = `${business.moneyCode} ${parseInt(business.totalExportRevenue) / 1000000} Million`
      }
      let exportPercentage = `${business.exportPercentage}%`
      if (business.exportPercentage === '' || business.exportPercentage === null || business.exportPercentage === '0') {
        exportPercentage = '-'
      }
      let averageLeadTime = `${business.averageLeadTime} day(s)`
      if (business.averageLeadTime === '' || business.averageLeadTime === null) {
        averageLeadTime = '-'
      }
      let acceptedPaymentType = business.acceptedPaymentType
      let paystr = ''
      if (acceptedPaymentType !== '' && acceptedPaymentType !== null && acceptedPaymentType.indexOf(',') > 0) {
        let acceptedPaymentTypes = acceptedPaymentType.split(',')
        payList.forEach((pay) => {
          acceptedPaymentTypes.forEach((type) => {
            if (pay.id === type) {
              if (paystr === '') {
                paystr = paystr + pay.name
              } else {
                paystr = paystr + ',' + pay.name
              }
              // console.log(paystr)
              // return
            }
          })
        })
      }

      $('.profile-1 p').attr('title', registeredTime)
      $('.profile-2 p').attr('title', totalEmployees)
      $('.profile-3 p').attr('title', registered)
      $('.profile-4 p').attr('title', businessType)
      $('.profile-5 p').attr('title', annualOutput)
      $('.profile-6 p').attr('title', totalExport)
      $('.profile-7 p').attr('title', exportPercentage)
      $('.profile-8 p').attr('title', business.topMarkets)
      $('.profile-9 p').attr('title', averageLeadTime)
      $('.profile-10 p').attr('title', business.exportLicenseNo)
      $('.profile-11 p').attr('title', business.topProducts)
      $('.profile-12 p').attr('title', business.acceptedPaymentType ? paystr : '')
      $('.profile-13 p').attr('title', business.acceptPaymentCurrency)
      $('.profile-14 p').attr('title', business.businessAddress)
      $('.profile-1 p').html(registeredTime)
      $('.profile-2 p').html(totalEmployees || '-')
      $('.profile-3 p').html(registered || '-')
      $('.profile-4 p').html(businessType || '-')
      $('.profile-5 p').html(annualOutput || '-')
      $('.profile-6 p').html(totalExport || '-')
      $('.profile-7 p').html(exportPercentage || '-')
      $('.profile-8 p').html(business.topMarkets || '-')
      $('.profile-9 p').html(averageLeadTime || '-')
      $('.profile-10 p').html(business.exportLicenseNo || '-')
      $('.profile-11 p').html(business.topProducts || '-')
      $('.profile-12 p').html(business.acceptedPaymentType ? paystr : '-')
      $('.profile-13 p').html(business.acceptPaymentCurrency || '-')
      $('.profile-14 p').html(business.businessAddress || '-')
    }
  })
})

// 公司简介
ProfileApi.getProfile({shopId}).then(res => {
  if (res.data && !res.data.code) {
    let compDesc = res.data.data.compDesc   // 简介
    let compBackgroundWhole = res.data.data.compBackgroundWhole  // 背景图
    let compDescImgWhole = res.data.data.compDescImgWhole   // 简介背景图

    if (compDescImgWhole !== '' && compDescImgWhole !== null && compDescImgWhole !== undefined) {
      $('#companydesc img').attr('src', compDescImgWhole)
    } else {
      $('#companydesc img').attr('src', '/images/dif_descImg.png')
    }
    if (compDesc && compDesc.indexOf('\n') >= 0) {
      compDesc = compDesc.replace(/\n/g, '<br/>')
    }
    $('.comDesc').html(compDesc)
    if (compBackgroundWhole !== '' && compBackgroundWhole !== null && compBackgroundWhole !== undefined) {
      $('#profile-topBanner img').attr('src', compBackgroundWhole)
    } else {
      $('#profile-topBanner img').attr('src', '/images/dif_descImg.png')
    }
  } else {
    $('#profile-topBanner img').attr('src', '/images/dif_descImg.png')
  }
})

// 资质列表
let certList = []
ProfileApi.getCertList({shopId}).then(res => {
  if (res.data && !res.data.code) {
    certList = res.data.data
    if ((certList.length > 0) || plat === 2) {
      $('#trademarks').show()
    } else {
      $('#trademarks').hide()
    }

    /**
     * 渲染列表
     */
    if (certList.length <= 4) {
      $('.icon-arrow-left').hide()
      $('.icon-arrow-right').hide()
    }
    let $hiddenList = $(hiddenList({certList}))
    let $visibleList = $(visibleList({certList}))

    $hiddenList.data(certList)
    $visibleList.data(certList)
    $slideContainer.append($hiddenList)
    $slideContainer.append($visibleList)

    $('.img-container').on('click', function () {
      let imgSrc = $(this).children('img')[0].src
      $('.big-image').attr('src', imgSrc)
      let index = $(this).parent().attr('data-i')
      let totalIndex = certList.length

      $('.mask-container').modal('show')
      $('.glyphicon-chevron-right').on('click', function () {
        index++
        if (index >= totalIndex) {
          index = 0
        }
        imgSrc = certList[index].urlWhole
        $('.big-image').attr('src', imgSrc)
      })

      $('.glyphicon-chevron-left').on('click', function () {
        index--
        if (index < 0) {
          index = totalIndex - 1
        }
        imgSrc = certList[index].urlWhole
        $('.big-image').attr('src', imgSrc)
      })
      $('.mask-container').on('click', function (event) {
        var obj = event.target
        var objclass = $(obj).attr('class')
        if (objclass !== '' && objclass !== undefined && (objclass.indexOf('icon-arrow') >= 0 || objclass.indexOf('close') >= 0 || objclass.indexOf('big-image') >= 0)) {
        } else {
          $('.mask-container').modal('hide')
        }
      })
      $('.close-mask').on('click', function () {
        $('.mask-container').modal('hide')
      })
    })
  } else {
    if (plat === 2) {
      $('#trademarks').show()
    } else {
      $('#trademarks').hide()
    }
  }
})

/**
 * 下载列表
 */
let map = {xlsx: 'excel', xls: 'excel', xlsm: 'excel', txt: 'tex', pdf: 'pdf', ppt: 'ppt', pptx: 'ppt', doc: 'word', docx: 'word', rar: 'rar', zip: 'rar'}
console.log(navigator.userAgent)
if (/iPhone|iPod|ios/i.test(navigator.userAgent)) {
  $('#download').hide()
} else {
  ProfileApi.getDownload({shopId}).then(res => {
    let records = res.data.data
    if ((records.length > 0) || plat === 2) {
      $('#download').show()
    } else {
      $('#download').hide()
    }

    // console.log(records)
    records.forEach((item) => {
      let p = map[item.attachType]
      if (p) {
        item.icon = p
      } else {
        item.icon = 'noIcon'
      }

      let $down = $(downLi(item))
      $downloadContainer.append($down)
    })
  })
}

$('.icon-arrow-right').on('click', function () {
  let showContainerNd = $('.show-container')
  let leftNd = $('.hidden-left')
  let rightNd = $('.hidden-right')
  let rLn = rightNd.children().length

  if (!rLn) return

  leftNd.append(showContainerNd.children()[0])
  showContainerNd.append(rightNd.children()[0])
})

$('.icon-arrow-left').on('click', function () {
  let showContainerNd = $('.show-container')
  let leftNd = $('.hidden-left')
  let rightNd = $('.hidden-right')
  let showLn = showContainerNd.children().length
  let lLn = leftNd.children().length

  if (!lLn) return

  rightNd.prepend(showContainerNd.children()[showLn - 1])
  showContainerNd.prepend(leftNd.children()[lLn - 1])
})

let x1
let x2

/**
 * 获取触摸起点
 */
$slideContainer.on('touchstart', (e) => {
  let _touch = e.targetTouches[0]
  x1 = _touch.pageX
})

/**
 * 滑动结束点
 */
$slideContainer.on('touchend', (e) => {
  let _touch = e.changedTouches[0]
  x2 = _touch.pageX

  if (x2 - x1 > 30) {
    let showContainerNd = $('.show-container-xs')
    let leftNd = $('.hidden-left-xs')
    let rightNd = $('.hidden-right-xs')
    let rLn = rightNd.children().length

    if (!rLn) return

    leftNd.append(showContainerNd.children()[0])
    showContainerNd.append(rightNd.children()[0])
  } else if (x2 - x1 < -30) {
    let showContainerNd = $('.show-container-xs')
    let leftNd = $('.hidden-left-xs')
    let rightNd = $('.hidden-right-xs')
    let showLn = showContainerNd.children().length
    let lLn = leftNd.children().length

    if (!lLn) return

    rightNd.prepend(showContainerNd.children()[showLn - 1])
    showContainerNd.prepend(leftNd.children()[lLn - 1])
  }
})
