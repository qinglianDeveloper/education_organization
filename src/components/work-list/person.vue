<template>
  <div>
    <!-- 搜索框 -->
    <div class="search">
      <Form class="search-from" ref="searchForm" :model="searchForm">
        <FormItem label="编号：" class="workOrderNum" :label-width="60" style="width:180px">
          <Input type="text" placeholder="请输入编号" v-model="searchForm.workOrderNum" />
        </FormItem>
        <FormItem label="状态：" class="status" :label-width="60">
          <Select clearable style="width:120px" v-model="searchForm.status">
            <Option
              v-for="(item,index) in statusOptions"
              :key="index"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="创建时间：" class="create-time" :label-width="90">
          <DatePicker
            type="daterange"
            placeholder="请选择日期"
            style="width: 160px"
            format="yyyy-MM-dd"
            clearable
            v-model="selectDate"
            @on-change="handleDate"
          ></DatePicker>
        </FormItem>
        <FormItem label="优先级：" class="priority" :label-width="70">
          <Select clearable style="width:120px" v-model="searchForm.priority" placeholder="全部">
            <Option v-for="(item,index) in options" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <!-- 表格部分 -->
    <Row>
      <div class="table">
        <Table
          border
          ref="table"
          :columns="columns"
          :data="data"
          :loading="loading"
          :height="tableHeight"
        >
          <!-- 优先级 -->
          <template slot="priority" slot-scope="{row}">
            <Tag :color="colorTags(row.priority)">{{row.priority}}</Tag>
          </template>
          <template slot="action" slot-scope="{row,index}">
            <div class="btn-group">
              <Button
                type="default"
                size="small"
                @click="handleTransfer(row,index)"
                v-show="row.status=='已受理'?true:false"
                v-if="menuBtns.indexOf('workorder:record:transfer')>-1"
              >转交</Button>
              <Button
                type="default"
                size="small"
                @click="handleAllot(row,index)"
                v-show="row.status=='待分配'||row.status=='待受理'"
                v-if="menuBtns.indexOf('workorder:record:add')>-1"
              >分配</Button>
              <Button
                type="default"
                size="small"
                @click="handleDispose(row,index)"
                v-show="row.status=='待受理'?true:false"
                v-if="menuBtns.indexOf('workorder:workOrder:accept')>-1"
              >受理</Button>
              <Button
                type="primary"
                size="small"
                @click="handleShow(row,index)"
                v-if="menuBtns.indexOf('workorder:workOrder:info')>-1"
              >查看</Button>
            </div>
          </template>
        </Table>
      </div>
    </Row>
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
    <Modal v-model="Modal" :title="modalTitle">
      <Form :model="work" ref="work">
        <FormItem
          label="工程师组："
          :label-width="96"
          prop="enginnerGroup"
          :rules="{ required: true, message: '请选择工程师组', trigger: 'blur',type:'number' }"
        >
          <Select v-model="work.enginnerGroup" @on-change="selectGroup">
            <Option
              v-for="(item,index) in acceptGroupId"
              :key="index"
              :value="item.id"
            >{{ item.groupName }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="工程师："
          :label-width="96"
          prop="engineerId"
          :rules="{ required: true, message: '请选择工程师', trigger: 'blur',type:'number' }"
        >
          <Select v-model="work.engineerId">
            <Option v-for="(item,index) in workOptions" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="Modal=false">取消</Button>
        <Button type="primary" @click="handleSubmit('orderStatus')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getWorkList,
  allotWork,
  shiftWork,
  disposeWork,
  // getEngineer,
  getAddPerson,
  getAddGroups
} from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  data() {
    return {
      selectDate: null,
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        searchType: "SELF"
      },
      /* 标题 */
      columns: [
        { type: "selection", align: "center", width: 60, fixed: "left" },
        { title: "编号", key: "workOrderNum", minWidth: 220, align: "center" },
        { title: "标题", key: "orderTitle", minWidth: 180, align: "center" },
        { title: "优先级", slot: "priority", minWidth: 80, align: "center" },
        { title: "姓名", key: "companyName", minWidth: 80, align: "center" },
        { title: "手机号", key: "mobile", minWidth: 130, align: "center" },
        { title: "状态", key: "status", minWidth: 80, align: "center" },
        {
          title: "创建时间",
          key: "createdTime",
          minWidth: 170,
          align: "center"
        },
        {
          title: "创建人",
          key: "creator",
          minWidth: 110,
          align: "center"
        },
        {
          title: "受理人",
          key: "acceptor",
          minWidth: 110,
          align: "center"
        },
        { title: "类型", key: "typeName", minWidth: 160, align: "center" },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          minWidth: 190
        }
      ],
      /* 内容 */
      data: [],
      loading: true,
      tableHeight: 0,
      total: 0,
      // 弹框
      transferModal: false,
      allotModal: false,
      disposeModal: false,
      showModal: false,
      // 状态下拉框内容
      statusOptions: [
        { value: "", label: "全部" },
        { value: "DISALLOW", label: "待分配" },
        { value: "DISAFFECT", label: "待受理" },
        { value: "ACCEPT", label: "已受理" },
        { value: "SOLVE", label: "已解决" },
        { value: "CLOSE", label: "已关闭" }
      ],
      // 下拉框内容
      options: [
        { value: "", label: "全部" },
        { value: "HIGH", label: "高" },
        { value: "MIDDLE", label: "中" },
        { value: "LOW", label: "低" }
      ],
      Modal: false,
      modalTitle: "",
      status: "",
      workOptions: [],
      work: {},
      acceptGroupId: []
    };
  },
  created() {
    this.getWorkList();
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
      // console.log(pageHeight);
      let headerHeight = 32 + 52 + 90;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight;
    },
    /**
     * 标签颜色
     */
    colorTags(status) {
      if (status == "高") {
        return "red";
      } else if (status == "中") {
        return "blue";
      } else if (status == "低") {
        return "green";
      }
    },
    /**
     * 获取工程师组下拉列表
     */
    getAddPerson(id) {
      // 受理组下拉数据
      getAddGroups().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.acceptGroupId = res.result;
          this.work.engineerId = null;
        }
      });
    },
    selectGroup(id) {
      getAddPerson({ groupId: id }).then(res => {
        if (res.code == 200) {
          this.workOptions = res.result;
        }
      });
    },
    /**
     * 获取个人工单列表数据
     */
    getWorkList() {
      // console.log(this.searchForm);
      getWorkList(this.searchForm).then(res => {
        // console.log("个人", res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.loading = false;
          this.total = res.result.totalElements;
          this.changeLanguage(this.data);
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.priority) {
          case "HIGH":
            item.priority = "高";
            break;
          case "MIDDLE":
            item.priority = "中";
            break;
          case "LOW":
            item.priority = "低";
            break;
        }
        switch (item.status) {
          case "DISALLOW":
            item.status = "待分配";
            break;
          case "DISAFFECT":
            item.status = "待受理";
            break;
          case "ACCEPT":
            item.status = "已受理";
            break;
          case "SOLVE":
            item.status = "已解决";
            break;
          case "CLOSE":
            item.status = "已关闭";
            break;
        }
      });
      return arr;
    },
    /**
     * 搜索按钮
     */
    handleSearch() {
      // console.log(this.searchForm);
      this.getWorkList();
    },
    /**
     * 搜索框改变时间
     */
    handleDate(v) {
      if (v.length > 0) {
        this.searchForm.beginTime = v[0];
        this.searchForm.endTime = v[1];
      }
    },
    /**
     * 转交按钮事件
     */
    handleTransfer(row, index) {
      this.getAddPerson(row.acceptGroupId);
      this.work = {};
      this.work.workOrderId = row.id;
      this.work.enginnerGroup = row.acceptGroupId;
      this.status = "Transfer";
      this.Modal = true;
      this.modalTitle = "转交工单";
    },
    /**
     * 分配按钮事件
     */
    handleAllot(row, index) {
      this.getAddPerson(row.acceptGroupId);
      this.work = {};
      this.work.workOrderId = row.id;
      this.work.enginnerGroup = row.acceptGroupId;
      this.status = "Allot";
      this.Modal = true;
      this.modalTitle = "分配工单";
    },
    /**
     * 处理按钮事件
     */
    handleDispose(row, index) {
      this.work = {};
      this.status = "Dispose";
      // console.log(row);
      this.$Modal.confirm({
        title: "是否已处理",
        content: "此工单是否已经处理？",
        onOk: () => {
          // console.log(row.id);
          disposeWork({ id: row.id }).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("工单处理成功！");
              this.Modal = false;
              this.getWorkList();
            } else {
              this.$Message.error("工单处理失败！");
            }
          });
        }
      });
    },
    /**
     * 列表查看按钮
     */
    handleShow(row, index) {
      // console.log(row, index);
      this.$router.push({
        name: "workDetails",
        query: { from: "workOrder", workID: row.id }
      });
    },
    /**
     * 弹框提交按钮
     */
    handleSubmit() {
      // console.log(this.work);
      this.$refs.work.validate(valid => {
        // console.log(valid);
        if (valid) {
          if (this.status == "Transfer") {
            shiftWork(this.work).then(res => {
              if (res.code == 200) {
                this.$Message.success("工单转交成功！");
                this.Modal = false;
                this.getWorkList();
              } else {
                this.$Message.error("工单转交失败！");
              }
            });
          } else if (this.status == "Allot") {
            allotWork(this.work).then(res => {
              if (res.code == 200) {
                this.$Message.success("工单分配成功！");
                this.Modal = false;
                this.getWorkList();
              } else {
                this.$Message.error("工单分配失败！");
              }
            });
          }
        }
      });
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getWorkList();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getWorkList();
    }
  }
};
</script>
<style lang="scss" scoped>
.ivu-tabs {
  height: 100%;
}
.search {
  height: 60px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .search-from {
    display: flex;
    .ivu-form-item {
      margin: 0;
      margin-right: 14px;
    }
  }
}
.btn-group {
  button {
    margin-right: 6px;
  }
  button:last-child {
    margin: 0;
  }
}
.footer {
  margin-top: 2vh;
}
</style>