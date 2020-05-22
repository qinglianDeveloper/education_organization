<template>
  <div>
    <!-- 搜索框 -->
    <div class="search" ref="search">
      <Form class="search-from" ref="searchForm" :model="searchForm">
        <template v-for="(item,index) in search">
          <FormItem
            :label="item.label"
            class="workOrderNum"
            :label-width="item.labelWidth"
            :key="index"
          >
            <Input
              type="text"
              :placeholder="'请输入'+item.label"
              v-model="searchForm[item.name]"
              style="width:180px"
              clearable
            />
          </FormItem>
        </template>
        <FormItem>
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <Row>
      <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight"></Table>
    </Row>
    <!-- 分页部分 -->
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
export default {
  props: ["search", "columns", "data", "total"],
  data() {
    return {
      // 搜索部分
      searchForm: { pageNumber: 1, pageSize: 10 },
      // 表格部分
      //   data: [],
      loading: false,
      tableHeight: 0
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
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      // console.log(pageHeight);
      let headerHeight = this.$refs.search.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 114;
    },
    handleSearch() {
      this.$emit("handleSearch", this.searchForm);
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.$emit("changePage", v);
      this.searchForm.pageNumber = v;
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.$emit("changePageSize", v);
      this.searchForm.pageSize = v;
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  height: 60px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .search-from {
    display: flex;
    .ivu-form-item {
      margin: 0;
      margin-right: 14px;
    }
  }
}
.footer {
  margin-top: 2vh;
}
</style>