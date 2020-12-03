
import axios from 'axios'
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css'  
class HttpRequest {
  constructor (baseUrl = '') {
    this.baseUrl = baseUrl
    this.queue = {}
    
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // "Content-Type": "application/json;charset=utf-8"
      //  "Content-Type": "application/x-www-form-urlencoded"
      },
    }
    return config
  }

  // Destroy the request instance
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
    }
  }

  interceptors (instance, url) {
    instance.interceptors.request.use(
      config => {
        NProgress.start() //Set the loading progress bar (start...)
        if (!Object.keys(this.queue).length) {
        }
        this.queue[url] = true
        // console.log(config);
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    instance.interceptors.response.use(
      res => {
        NProgress.done() // Set the loading progress bar (end...)
        this.destroy(url)
        const { data } = res // ES6
        // Generally only need to use data
        // console.log(data);
        return data
      },
      error => {
        this.destroy(url)
        return Promise.reject(error.response)
      }
    )
  }

  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url) 
    return instance(options) 
  }
}
export default HttpRequest

