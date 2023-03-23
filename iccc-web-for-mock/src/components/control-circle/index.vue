<!-- Created by hcg on 2020/11/16. -->
<template>
  <div class="control-circle" :class="{ 'is-add-fkq-qy': isAddFkqGraph }">
    <div class="control-circle_left">
      <div class="title-1">
        <span class="flex-1">防控圈管理</span>
        <dg-button v-if="showSelected" class="draw-fkq" type="primary" plain @click="showLayer('selected')"
          >已选防控圈</dg-button
        >
        <el-button type="text" icon="iconfont iconl-draw" title="绘制" @click="showLayer('draw')"></el-button>
      </div>
      <el-row class="control-circle_search" :gutter="12">
        <el-col class="search-input">
          <el-input
            placeholder="请输入防控圈名称查询"
            v-model="listSearch.GJZ"
            clearable
            @keyup.enter.native="search"
            @clear="search"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
        </el-col>
        <el-col :span="12">
          <dg-select
            code="BM_QZFKQ_LX"
            placeholder="类别"
            clearable
            value=""
            v-model="listSearch.lx"
            @change="search"
          ></dg-select>
        </el-col>
        <el-col :span="12">
          <dg-select
            code="BM_QZFKQ_SYFW"
            placeholder="使用范围"
            clearable
            value=""
            v-model="listSearch.syfw"
            @change="search"
          ></dg-select>
        </el-col>
      </el-row>
      <infinite-scroll
        class="control-circle_list"
        ref="scroll"
        v-model="scrollModel"
        :url="leftListConfig.url"
        :searchCondition="leftListConfig.searchCondition"
        :sortProps="leftListConfig.sortProps"
        :active-first="false"
        empty-text=""
        @change="showLayer({ layerId: 'view', data: $event })"
        @load="infiniteLoad"
      >
        <template v-slot="{ node, data }">
          <fkq-card-item
            :class="{ active: scrollModel === node.key }"
            :key="node.key"
            :node="node"
            :show-selected="showSelected"
            @checked-change="checkedChange"
            @edit="showLayer({ layerId: 'draw', data: $event })"
            @delete="deleteControlCircle"
            @view-fkq="cardListViewFkq"
          ></fkq-card-item>
        </template>
      </infinite-scroll>
    </div>
    <div class="control-circle_right">
      <gis class="gis" id="gis" ref="gis" type="vue" :config="config" load-end="loadEnd"></gis>
      <div class="draw-btn" v-show="isAddFkqGraph">
        <dg-button type="primary" @click="clearHooks">返回</dg-button>
        <span class="btn-split"></span>
        <dg-button type="primary" @click="drawDeleteLastVertex">撤销</dg-button>
      </div>
      <!--已选防控圈-->
      <transition v-if="showSelected" name="move-ltr">
        <fkq-layer layer-id="selected" v-if="visibleLayer === 'selected'" title="已选防控圈" @close="closeLayer">
          <qs-table
            :data="selectedList"
            :pagination="false"
            no-data-height="240px"
            :columns="[
              { type: 'index', label: '序号', width: '4em' },
              { type: 'slot', label: '防控圈名称', prop: 'mc' },
              { type: 'slot', label: '进出方向', prop: 'fx', width: '8em' },
              {
                type: 'operation-tpl',
                label: '操作',
                'cmp-props-buttons': [{ 移除: delRow }],
                width: '4em'
              }
            ]"
          >
            <template v-slot:mc="{ row }">
              <dg-button type="text" @click="showLayer({ layerId: 'view', lastLayer: 'selected', data: row })">{{
                row.mc
              }}</dg-button>
            </template>
            <template v-slot:fx="{ row }">
              <dg-switch v-model="row.fx" active-value="IN" inactive-value="OUT"></dg-switch>
              &nbsp;&nbsp;{{ row.fx === 'IN' ? '进' : '出' }}
            </template>
          </qs-table>
          <div class="control-circle-btns">
            <dg-button type="primary" @click="$emit('submit', selectedList)">提交</dg-button>
            <dg-button @click="deleteSelected()">清空</dg-button>
          </div>
        </fkq-layer>
      </transition>
      <!--绘制防控圈-->
      <transition name="move-ltr">
        <fkq-layer layer-id="draw" v-if="visibleLayer === 'draw'" title="防控圈绘制" @close="closeLayer">
          <el-form :model="fkqModel" ref="form" label-suffix="：" label-width="6em">
            <dg-form-item prop="mc" label="名称" :rules="[{ required: true }]">
              <el-input v-model="fkqModel.mc" placeholder="请输入名称"></el-input>
            </dg-form-item>
            <dg-form-item prop="ms" label="描述">
              <el-input
                v-model="fkqModel.ms"
                type="textarea"
                placeholder="请输入描述"
                show-word-limit
                maxlength="20"
              ></el-input>
            </dg-form-item>
            <dg-form-item prop="syfw" label="使用范围" :rules="[{ required: true }]">
              <dg-select code="BM_QZFKQ_SYFW" value="" placeholder="请选择使用范围" v-model="fkqModel.syfw"></dg-select>
            </dg-form-item>
            <dg-form-item prop="cjsj" label="创建时间">
              <template>{{ fkqModel.cjsj | filterDate }}</template>
            </dg-form-item>
            <dg-form-item prop="cjdw" label="创建单位">
              <span v-code="{ code: 'VW_BM_DEPT', value: fkqModel.cjdwdm }"></span>
            </dg-form-item>
            <dg-form-item prop="xzqh" label="行政区划">
              <dg-tree-drop
                code="BM_QZFKQ_XZQH"
                :lazy-load="true"
                :props="{ value: 'value', label: 'label', children: 'children' }"
                :tree-props="treeOptions"
                v-model="fkqModel.xzqh"
                placeholder="请选择行政区划"
                :multiple="true"
                clearable
                filterable
                collapse-tags
                :cur-node-id="curNodeId"
                style="width:100%;"
                visible-type="branch"
                value-type="branch"
                @change="xzqhChange"
              ></dg-tree-drop>
            </dg-form-item>
            <dg-form-item prop="hzgj" class="hzgj" label="绘制工具">
              <el-button
                type="text"
                @click="drawFkqGraph('POLYGON')"
                icon="iconfont iconl-polygon"
                title="多边形"
              ></el-button>
              <el-button
                type="text"
                @click="drawFkqGraph('CIRCULAR')"
                icon="iconfont iconl-circular"
                title="圆"
              ></el-button>
            </dg-form-item>
            <dg-form-item prop="fkq" label="防控圈">
              <fkq-graph-list
                type="edit"
                :values="fkqModel.fkq"
                @view-fkq="viewFkqGraph"
                @delete="deleteFkqGraph"
              ></fkq-graph-list>
            </dg-form-item>
            <div class="control-circle-btns">
              <dg-button type="primary" @click="saveFkqModel">保存</dg-button>
              <dg-button @click="closeLayer()">取消</dg-button>
            </div>
          </el-form>
        </fkq-layer>
      </transition>
      <!--查看防控圈-->
      <transition name="move-ltr">
        <fkq-layer layer-id="view" v-if="visibleLayer === 'view'" title="防控圈查看" @close="closeLayer">
          <el-form ref="form" label-suffix="：" label-width="5em">
            <dg-form-item prop="mc" label="名称">
              {{ fkqModel.mc | filterText }}
            </dg-form-item>
            <dg-form-item prop="ms" label="描述">
              {{ fkqModel.ms | filterText }}
            </dg-form-item>
            <dg-form-item prop="syfw" label="使用范围">
              <span v-code="{ code: 'BM_QZFKQ_SYFW', value: fkqModel.syfw }"></span>
            </dg-form-item>
            <dg-form-item prop="cjsj" label="创建时间">
              {{ fkqModel.cjsj | filterDate }}
            </dg-form-item>
            <dg-form-item prop="cjdw" label="创建单位">
              <span v-code="{ code: 'VW_BM_DEPT', value: fkqModel.cjdwdm }"></span>
            </dg-form-item>
            <dg-form-item v-if="false" prop="lx" label="类别">
              <span v-code="{ code: 'BM_QZFKQ_LX', value: fkqModel.lx }"></span>
            </dg-form-item>
            <dg-form-item prop="fkq" label="防控圈">
              <fkq-graph-list :values="fkqModel.fkq" @view-fkq="viewFkqGraph"></fkq-graph-list>
            </dg-form-item>
          </el-form>
        </fkq-layer>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import LeafletUtil from './leaflet-util';
import gisMixin from './../gis/mixin';
import FkqGraphList from './fkq-graph-list';
import FkqLayer from './fkq-layer';
import FkqCardItem from './fkq-card-item';
import { confirm, deepClone } from '@icccPath/utils/tool';
import { longTime2Str } from '@icccPath/filters';
import { addOrEditControlCircle, deleteControlCircle, getControlCircleDetail, saveImg } from './request';

export default {
  name: 'control-circle',
  mixins: [gisMixin],
  components: { FkqGraphList, FkqLayer, FkqCardItem },
  props: { value: Array },
  data() {
    // 生成新的行政区划
    const generateNewArea = async val => {
      const getArea = val => {
        const cacheMap = (map, code) => {
          if (code.length <= 0) {
            return;
          }
          const key = code.substring(0, 2);
          code = code.substring(2);
          let child = map[key];
          if (!child) {
            map[key] = child = {};
          }
          cacheMap(child, code);
        };
        const areaMap = {};
        val.split(',').forEach(code => {
          cacheMap(areaMap, code);
        });

        let areaArray = [];
        const cacheArray = (map, code) => {
          const keys = Object.keys(map);
          if (keys.indexOf('00') !== -1 || (code && keys.length === 0)) {
            areaArray.push(code);
            // 00 表示父级，其余数据需要被忽略
            return;
          }
          keys.forEach(key => {
            const value = map[key];
            cacheArray(value, code + key);
          });
        };
        cacheArray(areaMap, '');
        areaArray = areaArray.map(e => {
          if (e.length !== 6) {
            e += '000000';
          }
          return e.substring(0, 6);
        });

        areaArray.sort((i1, i2) => {
          return Number(i1) - Number(i2);
        });

        return areaArray;
      };
      const newFkq = [];
      if (!val) {
        val = '';
      }
      const newAreaCodeSet = new Set(getArea(val));
      (this.fkqModel.fkq || []).forEach(item => {
        if (!item.areaCode || newAreaCodeSet.delete(item.areaCode)) {
          newFkq.push(item);
        } else {
          const layerItem = this.fkqGraph[item.key];
          if (layerItem) {
            layerItem.layer && layerItem.layer.remove();
            layerItem.marker && layerItem.marker.remove();
          }
        }
      });
      // 拼接新的区划，并且生成截图
      const newAreaCodeArray = Array.from(newAreaCodeSet);
      for (let i = 0; i < newAreaCodeSet.size; i++) {
        const areaCode = newAreaCodeArray[i];
        const data = { key: this.$tool.generateKey(), type: 'AREA', areaCode };
        // 在地图上绘制防控圈
        const layer = await this.leafletUtil.drawFkqLayer(data);
        // 居中
        await this.leafletUtil.moveWarp(() => {
          this.fitBounds(layer.getBounds());
        });
        // 生成预览图
        data.preview = await this.leafletUtil.drawFkqPreview(layer);
        // 生成预览图后删除防控圈
        layer.remove();
        newFkq.push(data);
      }
      this.$set(this.fkqModel, 'fkq', newFkq);
      await this.fkqChange(newFkq);
    };
    const xzqhChange = _.debounce(val => {
      if (this.xzqhChanging) {
        // 如果还在生成过程中，保存一个临时函数，生成结束后执行，重新计算一下
        this.xzqhChangeEnd = () => {
          return generateNewArea(val);
        };
        return;
      }
      this.xzqhChanging = true;
      generateNewArea(val);
    }, 200);

    const fitBounds = _.debounce(bounds => {
      if (!bounds) {
        const list = Object.values(this.fkqGraph).map(e => e.layer.getBounds());
        let i = list.length - 1;
        bounds = list[i];
        while (i > 0) {
          i--;
          bounds = bounds.extend(list[i]);
        }
      }
      bounds && this.$refs.gis.map.fitBounds(bounds);
    }, 200);

    return {
      // 左侧卡片选中项
      scrollModel: '',
      // 是否显示多选
      showSelected: false,
      listSearch: {},
      leftListConfig: {
        url: '/v1/concern-fkq/search',
        searchCondition: [{ name: 'SFSC', value: '1', op: '!=' }],
        sortProps: { ZXXGSJ: 'DESC' }
      },
      // 防控圈第一级节点
      curNodeId: window.systemParams.GIS_FKQ_FIRST_NODE || '440000',
      // 已选防控圈
      selectedList: [],
      // 显示的弹出层 可选值 [draw 绘制防控圈, view 查看防控圈, selected 已选防控圈]
      visibleLayer: '',
      lastLayer: '',
      fkqModel: {},
      isAddFkqGraph: false,
      treeOptions: {
        // checkOnClickNode: true,
        // 展开联动、收缩不联动
        isToggleContact: true,
        // 高亮检索
        isHighLight: true
      },
      zoomControl: false,
      panControl: false,
      fkqGraph: {},
      // 获取行政区划对应的区域数据
      xzqhChange,
      // 行政区划绘图中
      xzqhChanging: false,
      // 行政区划改变，结束绘图后执行方法
      xzqhChangeEnd: false,
      fitBounds,
      leafletUtil: {}
    };
  },
  computed: {
    idSet() {
      return new Set(this.selectedList.map(e => e.id));
    },
    ...mapGetters(['user'])
  },
  methods: {
    // 左侧列表搜索事件
    search() {
      this.leftListConfig.searchCondition = [
        { name: 'SFSC', value: '1', op: '!=' },
        { name: 'MC', value: this.listSearch.GJZ, op: 'like' },
        { name: 'LX', value: this.listSearch.lx, op: 'like' },
        { name: 'SYFW', value: this.listSearch.syfw, op: '=' }
      ].filter(e => e.value && e.value !== 0);
      this.$refs.scroll.reinit();
    },
    infiniteLoad(result, nodeList) {
      nodeList.forEach(node => {
        const data = { ...node.data };
        if (!data.fkq) {
          const zbxx = data.zbxx;
          data.fkq = zbxx ? JSON.parse(zbxx) : [];
        }
        if (!data.lx) {
          data.lx = '';
        }
        this.$set(node, 'data', data);
        if (this.idSet.has(data.id)) {
          this.$set(node, 'checked', true);
        }
      });
    },
    // 已选列表改变
    checkedChange(node) {
      if (node.checked) {
        const data = deepClone(node.data);
        // 设置默认为进入方向
        data.fx = 'IN';
        this.selectedList.splice(0, 0, data);
      } else {
        const index = this.selectedList.findIndex(e => e.id === node.data.id);
        this.selectedList.splice(index, 1);
      }
    },
    cardListViewFkq(data, index, node) {
      // 未选中时点击不会锁定到某个卡片
      if (this.scrollModel === node.key) {
        this.viewFkqGraph(data);
      }
    },
    delRow({ $index, row }) {
      this.selectedList.splice($index, 1);
      const node = this.$refs.scroll.nodeList.find(e => e.data.id === row.id);
      node && this.$set(node, 'checked', false);
    },
    deleteControlCircle(data) {
      confirm('是否删除防控圈？').then(async () => {
        await deleteControlCircle(data.id);
        this.closeLayer();
        const index = this.selectedList.findIndex(e => e.id === data.id);
        if (index !== -1) {
          this.selectedList.splice(index, 1);
        }
        this.$message.success('删除防控圈成功！');
        this.search();
      });
    },

    loadEnd() {
      this.initing = false;
      this.bindResize();
      this.leafletUtil = new LeafletUtil(this.$refs.gis);
      // 防控圈缩放或者移动时，重绘中间的数字
      const resetNumber = _.debounce(() => {
        this.fkqChange(this.fkqModel.fkq);
      }, 100);
      this.leafletUtil.on('zoom', resetNumber).on('moveend', resetNumber);
    },
    /**
     * 手动触发图形改变事件，图形 平移 或缩放 或数据改变 时触发
     * @param fkq 新的防控圈图形数据
     * @return {Promise<void>}
     */
    async fkqChange(fkq) {
      if (!fkq) {
        fkq = [];
      }
      // 待删除的图形
      const fkqGraphDel = { ...this.fkqGraph };
      // 缓存的图形
      const fkqGraph = {};
      for (let i = 0; i < fkq.length; i++) {
        const dataItem = fkq[i];
        const key = dataItem.key;
        let layerItem = fkqGraphDel[key];
        if (layerItem) {
          // 已绘制且依旧存在的图形，从待删除去除
          delete fkqGraphDel[key];
        } else {
          // 在地图上绘制图形
          const layer = await this.leafletUtil.drawFkqLayer(dataItem);
          layerItem = { ...dataItem, layer };
        }
        // 图标数字重绘
        layerItem.marker && layerItem.marker.remove();
        layerItem.marker = this.leafletUtil.drawCenterNumber(layerItem.layer, i);
        fkqGraph[key] = layerItem;
      }
      Object.values(fkqGraphDel).forEach(({ layer, marker }) => {
        layer.remove();
        marker.remove();
      });
      this.fkqGraph = fkqGraph;
      if (this.xzqhChangeEnd) {
        const fn = this.xzqhChangeEnd;
        this.xzqhChangeEnd = false;
        await fn();
      }
      this.xzqhChanging = false;
    },
    async showLayer(params) {
      if (typeof params === 'string') {
        params = { layerId: params };
      }
      const { layerId, lastLayer, data } = params;

      if (layerId === 'view' && data.id === this.fkqModel.id) {
        // 左侧重复点击，把详情展开
        // 无需其余操作，直接显示上一次的即可
      } else if (layerId === 'view' || layerId === 'draw') {
        let fkqModel;
        if (data) {
          const res = await getControlCircleDetail(data.id);
          const zbxx = res.data.zbxx;
          fkqModel = { ...res.data, fkq: zbxx ? JSON.parse(zbxx) : [] };
        } else {
          // 没有传数据说明是新增
          fkqModel = {
            // 采集单位代码
            cjdwdm: this.user.securityOrg,
            // 采集人id
            cjrid: this.user.id,
            // 采集人姓名
            cjrxm: this.user.name,
            // 采集时间
            cjsj: longTime2Str(new Date(), 'yyyyMMddHHmmss'),
            // 是否删除
            sfsc: '0',
            // 防控圈列表
            fkq: []
          };
        }

        this.fkqModel = fkqModel;
        await this.fkqChange(fkqModel.fkq);
        this.fitBounds();
      }
      this.lastLayer = lastLayer;
      this.visibleLayer = layerId;
    },
    closeLayer(layerId) {
      let lastLayer = '';
      if (layerId === 'view') {
        lastLayer = this.lastLayer;
        this.lastLayer = '';
      }
      this.visibleLayer = lastLayer;
    },
    // 新增防控圈图形
    async drawFkqGraph(type) {
      this.isAddFkqGraph = true;
      const gis = this.$refs.gis;
      if (!this.zoomControl) {
        this.zoomControl = gis.addZoomControl('bottomright');
      }
      if (!this.panControl) {
        this.panControl = gis.addPanControl('bottomright');
      }
      const fkq = [...this.fkqModel.fkq];
      let layer;
      // 多边形
      if (type === 'POLYGON') {
        layer = await new Promise(resolve => {
          gis.drawPolygon(async polygon => {
            this.leafletUtil.getCenterPoint(polygon);
            // 多边形 回调函数
            const obj = { key: this.$tool.generateKey(), type, mapData: { xys: polygon.zbc } };
            fkq.push(obj);
            resolve(polygon);
          });
        });
      }
      // 圆
      if (type === 'CIRCULAR') {
        layer = await new Promise(resolve => {
          gis.drawCircle(async circle => {
            // 圆 回调函数
            const obj = {
              key: this.$tool.generateKey(),
              type,
              mapData: { xy: [circle.centerPoint.lat, circle.centerPoint.lng], option: { radius: circle.radius } }
            };
            fkq.push(obj);
            resolve(circle);
          });
        });
      }
      // 居中
      await this.leafletUtil.moveWarp(() => {
        this.fitBounds(layer.getBounds());
      });
      // 图形已经绘制完成，生成预览图
      fkq[fkq.length - 1].preview = await this.leafletUtil.drawFkqPreview(layer);
      // 绘制完成，立即移除
      layer.remove();
      this.exitDrawGraph();
      this.$set(this.fkqModel, 'fkq', fkq);
      await this.fkqChange(fkq);
    },
    // 退出绘图
    exitDrawGraph() {
      if (this.zoomControl) {
        this.zoomControl.remove();
        this.zoomControl = false;
      }
      if (this.panControl) {
        this.panControl.remove();
        this.panControl = false;
      }
      this.isAddFkqGraph = false;
    },
    clearHooks() {
      this.$refs.gis.clearHooks();
      this.exitDrawGraph();
      this.isAddFkqGraph = false;
    },
    drawDeleteLastVertex() {
      this.$refs.gis.drawDeleteLastVertex();
    },
    // 删除防控圈图形（不传参数删除全部）
    deleteFkqGraph(data) {
      const fkq = [...this.fkqModel.fkq];
      if (data) {
        // 删除一个
        const index = fkq.indexOf(data);
        fkq.splice(index, 1);
        this.fkqModel.xzqh = fkq.map(e => e.areaCode).join(',');
        this.fkqModel.fkq = fkq;
      } else {
        // 删除全部
        this.fkqModel.fkq = [];
        this.fkqModel.xzqh = '';
      }
      this.fkqChange(this.fkqModel.fkq);
    },
    // 查看防控圈图形
    async viewFkqGraph(data) {
      const layer = this.fkqGraph[data.key].layer;
      const bounds = layer && layer.getBounds();
      this.fitBounds(bounds);
    },
    // 保存防控圈
    async saveFkqModel() {
      if (!(await this.$refs.form.validate())) {
        return;
      }
      if (!this.fkqModel.fkq) {
        confirm('请选择行政区划或绘制防控圈后再保存！');
        return;
      }
      const data = deepClone(this.fkqModel);
      const fkq = [];
      for (let i = 0; i < data.fkq.length; i++) {
        const e = data.fkq[i];
        if (e.type === 'AREA') {
          // 行政区划地图数据不保存
          delete e.mapData;
        }
        // 如果预览使用的是 zpid，无需处理；否则把预览图保存到后端，替换为 zpid
        if (!e.zpid && e.preview) {
          e.zpid = await saveImg(e.preview);
        }
        // 删除预览图
        delete e.preview;
        fkq.push(e);
      }
      data.zbxx = JSON.stringify(fkq);
      data.lx = Array.from(new Set(fkq.map(e => (e.type === 'AREA' ? 'XZQH' : 'ZDY')))).join(',');
      // 删除多余字段
      delete data.fkq;

      await addOrEditControlCircle(data);
      this.$message.success(`保存防控圈成功！`);
      this.closeLayer();
      this.search();
    },
    // 清空已选防控圈
    deleteSelected() {
      confirm('是否清空？').then(() => {
        this.selectedList = [];
        const scroll = this.$refs.scroll;
        scroll &&
          scroll.nodeList.forEach(node => {
            this.$set(node, 'checked', false);
          });
      });
    }
  },
  created() {
    if (this.value) {
      this.showSelected = true;
      this.selectedList = deepClone(this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.control-circle {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  &.is-add-fkq-qy {
    .control-circle_left {
      display: none;
    }
    .control-circle_right {
      margin-left: -1rem;
      .fkq-layer {
        display: none;
      }
    }
  }
  &_left {
    position: relative;
    flex: 0 0 24.5rem;
    background: #fff;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .title-1 {
      display: flex;
      align-items: center;
      border-bottom: var(--border-light);
      padding: 0 1.5rem;
      height: 3.5rem;
      .flex-1 {
        flex: 1;
      }
      .draw-fkq {
        margin-left: auto;
      }
    }
  }
  &_right {
    flex: 1;
    /*padding-left: 1rem;*/
    overflow: hidden;
    position: relative;
    background: #f5f5f5;
  }
  .gis {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  &_search {
    padding: 1.5rem;
    .search-input {
      margin-bottom: 1.25rem;
    }
  }
  &_list {
    flex: 1;
    /deep/ .infinite-list__item {
      margin: 0 1.5rem;
      & + .infinite-list__item {
        margin-top: 1rem;
      }
    }
  }
  &-selected {
  }
  .el-form /deep/ {
    .el-form-item__label {
      padding-right: 0;
    }
    .hzgj .iconfont {
      font-size: 2rem;
    }
  }
  .qs-table {
    border: var(--border);
    border-radius: 2px;
    margin-bottom: 1.5rem;
    /deep/ .el-table .cell {
      padding: 0 1em;
    }
  }
  &-btns {
    text-align: center;
  }
  .draw-btn {
    position: absolute;
    z-index: 2;
    top: 1rem;
    right: 1rem;
    .btn-split {
      padding-bottom: 8px;
      display: block;
    }
  }
}
</style>
