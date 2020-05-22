    <!-- 用户详情-云账户 -->
<template>
  <div class="accout">
    <Table :columns="columns" border :data="data" :height="tableHeight"></Table>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
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
import { getUserAccount } from "@/api";
export default {
  props: { userId: Number },
  name: "account",
  data() {
    return {
      columns: [
        { title: "云平台", key: "accountType", align: "center", minWidth: 100 },
        { title: "云账号", key: "account", align: "center", minWidth: 100 },
        {
          title: "邮箱",
          key: "email",
          align: "center",
          minWidth: 100
        }
      ],
      data: [],
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0,
      tableHeight: 0
    };
  },
  created() {
    this.getUserAccount();
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
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      if (document.getElementsByClassName("single-page")[0]) {
        let pageHeight = Number(
          document.getElementsByClassName("single-page")[0].clientHeight
        );
        let footerHeight = this.$refs.footer.clientHeight;
        this.tableHeight = pageHeight - footerHeight - 99;
      } else {
        let pageHeight = Number(
          document.getElementsByClassName("user-details")[0].clientHeight
        );
        this.tableHeight = pageHeight - 240;
      }
    },
    /**
     * 获取云平台账号
     */
    getUserAccount() {
      this.searchForm.userId = this.userId;
      // console.log(this.searchForm);
      getUserAccount(this.searchForm).then(res => {
        if (res.code == 200) {
          console.log(res);
          this.data = res.result.content;
          this.changeLanguage(this.data);
          this.total = res.result.totalElements;
        }
      });
    },
    /**
     * 语言切换
     */
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        // if(item.yunStatus)
        switch (item.accountType) {
          case "ALIYUN":
            item.accountType = "阿里云";
            break;
          case "TENGXUNYUN":
            item.accountType = "腾讯云";
            break;
          case "HUAWEIYUN":
            item.accountType = "华为云";
            break;
          case "BAIDUYUN":
            item.accountType = "百度云";
            break;
          case "JINSHANYUN":
            item.accountType = "金山云";
            break;
        }
      });
      return arr;
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserAccount();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserAccount();
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  margin-top: 2vh;
}
</style>