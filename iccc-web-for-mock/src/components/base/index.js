/**
 * 注册全局组件
 * Created by hecg on 2020/6/16.
 */
import InfiniteScroll from './infinite-scroll';
import NoRecord from './no-record';
import QsDatePick from './qs-date-pick';
import QsTable from './qs-table';
import QsTooltip from './qs-tooltip';
import QsUeditor from './qs-ueditor';
import SearchPageGrid from './search-page-grid';
import DgUpload from './dg-upload';

const install = function(Vue) {
  Vue.component(InfiniteScroll.name, InfiniteScroll);
  Vue.component(NoRecord.name, NoRecord);
  Vue.component(QsDatePick.name, QsDatePick);
  Vue.component(QsTable.name, QsTable);
  Vue.component(QsTooltip.name, QsTooltip);
  Vue.component(QsUeditor.name, QsUeditor);
  Vue.component(SearchPageGrid.name, SearchPageGrid);
  Vue.component(DgUpload.name, DgUpload);
};

export default {
  version: '1.0.0',
  install
};
