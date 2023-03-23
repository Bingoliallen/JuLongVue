/**
 * Created by hecg on 2020/10/29.
 */
const rightMenuMap = {};
import tools from '@icccPath/utils/tool';

// 注册右键菜单
export function registerRightMenu(instance) {
  const id = tools.generateKey();
  rightMenuMap[id] = instance;
  return id;
}
// 注销右键菜单
export function cancellationRightMenu(id) {
  delete rightMenuMap[id];
}

export function getMenuList() {
  return Object.values(rightMenuMap);
}

export function closeAllMenu() {
  getMenuList().forEach(e => {
    e.showMenu = false;
  });
}
