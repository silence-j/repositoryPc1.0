'use strict'
let express = require('express');
let router = express.Router();
let templateConf = require('../conf/templateConf')
let httpRequest = require('../common/https-request')

/* GET users listing. */
router.get('/login', function(req, res, next) {
  console.log(req.cookies.fb)
  if (req.cookies.fb === '1') {
    templateConf(req, res, {
      url: 'common/views/users/fbLogin',
      title: 'login',
      type: 'common',
    })
  }else {
    templateConf(req, res, {
      url: 'common/views/users/login',
      title: 'login',
      type: 'common',
    })
  }
});

router.get('/register', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/register',
    title: 'register',
    type: 'common'
  })
});

router.get('/setPasswd1', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/setPasswd1',
    title: 'setPasswd',
    type: 'common'
  })
});

router.get('/setPasswd2', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/setPasswd2',
    title: 'setPasswd',
    type: 'common'
  })
});

router.get('/sendSuccess', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/sendSuccess',
    title: 'setPasswd',
    type: 'common'
  })
});

router.get('/resetSuccess', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/resetSuccess',
    title: 'setPasswd',
    type: 'common'
  })
});

router.get('/policy', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/policy',
    title: 'policy',
    type: 'common'
  })
});


router.get('/facebookBack', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/facebookLoginBack',
    title: 'facebookBack',
    type: 'common'
  })
});
router.get('/ggBack', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/ggLoginBack',
    title: 'ggBack',
    type: 'common'
  })
});
router.get('/404', function(req, res, next) {
  templateConf(req, res, {
    url: 'common/views/users/404page',
    title: '404',
    type: 'common'
  })
});
module.exports = router;
