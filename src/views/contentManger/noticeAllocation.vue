<!-- 公告配置 --->
<template>
  <div class="noticeallocation">
    <!-- 头部 -->
    <Row type="flex" justify="end">
      <div class="header" ref="header">
        <div class="export-btn">
          <Button
            type="primary"
            icon="md-add"
            @click="handleAdd"
            v-if="menuBtns.indexOf('content:contentNotice:add')>-1"
          >新增</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
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
        <template slot="status" slot-scope="{row}">
          <Tag :color="row.status=='ENABLE'?'green':'red'">{{row.status=="ENABLE"?"开启":"关闭"}}</Tag>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleEdit(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('content:contentNotice:update')>-1"
          >编辑</Button>
          <Button
            type="error"
            size="small"
            @click="handleDele(row,index)"
            v-if="menuBtns.indexOf('content:contentNotice:delete')>-1"
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
  </div>
</template>
<script>
import { addNotice, getNoticeList, deleteNotice, updateNotice } from "@/api";
import { dateFormat } from "@/utils/current";
//import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "noticeallocation",
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "编号", key: "id", align: "center", minWidth: 100 },
        {
          title: "公告名称",
          key: "title",
          align: "center",
          minWidth: 140
        },
        /* {
          title: "公告内容",
          key: "content",
          align: "center",
          width: 140
        }, */
        {
          title: "链接",
          key: "url",
          align: "center",
          minWidth: 180
        },
        {
          title: "创建时间",
          slot: "createdTime",
          align: "center",
          minWidth: 170
        },
        { title: "状态", slot: "status", align: "center", minWidth: 80 },
        { title: "排序", key: "sort", align: "center", minWidth: 100 },
        { title: "操作", slot: "action", align: "center", minWidth: 140 }
      ],
      data: [],
      loading: false,
      tableHeight: 0,
      pageNumber: 1,
      pageSize: 10,
      total: 0
    };
  },
  mounted() {
    this.init();
    this.getList();
  },
  filters: {
    formatTime(value) {
      return dateFormat(value); //格式：年-月-日 时:分:秒
      //return value.split("T")[0];//格式：年-月-日
    }
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
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 72;
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
    getList() {
      //获取列表数据
      let { pageNumber, pageSize } = this;
      getNoticeList({ pageNumber, pageSize }).then(res => {
        if (res.code === 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    handleAdd() {
      //新增按钮事件
      // console.log(this.$router);
      this.$router.push({
        name: "noticeAllocationAddEdit",
        query: {
          type: "add",
          id: "null"
        }
      });
    },
    handleEdit(row, index) {
      //行内编辑按钮事件
      this.$router.push({
        name: "noticeAllocationAddEdit",
        query: {
          type: "edit",
          id: row.id
        }
      });
    },
    handleDele(row, index) {
      //行内删除按钮事件
      // console.log(row, index);
      this.$Modal.confirm({
        title: "是否删除",
        content: "是否要删除此公告？",
        onOk: () => {
          deleteNotice(row.id).then(res => {
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
.noticeallocation {
  padding: 16px;
  .footer {
    margin-top: 2vh;
  }
}
</style>