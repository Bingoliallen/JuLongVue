/**
 * Created by hcg on 2021/2/3.
 */
import domToImage from 'dom-to-image';
import { cropPicture } from '@icccPath/utils/tool';
import { getFkqXzqh } from './request';

export default class LeafletUtil {
  gis;
  map;
  listens = {};
  useMoveWarp = false;
  zoom = (...arg) => {
    if (this.useMoveWarp) {
      return;
    }
    this.trigger('zoom', ...arg);
  };
  moveend = (...arg) => {
    if (this.useMoveWarp) {
      return;
    }
    this.trigger('moveend', ...arg);
  };

  constructor(gis) {
    this.gis = gis;
    this.map = gis.map;
    this.init();
  }
  init() {
    this.map.on('zoom', this.zoom);
    this.map.on('moveend', this.moveend);
  }
  on(type, fn) {
    const list = this.listens[type] || [];
    list.push(fn);
    this.listens[type] = list;
    return this;
  }
  off(type, fn) {
    if (fn) {
      const list = this.listens[type];
      const index = list.indexOf(fn);
      if (index !== -1) {
        list.splice(index, 1);
      }
    } else {
      delete this.listens[type];
    }
    return this;
  }
  trigger(type, ...arg) {
    const list = this.listens[type];
    list &&
      list.forEach(fn => {
        fn(...arg);
      });
    return this;
  }
  /**
   * 地图移动完成之后才返回函数执行结果
   * 原理：先执行外部函数，外部函数必须会触发地图移动，然后触发移动结束事件，再返回外部函数执行结果
   * @param fn 外部函数
   * @return {Promise<any>}
   */
  moveWarp(fn) {
    return new Promise(resolve => {
      let result;
      const moveend = () => {
        this.map.off('moveend', moveend);
        this.useMoveWarp = false;
        resolve(result);
      };
      // 绑定移动结束事件
      this.useMoveWarp = true;
      this.map.on('moveend', moveend);
      // 执行外部函数，外部函数会触发地图移动，然后触发移动结束事件
      result = fn && fn();
    });
  }
  /**
   * 每隔 10ms 判断 judge() 是否执行为 true，是则返回
   * @param judge 判断函数
   * @param wait 等待时间，默认 16.666ms
   * @return {Promise<any>} 外部函数的结果
   */
  asyncJudge(judge, wait = 1000 / 60) {
    return new Promise(resolve => {
      const timeFn = () => {
        setTimeout(() => {
          if (judge()) {
            resolve();
          } else {
            timeFn();
          }
        }, wait);
      };
      timeFn();
    });
  }

  // 获取图层中心点
  getCenterPoint(layer) {
    if (!layer.centerPoint) {
      const layerBound = this.gis.getLayerBound(layer);
      layer.centerPoint = {
        lat: (layerBound.south + layerBound.north) / 2,
        lng: (layerBound.east + layerBound.west) / 2
      };
    }
    return layer.centerPoint;
  }
  // 图形中间绘制数字
  drawCenterNumber(layer, index) {
    const centerPoint = layer.centerPoint;
    const element = layer.getElement();
    const rect = element.getBoundingClientRect();
    const { width, height } = rect;
    return this.gis.addDiv({
      xy: centerPoint,
      option: {
        html: `<div class="marker-num marker-num_${index}" style="
                  color: var(--color-primary);
                  width: ${width}px;
                  height: ${height}px;
                  line-height: ${height}px;
                  font-size: ${((width > height ? height : width) * 0.6) << 0}px;
                  text-align: center;
                  transform: translate(-50%, -50%);
                ">${index + 1}</div>`
      }
    });
  }
  // 绘制图形
  async drawFkqLayer(data) {
    const gis = this.gis;
    let mapData = data.mapData;
    let layer;
    if (data.type === 'AREA' && !mapData) {
      const qyData = await getFkqXzqh(data.areaCode);
      const xys = JSON.parse(qyData.data.zbxx);
      if (!xys || !xys.length) {
        console.error('防控圈地图区划数据为空', xys);
        return;
      }
      mapData = { xys };
    }
    if (data.type === 'AREA' || data.type === 'POLYGON') {
      layer = gis.addPolygon({
        option: { weight: 2, color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.15 },
        ...mapData
      });
      this.getCenterPoint(layer);
    }
    if (data.type === 'CIRCULAR') {
      layer = gis.addCircle(mapData);
    }
    return layer;
  }
  // 生成图形预览图
  async drawFkqPreview(layer) {
    const gisEl = this.gis.$el;
    await this.asyncJudge(() => {
      // 当地图瓦片存在时继续执行
      if (gisEl.querySelector('.leaflet-tile-container img[role="presentation"]')) {
        return true;
      }
    });
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, window.systemParams.GIS_SCREEN_SHOT_TIME || 200);
    });
    const layerElement = layer.getElement();
    const tempOpacity = layerElement.getAttribute('fill-opacity');
    layerElement.setAttribute('fill-opacity', '0.5');
    const gisRect = gisEl.getBoundingClientRect();
    const options = {
      filter: node => {
        return (
          // 包含显示的防控圈
          node.contains(layerElement) ||
          // 包含瓦片图
          !node.querySelector ||
          node.querySelector('img[role="presentation"]') ||
          // 是瓦片图
          (node.nodeName.toUpperCase() === 'IMG' && node.getAttribute('role') === 'presentation')
        );
      },
      width: gisRect.width,
      height: gisRect.height,
      imagePlaceholder: require('@icccPath/assets/images/common/transparent-img.png')
    };
    // 计算裁剪图片高度，原图的宽高最大值稍微放大一点得出新图片高度
    const rect = layerElement.getBoundingClientRect();
    let height = (Math.max(rect.width, rect.height) / 0.8) << 0;
    const gisMin = Math.min(gisRect.width, gisRect.height);
    if (height > gisMin) {
      // 当然，裁剪图片高度不能超出范围
      height = gisMin;
    }
    // 截图
    const dataUrl = await domToImage.toPng(gisEl, options);
    layerElement.setAttribute('fill-opacity', tempOpacity);
    // 裁剪并压缩
    return await cropPicture(
      dataUrl,
      rect.left - gisRect.left - (height - rect.width) / 2,
      rect.top - gisRect.top - (height - rect.height) / 2,
      height,
      height
    );
  }
}
