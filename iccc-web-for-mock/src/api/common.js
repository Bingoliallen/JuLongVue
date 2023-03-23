/**
 * Created by hecg on 2020/4/7.
 */
import request from '@icccPath/utils/request';
import { getSetting } from '@icccPath/utils/request';
import zpfw from '@icccPath/common/zpfw';

let mp = getSetting('BASE_API');

// 加载表码
export const getCodeDict = codeId => {
  return request.get(`${mp}/api/codelist/code/${codeId}`);
};
export const codeTranslate = async (code, value) => {
  if (code && value) {
    return await request.get(`${mp}/v1/code-info`, { params: { code, value } });
  }
  return { data: [] };
};

// 文件下载
export const fileDownLoad = async options => {
  const res = await request({ ...options, responseType: 'arraybuffer' });
  let aTag = document.createElement('a');
  let blob = new Blob([res]);
  aTag.download = options.fileName;
  aTag.href = URL.createObjectURL(blob);
  document.body.appendChild(aTag);
  aTag.click();
  URL.revokeObjectURL(blob);
  document.body.removeChild(aTag);
  return true;
};

/**
 * 从URL获取文件
 * @param {[String]} list URL列表
 * @return {Promise<File[]>} File list
 */
export const getFileFromUrl = async list => {
  const values = await Promise.all(list.map(item => request({ url: item.url, responseType: 'arraybuffer' })));
  return values.map((item, index) => new File([item], list[index].name, { type: list[index].type || 'image/png' }));
};

// 附件上传
export const fileUpload = file => {
  let formData = new FormData();
  formData.append('file', file);
  return request.post(`${window.systemParams.UPLOAD_API}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export function zpfwShowZp(idNo) {
  return zpfw.get(idNo);
}
