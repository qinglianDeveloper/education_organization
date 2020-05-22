<!-- 商品分类 --->
<template>
  <div class="goods-classify">
    <!-- 新增一级列表 -->
    <Row type="flex" justify="end">
      <div class="add-bt" ref="header">
        <Button
          @click="handleAddOne"
          type="success"
          icon="md-add"
          v-if="menuBtns.indexOf('product:category:add')>-1"
        >新增一级</Button>
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
          <span>{{row.level==1?"一级":"二级"}}</span>
        </template>
        <template slot="action" slot-scope="{ row, index }">
          <div class="btn-group">
            <Button
              type="info"
              size="small"
              @click="handleEditOne(row,index)"
              v-if="menuBtns.indexOf('product:category:update')>-1"
            >编辑</Button>
            <!-- <Button type="primary" size="small" @click="handleAddTwo(row,index)">新增二级</Button> -->
            <Button type="primary" size="small" @click="handleShowTwo(row,index)">查看下级</Button>
            <Button
              type="error"
              size="small"
              @click="handleDeleOne(row,index)"
              v-if="menuBtns.indexOf('product:category:delete')>-1"
            >删除</Button>
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
import { mapState } from "vuex";
export default {
  name: "goods-classify",
  data() {
    return {
      columns: [
        {
          type: "selection",
          align: "center",
          width: 60,
          fixed: "left"
        },
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
          minWidth: 220,
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
  created() {
    this.getGoodsClassify();
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
     * 获取数据
     */
    getGoodsClassify() {
      this.obj.level = 1;
      getGoodsType(this.obj).then(res => {
        if (res.code == 200) {
          console.log(res);
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
      let pageHeight = document.getElementsByClassName("single-page")[0]
        .clientHeight;
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      // console.log(headerHeight, footerHeight);
      this.tableHeight = pageHeight - headerHeight - footerHeight - 73;
    },

    /**
     * 新增一级
     */
    handleAddOne() {
      this.goodsClassify = {};
      this.modalTitle = "新增一级分类";
      this.modalVisible = true;
    },
    /**
     * 编辑一级
     */
    handleEditOne(row, index) {
      this.modalTitle = "修改一级分类";
      this.modalVisible = true;
      this.goodsClassify = row;
    },
    /**
     * 查看二级
     */
    handleShowTwo(row, index) {
      // console.log(row);
      this.$router.push({ name: "goodsTwo", query: { id: row.id } });
    },
    /**
     * 删除一级
     */
    handleDeleOne(row, index) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除这条商品分类吗？",
        onOk: () => {
          removeTypes(row.id).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("商品分类删除成功！");
              this.getGoodsClassify();
            }
          });
        },
        onCancel: () => {}
      });
      // console.log(row, index);
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
              console.log(res);
              if (res.code == 200) {
                this.$Message.success("编辑成功!");
                this.modalVisible = false;
                this.goodsClassify = {};
                this.getGoodsClassify();
              } else {
                this.$Message.error("编辑失败!");
              }
            });
          } else {
            let obj = this.goodsClassify;
            obj.parentId = 1;
            console.log(obj);
            addTypes(obj).then(res => {
              if (res.code == 200) {
                this.$Message.success("新增成功!");
                this.modalVisible = false;
                this.goodsClassify = {};
                this.getGoodsClassify();
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
      this.getGoodsClassify();
      // this.clearSelectAll();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.obj.pageSize = v;
      this.getGoodsClassify();
    }
  }
};
</script>
<style lang="scss" scoped>
.goods-classify {
  padding: 16px;
  .btn-group {
    button {
      margin-right: 6px;
    }
    button:last-child {
      margin-right: 0;
    }
  }
  .footer {
    margin-top: 2vh;
  }
}
</style>
