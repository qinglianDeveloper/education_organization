<!-- 用户管理列表 --->
<template>
  <div class="user-list">
    <!-- 头部 -->
    <Row type="flex" justify="end">
      <div class="header" ref="header">
        <div class="export-btn">
          <Button
            type="warning"
            icon="ios-redo"
            @click="handleExport"
            :disabled="selectCount == 0"
          >导出</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="手机号" :label-width="60">
            <Input type="text" placeholder="请输入手机号" v-model="searchForm.mobile" />
          </FormItem>
          <FormItem label="用户ID" :label-width="60">
            <Input type="text" placeholder="请输入用户ID" v-model="searchForm.userCode" />
          </FormItem>
          <FormItem label="客户名称" :label-width="70">
            <Input type="text" placeholder="请输入客户名称" v-model="searchForm.cstName" />
          </FormItem>
          <FormItem label="所属销售" :label-width="70">
            <Input type="text" placeholder="请输入销售" v-model="searchForm.salesName" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <!-- <Input type="text" placeholder="全部" v-model="searchForm.status" /> -->
            <Select style="width:90px" clearable v-model="searchForm.status">
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
      >
        <!-- 状态 -->
        <template slot-scope="{row}" slot="status">
          <Tag :color="tagColor(row.status)">{{row.status}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <!-- <Button
            type="primary"
            size="small"
            @click="handleMarket(row,index)"
            style="margin-right:6px"
            :disabled="row.salesName?true:false"
            v-if="menuBtns.indexOf('sys:platformUser:setSales')>-1"
          >分配销售</Button>-->
          <!-- <Button
            :disabled="row.gradeType==1"
            size="small"
            type="primary"
            @click="handleRebate(row,index)"
            style="margin-right:6px"
          >返佣</Button>-->
          <Button
            type="success"
            size="small"
            @click="handleDetails(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('sys:platformUser:info')>-1"
          >详情</Button>
          <Button
            :type="row.status=='禁用'?'warning':'error'"
            size="small"
            @click="handleClose(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('sys:platformUser:lock')>-1"
          >{{row.status=="禁用"?"解锁":"封禁"}}</Button>
          <Button size="small" @click="handleReset(row)">重置密码</Button>
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
    <!-- 返佣弹框 -->
    <Modal title="设置客户返佣比例" v-model="modalRebate">
      <Form :label-width="150" :model="rebateInfo" ref="rebateInfo" :rules="rules">
        <FormItem label="区域代理返佣比例：" prop="ratioTop">
          <InputNumber v-model="rebateInfo.ratioTop" style="width:330px"></InputNumber>
        </FormItem>
        <FormItem label="直销代理返佣比例：" prop="ratioSecond" v-if="isShowCustomer">
          <InputNumber v-model="rebateInfo.ratioSecond" style="width:330px"></InputNumber>
        </FormItem>
        <FormItem label="客户返佣比例：" prop="ratioCustomer">
          <InputNumber v-model="rebateInfo.ratioCustomer" style="width:330px"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalRebate=false">取消</Button>
        <Button type="primary" @click="handleSubmitRebate">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getUserList,
  salesList,
  allotSales,
  lockUser,
  resetPassword,
  getRebateInfo,
  updateRebateInfo
} from "@/api";
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
          title: "手机号(微信授权）",
          key: "mobile",
          align: "center",
          minWidth: 160
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
          minWidth: 140
        },
        {
          title: "所属渠道",
          key: "channelName",
          align: "center",
          minWidth: 140
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
        // {
        //   title: "返佣比例",
        //   key: "rakebackRatio",
        //   align: "center",
        //   minWidth: 140
        // },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 230,
          fixed: "right"
        }
      ],
      data: [],
      total: 0,
      modalTitle: "销售人员选择",
      modalVisible: false,
      salesForm: {},
      personList: [],
      // 返佣配置
      modalRebate: false,
      rebateInfo: {
        ratioTop: null,
        ratioSecond: null,
        ratioCustomer: null
      },
      rules: {
        ratioTop: [
          {
            required: true,
            message: "请输入区域代理返佣比例",
            trigger: "blur",
            type: "number"
          }
        ],
        ratioSecond: [
          {
            required: true,
            message: "请输入直销代理返佣比例",
            trigger: "blur",
            type: "number"
          }
        ],
        ratioCustomer: [
          {
            required: true,
            message: "请输入客户返佣比例",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      isShowCustomer: true
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
    tagColor(status) {
      switch (status) {
        case "有效":
          return "green";
          break;
        case "无效":
          return "blue";
          break;
        case "已删除":
          return "default";
          break;
        case "禁用":
          return "red";
          break;
      }
    },
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
          this.data.forEach(item => {
            if (item.salesName == "" || item.salesName == null) {
              item.salesName = "健康申报";
            }
            if (item.channelName == "" || item.channelName == null) {
              item.channelName = "-";
            }
          });
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
            item.status = "已删除";
            break;
          case "NOREGISTRY":
            item.status = "无效";
            break;
          case "FORBID":
            item.status = "禁用";
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
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
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
      this.$router.push({ name: "userDetails", query: { userID: row.id } });
    },
    handleClose(row, index) {
      this.$Modal.confirm({
        title: `确认${row.status == "有效" ? "封禁" : "解锁"}`,
        content: `您确定要对该用户${row.status == "有效" ? "封禁" : "解锁"} ？`,
        onOk: () => {
          let obj = {};
          obj.id = row.id;
          if (row.status == "禁用") {
            obj.status = 1;
          } else {
            obj.status = 0;
          }
          lockUser(obj).then(res => {
            if (res.code == 200) {
              this.$Message.success(
                `用户${row.status == 1 ? "封禁" : "解锁"}成功`
              );
            }
            this.getUserList();
          });
        }
      });
    },
    // 重置密码
    handleReset(row) {
      // console.log(row);
      let content = "";
      if (row.mobile) {
        content = `您确定要重置手机号为：${row.mobile}的密码吗？`;
      } else {
        content = `您确定要重置该账号的密码吗？`;
      }
      this.$Modal.confirm({
        title: "是否重置密码",
        content: content,
        onOk: () => {
          // console.log(row.id);
          resetPassword({ userId: row.id }).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("重置密码成功！");
              this.getUserList();
            } else {
              this.$Message.error("重置密码失败！");
            }
          });
        }
      });
    },
    // 返佣
    handleRebate(row) {
      this.modalRebate = true;
      if (row.gradeType == 3) {
        this.isShowCustomer = true;
      } else if (row.gradeType == 2) {
        this.isShowCustomer = false;
      }
      getRebateInfo({ userId: row.id }).then(res => {
        if (res.code == 200) {
          if (res.result == "" || res.result == null) {
            this.rebateInfo = {
              userId: row.id,
              gradeType: row.gradeType,
              ratioTop: null,
              ratioSecond: null,
              ratioCustomer: null
            };
          } else {
            this.rebateInfo = JSON.parse(JSON.stringify(res.result));
          }
        }
      });
    },
    handleSubmitRebate() {
      this.$refs.rebateInfo.validate(valid => {
        // console.log(this.rebateInfo);
        if (valid) {
          for (let i in this.rebateInfo) {
            if (this.rebateInfo[i] == null) {
              delete this.rebateInfo[i];
            }
          }
          updateRebateInfo(this.rebateInfo).then(res => {
            if (res.code == 200) {
              // console.log(res);
              this.$Message.success("更新返佣比例成功！");
              this.modalRebate = false;
              this.getUserList();
            }
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