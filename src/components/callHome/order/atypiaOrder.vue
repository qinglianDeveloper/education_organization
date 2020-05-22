<!-- 非标准化服务订单 -->
<template>
  <div class="offstandard-order">
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
          >查看</Button>
          <Button
            type="success"
            size="small"
            @click="handleOrder(row,index)"
            style="margin-right:6px"
            :disabled="verify(row,index)"
          >工单</Button>
          <Button
            type="error"
            size="small"
            @click="handleClose(row,index)"
            :disabled="row.status=='待支付'?false:true"
          >关闭</Button>
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
  </div>
</template>
<script>
import {
  getUserOrderOff,
  addUnstandard,
  getCustomer,
  closeUnstandard
} from "@/api";
import config from "@/config";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "offstandard-order",
  props: { phone: String },
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
      } else if (!/^1[34578]\d{9}$/.test(value)) {
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
          minWidth: 200,
          fixed: "right"
        }
      ],
      data: [],
      modalVisible: false,
      modalTitle: "新增非标准化订单",
      order: {},
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
      uploadList: []
    };
  },
  created() {
    this.uploadAction = config.uploadAction;
    this.getUnstandard();
    this.getCustomer();
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    // console.log(this.uploadList);
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
  watch: {
    phone(val) {
      if (val) {
        this.getUnstandard();
      }
    }
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
        document.getElementsByClassName("call-relevance")[0].clientHeight
      );
      this.tableHeight = pageHeight - 180;
    },
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
    /**
     * 获取数据列表
     */
    getUnstandard() {
      this.searchForm.searchTxt = this.phone;
      getUserOrderOff(this.searchForm).then(res => {
        if (res.code == 200) {
          console.log("非标准", this.searchForm, res);
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
      let obj = {};
      obj.searchType = "ALL";
      getCustomer(obj).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.userList = res.result.content;
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
     * 新建按钮事件
     */
    handleAdd() {
      this.modalVisible = true;
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
    /**
     * 弹框确定按钮
     */
    handleSubmit(name) {
      // console.log(this.order);
      // this.modalVisible = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success("成功");
          addUnstandard(this.order).then(res => {
            if (res.code == 200) {
              this.$Message.success("新增非标准订单成功！");
              this.modalVisible = false;
              this.getUnstandard();
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
  //   padding: 16px;
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