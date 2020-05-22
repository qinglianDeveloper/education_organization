<!-- 标准化服务订单 --->
<template>
  <div class="system-order">
    <!-- 头部 -->
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>标准化服务订单</span>
        </div>
        <div class="export-btn">
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
            <Input type="text" placeholder="请输入公司名称" v-model="searchForm.companyName" />
          </FormItem>
          <FormItem label="邮箱/手机号" :label-width="90">
            <Input type="text" placeholder="请输入邮箱/手机号" v-model="searchForm.searchTxt" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <Select clearable style="width:120px" v-model="searchForm.status">
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
            v-if="menuBtns.indexOf('order:standard:info')>-1"
          >查看</Button>
          <Button
            type="success"
            size="small"
            @click="handleOrder(row,index)"
            style="margin-right:6px"
            :disabled="verify(row,index)"
            v-if="menuBtns.indexOf('order:standard:workorder')>-1 && row.isNeedWorkorder === 1"
          >工单</Button>
          <Button
            v-if="row.isNeedWorkorder === 0"
            :type="!row.expressNo ? 'primary':'warning'"
            size="small"
            style="margin-right:6px"
            @click="handleExpress(row,index)"
          >发货</Button>
          <Button
            type="error"
            size="small"
            @click="handleClose(row,index)"
            style="margin-right:6px"
            :disabled="row.status=='待支付'?false:true"
            v-if="menuBtns.indexOf('order:standard:cancel')>-1"
          >关闭</Button>
          <Button
            size="small"
            @click="handleChangePrice(row,index)"
            style="margin-right:6px"
            :disabled="row.status=='待支付'?false:true"
            v-if="menuBtns.indexOf('order:standard:alterPrice')>-1"
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
    <!-- 改价弹框 -->
    <Modal v-model="changePriceModal" :title="changePriceTitle">
      <Form ref="orderprice" :model="formInfo" :label-width="100">
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
        <Button type="primary" @click="handleSubmit('orderprice')">确定</Button>
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
    <!-- 发货弹框 -->
    <Modal v-model="showShipment" title="快递发货信息">
      <Form ref="expressInfo" :model="expressInfo" :label-width="100" :rules="rules">
        <FormItem label="快递公司：" prop="expressCom">
          <!-- <Input v-model="expressInfo.com"></Input> -->
          <Select v-model="expressInfo.expressCom" filterable @on-change="choosedExpress">
            <Option :value="item.company" v-for="(item,index) in comlist" :key="index">{{item.company}}</Option>
          </Select>
        </FormItem>
        <FormItem label="其它公司：" prop="expressComOther" v-if="expressInfo.expressCom === '其它'">
          <Input v-model="expressInfo.expressComOther"></Input>
        </FormItem>
        <FormItem label="快递单号：" prop="expressNo">
          <Input v-model="expressInfo.expressNo"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="showShipment=false">取消</Button>
        <Button type="primary" @click="shipmentSubmit('expressInfo')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getStandard,
  closeOrder,
  getByOrderId,
  changeOrderPrice,
  exportOrder,
  //getExpressList,
  sendExpress
} from "@/api";
import comlist from "@/utils/comlist.json";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
import { orderDownload } from "@/libs/orderDownload";
import Config from "@/config.js";
export default {
  name: "system-order",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0,
      selectCount: 0, //选中的条数
      loading: true,
      tableHeight: 0,
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
          minWidth: 240
        },
        {
          title: "姓名",
          key: "userName",
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
          title: "商品ID",
          key: "productId",
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
          title: "来源",
          key: "platformFrom",
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
          minWidth: 300,
          fixed: "right"
        }
      ],
      data: [],
      modalVisible: false,
      modalTitle: "变更订单状态",
      // 下拉框内容
      options: [
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
      changePriceModal: false,
      changePriceTitle: "修改费用信息",
      formInfo: {
        totalPriceActual: 0
      },
      exportModal: false,
      exportInfo: {},
      showShipment: false,
      expressInfo: {},
      rules: {
        expressCom: [
          {
            required: true,
            message: "请选择快递公司",
            trigger: "blur"
          }
        ],
        expressNo: [
          {
            required: true,
            message: "请输入快递单号",
            trigger: "blur"
          }
        ],
        expressComOther: [
          {
            required: true,
            message: "请输入其它快递公司",
            trigger: "blur"
          }
        ]
      },
      comlist: comlist,
    };
  },
  created() {
    this.getStandard();
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
     * 获取列表数据
     */
    getStandard() {
      getStandard(this.searchForm).then(res => {
        // console.log(res);
        console.log(this.searchForm, res);
        if (res.code == 200) {
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
        switch (item.platformFrom) {
          case "WXAPP":
            item.platformFrom = "小程序";
            break;
          case "OFFLINE":
            item.platformFrom = "线下";
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
     * 行内操作
     */
    handleShow(row, index) {
      // console.log(row, index);
      this.$router.push({
        name: "serverOrderDetails",
        query: {
          type: "serverOrder",
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
          closeOrder({ id: row.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success("订单关闭成功！");
              this.getStandard();
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
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          changeOrderPrice(this.formInfo).then(res => {
            if (res.code == 200) {
              this.$Message.success("改价成功！");
              this.changePriceModal = false;
              this.getStandard();
            }
          });
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
      console.log(Config.baseUrl);
      let url = `${Config.baseUrl}/order/export/platform?beginTime=${this.exportInfo.beginTime}&endTime=${this.exportInfo.endTime}&type=STANDARDORDER`;
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
      this.getStandard();
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getStandard();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getStandard();
    },
    /* handleCreateExpress(expressCom){
      console.log('expressCom: ', expressCom);
      //创建快递公司条目
      let isHas = false;
      for (let i = 0; i < this.comlist.length; i++) {
        if(expressCom === this.comlist[i].company)isHas = true;
      }
      if(!isHas){
        this.comlist.unshift({
          "company": expressCom,
          "code": "other",
          "comtype": "国内运输商"
        });
      }
      this.expressInfo.expressCom = expressCom;
    }, */
    choosedExpress(val){
      //选择快递公司
      this.expressInfo.expressCom = val;
      this.expressInfo.expressComOther = val==='其它'?'':val;
    },
    handleExpress(row, index){
      //点击发货按钮
      let {id,expressCom,expressNo} = row;
      if(expressCom === null)expressCom='';
      if(expressNo === null)expressNo='';
      let expressComOther = expressCom;
      let isHas = false;
      for (let i = 0; i < this.comlist.length; i++) {
        if(expressCom === '')break;
        if(expressCom === this.comlist[i].company)isHas = true;
      }
      if(!isHas && expressCom !== '')expressCom = '其它';
      this.expressInfo = {orderId:id,expressCom,expressNo,expressComOther};
      this.showShipment = true;
    },
    shipmentSubmit(name){
      //标准商品发货
      this.$refs[name].validate(valid => {
        // console.log(valid);
        if (valid) {
          let {orderId,expressCom,expressNo,expressComOther} = this.expressInfo;
          if(expressCom === '其它')expressCom = expressComOther;
          sendExpress({orderId,expressCom,expressNo}).then(res=>{
            if(res.code === 200){
              this.$Message.success(res.result || "提交成功！");
              this.expressInfo.orderId = '';
              this.expressInfo.expressCom = '';
              this.expressInfo.expressNo = '';
              this.showShipment = false;
              this.expressList = [];
              this.isShowOtherExpress = false;
              this.getStandard();
            }else{
              this.$Message.error(res.result || "提交失败！");
            }
          });
        }
      });
      
    }
  }
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