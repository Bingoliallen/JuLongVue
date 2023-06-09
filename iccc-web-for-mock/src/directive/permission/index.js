import store from '@icccPath/store';

export default {
  inserted(el, binding) {
    const { value } = binding;
    const permissions = store.getters && store.getters.permissions;

    if (value && value instanceof Array && value.length > 0) {
      const permissionKeys = value;
      const hasPermission = permissions.some(permissionKey => {
        return permissionKeys.includes(permissionKey);
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else if (value && typeof value === 'string') {
      const hasPermission = permissions.includes(value);
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`need permissions! Like v-permission="['admin','editor']"`);
    }
  }
};
