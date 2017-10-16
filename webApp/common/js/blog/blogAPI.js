/**
 * Created by admin on 2017/5/12.
 */
import {Utils} from '../serveice'

class BlogAPI extends Utils {
  getBlogs (params) {
    return this.get('/buyer/blog/page', params)
  }
  getBlogBg (params) {
    return this.get('/buyer/shop/guide/show', params)
  }
}

export default new BlogAPI()
