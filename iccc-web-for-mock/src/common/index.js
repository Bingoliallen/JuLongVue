import sysSettings from './../utils/sys-settings';
const { initSettings, setSettings, getSettingBool, getSetting, getSettings } = sysSettings;
import { generateTitle } from 'ui-jz-v4-common/src/utils/i18n.js';

// 这个导出是为了兼容框架的旧代码
export default sysSettings;
export { initSettings, setSettings, getSettingBool, getSetting, getSettings, generateTitle };
