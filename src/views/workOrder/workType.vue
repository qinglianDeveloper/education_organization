<!-- 工单类型设置 --->
<template>
  <div class="card">
    <!-- 按钮部分 -->
    <Row class="header" type="flex" justify="end">
      <div class="button-group" ref="header">
        <Button
          type="primary"
          class="add"
          @click="handleAdd"
          icon="md-add"
          v-if="menuBtns.indexOf('workorder:workOrderType:add')>-1"
        >新增</Button>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 表格部分 -->
    <Row class="table">
      <Table
        border
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        :height="tableHeight"
      >
        <template slot="action" slot-scope="{ row, index }">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="handleEdit(row,index)"
            v-if="menuBtns.indexOf('workorder:workOrderType:update')>-1"
          >编辑</Button>
          <Button
            type="error"
            size="small"
            @click="handleDel(row,index)"
            v-if="menuBtns.indexOf('workorder:workOrderType:delete')>-1"
          >删除</Button>
        </template>
      </Table>
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
    <!-- 新增工单类型弹框 -->
    <Modal
      :title="taskModalTitle"
      v-model="taskModalVisible"
      :mask-closable="false"
      :width="600"
      :styles="{top: '200px'}"
    >
      <Form ref="taskForm" :model="taskForm" :label-width="70" :rules="taskFormValidate">
        <FormItem label="工单类型：" prop="typeName" :label-width="100">
          <Input v-model="taskForm.typeName" placeholder="请输工单类型" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="taskModalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitTask">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getWorkType,
  addWorkType,
  updateWorkType,
  removeWorkType
} from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "work-type",
  data() {
    return {
      /* 标题内容 */
      columns: [
        { type: "selection", align: "center", width: 60, fixed: "left" },
        { title: "编号", key: "typeNum", minWidth: 100, align: "center" },
        {
          title: "工单类型名称",
          key: "typeName",
          minWidth: 100,
          align: "center"
        },
        {
          title: "创建时间",
          key: "createdTime",
          minWidth: 100,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 240
        }
      ],
      data: [],
      loading: true,
      tableHeight: 0,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      taskModalTitle: "", //新增修改弹框标题
      taskModalVisible: false, //弹框是否显示
      submitLoading: false,
      taskForm: {},
      /* 弹出框校验规则 */
      taskFormValidate: {
        typeName: [
          { required: true, message: "请填写工单类型", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getWorkType();
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
    },
    /**
     * 获取类型列表数据
     */
    getWorkType() {
      getWorkType(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
              // console.log(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.total = res.result.totalElements;
          this.loading = false;
        }
      });
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
      this.tableHeight = pageHeight - headerHeight - footerHeight - 73;
      // console.log(this.tableHeight);
    },

    /**
     * 新增工单类型
     */
    handleAdd() {
      this.taskModalVisible = true;
      this.taskModalTitle = "新增工单类型";
    },
    /**
     * 弹框确定按钮
     */
    handelSubmitTask() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.taskForm.id) {
            updateWorkType(this.taskForm).then(res => {
              // console.log(res);
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.getWorkType();
                this.taskModalVisible = false;
                this.taskForm = {};
              } else {
                this.$Message.error(res.message);
              }
            });
          } else {
            addWorkType(this.taskForm).then(res => {
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.getWorkType();
                this.taskModalVisible = false;
                this.taskForm = {};
              } else {
                this.$Message.error(res.message);
              }
              this.taskForm = {};
            });
          }
          // this.taskModalVisible = false;
        } else {
          this.$Message.error("请按要求输入工单类型！");
        }
      });
    },

    /**
     * 编辑
     */
    handleEdit(row, index) {
      // console.log(row);
      this.taskModalVisible = true;
      this.taskModalTitle = "编辑工单类型";
      this.taskForm = row;
      // this.taskForm=this.data[index]
    },
    /**
     * 删除
     */
    handleDel(row, index) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该条数据?",
        onOk: () => {
          removeWorkType({ id: row.id }).then(res => {
            console.log(res);
            this.$Message.success(res.message);
            this.getWorkType();
          });
        }
      });
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getWorkType();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getWorkType();
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  padding: 16px;
  .footer {
    margin-top: 2vh;
  }
}
</style>