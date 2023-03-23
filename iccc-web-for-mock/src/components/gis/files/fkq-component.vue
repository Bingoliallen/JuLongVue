<template>
  <div class="fkq-gl">
    <!-- 防控圈管理 begin -->
    <div class="fkq-manage" :class="{ 'is-active': fkqManageExpan }" id="fkqManage">
      <!-- 收缩按钮 -->
      <div class="fkq-manage__shrink" @click="handleShrikClick">
        <i class="el-icon-arrow-right"></i>
      </div>
      <!-- 防控篮 -->
      <div
        class="fkq-manage__basket is-pos-a"
        id="fkqBasket"
        :class="checkedDialogVisible ? 'is-opened' : ''"
        @click="handleFKbasketClick"
      >
        <span class="fkq-manage__basket-num" v-text="selectedData.data.length" v-show="selectedData.data.length"></span>
      </div>
      <!-- 防控篮:选中的卡片飞入防控篮 -->
      <transition
        appear
        @after-appear="afterEnter"
        @before-appear="beforeEnter"
        v-for="(item, index) in showMoveDot"
        :key="index"
      >
        <div class="fkq-basket__ball" ref="ball" v-if="item.isShow">
          <div class="fkq-basket__box">
            <div class="fkq-manage__card is-active">
              <i
                class="fkq-manage__card-flag is-pos-a"
                v-text="item.useType"
                :class="item.useType === '私用' ? 'is-private' : ''"
              ></i>
              <div class="fkq-manage__card-top">
                <h2 v-text="item.name"></h2>
              </div>
              <div class="fkq-manage__card-main">
                <label class="fkq-manage__card-tag" v-text="item.type"></label>
              </div>
              <div class="fkq-manage__card-bottom">
                <el-checkbox label="" v-model="item.checked"> </el-checkbox>
                <div v-if="item.createDeptCode === paramJson.createUnit">
                  <i class="el-icon-edit fkq-manage__card-icon" title="编辑"></i>
                  <i class="el-icon-delete fkq-manage__card-icon" title="删除"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 头部 -->
      <div class="fkq-manage__top">
        <h2 class="fkq-manage__title">防控圈管理</h2>
        <el-button type="text" @click="handleClickDraw"><i class="fkq-icon-huizhi"></i>绘制</el-button>
      </div>
      <!-- 搜索区域 -->
      <div class="fkq-manage__searcharea">
        <el-row>
          <el-col :span="24">
            <el-input
              @keyup.enter.native="onSearch"
              placeholder="防控圈名称"
              size="small"
              v-model="tableData.paramMap.name"
            >
              <el-button
                slot="append"
                class="fkq-manage__searchbtn"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-select
              size="small"
              @change="onSearch"
              popper-class="fkq-el-select"
              v-model="tableData.paramMap.type"
              placeholder="请选择"
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select
              size="small"
              @change="onSearch"
              popper-class="fkq-el-select"
              v-model="tableData.paramMap.useType"
              placeholder="请选择"
            >
              <el-option v-for="item in propertys" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <!-- 主内容-卡片区域 -->
      <div class="fkq-manage__main" id="fkqManageMain">
        <ul class="fkq-manage__cards">
          <li v-if="tableData.data.length === 0" style="text-align: center;color: #8c939d">暂无数据</li>
          <li
            v-else
            class="fkq-manage__card"
            v-for="(item, index) of tableData.data"
            :key="index"
            :id="'basket' + index"
            @click="handleClickDetail(item, 1)"
            :class="{ 'is-active': item.checked }"
          >
            <i
              class="fkq-manage__card-flag is-pos-a"
              v-text="item.useType"
              :class="item.useType === '私用' ? 'is-private' : ''"
            ></i>
            <div class="fkq-manage__card-top">
              <h2 v-text="item.name"></h2>
            </div>
            <div class="fkq-manage__card-main">
              <label class="fkq-manage__card-tag" v-text="item.type"></label>
            </div>
            <div class="fkq-manage__card-bottom">
              <el-checkbox
                label=""
                @click.stop.native=""
                @change="handleCardClick(item.checked, item, index)"
                :checked="isSelectedData(item)"
                v-model="item.checked"
              >
              </el-checkbox>
              <div v-if="item.createDeptCode === paramJson.createUnit">
                <i
                  class="el-icon-edit fkq-manage__card-icon"
                  @click.stop.prevent="handleClickEdit(item)"
                  title="编辑"
                ></i>
                <i
                  class="el-icon-delete fkq-manage__card-icon"
                  @click.stop.prevent="handleClickRemove(item)"
                  title="删除"
                ></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 底部-分页 -->
      <div class="fkq-manage__footer">
        <!--分页 begin-->
        <div style="text-align: right;margin: 10px 0 5px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableData.currentPage"
            :pager-count="5"
            small
            :page-size="tableData.pageSize"
            layout="prev, pager, next"
            :total="tableData.total"
          >
          </el-pagination>
        </div>
        <!--分页 end-->
      </div>
    </div>
    <!-- 防控圈管理 end -->

    <!--    画图过程工具-->
    <div v-if="polygonToolVisible">
      <el-button
        type="primary"
        @click="cancelpolygonDraw"
        style="z-index:1000;position:absolute;bottom:270px;right:22px;"
        >返回
      </el-button>
      <el-button
        type="primary"
        @click="drawDeleteLastVertex"
        style="z-index:1000;position:absolute;bottom:220px;right:22px;"
        >撤销
      </el-button>
    </div>

    <!-- 已选防控圈 begin-->
    <!-- <el-dialog
      title="已选防控圈"
      :visible.sync="checkedDialogVisible"
      :append-to-body="false"
      :modal="false"
      :custom-class="'checkedDialog'"
      :top="'0'"
      :close-on-click-modal=true
      width="350px">
      <el-row class="b-mb10">
        <el-col :span="24" style="display: flex;justify-content: space-between;">
          <el-button size="small" type="primary" @click="handleSelectedClickRemoveAll">清空</el-button>
        </el-col>
      </el-row>
      <div>
        <el-table
          :data="selectedData.data"
          border
          style="width: 100%"
          class="table-srcoll">
          <el-table-column
            label="序号"
            align="center"
            width="60">
            <template slot-scope="scope" v-if="scope.row.name">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="防控圈名称">
            <template slot-scope="scope">
              <el-button @click="handleClickDetail(scope.row,0)" type="text" size="mini">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="70"
            align="center"
            label="操作">
            <template slot-scope="scope" v-if="scope.row.name">
              <i class="el-icon-remove-outline fkq-manage__card-icon" @click="handleSelectedClickRemove(scope.row)"
                title="移除"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>  -->

    <transition name="fade">
      <div class="fkq-right el-dialog fkq-dialog checkedDialog" v-show="checkedDialogVisible" style="width:350px;">
        <div class="el-dialog__header">
          <span class="el-dialog__title">已选防控圈</span>
          <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="checkedDialogClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <el-row class="b-mb10">
            <el-col :span="24" style="display: flex;justify-content: space-between;">
              <el-button size="small" type="primary" @click="handleSelectedClickRemoveAll">清空</el-button>
            </el-col>
          </el-row>
          <div>
            <el-table :data="selectedData.data" border style="width: 100%" class="table-srcoll">
              <!--          多选删除功能暂时取消-->
              <!--          <el-table-column-->
              <!--            type="selection"-->
              <!--            width="36">-->
              <!--          </el-table-column>-->
              <el-table-column label="序号" align="center" width="60">
                <template slot-scope="scope" v-if="scope.row.name">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column align="left" label="防控圈名称">
                <template slot-scope="scope">
                  <el-button @click="handleClickDetail(scope.row, 0)" type="text" size="mini"
                    >{{ scope.row.name }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column width="70" align="center" label="操作">
                <template slot-scope="scope" v-if="scope.row.name">
                  <i
                    class="el-icon-remove-outline fkq-manage__card-icon"
                    @click="handleSelectedClickRemove(scope.row)"
                    title="移除"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </transition>

    <!-- 已选防控圈 end-->

    <!-- 新建防控圈 begin-->
    <transition name="fade">
      <div class="fkq-right el-dialog fkq-dialog" v-show="formDialogVisible">
        <div class="el-dialog__header">
          <span class="el-dialog__title">防控圈绘制</span>
          <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="handleFormClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <el-form :model="form" label-width="80px">
            <el-form-item>
              <div slot="label"><span class="ft-red">*</span>名称：</div>
              <el-input size="small" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <div slot="label">描述：</div>
              <el-input v-model="form.description" type="textarea" :rows="2" placeholder=""> </el-input>
            </el-form-item>
            <el-form-item>
              <div slot="label"><span class="ft-red">*</span>使用范围：</div>
              <div>
                <el-select
                  size="small"
                  popper-class="fkq-el-select"
                  v-model="form.useType"
                  placeholder="请选择使用范围"
                  width="100%"
                >
                  <el-option label="公用" value="GY"></el-option>
                  <el-option label="私用" value="SY"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="创建时间：">{{ form.time }}</el-form-item>
            <el-form-item label="创建单位：">{{ deptName }}</el-form-item>
            <el-form-item>
              <div slot="label"><span class="ft-red">*</span>类别：</div>
              <div>
                <el-select
                  popper-class="fkq-el-select"
                  size="small"
                  v-model="form.type"
                  placeholder="请选择活动区域"
                  width="100%"
                  @change="categoryChange"
                >
                  <el-option label="自定义区域" value="1"></el-option>
                  <el-option label="行政区划" value="2"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="行政区划：" v-if="treeInputVisible" id="locationBox" class="fkq-xzch-item">
              <span class="el-input__suffix">
                <span class="el-input__suffix-inner">
                  <i
                    @click="fkqHandleQueryBoxFocus"
                    class="el-select__caret el-input__icon el-icon-arrow-down"
                    :class="treeVisible ? 'is-reverse' : ''"
                  ></i>
                </span>
              </span>
              <el-input placeholder="请选择区域" @focus="fkqHandleQueryBoxFocus" v-model="checkedXzqh"> </el-input>

              <div v-if="treeVisible" class="fkq-right__tree" style="top:40px;">
                <el-tree
                  v-if="activityZoneVisible"
                  :props="Treeprops"
                  :load="loadNodeData"
                  ref="deptTree"
                  lazy
                  node-key="id"
                  show-checkbox
                  :check-strictly="true"
                  @check-change="handleCheckChange"
                >
                </el-tree>
              </div>
            </el-form-item>
            <el-form-item label="绘制工具：" v-if="drawToolCaseVisible">
              <el-button type="text" title="多边形" @click="handleToolClick($event, 'polygon')"
                ><a href="javascript:;" class="fkq-btn-draw is-polygon"></a>
              </el-button>
              <el-button type="text" title="圆形" @click="handleToolClick($event, 'circle')"
                ><a href="javascript:;" class="fkq-btn-draw is-circle"></a>
              </el-button>
            </el-form-item>
            <el-form-item label="防控圈：">
              <template slote-scope="scope">
                <el-button type="text" v-if="form.prevention.length !== 0" @click="handleClickRemoveAll"
                  >清空</el-button
                >
                <label v-else class="el-form-item__label">暂无数据</label>

                <div class="fkq-map-img__box">
                  <div v-for="(item, index) in form.prevention" :key="index" :class="['fkq-map-img']">
                    <i @click="handleClickRemoveCircle(index)" class="i_close"></i>
                    <img
                      @click="handleFkqClick(item)"
                      :title="xzqhFullName(item)"
                      src="/static/map/example/images/icon_map.png"
                      alt="加载中.."
                      width="100%"
                    />
                    <!--                    <span class="is-num">{{item.xh}}</span>-->
                    <span class="is-num">{{ index + 1 }}</span>

                    <!--文字提示-->
                    <div v-if="item.lx === 'XZQH'" :title="xzqhFullName(item)" class="fkq-text-tip">
                      {{ item.mapData ? bmXzqhCache[item.mapData] : bmXzqhCache[item.cs.qh] }}
                    </div>
                  </div>

                  <!-- <div
                    v-if="addIconShow"
                    @click="handleClickAddCircle"
                    class="fkq-map-add">
                    <i class="i_add"></i>
                  </div> -->
                </div>
              </template>
            </el-form-item>
            <el-form-item>
              <!-- <div v-if="toolsVisible" class="qb-poi-search-tools" :style="{width: (poiWidth-20) + 'px'}">
                <ul>
                  <li class="title">
                  </li> -->
              <!--                暂时去掉点和线的支持，仅实现圆 多边形 -->

              <!--                <li class="item item-b-l" v-popover:popover-point-range @click="handleToolClick($event, 'point')">-->
              <!--                  <i></i>-->
              <!--                  <span>点</span>-->
              <!--                  <el-popover-->
              <!--                    ref="popover-point-range"-->
              <!--                    placement="top"-->
              <!--                    width="105"-->
              <!--                    trigger="hover">-->
              <!--                    半径-->
              <!--                    <el-input-->
              <!--                      v-model="pointRange"-->
              <!--                      style="width: 60px"-->
              <!--                      :title="'半径'+pointRange+'米'"-->
              <!--                      :size="size">-->
              <!--                    </el-input>-->
              <!--                    米-->
              <!--                  </el-popover>-->
              <!--                </li>-->
              <!--                <li class="item item-b-l" v-popover:popover-line-range @click="handleToolClick($event, 'line')">-->
              <!--                  <i></i>-->
              <!--                  <span>线</span>-->
              <!--                  <el-popover-->
              <!--                    ref="popover-line-range"-->
              <!--                    placement="top"-->
              <!--                    width="105"-->
              <!--                    trigger="hover">-->
              <!--                    周边-->
              <!--                    <el-input-->
              <!--                      v-model="lineRange"-->
              <!--                      style="width: 60px"-->
              <!--                      :title="'周边'+lineRange+'米'"-->
              <!--                      :size="size">-->
              <!--                    </el-input>-->
              <!--                    米-->
              <!--                  </el-popover>-->
              <!--                </li>-->
              <!-- <li class="item item-b-l" @click="handleToolClick($event, 'polygon')">
                <i></i>
                <span>多边形</span>
              </li>
              <li class="item item-b-l" @click="handleToolClick($event, 'circle')">
                <i></i>
                <span>圆</span>
              </li> -->
              <!--              <li class="item item-b-l item-b-r" @click="handleToolClick($event, 'rect')">-->
              <!--                <i></i>-->
              <!--                <span>矩形</span>-->
              <!--              </li>-->
              <!-- </ul>
            </div> -->
            </el-form-item>
          </el-form>

          <div class="el-dialog__footer">
            <el-button size="small" @click="handleFormClose">关闭</el-button>
            <el-button size="small" type="primary" @click="saveFkqCase">完 成</el-button>
          </div>
        </div>
      </div>
    </transition>
    <!--新建防控圈 end-->

    <!--防控圈查看 begin-->
    <transition name="fade">
      <div
        class="fkq-right el-dialog fkq-dialog"
        v-show="detailDialogVisible"
        :class="{ 'is-pos-a': fkqCheckedDetailFlag }"
      >
        <div class="el-dialog__header">
          <span class="el-dialog__title">防控圈查看</span>
          <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="handleDetailClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <el-form label-width="80px">
            <el-form-item>
              <div slot="label">名称：</div>
              <div>{{ detailData.name }}</div>
            </el-form-item>
            <el-form-item>
              <div slot="label">描述：</div>
              <div>{{ detailData.description }}</div>
            </el-form-item>
            <el-form-item>
              <div slot="label">使用范围：</div>
              <div>{{ detailData.useType }}</div>
            </el-form-item>
            <el-form-item label="创建时间：">{{ detailData.time }}</el-form-item>
            <el-form-item label="创建单位：">{{ detailData.createDept }}</el-form-item>
            <el-form-item>
              <div slot="label">类别：</div>
              <div>{{ detailData.type }}</div>
            </el-form-item>
            <el-form-item label="防控圈：">
              <template slote-scope="scope">
                <div class="fkq-map-img__box">
                  <div v-for="(item, index) in detailData.prevention" :key="index" :class="['fkq-map-img']">
                    <img
                      @click="handleFkqClick(item)"
                      :title="xzqhFullName(item)"
                      src="/static/map/example/images/icon_map.png"
                      alt="加载中.."
                      width="100%"
                    />
                    <span class="is-num">{{ ++index }}</span>
                    <!--文字提示-->
                    <div v-if="item.lx === 'XZQH'" :title="xzqhFullName(item)" class="fkq-text-tip">
                      {{ bmXzqhCache[item.cs.qh] }}
                    </div>
                  </div>
                </div>
              </template>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </transition>
    <!--防控圈查看 end-->
  </div>
</template>

<script>
export default {
  name: 'FkqMapComponent',
  props: {
    mapRef: { type: String, request: true }, //地图引用id
    mapApiRef: { type: String, request: true }, //地图api引用id
    poiWidth: { type: Number, default: 370 }, //控件宽度
    paramJson: { type: Object } //来源应用ID、来源应用名称、创建人ID、创建人姓名、创建人身份证号、创建人单位等字段
  },
  data() {
    return {
      /**
       * 防控圈数据
       * */
      fkqManageExpan: true, //左侧防空圈管理是否展开
      checkedNums: 0, //防控篮 数量
      fkqCheckedDetailFlag: false, //已选防控圈详情弹窗显示位置判断

      map: null,
      axios: null,
      bmXzqhCache: null, //行政区划简称
      bmXzqhQcCache: null, //行政区划全称
      deptName: '',
      formDialogVisible: false, //编辑表单是否可见
      detailDialogVisible: false, //详情表单是否可见
      checkedDialogVisible: false, //已选防控圈购物篮是否可见
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'CUSTOM',
          label: '自定义区域'
        },
        {
          value: 'XZQY',
          label: '行政区划'
        }
      ], //行政区划搜索变量
      propertys: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'GY',
          label: '公用'
        },
        {
          value: 'SY',
          label: '私用'
        }
      ], //使用范围搜索变量
      form: {
        id: '',
        name: '',
        type: '',
        useType: '',
        description: '',
        time: '',
        prevention: []
      }, //表单数据
      Treeprops: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      }, //区划树数据结构
      checkDatas: [], //区划树已选数据    --暂保留  当前版本未用到
      activityZoneVisible: false, //区划树是否可见
      pointRange: 1000, //点周围半径   --暂保留  当前版本未用到
      lineRange: 1000, //线周边半径     --暂保留  当前版本未用到
      tableData: {
        data: [],
        paramMap: { name: '', useType: '', type: '', creatorDept: '', sourceApplicationID: '' },
        total: 0,
        pageSize: 5,
        currentPage: 1
      }, //防控圈列表数据
      detailData: {
        id: '',
        name: '',
        type: '',
        useType: 'GY',
        description: '',
        time: '',
        createDept: '',
        prevention: []
      }, //防控圈详情数据
      selectedData: {
        data: [],
        total: 0
      }, //购物篮列表数据
      showSelectedData: [], //购物篮列表展示数据
      showMoveDot: [], //购物篮：控制下落的小圆点显示隐藏
      elLeft: 0, //购物篮：当前点击购物车按钮在网页中的绝对top值
      elTop: 0, //购物篮：当前点击购物车按钮在网页中的绝对left值
      mapMarkers: new Map(), //地图打点对象集合
      numberMarkers: new Map(), //地图数字集合
      highLightMarkers: new Map(), //高亮地图对象集合

      treeVisible: false, // 树形选择区域是否可见
      // treeValue: '',        //已选区划数据
      polygonToolVisible: false //多边形操作工具箱可见性
    };
  },
  methods: {
    addToMap(map) {
      this.axios = this.$req;
      this.map = map;
    },

    /**
     * 表单校验
     */
    validate(form) {
      if (!form.name) {
        this.$message.warning('请填写名称！');
        return false;
      } else if (!form.type) {
        this.$message.warning('请选择类别！');
        return false;
      } else if (!form.useType) {
        this.$message.warning('请选择使用范围！');
        return false;
      } else if (form.name.length > 25) {
        this.$message.warning('防控圈名称过长！不能超过25个字符！');
        return false;
      } else if (form.description.length > 100) {
        this.$message.warning('描述过长！不能超过100个字符！');
        return false;
      }
      return true;
    },

    /**
     * 保存防控圈
     */
    saveFkqCase(fkqJson) {
      if (this.validate(this.form)) {
        let _this = this;
        let fkqSaveVo = {
          id: this.form.id,
          mc: this.form.name,
          sm: this.form.description,
          qycs: JSON.stringify(_this.calculateFkqQycs(this.form.prevention)),
          qylx: this.form.type === '1' ? 'CUSTOM' : 'XZQY',
          syfw: this.form.useType,
          lyyyid: this.paramJson.sourceID,
          lyyymc: this.paramJson.sourceName,
          cjrid: this.paramJson.createID,
          cjrsm: this.paramJson.createName,
          cjrsfzh: this.paramJson.createSFZ,
          cjrdw: this.paramJson.createUnit
        };
        this.axios.post(`${window.gisConfig.fkqServerUrl}/fkq/config/`, fkqSaveVo, this.headers_config).then(res => {
          if (res.data.status === 1) {
            _this.$message.success('防控圈方案配置成功！');
            _this.clearFormData();
            _this.handleFormClose();
            _this.onSearch();
            _this.handleClickDetail(res.data.data, 1);
          } else {
            _this.$message.warning(res.data.errMessage);
          }
        });
      }
    },

    /**
     * 计算自定义参数的参数存储字段内容
     */
    calculateFkqQycs(paramArr) {
      let result = [];
      paramArr.forEach((value, index) => {
        result.push({
          xh: value.xh,
          lx: value.type === 'XZQH' ? 'XZQH' : 'CUSTOM',
          cs: value.type === 'XZQH' ? { qh: value.mapData } : this.getCustomizeParam(value.mapData, value.type)
        });
      });
      return result;
    },

    /**
     * 计算自定义参数的参数存储字段内容
     */
    getCustomizeParam(mapData, type) {
      if (type === 'POLYGON') {
        return { bklx: 'POLYGON', zb: mapData };
      } else if (type === 'CIRCULAR') {
        return { bklx: 'CIRCULAR', yxzb: mapData.centerPoint, bj: mapData.radius };
      }
    },
    /**
     * 防控圈管理 表格内容详情
     * */
    handleClickDetail(row, flag) {
      let _this = this;
      this.removeAllMapDraw();
      this.detailDialogVisible = true;
      this.formDialogVisible = false;
      this.checkedDialogVisible = flag === 0;
      _this.axios.get(window.gisConfig.fkqServerUrl + '/fkq/config/detail/' + row.id).then(res => {
        if (res.data.status === 1) {
          _this.detailData = { ...res.data.data };
          if (_this.detailData.type === '自定义区域') {
            let prevention = JSON.parse(res.data.data.prevention);
            prevention.forEach((value, index) => {
              if (value.cs.bklx === 'POLYGON') {
                prevention[index] = Object.assign({}, value, {
                  type: value.cs.bklx,
                  mapData: value.cs.zb
                });
              } else if (value.cs.bklx === 'CIRCULAR') {
                prevention[index] = Object.assign({}, value, {
                  type: value.cs.bklx,
                  mapData: { centerPoint: value.cs.yxzb, radius: value.cs.bj }
                });
              }
            });
            _this.detailData.prevention = prevention;
            _this.constructDetailMapLayer(_this.detailData.prevention);
          } else {
            _this.detailData.prevention = JSON.parse(res.data.data.prevention);
            _this.detailData.prevention.forEach(o => Object.assign(o, { mapData: o.cs.qh }));
            _this.drawXzqhs(_this.detailData.prevention.map(o => o.mapData));
          }
        } else {
          _this.$message.warning(res.data.errMessage);
        }
      });
    },
    /**
     * 防控圈管理 表格内容编辑
     * */
    handleClickEdit(row) {
      this.removeAllMapDraw();

      let _this = this;
      this.detailDialogVisible = false;
      this.formDialogVisible = true;
      this.checkedDialogVisible = false;
      _this.axios.get(window.gisConfig.fkqServerUrl + '/fkq/config/detail/' + row.id).then(res => {
        if (res.data.status === 1) {
          _this.form = { ...res.data.data };
          _this.form.useType = res.data.data.useType === '公用' ? 'GY' : 'SY';
          _this.form.prevention = JSON.parse(res.data.data.prevention);
          _this.form.type = _this.form.type === '自定义区域' ? '1' : '2';
          if (_this.form.type === '1') {
            let prevention = _this.form.prevention;
            prevention.forEach((value, index) => {
              if (value.cs.bklx === 'POLYGON') {
                prevention[index] = Object.assign({}, value, {
                  type: value.cs.bklx,
                  mapData: value.cs.zb
                });
              } else if (value.cs.bklx === 'CIRCULAR') {
                prevention[index] = Object.assign({}, value, {
                  type: value.cs.bklx,
                  mapData: { centerPoint: value.cs.yxzb, radius: value.cs.bj }
                });
              }
            });
            _this.form.prevention = prevention;
            _this.constructDetailMapLayer(_this.form.prevention);
          } else {
            let xzqhArr = [];
            _this.form.prevention.forEach(value => xzqhArr.push(_this.bmXzqhCache[value.cs.qh]));
            _this.form.prevention.forEach(o => Object.assign(o, { mapData: o.cs.qh }));
            // _this.treeValue = xzqhArr.join(",");
          }
        } else {
          _this.$message.warning(res.data.errMessage);
        }
      });
    },
    /**
     * 防控圈管理 表格内容删除
     * */
    handleClickRemove(row) {
      let _this = this;
      this.$confirm('删除后该防控圈的相关服务将无法使用，确认要删除防控圈吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: '',
        type: 'warning'
      }).then(() => {
        _this.axios.delete(window.gisConfig.fkqServerUrl + '/fkq/config/' + row.id).then(res => {
          if (res.data.status === 1 && res.data.data === 'success') {
            //如果详情框为正在被删除的数据，则将详情框隐藏
            if (_this.detailData.id === row.id) {
              _this.detailDialogVisible = false;
            }
            //同步更改购物篮
            if (_this.selectedData.data.map(o => o.id).indexOf(row.id) !== -1) {
              _this.selectedData.data.splice(_this.selectedData.data.map(o => o.id).indexOf(row.id), 1);
            }
            _this.$message.success('防控圈删除成功！ ');
            _this.search();
          } else {
            _this.$message.warning(res.data.errMessage);
          }
        });
      });
    },

    /**
     * 防控圈点击（高亮&居中）
     */
    handleFkqClick(row, type) {
      console.log(row);
      this.highLightMarkers.forEach((value, key) => {
        let normalStyle = {
          weight: 2,
          color: '#3388ff',
          fillColor: '#3388ff',
          fillOpacity: 0.3
        };
        this.map.setStyle(key, normalStyle);
      });
      this.highLightMarkers = new Map();
      if (row.lx === 'CUSTOM') {
        //居中
        let centerLocation;
        if (row.type === 'POLYGON') {
          centerLocation = [
            eval(row.mapData.map(o => o[0]).join('+')) / row.mapData.length,
            eval(row.mapData.map(o => o[1]).join('+')) / row.mapData.length
          ];
        } else if (row.type === 'CIRCULAR') {
          centerLocation = row.mapData.centerPoint;
        }
        this.map.panTo(centerLocation);

        //高亮
        let currentArea = this.mapMarkers.get(row);
        let highLightConf = { weight: 2, color: '#F5212d', fillColor: '#F5212d', fillOpacity: 0.3 };
        this.highLightMarkers.set(currentArea, this.map.setStyle(currentArea, highLightConf));
      } else if (row.lx === 'XZQH') {
        this.drawXzqh(row.mapData);
      }
    },

    /**
     * 移除所有地图画圈
     * */
    removeAllMapDraw() {
      //取消地图画圈
      this.mapMarkers.forEach(val => {
        this.removeDraw(val);
      });
      //取消圈内数字
      this.numberMarkers.forEach(val => {
        this.removeDraw(val);
      });
      this.highLightMarkers = new Map();
      this.mapMarkers = new Map();
    },
    /**
     * 分页
     * */
    handleSizeChange(pageSize) {
      this.tableData.pageSize = pageSize;
      this.onSearch();
    },

    /**
     * 防控圈列表分页
     */
    handleCurrentChange(pageNum) {
      this.tableData.currentPage = pageNum;
      this.search();
    },

    /**
     * 购物篮分页
     */
    selectedCurrentChange(pageNum) {
      this.selectedData.currentPage = pageNum;
    },

    /**
     * 购物篮--点击复选框给showMoveDot增加true的属性
     */
    addToCart(id, item) {
      var target = document.getElementById(id);
      // console.log(document.getElementById(id).getBoundingClientRect());
      this.elLeft = target.getBoundingClientRect().left;
      this.elTop = target.getBoundingClientRect().top;
      let tempObj = { ...item, isShow: true };
      this.showMoveDot.push(tempObj);
      // this.showMoveDot = [...this.showMoveDot, true];
    },

    /**
     * 购物篮--动画渲染
     */
    beforeEnter(el) {
      // 设置transform值
      el.style.transform = `translate3d(${this.elLeft}px,${this.elTop}px , 0)`;
      // 设置透明度
      el.style.opacity = 0;
    },

    /**
     * 购物篮--动画渲染
     */
    afterEnter(el) {
      // 获取底部购物车徽标
      const badgePosition = document.getElementById('fkqBasket').getBoundingClientRect();
      // 设置小球移动的位移
      el.style.transform = `translate3d(${badgePosition.left - 100}px,${badgePosition.top - 30}px,0)`;
      // 增加贝塞尔曲线
      el.style.transition = 'transform .3s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
      el.style.transition = 'transform .3s linear';
      this.showMoveDot = this.showMoveDot.map(item => {
        return (item.isShow = false);
      });
      // 设置透明度
      el.style.opacity = 1;

      // 监听小球动画结束方法
      el.addEventListener('transitionend', () => {
        el.style.display = 'none';
        this.listenInCart();
      });
      // 监听小球动画结束方法
      el.addEventListener('webkitAnimationEnd', () => {
        el.style.display = 'none';
        this.listenInCart();
      });
    },

    /**
     * 购物篮--底部Tabbar购物车的DOM元素添加class
     */
    listenInCart() {
      // 拿到底部Tabbar购物车的DOM元素添加class
      document.getElementById('fkqBasket').classList.add('moveToCart');
      setTimeout(() => {
        // 500毫秒后移除底部Tabbar购物车的DOM元素class
        document.getElementById('fkqBasket').classList.remove('moveToCart');
      }, 500);
    },

    /**
     * 绘制新建防控圈
     * */
    handleClickDraw() {
      this.detailDialogVisible = false;
      this.formDialogVisible = true;
      this.checkedDialogVisible = false;
      this.clearFormData();
      this.removeAllMapDraw();
      this.form.time = new Date().format('yyyy-MM-dd hh:mm:ss');
    },
    /**
     * 增加防控圈
     * */
    handleClickAddCircle() {
      if (this.form.type === '2') {
        this.activityZoneVisible = true;
        // this.toolsVisible = false;
      } else if (this.form.type === '1') {
        this.activityZoneVisible = false;
        // this.toolsVisible = true;
      }
    },
    /**
     * 删除单个防控圈
     * */
    handleClickRemoveCircle(index) {
      this.$confirm('确认要删除防控圈吗？', '提示').then(() => {
        if (this.form.type === '1') {
          //去除所选的防控圈图形
          this.removeDraw(this.mapMarkers.get(this.form.prevention[index]));
          this.mapMarkers.delete(this.form.prevention[index]);
          this.form.prevention.splice(index, 1);

          this.numberMarkers.forEach(value => {
            this.removeDraw(value);
          });
          this.numberMarkers = new Map();
          //移除所有的数字标识，重新渲染
          this.mapMarkers.forEach((value, key) => {
            this.drawCenterNumber(key, key.type, this.form.prevention.indexOf(key) + 1);
          });
        } else {
          //行政区划防控圈暂时只有一个  使用全清空
          this.removeAllMapDraw();
          //清除行政区划输入框的内容
          this.form.prevention.splice(index, 1);
          // this.treeValue = this.form.prevention.join(",");
        }
      });
    },
    /**
     * 清空防控圈
     * */
    handleClickRemoveAll(trigger, type) {
      if (trigger === 'categoryChange') {
        if (this.form.type === '1' || type === '2') {
          this.removeAllMapDraw();
        }
        this.form.prevention = [];
      } else {
        this.$confirm('确认要清空防控圈吗？').then(() => {
          if (this.form.type === '1' || type === '2') {
            this.form.prevention = [];
          } else {
            //清除行政区划输入框的内容
            this.form.prevention = [];
            // this.treeValue = this.form.prevention.join(",");
          }
          this.removeAllMapDraw();
        });
      }
    },

    /**
     *  清空购物篮
     */
    handleSelectedClickRemoveAll() {
      this.$confirm('确认要清空已选防控圈吗？', '提示').then(() => {
        this.selectedData.data = [];
        this.selectedData.data.length = 0;
        this.updateCheckBoxStatus();
      });
    },

    /**
     * 购物篮防控圈删除
     */
    handleSelectedClickRemove(row) {
      this.selectedData.data.splice(this.selectedData.data.map(o => o.id).indexOf(row.id), 1);
      this.updateCheckBoxStatus();
    },

    updateCheckBoxStatus() {
      this.tableData.data.forEach(value => {
        value.checked = this.selectedData.data.map(o => o.id).indexOf(value.id) !== -1;
      });
    },

    initFkqMapComponent() {
      this.map = this.$root.$refs[this.mapRef];
      this.mapApi = this.$root.$refs[this.mapApiRef];
      this.axios = this.$root.axios;

      if (typeof this.map === 'undefined' || typeof this.mapApi === 'undefined') {
        // window.setTimeout(this.initFkqMapComponent, 500);
      }
    },

    /**
     * 单击地图工具事件
     * @param event
     * @param tool point-点、line-线、polygon-多边形、circle-圆、rect-矩形
     * @param poi
     */
    handleToolClick(event, toolName) {
      //左边管理页面收起
      this.fkqManageExpan = false;
      this.formDialogVisible = false;
      this.checkedDialogVisible = false;

      window.zoomControl = this.map.addZoomControl('bottomright');
      window.panControl = this.map.addPanControl('bottomright');

      //2.打开画图工具
      if (toolName === 'point') {
        this.drawPoint();
      } else if (toolName === 'line') {
        this.drawLine();
      } else if (toolName === 'polygon') {
        this.drawPolygon();
      } else if (toolName === 'circle') {
        this.drawCircle();
      } else if (toolName === 'rect') {
        this.drawRect();
      } else {
        console.log('未实现的画图');
      }
    },
    /**
     * 工具箱-点
     */
    drawPoint() {
      let the = this;
      //采集点图标
      let markerJSON = {};
      //绝对路径
      markerJSON.iconUrl = '../images/marker-icon.png';
      //图片偏移（坐标固定在图标的哪个点，[0,0]表示图标的左上角）
      markerJSON.iconAnchor = [21, 42];
      //图片大小
      markerJSON.width = 42;
      markerJSON.height = 42;
      let dragFlag = false; //是否可移动,仅适用于leaflet开发技术，minemap不生效
      this.map.drawMarker(markerJSON, dragFlag, function(point) {
        //以下代码仅供展示(画圆)
        let circleJson = {};
        //圆心
        circleJson.xy = [point.xy.lat, point.xy.lng];
        circleJson.option = {};
        //圆半径
        circleJson.option.radius = the.pointRange; //单位米
        //边界线颜色
        circleJson.option.color = '#00BFFF';
        //填充颜色
        circleJson.option.fillColor = '#3388ff';
        //透明度
        circleJson.option.fillOpacity = 0.5;
        let circle = the.map.addCircle(circleJson);
        //加入撒点集合
        console.log('circle', circle);
      });
    },
    /**
     * 工具箱-线
     */
    drawLine() {
      let the = this;
      this.map.drawPolyline(function(polyline) {
        the.handleToolDrawCb(polyline, 'POLYLINE');
      });
    },
    /**
     * 工具箱-多边形
     */
    drawPolygon() {
      let the = this;
      this.polygonToolVisible = true;
      this.map.drawPolygon(function(polygon) {
        the.handleToolDrawCb(polygon, 'POLYGON');
        the.polygonToolVisible = false;
      });
    },
    /**
     * 工具箱-圆
     */
    drawCircle() {
      let the = this;
      this.map.drawCircle(function(circle) {
        the.handleToolDrawCb(circle, 'CIRCULAR');
      });
    },
    /**
     * 工具箱-矩形
     */
    drawRect() {
      let the = this;
      this.map.drawRect(function(rect) {
        the.handleToolDrawCb(rect, 'RECT');
      });
    },

    cancelpolygonDraw() {
      this.map.clearHooks();
      //清除地图控制工具
      if (window.zoomControl) {
        window.zoomControl.remove();
      }
      if (window.panControl) {
        window.panControl.remove();
      }

      //隐藏工具栏
      this.polygonToolVisible = false;
      //显示左侧管理页面
      this.fkqManageExpan = true;
      //1.显示poi图层、工具箱
      //显示图层
      this.formDialogVisible = true;
    },
    drawDeleteLastVertex() {
      this.map.drawDeleteLastVertex();
    },

    /**
     * 工具箱-点、线、多边形、圆矩形画完后回调方法
     * @param data
     * @param type
     */
    handleToolDrawCb(data, type) {
      if (window.zoomControl) {
        window.zoomControl.remove();
      }
      if (window.panControl) {
        window.panControl.remove();
      }

      //显示左侧管理页面
      this.fkqManageExpan = true;
      //1.显示poi图层、工具箱
      //显示图层
      this.formDialogVisible = true;
      let repositoryData;
      let _this = this;
      if (type === 'POLYGON') {
        //暂存多边形的坐标
        repositoryData = {
          lx: 'CUSTOM',
          xh: this.nextXh(this.form.prevention),
          type: type,
          mapData: data.zbc.map(value => [value.lat, value.lng])
        };
      } else if (type === 'CIRCULAR') {
        //暂存圆形的圆心&半径
        repositoryData = {
          lx: 'CUSTOM',
          xh: this.nextXh(this.form.prevention),
          type: type,
          mapData: { centerPoint: [data.centerPoint.lat, data.centerPoint.lng], radius: data.radius }
        };
      }
      this.form.prevention.push(repositoryData);
      this.drawCenterNumber(repositoryData, type, this.form.prevention.indexOf(repositoryData) + 1);
      this.mapMarkers.set(repositoryData, data);
    },

    /**
     * 自定义区域地图标数字
     */
    drawCenterNumber(data, type, num) {
      let html = `<div>
                                <span style="display:inline-block;color: #fff; font-weight: 400; font-size: 48px;line-height:1;padding:10px 0;">${num}</span>
                            </div>`;
      let customDiv = {
        option: {
          html: html,
          iconAnchor: [13, 33]
        }
      };
      if (type === 'POLYGON') {
        customDiv.xy = [
          eval(data.mapData.map(o => o[0]).join('+')) / data.mapData.length,
          eval(data.mapData.map(o => o[1]).join('+')) / data.mapData.length
        ];
      } else if (type === 'CIRCULAR') {
        customDiv.xy = data.mapData.centerPoint;
      }

      this.numberMarkers.set(data, this.map.addDiv(customDiv));
    },

    /**
     * 取消地图画圈
     */
    removeDraw(data) {
      this.map.removeLayer(data);
    },

    /**
     * 地图画圈方法
     */
    constructDetailMapLayer(prevention) {
      let mapJson = {
        option: {
          color: '#3388ff',
          fillColor: '#3388ff',
          fillOpacity: 0.3
        }
      };
      prevention.forEach((value, index) => {
        if (value.type === 'POLYGON') {
          let mapMarker = { ...mapJson };
          mapMarker.option.weight = 3;
          mapMarker.xys = [value.mapData];
          let polygon = this.map.addPolygon(mapMarker);
          this.mapMarkers.set(value, polygon);
        } else if (value.type === 'CIRCULAR') {
          let mapMarker = { ...mapJson };
          mapMarker.xy = value.mapData.centerPoint;
          mapMarker.option.radius = value.mapData.radius;
          this.mapMarkers.set(value, this.map.addCircle(mapMarker));
        }
        this.drawCenterNumber(value, value.type, index + 1);
      });
    },

    /**
     * 选取行政区划方法
     */
    handleCheckChange(data, checked, node) {
      //多选状态
      // if (this.treeValue == "") {
      //     this.treeValue = data.name;
      // } else {
      //     this.treeValue = this.treeValue + "," + data.name;
      // }

      if (checked) {
        this.form.prevention = [{ xh: this.nextXh([]), lx: 'XZQH', type: 'XZQH', mapData: data.id }];
        // this.treeValue = data.name;
        // this.treeVisible = false;
        this.$refs.deptTree.setCheckedNodes([]);
        this.$refs.deptTree.setCheckedNodes([data]);

        this.drawXzqh(data.id);
      } else {
        if (this.form.prevention[0].mapData === data.id) {
          this.form.prevention = [];
        }
      }

      //多选状态
      // this.form.prevention.push({xh:this.nextXh(this.form.prevention),type: "XZQH", mapData: data.id});
    },

    //描边&居中行政区划，
    drawXzqh(xzqh) {
      this.removeAllMapDraw();
      this.mapApi.getZbcByXzqh(xzqh, res => {
        let zxqhlayer = this.map.addPolygonByGeojson(res.data.data[0].areaBoundaryPoints);
        this.mapMarkers.set(xzqh, zxqhlayer);
        window.mapBound = this.map.getLayerBound(zxqhlayer);
        this.map.setCenterByBound(window.mapBound);
      });
    },

    //描边&居中行政区划，
    drawXzqhs(xzqhs) {
      xzqhs.forEach(xzqh => {
        this.mapApi.getZbcByXzqh(xzqh, res => {
          let zxqhlayer = this.map.addPolygonByGeojson(res.data.data[0].areaBoundaryPoints);
          this.mapMarkers.set(xzqh, zxqhlayer);
        });
      });
    },

    /**
     * 行政区划数据载入方法
     */
    loadNodeData(node, resolve) {
      let _this = this;
      let param = {
        async: true,
        cacheable: true,
        codeId: 'VW_BM_XZQH_JC',
        curNodeId: node.key,
        induceValue: undefined,
        induceValueMinLength: 1,
        lazyload: true,
        maxInduceNum: 10,
        showCurNode: false
      };
      this.axios.post(`${window.gisConfig.fkqServerUrl}/chooseService/loadData`, param).then(res => {
        if (res.data['data']) {
          resolve(res.data['data']);
          if (this.form.prevention.length !== 0) {
            let checkedData = res.data['data'].find(o => o.id === this.form.prevention[0].mapData);
            if (checkedData) {
              this.$refs.deptTree.setCheckedNodes([checkedData]);
            }
          }
        }
      });
    },

    /**
     * 防控圈类别更改事件
     */
    categoryChange(val) {
      // this.treeValue = '';
      this.handleClickRemoveAll('categoryChange', val);
    },

    /**
     *  清除防控圈的表单数据（新建编辑公用）
     */
    clearFormData() {
      this.form = {
        id: '',
        name: '',
        type: '',
        range: '',
        useType: 'GY',
        description: '',
        time: new Date().format('yyyy-MM-dd hh:mm:ss'),
        prevention: []
      };
      // this.treeValue = '';
    },

    /**
     * 获取防控圈的下一个序号
     */
    nextXh(prevention) {
      let xhArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      prevention.forEach(value => {
        xhArr.splice(xhArr.indexOf(value.xh), 1);
      });
      return xhArr[0];
    },

    /**
     * 初始化搜索
     */
    onSearch() {
      this.tableData.currentPage = 1;
      this.search();
    },

    /**
     * 防控圈列表搜索
     */
    search() {
      this.tableData.paramMap.creatorDept = this.paramJson.createUnit;
      this.tableData.paramMap.sourceApplicationID = this.paramJson.sourceID;
      let queryVo = {
        paramMap: this.tableData.paramMap,
        pageSize: this.tableData.pageSize,
        currentPage: this.tableData.currentPage
      };

      let _this = this;
      this.tableData.data = [];
      _this.axios.post(window.gisConfig.fkqServerUrl + '/fkq/config/list', queryVo, this.headers_config).then(res => {
        if (res.data.status === 1) {
          let data = res.data.data;
          _this.tableData.data = data.data;
          _this.tableData.total = data.total;
          _this.tableData.pageSize = data.pageSize;
          _this.tableData.currentPage = data.currentPage;
        } else {
          _this.$message.warning(res.data.errMessage);
        }
      });
    },

    //cbc--获得焦点触发
    fkqHandleQueryBoxFocus() {
      this.treeVisible = true;
      this.activityZoneVisible = true;
    },

    // 防控圈管理卡片勾选
    handleCardClick(checked, item, index) {
      delete item.checked;
      if (checked) {
        if (this.selectedData.data.map(o => o.id).indexOf(item.id) === -1) {
          setTimeout(() => {
            this.selectedData.data.push(item);
          }, 350);
          this.addToCart('basket' + index, item); //添加购物篮
        }
      } else {
        if (this.selectedData.data.map(o => o.id).indexOf(item.id) !== -1) {
          this.selectedData.data.splice(this.selectedData.data.map(o => o.id).indexOf(item.id), 1);
        }
      }
    },

    // 左侧防空圈展开、收缩
    handleShrikClick() {
      this.fkqManageExpan = !this.fkqManageExpan;
    },
    handleFKbasketClick() {
      this.checkedDialogVisible = this.checkedDialogVisible ? false : true;
    },

    // 关闭防控圈查看弹窗
    handleDetailClose() {
      this.detailDialogVisible = false;
      this.removeAllMapDraw();
    },
    // 关闭防控圈绘制查看弹窗
    handleFormClose() {
      this.formDialogVisible = false;
      this.removeAllMapDraw();
    },
    // 关闭已选防控圈弹窗
    checkedDialogClose() {
      this.checkedDialogVisible = false;
    },
    isSelectedData(item) {
      return this.selectedData.data.map(o => o.id).indexOf(item.id) !== -1;
    },
    localteCurrentXzqh() {
      let xzqh = this.paramJson.createUnit.substr(0, 6);
      this.mapApi.getZbcByXzqh(xzqh, res => {
        let zxqhlayer = this.map.addPolygonByGeojson(res.data.data[0].areaBoundaryPoints);
        this.mapMarkers.set(xzqh, zxqhlayer);
        window.mapBound = this.map.getLayerBound(zxqhlayer);
        this.map.setCenterByBound(window.mapBound);
        this.removeAllMapDraw();
      });
    },

    //父级页面接收选中防控圈参数
    fkqData(callback) {
      let _this = this;
      _this.axios
        .get(window.gisConfig.fkqServerUrl + '/fkq/config/check/' + _this.selectedData.data.map(o => o.id).join(','))
        .then(res => {
          if (res.data.status === 1) {
            if (res.data.data.length === 0) {
              callback(_this.selectedData.data);
            } else {
              let message = res.data.data.join(',') + '  该防控圈已被删除，无法选择调用！';
              _this.$message.warning(message);
            }
          }
        });
    },
    initXzqhCodeCache() {
      let _this = this;
      this.axios
        .get(`${window.gisConfig.fkqServerUrl}/codeDic/VW_BM_XZQH_JC?action=loadMap`)
        .then(res => {
          if (res.data.status === 1) {
            _this.bmXzqhCache = res.data.data;
          }
        })
        .catch(err => console.log(err));

      this.axios
        .get(`${window.gisConfig.fkqServerUrl}/codeDic/BM_BZ_XZQH?action=loadMap`)
        .then(res => {
          if (res.data.status === 1) {
            _this.bmXzqhQcCache = res.data.data;
          }
        })
        .catch(err => console.log(err));
    },
    initCreateDeptName() {
      let _this = this;
      this.axios
        .get(`${window.gisConfig.fkqServerUrl}/codeDic/BM_DEPT?action=loadMap`)
        .then(res => {
          if (res.data.status === 1) {
            _this.deptName = res.data.data[this.paramJson.createUnit]
              ? res.data.data[this.paramJson.createUnit]
              : this.paramJson.createUnit;
          }
        })
        .catch(err => console.log(err));
    },
    handleCloseTreeBox() {
      this.treeVisible = false;
    },
    xzqhFullName(item) {
      if (item.lx === 'XZQH') {
        return item.mapData ? this.bmXzqhQcCache[item.mapData] : this.bmXzqhQcCache[item.cs.qh];
      }
    },
    initDateObject() {
      Date.prototype.format = function(fmt) {
        var o = {
          'M+': this.getMonth() + 1, //月份
          'd+': this.getDate(), //日
          'h+': this.getHours(), //小时
          'm+': this.getMinutes(), //分
          's+': this.getSeconds(), //秒
          'q+': Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        return fmt;
      };
    },

    /**
     * desc:根据分辩率设置卡片显示的个数
     */
    initCardNums() {
      // 计算一页最多显示几条数据
      var fkqManage = document.getElementById('fkqManage');
      var fkqManage_height = fkqManage.offsetHeight;
      var otherBra_height = 200; //卡片容器的其他dom的高度总和
      var cardItem_height = 104; //单个卡片的高度
      var cardItem_margin = 12; //卡片的上边距
      var fkqManageMain_height = fkqManage_height - otherBra_height; //卡片容器高度 fkqManageMain_height >= cardItem_height*n + cardItem_margin*(n-1)
      var card_nums = Math.floor((fkqManageMain_height + cardItem_margin) / (cardItem_height + cardItem_margin)); //
      return card_nums;
    }
  },
  mounted() {
    this.initFkqMapComponent();
    this.initCreateDeptName();
    this.initXzqhCodeCache();
    this.tableData.pageSize = this.initCardNums() > 5 ? this.initCardNums() : 5; //最小条数5条
    this.onSearch();

    // 窗口大小变动，重新计算卡片个数
    window.onresize = () => {
      let oldtPageSize = this.tableData.pageSize;
      this.tableData.pageSize = this.initCardNums() > 5 ? this.initCardNums() : 5;
      this.initCardNums() != oldtPageSize ? this.onSearch() : null;
    };
    //定位到当前行政区划
    this.localteCurrentXzqh();
  },
  computed: {
    drawToolCaseVisible: function() {
      return this.formDialogVisible && this.form.type == '1' && this.form.prevention.length < 5;
    },
    treeInputVisible() {
      if (this.form.type === '2') {
        return true;
      }
    },
    checkedXzqh() {
      return this.form.prevention.length === 0
        ? ''
        : this.form.prevention.map(o => this.bmXzqhCache[o.mapData]).join(',');
    }
  },
  watch: {
    detailDialogVisible() {
      if (!this.detailDialogVisible) {
        this.removeAllMapDraw();
      }
    }
  },
  created() {
    //点击 空白区域， 行政区划关闭
    var that = this;
    document.body.addEventListener('click', function(e) {
      e = e || window.event;
      var elem = e.target || e.srcElement;
      while (elem) {
        if (elem.id && elem.id == 'locationBox') {
          return;
        }
        elem = elem.parentNode;
      }
      that.treeVisible = false;
    });
    this.initDateObject();
  }
};
</script>

<style>
.fkq-gl .el-dialog__wrapper {
  position: inherit !important;
}

.fkq-manage {
  position: absolute;
  z-index: 2000;
  left: -320px;
  top: 0;
  bottom: 0;
  width: 320px;
  padding: 14px 0 30px;
  border-right: 1px solid #d1d1d1;
  border-bottom: 2px solid #d1d1d1;
  box-sizing: border-box;
  background: #fff;
  transition: all 0.3s;
}

.fkq-manage.is-active {
  left: 0;
}

.fkq-manage.is-active .fkq-manage__shrink .el-icon-arrow-right {
  transform: rotate(180deg);
}

.fkq-manage .el-input-group__append {
  padding: 0 10px;
  border-radius: 0;
  border-color: #d8d8d8;
  border-left: none;
  color: #6a6a6a;
  background: #fff;
}

.fkq-manage .el-input-group--append .el-input__inner,
.fkq-manage .el-input-group__prepend {
  border-right: none;
  border-radius: 0;
  border-color: #d8d8d8;
}

.fkq-manage__searchbtn .el-icon-search,
.fkq-gl .el-icon-search {
  font-size: 14px;
  color: #333;
}

.fkq-gl .el-row + .el-row {
  margin-top: 10px;
}

.fkq-manage__top {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
}

.fkq-manage__title {
  position: relative;
  overflow: hidden;
  padding: 10px 8px;
  margin: 0;
  white-space: nowrap;
  font: 14px/1 'Microsoft Yahei';
  text-overflow: ellipsis;
  color: #000;
}

.fkq-manage__title:after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  border-radius: 1px;
  background-color: #3884e5;
}

.fkq-icon-huizhi {
  display: inline-block;
  width: 16px;
  height: 17px;
  margin-right: 4px;
  vertical-align: text-bottom;
  background: url('~/static/map/example/images/fkq/icon_huizhi.png') no-repeat center;
}

.fkq-manage__basket {
  display: inline-block;
  width: 56px;
  height: 56px;
  box-sizing: border-box;
  line-height: 56px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  background: #3884e5 url('~/static/map/example/images/fkq/icon_basket.png') no-repeat center;
}

.fkq-manage__basket.is-opened {
  background-image: url('~/static/map/example/images/fkq/icon_basket_opend.png');
}

.fkq-manage__basket.is-pos-a {
  position: absolute;
  left: 8px;
  bottom: 8px;
}

.fkq-manage__basket-num {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 16px;
  height: 16px;
  border: 1px solid #fff;
  border-radius: 50%;
  font: 12px/16px Arial;
  color: #fff;
  background-color: #f5212d;
  transition: all 0.3s;
}

.fkq-manage__searcharea {
  padding: 0 14px;
}

.fkq-manage__main {
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 120px;
  max-height: calc(100% - 156px);
  padding: 0 14px;
  margin: 18px 0;
  box-sizing: border-box;
  /*height: calc(100% - 14rem);*/
}

.fkq-manage__cards {
  list-style: none;
  padding: 0;
  margin: 0;
}

.fkq-manage__card {
  position: relative;
  padding-top: 6px;
  border: 1px solid rgb(238, 238, 238);
  border-radius: 6px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background-color: #fff;
  transition: all 0.3s;
}

.fkq-manage__card + .fkq-manage__card {
  margin-top: 12px;
}

.fkq-manage__card-flag {
  display: inline-block;
  position: relative;
  padding-top: 8px;
  width: 30px;
  height: 36px;
  box-sizing: border-box;
  font: 12px/1 'Microsoft Yahei';
  text-align: center;
  color: #fff;
  background-color: #1890ff;
}

.fkq-manage__card-flag.is-pos-a {
  position: absolute;
  top: 0;
  right: 6px;
}

.fkq-manage__card-flag:after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0px;
  left: 1px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-bottom: 10px solid #fff;
}

.fkq-manage__card-flag.is-private {
  background-color: #35c9c1;
}

.fkq-manage__card-top {
  padding: 0 14px;
}

.fkq-manage__card-top h2 {
  overflow: hidden;
  padding: 6px 20px 6px 0;
  margin: 0;
  font: 14px/1 'Microsoft Yahei';
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fkq-manage__card-main {
  position: relative;
  padding: 6px 14px 12px 14px;
}

.fkq-manage__card-tag {
  height: 20px;
  padding: 0 16px;
  border: 1px solid rgb(173, 217, 255);
  border-radius: 10px;
  text-align: center;
  font: 12px/20px 'Microsoft Yahei';
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.102);
}

.fkq-manage__card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 30px;
  line-height: 30px;
  background-color: #f9fafc;
}

.fkq-manage__card-icon {
  font-size: 16px;
  cursor: pointer;
  color: #89898a;
}

.fkq-manage__card-icon + .fkq-manage__card-icon {
  margin-left: 8px;
}

.fkq-manage__card-icon:hover {
  color: #1890ff;
}

.fkq-manage__card:hover,
.fkq-manage__card.is-active {
  border-color: rgb(167, 203, 252);
  box-shadow: 0px 0px 5px 0px rgba(167, 203, 252, 0.1);
}

.fkq-manage__card:hover .fkq-manage__card-bottom,
.fkq-manage__card.is-active .fkq-manage__card-bottom {
  background-color: rgba(173, 217, 255, 0.5);
}

.fkq-manage__footer {
  height: 34px;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-40%);
}

.fkq-manage__footer .el-pagination {
  text-align: center;
}

.fkq-manage__footer .el-pager li {
  font-weight: normal;
  color: #666;
}

.fkq-manage__footer .el-pager li.active {
  color: #1890ff;
}

.fkq-manage__mask {
  position: absolute;
  z-index: 10;
  top: 0;
  right: -1px;
  bottom: -2px;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}

.fkq-manage__shrink {
  position: absolute;
  z-index: 10;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 26px;
  box-sizing: border-box;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  background-color: #d1d1d1;
}

.fkq-manage__shrink.is-none {
  display: none;
}

.fkq-manage__shrink:before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-left: 6px solid #d1d1d1;
  border-right: 6px solid transparent;
  border-bottom: 4px solid #d1d1d1;
}

.fkq-manage__shrink:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 0;
  border-top: 4px solid #d1d1d1;
  border-left: 6px solid #d1d1d1;
  border-right: 6px solid transparent;
  border-bottom: 4px solid transparent;
}

.fkq-manage__shrink .el-icon-arrow-right {
  font-size: 12px;
  vertical-align: middle;
  color: #a7a7a7;
}

/* 重写element样式 */
.fkq-gl .el-dialog__title {
  position: relative;
  padding: 10px 8px;
  overflow: hidden;
  font: 14px/1 'Microsoft Yahei';
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
}

.fkq-gl .el-dialog__title:after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  border-radius: 1px;
  background-color: #3884e5;
}

.fkq-gl .el-button--primary {
  font-size: 12px;
  background-color: #1890ff;
  border-color: #1890ff;
}

.fkq-gl .el-button--small,
.fkq-gl .el-button--small.is-round {
  border-radius: 2px;
  padding: 5px 15px;
}

.fkq-gl .el-button--primary:focus,
.fkq-gl .el-button--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

/* element表格 */
.fkq-gl .el-table-column--selection .cell {
  padding-right: 10px;
}

.fkq-gl .el-table th {
  font-weight: normal;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  padding: 4px 0;
  background-color: #fafafa;
}

.fkq-gl .el-table td {
  padding: 2px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
}

.fkq-gl .el-button--mini,
.el-button--small {
  font-size: 12px;
}

/* 弹窗 */
.fkq-right {
  position: fixed;
  z-index: 1000;
  right: 0;
  top: 0;
  width: 320px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  background: #fff;
}

.fkq-right.is-pos-a {
  z-index: 8888;
  left: 78px;
  bottom: 28px;
  right: auto;
  top: auto;
  width: 350px;
}

/* 画图工具 */
.fkq-btn-draw {
  display: inline-block;
  width: 18px;
  height: 16px;
  vertical-align: middle;
  background: url('~/static/map/example/images/icon_polygon.png') no-repeat 0 0;
}

.fkq-btn-draw:hover {
  background-position-y: -16px;
}

.fkq-btn-draw.is-polygon {
  background-image: url('~/static/map/example/images/fkq/icon_polygon.png');
}

.fkq-btn-draw.is-circle {
  background-image: url('~/static/map/example/images/fkq/icon_circle.png');
}

.fkq-dialog .el-dialog__header {
  border-bottom: 1px solid #e8e8e8;
}

.fkq-dialog .el-dialog__body {
  padding: 10px;
}

.fade-enter-active {
  animation: fade-in 0.3s;
}

.fade-leave-active {
  animation: fade-in 0.3s reverse;
}

@keyframes fade-in {
  0% {
    transform: translate3d(0, -30px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

/* element 输入框input   */
.fkq-gl .el-input--small .el-input__inner {
  height: 24px;
  border-color: #d8d8d8;
  border-radius: 2px;
  line-height: 24px;
  font-size: 12px;
}

.fkq-gl .el-input--small .el-input__icon {
  line-height: 24px;
}

.fkq-gl .el-select {
  width: 100%;
}

.fkq-gl .el-textarea__inner {
  border: 1px solid #d8d8d8;
  border-radius: 2px;

  font: 400 12px Arial;
}

.fkq-gl .el-select .el-input .el-select__caret {
  font-size: 12px;
}

.fkq-el-select .el-select-dropdown__item {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

.fkq-el-select .el-select-dropdown__item.selected {
  color: rgb(24, 144, 255);
  font-weight: normal;
}

/* 防空圈绘制--下拉树外框 */
.fkq-right__tree {
  position: absolute;
  z-index: 9999;
  top: 90px;
  left: 0px;
  right: 0px;
  height: 200px;
  overflow: scroll;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* element表单
  ===================== */
.fkq-gl .el-form-item__label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.fkq-gl .el-form-item__content {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
}

.fkq-gl .el-form-item + .el-form-item {
  margin-top: 4px;
  margin-bottom: 0;
}

.fkq-gl .el-form-item {
  margin-bottom: 0;
}

.ft-red {
  color: #dd575c;
}

.b-mb10 {
  margin-bottom: 10px;
}

.b-mr5 {
  margin-right: 5px;
}

.fkq-gl .el-dialog__body {
  padding: 10px 20px;
}

.fkq-map-img {
  position: relative;
  width: 58px;
  height: 58px;
  display: inline-block;
  margin-right: 8px;
  border-radius: 6px;
}

.fkq-map-img:hover {
  cursor: pointer;
  box-shadow: 0 0 8px #92bfff;
}

.fkq-map-img.is-detail:hover {
  cursor: default;
  box-shadow: 0 0 0 transparent;
}

.fkq-map-img .i_close {
  position: absolute;
  right: -8px;
  top: -8px;
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('~/static/map/example/images/poi-search.png') no-repeat -5px -125px;
}

.fkq-map-img.is-detail .i_close {
  display: none;
}

.fkq-map-img .i_close:hover {
  background-position-x: -25px;
}

.fkq-map-img img {
  border-radius: 6px;
  width: 58px;
  height: 58px;
}

.fkq-map-img__box .is-num {
  position: absolute;
  height: 18px;
  line-height: 18px;
  top: 14%;
  left: 47%;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.fkq-map-add {
  position: relative;
  display: inline-block;
  width: 58px;
  height: 58px;
  border: 2px dotted #b3d8ff;
  background: #f0f6ff;
}

.fkq-map-add:hover {
  cursor: pointer;
  border-color: #409eff;
  background: #e9eff8;
}

.fkq-map-add .i_add {
  position: absolute;
  display: inline-block;
  width: 22px;
  height: 22px;
  background: url('~/static/map/example/images/poi-search.png') -32px -10px no-repeat;
  top: 50%;
  left: 50%;
  margin-left: -11px;
  margin-top: -11px;
}

.qb-poi-search-layer {
  background-color: #fff;
  border-top: 1px solid #e4e6e7;
  border-left: 1px solid #e4e6e7;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 0 0;
  padding: 10px;
}

.qb-poi-search-layer ul {
  list-style: none;
}

.qb-poi-search-layer ul li {
  display: inline-block;
  border-radius: 5px;
  font-size: 13px;
  color: #606266;
  border: 1px solid #fff;
  text-align: -webkit-match-parent;
  cursor: pointer;
}

.qb-poi-search-layer ul li i {
  height: 24px;
  display: inline-block;
  padding-left: 5px;
  line-height: 24px;
  background: url('~/static/example/images/poi-search.png') no-repeat;
  background-position: 0 -190px;
}

.qb-poi-search-layer ul li span {
  height: 24px;
  line-height: 24px;
  vertical-align: top;
}

.qb-poi-search-layer .active {
  border: 1px solid #e4e6e7;
  background-color: #409eff;
  color: #fff;
}

.qb-poi-search-tools {
  background-color: #fff;
  border-top: 1px solid #e4e6e7;
  border-left: 1px solid #e4e6e7;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 5px 5px;
}

.qb-poi-search-tools ul {
  list-style: none;
}

.qb-poi-search-tools ul li {
  display: inline-block;
  font-size: 13px;
  color: #606266;
  text-align: -webkit-match-parent;
}

.qb-poi-search-tools .title {
  color: #579afc;
  padding-left: -28px;
}

.qb-poi-search-tools .title i {
  height: 24px;
  display: inline-block;
  padding-left: 28px;
  line-height: 24px;
  background: url('~/static/example/images/poi-search.png') no-repeat;
  background-position: 0px -238px;
}

.qb-poi-search-tools ul li i {
  height: 24px;
  display: inline-block;
  padding-left: 0px;
  line-height: 24px;
}

.qb-poi-search-tools ul li span {
  height: 24px;
  line-height: 24px;
  vertical-align: top;
}

.qb-poi-search-tools .item {
  padding: 0 8px;
  cursor: pointer;
}

.qb-poi-search-tools .item:hover {
  color: #579afc;
}

.qb-poi-search-tools .item-b-l {
  border-left: 1px #dbdee2 dashed;
}

.qb-poi-search-tools .item-b-r {
  border-right: 1px #dbdee2 dashed;
}

.qb-poi-search-tools .active {
  border: 1px solid #e4e6e7;
  background-color: #409eff;
  color: #fff;
  border-radius: 50%;
  padding: 2px 6px;
}

.qb-poi-search-address {
  margin-top: 3px;
  background-color: #fff;
  border-top: 1px solid #e4e6e7;
  border-left: 1px solid #e4e6e7;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  overflow-y: auto;
  width: 368px;
  max-height: 300px;
}

.qb-poi-search-address-list {
}

.qb-poi-search-address-list ul {
  list-style: none;
}

.qb-poi-search-address-list ul li {
  display: list-item;
  padding: 5px 6px 5px 3px;
  font-size: 13px;
  color: #606266;
  border: 1px solid #fff;
  text-align: -webkit-match-parent;
  cursor: pointer;
}

.qb-poi-search-address-list ul li:hover {
  background-color: #e4e6e7;
}

.qb-poi-search-address-list .col-num {
  float: left;
  text-align: center;
  display: inline-block;
  background-color: #f44336;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  line-height: 20px;
  font-size: 14px;
  color: #fff;
}

.qb-poi-search-address-list .col-content {
  vertical-align: top;
  margin-left: 30px;
}

.qb-poi-search-address-list .row-title {
  color: #3385ff;
}

.qb-poi-search-address-list .row-addr {
}

.fkq-gl .checkedDialog {
  position: absolute;
  z-index: 2003;
  left: 78px;
  bottom: 28px;
  top: auto;
  right: auto;
}

.fkq-gl .el-dialog__footer {
  padding: 10px;
}

.fkq-gl .el-button + .el-button {
  margin-left: 8px;
}

.fkq-gl .el-button--text {
  font-size: 12px;
  color: #1890ff;
}

.fkq-gl .el-tree-node__label {
  font-size: 12px;
}

.fkq-gl .el-tree-node > .el-tree-node__children {
  overflow: visible;
}

/*20191108 HXM 防控圈绘制 样式调整--组件样式*/
.el-input__inner {
  height: 24px;
  border-radius: 2px;
  border: 1px solid #d8d8d8;
  line-height: 24px;
  font-size: 12px;
}

.el-tree-node__label {
  font-size: 12px;
}

/*防控圈管理 表格添加滚动条*/
.table-srcoll .el-table__body-wrapper {
  overflow-y: auto;
  max-height: 330px;
}

/*防控圈绘制 选择框文字提示*/
.fkq-text-tip {
  position: absolute;
  left: 0;
  bottom: -18px;
  overflow: hidden;
  display: inline-block;
  width: 58px;
  height: 12px;
  line-height: 12px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 防控圈绘制-行政区划 20191213_panhd*/
.fkq-xzch-item .el-input__inner {
  padding-right: 30px;
  cursor: pointer;
}

.fkq-xzch-item .el-input__suffix {
  z-index: 10;
}

.fkq-xzch-item .el-icon-arrow-down.is-reverse {
  transform: rotate(-180deg);
}
/* 购物篮-添加动效 20191213_panhd*/
.fkq-basket__ball {
  position: fixed;
  z-index: 9999;
}
.fkq-basket__box {
  animation: 0.3s mymove ease-in-out;
  animation-fill-mode: forwards;
  position: relative;
  width: 274px;
  height: 104px;
  padding-top: 6px;
  box-sizing: border-box;
}
@keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(0.6);
  }
  75% {
    transform: scale(0.4);
  }
  100% {
    transform: scale(0.1);
  }
}

.moveToCart {
  animation: carmove 0.5s ease-in-out;
}
@keyframes carmove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>
