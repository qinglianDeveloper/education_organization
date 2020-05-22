<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"></editor>
  </div>
</template>
<script>
import axios from "axios";
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件

import config from "@/config"; //上传路径
export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    // baseUrl: {
    //   type: String,
    //   default: ""
    // },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: "lists image media table wordcount"
    },
    toolbar: {
      type: [String, Array],
      default:
        "undo redo | fontsizeselect | fontselect |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat "
    }
  },
  data() {
    return {
      init: {
        language_url: `${config.tinymceUrl}/tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `${config.tinymceUrl}/tinymce/skins/ui/oxide`,
        content_css: `${config.tinymceUrl}/tinymce/skins/content/default/content.css`,
        // skin_url: `${config.tinymceUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${config.tinymceUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        convert_urls: false,
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt", // 第二步
        // powerpaste_allow_local_images: true,
        // paste_data_images: true, //可粘贴图片
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", blobInfo.blob(), blobInfo.filename());
          formdata.append("title ", "editor");
          // 通过append向form对象添加数据,可以通过append继续添加数据
          //或formdata1.append('img',file);
          let request_header_config = {
            headers: { "Content-Type": "multipart/form-data" }
          }; //添加请求头
          axios
            .post("/common/file/upload", formdata, request_header_config)
            .then(res => {
              //这里的/xapi/upimage为接口
              success(res.message);
            });
        }
      },
      myValue: this.value
    };
  },
  mounted() {
    tinymce.init({});
    console.log("5645646", this.plugins);
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
