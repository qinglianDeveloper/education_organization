<!-- 文章分类 --->
<template>
  <div class="article-type">
    <!-- 头部 -->
    <Row type="flex" justify="end">
      <div class="header" ref="header">
        <div class="export-btn">
          <Button
            type="primary"
            icon="md-add"
            @click="handleAdd"
            v-if="menuBtns.indexOf('helpcenter:articleClassify:add')>-1"
          >新增</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="分类名称" :label-width="80">
            <Input type="text" placeholder="请输入分类名称" v-model="searchForm.classifyName" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSearch">搜索</Button>
          </FormItem>
        </Form>
      </div>
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
        class="content"
      >
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleEdit(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('helpcenter:articleClassify:update')>-1"
          >编辑</Button>
          <Button
            type="error"
            size="small"
            @click="handleDele(row,index)"
            v-if="menuBtns.indexOf('helpcenter:articleClassify:delete')>-1"
          >删除</Button>
        </template>
      </Table>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="pageNumber"
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
      <Form
        :label-width="94"
        style="padding:0 16px"
        :model="typeForm"
        :rules="typeRules"
        ref="typeForm"
      >
        <FormItem label="分类名称：" prop="classifyName">
          <Input v-model="typeForm.classifyName" />
        </FormItem>
        <FormItem label="排序：" prop="sort">
          <Input v-model="typeForm.sort" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit('typeForm')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  addHelpClassifyArticle,
  getHelpClassifyListSearch,
  deleteHelpClassify,
  updateHelpClassify
} from "@/api";
import { mapState } from "vuex";
export default {
  name: "article-type",
  data() {
    return {
      loading: false,
      tableHeight: 0,
      searchForm: {
        classifyName: ""
      },
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "编号", key: "id", align: "center", minWidth: 100 },
        {
          title: "分类名称",
          key: "classifyName",
          align: "center",
          minWidth: 100
        },
        {
          title: "排序",
          key: "sort",
          align: "center",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 140,
          fixed: "right"
        }
      ],
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      modalTitle: "",
      modalVisible: false,
      typeForm: {
        classifyName: "",
        sort: ""
      },
      typeRules: {
        classifyName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.init();
    this.getList();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  filters: {
    formatTime(value) {
      //return dateFormat(value);//格式：年-月-日 时:分:秒
      return value.split("T")[0]; //格式：年-月-日
    }
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
      let headerHeight = this.$refs.header.clientHeight;
      let searchHeight = this.$refs.search.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight =
        pageHeight - headerHeight - searchHeight - footerHeight - 83;
      // console.log(this.tableHeight);
    },
    changePage(e) {
      //页码
      this.pageNumber = e;
      this.getList();
    },
    changePageSize(e) {
      //页数
      this.pageSize = e;
      this.getList();
    },
    handleSearch() {
      //搜索
      this.pageNumber = 1;
      this.getList();
    },
    getList() {
      //获取列表数据
      let { pageNumber, pageSize } = this;
      let { classifyName } = this.searchForm;
      getHelpClassifyListSearch({ pageNumber, pageSize, classifyName }).then(
        res => {
          if (res.code === 200) {
            this.data = res.result.content;
            this.total = res.result.totalElements;
          } else {
            this.$Message.error(res.message);
          }
        }
      );
    },
    handleAdd() {
      //console.log("新增");
      this.modalVisible = true;
      this.modalTitle = "新增分类";
      this.resetForm();
    },
    handleEdit(row, index) {
      //行内编辑按钮事件
      //console.log(row, index);
      this.resetForm();
      this.modalVisible = true;
      this.modalTitle = "编辑分类";
      let { id, classifyName, sort } = row;
      this.typeForm = { id, classifyName, sort };
    },
    handleSubmit() {
      // 弹框确定按钮
      //console.log(JSON.stringify(this.typeForm));
      let { modalTitle } = this;
      this.$refs["typeForm"].validate(valid => {
        if (valid) {
          if (modalTitle.indexOf("编辑") > -1) {
            this.updatePartner();
          } else {
            this.addSubmitData();
          }
        }
      });
    },
    addSubmitData() {
      //提交数据
      let { classifyName, sort } = this.typeForm;
      addHelpClassifyArticle({ classifyName, sort }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.modalVisible = false;
          this.getList();
          //新增成功后重置数据
          this.resetForm();
        }
      });
    },
    updatePartner() {
      //修改分类
      let { id, classifyName, sort } = this.typeForm;
      status = status ? "ENABLE" : "DISABLE";
      updateHelpClassify({ id, classifyName, sort }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.modalVisible = false;
          this.getList();
        }
      });
    },
    resetForm() {
      //重置表单
      this.$refs["typeForm"].resetFields();
      /* this.typeForm = {
        title:'',
        image:'',
        url:'',
        status:true,//状态(有效:ENABLE,无效:DISABLE)
        sort:'',
      }; */
    },
    handleDele(row, index) {
      //行内删除按钮事件
      console.log(row, index);
      this.$Modal.confirm({
        title: "是否删除",
        content: "是否要删除此分类？",
        onOk: () => {
          deleteHelpClassify({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.getList();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.article-type {
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
  .footer {
    margin-top: 2vh;
  }
}
</style>