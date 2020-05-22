let path1 = "/ydj-admin/admin";
let path2 = "/admin";
let state = process.env.NODE_ENV === 'production';
let baseUrl = state ? path1 : path2;
let tinymceUrl = state ? path1.replace('/admin', '/') : '';
// console.log(baseUrl)
export default {
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  baseUrl: baseUrl,
  tinymceUrl: tinymceUrl,
  uploadAction: `${baseUrl}/common/file/upload`
}