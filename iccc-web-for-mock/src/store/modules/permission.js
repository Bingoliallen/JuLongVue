import { asyncRouterMap, constantRouterMap } from '@icccPath/router';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permission) {
    return permissions.some(permission => route.meta.permission.includes(permission));
  } else {
    return true;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param permissions
 */
function filterAsyncRouter(routes, permissions) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, permissions);
      }
      res.push(tmp);
    }
  });

  return res;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { permissions } = data;
        let accessedRouters;
        accessedRouters = filterAsyncRouter(asyncRouterMap, permissions);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    }
  },
  getters: {
    permission_routers: state => state.routers,
    addRouters: state => state.addRouters
  }
};

export default permission;
