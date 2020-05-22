<!-- 定时任务 --->
<template>
  <section>
    <Card>
      <div ref="header">
        <!--搜索组部分 -->
        <Row>
          <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
            <FormItem :label-width="0">
              <Input v-model="searchVal" placeholder="请输入...">
                <Select v-model="searchName" slot="prepend" style="width: 90px">
                  <Option value="task">任务名称</Option>
                  <Option value="group">分组名称</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click.native="handleSearch"></Button>
              </Input>
            </FormItem>
            <Form-item style="float:right" class="br fr">
              <Button
                @click="handleAdd"
                type="primary"
                icon="ios-add"
                v-if="menuBtns.indexOf('common:job:modify')>-1"
              >添加</Button>
              <Button
                @click="delAll"
                type="error"
                icon="ios-trash"
                :disabled="selectCount == 0"
                style="margin:0 6px"
                v-if="menuBtns.indexOf('common:job:delete')>-1"
              >批量删除</Button>
              <Button
                @click="handleExport"
                type="warning"
                icon="ios-share-alt"
                :disabled="selectCount == 0"
              >导出</Button>
            </Form-item>
          </Form>
        </Row>
        <!-- 选择状态 -->
        <Row>
          <Alert show-icon>
            已选择
            <span class="select-count">{{selectCount}}</span> 项
            <!-- <a class="select-clear" @click="clearSelectAll">清空</a> -->
          </Alert>
        </Row>
      </div>
      <!-- 表格内容部分 -->
      <Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          ref="table"
          sortable="custom"
          @on-sort-change="changeSort"
          @on-selection-change="changeSelect"
          :height="tableHeight"
        >
          <template slot="jobStatus" slot-scope="{row}">
            <i-switch
              v-model="row.jobStatus"
              :true-value="1"
              :false-value="0"
              size="large"
              @on-change="changeStatus(row)"
            >
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>

            <!-- <Tag :color="row.jobStatus==1?'green':'red'">{{row.jobStatus==1?"开启":"关闭"}}</Tag> -->
          </template>
        </Table>
      </Row>
      <!-- 分页部分 -->
      <Row type="flex" justify="end" class="page mt10" ref="pageFooter">
        <div ref="footer">
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
      <!-- 人员部门选择器 -->
      <Bulk-Upload :openUpload="openUpload" @close="close" title="批量导入账号信息"></Bulk-Upload>
      <!-- 任务状态 -->
      <Modal
        v-model="taskStatus"
        title="确认提示框"
        @on-ok="okStatus"
        @on-cancel="cancelStatus"
        :closable="false"
      >
        <p>{{taskContainer}}</p>
      </Modal>
      <!-- 任务状态 -->
      <!-- 添加、编辑定时任务 -->
      <Modal
        :title="taskModalTitle"
        v-model="taskModalVisible"
        :mask-closable="false"
        :width="600"
        :styles="{top: '30px'}"
      >
        <Form ref="taskForm" :model="taskForm" :label-width="70" :rules="taskFormValidate">
          <FormItem label="任务名称" prop="jobName" :label-width="100">
            <Input v-model="taskForm.jobName" placeholder="请输入任务名称" />
          </FormItem>
          <FormItem label="任务分组" prop="jobGroup" :label-width="100">
            <Input v-model="taskForm.jobGroup" placeholder="请输入任务分组" />
          </FormItem>
          <FormItem label="任务类" prop="beanClass" :label-width="100">
            <Input v-model="taskForm.beanClass" placeholder="请输入任务类" />
          </FormItem>
          <FormItem label="调用方法" prop="methodName" :label-width="100">
            <Input v-model="taskForm.methodName" placeholder="请输入调用方法" />
          </FormItem>
          <FormItem label="cron表达式" prop="cronExpression" :label-width="100">
            <Input v-model="taskForm.cronExpression" placeholder="请输入cron表达式" />
          </FormItem>
          <FormItem label="任务描述" prop="description" :label-width="100">
            <Input v-model="taskForm.description" row="2" type="textarea" placeholder="请输入任务描述" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="handlecancel">取消</Button>
          <Button type="primary" :loading="submitLoading" @click="handelSubmitTask">提交</Button>
        </div>
      </Modal>
    </Card>
  </section>
</template>
<script>
import BulkUpload from "@/components/upload/BulkUpload.vue";
import {
  getJobList,
  addTaskData,
  deleteTaskData,
  changeTaskStatue
} from "@/api";
import { mapState } from "vuex";
export default {
  name: "time-task",
  components: {
    BulkUpload
  },
  data() {
    return {
      startForm: {
        id: "",
        cmd: ""
      },
      /* 搜索框值 */
      searchForm: {
        pageNumber: 1,
        pageSize: 10
        // sort: "",
        // order: "desc",
        // jobName: "",
        // methodName: "",
        // jobStatus: ""
      },
      searchVal: "", //任务名称
      searchName: "task", //下拉选择框
      selectCount: 0, //选中的条数
      loading: true, //表格加载状态
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "任务ID",
          key: "id",
          // sortable: true,
          // fixed: "left"
          align: "center",
          width: 100
        },
        {
          title: "任务名称",
          key: "jobName",
          align: "center",
          // sortable: true,
          minWidth: 120
        },
        {
          title: "任务分组",
          width: 120,
          key: "jobGroup",
          align: "center",
          tooltip: true
        },
        {
          title: "任务描述",
          width: 120,
          key: "description",
          align: "center",
          tooltip: true
        },
        {
          title: "任务类",
          width: 120,
          key: "beanClass",
          align: "center",
          tooltip: true
        },
        {
          title: "调用方法",
          width: 120,
          key: "methodName",
          align: "center",
          tooltip: true
        },
        {
          title: "cron表达式",
          width: 120,
          key: "cronExpression",
          align: "center",
          tooltip: true
        },
        {
          title: "更新者",
          width: 120,
          key: "updateBy",
          align: "center",
          tooltip: true
        },
        {
          title: "更新时间",
          width: 120,
          key: "updateDate",
          align: "center",
          tooltip: true
        },
        {
          title: "任务状态",
          width: 100,
          align: "center",
          fixed: "right",
          slot: "jobStatus"
        },
        {
          title: "操作",
          key: "action",
          width: 130,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnPerm = this.menuBtns;
            return h("div", [
              btnPerm && btnPerm.includes("common:job:modify")
                ? h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.edit(params.row, "", "modify");
                        }
                      }
                    },
                    "修改"
                  )
                : "",
              btnPerm && btnPerm.includes("common:job:delete")
                ? h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          this.remove(params.row);
                        }
                      }
                    },
                    "删除"
                  )
                : ""
            ]);
          }
        }
      ],
      data: [], //表格数据
      column_status: "",
      tableHeight: 0,
      total: 0,
      openUpload: false,
      taskStatus: false, //任务状态
      taskContainer: "", //确认提示框内容
      taskModalTitle: "", //新增修改定时任务弹框标题
      taskModalVisible: false, //弹框是否显示
      /* 新增-弹框内容 */
      taskForm: {
        id: "",
        jobName: "",
        jobGroup: "",
        description: "",
        beanClass: "",
        methodName: "",
        cronExpression: "",
        jobStatus: ""
      },
      /* 弹出框校验规则 */
      taskFormValidate: {
        jobName: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        jobGroup: [
          { required: true, message: "请填写分组名称", trigger: "blur" }
        ],
        beanClass: [
          { required: true, message: "请填写任务类", trigger: "blur" }
        ]
      },
      submitLoading: false, //提交按钮等待
      operationLoading: false,
      obj: {}
    };
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
    /**
     * 页面初始化
     */
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
      this.getLogList();
    },

    /**
     * 列表接口数据
     */
    getLogList() {
      getJobList(this.searchForm).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.data = res.result.content;
          this.data.forEach(item => {
            item.jobStatus = item.jobStatus * 1;
          });
          this.total = parseInt(res.result.totalElements);
          // console.log(this.data);
        }
      });
    },
    /**
     * 改变任务状态
     */
    changeStatus(row) {
      this.taskStatus = true;
      let obj = {};
      obj.id = row.id;
      if (row.jobStatus == 1) {
        this.taskContainer = "您确定要 开启 定时任务：数据导入任务调度 吗？";
        obj.cmd = "start";
      } else if (row.jobStatus == 0) {
        this.taskContainer = "您确定要 关闭 定时任务：数据导入任务调度 吗？";
        obj.cmd = "stop";
      }
      this.obj = obj;
    },

    /**
     * 计算页面高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 47;
    },

    /**
     * 搜索框按钮事件
     */
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      if (this.searchName == "group") {
        this.searchForm.jobGroup = this.searchVal;
        this.searchForm.jobName = "";
        // console.log("分组：", this.searchVal);
      } else {
        this.searchForm.jobName = this.searchVal;
        this.searchForm.jobGroup = "";
        // console.log("任务：", this.searchVal);
      }
      this.getLogList(); //列表接口
    },

    /**
     * 添加按钮事件
     */
    handleAdd() {
      this.taskModalVisible = true;
      this.taskModalTitle = "新增定时任务";
    },

    /**
     * 批量删除按钮事件
     */
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.operationLoading = true;
          this.$Message.success("删除成功");
          // console.log(ids);
          deleteTaskData(ids).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.init();
            }
          });
        }
      });
    },

    /**
     * 批量导出按钮事件
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
        filename: "导出产品数据",
        columns: this.columns,
        data: arr
      });
    },

    /**
     * 清空按钮事件
     */
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },

    /**
     * 表格排序
     */
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
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
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getLogList();
      this.clearSelectAll();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getLogList();
    },

    /**
     * 开启文件上传弹框
     */
    close(val) {
      this.openUpload = val;
    },

    /**
     * 任务状态弹框-确定按钮
     */
    okStatus() {
      this.taskStatus = false;
      changeTaskStatue(this.obj).then(res => {
        this.getLogList();
      });
    },

    /**
     * 任务状态弹框网络请求
     */
    runJobList() {
      // console.log("状态")
      /*  runJobData(this.startForm).then(res => {
        if (res.success) {
          this.$Message.success({
            content: res.message,
            duration: 3
          });
          this.getLogList(); //列表接口
        }
      }); */
    },

    /**
     * 任务状态弹框关闭
     */
    cancelStatus() {
      this.taskStatus = false;
      let that = this;
      this.paramsStatus = "0";
      this.getLogList();
    },

    /**
     * 提交按钮事件
     */
    handelSubmitTask() {
      if (this.taskForm.id) {
        // console.log("0", this.taskForm);
        this.$refs.taskForm.validate(valid => {
          if (valid) {
            addTaskData(this.taskForm).then(res => {
              this.taskModalVisible = false;
              if (res.success) {
                this.$Message.success("更新成功");
                this.getLogList();
                this.taskForm = {};
              }
            });
          }
        });
      } else {
        this.$refs.taskForm.validate(valid => {
          if (valid) {
            addTaskData(this.taskForm).then(res => {
              this.taskModalVisible = false;
              if (res.success) {
                this.$Message.success("操作成功");
                this.getLogList();
                this.taskForm = {};
              }
            });
          }
        });
      }
    },

    /**
     * 弹框取消按钮事件
     */
    handlecancel() {
      this.taskModalVisible = false;
      this.taskForm = {};
    },

    /**
     * 编辑事件
     */
    edit(v, e, name) {
      // 编辑
      if (name == "modify") {
        this.taskModalTitle = "修改定时任务";
        this.taskModalVisible = true;
        this.taskForm.jobStatus = false;
        // console.log(v);

        for (let key in v) {
          // console.log(v[key]);
          if (v[key]) {
            this.taskForm[key] = v[key];
          }
        }
      }
    },

    /**
     * 列表删除按钮事件
     */
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该条数据?",
        onOk: () => {
          this.operationLoading = true;
          deleteTaskData(v.id).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.getLogList();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.modalTree {
  height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>