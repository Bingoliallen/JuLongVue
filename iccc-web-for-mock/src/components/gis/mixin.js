/**
 * Created by hecg on 2020/10/12.
 */
import { addResizeListener, removeResizeListener } from "ui-component-v4/src/utils/resize-event";
import apiTool from "./api-tool";

const GIS_STATIC_PATH = window.systemParams.GIS_STATIC_PATH;

export default {
    components: {
        gis: window.httpVueLoader(GIS_STATIC_PATH + "/gis/vue-map-component-min/leaflet/map-component.vue", "frontEnd")
    },
    data() {
        return {
            apiTool,
            // 初始化中
            initing: true,
            config: window.mapConfig
        };
    },
    methods: {
        resize() {
            const gis = this.$refs.gis;
            gis && gis.map._onResize();
        },
        bindResize() {
            const dom = this.$el.querySelector("#gis");
            dom && addResizeListener(dom, this.resize);
        }
    },
    beforeDestroy() {
        const dom = this.$el.querySelector("#gis");
        dom && removeResizeListener(dom, this.resize);
    }
};
