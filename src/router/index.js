/* jshint esversion: 6 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import * as types from '../store/mutation-types'
import Welcome from '@/components/Welcome'
import AssRtc from '@/components/AssRtc'
import Login from '@/components/Login.vue'
import FileItem from '@/components/FileItem.vue'

Vue.use(Router)

const routesa = [
  {
    path: '/',
    name: 'Welcome111',
    component: Welcome
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/file',
    name: 'file',
    component: FileItem
  },
  {
    // path: '/assist/:room',
    path: '/assist',
    name: 'AssRtc',
    meta: {
      requireAuth: false  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: AssRtc
  }
]

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new Router({
  routes: routesa
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.data.token) {  // 通过vuex state获取当前的token是否存在
      next()
    } else {
      console.log('你还没有登录啦')
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router
