import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)


export default {
  path: '/rbac',
  name: 'rbac',
  meta: { auth: true },
  component: layoutHeaderAside,
  // children: (pre => [
  //   { path: 'index', name: `${pre}index`, component: _import('demo/d2-crud/index'), meta: { ...meta, title: 'D2 CRUD v2 首页' } },
  // ])('/rbac')
  children: [
    {
      path: 'admin-list',
      name: 'rbac/admin-list',
      component: _import('rbac/admin-list'),
      meta: {auth: true, title: '管理员列表'}
    },
  ],
}
