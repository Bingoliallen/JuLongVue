/**
 * Created by hcg on 2020/11/19.
 */
const GIS_STATIC_PATH = window.systemParams.GIS_STATIC_PATH;
const gis = {
  GIS_STATIC_PATH,
  init() {
    // 添加 地图配置文件 和 地图依赖js
    this.addScript('mapConfig.js');
    this.addScript('leaflet.map.min.js');
  },
  addScript(path) {
    const script = document.createElement('script');
    script.src = `${GIS_STATIC_PATH}/gis/${path}`;
    // script.async = true;
    // script.defer = true;
    document.body.appendChild(script);
  }
};
gis.init();
export default gis;
