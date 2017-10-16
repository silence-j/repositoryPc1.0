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
  let fb = 0
  if (req.query.fb === '1') {
    fb = 1
  }
  res.cookie("fb", fb , {maxAge: 1000 * 60 * 60 * 24 * 30});

  let groupid = req.query.groupId ? req.query.groupId: ''
  templateConf(req, res, {
      url: '/views/products/products',
      pageCode:'products',
      title: 'all products',
      tag: 2,
      groupid: groupid
    })
});
module.exports = router;