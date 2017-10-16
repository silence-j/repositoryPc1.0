/**
 * blog
 */
'use strict'
let express = require('express');
let router = express.Router();
let httpRequest = require('../common/https-request')
let templateConf = require('../conf/templateConf')
/**
 * 直接打开 博客列表。  博客默认取第一篇
 */
router.get('/:shopId', (req, res, next) => {
    httpRequest.get(`/buyer/blog/page?page=${req.query.page||1}&size=10&paging=true&shopId=${req.params.shopId}`, (date2) => {
      let callback2 = JSON.parse(date2.toString())
      let blogs = callback2.data.records
      if (blogs.length > 0 ) {
        let firstBlog = blogs[0]
        console.log('firstBlog.anchorTextKeywords')
        console.log(firstBlog.anchorTextKeywords)
        console.log(blogs[0].blogContents)
        if (firstBlog.anchorTextKeywords !== '') {
          blogs[0].blogContents = blogs[0].blogContents.replace(new RegExp(firstBlog.anchorTextKeywords, 'g'),function(keyWord){
            return '<a href="/">' + keyWord + '</a>'
          })
        }
        if (firstBlog.seoDesc&&firstBlog.seoDesc.length > 160) {
          blogs[0].seoDesc =  firstBlog.seoDesc.substr(0,160);
        }
        templateConf(req, res, {
          url: '/views/blog/blog',
          pageCode: 'blog',
          title: blogs[0].seoTitle || blogs[0].blogTitle || 'blog',
          desc: blogs[0].seoDesc,
          keywords: blogs[0].seoKeywords,
          blogs: blogs,
          blogsWraper: callback2.data,
          shopId: req.params.shopId,
          blogFlag: 'default',
          tag: 3
        })
      } else {
        templateConf(req, res, {
          url: '/views/blog/blog',
          pageCode: 'blog',
          title: 'blog',
          desc: '',
          keywords: '',
          blogs: blogs,
          blogsWraper: callback2.data,
          shopId: req.params.shopId,
          blogFlag: 'default',
          tag: 3
        })
      }
    })
});
/**
 * 点击博客后 ，跳转到 该blog id 的博文
 */
router.get('/:shopId/:blogId', (req, res, next) => {
    httpRequest.get(`/buyer/blog/page?page=${req.query.page||1}&size=10&paging=true&shopId=${req.params.shopId}`, (date2) => {
      let callback2 = JSON.parse(date2.toString())
      httpRequest.get(`/buyer/blog/find?id=${req.params.blogId}&shopId=${req.params.shopId}`, (blogInfo) => {
      let blogInfoJson = JSON.parse(blogInfo.toString())
      /**
       * 替换锚文本
       * @type {[type]}
       */
        let firstBlog = blogInfoJson.data
        if (firstBlog.anchorTextKeywords !== '') {
          blogInfoJson.data.blogContents = blogInfoJson.data.blogContents.replace(new RegExp(firstBlog.anchorTextKeywords, 'g'),function(keyWord){
            return '<a href="/">' + keyWord + '</a>'
          })
        }
        if (firstBlog.seoDesc&&firstBlog.seoDesc.length > 160) {
          blogInfoJson.data.seoDesc =  firstBlog.seoDesc.substr(0,160);
        }
        templateConf(req, res, {
          url: '/views/blog/blog',
          pageCode: 'blog',
          title: blogInfoJson.data.seoTitle || blogInfoJson.data.blogTitle|| 'blog',
          desc: blogInfoJson.data.seoDesc,
          keywords: blogInfoJson.data.seoKeywords,
          blogInfoByBlogId: blogInfoJson.data,
          blogs: callback2.data.records,
          blogsWraper: callback2.data,
          shopId: req.params.shopId,
          blogFlag: 'byBlogId',
          tag: 3
        })
      });
    })
});


module.exports = router;