<!--
 * @Descripttion: 范围选择组件
 * @Author: Panll
 * @Date: 2020-12-21 15:26:08
 * @Project: ${PROJECT_NAME}
 -->
<template>
  <div class="nationwide-selection">
    <el-checkbox-group class="u-lable-btn quick-check-group" v-model="quickCheckData" @change="handleQuick">
      <el-checkbox-button
        class="quick-check-group__button"
        v-for="item in quickGroup"
        :label="item.value"
        :key="item.value"
        @change="handleQuickButton(item.value, $event)"
        >{{ item.label }}</el-checkbox-button
      >
    </el-checkbox-group>
    <el-checkbox-group class="u-lable-btn check-group" v-model="checkData" @change="handleCheck">
      <template v-for="(groupItem, groupIndex) in group">
        <div class="check-group__container" v-show="groupData.length" :key="groupItem.id">
          <el-checkbox-button
            class="check-group__button"
            v-for="item in groupData[groupIndex]"
            :label="item.value"
            :key="item.value"
            @change="handleCheckButton(groupItem.id, $event)"
            >{{ item.label }}</el-checkbox-button
          >
        </div>
      </template>
    </el-checkbox-group>
  </div>
</template>

<script>
import sqdxApi from '@icccdPath/api/sqdxApi.js';
import { getCodeDict } from '@icccdPath/api/common.js';
export default {
  name: 'nationwide-selection',
  props: {
    value: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: 'BM_BKSQ_BKFW'
    },
    group: {
      type: Array,
      default: () => {
        return [
          { id: 1, name: '本省' },
          { id: 0, name: '全国' }
        ];
      }
    }
  },
  data() {
    return {
      // 快捷选择按钮选中
      quickCheckData: [],
      // 选择的值
      checkData: [],
      // 快捷按钮所有值
      quickGroup: [],
      // 列表值
      groupData: [],
      // 所有快捷列表的数据
      groupAllData: [],
      // 快捷列表选中标识
      containList: []
    };
  },
  computed: {
    originalData() {
      let list = [];
      Object.entries(this.group).forEach(([, val]) => {
        list[val.id] = [];
      });
      return list;
    }
  },
  watch: {
    value: {
      handler(val) {
        let valueObj = {};
        try {
          val && (valueObj = JSON.parse(val.trim()));
        } catch (e) {
          // 无需处理异常
        }
        if (valueObj && Object.keys(valueObj).length) {
          this.checkData =  valueObj.bkdyfw.split(',');
        }
      },
      immediate: true
    }
  },
  methods: {
    async init() {
      // 快捷所有值
      const code = await getCodeDict(this.code);
      const groupAllData = await sqdxApi.getBkfw();

      // 获取快捷选项
      if (code.data) {
        this.quickGroup = code.data;
        code.data.map(async (v, i) => {
          if (groupAllData.data[v.value]) {
            this.groupAllData[i] = groupAllData.data[v.value];
          }
          // 将本省、全国的数据显示
          if (i == 0 || i == 1) {
            this.$set(this.groupData, i, this.groupAllData[i]);
          }
          // 清空快捷选中标识，重新判断该选中哪个快捷
          this.containList[i] = false;
          // 有选择结果不覆盖
          if (!this.containList.some(e => e == true)) {
            this._reverseChangeQuick(i);
          }
          this._emitFun();
        });
      }
    },
    _emitFun() {
      let sentValue = '';
      if (this.checkData && this.checkData.length) {
        sentValue = {
          bkdyfw: this.checkData.join(','),
          bkfwbm: this.quickCheckData[0] ? this.quickCheckData[0] : ''
        };
      }
      const value = sentValue && JSON.stringify(sentValue);
      this.$emit('input', value);
      this.$emit('change', value);
    },
    // 快捷反选
    _reverseChangeQuick(index) {
      if (this.groupAllData[index]) {
        let groupList = this.groupAllData[index].map(e => e.value);
        let contain = this._isCongruent(this.checkData, groupList);
        // 值全等，勾选该快捷选项
        if (contain) {
          this.containList[index] = true;
          this.quickCheckData = [`${this.quickGroup[index].value}`];
        } else {
          // 值没有匹配到快捷选项就勾选自定义
          if (this.checkData.length) {
            this.quickCheckData = ['99'];
          }
        }
      }
    },
    // 快捷值改变
    _changeQuick(currentData, isAdd) {
      // 快捷选择单选
      this.checkData = [];

      for (const i of currentData) {
        for (let j = 0; j < this.groupData.length; j++) {
          const element = this.groupData[j];
          let data = element.filter(e => e.value === i.value);
          if (data.length) {
            // 没有当前值就存入
            if (!this.checkData.some(e => e === i.value) && isAdd) {
              this.checkData.push(data[0].value);
            }
            // 取消删除对应数据
            if (!isAdd) {
              this.checkData.splice(this.checkData.indexOf(data[0].value), 1);
            }

            this._emitFun();
          }
        }
      }
    },
    async handleQuick(values) {
      // 单选
      if (this.quickCheckData.length > 1) {
        this.quickCheckData.splice(0, 1);
      }
      if (!values || values.length == 0) return;
      const value = values[values.length - 1];
      if (value === '99') return;
      const current = await sqdxApi.getBkfw(value);

      // 快捷选中
      this._changeQuick(current.data, true);
    },
    async handleQuickButton(value, e) {
      if (e) return;
      const current = await sqdxApi.getBkfw(value);

      // 快捷取消
      this._changeQuick(current.data);
    },
    handleCheck(value, index) {
      // console.log(value, index);
    },
    // aArray数组是否包含在bArray数组
    _isContained(aArray, bArray) {
      if (!(aArray instanceof Array) || !(bArray instanceof Array) || aArray.length < bArray.length) {
        return false;
      }
      var aArrayStr = aArray.toString();
      for (var i = 0; i < bArray.length; i++) {
        if (aArrayStr.indexOf(bArray[i]) < 0) return false;
      }
      return true;
    },
    // 两个数组数值是否全等
    _isCongruent(arrayA, arrayB) {
      let aArray = [...arrayA].sort();
      let bArray = [...arrayB].sort();
      return (
        aArray.length === bArray.length &&
        bArray.every((e, i) => {
          return aArray[i] === e;
        })
      );
    },
    async handleCheckButton(index, e) {
      this.quickGroup.map((v, i) => {
        this.containList[i] = false;
        if (!this.containList.some(e => e == true)) {
          this._reverseChangeQuick(i);
        }
      });
      // 无值清空快捷选中
      if (!this.checkData.length) {
        this.quickCheckData = [];
      }
      this._emitFun();
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.nationwide-selection {
  display: flex;
  flex-direction: column;
}
.quick-check-group {
  margin-bottom: 10px;
  /deep/ .el-radio-button__inner {
    margin-right: 10px;
    border-radius: 2px;
    border: 1px solid var(--border-color-base);
  }
}
.check-group {
  display: flex;
  justify-content: space-between;
  &__container {
    &:first-child {
      margin-right: 10px;
    }
    padding: 18px;
    padding-bottom: 13px;
    background: var(--color-white);
    border: 1px solid var(--border-color-extra-light);
  }
  &__button {
    margin: 5px;
    /deep/ .el-checkbox-button__inner {
      border-radius: 2px;
      border: 1px solid var(--border-color-base);
    }
  }
}
// 按钮样式
/deep/ {
  .u-lable-btn {
    vertical-align: super;
    label {
      margin-right: 0.5rem;
      span {
        position: relative;
        border-radius: 2px !important;
        border: 1px solid var(--border-color-extra-light);
        &.el-radio-button__inner,
        &.el-checkbox-button__inner {
          &:hover {
            border: 1px solid var(--color-primary);
          }
        }
      }
      input:checked + span.el-radio-button__inner,
      input:checked + span.el-checkbox-button__inner {
        border: 1px solid var(--color-primary);
        color: var(--color-primary);
        background: transparent;
        box-shadow: unset;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 14px;
          height: 14px;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDczMTYyNi1mMjljLWEzNDMtYjM1Ni05MTI1MWU1YjcyMDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Nzk4Qzk1NUIwQ0NCMTFFQTlFNkFDMjc1NjM0N0IzREUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Nzk4Qzk1NUEwQ0NCMTFFQTlFNkFDMjc1NjM0N0IzREUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0Q5QkJBNDhGRjZCMTFFOUE5QkREMzNDNjNDQTZFOUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0Q5QkJBNDlGRjZCMTFFOUE5QkREMzNDNjNDQTZFOUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Mtx2rAAACcklEQVR42ryWzWsTQRjGn5nddJNuNmk3qSj4AUWshx5EULAVaXv1YFHw5sXaNPFSiv+Ih948iKAoUhT8A4QKRYr4eROKIF4ED2LTTTbJZsd30t26WZpsqrsOPDAwu/Pb533feWfZzF2BhEeRNK8mDNFJS0mDsh6kTGrx/wAZJTWTcGSQSh7ElG5IgicMaUqIXIjTUY50KwBpBBfVGCGLvSBy8JidFPaDxOEoT1ogVTyI3etBHhOk2A/yL6AwpBb1Ao8JwvxFOXGpoOstiFYb4m9BIx7kNmlsP0iDNh9SgKlxaCdMqMw7SPyAkJseRDqxwpAmQThN5iaQWZlF/vIkhhUO5roQ6kEgbYFKy4FJL1v01UyEIHI6ewrawhQMTQX7/gttV+w+wAcNlyBIdghjpw+jVcxCkTlg3RBcOglt6SJymRTYvQ1sP/uImkNuFAbGB0x8ueGgMHkEzvIM8lfPQNc1MNuhhNNGknJhHGmCGKMZKPdfo/riE+rkHJxFF8MepHMYGequnOjg189Cv0YwGT76AJw7Dq1E4TpkQH2wierzD7AkgLPozhBuK3aaYr7xpdNeqnfmkLtxHtlaE+7Xn2gvTsM4RhX2cBM7T9/DIoeMsegWZAQaZFdb0ZQOzE5RHJapqkrTyFUJVhiG8uQtdh6ThCsp0Qc2G7pPutqK3EDCXm2hsbqObVkQJkHWyMWjN7CcHpCwIz1w/Zq9urDcSKUDub4FW0sBR0egrr1DjXIlOOudcDUAKUdB9sLAdsv65WfYfsvpB/FBRc9Jxf+RIKWjDpd05oo/4D5D7pWWoHnSFQ/wzb/jBxlRLvwaIv34LcAAQ1PAq85c3bQAAAAASUVORK5CYII=)
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
