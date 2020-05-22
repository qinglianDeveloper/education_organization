<!-- 积分商品管理 -->
<template>
  <div class="integral-goods">
    <!-- 头部 -->
    <Row type="flex" justify="end">
      <div class="header" ref="header">
        <div class="export-btn">
          <Button
            type="primary"
            icon="md-add"
            @click="handleAdd"
            v-if="menuBtns.indexOf('product:credit:add')>-1"
          >新增</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="商品编号" :label-width="80">
            <Input type="text" placeholder="请输入商品编号" v-model="searchForm.productNo" />
          </FormItem>
          <FormItem label="商品名称" :label-width="80">
            <Input type="text" placeholder="请输入商品名称" v-model="searchForm.productName" />
          </FormItem>
          <FormItem label="状态" :label-width="60">
            <Select v-model="searchForm.status" clearable style="width:100px">
              <!-- <Option value="ALL">全部</Option> -->
              <Option value="ENABLE">已上架</Option>
              <Option value="DISABLE">已下架</Option>
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
        <!-- 主图 -->
        <template slot-scope="{row}" slot="mainPicUrl">
          <!-- <span>{{row.mainImageUrl}}</span> -->
          <imageView :src="row.mainPicUrl" />
          <!-- <div class="picture" style="height:80px">
            <img :src="row.mainPicUrl" style="width:100%" />
          </div>-->
        </template>

        <!-- 状态 -->
        <template slot-scope="{row}" slot="status">
          <Tag :color="row.status=='ENABLE'?'green':'red'">{{row.status=="ENABLE"?"已上架":"已下架"}}</Tag>
        </template>

        <!-- 操作按钮 -->
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="handleEdit(row,index)"
            :disabled="disabledEdit(row.status)"
            v-if="menuBtns.indexOf('product:credit:update')>-1"
          >编辑</Button>
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="handleShow(row,index)"
            v-if="menuBtns.indexOf('product:credit:info')>-1"
          >查看</Button>
          <Button
            :type="row.status=='ENABLE'?'default':'success'"
            size="small"
            style="margin-right: 5px"
            @click="changeStatus(row,index)"
            v-if="menuBtns.indexOf('product:credit:update')>-1"
          >{{row.status=="ENABLE"?"下架":"上架"}}</Button>
          <Button
            type="error"
            size="small"
            @click="handleDel(row,index)"
            v-if="menuBtns.indexOf('product:credit:delete')>-1"
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
  </div>
</template>
<script>
import { getCreditList, creditChangeStatus, creditDelete } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
import imageView from "@/components/imageView"; //图片放大
export default {
  name: "integral-goods",
  components: { imageView },
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        {
          title: "商品编号",
          key: "productNo",
          minWidth: 200,
          align: "center"
        },
        {
          title: "商品主图",
          slot: "mainPicUrl",
          minWidth: 100,
          align: "center"
        },
        { title: "商品名称", key: "productName", minWidth: 200 },
        {
          title: "积分",
          key: "credit",
          minWidth: 100,
          align: "center"
        },
        { title: "状态", slot: "status", minWidth: 100, align: "center" },
        { title: "创建时间", key: "createdTime", minWidth: 170 },
        { title: "最后修改时间", key: "updateTime", minWidth: 170 },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 240
        }
      ],
      data: [],
      loading: true,
      tableHeight: 0,
      total: 0
    };
  },
  created() {
    this.getCreditList();
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
    /* 商品编辑按钮状态 */
    disabledEdit(status) {
      // console.log(status);
      if (status == "ENABLE") {
        return true;
      } else if (status == "DISABLE") {
        return false;
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
     * 获取列表内容
     */
    getCreditList() {
      // console.log(this.searchForm);
      getCreditList(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.loading = false;
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
              // console.log(item.createdTime);
            }
            if (item.updateTime) {
              item.updateTime = dateFormat(item.updateTime);
              // console.log(item.updateTime);
            }
          });
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },

    /**
     * 新增按钮点击事件
     */
    handleAdd() {
      this.$router.push({ name: "integralAdd", query: { id: "add" } });
    },
    /**
     * 搜索按钮点击事件
     */
    handleSearch() {
      this.getCreditList();
    },
    /**
     * 行内按钮事件
     */
    handleEdit(row, index) {
      // console.log(row);
      this.$router.push({
        name: "integralAdd",
        query: { id: row.id }
      });
    },
    handleShow(row, index) {
      this.$router.push({
        name: "integralShow",
        query: { id: row.id }
      });
    },
    changeStatus(row, index) {
      // console.log(row, index);
      this.$Modal.confirm({
        title: row.status == "ENABLE" ? "确认下架" : "确认上架",
        content:
          row.status == "ENABLE" ? "您确认要下架商品?" : "您确认上架商品?",
        onOk: () => {
          // console.log("上架：", row, index);
          // console.log(row);
          if (row.status == "ENABLE") {
            row.status = "DISABLE";
          } else if (row.status == "DISABLE") {
            row.status = "ENABLE";
          }
          let obj = {};
          obj.productId = row.id;
          obj.status = row.status;
          // console.log(row);
          this.$Message.success(
            obj.status == "ENABLE" ? "上架成功" : "下架成功"
          );
          creditChangeStatus(obj).then(res => {
            if (res.code == 200) {
            }
          });
        }
      });
    },
    handleDel(row, index) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该条数据?",
        onOk: () => {
          this.operationLoading = true;
          creditDelete(row.id).then(res => {
            if (res.code == 200) {
              this.getCreditList();
              this.$Message.success("删除成功");
            }
          });
        }
      });
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getCreditList();
      // this.clearSelectAll();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getCreditList();
    }
  }
};
</script>
<style lang="scss" scoped>
.integral-goods {
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