'use strict'
let express = require('express');
let router = express.Router();
let httpRequest = require('../common/https-request')
let templateConf = require('../conf/templateConf')
/* GET users listing. */
router.get('/', function(req, res, next) {
  httpRequest.get(`/buyer/product/detail?productId=`+req.query.productId, (data) => {
    let resq = JSON.parse(data.toString())
    if (!resq.code) {
      var prod = resq.data.product
      var name = resq.data.shopName
      var title = prod.productName
      var desc = prod.productName
      var keywords = prod.productName
      var prodDescbs = ''
      var prodDesc = ''
      var extend = resq.data.productExtends
      if (extend) {
        prodDescbs = new Buffer(extend.productDesc)
        prodDesc = prodDescbs.toString('base64')
        delete resq.data.productExtends.productDesc
        title = extend.seoTitle || (prod.productName)
        /**
         * 产品seo描述 最多150个字
         * @type {[type]}
         */
        var desc160 = extend.seoDesc ? extend.seoDesc.substr(0,160) : prodDescbs.toString().replace(/<.*>/g,'')
        desc = desc160 || ''
        keywords = extend.seoKeywords || ''
      }
      let resqbs = new Buffer(data.toString())
      let resqstr = resqbs.toString('base64')
      templateConf(req, res, {
        url: '/views/detail/index',
        title: title,
        desc: desc,
        keywords: keywords,
        prodDetail: resqstr,
        prodDesc: prodDesc,
        pageCode:'detail'
      })
    }else {
      res.redirect("/users/404")
    }
  })


});

/**
 * 商品详情接口
 */
router.get('/buyer/product/detail', (req, res, next) => {
  httpRequest.get(`/buyer/product/detail${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    res.send(data);
  })
})
/**
 * 文件下载列表
 */
router.get('/buyer/content/file/list', (req, res, next) => {
  httpRequest.get(`/buyer/content/file/list${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    res.send(data);
  })
})
/**
 * 询盘提交
 */
router.post('/buyer/msg/product/add', (req, res, next) => {
  httpRequest.post(`/buyer/msg/product/add`,req.body, (data) => {
    if (res._header) return;
    res.send(data);
  })
})
/**
 * 加入购物车
 */
router.post('/buyer/cart/addproduct', (req, res, next) => {
  httpRequest.post(`/buyer/cart/addproduct`,req.body, (data) => {
    if (res._header) return;
    res.send(data);
  })
})
module.exports = router;