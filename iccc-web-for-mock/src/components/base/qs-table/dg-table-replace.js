/**
 * Created by hcg on 2020/12/22.
 */
import DgTable from '@srcPath/components/jz-base/table';

export default {
  name: 'dg-table-replace',
  mixins: [DgTable],
  methods: {
    /**
     * 替换表格搜索条件处理方法
     * @return {Object|Array} 处理后的搜索条件
     */
    _getConditions() {
      const and = [];
      const condition = this.condition || [];
      condition.forEach(({ name, value, op = '=', type = '', format = '', mergerName }) => {
        // 添加有值的条件
        if (value || value === 0) {
          if (name === 'GJZ' && mergerName) {
            and.push({ or: mergerName.split(',').map(key => ({ name: key, value, op, type, format })) });
            return;
          }
          if (op === 'rangeDate' || op === 'date8Range' || op === 'date14Range') {
            const [t1, t2] = value instanceof Array ? value : value.split(',');
            if (t1) {
              and.push({ name, value: t1, op: '>=', type, format });
            }
            if (t2) {
              and.push({ name, value: t2, op: '<=', type, format });
            }
            return;
          }

          and.push({ name, value, op, type, format });
        }
      });

      return and.length > 0 ? { and } : {};
    },
    _getSort() {
      let sort = {};
      if (this.sortProps instanceof Array) {
        this.sortProps.forEach(e => {
          sort = { ...sort, ...e };
        });
      } else {
        sort = this.sortProps;
      }
      Object.entries(sort).forEach(([key, val]) => {
        if (val) {
          sort[key] = val.toUpperCase();
        }
      });
      return sort;
    }
  }
};
