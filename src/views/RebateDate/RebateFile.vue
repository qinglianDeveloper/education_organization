<template>
  <div class="rebate">
    <Row>
      <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
        <template slot="filename" slot-scope="{row}">{{filter(row.filename)}}</template>
        <template slot="action" slot-scope="{row,index}">
          <Button size="small" type="primary" @click="donwnFile(row,index)">下载</Button>
        </template>
      </Table>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="pageNumber"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
    </Row>
  </div>
</template>
<script>
import { getRebateLst } from "@/api";
import { orderDownload } from "@/libs/orderDownload";
export default {
  name: "RebateFile",
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "标题", slot: "filename", align: "center", minWidth: 140 },
        { title: "文件", key: "filename", align: "center", minWidth: 140 },
        { title: "操作", slot: "action", align: "center", minWidth: 140 }
      ],
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      tableHeight: 0,
      loading: true
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
      // 获取列表数据
      this.getRebateLst();
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      this.tableHeight = pageHeight - 86;
      // console.log(this.tableHeight);
    },
    getRebateLst() {
      let obj = {};
      obj.pageNumber = this.pageNumber;
      obj.pageSize = this.pageSize;
      getRebateLst(obj).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.loading = false;
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    filter(name) {
      name = name.split(".");
      return name[0];
    },
    changePage(e) {
      //页码
      this.pageNumber = e;
    },
    changePageSize(e) {
      //页数
      this.pageSize = e;
    },
    // 文件下载
    donwnFile(row, index) {
      var a = document.createElement("a"); // 创建隐藏的可下载链接
      a.download = row.filename;
      a.style.display = "none";
      // var blob = new Blob(row.fileurl); // 字符内容转变成blob地址
      a.href = row.fileurl;
      document.body.appendChild(a);
      a.click(); // 触发点击
      document.body.removeChild(a); // 然后移除
    }
  }
};
</script>
<style lang="scss" scoped>
.rebate {
  padding: 16px;
  .footer {
    margin-top: 2vh;
  }
}
</style>