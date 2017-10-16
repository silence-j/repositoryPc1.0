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
    url: '/views/contacts/contacts',
    pageCode:'contacts',
    title: 'contact us',
    tag: 5
  })
});

/**
 * 询盘提交
 */
// router.post('/buyer/msg/product/add', (req, res, next) => {
//   httpRequest.post(`/buyer/msg/product/add`,req.body, (data) => {
//     if (res._header) return;
//     res.send(data);
//   })
// })

module.exports = router;