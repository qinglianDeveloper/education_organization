<!-- 积分兑换记录 -->
<template>
  <div class="integral-log">
    <!-- 头部 -->
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>积分兑换记录</span>
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
          <FormItem label="订单编号" :label-width="80">
            <Input type="text" placeholder="请输入订单编号" v-model="searchForm.exchengeOrderNo" />
          </FormItem>
          <FormItem label="手机号" :label-width="60">
            <Input type="text" placeholder="手机号" v-model="searchForm.mobile" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <Select clearable style="width:120px" v-model="searchForm.status">
              <Option value="ALL">全部</Option>
              <Option value="SENDED">已发货</Option>
              <Option value="UNSOLVE">待处理</Option>
              <Option value="FINISHED">已完成</Option>
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
        <!-- 标签颜色 -->
        <template slot="status" slot-scope="{row}">
          <Tag :color="tagsColor(row.status)">{{row.status}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            style="margin-right:6px"
            @click="handleShow(row,index)"
          >查看</Button>
          <Button
            type="warning"
            size="small"
            style="margin-right:6px"
            @click="handleShipment(row,index)"
            :disabled="row.status=='待处理'?false:true"
            v-if="menuBtns.indexOf('product:creditOrder:update')>-1"
          >发货</Button>
          <Button
            type="primary"
            size="small"
            @click="handleTail(row,index)"
            v-if="menuBtns.indexOf('product:express:info')>-1"
          >物流跟踪</Button>
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
    <!-- 查看弹框 -->
    <Modal v-model="showModal" title="查看兑换详情">
      <Form :model="logModal" :label-width="100">
        <FormItem label="订单编号：">
          <span>{{logModal.exchengeOrderNo}}</span>
        </FormItem>
        <FormItem label="商品ID：">
          <span>{{logModal.productCreditId}}</span>
        </FormItem>
        <FormItem label="商品名称：">
          <span>{{logModal.productName}}</span>
        </FormItem>
        <FormItem label="所需积分：">
          <span>{{logModal.credit}}</span>
        </FormItem>
        <FormItem label="支付时间：">
          <span>{{logModal.exchangeTime}}</span>
        </FormItem>
        <FormItem label="状态：">
          <span>{{logModal.status}}</span>
        </FormItem>
        <FormItem label="收件人姓名：">
          <span>{{logModal.userName}}</span>
        </FormItem>
        <FormItem label="收件地址：">
          <span>{{logModal.address}}</span>
        </FormItem>
        <FormItem label="联系电话：">
          <span>{{logModal.mobile}}</span>
        </FormItem>
        <FormItem label="快递公司：">
          <span>{{logModal.expressCom}}</span>
        </FormItem>
        <FormItem label="快递单号：">
          <span>{{logModal.expressNo}}</span>
        </FormItem>
      </Form>
    </Modal>
    <!-- 发货弹框 -->
    <Modal v-model="showShipment" title="快递发货信息">
      <Form ref="expressInfo" :model="expressInfo" :label-width="100" :rules="rules">
        <FormItem label="快递公司：" prop="expressCom">
          <!-- <Input v-model="expressInfo.com"></Input> -->
          <Select v-model="expressInfo.expressCom" filterable>
            <Option :value="item.code" v-for="(item,index) in comlist" :key="index">{{item.company}}</Option>
          </Select>
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
    <!-- 物流跟踪 -->
    <Modal v-model="showTail" title="物流跟踪记录" width="600">
      <div style="margin-bottom:10px">
        <span>快递公司：{{tailInfo.com}}</span>
        <span style="margin-left:30px">快递单号：{{tailInfo.nu}}</span>
      </div>
      <Table :columns="expressTitle" border :data="tailInfo.data" size="small"></Table>
    </Modal>
  </div>
</template>
<script>
import comlist from "@/utils/comlist.json";
import { getLogList, updateLogList, expressTail } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "integral-log",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0,
      selectCount: 0, //选中的条数
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "订单编号",
          key: "exchengeOrderNo",
          align: "center",
          minWidth: 220
        },
        {
          title: "商品ID",
          key: "productCreditId",
          align: "center",
          minWidth: 100
        },
        {
          title: "商品名称",
          key: "productName",
          align: "center",
          minWidth: 200,
          tooltip: true
        },
        {
          title: "所需积分",
          key: "credit",
          align: "center",
          minWidth: 100
        },
        {
          title: "支付时间",
          key: "exchangeTime",
          align: "center",
          minWidth: 200
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          minWidth: 140
        },
        {
          title: "收件人姓名",
          key: "userName",
          align: "center",
          minWidth: 120
        },
        {
          title: "收件人地址",
          key: "address",
          align: "center",
          minWidth: 140,
          tooltip: true
        },
        {
          title: "联系电话",
          key: "mobile",
          align: "center",
          minWidth: 140
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 220,
          fixed: "right"
        }
      ],
      data: [],
      loading: true,
      tableHeight: 0,
      showModal: false,
      logModal: {},
      showShipment: false,
      showTail: false,
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
        ]
      },
      comlist: comlist,
      tailInfo: {},
      expressTitle: [
        { title: "时间", key: "time", width: 160, align: "left" },
        { title: "地点和跟踪进度", key: "context" }
      ]
    };
  },
  created() {
    this.getLogList();
  },
  mounted() {
    this.pageHeight();
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  methods: {
    /**
     * 获取积分兑换列表数据
     */
    getLogList() {
      if (this.searchForm.status == "ALL") {
        this.searchForm.status = "";
      }
      getLogList(this.searchForm).then(res => {
        // console.log(this.searchForm);
        if (res.code == 200) {
          // console.log(res);
          res.result.content.forEach(item => {
            if (item.exchangeTime) {
              item.exchangeTime = dateFormat(item.exchangeTime);
              // console.log(item.createdTime);
            }
          });
          this.data = res.result.content;
          // 状态英文切换中文
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
        switch (item.status) {
          case "SENDED":
            item.status = "已发货";
            break;
          case "UNSOLVE":
            item.status = "待处理";
            break;
          case "FINISHED":
            item.status = "已完成";
            break;
        }
      });
      return arr;
    },
    tagsColor(status) {
      if (status == "已发货") {
        return "blue";
      } else if (status == "待处理") {
        return "red";
      } else if (status == "已完成") {
        return "green";
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
     * 搜索按钮事件
     */
    handleSearch() {
      // console.log(this.searchForm);
      this.getLogList();
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
    /**
     * 行内事件
     */
    handleShow(row, index) {
      // console.log(row);
      this.logModal = row;
      for (let i = 0, leng = this.comlist.length; i < leng; i++) {
        if (this.logModal.expressCom == this.comlist[i].code) {
          this.logModal.expressCom = this.comlist[i].company;
          break;
        }
      }
      this.showModal = true;
    },
    handleShipment(row, index) {
      this.showShipment = true;
      this.expressInfo.id = row.id;
    },
    handleTail(row, index) {
      this.showTail = true;
      let obj = {};
      obj.com = row.expressCom;
      obj.nu = row.expressNo;
      // console.log(obj);
      expressTail(obj).then(res => {
        if (res.code == 200) {
          this.tailInfo = JSON.parse(res.result);
          for (let i = 0, leng = this.comlist.length; i < leng; i++) {
            if (this.tailInfo.com == this.comlist[i].code) {
              this.tailInfo.com = this.comlist[i].company;
              break;
            }
          }
          // console.log(this.tailInfo);
          if (this.tailInfo.state === "3") {
            let bj = {};
            bj.id = row.id;
            bj.status = "FINISHED";
            updateLogList(bj).then(res => {
              if (res.code == 200) {
                this.$Message.success("订单已完成！");
                this.getLogList();
              }
            });
          }
        }
      });
    },
    /**
     * 发货弹框确定按钮事件
     */
    shipmentSubmit(name) {
      this.$refs[name].validate(valid => {
        // console.log(valid);
        if (valid) {
          this.expressInfo.status = "SENDED";
          // console.log(this.expressInfo);
          updateLogList(this.expressInfo).then(res => {
            if (res.code == 200) {
              this.$Message.success("发货完成！");
              this.showShipment = false;
              this.expressInfo = {};
              this.getLogList();
            }
          });
        } else {
          this.$Message.error("请按要求填写快递");
        }
      });
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
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getLogList();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getLogList();
    }
  }
};
</script>
<style lang="scss" scoped>
.integral-log {
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