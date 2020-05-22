<!-- 用户协议配置 --->
<template>
  <div class="userallocation">
    <!-- 头部 -->
    <Row type="flex" justify="end">
      <div class="header" ref="header">
        <div class="export-btn">
          <Button
            type="primary"
            icon="md-add"
            @click="handleAdd"
            v-if="menuBtns.indexOf('content:contentAgreement:add')>-1"
          >新增</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
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
        class="content"
      >
        <template slot="type" slot-scope="{row}">
          <span v-if="row.type === 'USERAGREEMENT'">用户协议</span>
          <span v-if="row.type === 'PRIVACYAGREEMEN'">隐私协议</span>
          <span v-if="row.type === 'COMMISSIONRULES'">佣金规则</span>
          <span v-if="row.type === 'INTEGRALRULE'">积分规则</span>
          <span v-if="row.type === 'YUNREGISTRATIONSTATEMENT'">云账户注册说明</span>
          <span v-if="row.type === 'HOWTOVIEWYUNID'">查看云ID</span>
          <span v-if="row.type === 'OPERATIONMANUALYUNREGISTER'">操作手册(云注册)</span>
          <span v-if="row.type === 'AGENCYAGREEMENT'">云的家代理协议</span>
        </template>
        <template slot="endTime" slot-scope="{row}">
          <span>{{row.startTime | formatTime}}</span>
          <span>至</span>
          <span>{{row.endTime | formatTime}}</span>
        </template>
        <template slot="createdTime" slot-scope="{row}">
          <span>{{row.createdTime | formatCreatedTime}}</span>
        </template>
        <template slot="status" slot-scope="{row}">
          <Tag :color="row.status=='ENABLE'?'green':'red'">{{row.status=="ENABLE"?"开启":"关闭"}}</Tag>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleEdit(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('content:contentAgreement:update')>-1"
          >编辑</Button>
          <Button
            type="error"
            size="small"
            @click="handleDele(row,index)"
            v-if="menuBtns.indexOf('content:contentAgreement:delete')>-1"
          >删除</Button>
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
import {
  addAgreement,
  getAgreementList,
  deleteAgreement,
  updateAgreement
} from "@/api";
//import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
import { dateFormat } from "@/utils/current";
export default {
  name: "userallocation",
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "编号", key: "id", align: "center", minWidth: 100 },
        {
          title: "协议类型",
          slot: "type",
          align: "center",
          minWidth: 180
        },
        {
          title: "协议版本",
          key: "versions",
          align: "center",
          width: 140
        },
        {
          title: "有效期",
          slot: "endTime",
          align: "center",
          minWidth: 200
        },
        {
          title: "创建时间",
          slot: "createdTime",
          align: "center",
          minWidth: 170
        },
        { title: "状态", slot: "status", align: "center", minWidth: 80 },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          minWidth: 140
        }
      ],
      data: [],
      loading: false,
      tableHeight: 0,
      pageNumber: 1,
      pageSize: 10,
      total: 0
    };
  },
  mounted() {
    this.init();
    this.getList();
  },
  filters: {
    formatTime(value) {
      //return dateFormat(value);//格式：年-月-日 时:分:秒
      return value.split("T")[0]; //格式：年-月-日
    },
    formatCreatedTime(value) {
      return dateFormat(value); //格式：年-月-日 时:分:秒
      //return value.split("T")[0];//格式：年-月-日
    }
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
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 72;
      // console.log(this.tableHeight);
    },
    changePage(e) {
      //页码
      this.pageNumber = e;
      this.getList();
    },
    changePageSize(e) {
      //页数
      this.pageSize = e;
      this.getList();
    },
    getList() {
      //获取列表数据
      let { pageNumber, pageSize } = this;
      getAgreementList({ pageNumber, pageSize }).then(res => {
        if (res.code === 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    handleAdd() {
      //新增按钮事件
      // console.log(this.$router);
      this.$router.push({
        name: "userAllocationAddEdit",
        query: {
          type: "add",
          id: "null"
        }
      });
    },
    handleEdit(row, index) {
      //行内编辑按钮事件
      this.$router.push({
        name: "userAllocationAddEdit",
        query: {
          type: "edit",
          id: row.id
        }
      });
    },
    handleDele(row, index) {
      //行内删除按钮事件
      // console.log(row, index);
      this.$Modal.confirm({
        title: "是否删除",
        content: "是否要删除此协议？",
        onOk: () => {
          deleteAgreement(row.id).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.getList();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.userallocation {
  padding: 16px;
  height: 100%;
  overflow: auto;
  .footer {
    margin-top: 2vh;
  }
}
</style>