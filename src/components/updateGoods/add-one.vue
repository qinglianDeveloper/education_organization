<!-- 步骤一 -->
<template>
  <div>
    <Form ref="productDetailVO" :model="goods" :rules="rules" :label-width="150">
      <!-- 商品名称 -->
      <FormItem label="商品名称：" prop="productName" style="width:600px">
        <Input type="text" v-model="goods.productName"></Input>
      </FormItem>
      <!-- 主图 -->
      <FormItem label="主图：" prop="mainImageUrl">
        <uploadImage
          ref="mainImageUrl"
          :imgNum="1"
          :data="goods.mainImageUrl"
          @success="uploadSuccess"
        />
        <!-- 上传的图片及查看删除
        <div class="demo-upload-list" v-for="(item,index) in mainImageUrl" :key="index">
          <img :src="item" />
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove('main',index)"></Icon>
          </div>
        </div>
        上传按钮
        <Upload
          v-model="goods.mainImageUrl"
          ref="upload"
          v-show="mainImageUrl[0]?false:true"
          :show-upload-list="false"
          :on-success="mainSuccess"
          :format="['jpg','jpeg','png']"
          accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="mainBefore"
          type="drag"
          :action="uploadAction"
          :data="mainData"
          style="display: inline-block;width:80px;"
        >
          <div style="width: 80px;height:80px;line-height: 80px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>-->
      </FormItem>
      <!-- 轮播图 -->
      <FormItem label="轮播图：" prop="bannerUrls">
        <uploadImage
          ref="mainImageUrl"
          :imgNum="5"
          :data="goods.bannerUrls"
          @success="uploadBannerSuccess"
        />
        <!-- 上传的图片及查看删除
        <div class="demo-upload-list" v-for="(item,index) in bannerUrls " :key="index">
          <template>
            <img :src="item" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('carousel',index)"></Icon>
            </div>
          </template>
        </div>
        上传按钮
        <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="carouselSuccess"
          :format="['jpg','jpeg','png']"
          accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"
          :max-size="2048"
          multiple
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          type="drag"
          :action="uploadAction"
          :data="pictureList"
          style="display: inline-block;width:80px;"
        >
          <div style="width: 80px;height:80px;line-height: 80px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
        大图弹框
        <Modal title="Image" v-model="visible">
          <div style="text-align:center">
            <img :src="showUrl" v-if="visible" style="width:100%" />
          </div>
        </Modal>-->
      </FormItem>
      <!-- 商品分类 -->
      <FormItem label="商品分类：" prop="categoryId" style="width:600px">
        <!-- <Input type="text" v-model="goods.categoryId"></Input> -->
        <div style="display:flex;">
          <Select v-model="goods.categoryId" placeholder="请选择分类">
            <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.categoryName}}</Option>
          </Select>
          <Tooltip placement="top">
              <Icon type="ios-alert-outline" style="color:#ffad33;font-size:20px;margin-left:6px;"/>
              <div slot="content">
                  注意：小程序的分类页面只显示<br/>一级类目的商品
              </div>
          </Tooltip>
        </div>
      </FormItem>
      <!-- 副标题 -->
      <FormItem label="副标题：" prop="subTitle" style="width:600px">
        <Input type="text" v-model="goods.subTitle"></Input>
      </FormItem>
      <!-- 积分返佣比例 -->
      <FormItem label="积分返佣比例：" prop="creditRakebackRatio" style="width:600px">
        <InputNumber v-model="goods.creditRakebackRatio" placeholder="用于设置消费金额返佣比例"></InputNumber>
      </FormItem>
      <!-- 返佣比例 -->
      <FormItem label="返佣比例：" prop="cashRakebackRatio" style="width:600px">
        <Input :min="0" v-model="goods.cashRakebackRatio" placeholder="请设置返佣比例"></Input>
      </FormItem>
      <!-- 库存 -->
      <FormItem label="库存：" prop="stock">
        <InputNumber :min="0" v-model="goods.stock"></InputNumber>
      </FormItem>
      <!-- 是否生成工单 -->
      <FormItem label="是否生成工单" prop="isAutoWorkorder">
        <RadioGroup v-model="goods.isAutoWorkorder">
          <Radio label="1" style="margin-right:20px">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <!-- 是否展示在首页 -->
      <FormItem label="是否展示在首页" prop="isShowHome">
        <RadioGroup v-model="goods.isShowHome">
          <Radio label="1" style="margin-right:20px">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <!-- 是否上架 -->
      <!-- <FormItem label="是否上架" prop="status">
        <RadioGroup v-model="goods.status">
          <Radio label="ENABLE" style="margin-right:20px">是</Radio>
          <Radio label="DISABLE">否</Radio>
        </RadioGroup>
      </FormItem>-->
      <!-- 商品排序 -->
      <FormItem label="商品排序：" prop="sort">
        <InputNumber :min="0" v-model="goods.sort"></InputNumber>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { uploadAction, getGoodsType } from "@/api";
import uploadImage from "@/components/uploadImage"; //上传图片组件
import config from "@/config";
export default {
  props: { goods: Object },
  components: { uploadImage },
  data() {
    return {
      formValidate: {},
      mainImageUrl: [],
      mainData: { title: "main" },
      pictureList: { title: "banner" },
      mainName: "",
      bannerUrls: [],
      listName: [],
      visible: false,
      showUrl: "",
      uploadAction: "",
      carouselName: "",
      rules: {
        productName: [
          { required: true, message: "请填写商品名称", trigger: "blur" }
        ],
        mainImageUrl: [
          { required: true, message: "请上传商品主图", trigger: "blur" }
        ],
        bannerUrls: [
          { required: true, message: "请上传商品轮播图", trigger: "blur" }
        ],
        categoryId: [
          {
            required: true,
            message: "请选择分类",
            trigger: "blur",
            type: "number"
            // 校验的是Value的值是number属性
          }
        ],
        subTitle: [
          { required: true, message: "请填写商品副标题", trigger: "blur" }
        ],
        creditRakebackRatio: [
          {
            required: true,
            message: "请输入积分返佣比列",
            trigger: "blur",
            type: "number"
          }
        ],
        cashRakebackRatio: [
          { required: true, message: "请输入返佣比例", trigger: "blur", type: "number" }
        ],
        stock: [
          {
            required: true,
            message: "请输入商品库存",
            trigger: "blur",
            type: "number"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择是否上架",
            trigger: "blur"
          }
        ],
        isAutoWorkorder: [
          {
            required: true,
            message: "请选择是否生成工单",
            trigger: "blur"
          }
        ],
        isShowHome: [
          {
            required: true,
            message: "请选择是否在首页显示",
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      // headers: { Authorization: "session" }
      typeList: []
    };
  },
  created() {
    this.uploadAction = config.uploadAction;
    // console.log(this.goods)
    this.getGoodsType();
  },
  watch: {
    goods(val) {
      let mainImageUrl = val.mainImageUrl.join(",");
      let bannerUrls = val.bannerUrls.join(",");
      this.goods.mainImageUrl = mainImageUrl;
      this.goods.bannerUrls = bannerUrls;
      // console.log(this.goods);
    }
  },
  methods: {
    uploadSuccess(e) {
      // console.log(e);
      //上传图片
      //console.log('上传图片：',e);
      this.goods.mainImageUrl = e;
    },
    uploadBannerSuccess(e) {
      // console.log(e);
      //上传图片
      //console.log('上传图片：',e);
      this.goods.bannerUrls = e;
    },
    /**
     * 获取商品分类值
     */
    getGoodsType() {
      let obj = {
        pageNumber: 1,
        pageSize: 100
      };
      getGoodsType(obj).then(res => {
        if (res.code == 200) {
          let arr = [];
          res.result.content.forEach(item => {
            if (item.parentId !== -1) {
              arr.push(item);
            }
          });
          this.typeList = arr;
        }
      });
    },
    /**
     * 图片查看按钮
     */
    handleView(item) {
      // console.log(item);
      this.showUrl = item.url ? item.url : item;
      this.visible = true;
    },

    /**
     * 图片删除按钮
     */
    handleRemove(name, index) {
      if (name == "main") {
        this.mainImageUrl = [];
      } else {
        // console.log(index);
        this.bannerUrls.splice(index, 1);
        // console.log(this.bannerUrls);
      }
    },

    mainBefore(file) {
      // console.log("1", file.name);
      this.mainName = file.name;
    },

    /**
     * 文件上传成功时的钩子
     */
    mainSuccess(res, file) {
      // console.log(res);
      file.url = res.message;
      file.name = this.mainName;
      this.mainImageUrl.push(file.url);
      // console.log(this.mainImageUrl);
      this.goods.mainImageUrl = file.url;
    },

    /**
     * 文件上传成功时的钩子
     */
    carouselSuccess(res, file) {
      file.url = res.message;
      // file.name = this.carouselName;
      this.bannerUrls.push(file.url);
      // let str = this.bannerUrls.toString();
      // this.goods.bannerUrls = str;
    },

    /**
     * 文件格式验证失败时的钩子
     */
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },

    /**
     * 文件超出指定大小限制时的钩子
     */
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },

    /**
     * 上传文件之前的钩子，参数为上传的文件
     */
    handleBeforeUpload(file) {
      // console.log(file);
    },

    checkForm() {
      let check;
      // console.log(this.$refs["productDetailVO"]);
      this.$refs["productDetailVO"].validate(valid => {
        if (valid) {
          // this.$Message.success("Success!");
        } else {
          this.$Message.error("请按要求输入商品信息！");
        }
        check = valid;
      });
      return check;
    }
  }
};
</script>
<style lang="scss" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>