<template>
  <div class="newest-warning">
    <transition-group name="newest-warning" tag="div">
      <div
        v-for="(node, index) in dataList.content"
        v-bind:key="node"
        class="newest-warning__item"
        :class="{ active: value === node.id }"
        @click="changeCard(node)"
      >
        <iccc-card-item :key="node.id" :data="node" cardType="newest" :index="isTop ? index : -1"></iccc-card-item>
      </div>
    </transition-group>
  </div>
</template>

<script>
// import WarningLayout from './warning-layout';
import IcccCardItem from '@icccPath/components/iccc-card-item';
export default {
  // 最新预警
  name: 'newest-warning',
  components: { IcccCardItem },
  props: {
    isTop: Boolean,
    url: String
  },
  data() {
    return {
      // 选中项
      timer: null,
      itemNew: {
        id: '8a8b810f7825517e0178257fdde600b4',
        concernId: 'e58688ee14b542fb8d716119dc96ecbd',
        senceId: null,
        userid: '4028801b2e07fd79012e083a2d44025e',
        username: '李广智',
        dept: '440000000000',
        deptement: '广东省厅',
        rksj: '2021-03-12 16:10:23.0',
        bgsj: '2021-03-12 16:10:23.0',
        dxlx: '111',
        dxhm: '370281198103259146',
        sfzh: '370281198103259146',
        xm: '花采春^^',
        xb: '1',
        csrq: '19781109',
        mz: '01',
        jg: null,
        hjdqh: '440100',
        hjdxz: '440100',
        hjdpcsdm: '440100000000',
        hjdpcsmc: '440100',
        jzdqh: '440100',
        jzdxz: '440100',
        jzdpcsdm: '440100000000',
        jzdpcsmc: '440100',
        gxddwdm: '440100000000',
        rylb: '01',
        jlrylb: '01',
        hdfssj: '20210120104617',
        fsdqh: '440100',
        fsdxz: '440100',
        fsdgajgdm: '440100000000',
        fsdgajgmc: '广州市',
        fsdshcs: '440100000000',
        fsdshcsmc: '440100',
        mddqh: '440100',
        cfdqh: '440100',
        bzhm: '111@370281198103259146',
        gjly: 'SMGJ',
        gjlyDwjb: '2',
        ygjid: '111',
        hdxgxx: '370281198103259146',
        dtxxlx: '01',
        xxbdsj: '20210120104617',
        xxbddw: '440000000000',
        jd: '113.254336',
        wd: '23.137501',
        mzmx: null,
        bkdx: null,
        mzfkq:
          '[{"id":"4028598176ffb4fc017704cb803c0000","jclx":"IN","mc":"广东广州","mzsj":"20210120091650"},{"id":"40285981766a7eed01766ac36e9f0000","jclx":"OUT","mc":"巨龙信息","mzsj":"20210120091650"},{"id":"4028598176ad263c0176ae7461f30000","jclx":"OUT","mc":"dd-1","mzsj":"20210120091650"},{"id":"402859817683c2c70176896f1f3e0000","jclx":"OUT","mc":"巨龙","mzsj":"20210120091650"},{"id":"40285981765ef25301766404c8ef0000","jclx":"OUT","mc":"阿建","mzsj":"20210120091650"},{"id":"40285981766e9b2301766eb5cf030000","jclx":"OUT","mc":"嫦娥5号，回家地点","mzsj":"20210120091650"}]',
        bzdzpUrl: null,
        bzxzpUrl: null,
        zpxsd: null,
        gjfl: null,
        sfsc: 'true'
      },
      value: '',
      dataList: {
        content: [
          {
            id: '8a8b810f77fb376401780170eeba0010',
            concernId: 'c505636571aa44e6838f9d03c9ab4030',
            senceId: null,
            userid: '4028801b2e07fd79012e083a2d44025e',
            username: '李广智',
            dept: '440000000000',
            deptement: '广东省厅',
            rksj: '2021-03-05 16:08:13.0',
            bgsj: '2021-03-05 16:08:13.0',
            dxlx: '111',
            dxhm: '430781196609253467',
            sfzh: '430781196609253467',
            xm: '没钞疯~1',
            xb: '0',
            csrq: '19660925',
            mz: '01',
            jg: null,
            hjdqh: '440100',
            hjdxz: '440100',
            hjdpcsdm: '440100000000',
            hjdpcsmc: '440100',
            jzdqh: '440100',
            jzdxz: '440100',
            jzdpcsdm: '440100000000',
            jzdpcsmc: '440100',
            gxddwdm: '440100000000',
            rylb: '02',
            jlrylb: '02',
            hdfssj: '20210122141618',
            fsdqh: '440100',
            fsdxz: '440100',
            fsdgajgdm: '440100000000',
            fsdgajgmc: '广州市',
            fsdshcs: '440100000000',
            fsdshcsmc: '440100',
            mddqh: '440100',
            cfdqh: '440100',
            bzhm: '111@430781196609253467',
            gjly: '01',
            gjlyDwjb: '2',
            ygjid: '111',
            hdxgxx: '430781196609253467',
            dtxxlx: '02',
            xxbdsj: '20210122141618',
            xxbddw: '440000000000',
            jd: '113.260157',
            wd: '23.126999',
            mzmx: null,
            bkdx: null,
            mzfkq:
              '[{"id":"4028598176ffb4fc017704cb803c0000","jclx":"IN","mc":"广东广州","mzsj":"20210122163630"},{"id":"40285981766a7eed01766ac36e9f0000","jclx":"OUT","mc":"巨龙信息","mzsj":"20210122163631"},{"id":"4028598176ad263c0176ae7461f30000","jclx":"OUT","mc":"dd-1","mzsj":"20210122163631"},{"id":"402859817683c2c70176896f1f3e0000","jclx":"OUT","mc":"巨龙","mzsj":"20210122163631"},{"id":"40285981765ef25301766404c8ef0000","jclx":"OUT","mc":"阿建","mzsj":"20210122163631"},{"id":"40285981766e9b2301766eb5cf030000","jclx":"OUT","mc":"嫦娥5号，回家地点","mzsj":"20210122163631"}]',
            bzdzpUrl: null,
            bzxzpUrl: null,
            zpxsd: null,
            gjfl: null,
            sfsc: 'true'
          },
          {
            id: '8a8b810f77fb376401780170d9ab000f',
            concernId: 'ae231680b91048b39be7ccd2957bc2d0',
            senceId: null,
            userid: '4028801b2e07fd79012e083a2d44025e',
            username: '李广智',
            dept: '440000000000',
            deptement: '广东省厅',
            rksj: '2021-03-05 16:08:07.0',
            bgsj: '2021-03-05 16:08:07.0',
            dxlx: '111',
            dxhm: '410702194803305445',
            sfzh: '410702194803305445',
            xm: 'kk1',
            xb: '1',
            csrq: '19690630',
            mz: '01',
            jg: null,
            hjdqh: '379009',
            hjdxz: '379009',
            hjdpcsdm: '379009000000',
            hjdpcsmc: '379009',
            jzdqh: '379009',
            jzdxz: '379009',
            jzdpcsdm: '379009000000',
            jzdpcsmc: '379009',
            gxddwdm: '379009000000',
            rylb: '01',
            jlrylb: '01',
            hdfssj: '20201223173504',
            fsdqh: '379009',
            fsdxz: '379009',
            fsdgajgdm: '379009000000',
            fsdgajgmc: '379009',
            fsdshcs: '379009000000',
            fsdshcsmc: '379009',
            mddqh: '379009',
            cfdqh: '379009',
            bzhm: '111@410702194803305445',
            gjly: 'SMGJ',
            gjlyDwjb: '2',
            ygjid: '111',
            hdxgxx: '379009196906308770',
            dtxxlx: '01',
            xxbdsj: '20201223173526',
            xxbddw: '440000000000',
            jd: null,
            wd: null,
            mzmx: null,
            bkdx: null,
            mzfkq: null,
            bzdzpUrl: null,
            bzxzpUrl: null,
            zpxsd: null,
            gjfl: null,
            sfsc: 'true'
          },
          {
            id: '8a8b810f77fb376401780128b97b0009',
            concernId: '5555555555',
            senceId: null,
            userid: '4028801b2e07fd79012e083a2d44025e',
            username: '李广智',
            dept: '440000000000',
            deptement: '广东省厅',
            rksj: '2021-03-05 14:49:20.0',
            bgsj: '2021-03-05 14:49:20.0',
            dxlx: 'RLZP',
            dxhm: '77406a1caaa94f79a1737d77ea71d824',
            sfzh: '341000199708056888',
            xm: '王一博',
            xb: null,
            csrq: '19970805',
            mz: '01',
            jg: null,
            hjdqh: '341000',
            hjdxz: '个人股',
            hjdpcsdm: '341000',
            hjdpcsmc: '特好听',
            jzdqh: '341000',
            jzdxz: '和田玉人',
            jzdpcsdm: '341000',
            jzdpcsmc: '和研讨会人他',
            gxddwdm: '341000',
            rylb: '1',
            jlrylb: '1',
            hdfssj: '20181010123011',
            fsdqh: '341000',
            fsdxz: '和同仁堂',
            fsdgajgdm: '341000',
            fsdgajgmc: '格瑞特个人',
            fsdshcs: '341000',
            fsdshcsmc: '法国人非',
            mddqh: '341000',
            cfdqh: '341000',
            bzhm: 'RLZP@77406a1caaa94f79a1737d77ea71d824',
            gjly: null,
            gjlyDwjb: null,
            ygjid: null,
            hdxgxx: 'vgergregreg个发个仍发热热风',
            dtxxlx: '12101018',
            xxbdsj: '20191010123011',
            xxbddw: null,
            jd: '111.2145',
            wd: '38.5456',
            mzmx: null,
            bkdx: null,
            mzfkq: null,
            bzdzpUrl: 'static/iccc/themes/images/card/demo15.png',
            bzxzpUrl: 'static/iccc/themes/images/card/demo15.png',
            zpxsd: '98.156456',
            gjfl: 'RXGJ',
            sfsc: 'true'
          },
          {
            id: '8a8b810f77fb3764017801702d36000e',
            concernId: '111111111',
            senceId: null,
            userid: '4028801b2e07fd79012e083a2d44025e',
            username: '李广智',
            dept: '440000000000',
            deptement: '广东省厅',
            rksj: '2021-03-05 16:07:23.0',
            bgsj: '2021-03-05 16:07:23.0',
            dxlx: '111',
            dxhm: '\n327377336372727171\n \n\n\n\n张丽（别名绰号）\n',
            sfzh: '211322199110050317',
            xm: '肖战',
            xb: '1',
            csrq: '1991012',
            mz: '01',
            jg: '440118',
            hjdqh: '440118',
            hjdxz: 'GV风格不同染发',
            hjdpcsdm: '440118',
            hjdpcsmc: '本土人贵不贵',
            jzdqh: '440118',
            jzdxz: '不过个不停人',
            jzdpcsdm: '440118',
            jzdpcsmc: '各供热',
            gxddwdm: '440118',
            rylb: '2',
            jlrylb: '1',
            hdfssj: '20181010123011',
            fsdqh: '440118',
            fsdxz: '各供热',
            fsdgajgdm: '440118',
            fsdgajgmc: '发热甘古特额外发热分',
            fsdshcs: '440118',
            fsdshcsmc: '高投入和个的广泛地广泛地',
            mddqh: '440118',
            cfdqh: '440118',
            bzhm: '111@211322199110050317',
            gjly: '3333',
            gjlyDwjb: '0',
            ygjid: '44444444444',
            hdxgxx: '各个人头还是个',
            dtxxlx: '44106002',
            xxbdsj: '20181010123011',
            xxbddw: '15454524',
            jd: '112.2145',
            wd: '38.5456',
            mzmx: '{\n   "FKQ": ["1", "2"]\n}',
            bkdx: null,
            mzfkq: null,
            bzdzpUrl: null,
            bzxzpUrl: null,
            zpxsd: '98.156456',
            gjfl: 'RXGJ',
            sfsc: 'true'
          },
          {
            id: '8a8b810f77fb37640178011bdaf30008',
            concernId: '22222',
            senceId: null,
            userid: '4028801b2e07fd79012e083a2d44025e',
            username: '李广智',
            dept: '440000000000',
            deptement: '广东省厅',
            rksj: '2021-03-05 14:35:17.0',
            bgsj: '2021-03-05 14:35:17.0',
            dxlx: 'CPH',
            dxhm: '闵D3318',
            sfzh: '211322199110050317',
            xm: '肖战',
            xb: '1',
            csrq: '1991012',
            mz: '01',
            jg: null,
            hjdqh: '341000',
            hjdxz: '会议厅局',
            hjdpcsdm: '341000',
            hjdpcsmc: '和研讨会',
            jzdqh: '341000',
            jzdxz: '和研讨会由他和',
            jzdpcsdm: '341000',
            jzdpcsmc: 'GRE',
            gxddwdm: '341000',
            rylb: '2',
            jlrylb: '2',
            hdfssj: '20150010123011',
            fsdqh: '341000',
            fsdxz: '核桃仁以核桃仁',
            fsdgajgdm: '341000',
            fsdgajgmc: '非隔热',
            fsdshcs: '341000',
            fsdshcsmc: '保护套管热核桃仁',
            mddqh: '341000',
            cfdqh: '341000',
            bzhm: 'CPH@闵D3318',
            gjly: null,
            gjlyDwjb: null,
            ygjid: null,
            hdxgxx: '是他如果惹股份份儿饭仍认同感',
            dtxxlx: '01QW0002',
            xxbdsj: '20150010123011',
            xxbddw: null,
            jd: '113.2145',
            wd: '38.5456',
            mzmx: null,
            bkdx: null,
            mzfkq: null,
            bzdzpUrl: null,
            bzxzpUrl: null,
            zpxsd: null,
            gjfl: 'CLGJ',
            sfsc: 'true'
          }
        ],
        pageable: {
          sort: { sorted: true, unsorted: false, empty: false },
          total: 0,
          count: true,
          offset: 0,
          pageNumber: 0,
          pageSize: 10,
          unpaged: false,
          paged: true
        },
        last: true,
        totalPages: 1,
        totalElements: 5,
        number: 0,
        size: 10,
        sort: { sorted: true, unsorted: false, empty: false },
        numberOfElements: 5,
        first: true,
        empty: false
      },
      total: 0,
      searchCondition: []
    };
  },

  methods: {
    init() {
      let thet = this;
      thet.add();
      thet.remove();
    },
    // 点击卡片
    changeCard(data) {
      this.value = data.id;
    },
    add: function() {
      this.dataList.content.unshift(this.itemNew);
    },
    remove: function() {
      if (this.dataList.content.length > 5) {
        this.dataList.content.pop();
      }
    }
  },
  created() {
    // this.init();
    this.timer = setInterval(this.init, 6000);
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.newest-warning {
  width: 100%;
  height: calc(100% - 3.5rem);
  box-sizing: border-box;
  &__item {
    cursor: pointer;
    transition: all 1s;
    &.active {
      cursor: default;
    }
  }
}

.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(100px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
