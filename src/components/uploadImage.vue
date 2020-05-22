<template>
  <div class="component">
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <template>
        <img :src="item" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
        </div>
      </template>
      <!-- <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>-->
    </div>
    <Upload
      ref="upload"
      :data="file"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"
      :max-size="30720"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      type="drag"
      :action="uploadAction"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="图片查看" v-model="visible">
      <img :src="modalUrl" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
/* 
标签用法：
<uploadImage ref="uploadImage" :imgNum="1" :data="carouselForm.image" @success="uploadSuccess"/>
<uploadImage ref="uploadImage" :imgNum="3" :data="carouselForm.image" @success="uploadSuccess"/>

导入使用：
import uploadImage from "@/components/uploadImage";


*/
import config from "@/config";
export default {
  props: {
    imgNum: {
      //控制文件上传的数量
      type: [Number], //Boolean / String
      default: function() {
        return 1;
      }
    },
    data: {
      type: [String], //Boolean / String
      default: ""
    }
  },
  data() {
    return {
      file: { title: "001" },
      modalUrl: "",
      visible: false,
      uploadList: [],
      multiple: false
    };
  },
  created() {
    this.uploadAction = config.uploadAction; //上传文件路径
  },
  mounted() {
    //imgNum控制是否支持多文件上传
    let { imgNum } = this;
    if (imgNum > 1) {
      this.multiple = true;
    } else {
      this.multiple = false;
    }
  },
  watch: {
    data: function(newValue, oldValue) {
      // console.log("newValue,oldValue", newValue);
      //console.log(this,this.data);
      //编辑时显示已经上传的图片
      if (this.data !== "" && this.data !== null && this.data !== undefined) {
        this.uploadList = this.data.split(",");
        //console.log(this.uploadList);
      } else {
        this.uploadList = [];
      }
    }
  },
  methods: {
    handleView(index) {
      //图片查看 console.log('item:',item);
      this.modalUrl = this.uploadList[index];
      this.visible = true;
    },
    handleBeforeUpload() {
      //上传前处理
      let { imgNum } = this;
      const check = this.uploadList.length < imgNum;
      if (!check) {
        this.$Notice.warning({
          title: `一次最多上传${imgNum}张图片`
        });
      }
      return check;
    },
    handleSuccess(res, file) {
      //图片上传成功回调函数
      //console.log(res, file);
      this.uploadList.push(res.message);

      let { multiple, imgNum } = this;
      let { uploadList } = this;
      if (multiple == false && uploadList.length >= 2) {
        uploadList.splice(0, 1); //单文件上传，删除前一个文件
      }
      if (multiple == true && uploadList.length > imgNum) {
        //超出的文件数量限制删除前面的
        let howmany = uploadList.length - imgNum;
        uploadList.splice(0, howmany);
      }
      //console.log('uploadList',JSON.stringify(uploadList));

      this.callBackParentComponent();
    },
    handleRemove(index) {
      //删除文件 console.log("删除", file);
      let { uploadList } = this;
      this.uploadList.splice(index, 1);
      this.callBackParentComponent();
    },
    /* handleMaxSize(file) {
      //文件最大不能超过30M
      this.$Message.error({
        content: "文件大小超过30M，请重新上传！",
        duration: 2
      });
    }, */
    handleFormatError(file) {
      this.$Notice.warning({
        title: "该文件格式不支持上传",
        desc: `【${file.name}】文件不支持上传！`
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小超出限制",
        desc: `【${file.name}】文件大小超出3MB！`
      });
    },
    callBackParentComponent() {
      //向父组件传参数
      let str = this.uploadList.join(",");
      //console.log('向父级传递的参数：',str);
      this.$emit("success", str);
    }
  }
};
</script>
<style>
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
  border: 1px solid #eee;
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