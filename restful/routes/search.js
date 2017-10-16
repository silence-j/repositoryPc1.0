/**
 * @author monkeywang
 * Date: 17/4/20
 */
'use strict'
let express = require('express');
let router = express.Router();
let templateConf = require('../conf/templateConf')
/* GET users listing. */
router.get('/', function(req, res, next) {
  templateConf(req, res, {
    url: '/views/search/search',
    title: 'search',
    pageCode:'search'
  })
});

module.exports = router;