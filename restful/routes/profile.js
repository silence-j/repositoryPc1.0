/**
 * @author monkeywang
 * Date: 17/4/19
 */
'use strict'
let express = require('express');
let router = express.Router();
let httpRequest = require('../common/https-request')
let templateConf = require('../conf/templateConf')
/* GET home page. */
router.get('/', (req, res, next) => {
  templateConf(req, res, {
    url: '/views/profile/profile',
    pageCode:'profile',
    title: 'company profile',
    tag: 4
  })
});

/**
 * 公司信息
 */
router.get('/buyer/aboutus/company/find', (req, res, next) => {
  httpRequest.get(`/buyer/aboutus/company/find${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    return res.send(data);
  })
});

/**
 * 公司资质列表
 */
router.get('/buyer/aboutus/company/cert/list', (req, res, next) => {
  httpRequest.get(`/buyer/aboutus/company/cert/list${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    return res.send(data);
  })
});

/**
 * 下载列表
 */
router.get('/buyer/content/file/list', (req, res, next) => {
  httpRequest.get(`/buyer/content/file/list${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    return res.send(data);
  })
});

module.exports = router;