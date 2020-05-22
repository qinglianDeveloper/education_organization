<!-- 系统上云订单 --->
<template>
  <div class="system-order">
    <!-- {{menuBtns}} -->
    <!-- 头部 -->
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>系统上云订单</span>
        </div>
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
          <FormItem label="订单编号" :label-width="70">
            <Input type="text" placeholder="请输入订单编号" v-model="searchForm.mainOrderNo" />
          </FormItem>
          <FormItem label="公司名称" :label-width="80">
            <Input type="text" placeholder="请输入公司名称" v-model="searchForm.companyName" />
          </FormItem>
          <FormItem label="邮箱/手机号" :label-width="90">
            <Input type="text" placeholder="请输入邮箱/手机号" v-model="searchForm.searchTxt" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <!-- <Input type="text" placeholder="全部" v-model="searchForm.yunStatus" /> -->
            <Select clearable style="width:120px" v-model="searchForm.yunStatus">
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
        <!-- 云平台 -->
        <template slot="type" slot-scope="{row}">
          <Tag :color="yunColor(row.type)">{{row.type}}{{row.relationType | relationType}}</Tag>
        </template>

        <template slot="yunStatus" slot-scope="{row}">
          <Tag :color="tagColor(row.yunStatus)">{{row.yunStatus}}</Tag>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <Button
            v-if="row.type!=='阿里云'"
            type="success"
            size="small"
            style="margin-right:6px"
            @click="changeOK(row)"
            :disabled="isDisabledOK(row)"
          >确定</Button>
          <Button
            type="primary"
            size="small"
            @click="handleStatus(row,index)"
            v-if="menuBtns.indexOf('order:yun:update')>-1"
            :disabled="isDisabled(row)"
          >状态变更</Button>
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
      width="640"
    >
      <Form ref="order" :model="order" :rules="rules" :label-width="80">
        <FormItem label="状态：" prop="yunStatus">
          <RadioGroup v-model="order.yunStatus">
            <!-- <Radio
              v-for="(item,index) in radioList"
              :label="item.label"
              :value="item.value"
              :key="index"
              :style="item.style"
            ></Radio>-->
            <Radio value="SUBMITTED" label="已提交" :disabled="oneDis"></Radio>
            <Radio value="SENTMAIL" label="已发送邮件" :disabled="twoDis" v-show="order.relationType === 'NEWADD'"></Radio>
            <Radio value="REGISTRCOMPLETE" label="注册完成" :disabled="threeDis"></Radio>
            <Radio value="CERTIFICATION" label="实名认证完成" :disabled="fourDis" v-show="order.relationType === 'NEWADD'"></Radio>
            <Radio value="REGISTRATIONFAILED" label="注册失败" :disabled="fiveDis"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          prop="account"
          label="客户账号ID："
          :label-width="110"
          v-if="order.yunStatus=='注册完成'?true:false"
          :rules="{required: true, message: '请输入上云账号', trigger: 'blur'}"
        >
          <Input v-model="order.account"/>
        </FormItem>
        <FormItem
          prop="remark"
          label="失败原因："
          v-if="order.yunStatus=='注册失败'?true:false"
          :label-width="100"
          :rules="{required: true, message: '请输入失败原因', trigger: 'blur'}"
        >
          <Input v-model="order.remark" :disabled="loseDis" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>

    <!-- 弹框--阿里云报备 -->
    <Modal
      :title="modalTitle"
      v-model="orderAliyunVisible"
      :mask-closable="false"
      :styles="{top: '140px'}"
      width="640"
    >
      <Form ref="orderAli" :model="order" :rules="rules" :label-width="80">
        <FormItem label="状态：" prop="yunStatus">
          <RadioGroup v-model="order.yunStatus">
            <Radio value="SUBMITTED" label="已提交" :disabled="oneAliDis"></Radio>
            <Radio value="REGISTRCOMPLETE" label="注册完成" :disabled="twoAliDis"></Radio>
            <Radio value="REGISTRATIONFAILED" label="注册失败" :disabled="threeAliDis"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          key="ali-account"
          prop="account"
          label="客户账号ID："
          :label-width="110"
          v-if="order.yunStatus=='注册完成'?true:false"
          :rules="{required: true, message: '请输入上云账号', trigger: 'blur'}"
        >
          <Input v-model="order.account" :disabled="true"/>
        </FormItem>
        <FormItem
          key="ali-remark"
          prop="remark"
          label="失败原因："
          v-if="order.yunStatus=='注册失败'?true:false"
          :label-width="100"
          :rules="{required: true, message: '请输入失败原因', trigger: 'blur'}"
        >
          <Input v-model="order.remark" :disabled="aliLose" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="orderAliyunVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>

    <Modal
      :title="modalTitle"
      v-model="orderOther"
      :mask-closable="false"
      :styles="{top: '140px'}"
      width="640"
    >
      <Form ref="order" :model="order" :rules="rules" :label-width="80">
        <FormItem label="状态：" prop="yunStatus">
          <RadioGroup v-model="order.yunStatus">
            <!-- <Radio
              v-for="(item,index) in otherList"
              :label="item.label"
              :value="item.value"
              :key="index"
              :style="item.style"
            ></Radio>-->
            <Radio value="REGISTERED" label="已注册" :disabled="otherOne"></Radio>
            <Radio value="CERTIFICATION" label="实名认证完成" :disabled="otherTwo"></Radio>
            <Radio value="REGISTRATIONFAILED" label="注册失败" :disabled="otherThree"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          prop="account"
          label="客户账号ID："
          :label-width="110"
          v-if="order.yunStatus=='已注册'?true:false"
          :rules="{required: true, message: '请输入上云账号', trigger: 'blur'}"
        >
          <Input v-model="order.account" />
        </FormItem>
        <FormItem
          prop="remark"
          label="失败原因："
          v-if="order.yunStatus=='注册失败'?true:false"
          :label-width="100"
          :rules="{required: true, message: '请输入失败原因', trigger: 'blur'}"
        >
          <Input v-model="order.remark" :disabled="otherLose" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="orderOther=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getYunOrder, changeYunStatus, changeOderOK } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "system-order",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0,
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
        { title: "订单ID", key: "id", align: "center", minWidth: 100 },
        {
          title: "订单编号",
          key: "mainOrderNo",
          align: "center",
          minWidth: 220
        },
        {
          title: "用户ID",
          key: "userId",
          align: "center",
          minWidth: 100
        },
        {
          title: "公司名称/真实姓名",
          key: "companyName",
          align: "center",
          minWidth: 200
        },
        {
          title: "注册平台",
          slot: "type",
          align: "center",
          minWidth: 130
        },
        {
          title: "账号ID",
          key: "account",
          align: "center",
          minWidth: 180
        },
        {
          title: "邮箱",
          key: "email",
          align: "center",
          minWidth: 200
        },
        {
          title: "联系人",
          key: "contact",
          align: "center",
          minWidth: 120
        },
        {
          title: "手机号",
          key: "cellphone",
          align: "center",
          minWidth: 140
        },
        {
          title: "状态",
          slot: "yunStatus",
          align: "center",
          minWidth: 140
        },
        {
          title: "创建时间",
          key: "createdTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "销售人员",
          key: "salesName",
          align: "center",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 160,
          fixed: "right"
        }
      ],
      data: [],
      orderAliyunVisible:false,
      orderAliyun:{yunStatus: "", id: null, account: "", remark: "" },
      modalVisible: false,
      modalTitle: "变更订单状态",
      order: { yunStatus: "", id: null, account: "", remark: "" },
      rules: {
        yunStatus: [
          { required: true, message: "状态必须选一个", trigger: "blur" }
        ]
      },
      // 下拉框内容
      options: [
        { value: "", label: "全部" },
        { value: "SUBMITTED", label: "已提交" },
        { value: "SENTMAIL", label: "已发送邮件" },
        { value: "REGISTRCOMPLETE", label: "注册完成" },
        { value: "CERTIFICATION", label: "实名认证完成" },
        { value: "REGISTRATIONFAILED", label: "注册失败" }
      ],
      showAccount: false,
      /* radioList: [
        {
          label: "已提交",
          value: "SUBMITTED",
          style: "margin-right:14px"
        },
        {
          label: "已发送邮件",
          value: "SENTMAIL",
          style: "margin-right:14px"
        },
        {
          label: "注册完成",
          value: "REGISTRCOMPLETE",
          style: "margin-right:14px"
        },
        {
          label: "实名认证完成",
          value: "CERTIFICATION",
          style: "margin-right:14px"
        },
        {
          label: "注册失败",
          value: "REGISTRATIONFAILED"
        }
      ], */
      orderOther: false,
      /* otherList: [
        {
          label: "已注册",
          value: "REGISTRCOMPLETE",
          style: "margin-right:14px"
        },
        {
          label: "实名认证完成",
          value: "CERTIFICATION",
          style: "margin-right:14px"
        },
        {
          label: "注册失败",
          value: "REGISTRATIONFAILED"
        }
      ], */
      oneDis: false,
      twoDis: false,
      threeDis: false,
      fourDis: false,
      fiveDis: false,
      loseDis: false,
      otherOne: false,
      otherTwo: false,
      otherThree: false,
      otherLose: false,
      loseStatus: false,
      oneAliDis:false,
      twoAliDis:false,
      threeAliDis:false,
      aliLose: false,
    };
  },
  created() {
    this.getYunOrder();
    this.OSnow();
    var myDate = new Date();
    // console.log(myDate.toLocaleString());
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
  filters: {
    relationType(value){
      switch (value) {
        case 'NEWADD':
          return '-新建';
        case 'REPORT':
          return '-报备';
        default:
          return '';
      }
    }
  },
  methods: {
    OSnow() {
      var agent = navigator.userAgent.toLowerCase();
      var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
        console.log("这是windows32位系统");
      }
      if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
        console.log("这是windows64位系统");
      }
      if (isMac) {
        console.log("这是mac系统");
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
     * 获取列表数据
     */
    getYunOrder() {
      getYunOrder(this.searchForm).then(res => {
        if (res.code == 200) {
          // console.log(res);
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
              // console.log(item.createdTime);
            }
          });
          // 状态英文切换中文
          res.result.content = this.changeLanguage(res.result.content);
          // console.log(res.result.content);
          this.data = res.result.content;
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
        // if(item.yunStatus)
        switch (item.yunStatus) {
          case "SUBMITTED":
            item.yunStatus = "已提交";
            break;
          case "SENTMAIL":
            item.yunStatus = "已发送邮件";
            break;
          case "REGISTRCOMPLETE":
            item.yunStatus = "注册完成";
            break;
          case "CERTIFICATION":
            item.yunStatus = "实名认证完成";
            break;
          case "REGISTRATIONFAILED":
            item.yunStatus = "注册失败";
            break;
          case "REGISTERED":
            item.yunStatus = "已注册";
            break;
        }
        switch (item.type) {
          case "ALIYUN":
            item.type = "阿里云";
            break;
          case "TENGXUNYUN":
            item.type = "腾讯云";
            break;
          case "HUAWEIYUN":
            item.type = "华为云";
            break;
          case "BAIDUYUN":
            item.type = "百度云";
            break;
          case "JINSHANYUN":
            item.type = "金山云";
            break;
        }
      });
      return arr;
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

    changeOK(row) {
      console.log(row);
      this.$Modal.confirm({
        title: "注册完成",
        content: "您确定要变更当前订单为注册完成？",
        onOk: () => {
          changeOderOK({ id: row.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success("注册完成");
              this.getYunOrder();
            }
          });
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      });
    },
    /**
     * 按钮是否可点击
     */
    isDisabled(row) {
      if (row.yunStatus == "实名认证完成") {
        return true;
      }
    },
    isDisabledOK(row) {
      if (
        row.yunStatus == "已提交" ||
        row.yunStatus == "注册失败" ||
        row.yunStatus == "注册完成" ||
        row.yunStatus == "实名认证完成"
      ) {
        return true;
      }
    },
    tagColor(status) {
      if (status == "注册完成") {
        return "green";
      } else if (status == "注册失败") {
        return "red";
      } else if (status == "实名认证完成") {
        return "green";
      } else if (status == "已注册") {
        return "blue";
      } else {
        return "default";
      }
    },
    yunColor(type) {
      if (type == "阿里云") {
        return "volcano";
      } else if (type == "腾讯云") {
        return "geekblue";
      } else if (type == "华为云") {
        return "magenta";
      } else if (type == "百度云") {
        return "cyan";
      } else if (type == "金山云") {
        return "orange";
      }
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
        pageHeight - headerHeight - searchHeight - footerHeight - 83 - 44;
      // console.log(this.tableHeight);
    },
    /**
     * 状态变更按钮事件
     */
    handleStatus(row, index) {
      if (row.yunStatus == "注册失败") {
        this.loseStatus = true;
      } else {
        this.loseStatus = false;
      }
      this.$refs.order.resetFields();
      this.$refs.orderAli.resetFields();
      // console.log(row.type);
      let obj = JSON.parse(JSON.stringify(row));
      this.order.yunStatus = obj.yunStatus;
      if (obj.type === "阿里云" && obj.relationType === 'NEWADD') {
        //新建
        this.modalVisible = true;
        if (obj.yunStatus == "注册失败") {
          this.oneDis = true;
          this.twoDis = true;
          this.threeDis = true;
          this.fourDis = true;
          this.fiveDis = true;
          if (obj.remark) {
            this.loseDis = true;
          }
        } else {
          this.oneDis = false;
          this.twoDis = false;
          this.threeDis = false;
          this.fourDis = false;
          this.fiveDis = false;
          this.loseDis = false;
        }
      }
      if (obj.type === "阿里云" && obj.relationType === 'REPORT') {
        //报备
        this.orderAliyunVisible = true;
        if (obj.yunStatus == "已提交") {
          this.oneAliDis = true;
          this.twoAliDis = false;
          this.threeAliDis = false;
          this.aliLose = false;
        } else if (obj.yunStatus == "注册完成" || obj.yunStatus == "注册失败") {
          this.oneAliDis = true;
          this.twoAliDis = true;
          this.threeAliDis = true;
          this.aliLose = true;
        }
      }
      
      if(obj.type !== "阿里云"){
        this.orderOther = true;
        if (obj.yunStatus == "已提交") {
          this.otherOne = true;
          this.otherTwo = true;
          this.otherThree = false;
          this.otherLose = false;
        } else if (obj.yunStatus == "已注册") {
          this.otherOne = false;
          this.otherTwo = true;
          this.otherThree = false;
          this.otherLose = false;
        } else if (obj.yunStatus == "注册完成") {
          this.otherOne = true;
          this.otherTwo = false;
          this.otherThree = false;
          this.otherLose = false;
        } else if (obj.yunStatus == "注册失败") {
          this.otherOne = true;
          this.otherTwo = true;
          this.otherThree = true;
          if (obj.remark) {
            this.otherLose = true;
          }
        } else {
          this.otherOne = false;
          this.otherTwo = false;
          this.otherThree = false;
          this.otherLose = false;
        }
      }
      // console.log(obj.yunStatus);
      this.order.remark = obj.remark;
      this.order.account = obj.account;
      this.order.id = obj.id;
      this.order.relationType = obj.relationType;
      //debugger;
    },
    /**
     * 弹框确定按钮
     */
    handleSubmit() {
      if (this.loseStatus) {
        this.orderOther = false;
        this.modalVisible = false;
      } else {
        this.$refs.order.validate(res => {
          // console.log(res, this.order);
          if (res) {
            switch (this.order.yunStatus) {
              case "已提交":
                this.order.yunStatus = "SUBMITTED";
                break;
              case "已发送邮件":
                this.order.yunStatus = "SENTMAIL";
                break;
              case "注册完成":
                this.order.yunStatus = "REGISTRCOMPLETE";
                break;
              case "实名认证完成":
                this.order.yunStatus = "CERTIFICATION";
                break;
              case "注册失败":
                this.order.yunStatus = "REGISTRATIONFAILED";
                break;
              case "已注册":
                this.order.yunStatus = "REGISTERED";
                break;
            }
            changeYunStatus(this.order).then(res => {
              if (res.code == 200) {
                // console.log(res);
                this.$Message.success(res.message);
                this.getYunOrder();
                this.modalVisible = false;
                this.orderOther = false;
                this.orderAliyunVisible = false;
              } else {
                this.$Message.error(res.message);
              }
            });
          }
        });
      }
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
        filename: "导出系统上云订单",
        columns: this.columns,
        data: arr
      });
    },
    /**
     * 搜索按钮事件
     */
    handleSearch() {
      // console.log(this.searchForm);
      this.getYunOrder();
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getYunOrder();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getYunOrder();
    }
  },
  /* watch: {
    radioList(val) {
      console.log("11111", val);
    }
  } */
};
</script>
<style lang="scss" scoped>
.system-order {
  padding: 16px;
  .header {
    display: flex;
    justify-content: space-between;
    .title {
      color: #2d8cf0;
      font-size: 16px;
      line-height: 32px;
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
}
</style>