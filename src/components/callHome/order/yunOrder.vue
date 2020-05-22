<!-- 系统上云订单 --->
<template>
  <div class="system-order">
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
        <!-- 云平台 -->
        <template slot="type" slot-scope="{row}">
          <Tag :color="yunColor(row.type)">{{row.type}}</Tag>
        </template>

        <template slot="yunStatus" slot-scope="{row}">
          <Tag :color="tagColor(row.yunStatus)">{{row.yunStatus}}</Tag>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleStatus(row,index)"
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
      width="640"
    >
      <Form ref="order" :model="order" :rules="rules" :label-width="80">
        <FormItem label="状态：" prop="yunStatus">
          <RadioGroup v-model="order.yunStatus">
            <Radio label="已提交" style="margin-right:14px" value="SUBMITTED"></Radio>
            <Radio label="已发送邮件" style="margin-right:14px" value="SENTMAIL"></Radio>
            <Radio label="注册完成" style="margin-right:14px" value="REGISTRCOMPLETE"></Radio>
            <Radio label="实名认证完成" style="margin-right:14px" value="CERTIFICATION"></Radio>
            <Radio label="注册失败" value="REGISTRATIONFAILED"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="账号：" v-show="order.yunStatus=='注册完成'?true:false">
          <Input v-model="order.account" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit('orderStatus')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getUserOrderYun, changeYunStatus } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "system-order",
  props: { phone: String },
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
          title: "公司名称",
          key: "companyName",
          align: "center",
          minWidth: 200
        },
        {
          title: "注册平台",
          slot: "type",
          align: "center",
          minWidth: 100
        },
        {
          title: "邮箱",
          key: "email",
          align: "center",
          minWidth: 200
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
          key: "sales",
          align: "center",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 100,
          fixed: "right"
        }
      ],
      data: [],
      modalVisible: false,
      modalTitle: "变更订单状态",
      order: { yunStatus: "", id: null },
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
      showAccount: false
    };
  },
  created() {
    // this.getYunOrder();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  mounted() {
    this.init();
  },
  watch: {
    phone(val) {
      if (val) {
        this.getYunOrder();
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
    /**
     * 获取列表数据
     */
    getYunOrder() {
      this.searchForm.searchTxt = this.phone;
      getUserOrderYun(this.searchForm).then(res => {
        if (res.code == 200) {
          console.log("云", this.searchForm, res);
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

    /**
     * 按钮是否可点击
     */
    isDisabled(row) {
      if (row.yunStatus == "实名认证完成" || row.yunStatus == "注册失败") {
        return true;
      }
    },
    tagColor(status) {
      if (status == "注册完成") {
        return "green";
      } else if (status == "注册失败") {
        return "red";
      } else if (status == "实名认证完成") {
        return "success";
      } else {
        return "blue";
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
     * 状态变更按钮事件
     */
    handleStatus(row, index) {
      // console.log(row);
      this.modalVisible = true;
      this.order.yunStatus = row.yunStatus;
      this.order.id = row.id;
    },
    /**
     * 弹框确定按钮
     */
    handleSubmit() {
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
      }
      // console.log(this.order);
      changeYunStatus(this.order).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.$Message.success(res.message);
          this.getYunOrder();
          this.modalVisible = false;
        } else {
          this.$Message.error(res.message);
        }
      });
      // this.modalVisible = false;
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
  }
};
</script>
<style lang="scss" scoped>
.system-order {
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
  .footer {
    margin-top: 2vh;
  }
}
</style>