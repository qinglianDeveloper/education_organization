<!-- 渠道审核 --->
<template>
  <div class="wrap-page channelCheck">
    <div ref="header">
      <headerBtns></headerBtns>
    </div>
    <div class="search" ref="search">
      <Form :model="searchForm" style="display:flex">
        <FormItem label="申请单号" :label-width="70">
          <Input v-model="searchForm.id" placeholder="请输入申请单号" />
        </FormItem>
        <FormItem label="手机号" :label-width="60">
          <Input v-model="searchForm.mobilePhone" placeholder="请输入手机号" />
        </FormItem>
        <FormItem label="状态" :label-width="40">
          <Select v-model="searchForm.auditStatus" style="width:120px" clearable>
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
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
          :data="templateData"
          :loading="loading"
          :height="tableHeight"
          @on-selection-change="changeSelect"
        >
          <template slot-scope="{ row }" slot="auditStatus">
            <Tag :color="tagColor(row.auditStatus)">{{row.auditStatus | filterAuditStatus}}</Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              :disabled="row.auditStatus!='WAITTING'"
              size="small"
              @click="handleCheck(row,index)"
              v-if="menuBtns.indexOf('channel:agent:audit')>-1"
            >审核</Button>
            <!-- <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="handleEdit(row,index)"
          >详情</Button>
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            :disabled="row.auditStatus === 'WAITTING'?false:true"
            @click="applyPass(row,index)"
            v-if="menuBtns.indexOf('channel:agent:audit')>-1"
          >通过</Button>
          <Button
            type="error"
            size="small"
            :disabled="row.auditStatus === 'WAITTING'?false:true"
            @click="applyRefuse(row,index)"
            v-if="menuBtns.indexOf('channel:agent:audit')>-1"
            >拒绝</Button>-->
          </template>
        </Table>
      </Row>
    </div>
    <!-- 分页部分 -->
    <!-- <pages @changePage="changePage" :fromData="searchForm" /> -->
    <pages
      @changePage="changePage"
      :total="total"
      :fromData="searchForm"
      @clickPageSize="clickPageSize"
    />
    <Modal v-model="modal1" :title="title" width="600">
      <CellGroup>
        <Cell title="性质：" :extra="nature" />
        <Cell v-if="reture == '个人'" title="真实姓名：" :extra="applyDetail.corpName" />
        <Cell v-else title="公司名称：" :extra="applyDetail.corpName" />
        <Cell v-if="reture == '个人'" title="手机号：" :extra="applyDetail.mobilePhone" />
        <Cell v-else title="类型" :extra="applyDetail.corpType" />
        <Cell v-if="reture == '个人'" title="身份证号：" :extra="applyDetail.idNum" />
        <Cell v-else title="统一社会信用代码" :extra="applyDetail.uniformSocialCreditCode" />
        <Cell v-if="reture == '个人'" title="其他联系人：" :extra="applyDetail.otherConnact" />
        <Cell v-else title="联系人姓名：" :extra="applyDetail.connact" />
        <Cell title="手机号：" :extra="applyDetail.mobilePhone" />
        <Cell v-if="reture == '企业'" title="渠道名称：" :extra="applyDetail.channelName" />
        <Cell>
          <span>{{ alertText }}</span>
          <div class="apply-img-ground" v-if="reture == '个人'">
            <imageView
              v-if="alertText == '身份证正反面：'"
              width="150"
              height="150"
              :src="applyDetail.idBackPic"
            />&nbsp;
            <imageView
              v-if="alertText == '身份证正反面：'"
              width="150"
              height="150"
              :src="applyDetail.idFrontPic"
            />&nbsp;
          </div>
          <div class="apply-img-ground" v-else>
            <imageView
              v-if="alertText == '营业执照照片：'"
              width="150"
              height="150"
              :src="applyDetail.businessLicense"
            />&nbsp;
          </div>
        </Cell>
        <!-- <Cell>
          <span>拒绝理由：</span>
          <Input v-model="reason" placeholder="审核通过则无需填写" />
        </Cell>-->
      </CellGroup>
      <div slot="footer">
        <!-- <Button
          type="error"
          :disabled="applyDetail.auditStatus === 'WAITTING'?false:true"
          @click="refuse(applyDetail)"
        >拒绝</Button>-->
        <Button @click="modal1=false">关闭</Button>
      </div>
    </Modal>

    <!-- 返佣比列弹框 -->
    <Modal v-model="modalRebate" title="审核通过确认">
      <Form :model="formRebate" :label-width="150" :rules="rulesRebate" ref="rebate">
        <FormItem label="区域代理返佣比例：" prop="ratioTop">
          <Input v-model="formRebate.ratioTop" number />
        </FormItem>
        <FormItem label="直销代理返佣比例：" prop="ratioSecond">
          <Input v-model="formRebate.ratioSecond" number />
        </FormItem>
        <FormItem label="客户返佣比例：" prop="ratioCustomer">
          <Input v-model="formRebate.ratioCustomer" number />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handleCancle">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modal5" title="申请拒绝" width="380" @on-ok="ok" @on-cancel="cancel">
      <p>
        <Input v-model="reason" placeholder="请输入拒绝的理由" />
      </p>
    </Modal>

    <!-- 审核 -->
    <agency
      :status="agencyStatus"
      :id="agencyId"
      @handleCancle="agencyCancle"
      @channgeTableData="channgeTableData"
    ></agency>
    <qrCode
      :status="qrCodeStatus"
      :id="qrCodeId"
      @handleCancle="qrCodeCancle"
      @channgeTableData="channgeTableData"
    ></qrCode>
    <internet
      :status="internetStatus"
      :id="internetId"
      @handleCancle="internetCancle"
      @channgeTableData="channgeTableData"
    ></internet>
  </div>
</template>
<script>
import headerBtns from "./components/headerBtns";
import imageView from "@/components/imageView";
import { listByApply, applyId, auditAgent } from "@/api/index";
import { dateFormat } from "@/utils/current";
import pages from "@/components/pageview";
// 按钮权限校验
import menuBtns from "@/mixins/menuBtns";
// 弹框部分
import agency from "./dialog/agency";
import qrCode from "./dialog/qrCode";
import internet from "./dialog/internet";
export default {
  name: "channel-check",
  components: { headerBtns, pages, imageView, agency, qrCode, internet },
  mixins: [menuBtns],
  data() {
    return {
      reture: "",
      disabled: false,
      title: "个人申请页面",
      alertText: "身份证正反面：",
      Cid: 0, // 拒绝获取到的id
      searchForm: {
        number: "",
        pageNumber: 1, //页面大小
        pageSize: 10, //页面数量
        soet: "", // 排序字段
        order: "", // 排序方式 asc/desc
        id: "", // 申请单号id
        mobilePhone: "", // 联系电话
        auditStatus: "" //审核状态(通过:PASSED、已拒绝:REJECT、待审核:WAITTING
      },
      applyDetail: {},

      cityList: [
        {
          value: "PASSED",
          label: "通过"
        },
        {
          value: "WAITTING",
          label: "待审核"
        },
        {
          value: "REJECT",
          label: "拒绝"
        }
      ],
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "申请单号", key: "id", minWidth: 100, align: "center" },
        { title: "企业名称", key: "corpName", minWidth: 220, align: "center" },
        { title: "手机号", key: "mobilePhone", minWidth: 150, align: "center" },
        { title: "联系人", key: "connact", minWidth: 100, align: "center" },
        {
          title: "提交时间",
          key: "createdTime",
          minWidth: 200,
          align: "center"
        },
        {
          title: "状态",
          slot: "auditStatus",
          minWidth: 100,
          align: "center"
        },
        { title: "申请来源", key: "origin", minWidth: 160, align: "center" },
        {
          title: "操作",
          slot: "action",
          width: 100,
          align: "center",
          fixed: "right"
        }
      ],
      nature: "",
      templateData: [],
      loading: true,
      value: 0,
      tableHeight: 400, //表格高度
      column_status: "",
      total: 0,
      selectCount: 0,
      modal5: false,
      reason: "",
      modal1: false,
      modal2: false,
      state: "",
      formRebate: {
        id: "",
        auditStatus: "PASSED",
        ratioTop: null,
        ratioSecond: null,
        ratioCustomer: null
      },
      modalRebate: false,
      rulesRebate: {
        ratioTop: [
          {
            required: true,
            message: "请输入区域返佣比列",
            trigger: "blur",
            type: "number"
          }
        ],
        ratioSecond: [
          {
            required: true,
            message: "请输入直销返佣比列",
            trigger: "blur",
            type: "number"
          }
        ],
        ratioCustomer: [
          {
            required: true,
            message: "请输入客户返佣比列",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      agencyStatus: false,
      qrCodeStatus: false,
      internetStatus: false,
      agencyId: "",
      qrCodeId: "",
      internetId: ""
    };
  },
  filters: {
    //过滤器
    filterAuditStatus(str) {
      if (str == "WAITTING") return "待审核";
      if (str == "REJECT") return "已拒绝";
      if (str == "PASSED") return "通过";
    }
  },
  created() {
    this._listByApply();
    this.initHeight();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    channgeTableData() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10
      };
      this._listByApply();
    },
    tagColor(status) {
      if (status == "WAITTING") return "blue";
      if (status == "REJECT") return "red";
      if (status == "PASSED") return "green";
    },
    // 获取页面高度
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 368;
    },
    //代理审核列表
    _listByApply() {
      listByApply(this.searchForm).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.loading = false;
          let arr = res.result.content;
          arr.map(item => {
            item.createdTime = dateFormat(item.createdTime);
            item.nature == "COMPANY"
              ? (item.nature = "企业")
              : (item.nature = "个人");
            return arr;
          });
          this.total = res.result.totalElements;
          this.templateData = arr;
        }
      });
    },
    //搜索
    searchBtn() {
      this._listByApply();
    },
    // 代理审核
    handleCheck(row, index) {
      if (row.originType == "AGENTSECOND") {
        this.agencyStatus = true;
        this.agencyId = row.id;
      } else if (row.originType == "SALESQRCODE") {
        this.qrCodeStatus = true;
        this.qrCodeId = row.id;
      } else if (row.originType == "INTERNETCHANNELS") {
        this.internetStatus = true;
        this.internetId = row.id;
      }
    },
    agencyCancle() {
      this.agencyStatus = false;
    },
    qrCodeCancle() {
      this.qrCodeStatus = false;
    },
    internetCancle() {
      this.internetStatus = false;
    },
    applyPass(row) {
      this.modalRebate = true;
      this.formRebate.id = row.id;
      this.$refs.rebate.resetFields();
      //通过
      // this.$Modal.confirm({
      //   title: "申请通过",
      //   content: "<p>确定通过该用户的申请吗</p>",
      //   onOk: () => {
      //     let obj = {
      //       id: row.id,
      //       auditStatus: "PASSED"
      //     };
      //     auditAgent(obj).then(res => {
      //       if (res.code == 200) {
      //         this._listByApply();
      //         this.$Message.success(res.message);
      //       }
      //     });
      //   },
      //   onCancel: () => {
      //     this.$Message.info("取消审核");
      //   }
      // });
    },
    handleCancle() {
      // tear
      this.modalRebate = false;
    },
    handleSubmit() {
      this.$refs.rebate.validate(valid => {
        // console.log(this.formRebate);
        auditAgent(this.formRebate).then(res => {
          if (res.code == 200) {
            this._listByApply();
            this.modalRebate = false;
            this.$Message.success(res.message);
          }
        });
      });
    },

    applyRefuse(row) {
      //拒绝
      this.Cid = row.id;
      this.modal5 = true;
    },
    sureReason() {
      //提交拒绝的理由
      this.modal5 = false;
    },
    //拒绝确定按钮
    ok() {
      let obj = {
        id: this.Cid,
        auditStatus: "REJECT", //WAITTING
        auditResultDesc: this.reason
      };
      auditAgent(obj).then(res => {
        if (res.code == 200) {
          this._listByApply();
          this.$Message.success(res.message);
        }
      });
    },
    // 拒绝取消按钮
    cancel() {
      this.$Message.info("关闭拒绝");
    },

    handleEdit(row, index) {
      this.reture = row.nature;
      this.modal1 = true;
      let obj = { id: row.id };
      applyId(obj).then(res => {
        if (res.code == 200) {
          if (res.result.nature == "COMPANY") {
            this.title = "企业申请页面";
            this.alertText = "营业执照照片：";
            this.nature = "企业";
          } else {
            this.title = "个人申请页面";
            this.alertText = "身份证正反面：";
            this.nature = "个人";
          }
          this.applyDetail = res.result;
        }
      });
    },
    //弹窗拒绝
    refuse(applyDetail) {
      let obj = {
        id: applyDetail.id,
        auditStatus: "REJECT", //WAITTING
        auditResultDesc: this.reason
      };
      auditAgent(obj).then(res => {
        if (res.code == 200) {
          this._listByApply();
          this.$Message.success(res.message);
          this.modal1 = false;
        }
      });
    },
    //弹窗通过
    adopt(applyDetail) {
      let obj = {
        id: applyDetail.id,
        auditStatus: "PASSED"
      };
      auditAgent(obj).then(res => {
        if (res.code == 200) {
          this._listByApply();
          this.$Message.success(res.message);
          this.modal1 = false;
          this.reason = "";
        }
      });
    },

    changeSelect(val) {
      if (val[0]) {
        this.selectCount = val.length;
      } else {
        this.selectCount = 0;
      }
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this._listByApply();
    },
    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    clickPageSize(v) {
      this.searchForm.pageSize = v;
      this._listByApply();
    }
  }
};
</script>
<style lang="scss">
.wrap-page {
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
}

.table-list {
  height: 70vh;
  overflow: auto;
}
.apply-img-ground {
  display: flex;
  width: 100%;
}
</style>