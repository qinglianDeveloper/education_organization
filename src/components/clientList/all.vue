    <!-- 全部客户 -->
<template>
  <div class="person">
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="客户名称" :label-width="100">
            <Input type="text" placeholder="请输入客户名称" v-model="searchForm.name" />
          </FormItem>
          <FormItem label="联系人" :label-width="60">
            <Input type="text" placeholder="请输入联系人姓名" v-model="searchForm.contacts" />
          </FormItem>
          <FormItem label="联系号码" :label-width="100">
            <Input type="text" placeholder="请输入联系号码" v-model="searchForm.phone" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSearch">搜索</Button>
          </FormItem>
        </Form>
      </div>
    </Row>
    <!-- 内容 -->
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        :loading="loading"
        :height="tableHeight"
        @on-selection-change="changeSelect"
        class="content"
      >
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleDetails(row,index)"
            style="margin-right:6px"
          >详情</Button>
          <Button type="success" size="small" @click="handleCoope(row,index)" icon="md-create">跟进</Button>
        </template>
      </Table>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          :page-size="searchForm.pageSize"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
    </Row>

    <!-- 跟进弹框 -->
    <add-follow-up
      :followUpData="followUpData"
      :addCoopeStatus="addCoopeStatus"
      @followUpDataCancel="followUpDataCancel"
      @okShow="okShow"
    ></add-follow-up>
  </div>
</template>
<script>
import addFollowUp from "./FollowUpAdd";
import { getCustomerList } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  name: "person",
  components: { addFollowUp },
  // addCooperation
  data() {
    return {
      searchForm: {
        searchType: "SELF",
        name: "",
        code: "",
        shortName: "",
        contactName: "",
        mobilePhone: "",
        type: "",
        productTag: "",
        status: "",
        relationBusiness: "",
        profitLevel: "",
        achievementLevel: "",
        dateType: "",
        beginTime: "",
        endTime: "",
        salesIds: "",
        agentIds: "",
        pageNumber: 1,
        pageSize: 10
      },
      loading: false,
      tableHeight: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "客户全称",
          key: "name",
          align: "center",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "行业",
          key: "industry",
          align: "center",
          minWidth: 110
        },
        {
          title: "类型",
          key: "type",
          align: "center",
          minWidth: 130
        },
        {
          title: "客户业绩等级",
          key: "achievementLevel",
          align: "center",
          minWidth: 130
        },
        {
          title: "客户利润等级",
          key: "profitLevel",
          align: "center",
          minWidth: 130
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          minWidth: 110
        },
        {
          title: "直销负责人",
          key: "salesName",
          align: "center",
          minWidth: 130
        },
        {
          title: "更新时间",
          key: "updateTime",
          align: "center",
          minWidth: 180
        },
        {
          title: "更新人",
          key: "lastOperator",
          align: "center",
          minWidth: 110
        },
        {
          title: "操作",
          slot: "action",
          width: 160,
          align: "center",
          fixed: "right"
        }
      ],
      data: [],
      total: 0,
      selectCount: 0, //选中的条数
      transferStatus: false,
      transferTitle: "",
      typeName: "customer",
      selectTable: [], //接收子组件表格选中行
      addCoopeStatus: false,
      addCoopeTitle: "",
      followUpData: {}
    };
  },
  created() {
    // this._clientList();
    this.initHeight();
  },
  props: ["type"],
  watch: {
    type(newVal) {
      console.log(newVal);
      this.searchForm.searchType = newVal;
      this._clientList();
    },
  },
  methods: {
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 460;
    },
    // 获取全部数据
    _clientList() {
      getCustomerList(this.searchForm).then(res => {
        if (res.code == 200) {
          this.data = res.result.content;
          this.data.map(item => {
            item.updateTime = dateFormat(item.updateTime);
          });
          this.total = res.result.totalPages;
        }
      });
    },
    //搜索按钮点击事件
    handleSearch() {
      this._clientList();
    },
    //表格选中
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
    //跳转详情
    handleDetails(row) {
      sessionStorage.setItem("rowId", row.id);
      this.$router.push({ name: "clientDetails" });
    },
    //跟进按钮事件
    handleCoope(row) {
      this.followUpData = row;
      this.addCoopeStatus = true;
    },
    //跟进弹框取消事件
    followUpDataCancel(e) {
      this.addCoopeStatus = e;
    },
    okShow(e) {
      this.addCoopeStatus = e;
    },
    // 分页
    changePage(e) {
      this.searchForm.pageNumber = e;
      this._clientList();
    },
    changePageSize(e) {
      console.log(e);
      this.searchForm.pageSize = e;
      this._clientList();
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 66vh;
  overflow: auto;
}
.person {
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