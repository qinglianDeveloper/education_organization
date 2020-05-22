<!-- 直销/用户代理列表 --->
<template>
  <div class="wrap-page channelCheck">
    <!-- {{menuBtns}} -->
    <div ref="header">
      <headerBtns></headerBtns>
    </div>
    <div class="search" ref="header">
      <Form :model="searchForm" inline>
        <FormItem label="企业名称" :label-width="80">
          <Input v-model="searchForm.companyName" placeholder="请输入企业名称" clearable></Input>
        </FormItem>
        <FormItem label="上级" :label-width="60">
          <Input v-model="searchForm.regionalAgent" placeholder="请输入上级" clearable></Input>
        </FormItem>
        <FormItem :label-width="10">
          <Button type="primary" @click="searchBtn">搜索</Button>
          <!-- <Button type="primary" style="margin-left: 8px">导出</Button> -->
        </FormItem>
      </Form>
    </div>
    <div class="table">
      <Row>
        <Alert show-icon>
          已选择
          <span class="select-count">{{selectCount}}</span> 项
        </Alert>
      </Row>
      <!-- 表格内容 -->
      <Row>
        <Table
          border
          ref="table"
          :columns="columns"
          :data="data"
          :loading="loading"
          :height="tableHeight"
          @on-selection-change="changeSelect"
        >
          <!-- 状态 -->
          <template slot="status" slot-scope="{row}">
            <Tag :color="row.status=='ENABLE'?'green':'red'">{{row.status=='ENABLE'?'启用':'禁用'}}</Tag>
          </template>
          <template slot="agentType" slot-scope="{row}">
            <span>{{row.agentType | filterAuditStatus}}</span>
          </template>
          <template slot="qrcodeUrl" slot-scope="{row}">
            <imageView :src="row.qrcodeUrl" />
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="handleDetil(row,index)"
              v-if="menuBtns.indexOf('agent:dirAgent:info')>-1"
            >详情</Button>
            <Button
              type="success"
              size="small"
              @click="handleEdit(row,index)"
              v-if="menuBtns.indexOf('agent:secondAgent:update')>-1"
            >编辑</Button>
          </template>
        </Table>
      </Row>
    </div>
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
    <!-- 弹框 -->
    <userDetail
      :status="userDetailStatus"
      :detailId="userDetailId"
      @handleCancle="userDetailCancle"
    ></userDetail>
    <userEdit
      :status="userEditStatus"
      :editId="userEditId"
      @handleCancle="userEditCancle"
      @channgeTableData="channgeTableData"
    ></userEdit>
    <directDetail
      :status="directDetailStatus"
      :detailId="directDetailId"
      @handleCancle="directDetailCancle"
    ></directDetail>
    <directEdit
      :status="directEditStatus"
      :editId="directEditId"
      @handleCancle="directEditCancle"
      @channgeTableData="channgeTableData"
    ></directEdit>
  </div>
</template>
<script>
import headerBtns from "./components/headerBtns";
import menuBtns from "@/mixins/menuBtns";
import {
  getlistByAgentDirectOrIsv,
  getById,
  updateAgentSecond,
  deleteAgentSecond
} from "@/api";
import imageView from "@/components/imageView";
import { validatePhone, checkTel, validateEmail } from "@/utils/current";
import userDetail from "../channelUserManger/dialog/detail";
import userEdit from "../channelUserManger/dialog/edit";
import directDetail from "../channelDirect/dialog/detail";
import directEdit from "../channelDirect/dialog/edit";
export default {
  name: "channelDirect",
  components: {
    headerBtns,
    imageView,
    userDetail,
    userEdit,
    directDetail,
    directEdit
  },
  mixins: [menuBtns],
  data() {
    return {
      id: 0,
      detailData: {},
      detailShow: false,
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        companyName: "",
        regionalAgent: ""
      },
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "ID", key: "id", minWidth: 100, align: "center" },
        {
          title: "公司简称",
          key: "channelName",
          minWidth: 160,
          align: "center"
        },
        {
          title: "企业名称",
          key: "companyName",
          minWidth: 220,
          align: "center"
        },
        { title: "手机号", key: "mobilePhone", minWidth: 160, align: "center" },
        { title: "代理身份", slot: "agentType", align: "center", width: 140 },
        {
          title: "上级",
          key: "regionalAgent",
          minWidth: 180,
          align: "center"
        },
        {
          title: "二维码",
          slot: "qrcodeUrl",
          minWidth: 100,
          align: "center"
        },
        {
          title: "邀请码",
          key: "inviteCode",
          minWidth: 120,
          align: "center"
        },
        {
          title: "佣金比例",
          key: "commissionRate",
          minWidth: 160,
          align: "center"
        },
        {
          title: "状态",
          slot: "status",
          minWidth: 100,
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
      ruleValidate: {
        corpName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        channelName: [
          { required: true, message: "渠道名称不能为空", trigger: "blur" }
        ],
        mobilePhone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        otherConnact: [
          { required: true, message: "其他联系人不能为空", trigger: "blur" }
        ],
        otherMobilePhone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        idNum: [
          { required: true, message: "身份证号码不能为空", trigger: "blur" }
        ],
        corpType: [
          { required: true, message: "公司类型不能为空", trigger: "blur" }
        ],
        uniformSocialCreditCode: [
          { required: true, message: "社会信用代码不能为空", trigger: "blur" }
        ],
        nature: [{ required: true, message: "请选择性质", trigger: "change" }],
        auditStatus: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        ratioTop: [
          {
            required: true,
            message: "总代理/销售返佣比例不能为空",
            trigger: "blur"
          }
        ],
        ratioSecond: [
          {
            required: true,
            message: "二级代理返佣比例不能为空",
            trigger: "blur"
          }
        ],
        ratioCustomer: [
          {
            required: true,
            message: "客户返佣比例不能为空",
            trigger: "blur"
          }
        ]
      },
      data: [],
      loading: true,
      value: 0,
      tableHeight: 0, //表格高度
      column_status: "",
      total: 0,
      selectCount: 0,
      modalDetails: false,
      modalEdit: false,
      state: "",
      animal: "",
      title: "",
      disabled: true,
      etidData: {
        // id: "",
        // corpName: "", //公司名称
        // channelName: "", // 渠道名称
        // connact: "", // 联系人
        // mobilePhone: "", // 联系电话
        // otherConnact: "", // 其他联系人
        // otherMobilePhone: "", // 其他联系人电话
        // nature: "", //企业/个人
        // idNum: "", // 身份证号码
        // corpType: "", //公司类型
        // uniformSocialCreditCode: "", //社会信用代码
        // auditStatus: "", //审核状态(通过/待审核/拒绝)
        // auditResultDesc: "", // 审核结果描述
        ratioTop: null, // 总代理/销售返佣比例
        ratioSecond: null, //二级代理返佣比例
        ratioCustomer: null //客户返佣比例
      },
      userDetailStatus: false,
      userEditStatus: false,
      userDetailId: "",
      userEditId: "",
      directDetailStatus: false,
      directEditStatus: false,
      directDetailId: "",
      directEditId: ""
    };
  },
  created() {
    this._listByAgentForTop();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  filters: {
    //过滤器
    filterAuditStatus(str) {
      if (str == "AGENTTOP") return "区域代理";
      if (str == "AGENTSECOND") return "直销代理";
      if (str == "ISV") return "用户代理";
    }
  },
  methods: {
    channgeTableData() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10,
        companyName: "",
        regionalAgent: ""
      };
      this._listByAgentForTop();
    },
    userDetailCancle() {
      this.userDetailStatus = false;
    },
    userEditCancle() {
      this.userEditStatus = false;
    },
    directDetailCancle() {
      this.directDetailStatus = false;
    },
    directEditCancle() {
      this.directEditStatus = false;
    },
    // 直销列表
    _listByAgentForTop() {
      getlistByAgentDirectOrIsv(this.searchForm).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    // 搜索
    searchBtn() {
      this._listByAgentForTop();
    },
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
      this.tableHeight = pageHeight - headerHeight - footerHeight - 160;
    },
    del(row, index) {
      this.$Modal.confirm({
        title: "删除此条数据",
        onOk: () => {
          let obj = { id: row.id };
          deleteAgentSecond(obj).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.message);
            }
          });
        },
        onCancel: () => {
          // this.$Message.info("Clicked cancel");
        }
      });
    },
    handleDetil(row, index) {
      if (row.agentType == "AGENTTOP") {
      }
      if (row.agentType == "AGENTSECOND") {
        this.directDetailStatus = true;
        this.directDetailId = row.id;
      }
      if (row.agentType == "ISV") {
        this.userDetailStatus = true;
        this.userDetailId = row.id;
      }
    },
    handleEdit(row, index) {
      if (row.agentType == "AGENTTOP") {
      }
      if (row.agentType == "AGENTSECOND") {
        this.directEditStatus = true;
        this.directEditId = row.id;
      }
      if (row.agentType == "ISV") {
        this.userEditStatus = true;
        this.userEditId = row.id;
      }
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this._listByAgentForTop();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this._listByAgentForTop();
    },
    handleSubmit() {
      this.$refs.etidData.validate(valid => {
        // console.log(valid, 123, this.etidData);
        if (valid) {
          updateAgentSecond(this.etidData).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.message);
              this._listByAgentForTop();
              this.modalEdit = false;
            }
          });
        } else {
          this.$Message.error("内容有错，请按照提示填写!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.modalEdit = false;
    },
    changeSelect(val) {
      if (val[0]) {
        this.selectCount = val.length;
      } else {
        this.selectCount = 0;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap-page {
  padding: 16px;
}
.apply-img-ground {
  display: flex;
  width: 100%;
  margin-top: 10px;
  img {
    width: 250px;
    height: 150px;
    object-fit: contain;
    border: 1px solid #ccc;
    margin-right: 20px;
  }
}
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
.list {
  display: flex;
  margin: 8px 0;
  line-height: 32px;
  background: #f8f8f9;
  .label {
    font-weight: bold;
    display: block;
    width: 120px;
    text-align: right;
  }
  .item {
    margin-left: 14px;
  }
}
</style>