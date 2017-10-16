'use strict'
let express = require('express');
let router = express.Router();
let httpRequest = require('../common/https-request')
let templateConf = require('../conf/templateConf')
/* GET home page. */
router.get('/', (req, res, next) => {
  templateConf(req, res, {
    url: '/views/homePage/index',
    title: 'home',
    pageCode:'index',
    tag: 1
  })
});
/**
 * 广告位查询接口
 */
router.get('/bshop/shop/advert/show', (req, res, next) => {
  httpRequest.get(`/bshop/shop/advert/show${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    res.send(data);
  })
});

/**
 * 店铺信息查询
 */
router.get('/buyer/shop/company/detail', (req, res, next) => {
  httpRequest.get(`/buyer/shop/company/detail${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    res.send(data);
  })
});

/**
 * 商品列表接口
 */
router.get('/buyer/product/list', (req, res, next) => {
  httpRequest.get(`/buyer/product/list${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    res.send(data);
  })
});
/**
 * 商品分组
 */
router.get('/buyer/product/group/listall', (req, res, next) => {
  httpRequest.get(`/buyer/product/group/listall${req._parsedUrl.search}`, (data) => {
    console.log(data)
    if (res._header) return;
    return res.send(data);
  })
});
/**
 * aboutus
 */
router.get('/buyer/aboutus/desc/detail', (req, res, next) => {
  httpRequest.get(`/buyer/aboutus/desc/detail${req._parsedUrl.search}`, (data) => {
    console.log(data)
    if (res._header) return;
    return res.send(data);
  })
});


module.exports = router;
