<!-- 商品列表 -->
<template>
  <div class="goods-list">
    <!-- {{menuBtns}} -->
    <Card>
      <div ref="header">
        <!-- 按钮组 -->
        <div class="button-group">
          <Button
            type="success"
            class="add"
            @click="handleAdd"
            icon="md-add"
            v-if="menuBtns.indexOf('product:product:add')>-1"
          >新增</Button>
          <Button
            type="warning"
            class="export"
            @click="handleExport"
            icon="md-share-alt"
            :disabled="selectCount == 0"
          >导出</Button>
        </div>
        <!-- 搜索框 -->
        <div class="search">
          <Form :label-width="70" class="search-from" ref="searchForm" :model="searchForm">
            <FormItem label="商品编号" class="goods-number">
              <Input type="text" placeholder="请输入商品编号" v-model="searchForm.productCode" />
            </FormItem>
            <FormItem label="商品名称" class="goods-name">
              <Input type="text" placeholder="请输入商品名称" v-model="searchForm.productName" />
            </FormItem>
            <FormItem label="状态" class="goods-status">
              <Select v-model="searchForm.status" clearable style="width:100px">
                <!-- <Option value="ALL">全部</Option> -->
                <Option value="ENABLE">已上架</Option>
                <Option value="DISABLE">已下架</Option>
              </Select>
            </FormItem>
            <Form-item style="margin-left:-35px;" class="br">
              <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            </Form-item>
          </Form>
        </div>
      </div>
      <!-- 表格部分 -->
      <Row>
        <div class="table">
          <!-- 表格内容 -->
          <Table
            border
            ref="table"
            :columns="columns"
            :data="data"
            :loading="loading"
            :height="tableHeight"
            @on-selection-change="changeSelect"
          >
            <!-- 主图 -->
            <template slot-scope="{ row }" slot="mainImageUrl">
              <imageView :src="row.mainImageUrl" />
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
                v-if="menuBtns.indexOf('product:product:update')>-1"
              >编辑</Button>
              <Button
                type="warning"
                size="small"
                style="margin-right: 5px"
                @click="handleShow(row,index)"
                v-if="menuBtns.indexOf('product:product:info')>-1"
              >查看</Button>
              <Button
                :type="row.status=='ENABLE'?'default':'success'"
                size="small"
                style="margin-right: 5px"
                @click="changeStatus(row,index)"
                v-if="menuBtns.indexOf('product:product:update')>-1"
              >{{row.status=="ENABLE"?"下架":"上架"}}</Button>
              <Button
                type="error"
                size="small"
                @click="handleDel(row,index)"
                v-if="menuBtns.indexOf('product:product:delete')>-1"
              >删除</Button>
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
    </Card>

    <!-- 删除按钮弹框 -->
    <!-- <Modal v-model="taskStatus" title="确认删除" @on-ok="ok" @on-cancel="cancel">
      <p>您确认要删除该条数据</p>
    </Modal>-->
  </div>
</template>
<script>
import { getGoodsList, changeStatus, deleteGoods } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
import imageView from "@/components/imageView"; //图片放大
export default {
  components: { imageView },
  data() {
    return {
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        {
          title: "商品编号",
          key: "productCode",
          minWidth: 200,
          align: "center"
        },
        {
          title: "商品主图",
          slot: "mainImageUrl",
          minWidth: 100,
          align: "center"
        },
        { title: "分类", key: "categoryName", minWidth: 120, align: "center" },
        { title: "商品名称", key: "productName", minWidth: 200 },
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
      value: 0,
      tableHeight: 0, //表格高度
      column_status: "",
      total: 0,
      selectCount: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  mounted() {
    this.pageHeight();
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
    /**
     * 列表数据请求
     */
    getGoodsList() {
      // if (!searchForm) {
      //   searchForm = this.searchForm;
      // }
      getGoodsList(this.searchForm).then(res => {
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
     * 新增按钮事件
     */
    handleAdd() {
      this.$router.push("/goodsAdd");
    },

    /**
     * 导出按钮事件
     */
    handleExport() {
      // console.log("导出");
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
     * 搜索按钮事件
     */
    handleSearch() {
      // console.log(this.searchForm);
      this.getGoodsList();
    },

    /**
     * 编辑按钮事件
     */
    handleEdit(row, index) {
      // console.log("编辑：", row, index);
      this.$router.push({
        name: "updateGoods",
        query: {
          type: "updateGoods",
          id: row.id
        }
      });
    },

    /**
     * 查看按钮事件
     */
    handleShow(row, index) {
      // console.log("查看：", row, index);
      // console.log(row);
      this.$router.push({
        name: "goodsDetails",
        query: {
          id: row.id
        }
      });
    },

    /**
     * 上架按钮事件
     */
    changeStatus(row, index) {
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
          changeStatus(obj).then(res => {
            if (res.code == 200) {
            }
          });
        }
      });
    },

    /**
     * 删除按钮事件
     */
    handleDel(row, index) {
      // console.log(row);
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该条数据?",
        onOk: () => {
          this.operationLoading = true;
          deleteGoods(row.id).then(res => {
            if (res.code == 200) {
              this.$Message.success("删除成功");
              this.getGoodsList();
            }
          });
        }
      });
    },

    /**
     * 删除弹框-确认
     */
    ok() {
      this.$Message.success("删除成功");
    },

    /**
     * 删除弹框-删除
     */
    cancel() {
      this.taskStatus = false;
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getGoodsList();
      // this.clearSelectAll();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getGoodsList();
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
      this.tableHeight = pageHeight - headerHeight - footerHeight - 60;
    },

    /**
     * 表格框选择事件
     */
    changeSelect(e) {
      // console.log(e);
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
    }
  }
};
</script>
<style lang="scss" scoped>
.goods-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  .button-group {
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .add {
      margin-right: 14px;
    }
  }
  .search {
    height: 60px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    margin: 10px 0;
    .search-from {
      display: flex;
      .goods-number,
      .goods-name,
      .goods-status,
      .br {
        margin: 13px 0;
        margin-left: 16px;
      }
    }
  }
  .table {
    min-width: 770px;
    // min-height: 640px;
    .ivu-form-item-content {
      display: flex;
    }
  }
  .footer {
    // display: flex;
    // justify-content: flex-end;
    // margin-top: 15px;
    margin-top: 2vh;
  }
}
</style>