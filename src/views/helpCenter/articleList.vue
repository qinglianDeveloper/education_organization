<!-- 文章列表 --->
<template>
  <div class="article-list">
    <!-- 头部 -->
    <Row type="flex" justify="end">
      <div class="header" ref="header">
        <div class="export-btn">
          <Button
            type="primary"
            icon="md-add"
            @click="handleAdd"
            v-if="menuBtns.indexOf('helpcenter:article:add')>-1"
          >新增</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="标题" :label-width="60">
            <Input type="text" placeholder="请输入标题" v-model="searchForm.articleTitle" />
          </FormItem>
          <FormItem label="分类" :label-width="60">
            <Select v-model="searchForm.classifyId" style="width:200px">
              <Option
                v-for="item in classifyArr"
                :value="item.id"
                :key="item.id"
              >{{ item.classifyName }}</Option>
            </Select>
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
        <template slot="createdTime" slot-scope="{row}">
          <span>{{row.createdTime | formatTime}}</span>
        </template>
        <template slot="isShow" slot-scope="{row}">
          <Tag :color="row.status=='YES'?'green':'red'">{{row.isShow=="YES"?"是":"否"}}</Tag>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleEdit(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('helpcenter:article:update')>-1"
          >编辑</Button>
          <Button
            type="error"
            size="small"
            @click="handleDele(row,index)"
            v-if="menuBtns.indexOf('helpcenter:article:update')>-1"
          >删除</Button>
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
  </div>
</template>
<script>
import {
  addHelpArticle,
  getHelpArticleList,
  deleteHelpArticle,
  updateHelpArticle,
  getHelpArticleById,
  getHelpClassifyListAll
} from "@/api";
import { mapState } from "vuex";
import { dateFormat } from "@/utils/current";
export default {
  name: "article-list",
  data() {
    return {
      searchForm: {
        articleTitle: "",
        classifyId: ""
      },
      loading: false,
      tableHeight: 0,
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "编号", key: "id", align: "center", minWidth: 80 },
        {
          title: "分类",
          key: "classifyName",
          align: "center",
          minWidth: 100
        },
        {
          title: "标题",
          key: "articleTitle",
          align: "center",
          minWidth: 140,
          tooltip: true
        },
        {
          title: "是否在首页展示",
          slot: "isShow",
          align: "center",
          minWidth: 140
        },
        {
          title: "创建时间",
          slot: "createdTime",
          align: "center",
          minWidth: 170
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
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      classifyArr: []
    };
  },
  mounted() {
    this.init();
    this.getList();

    //分类
    getHelpClassifyListAll().then(res => {
      if (res.code === 200) {
        let obj = {
          classifyName: "全部",
          id: "全部"
        };
        res.result.unshift(obj);
        this.classifyArr = res.result;
      }
    });
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  filters: {
    formatTime(value) {
      return dateFormat(value); //格式：年-月-日 时:分:秒
      //return value.split("T")[0];//格式：年-月-日
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
    /**
     * 新增按钮事件
     */
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
      let { articleTitle, classifyId } = this.searchForm;
      classifyId = classifyId == "全部" ? "" : classifyId;
      getHelpArticleList({
        pageNumber,
        pageSize,
        articleTitle,
        classifyId
      }).then(res => {
        if (res.code === 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    handleAdd() {
      this.$router.push({
        name: "articleAddEdit",
        params: { type: "add", id: "null" }
      });
    },
    handleEdit(row, index) {
      console.log(row, index);
      this.$router.push({
        name: "articleAddEdit",
        params: { type: "edit", id: row.id }
      });
    },
    handleDele(row, index) {
      //行内删除按钮事件
      console.log(row, index);
      this.$Modal.confirm({
        title: "是否删除",
        content: "是否要删除此分类？",
        onOk: () => {
          deleteHelpArticle({ id: row.id }).then(res => {
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
.article-list {
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