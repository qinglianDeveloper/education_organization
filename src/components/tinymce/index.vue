<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="id"></textarea>
  </div>
</template>
<script>
import axios from "axios";
import config from "@/config"; //上传路径
export default {
  name: "tinymce",
  props: {
    id: {
      type: String,
      default: "tinymceEditor"
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [
          "undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat"
        ];
      }
    },
    data() {
      return {
        hasChange: false,
        hasInit: false
      };
    },
    menubar: {
      default: ""
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => tinymce.get(this.id).setContent(val));
      }
    }
  },
  mounted() {
    const _this = this;
    tinymce.init({
      selector: `#${this.id}`,
      language: "zh_CN",
      height: this.height,
      body_class: "panel-body",
      object_resizing: true,
      toolbar: this.toolbar,
      menubar: false,
      statusbar: false,
      font_formats:
        "微软雅黑=微软雅黑,Microsoft YaHei;宋体=宋体,SimSun;黑体=黑体, SimHei;隶书=隶书, SimLi;楷体=楷体,楷体_GB2312, SimKai;andale mono=andale mono;arial=arial, helvetica,sans-serif;arial black=arial black,avant garde;comic sans ms=comic sans ms;impact=impact,chicago;Arial=Arial;Verdana=Verdana;Georgia=Georgia;Times New Roman=Times New Roman;Trebuchet MS=Trebuchet MS;Courier New=Courier New;Impact=Impact;Comic Sans MS=Comic Sans MS;Calibri=Calibri",
      images_upload_url: this.html_url + "/common/uploadFile",
      imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
      plugins: [
        "powerpaste", // plugins中，用powerpaste替换原来的paste
        "image"
      ],
      fontsizeFormats:
        "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 36pt 48pt",
      default_link_target: "_blank",
      link_title: false,
      powerpaste_allow_local_images: true,
      paste_data_images: true, //是否允许复制粘贴图片
      images_upload_handler: function(blobInfo, success, failure) {
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
      },
      init_instance_callback: editor => {
        if (_this.value) {
          editor.setContent(_this.value);
        }
        _this.hasInit = true;
        editor.on("NodeChange Change KeyUp", () => {
          this.hasChange = true;
          this.$emit("input", editor.getContent({ format: "raw" }));
        });
      }
      //   setup(editor) {
      //     editor.addButton("h2", {
      //       title: "小标题", // tooltip text seen on mouseover
      //       text: "小标题",
      //       onclick() {
      //         editor.execCommand("mceToggleFormat", false, "h2");
      //       },
      //       onPostRender() {
      //         const btn = this;
      //         editor.on("init", () => {
      //           editor.formatter.formatChanged("h2", state => {
      //             btn.active(state);
      //           });
      //         });
      //       }
      //     });
      //     editor.addButton("p", {
      //       title: "正文",
      //       text: "正文",
      //       onclick() {
      //         editor.execCommand("mceToggleFormat", false, "p");
      //       },
      //       onPostRender() {
      //         const btn = this;
      //         editor.on("init", () => {
      //           editor.formatter.formatChanged("p", state => {
      //             btn.active(state);
      //           });
      //         });
      //       }
      //     });
      //     editor.on("joinimageuploadstart", function(e) {
      //       _this.$message({ duration: 0, message: "正在上传图片..." });
      //     });
      //     editor.on("joinimageuploadend", function(e) {
      //       _this.$message.closeAll();
      //     });
      //     editor.on("joinimageuploaderror", function(e) {
      //       _this.$message({ duration: 0, message: e.errMsg });
      //       setTimeout(function() {
      //         _this.$message.closeAll();
      //       }, 3000);
      //     });
      //   }
    });
  },
  destroyed() {
    tinymce.get(this.id).destroy();
  }
};
</script>
<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 15px;
  top: 18px;
}
.editor-upload-btn {
  display: inline-block;
}
</style>