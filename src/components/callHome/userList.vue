<!-- 呼叫中心-用户管理列表 --->
<template>
  <div class="user-list">
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="手机号" :label-width="60">
            <Input type="text" placeholder="请输入手机号" v-model="searchForm.mobile" />
          </FormItem>
          <FormItem label="用户ID" :label-width="80">
            <Input type="text" placeholder="请输入用户ID" v-model="searchForm.userCode" />
          </FormItem>
          <FormItem label="客户名称" :label-width="90">
            <Input type="text" placeholder="请输入客户名称" v-model="searchForm.cstName" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <!-- <Input type="text" placeholder="全部" v-model="searchForm.status" /> -->
            <Select style="width:160px" clearable v-model="searchForm.status">
              <Option value>全部</Option>
              <Option value="ENABLE">有效</Option>
              <Option value="DISABLE">无效</Option>
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
        <!-- <a class="select-clear" @click="clearSelectAll">清空</a> -->
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
        size="small"
      >
        <!-- 状态 -->
        <template slot-scope="{row}" slot="status">
          <Tag :color="row.status=='有效'?'success':'error'">{{row.status}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleMarket(row,index)"
            style="margin-right:6px"
            :disabled="row.salesName?true:false"
          >分配销售</Button>
          <Button
            type="success"
            size="small"
            @click="handleDetails(row,index)"
            style="margin-right:6px"
          >详情</Button>
          <Button
            :type="row.status=='有效'?'error':'warning'"
            size="small"
            @click="handleClose(row,index)"
          >{{row.status=="有效"?"封禁":"解锁"}}</Button>
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
          size="small"
        ></Page>
      </div>
    </Row>
    <!-- 弹框 -->
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :styles="{top: '140px'}"
    >
      <Form :model="salesForm" :label-width="80" ref="salesForm">
        <FormItem
          label="销售："
          :rules="{required: true, message: '请选择销售', trigger: 'change',type:'number'}"
          prop="salesId"
        >
          <Select v-model="salesForm.salesId" filterable>
            <Option v-for="item in personList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getUserList, salesList, allotSales, lockUser } from "@/api";
import { mapState } from "vuex";
import { dateFormat } from "@/utils/current";
export default {
  name: "user-list",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      loading: true,
      tableHeight: 0,
      selectCount: 0, //选中的条数
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        { title: "用户ID", key: "userCode", align: "center", minWidth: 200 },
        {
          title: "昵称",
          key: "name",
          align: "center",
          minWidth: 100
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center",
          minWidth: 130
        },
        {
          title: "客户名称",
          key: "cstName",
          align: "center",
          minWidth: 100
        },
        {
          title: "用户类型",
          key: "roleNames",
          align: "center",
          minWidth: 100
        },
        {
          title: "所属销售",
          key: "salesName",
          align: "center",
          minWidth: 100
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          minWidth: 100
        },
        {
          title: "注册时间",
          key: "registrationTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "消费总额",
          key: "paltformConsumeValue",
          align: "center",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 240,
          fixed: "right"
        }
      ],
      data: [],
      total: 0,
      modalTitle: "销售人员选择",
      modalVisible: false,
      salesForm: {},
      personList: []
    };
  },
  created() {
    this.getUserList();
    this.salesList();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
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
     * 获取用户列表数据
     */
    getUserList() {
      getUserList(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.registrationTime) {
              item.registrationTime = dateFormat(item.registrationTime);
            }
          });
          this.data = res.result.content;
          this.changeLanguage(this.data);
          this.total = res.result.totalElements;
          this.loading = false;
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.type) {
          case "ORDINARY":
            item.type = "普通用户";
            break;
          case "SALES":
            item.type = "销售";
            break;
          case "AGENT":
            item.type = "代理";
            break;
          case "CUSTOMERSERVICE":
            item.type = "客服";
            break;
          case "ENGINEER":
            item.type = "工程师";
            break;
          case "INNER":
            item.type = "内部人员";
            break;
        }
        switch (item.status) {
          case "ENABLE":
            item.status = "有效";
            break;
          case "DISABLE":
            item.status = "无效";
            break;
        }
      });
      return arr;
    },
    /**
     * 获取销售下拉列表
     */
    salesList() {
      salesList().then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.personList = res.result;
        }
      });
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("call-relevance")[0].clientHeight
      );
      this.tableHeight = pageHeight - 240;
    },

    /**
     * 导出按钮事件
     */
    handleExport() {
      let arr = [];
      for (let i = 0; i < this.data.length; i++) {
        for (let k in this.column_status) {
          if (this.data[i].id == k) {
            arr.push(this.data[i]);
          }
        }
      }
      this.$refs.table.exportCsv({
        filename: "导出标准化服务订单",
        columns: this.columns,
        data: arr
      });
    },

    /**
     * 搜索按钮事件
     */
    handleSearch() {
      // console.log(this.searchForm);
      this.getUserList();
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
      // console.log(this.selectList);
    },

    handleMarket(row, index) {
      // console.log(row, index);
      this.salesForm.userId = row.id;
      this.modalVisible = true;
    },
    handleDetails(row, index) {
      // console.log(row, index);
      this.$router.push({ name: "callDetailsUser", query: { userID: row.id } });
    },
    handleClose(row, index) {
      this.$Modal.confirm({
        title: `确认${row.status == "有效" ? "封禁" : "解锁"}`,
        content: `您确定要对该用户${row.status == "有效" ? "封禁" : "解锁"} ？`,
        onOk: () => {
          let obj = {};
          obj.id = row.id;
          if (row.status == "有效") {
            obj.status = "DISABLE";
          } else if (row.status == "无效") {
            obj.status = "ENABLE";
          }
          lockUser(obj).then(res => {
            if (res.code == 200) {
              // console.log(res);
              this.$Message.success(
                `用户${row.status == "有效" ? "封禁" : "解锁"}成功`
              );
            } else {
              this.$Message.success(
                `用户${row.status == "有效" ? "封禁" : "解锁"}成功`
              );
            }
            this.getUserList();
          });
        }
      });
    },
    /**
     * 弹框确定事件
     */
    handleSubmit() {
      // console.log(this.salesForm);
      this.$refs.salesForm.validate(valid => {
        // console.log(valid);
        if (valid) {
          allotSales(this.salesForm).then(res => {
            if (res.code == 200) {
              this.$Message.success("分配销售成功！");
              this.modalVisible = false;
              this.salesForm = {};
              this.getUserList();
            } else {
              // this.$Message.error("分配销售失败！");
              this.modalVisible = false;
              this.salesForm = {};
            }
          });
        }
      });
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserList();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserList();
    }
  }
};
</script>
<style lang="scss" scoped>
.user-list {
  // padding: 16px;
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