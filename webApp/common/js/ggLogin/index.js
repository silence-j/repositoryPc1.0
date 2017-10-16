// import userApi from '../user/userApi'
// import Utils from '../serveice.js'

// /**
//  * Google登陆
//  */
// var idToken = Utils.getUrlParams('id_token')
// if (idToken) {
//   userApi.ggLogin({id_token: idToken}).then(res => {
//     if (res.data.code === 0) {
//       localStorage.setItem('isLogin', 1)
//       // if (plat === 0){
//       let currHref = localStorage.getItem('currHref')
//       if (currHref !== 'undefined' && currHref !== null && currHref !== 'null' && currHref !== '') {
//         localStorage.removeItem('currHref')
//         window.location.href = currHref
//       } else {
//         window.location.href = '/products?shopId=' + window.shopId
//       }
//       // }
//     } else {
//       alert('登陆失败')
//       setTimeout(() => {
//         window.location.href = '/products?shopId=' + window.shopId
//       }, 500)
//     }
//   })
// }
