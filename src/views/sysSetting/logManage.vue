<!-- 日志管理 --->
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <!-- 搜索框部分 -->
          <div ref="header">
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="用户">
                <Input
                  type="text"
                  v-model="searchName"
                  clearable
                  placeholder="请输入用户名称"
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="操作">
                <Input
                  type="text"
                  v-model="searchKey"
                  clearable
                  placeholder="请输入操作名称"
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="操作时间">
                <DatePicker
                  type="daterange"
                  v-model="selectDate"
                  format="yyyy-MM-dd"
                  clearable
                  @on-change="selectDateRange"
                  placeholder="选择起始时间"
                  style="width: 200px"
                ></DatePicker>
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
              </Form-item>
            </Form>
            <Row>
              <Alert show-icon>
                已选择
                <span class="select-count">{{selectCount}}</span> 项
                <!-- <a class="select-clear" @click="clearSelectAll">清空</a> -->
              </Alert>
            </Row>
          </div>
          <!-- 表格部分 -->
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              ref="table"
              sortable="custom"
              @on-sort-change="changeSort"
              :height="tableHeight"
              @on-selection-change="changeSelect"
            ></Table>
          </Row>
          <!-- 分页部分 -->
          <Row type="flex" justify="end" class="page">
            <div ref="footer">
              <Page
                :current="searchForm.pageNumber"
                :total="total"
                :page-size="searchForm.pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
                :page-size-opts="[10,20,50]"
                show-total
                show-elevator
                show-sizer
              ></Page>
            </div>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { logData } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  data() {
    return {
      loading: false,
      searchForm: {
        // username: "",
        // fuzzyOperation: "", //操作名称
        // minGmtCreate: "",
        // maxGmtCreate: "",
        // type: 1,
        pageNumber: 1,
        pageSize: 10
        // sort: "",
        // order: "desc"
      },
      searchName: "",
      searchKey: "",
      selectDate: null,
      selectCount: 0, //多选已选择的数量
      /* 表格标题内容 */
      columns: [
        { type: "selection", align: "center", width: 60, fixed: "left" },
        {
          title: "序号",
          type: "index",
          width: 70,
          align: "center"
          // fixed: "left"
        },
        {
          title: "用户",
          key: "username",
          width: 120
          // sortable: true
        },
        {
          title: "用户操作",
          key: "operation",
          minWidth: 140
          // sortable: true
        },
        {
          title: "IP地址",
          key: "ip",
          minWidth: 120
        },
        {
          title: "请求方法",
          key: "method",
          minWidth: 160,
          tooltip: true
        },
        // {
        //   title: "请求参数",
        //   key: "params",
        //   minWidth: 100
        // },
        {
          title: "响应时间",
          key: "time",
          minWidth: 120
          // sortable: true
        },
        {
          title: "操作时间",
          key: "gmtCreate",
          // sortable: true,
          minWidth: 170,
          align: "center"
        }
      ],
      data: [], //表格内容
      tableHeight: 0, //表格高度
      total: 0
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
    /**
     * 初始化
     */
    init() {
      this.pageHeight();
      this.getLogList();
    },

    /**
     * 获取列表内容
     */
    getLogList() {
      this.loading = true;
      let searchForm = this.searchForm;
      logData(searchForm).then(data => {
        let { code, result } = data;
        // console.log(data);
        if (code == 200) {
          this.loading = false;
          let data = result.content;
          // 时间格式转换
          data.forEach(item => {
            if (item.gmtCreate) {
              item.gmtCreate = dateFormat(item.gmtCreate);
            }
          });
          // data.forEach((item, index) => {
          //   item.gmtCreate = new Date(
          //     +new Date(item.gmtCreate) + 8 * 3600 * 1000
          //   )
          //     .toISOString()
          //     .replace(/T/g, " ")
          //     .replace(/\.[\d]{3}Z/, "");
          // });
          this.data = data;
          this.total = result.totalElements;
        }
      });
    },

    /**
     * 计算表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      // console.log(pageHeight);
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 55;
    },

    /**
     * 操作时间事件
     */
    selectDateRange(v) {
      if (v.length > 0) {
        this.searchForm.minGmtCreate = v[0];
        this.searchForm.maxGmtCreate = v[1];
      }
    },

    /**
     * 搜索按钮点击事件
     */
    handleSearch() {
      console.log(this.searchForm);
      this.searchForm.username = this.searchName;
      this.searchForm.fuzzyOperation = this.searchKey;
      this.getLogList();
    },

    /**
     * 清空按钮事件
     */
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },

    /**
     * 表格排序事件
     */
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getLogList();
    },

    /**
     * 表格选中事件
     */
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      // console.log(v);
      this.searchForm.pageNumber = v;
      this.getLogList();
      this.clearSelectAll();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getLogList();
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  .operation {
    margin-bottom: 2vh;
  }
  .select-count {
    font-size: 13px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
  }
  .page {
    margin-top: 2vh;
  }
  .drop-down {
    font-size: 13px;
    margin-left: 5px;
  }
  .search-form {
    min-width: 980px;
  }
}
</style>