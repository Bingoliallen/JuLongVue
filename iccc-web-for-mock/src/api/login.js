import request from '@icccPath/utils/request';
import qs from 'qs';
import { getSetting } from './../common';
const mp = getSetting('GATEWAY');
const passWrap = true;

// GATEWAY
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  };
  return request({
    url: '/login',
    method: 'get',
    baseURL: mp,
    params: data
  });
}

export function logout(params) {
  return request({
    url: '/logout',
    method: 'get',
    baseURL: mp,
    params
  });
}

export function getUserInfo(params) {
  return request({
    url: `/gateway-oauth/api/user/info`,
    method: 'get',
    baseURL: mp,
    passWrap,
    params
  });
}

export function getPermissions(token) {
  return request({
    url: '/user/permissions',
    method: 'get',
    baseURL: mp,
    params: { token }
  });
}

export function getOAuthTokeByCode(params) {
  return request({
    url: '/oauth/token',
    method: 'post',
    baseURL: mp,
    passWrap,
    data: qs.stringify(params)
  });
}

export const searchAuthority = () => {
  return request('/authority/searchAuthority');
};

// 获取菜单
export const searchTreeMenu = () => {
  return request({
    url: '/authority/searchTreeMenu',
    method: 'get'
  });
};

// 根据系统登录用户权限获取快速入口
export const searchEntrancd = () => {
  return request({
    url: '/authority/searchEntrancd',
    method: 'get'
  });
};

// 根据系统登录用户权限获取待办中心
export const searchGtasks = () => {
  return request({
    url: '/authority/searchGtasks',
    method: 'get'
  });
};
