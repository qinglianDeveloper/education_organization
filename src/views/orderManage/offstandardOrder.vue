<!-- 非标准化服务订单 -->
<template>
  <div class="offstandard-order">
    <!-- 头部 -->
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>非标准化服务订单</span>
        </div>
        <div class="export-btn">
          <Button
            @click="handleAdd"
            type="primary"
            icon="md-add"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('order:unstandard:add')>-1"
          >新建</Button>
          <Button
            type="warning"
            icon="ios-redo"
            @click="handleExport"
            v-if="menuBtns.indexOf('order:plat:export')>-1"
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
            <Input type="text" placeholder="请输入公司名称" v-model="searchForm.customerName" />
          </FormItem>
          <FormItem label="邮箱/手机号" :label-width="90">
            <Input type="text" placeholder="请输入邮箱/手机号" v-model="searchForm.searchTxt" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <Select clearable style="width:120px" v-model="searchForm.status">
              <Option
                v-for="(item,index) in searchOptions"
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
        <!-- 状态 -->
        <template slot-scope="{row}" slot="status">
          <Tag :color="tagsColor(row.status)">{{row.status}}</Tag>
        </template>

        <!-- 开票状态 -->
        <template slot-scope="{row}" slot="invioceStatus">
          <Tag :color="row.invioceStatus=='已开票'?'green':'red'">{{row.invioceStatus}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleShow(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('order:unstandard:info')>-1"
          >查看</Button>
          <Button
            type="success"
            size="small"
            @click="handleOrder(row,index)"
            style="margin-right:6px"
            :disabled="verify(row,index)"
            v-if="menuBtns.indexOf('order:unstandard:workorder')>-1"
          >工单</Button>
          <Button
            type="error"
            size="small"
            @click="handleClose(row,index)"
            style="margin-right:6px"
            :disabled="row.status=='待支付'?false:true"
            v-if="menuBtns.indexOf('order:unstandard:cancel')>-1"
          >关闭</Button>
          <Button
            size="small"
            @click="handleChangePrice(row,index)"
            :disabled="row.status=='待支付'?false:true"
          >改价</Button>
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
      <Form ref="order" :model="order" :rules="rules" :label-width="100">
        <FormItem label="商品名称：" prop="productName">
          <Input v-model="order.productName"></Input>
        </FormItem>
        <FormItem label="订单金额：" prop="totalPriceOrigin">
          <Input v-model="order.totalPriceOrigin" type="number"></Input>
        </FormItem>
        <FormItem label="客户：" prop="userId">
          <Select v-model="order.userId" filterable>
            <Option v-for="(item,index) in userList" :key="index" :value="item.userId">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="客户地址：" prop="address">
          <Input v-model="order.address "></Input>
        </FormItem>
        <FormItem label="手机号：" prop="mobile">
          <Input v-model="order.mobile "></Input>
        </FormItem>
        <FormItem label="状态：" prop="status">
          <Select v-model="order.status ">
            <Option v-for="(item,index) in options" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="附件：" prop="file">
          <Upload
            :action="uploadAction"
            :on-success="handleSuccess"
            ref="upload"
            :data="file"
            :max-size="30720"
            :on-exceeded-size="handleMaxSize"
          >
            <Button icon="ios-cloud-upload-outline">上传附件</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit('order')">确定</Button>
      </div>
    </Modal>
    <!-- 改价弹框 -->
    <Modal v-model="changePriceModal" :title="changePriceTitle">
      <Form ref="changeprice" :model="formInfo" :label-width="100">
        <FormItem label="商品金额：">{{formInfo.totalPriceOrigin}}</FormItem>
        <FormItem
          label="应付金额："
          prop="totalPriceActual"
          :rules="{required: true, message: '请输入应付金额', trigger: 'blur',type:'number'}"
        >
          <InputNumber v-model="formInfo.totalPriceActual" style="width:300px"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="changePriceModal=false">取消</Button>
        <Button type="primary" @click="handleSubmitChange('changeprice')">确定</Button>
      </div>
    </Modal>
    <!-- 导出弹框 -->
    <Modal v-model="exportModal" title="导出订单">
      <Form ref="exportForm" :label-width="80" :model="exportInfo">
        <FormItem
          prop="time"
          label="时间段："
          :rules="[{required:true,type:'array',tirgger:'blur',fields:{0:{required:true,message:'请选择时间段',type:'date'},1:{required:true,message:'请选择时间段',type:'date'}}}]"
        >
          <DatePicker
            type="daterange"
            placement="bottom-end"
            format="yyyy-MM-dd"
            style="width:404px"
            placeholder="Select date"
            v-model="exportInfo.time"
            @on-change="selectTime"
          ></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="exportModal=false">取消</Button>
        <Button type="primary" @click="handleExportSubmit('exportForm')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getUnstandard,
  addUnstandard,
  // getCustomer,
  closeUnstandard,
  getAddCustomer,
  changeOffPrice
} from "@/api";
import config from "@/config";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
import { orderDownload } from "@/libs/orderDownload";
import Config from "@/config.js";
export default {
  name: "offstandard-order",
  data() {
    // 自定义验证 判断上传文件 fileList 的长度, 这样就和普通输入框表现一致了
    const validateUpload = (rule, value, callback) => {
      if (this.uploadList && this.uploadList.length === 0) {
        callback(new Error("请上传附件"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback("手机号格式不正确");
      } else {
        callback();
      }
    };
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
          title: "商品名称",
          key: "productName",
          align: "center",
          minWidth: 160
        },
        {
          title: "单价",
          key: "productPriceOrigin",
          align: "center",
          minWidth: 100
        },
        {
          title: "订单金额",
          key: "totalPriceOrigin",
          align: "center",
          minWidth: 100
        },
        {
          title: "应付金额",
          key: "totalPriceActual",
          align: "center",
          minWidth: 100
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center",
          minWidth: 160
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          minWidth: 120
        },
        {
          title: "支付方式",
          key: "payType",
          align: "center",
          minWidth: 100
        },
        {
          title: "下单时间",
          key: "orderTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "支付时间",
          key: "payTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "开票状态",
          slot: "invioceStatus",
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
      modalVisible: false,
      modalTitle: "新增非标准化订单",
      order: {
        productName: "",
        totalPriceOrigin: "",
        userId: "",
        address: "",
        mobile: "",
        status: ""
      },
      rules: {
        productName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        totalPriceOrigin: [
          { required: true, message: "请输入订单金额", trigger: "blur" }
        ],
        userId: [
          {
            required: true,
            message: "请选择客户",
            trigger: "blur",
            type: "number"
          }
        ],
        address: [
          { required: true, message: "请输入客户地址", trigger: "blur" }
        ],
        mobile: [{ required: true, validator: validatePhone, trigger: "blur" }],
        status: [
          { required: true, message: "请选择支付状态", trigger: "change" }
        ],
        file: [{ required: true, validator: validateUpload, trigger: "change" }]
      },
      userList: [],
      uploadAction: "",
      file: { title: "001" },
      searchOptions: [
        { value: "", label: "全部" },
        { value: "UNPAID", label: "待支付" },
        { value: "TOBEDISTRIBUTED", label: "待分配" },
        { value: "PENDING", label: "待处理" },
        { value: "WAITFORACCEPTANCE", label: "待验收" },
        { value: "ACCOMPLISH", label: "已完成" },
        { value: "CLOSEFORORDER", label: "交易关闭" },
        { value: "WAITFORACCOUNTCHECKING", label: "等待对账" },
        { value: "PREPAID", label: "已支付" },
        { value: "UNPASS", label: "对账审核不通过" }
      ],
      options: [
        { value: "UNPAID", label: "待支付" },
        { value: "PREPAID", label: "已支付" }
      ],
      uploadList: [],
      changePriceModal: false,
      changePriceTitle: "修改费用信息",
      formInfo: {
        totalPriceActual: 0
      },
      exportModal: false,
      exportInfo: {}
    };
  },
  created() {
    this.uploadAction = config.uploadAction;
    this.getUnstandard();
    this.getCustomer();
  },
  mounted() {
    this.init();
    this.uploadList = this.$refs.upload.fileList;
    // console.log(this.uploadList);
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
    verify(row, index) {
      if (
        row.status == "待支付" ||
        row.status == "交易关闭" ||
        row.status == "等待对账" ||
        row.status == "对账审核不通过"
      ) {
        return true;
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
     * 获取数据列表
     */
    getUnstandard() {
      getUnstandard(this.searchForm).then(res => {
        if (res.code == 200) {
          // console.log("获取", res);
          res.result.content.forEach(item => {
            if (item.orderTime) {
              item.orderTime = dateFormat(item.orderTime);
            }
            if (item.payTime) {
              item.payTime = dateFormat(item.payTime);
            }
          });
          // 状态英文切换中文
          res.result.content = this.changeLanguage(res.result.content);
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
        switch (item.status) {
          case "UNPAID":
            item.status = "待支付";
            break;
          case "TOBEDISTRIBUTED":
            item.status = "待分配";
            break;
          case "PENDING":
            item.status = "待处理";
            break;
          case "WAITFORACCEPTANCE":
            item.status = "待验收";
            break;
          case "ACCOMPLISH":
            item.status = "已完成";
            break;
          case "CLOSEFORORDER":
            item.status = "交易关闭";
            break;
          case "WAITFORACCOUNTCHECKING":
            item.status = "等待对账";
            break;
          case "PREPAID":
            item.status = "已支付";
            break;
          case "UNPASS":
            item.status = "对账审核不通过";
            break;
        }
        switch (item.payType) {
          case "WXPAY":
            item.payType = "微信支付";
            break;
          case "PUBLICPAY":
            item.payType = "对公支付";
            break;
        }
        switch (item.invioceStatus) {
          case "NOTINVOICED":
            item.invioceStatus = "未开票";
            break;
          case "MAKEOUTINVOICE":
            item.invioceStatus = "已开票";
            break;
        }
      });
      return arr;
    },
    /**
     * 标签颜色
     */
    tagsColor(status) {
      switch (status) {
        case "待支付":
          return "blue";
          break;
        case "待分配":
          return "blue";
          break;
        case "待处理":
          return "blue";
          break;
        case "待验收":
          return "blue";
          break;
        case "已完成":
          return "green";
          break;
        case "交易关闭":
          return "red";
          break;
        case "等待对账":
          return "volcano";
          break;
        case "已支付":
          return "blue";
          break;
        case "对账审核不通过":
          return "magenta";
          break;
      }
    },
    /**
     * 获取客户下拉列表
     */
    getCustomer() {
      getAddCustomer().then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.userList = res.result;
        }
      });
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
     * 新建按钮事件
     */
    handleAdd() {
      this.modalVisible = true;
      this.$refs.order.resetFields();
    },
    /**
     * 弹框上传成功回调
     */
    handleSuccess(res, file) {
      if (res.code == 200) {
        // console.log(res);
        this.order.file = res.message;
        this.$Message.success({
          content: "上传附件成功！",
          duration: 2
        });
      } else {
        this.$Message.error("上传附件失败，请重新上传");
      }
    },
    /**
     * 文件超出指定大小限制时的钩子
     */
    handleMaxSize(file) {
      this.$Message.error({
        content: "文件大小超过30M，请重新上传！",
        duration: 2
      });
    },
    /**
     * 行内操作
     */
    handleShow(row, index) {
      // console.log(row);
      this.$router.push({
        name: "serverOrderDetails",
        query: {
          type: "offStandard",
          id: row.id
        }
      });
    },
    handleOrder(row, index) {
      // console.log(row);
      this.$router.push({
        name: "workDetails",
        query: {
          from: "Order",
          workID: row.orderId
        }
      });
    },
    handleClose(row, index) {
      this.$Modal.confirm({
        title: "确认关闭订单",
        content: "订单关闭后将不能恢复，您确认关闭订单？",
        onOk: () => {
          closeUnstandard({ id: row.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success("订单关闭成功！");
              this.getUnstandard();
            }
          });
        }
      });
    },
    // 订单改价
    handleChangePrice(row, index) {
      // console.log(row);
      this.changePriceModal = true;
      this.formInfo.totalPriceOrigin = row.totalPriceOrigin;
      this.formInfo.totalPriceActual = row.totalPriceActual;
      this.formInfo.id = row.id;
    },
    handleSubmitChange(name) {
      // console.log(this.formInfo);
      this.$refs[name].validate(valid => {
        // console.log(valid);
        if (valid) {
          changeOffPrice(this.formInfo).then(res => {
            this.$Message.success("改价成功！");
            this.changePriceModal = false;
            this.getUnstandard();
          });
        }
      });
    },
    /**
     * 弹框确定按钮
     */
    handleSubmit(name) {
      // console.log(this.order);
      // this.modalVisible = false;
      this.$refs[name].validate(valid => {
        console.log(valid);
        if (valid) {
          // this.$Message.success("成功");
          addUnstandard(this.order).then(res => {
            if (res.code == 200) {
              this.$Message.success("新增非标准订单成功！");
              this.modalVisible = false;
              this.getUnstandard();
              this.$refs.upload.clearFiles();
            } else {
              this.$Message.error("新增非标准订单失败！");
            }
          });
        } else {
          this.$Message.error("请正确输入订单信息！");
        }
      });
    },
    /**
     * 导出按钮事件
     */
    handleExport() {
      this.exportModal = true;
    },
    selectTime(time) {
      this.exportInfo.beginTime = time[0];
      this.exportInfo.endTime = time[1];
    },
    handleExportSubmit(name) {
      let that = this;
      delete this.exportInfo.time;
      let url = `${Config.baseUrl}/order/export/platform?beginTime=${this.exportInfo.beginTime}&endTime=${this.exportInfo.endTime}&type=UNSTANDARDORDER`;
      this.$refs[name].validate(valid => {
        // console.log(valid);
        if (valid) {
          orderDownload(url, function(data) {
            that.exportModal = data;
          });
        }
      });
    },
    /**
     * 搜索按钮事件
     */
    handleSearch() {
      // console.log(this.searchForm);
      this.getUnstandard();
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUnstandard();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUnstandard();
    }
  }
};
</script>
<style lang="scss" scoped>
.offstandard-order {
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