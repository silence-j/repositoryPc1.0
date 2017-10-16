import userApi from '../user/userApi'
// const shopId = userApi.getUrlParams('shopId')
const plat = window.plat
/**
 * facebook登录
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
let url = location.protocol + '//' + window.location.host + '/users/facebookBack/' // + shopId
userApi.facebookOuth(url).then(res => {
  if (res.data.code === 0) {
    if (plat === 1) {
      // localStorage.removeItem('ggClick') // 习惯fb登陆的 去掉gg自动登陆
      window.location.href = res.data.data
    }
  }
})
