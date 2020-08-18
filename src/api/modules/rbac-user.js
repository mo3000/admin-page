export default ({service, request, serviceForMock, requestForMock, mock, faker, tools}) => ({
  /**
   * @description 登录
   * @param {Object} data 用户列表搜索项
   */
  RBAC_ADMIN_LOAD_LIST(data = {}) {
    // 接口请求
    return request({
      url: '/admin/list',
      method: 'post',
      data
    })
  },
  /**
   * @description 编辑管理员
   * @param {Object} data 用户列表搜索项
   */
  RBAC_ADMIN_EDIT(data) {
    return request({
      url: '/admin/edit',
      method: 'post',
      data
    });
  },
  /**
   * @description 翻转管理员状态 0禁用 1启用
   * @param {Number} id 用户列表搜索项
   */
  RBAC_ADMIN_TOGGLE_STATUS(id) {
    return request({
      url: '/admin/toggle-status',
      method: 'post',
      data: {id}
    });
  }
})
