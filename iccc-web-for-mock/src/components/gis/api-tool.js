/**
 * 地图的一些后端接口，来源：api-component
 * Created by hcg on 2020/11/17.
 */
import request from '@/utils/request';

export default {
  /**
   * 地址正向匹配查询
   */
  addressPositive(address, types, count) {
    // http://127.0.0.1:8082/address/positive/type/chinese?type=101005,101007,poi&chineseAddress=人民网吧&count=10
    return request({
      method: 'get',
      url: window.gisConfig.serverUrl + '/address/positive/type/chinese',
      params: {
        type: types,
        chineseAddress: address,
        count: count
      }
    });
  },
  /**
   * 地址反向匹配查询
   */
  addressReverse(latlon, radius, address, types, count) {
    const data = {};
    data.lon = latlon.lon;
    data.lat = latlon.lat;
    data.radius = radius;
    if (typeof address === 'undefined') {
      data.address = '';
    }
    data.types = types;
    data.count = count;
    return request.get(
      window.gisConfig.serverUrl + '/address/reverse/xy',
      {
        params: data
      },
      {}
    );
  },
  arroundPolyline(zbc, address, distance, types, count) {
    if (typeof address === 'undefined') {
      address = '';
    }
    const json = { points: zbc, address: address, distance: distance, count: count, types: types };
    return request.post(window.gisConfig.serverUrl + '/space/buffer/polyline', json, this.headers_config);
  },
  spacePolygon(zbc, address, types, count) {
    if (typeof address === 'undefined') {
      address = '';
    }
    const json = { points: [zbc], address, count: count, types: types };
    return request.post(window.gisConfig.serverUrl + '/space/polygon', json, this.headers_config);
  },
  spaceRect(zbc, address, types, count) {
    if (typeof address === 'undefined') {
      address = '';
    }
    const json = { points: [zbc], address, count: count, types: types };
    return request.post(window.gisConfig.serverUrl + '/space/polygon', json, this.headers_config);
  },
  spaceCircle(centerPoint, radius, address, types, count) {
    const data = {};
    data.lon = centerPoint.lng;
    data.lat = centerPoint.lat;
    data.radius = radius;
    data.count = count;
    // 数据类型
    data.types = types;
    if (typeof address === 'undefined') {
      data.address = '';
    }
    return request.get(
      window.gisConfig.serverUrl + '/space/circle',
      {
        params: data
      },
      {}
    );
  },
  getZbcByXzqh(xzqh) {
    let newAreaLevel = '';
    if (this.judgeEndStr(xzqh, '0000')) {
      newAreaLevel = '1';
    } else if (this.judgeEndStr(xzqh, '00')) {
      newAreaLevel = '2';
    } else {
      newAreaLevel = '3';
    }
    const json = { keyword: xzqh, areaType: '1', areaLevel: newAreaLevel };
    return request.post(window.gisConfig.serverUrl + '/address/positive/bjzb/xzdm', json, this.headers_config);
  },
  judgeEndStr: function(str, keyword) {
    const d = str.length - keyword.length;
    return d >= 0 && str.lastIndexOf(keyword) === d;
  },

  judgeXzqhByXY(xzqh, lat, lng) {
    const json = { keyword: xzqh, lat: lat + '', lon: lng + '' };
    return request.post(window.gisConfig.serverUrl + '/address/space/xzdm/xy', json, this.headers_config);
  },

  /**
   * 米转度
   * @param meter
   */
  meterToDegree(meter) {
    return meter / (1000 * 101.11);
  },
  /**
   * 度转米
   * @param meter
   */
  degreeToMeter(degree) {
    return 1000 * 101.11 * degree;
  },

  judgeCircleByXY(lat, lng, circle) {
    const radiusMeter = this.meterToDegree(circle.radius);
    return this.pointlnCicle(lng, lat, circle.centerPoint.lng, circle.centerPoint.lat, radiusMeter);
  },
  /**
   * 判断后坐标是否在圆内
   * @param x1:圆心x坐标
   * @param y1:圆心Y坐标
   * @param x2:X坐标
   * @param y2:Y坐标
   * @param r:半径
   * @returns {boolean}
   * @constructor
   */
  pointlnCicle(x1, y1, x2, y2, r) {
    const xdi = x2 - x1;
    const ydi = y2 - y1;
    return Math.pow(xdi * xdi + ydi * ydi, 0.5) < r;
  },
  /**
   * 判断点与矩形的关系
   */
  judgeRectByXY(lat, lng, rect) {
    const pointxy = lng + ',' + lat;
    let polygonxy = '';
    for (let i = 0; i < rect.zbc.length; i++) {
      polygonxy = polygonxy + rect.zbc[i][1] + ',' + rect.zbc[i][0] + ',';
    }
    polygonxy = polygonxy.substr(0, polygonxy.length - 1);
    return this.pointInPolygon(pointxy, polygonxy);
  },

  /**
   * 判断点与矩形的关系
   */
  judgePolygonByXY(lat, lng, polygon) {
    const pointxy = lng + ',' + lat;
    let polygonxy = '';
    for (let i = 0; i < polygon.zbc[0].length; i++) {
      polygonxy = polygonxy + polygon.zbc[0][i][1] + ',' + polygon.zbc[0][i][0] + ',';
    }
    polygonxy = polygonxy.substr(0, polygonxy.length - 1);
    return this.pointInPolygon(pointxy, polygonxy);
  },
  /**
   * 判断后坐标是否在面内
   * @param point 119.28834,26.08525
   * @param polygon 119.28914308547974,26.086392402648926,119.28661108016968,26.08407497406006,119.28952932357788,26.08379602432251,119.28914308547974,26.086392402648926
   */
  pointInPolygon(point, polygon) {
    const pArr = point.split(',');
    const p = {};
    p.x = parseFloat(pArr[0]);
    p.y = parseFloat(pArr[1]);
    const pt = [];
    const gArr = polygon.split(',');
    const num = gArr.length;
    for (let i = 0; i < num; i++) {
      const p1 = {};
      p1.x = parseFloat(gArr[i]);
      p1.y = parseFloat(gArr[++i]);
      pt.push(p1);
    }
    const nCount = pt.length;
    let nCross = 0;
    for (let i = 0; i < nCount; i++) {
      const p1 = pt[i];
      const p2 = pt[(i + 1) % nCount];
      if (p1.y === p2.y) {
        if (p.y === p1.y && p.x >= this.getMin(p1.x, p2.x) && p.x <= this.getMax(p1.x, p2.x)) return true;
        continue;
      }
      if (p.y < this.getMin(p1.y, p2.y) || p.y > this.getMax(p1.y, p2.y)) continue;
      const x = ((p.y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x;
      if (x > p.x) nCross++;
      else if (x === p.x) return true;
    }
    return nCross % 2 === 1;
  },
  /**
   * 获取较小值
   * @param x
   * @param y
   * @returns {*}
   */
  getMin(x, y) {
    return x > y ? y : x;
  },
  /**
   * 获取较大值
   * @param x
   * @param y
   * @returns {*}
   */
  getMax(x, y) {
    return x < y ? y : x;
  }
};
