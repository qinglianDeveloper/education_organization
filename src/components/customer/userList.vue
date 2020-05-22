<!-- 用户管理列表 --->
<template>
  <div class="user-list">
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" :label-width="80">
          <FormItem label="手机号">
            <Input type="text" placeholder="请输入手机号" v-model="searchForm.mobile" />
          </FormItem>
          <FormItem label="用户ID">
            <Input type="text" placeholder="请输入用户ID" v-model="searchForm.userCode" />
          </FormItem>
          <FormItem label="客户名称">
            <Input type="text" placeholder="请输入客户名称" v-model="searchForm.cstName" />
          </FormItem>
          <FormItem label="状态">
            <!-- <Input type="text" placeholder="全部" v-model="searchForm.status" /> -->
            <Select clearable v-model="searchForm.status">
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
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleDetails(row,index)"
            style="margin-right:6px"
          >详情</Button>
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
export default {
  name: "user-list",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      loading: true,
      tableHeight: 0,
      selectCount: 0, //选中的条数
      columns: [
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
          title: "身份",
          key: "identity",
          align: "center",
          minWidth: 100
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
    // this.getUserList();
    // this.salesList();
  },
  mounted() {
    // this.init();
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
     * 获取用户列表数据
     */
    getUserList() {
      getUserList(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
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
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let searchHeight = this.$refs.search.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight =
        pageHeight - headerHeight - searchHeight - footerHeight - 123;
      // console.log(this.tableHeight);
    },

    /**
     * 搜索按钮事件
     */
    handleSearch() {
      console.log(this.searchForm);
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

    handleDetails(row, index) {
      // console.log(row, index);
      this.$router.push({ name: "userDeatil", params: { userID: row.id } });
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
  padding: 0 10px;
  .search {
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