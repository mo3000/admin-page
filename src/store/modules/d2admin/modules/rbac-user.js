import {Message, MessageBox} from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import api from '@/api'

export default {
  namespaced: true,
  state: {
    data: [],
    page: 1,
    total: 0,
    username: '',
    realname: '',
  },
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async load({dispatch, state}, {username, realname, page} = {}) {
      const res = await api.RBAC_ADMIN_LOAD_LIST({username, realname, page})
      state.data = res.data;
      state.total = res.total;
      state.page = res.current_page;
      return state;
    },


    // async setQueryParam({dispatch, state}, {}) {
    //   // state.
    // }

    async setPage({state}, {page}) {
      state.page = page;
    }
  }
}
