    <!-- 商品二级分类 -->
<template>
  <div class="goods-two">
    <!-- 新增二级列表 -->
    <Row type="flex" justify="end">
      <div class="add-bt" ref="header">
        <Button @click="handleAddTwo" type="success" icon="md-add" style="margin-right:6px">新增二级</Button>
        <Button @click="handleClose" type="default">返回上一级</Button>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 内容部分 -->
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        ref="table"
        :loading="loading"
        :height="tableHeight"
      >
        <template slot="level" slot-scope="{ row }">
          <span>{{row.level==2?"二级":"一级"}}</span>
        </template>
        <template slot="action" slot-scope="{ row, index }">
          <div class="btn-group">
            <Button
              type="info"
              size="small"
              @click="handleEditTwo(row,index)"
              style="margin-right:6px"
            >编辑</Button>
            <Button type="error" size="small" @click="handleDeleTwo(row,index)">删除</Button>
          </div>
        </template>
      </Table>
    </Row>
    <!-- 分页部分 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="obj.pageNumber"
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
    <!-- 弹框部分 -->
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :styles="{top: '140px'}"
    >
      <Form :model="goodsClassify" :label-width="140" ref="goodsClassify" :rules="rules">
        <FormItem label="分类名称：" prop="categoryName">
          <Input v-model="goodsClassify.categoryName" style="width:240px"></Input>
        </FormItem>
        <FormItem label="排序：">
          <Input v-model="goodsClassify.sortOrder" style="width:240px"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit('goodsClassify')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getGoodsType, addTypes, updateTypes, removeTypes } from "@/api";
export default {
  name: "goods-two",
  data() {
    return {
      columns: [
        { title: "编号", key: "id", align: "center", minWidth: 100 },
        {
          title: "分类名称",
          key: "categoryName",
          align: "center",
          minWidth: 100
        },
        { title: "级别", slot: "level", align: "center", minWidth: 100 },
        { title: "排序", key: "sortOrder", align: "center", minWidth: 100 },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 140,
          fixed: "right"
        }
      ],
      data: [],
      loading: true,
      tableHeight: 0,
      obj: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      modalTitle: "",
      modalVisible: false,
      goodsClassify: {},
      rules: {
        categoryName: [
          { required: true, message: "分类名称必填", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    init() {
      this.getRouter();
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /**
     * 获取路由跳转的值
     */
    getRouter() {
      this.obj.parentId = this.$route.query.id;
      // console.log(this.obj);
      getGoodsType(this.obj).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.data = res.result.content;
          this.loading = false;
          this.total = res.result.totalElements;
        }
      });
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
      this.tableHeight = pageHeight - headerHeight - footerHeight - 73;
    },
    /**
     * 新增二级列表按钮
     */
    handleAddTwo() {
      this.goodsClassify = {};
      this.modalTitle = "新增二级分类";
      this.modalVisible = true;
    },
    /**
     * 返回上一级
     */
    handleClose() {
      this.$Modal.confirm({
        title: "确认返回",
        content: "您确认要离开?",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    },
    handleEditTwo(row, index) {
      this.modalTitle = "修改二级分类";
      this.modalVisible = true;
      this.goodsClassify = row;
    },
    handleDeleTwo(row, index) {
      // console.log(row, index);
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除这条商品分类吗？",
        onOk: () => {
          removeTypes(row.id).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.$Message.success("商品分类删除成功！");
              this.getRouter();
            }
          });
        },
        onCancel: () => {}
      });
    },
    /**
     * 弹框确定按钮
     */
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.goodsClassify.id) {
            let obj = this.goodsClassify;
            // console.log(obj);
            updateTypes(obj).then(res => {
              if (res.code == 200) {
                this.$Message.success("编辑成功!");
                this.modalVisible = false;
                this.goodsClassify = {};
                this.getRouter();
              } else {
                this.$Message.error("编辑失败!");
              }
            });
          } else {
            let obj = this.goodsClassify;
            // obj.level = 2;
            obj.parentId = this.obj.parentId;
            // console.log(obj);
            addTypes(obj).then(res => {
              if (res.code == 200) {
                this.$Message.success("新增成功!");
                this.modalVisible = false;
                this.goodsClassify = {};
                this.getRouter();
              } else {
                this.$Message.error("新增失败!");
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
      this.obj.pageNumber = v;
      this.getRouter();
      // this.clearSelectAll();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.obj.pageSize = v;
      this.getRouter();
    }
  }
};
</script>
<style lang="scss" scoped>
.goods-two {
  padding: 16px;
  .footer {
    margin-top: 2vh;
  }
}
</style>