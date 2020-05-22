/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 11:19:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-27 14:32:42
 */
let destoryTableHeight = {
    mounted() {
        // 获取表格高度
        this.initHeight();
    },
    destroyed() {
        // 销毁计算表格高度
        window.onresize = null;
    },
    methods: {
        initHeight() {
            // 计算页面高度
            this.pageHeight();
            window.onresize = () => {
                this.pageHeight();
            };
        },
    }
}
export default destoryTableHeight;