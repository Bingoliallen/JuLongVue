import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@icccPath/pages/layout';
import { PageCode } from 'ui-component-v4';

/**
 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 hidden: true // (默认 false)

 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 redirect: 'noRedirect'

 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 若你想不管路由下面的 children 声明的个数都显示你的根路由
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 alwaysShow: true

 name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题，缓存页面时使用到
 meta: {
      //设置该路由进入的权限，支持多个权限叠加（用户只需要拥有其中一个权限即可展示菜单）
      //如果没有设置permission，则默认显示
      //constantRouterMaps中的路由不会进行权限过滤，asyncRouterMap中的路由才会进行权限过滤（asyncRouterMap中的permission才会起效）
      permission: ['permission_key', 'permission_key2']
      title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
      icon: 'svg-name' //设置该路由的图标
      noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
      breadcrumb: 0 // 如果设置为 0，则不会在breadcrumb面包屑中显示
     }
 */
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@icccPath/pages/common/redirect/index')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('@qb/qs-icccd/src/pages/dashboard/index'),
    name: 'dashboard',
    meta: { title: '首页', icon: 'icon-file', noCache: true, id: 'index' }
  },
  {
    path: '/themeSimple',
    component: () => import('@qb/qs-icccd/src/pages/dashboard/theme-simple/index'),
    name: 'themeSimple'
  },
  {
    path: '/themeSelfdom',
    component: () => import('@qb/qs-icccd/src/pages/dashboard/theme-selfdom/index'),
    name: 'themeSelfdom'
  },
  {
    path: '/',
    component: Layout,
    redirect: () => {
      let path = `${window.systemParams.REDIRECT_PATH ? window.systemParams.REDIRECT_PATH : '/dashboard'}`;
      return path;
    },
    meta: { title: '首页', icon: 'icon-file' },
    children: [
      {
        path: 'scenes-add',
        component: () => import('@qb/qs-icccd/src/pages/scenes/add'),
        name: 'scenes-add',
        meta: { title: '添加场景', icon: 'iconf-Alarm', hidden: true, id: 'scenesAdd' }
      },
      {
        path: 'qwbk',
        component: () => import('@icccPath/pages/qwbk'),
        name: 'qwbk',
        meta: { title: '全网布控', icon: 'iconf-Alarm', id: 'qwbk' },
        redirect: 'qwbk/none',
        children: [
          {
            path: 'none',
            name: 'monitor-none',
            props: { title: '暂无布控数据，请点击左上角添加布控对象' },
            meta: {
              title: '统一管控',
              breadcrumb: 0,
              viewName: 'monitor',
              hidden: true,
              parentId: 'qwbk',
              id: 'none'
            },
            component: () => import('@icccPath/pages/common/empty-page')
          },
          {
            path: 'apply',
            name: 'monitor-apply',
            meta: { title: '统一管控', breadcrumb: 0, viewName: 'monitor', parentId: 'qwbk', id: 'apply' },
            component: () => import('@icccPath/pages/qwbk/apply')
          },
          {
            // 单个布控对象的详情
            path: 'detail/:id',
            props: true,
            name: 'monitor-detail',
            meta: {
              title: '统一管控',
              breadcrumb: 0,
              viewName: 'monitor',
              parentId: 'qwbk',
              id: 'monitorDetail'
            },
            component: () => import('@icccPath/pages/qwbk/detail')
          },
          {
            // 分组的详情
            path: 'detail/group/:id',
            props: true,
            name: 'monitor-detail-group',
            meta: { title: '统一管控', breadcrumb: 0, viewName: 'monitor', parentId: 'qwbk', id: 'detailGroup' },
            component: () => import('@icccPath/pages/qwbk/group-detail')
          },
          {
            // 任务单的详情
            path: 'detail/task/:id',
            props: true,
            name: 'monitor-detail-task',
            meta: { title: '统一管控', breadcrumb: 0, viewName: 'monitor', parentId: 'qwbk', id: 'detailTask' },
            component: () => import('@icccPath/pages/qwbk/task-detail')
          },
          // 重点人员的详情
          {
            path: 'zdry/:id',
            props: true,
            name: 'monitor-detail-zdry',
            meta: { title: '重点人员', breadcrumb: 0, viewName: 'monitor', parentId: 'qwbk', id: 'detailZdry' },
            component: () => import('@icccPath/pages/zdry/detail')
          },
          // 联动界面
          {
            path: 'link',
            name: 'monitor-link',
            meta: { title: '联动页面', breadcrumb: 0, viewName: 'monitor', parentId: 'qwbk', id: 'link' },
            component: () => import('@icccPath/pages/zdry/detail')
          }
        ]
      },
      {
        path: 'bksp',
        component: () => import('@icccPath/pages/bksp'),
        name: 'bksp',
        meta: { title: '布控审批', icon: 'iconf-personnel', id: 'bksp' },
        redirect: 'bksp/none',
        children: [
          {
            path: 'none',
            name: 'bksp-none',
            props: {
              title: '暂无布控审批数据'
            },
            meta: {
              title: '统一审批',
              breadcrumb: 0,
              viewName: 'bksp',
              hidden: true,
              parentId: 'bksp',
              id: 'none'
            },
            component: () => import('@icccPath/pages/common/empty-page')
          },
          {
            path: 'detail',
            name: 'bksp-detail-default',
            meta: {
              title: '统一审批',
              breadcrumb: 0,
              viewName: 'bksp',
              hidden: true,
              parentId: 'bksp',
              id: 'bksqDefault'
            },
            component: () => import('@icccPath/pages/bksp/detail')
          },
          {
            path: 'detail/:id',
            props: true,
            name: 'bksp-detail',
            meta: { title: '统一审批', breadcrumb: 0, viewName: 'bksp', parentId: 'bksp', id: 'bksqDetail' },
            component: () => import('@icccPath/pages/bksp/detail')
          }
        ]
      },
      {
        path: 'yjgj',
        component: () => import('@icccPath/pages/yjgj'),
        name: 'yjgj',
        meta: { title: '轨迹查询', icon: 'iconf-Earlywarning', id: 'yjgj' },
        redirect: 'yjgj/none',
        children: [
          {
            path: 'none',
            name: 'yjgj-none',
            props: {
              title: '暂无轨迹预警数据'
            },
            meta: { title: '轨迹查询', breadcrumb: 0, viewName: 'gjyj', hidden: true, parentId: 'yjgj', id: 'none' },
            component: () => import('@icccPath/pages/common/empty-page')
          },
          {
            path: 'track',
            name: 'yjgj-detail-default',
            meta: { title: '轨迹查询', breadcrumb: 0, viewName: 'gjyj', hidden: true, parentId: 'yjgj', id: 'track' },
            component: () => import('@icccPath/pages/yjgj/track/detail')
          },
          {
            path: 'track/:id',
            props: true,
            name: 'yjgj-detail',
            meta: { title: '轨迹查询', breadcrumb: 0, viewName: 'gjyj', parentId: 'yjgj', id: 'trackDetail' },
            component: () => import('@icccPath/pages/yjgj/track/detail')
          }
        ]
      },
      {
        path: 'zdry',
        component: () => import('@icccPath/pages/zdry'),
        name: 'zdry',
        meta: { title: '重点人员', icon: 'iconf-Keypersonnel', id: 'trackDetail' },
        redirect: 'zdry/none',
        children: [
          {
            path: 'none',
            name: 'zdry-none',
            props: {
              title: '暂无重点人员数据'
            },
            meta: {
              title: '部下发重点人查询',
              breadcrumb: 0,
              viewName: 'zdry',
              hidden: true,
              parentId: 'zdry',
              id: 'none'
            },
            component: () => import('@icccPath/pages/common/empty-page')
          },
          {
            path: 'detail',
            name: 'zdry-detail-default',
            meta: {
              title: '部下发重点人查询',
              breadcrumb: 0,
              viewName: 'zdry',
              hidden: true,
              parentId: 'zdry',
              id: 'zdryDefault'
            },
            component: () => import('@icccPath/pages/zdry/detail')
          },
          {
            path: 'detail/:id',
            props: true,
            name: 'zdry-detail',
            meta: { title: '重点人员', breadcrumb: 0, viewName: 'zdry', parentId: 'zdry', id: 'zdryDetail' },
            component: () => import('@icccPath/pages/zdry/detail')
          },
          {
            path: 'detail/tksqd/:id',
            props: true,
            name: 'tksqd-detail',
            meta: { title: '停控申请单', breadcrumb: 0, viewName: 'zdry', parentId: 'zdry', id: 'bksqDetail' },
            component: () => import('@icccPath/pages/zdry/tksqd-detail')
          }
        ]
      },
      {
        path: 'statistical-analysis',
        component: () => import('@icccPath/pages/statistical-analysis'),
        meta: { title: '统计分析', icon: 'iconf-statistics', id: 'statistical-analysis' },
        name: 'statistical-analysis'
      },
      {
        path: 'object-category-config',
        component: () => import('@icccPath/pages/object-category-config'),
        meta: { title: '人员类别配置', icon: 'iconf-statistics', id: 'object-category-config' },
        name: 'object-category-config'
      },
      // {
      //   path: 'config',
      //   meta: { title: '配置', icon: 'iconf-statistics', id: 'config' },
      //   redirect: 'config/object-category-config',
      //   name: 'config',
      //   children: []
      // },
      {
        path: 'iccc-test',
        component: () => import('@icccPath/pages/common/iccc-test'),
        name: 'iccc-test'
      }
    ]
  },
  {
    path: '/refresh',
    component: () => import('@icccPath/pages/common/refresh'),
    name: 'refresh'
  }
];

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  /** When your routing table is too long, you can split it into small modules**/
  {
    path: '*',
    component: PageCode,
    hidden: true
  }
];
