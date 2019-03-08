import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/views/NotFound'

import { prdRouter } from './prdRouter'

Vue.use(Router)

const baseRoute = [
  {
    path: '/'
  }
]

const notFoundRoute = [
  {
    path: '*',
    component: NotFound
  }
]

export default new Router({
  mode: 'history',
  routes: (r => {
    let route = []
    r.keys().forEach(key => {
      let arr = r(key).default
      if (Array.isArray(arr)) {
        for (let tempData of arr) {
          route.push(tempData)
        }
      } else {
        route.push(arr)
      }
    })
    if (process.env.NODE_ENV !== 'production') {
      let routeDatas = [...baseRoute, ...route, ...notFoundRoute]
      // .concat(require('./uiRouter').uiRouter).concat(require('./componentsRouter').componentsRouter)
      routeDatas.concat(prdRouter)
      let tempArr = []
      for (let item of routeDatas) {
        tempArr.push({
          path: item.path,
          title: (item.meta && item.meta.title) ? item.meta.title : '无title'
        })
      }
      console.log('/* 路由表 */')
      console.table(tempArr)
    } else {
      routeDatas.concat(prdRouter)
    }
    return [...baseRoute, ...route, ...notFoundRoute]
  })(require.context('../views', true, /^\.\/((?!\/)[\s\S])+\/route\.js$/))
})
