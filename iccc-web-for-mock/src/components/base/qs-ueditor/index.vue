<!--
 * @Author: panyc 
 * @Date: 2020-05-15 10:28:00 
 * @Last Modified by:   panyc 
 * @Last Modified time: 2020-05-15 10:28:00 
 *
-->
<template>
  <dg-ueditor v-model="value" @input="onUpdate" :config="ueditorConfig" ref="ueditor"></dg-ueditor>
</template>

<script>
export default {
  name: 'qs-ueditor',
  props: {
    ueditorValue: {
      type: String,
      default: ''
    },
    ueditorConfig: {
      type: Object,
      default: () => {
        return {
          maximumWords: 1500,
          elementPathEnabled: false,
          autoHeightEnabled: false, // 编辑器不自动被内容撑高
          initialFrameHeight: 240, // 初始容器高度
          initialFrameWidth: '100%', // 初始容器宽度
          toolbars: [
            [
              'undo',
              'redo',
              'bold',
              'italic',
              'underline',
              'fontborder',
              'fontsize',
              'forecolor',
              'strikethrough',
              'superscript',
              'subscript',
              'removeformat',
              'formatmatch',
              'autotypeset',
              'blockquote',
              'pasteplain',
              '|',
              'backcolor',
              'insertorderedlist',
              'insertunorderedlist',
              'selectall',
              'cleardoc'
            ]
          ]
        };
      }
    }
  },
  watch: {
    ueditorValue: {
      handler(newVal) {
        this.value = newVal;
      }
    }
  },
  data() {
    return {
      isExecute: false,
      value: ''
    };
  },
  methods: {
    getContentTxt() {
      if (this.$refs.ueditor.id) {
        return window.UE.getEditor(this.$refs.ueditor.id).getContentTxt();
      }
    },
    getPlainTxt() {
      if (this.$refs.ueditor.id) {
        return window.UE.getEditor(this.$refs.ueditor.id).getPlainTxt();
      }
    },
    setContent(value) {
      if (this.$refs.ueditor.id) {
        window.UE.getEditor(this.$refs.ueditor.id).setContent(value);
      }
    },
    onUpdate() {
      // 切换页签回到新增编辑页时回显富文本内容
      if (!this.value && !this.isExecute) {
        this.value = this.ueditorValue;
        // 重新触发富文本赋值方法
        if (window.UE && window.UE.getEditor) {
          this.setContent(this.value);
        }
        this.isExecute = true;
        return;
      }
      this.$emit('update:ueditorValue', this.value);
    }
  },
  deactivated() {
    this.isExecute = false;
  }
};
</script>
