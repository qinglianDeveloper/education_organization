    <!-- 我的客户 -->
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
    <!-- 选择状态 -->
    <Row>
      <div ref="header" style="display:flex">
        <Alert show-icon style="width:200px">
          已选择
          <span class="select-count">{{selectCount}}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
        <Button
          type="warning"
          @click="handleTransfer"
          style="margin-left:10px"
          icon="md-arrow-round-forward"
        >转移</Button>
      </div>
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
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
    </Row>

    <!-- 转移弹框 -->
    <transfer
      ref="transferPage"
      :transferStatus="transferStatus"
      :transferTitle="transferTitle"
      :typeName="typeName"
      :selectTable="selectTable"
      @transferCancel="transferCancel"
      @transferOk="transferOk"
      v-if="typeName=='customer' "
    ></transfer>

    <!-- 跟进弹框 -->
    <add-cooperation
      ref="addFollowName"
      :addCoopeStatus="addCoopeStatus"
      :addCoopeTitle="addCoopeTitle"
      typeName="Customer"
      @coopeCancel="coopeCancel"
      @coopeSave="coopeSave"
    ></add-cooperation>
  </div>
</template>
<script>
import transfer from "@/components/clientList/transfer"; //转移弹框
import addCooperation from "@/components/clientList/addCooperation"; //跟进弹框
export default {
  name: "person",
  components: { transfer, addCooperation },
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
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
          minWidth: 130
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
      data: [
        {
          userID: "123",
          nickname: "123",
          phone: "123",
          clientName: "123",
          identity: "123",
          userType: "123",
          status: "已开票",
          registerTime: "123",
          total: "123"
        }
      ],
      total: 0,
      selectCount: 0, //选中的条数
      transferStatus: false,
      transferTitle: "",
      typeName: "customer",
      selectTable: [], //接收子组件表格选中行
      addCoopeStatus: false,
      addCoopeTitle: ""
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
     * 页面初始化
     */
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /**
     * 计算页面高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let searchHeight = this.$refs.search.clientHeight;
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight =
        pageHeight - searchHeight - headerHeight - footerHeight - 124;
      //   console.log(searchHeight, headerHeight, footerHeight);
    },
    /**
     * 搜索按钮点击事件
     */
    handleSearch() {},
    /**
     * 清空按钮事件
     */
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    /**
     * 表格选中
     */
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
    /**
     * 跳转详情
     */
    handleDetails(row, index) {
      this.$router.push({
        name: "clientDetails",
        params: { clientID: 456 }
      });
    },
    /**
     * 跟进按钮事件
     */
    handleCoope(row, index) {
      this.addCoopeStatus = true;
    },
    /**
     * 转移按钮事件
     */
    handleTransfer() {
      this.transferStatus = true;
    },
    /**
     * 跟进弹框保存按钮
     */
    coopeSave(v) {
      this.addCoopeStatus = false;
      //   this.getAddFollow(v);
    },
    /**
     * 跟进弹框取消事件
     */
    coopeCancel() {
      this.addCoopeStatus = false;
    },
    /**
     * 子组件取消按钮
     */
    transferCancel() {
      this.transferStatus = false;
      //   this.typeName = "";
    },
    /**
     * 子组件确认按钮
     */
    transferOk(value) {
      console.log();
      this.transferStatus = false;
      //   this.typeName = "";
      //   let arrIds = [];
      //   this.selectTable.map(item => {
      //     arrIds.push(item.id);
      //   });
      //   value.customerIds = arrIds.join(",");
      //   this.getTransCusList(value);
    },
    /**
     * 分页
     */
    changePage() {},
    changePageSize() {}
  }
};
</script>
<style lang="scss" scoped>
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