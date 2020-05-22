<!-- 上传附件组件 -->
<template>
  <Upload
    ref="upload"
    :action="uploadAction"
    :before-upload="handleBefore"
    :on-success="handleSuccess"
    :data="file"
    :max-size="30720"
    :on-exceeded-size="handleMaxSize"
    :multiple="multiple"
  >
    <Button icon="ios-cloud-upload-outline">上传附件</Button>
  </Upload>
</template>
<script>
import config from "@/config";
export default {
  props: {
    fileNum: {
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
      uploadAction: "",
      file: {},
      multiple: false
    };
  },
  created() {
    this.uploadAction = config.uploadAction;
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    //imgNum控制是否支持多文件上传
    let { fileNum } = this;
    if (fileNum > 1) {
      this.multiple = true;
    } else {
      this.multiple = false;
    }
  },
  methods: {
    handleBefore(file) {
      this.file.title = file.name;
      let { fileNum } = this;
      const check = this.uploadList.length < fileNum;
      if (!check) {
        this.$Notice.warning({
          title: `一次最多上传${fileNum}份附件`
        });
      }
      return check;
    },
    /**
     * 弹框上传成功回调
     */
    handleSuccess(res, file, filelist) {
      //   console.log(res);
      if (res.code == 200) {
        let arr = [];
        filelist.forEach(item => {
          arr.push(item.response.message);
        });
        let urls = arr.join(",");
        this.$emit("success", urls);
        // console.log(this.workForm.accessoryUrl);
        // this.workForm.file = res.message;
        this.$Message.success({
          content: "上传附件成功！",
          duration: 2
        });
      } else {
        this.$Message.error("上传附件失败，请重新上传");
      }
    },
    /**
     * 文件超出指定大小限制时的钩子
     */
    handleMaxSize(file) {
      this.$Message.error({
        content: "文件大小超过30M，请重新上传！",
        duration: 2
      });
      /**
       * 清空文件列表
       */
    },
    clearFiles() {
      this.$refs["upload"].clearFiles();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>