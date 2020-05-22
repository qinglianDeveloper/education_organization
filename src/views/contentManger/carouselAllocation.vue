<!-- 轮播图配置 --->
<template>
  <div class="carousel-allocation">
    <!-- 头部 -->
    <Row type="flex" justify="end">
      <div class="header" ref="header">
        <div class="export-btn">
          <Button
            type="primary"
            icon="md-add"
            @click="handleAdd"
            v-if="menuBtns.indexOf('content:contentBanner:add')>-1"
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
        <template slot="image" slot-scope="{row}">
          <imageView :src="row.image" />
        </template>
        <template slot="contentImage" slot-scope="{row}">
          <imageView v-if="row.linkUrl" :src="row.linkUrl" />
          <div v-else>-</div>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleEdit(row,index)"
            style="margin-right:6px"
            v-if="menuBtns.indexOf('content:contentBanner:update')>-1"
          >编辑</Button>
          <Button
            type="error"
            size="small"
            @click="handleDele(row,index)"
            v-if="menuBtns.indexOf('content:contentBanner:delete')>-1"
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
      :styles="{top: '140px',width:'700px'}"
    >
      <Form
        ref="form"
        :label-width="100"
        style="padding:0 20px"
        :rules="carouselRules"
        :model="carouselForm"
      >
        <FormItem label="名称：" prop="title">
          <Input v-model="carouselForm.title" />
        </FormItem>
        <FormItem label="图片：" prop="image">
          <uploadImage
            ref="uploadImage"
            :imgNum="5"
            :data="carouselForm.image"
            @success="uploadSuccess"
          />
        </FormItem>
        <!-- <FormItem label="跳转链接：" prop="url">
          <Input v-model="carouselForm.url" />
        </FormItem>-->
        <FormItem label="内容图片：" prop="linkUrl">
          <uploadImage
            ref="uploadImage"
            :imgNum="1"
            :data="carouselForm.linkUrl"
            @success="linkUrlSuccess"
          />
        </FormItem>
        <FormItem label="状态：" prop="status">
          <i-switch size="large" v-model="carouselForm.status" @on-change="changeSwitch">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="排序：" prop="sort">
          <Input v-model="carouselForm.sort" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import imageView from "@/components/imageView";
import uploadImage from "@/components/uploadImage";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
import { addBanner, getBannerList, deleteBanner, updateBanner } from "@/api";
export default {
  name: "carousel-allocation",
  components: { imageView, uploadImage },
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "编号", key: "id", align: "center", minWidth: 100 },
        { title: "名称", key: "title", align: "center", minWidth: 140 },
        { title: "图片", slot: "image", align: "center", width: 100 },
        {
          title: "内容图片",
          slot: "contentImage",
          align: "center",
          width: 130
        },
        // { title: "跳转链接", key: "", align: "center", minWidth: 100 },
        {
          title: "创建时间",
          slot: "createdTime",
          align: "center",
          minWidth: 170
        },
        { title: "状态", slot: "status", align: "center", minWidth: 80 },
        { title: "排序", key: "sort", align: "center", minWidth: 100 },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 140,
          fixed: "right"
        }
      ],
      data: [],
      loading: false,
      tableHeight: 0,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      modalTitle: "",
      modalVisible: false,
      carouselRules: {
        title: [
          { required: true, message: "轮播图名称不能为空", trigger: "blur" }
        ],
        image: [
          { required: true, message: "轮播图图片不能为空", trigger: "blur" }
        ]
        // status: [
        //   { required: true, message: "轮播图状态不能为空", trigger: "blur" }
        // ]
      },
      carouselForm: {
        title: "",
        image: "",
        url: "",
        status: true, //状态(有效:ENABLE,无效:DISABLE)
        sort: "",
        linkUrl: ""
      }
      //isStatus: true
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
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  filters: {
    formatTime(value) {
      return dateFormat(value); //格式：年-月-日 时:分:秒
      //return value.split("T")[0];//格式：年-月-日
    }
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
      this.tableHeight = pageHeight - headerHeight - footerHeight - 80;
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
      getBannerList({ pageNumber, pageSize }).then(res => {
        if (res.code === 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    changeSwitch(v) {
      //改变状态按钮事件
      this.carouselForm.status = v;
    },
    handleAdd() {
      //console.log("新增");
      this.modalVisible = true;
      this.modalTitle = "新增轮播图";
      this.resetForm();
    },
    handleEdit(row, index) {
      //行内编辑按钮事件
      //console.log(row, index);
      this.resetForm();

      this.modalVisible = true;
      this.modalTitle = "编辑轮播图";
      let { id, title, status, image, url, sort, linkUrl } = row;
      status = status === "ENABLE" ? true : false;
      this.carouselForm = { id, title, status, image, url, sort, linkUrl };
    },
    handleSubmit() {
      // 弹框确定按钮
      //console.log(JSON.stringify(this.carouselForm));
      let { modalTitle } = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (modalTitle.indexOf("编辑") > -1) {
            this.updateBanner();
          } else {
            this.addSubmitData();
          }
        }
      });
    },
    addSubmitData() {
      //提交数据
      let { title, status, image, url, sort, linkUrl } = this.carouselForm;
      status = status ? "ENABLE" : "DISABLE";
      addBanner({ title, status, image, url, sort, linkUrl }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.modalVisible = false;
          this.getList();
          //新增成功后重置数据
          this.resetForm();
        }
      });
    },
    updateBanner() {
      //修改轮播图
      let { id, title, status, image, url, sort, linkUrl } = this.carouselForm;
      status = status ? "ENABLE" : "DISABLE";
      updateBanner({ id, title, status, image, url, sort, linkUrl }).then(
        res => {
          if (res.code === 200) {
            this.$Message.success(res.message);
            this.modalVisible = false;
            this.getList();
          }
        }
      );
    },
    resetForm() {
      //重置表单
      this.$refs["form"].resetFields();
      /* this.carouselForm = {
        title:'',
        image:'',
        url:'',
        status:true,//状态(有效:ENABLE,无效:DISABLE)
        sort:'',
      }; */
    },
    handleDele(row, index) {
      //行内删除按钮事件
      // console.log(row, index);
      this.$Modal.confirm({
        title: "是否删除",
        content: "是否要删除此轮播图？",
        onOk: () => {
          deleteBanner(row.id).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.getList();
            }
          });
        }
      });
    },
    uploadSuccess(e) {
      //上传图片
      //console.log('上传图片：',e);
      this.carouselForm.image = e;
    },
    linkUrlSuccess(e) {
      //上传图片
      //console.log('上传图片：',e);
      this.carouselForm.linkUrl = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.carousel-allocation {
  padding: 16px;
  height: 100%;
  // overflow: auto;
  .photo {
    width: 104px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 104px;
      height: 60px;
    }
  }
  .footer {
    margin-top: 2vh;
  }
}
</style>
