const formItemValidate = (vnode, eventName) => {
  const inputInstance = vnode.componentInstance;
  if (inputInstance.$parent.$el.classList.contains('el-form-item')) {
    // 如果要验证非 ${eventName} 事件，可以在下面方法传一个空字符串的值（不能是undefined）
    inputInstance.$parent.validate(eventName);
  }
};

export default {
  inserted(el, { value }, vnode) {
    // 默认失去焦点时把输入框首尾空格去掉
    const eventName = value || 'blur';
    const input = [...el.children].find(
      ele => ele.classList.contains('el-input__inner') || ele.classList.contains('el-textarea__inner')
    );
    if (input) {
      input.addEventListener(eventName, function() {
        vnode.data.model.callback(this.value ? this.value.trim() : this.value);
        // 对于表单验证的处理
        formItemValidate(vnode, eventName);
      });
    }
  }
};
