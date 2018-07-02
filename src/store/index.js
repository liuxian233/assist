/**
 * User: ecitlm@163.com
 * Date: Created  on 2017/2/25 14:04.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import data from './modules/data.js'

Vue.use(Vuex)

// Vuex 允许我们将 store 分割到模块（module）。
// 每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块——从上至下进行类似的分割：
export default new Vuex.Store({
    modules: {
        data
    }
})
