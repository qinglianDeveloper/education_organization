/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-04-27 11:12:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-30 14:36:31
 */
// 控制按钮权限，通过mixins引入
import { mapState } from "vuex";
let menuBtns = {
    computed: {
        ...mapState({
            menuBtns: state => state.menu.menuBtns
        })
    }
}
export default menuBtns;