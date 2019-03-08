export const prdRouter = [
  /** 登录 */
  {
    path: '/login',
    meta: {
      title: '登录页面',
      notLoading: true,
      guideLink: true
    },
    component: r => require.ensure([], () => r(require('../views/login/login')), 'login')
  },
]
