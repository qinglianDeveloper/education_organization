<template>
  <div class="manger">
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="工单编号" :label-width="70">
            <Input type="text" placeholder="请输入工单编号" v-model="searchForm.workOrderNum" />
          </FormItem>
          <FormItem label="手机号" :label-width="80">
            <Input type="text" placeholder="请输入手机号" v-model="searchForm.mobile" />
          </FormItem>
          <FormItem label="服务友好度" :label-width="90">
            <Select clearable style="width:80px" v-model="searchForm.friendliness">
              <Option
                v-for="(item,index) in options"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务及时性" :label-width="90">
            <Select clearable style="width:80px" v-model="searchForm.promptness">
              <Option
                v-for="(item,index) in options"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="技能专业度" :label-width="90">
            <Select clearable style="width:80px" v-model="searchForm.professional">
              <Option
                v-for="(item,index) in options"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSearch">搜索</Button>
          </FormItem>
        </Form>
      </div>
    </Row>
    <!-- 选择状态 -->
    <Row>
      <Alert show-icon>
        已选择
        <span class="select-count">{{selectCount}}</span> 项
      </Alert>
    </Row>
    <!-- 内容 -->
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        ref="table"
        :loading="loading"
        :height="tableHeight"
        @on-selection-change="changeSelect"
        class="content"
      >
        <!-- 操作按钮 -->
        <template slot="action" slot-scope="{row}">
          <Button type="default" size="small" style="margin-right:6px" @click="goOrder(row)">订单</Button>
          <Button type="default" size="small" @click="goWorkOrder(row)">工单</Button>
        </template>
      </Table>
    </Row>
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
import { getEvaluationList, getOrderId } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  name: "assessment-manger",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0,
      options: [
        {
          value: 1,
          label: 1
        },
        {
          value: 2,
          label: 2
        },
        {
          value: 3,
          label: 3
        },
        {
          value: 4,
          label: 4
        },
        {
          value: 5,
          label: 5
        }
      ],
      selectCount: 0,
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        {
          title: "工单编号",
          minWidth: 210,
          key: "workOrderNum",
          align: "center"
        },
        {
          title: "受理人",
          minWidth: 80,
          key: "acceptor",
          align: "center"
        },
        {
          title: "评论人",
          minWidth: 160,
          key: "companyName",
          align: "center"
        },
        {
          title: "手机号",
          minWidth: 130,
          key: "mobile",
          align: "center"
        },
        {
          title: "创建时间",
          minWidth: 180,
          key: "createdTime",
          align: "center"
        },
        {
          title: "服务友好度",
          minWidth: 110,
          key: "friendliness",
          align: "center"
        },
        {
          title: "技能专业度",
          minWidth: 110,
          key: "professional",
          align: "center"
        },
        {
          title: "服务及时性",
          minWidth: 110,
          key: "promptness",
          align: "center"
        },
        {
          title: "综合评分",
          minWidth: 100,
          key: "evaluation",
          align: "center"
        },
        {
          title: "其他",
          minWidth: 160,
          key: "otherSuggestion",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 160
        }
      ],
      data: [],
      loading: false,
      tableHeight: 0
    };
  },
  created() {
    this.getEvaluationList();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /* 页面&表格高度 */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let searchHeight = this.$refs.search.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - searchHeight - footerHeight - 104;
    },
    /* 获取列表数据 */
    getEvaluationList() {
      getEvaluationList(this.searchForm).then(res => {
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    /* 搜索按钮 */
    handleSearch() {
      this.getEvaluationList();
    },
    changeSelect(e) {
      let column_status = {};
      e.map((item, index) => {
        this.data.map((item1, index1) => {
          if (item.id == item1.id) {
            column_status[item.id] = true;
          }
        });
      });
      this.column_status = column_status;
      this.selectList = e;
      this.selectCount = e.length;
    },
    goOrder(row) {
      // console.log(row);
      let id;
      getOrderId({ orderId: row.orderId }).then(res => {
        if (res.code == 200) {
          id = res.result;
          this.goOrderDetails(row.type, id);
        }
      });
    },
    /* 跳转订单详情 */
    goOrderDetails(type, id) {
      if (type == "STANDARDORDER") {
        this.$router.push({
          name: "serverOrderDetails",
          query: {
            type: "serverOrder",
            id
          }
        });
      } else if (type == "UNSTANDARDORDER") {
        this.$router.push({
          name: "serverOrderDetails",
          query: {
            type: "offStandard",
            id
          }
        });
      }
    },
    goWorkOrder(row) {
      // console.log(row);
      this.$router.push({
        name: "workDetails",
        query: { from: "workOrder", workID: row.workOrderId }
      });
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getEvaluationList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getEvaluationList();
    }
  }
};
</script>
<style lang="scss" scoped>
.manger {
  padding: 16px;
  .search {
    border: 1px solid #dcdee2;
    border-radius: 4px;
    padding-left: 6px;
    margin-bottom: 10px;
    .ivu-form {
      .ivu-form-item {
        margin: 10px 0;
        margin-right: 12px;
      }
    }
  }
  .footer {
    margin-top: 2vh;
  }
}
</style>