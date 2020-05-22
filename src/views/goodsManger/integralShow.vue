<!-- 查看积分商品详情 -->
<template>
  <div class="integral-add">
    <Row style="margin-top:30px;">
      <Form
        :model="integralForm"
        :label-width="100"
        :rules="integralRules"
        ref="integralForm"
        style="padding:0 100px"
        :disabled="disabled"
      >
        <!-- 商品名称 -->
        <FormItem label="商品名称：" prop="productName" style="width:600px">
          <Input type="text" v-model="integralForm.productName"></Input>
        </FormItem>
        <!-- 主图 -->
        <FormItem label="主图：" prop="mainPicUrl">
          <!-- 上传的图片及查看删除 -->
          <div class="demo-upload-list" v-for="(item,index) in mainPicUrl" :key="index">
            <template v-if="item.status === 'finished'">
              <img :src="item.url" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon
                  type="ios-trash-outline"
                  @click.native="handleRemove('main',index)"
                  v-if="isEdit"
                ></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <!-- 上传按钮 -->
          <Upload
            v-model="integralForm.mainPicUrl"
            ref="upload"
            v-show="mainPicUrl[0]?false:true"
            :show-upload-list="false"
            :on-success="mainSuccess"
            :format="['jpg','jpeg','png']"
            accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag"
            :action="uploadAction"
            :data="mainData"
            style="display: inline-block;width:80px;"
          >
            <div style="width: 80px;height:80px;line-height: 80px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <!-- 轮播图 -->
        <FormItem label="轮播图：" prop="bannerUrls ">
          <!-- 上传的图片及查看删除 -->
          <div class="demo-upload-list" v-for="(item,index) in bannerUrls " :key="index">
            <template>
              <img :src="item" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon
                  type="ios-trash-outline"
                  @click.native="handleRemove('carousel',index)"
                  v-if="isEdit"
                ></Icon>
              </div>
            </template>
          </div>
          <!-- 上传按钮 -->
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
        </FormItem>
        <!-- 副标题 -->
        <FormItem label="副标题：" prop="subTitle" style="width:600px">
          <Input type="text" v-model="integralForm.subTitle"></Input>
        </FormItem>
        <!-- 库存 -->
        <FormItem label="库存：" prop="stock">
          <InputNumber :min="0" v-model="integralForm.stock" style="width:500px"></InputNumber>
        </FormItem>
        <!-- 所需积分 -->
        <FormItem label="兑换积分：" prop="credit">
          <InputNumber :min="0" v-model="integralForm.credit" style="width:500px"></InputNumber>
        </FormItem>
        <!-- 是否上架 -->
        <FormItem label="是否上架" prop="status">
          <RadioGroup v-model="integralForm.status">
            <Radio label="ENABLE" style="margin-right:20px">是</Radio>
            <Radio label="DISABLE">否</Radio>
          </RadioGroup>
        </FormItem>
        <!-- 商品排序 -->
        <FormItem label="商品排序：" prop="sort">
          <InputNumber :min="0" v-model="integralForm.sort" style="width:500px"></InputNumber>
        </FormItem>
      </Form>
      <div style="display:flex; justify-content:center;width:900px">
        <Button
          type="primary"
          @click="handleSave('integralForm')"
          style="margin-right:10px"
          v-if="isEdit"
        >保存</Button>
        <Button type="default" @click="handleCancel">取消</Button>
      </div>
    </Row>
    <!-- 大图弹框 -->
    <Modal title="Image" v-model="visible">
      <div style="text-align:center">
        <img :src="showUrl" v-if="visible" style="width:100%" />
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  uploadAction,
  creditSave,
  creditDetail,
  updateCreditDetail
} from "@/api";
export default {
  name: "integral-add",
  data() {
    return {
      isEdit: false,
      disabled: true,
      mainPicUrl: [],
      bannerUrls: [],
      integralForm: { stock: 1, credit: 1, sort: 1 },
      integralRules: {
        productName: [
          { required: true, message: "请填写商品名称", trigger: "blur" }
        ],
        subTitle: [
          { required: true, message: "请填写商品副标题", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请填写商品是否上架", trigger: "blur" }
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
        sort: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
            type: "number"
          }
        ],
        credit: [
          {
            required: true,
            message: "请填写商品兑换积分",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      uploadList: [],
      defaultList: [],
      visible: false,
      uploadAction: "/admin/common/file/upload",
      mainData: { title: "1" },
      showUrl: "",
      pictureList: { title: "2" }
    };
  },
  created() {
    // this.uploadAction = uploadAction;
    let id = this.$route.query.id;
    let isEdit = this.$route.query.isEdit;
    if (id == "add") {
    } else {
      creditDetail(id).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.integralForm = res.result;
          let obj = {};
          obj.url = res.result.mainPicUrl;
          obj.status = "finished";
          this.mainPicUrl.push(obj);
          this.bannerUrls = res.result.bannerUrls.split(",");
          // console.log(this.bannerUrls);
        }
      });
    }
  },
  methods: {
    /**
     * 保存按钮事件
     */
    handleSave(name) {
      // console.log(this.integralForm);
      this.$refs[name].validate(valid => {
        if (valid) {
          creditSave(this.integralForm).then(res => {
            if (res.code == 200) {
              this.$Message.success("新增成功!");
              this.$router.go(-1);
            } else {
              this.$Message.error("新增失败!");
            }
          });
        }
      });
    },
    /**
     * 取消按钮事件
     */
    handleCancel() {
      this.$Modal.confirm({
        title: "确认返回",
        content: "您确认要离开?",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    },
    /**
     * 文件上传成功时的钩子
     */
    mainSuccess(res, file) {
      // console.log(res);
      file.url = res.message;
      file.name = this.mainName;
      this.mainPicUrl.push(file);
      // console.log(this.mainPicUrl);
      this.integralForm.mainPicUrl = file.url;
    },
    handleSuccess() {},
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
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    },

    /**
     * 文件上传成功时的钩子
     */
    carouselSuccess(res, file) {
      file.url = res.message;
      // file.name = this.carouselName;
      this.bannerUrls.push(file.url);
      let str = this.bannerUrls.toString();
      this.integralForm.bannerUrls = str;
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
        this.mainPicUrl = [];
      } else {
        // console.log(index);
        this.bannerUrls.splice(index, 1);
        // console.log(this.bannerUrls);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.integral-add {
  padding: 16px;
}
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