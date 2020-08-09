export default {
  path: '/rbac',
  title: '权限管理',
  icon: 'address-book',
  children: (pre => [
    {
      path: `${pre}/admin-list`,
      title: '管理员',
      icon: 'user-circle',
    },
  ])('/rbac')
};
