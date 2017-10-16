/**
 * @author monkeywang
 * Date: 17/5/15
 */
let express = require('express');
let router = express.Router();
let httpRequest = require('../common/https-request')
let config = require('./'+process.env.NODE_ENV)

let request = require('request')

module.exports = function (req, res, params) {

  let template =  0
  let src = params.type ? `${params.url}` : `theme${template}${params.url}`
  let fb = req.query.fb ? req.query.fb : req.cookies.fb
  res.cookie("fb", fb, {maxAge: 1000 * 60 * 60 * 24 * 30});

  // 根据域名获取shopId
  let firdomain = config.firdomain

  if ((!req.query.shopId || req.query.shopId === undefined)  && req.cookies.shopId === undefined) {
    var domain = req.host
    if (domain !== firdomain) { // 有自己设置的域名 才调
      httpRequest.get('/bshop/config/domain/get/bydomain?domain=' + domain, '', (data) => {

        let resq = JSON.parse(data.toString())
        if (!resq.code) {
          res.cookie("shopId", resq.data.shopId, {maxAge: 1000 * 60 * 60 * 24 * 30});
          tplByShopId(resq.data.shopId)
        }
      })
    }
  } else if (req.query.shopId && req.query.shopId != "null" && req.query.shopId !== "undefined" && req.query.shopId !== undefined) {
    res.cookie("shopId", req.query.shopId, {maxAge: 1000 * 60 * 60 * 24 * 30});

    tplByShopId(req.query.shopId ? req.query.shopId : req.cookies.shopId)

  }else if ( params.shopId) {
    // 如果  是blog,那从url上取值
    tplByShopId(params.shopId)
  }else if (req.cookies.shopId) {
    tplByShopId(req.cookies.shopId)
  }
  function tplByShopId (shopId) {
    // 取消注释 ，template 加缓存
    // console.log('template from cookies')
    // console.log(req.cookies.template)
    // if (req.cookies.template) {
    //   template = req.cookies.template
    // }
    if(template === 0){
      //  获取主题
      httpRequest.get('/buyer/shop/templaterela/getByShopId?shopId=' + shopId, '', (d) => {
        let rest =  JSON.parse(d.toString())
        if (!rest.code) {
          let template = rest.data.templateCode
          let src = params.type ? `${params.url}` : `theme${template}${params.url}`
          res.cookie("template", template, {maxAge: 1000 * 60});
          params.openMessage = rest.data.openMessage // message按钮
          params.homePageId = rest.data.homePageId // message的pageid
          params.blogCount = rest.data.blogCount // blogCount
          renderSrc(src, shopId, template)
        }
      })
    }else{
      console.log('else template', template)
      let src = params.type ? `${params.url}` : `theme${template}${params.url}`
      renderSrc(src, shopId, template)
    }
  }
  function renderSrc (src3, shopId3, template3) {
    let srcdata = {
        shopId: shopId3,
        title: params.title,
        desc: params.desc,
        keywords: params.keywords,
        them: template3,
        version: version,
        fb: fb,
        blogInfoByBlogId: params.blogInfoByBlogId,
        blogCount: params.blogCount,
        blogs: params.blogs,
        blogFlag: params.blogFlag,
        blogsWraper: params.blogsWraper,
        params: JSON.stringify(params),
        openMessage: params.openMessage,
        homePageId: params.homePageId,
        prodDetail: JSON.stringify(params.prodDetail), // 商品详情独有
        prodDesc: params.prodDesc,
        pageCode: params.pageCode
      }
    if (params.tag) {
      let groupid = ``
      if (params.groupid) {
         groupid = `&groupId=${params.groupid}`
      }
      shopId3 = shopId3 || params.shopId
      // seo 
      httpRequest.get(`/buyer/seo/query?pageTag=${params.tag}&shopId=${shopId3}` + groupid, (data) => {
        var resq;
        try {
          resq = JSON.parse(data.toString())
        } catch (err){
          console.log('捕获到json parse异常')
          console.log(err)
          res.render(src3, srcdata)
          return
        }
        if (!resq.code) {
          srcdata.title = resq.data.seoTitle || params.title
          srcdata.desc = resq.data.seoDesc || params.desc
          srcdata.keywords = resq.data.seoKeywords || params.keywords
        }
        res.render(src3, srcdata)
      })
    } else {
      res.render(src3, srcdata)
    }
  }
}