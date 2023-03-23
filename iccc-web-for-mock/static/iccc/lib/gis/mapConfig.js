/**
 * 地图配置
 */
window.mapConfig = {
  mapUrl: '/ezmap_sl/baiduMap/maptile/{z}/{x}/{y}.png',
  //centerPoint:[24.525875890240933,118.12914024366201],
  centerPoint: [31.904296875000004, 108.45703125],
  maxZoom: 14,
  minZoom: 5,
  coordinateType: 'BD09', //取值范围[WGS84,GCJ02,BD09]
  coordinateUnit: 'METER',
  closePopupOnClick: false,
  level: 9,
  zoomControl: false,
  tms: true,
  crs: {
    epsg: 'EPSG:	',
    proj:
      '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
    resolutions: [
      262144,
      131072,
      65536,
      32768,
      16384,
      8192,
      4096,
      2048,
      1024,
      512,
      256,
      128,
      64,
      32,
      16,
      8,
      4,
      2,
      1,
      0.5
    ],
    origin: [0, 0],
    bounds: [
      [20037508.342789244, 0],
      [0, 20037508.342789244]
    ]
  }
};
