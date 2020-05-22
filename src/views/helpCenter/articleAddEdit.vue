<!-- 新增文章 -->
<template>
  <div class="articleaddedit">
    <!-- <PDF ref="pdf"></PDF> -->
    <!-- 返回按钮 -->
    <!-- <Row type="flex" justify="end">
      <div class="btn">
        <Button type="default" icon="md-close" size="small">返回文章列表</Button>
      </div>
      <Divider style="margin:10px 0" />
    </Row>-->
    <Row style="margin-top:30px;">
      <Form :model="articleForm" :label-width="130" :rules="articleRules" ref="articleForm">
        <FormItem label="文章标题：" prop="articleTitle">
          <Input v-model="articleForm.articleTitle" style="width:500px" />
        </FormItem>
        <FormItem label="分类：" prop="classifyId">
          <Select v-model="articleForm.classifyId" style="width:500px">
            <Option
              v-for="item in classifyArr"
              :value="item.id + ''"
              :key="item.id"
            >{{ item.classifyName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否在首页展示：" prop="isShow">
          <i-switch size="large" v-model="articleForm.isShow">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <!-- 富文本 -->
        <FormItem :label-width="0" style="padding:0 40px">
          <div style="width:100%">
            <TinymceEditor v-model="articleForm.articleContent"></TinymceEditor>
          </div>
        </FormItem>
        <!-- 附件 -->
        <FormItem label="附件：" prop="file">
          <Upload
            :action="uploadAction"
            :before-upload="beforeUpload"
            :on-progress="progressUpload"
            :on-success="handleSuccess"
            ref="upload"
            :data="file"
            :max-size="30720"
            :on-exceeded-size="handleMaxSize"
            :on-format-error="handleFormatError"
            :format="['pdf']"
            :show-upload-list="false"
          >
            <!-- :show-upload-list="false" -->
            <Button icon="ios-cloud-upload-outline" :disabled="uploadDisabled">上传附件</Button>
          </Upload>
          <!-- 文件上传列表 -->
          <ul class="upload-list" v-if="articleForm.accessoryName">
            <li class="list">
              <span class="letter" @click="downloadUrl(articleForm.accessoryUrl)">
                <Icon type="md-document" class="file-icon" />
                {{articleForm.accessoryName}}
              </span>
              <Icon type="ios-close" class="close-icon" @click="removeFile" />
            </li>
          </ul>
          <Progress :percent="percentage" :stroke-width="2" v-if="showProgress" />
        </FormItem>
        <FormItem style="display:flex;justify-content:center;" :label-width="0">
          <Button
            type="primary"
            @click="handleSave('articleForm')"
            style="margin-right:10px"
            :loading="loading"
          >
            <span v-if="!loading">保存</span>
            <span v-else>附件上传中...</span>
          </Button>
          <Button type="default" @click="handleCancel">取消</Button>
        </FormItem>
      </Form>
    </Row>
  </div>
</template>
<script>
/* 富文本编辑框 */
import TinymceEditor from "@/components/tinymce-editor/tinymce-editor";
import config from "@/config";
import axios from "axios";
import PDF from "@/components/pdfDownload.vue";
import {
  addHelpArticle,
  getHelpArticleList,
  deleteHelpArticle,
  updateHelpArticle,
  getHelpArticleById,
  getHelpClassifyListAll
} from "@/api";

export default {
  name: "articleaddedit",
  components: { TinymceEditor },
  data() {
    // 自定义验证 判断上传文件 fileList 的长度, 这样就和普通输入框表现一致了
    const validateUpload = (rule, value, callback) => {
      if (this.uploadList && this.uploadList.length === 0) {
        callback(new Error("请上传附件"));
      } else {
        callback();
      }
    };
    return {
      uploadDisabled: false,
      showProgress: false,
      percentage: 0,
      loading: false,
      file: { title: "001" },
      uploadAction: "",
      uploadList: [],
      /* ------ */
      articleForm: {
        articleTitle: "",
        classifyId: "",
        articleContent: "",
        isShow: true, // YES/NO
        accessoryUrl: "",
        accessoryName: ""
      },
      articleRules: {
        articleTitle: [
          {
            required: true,
            message: "文章标题不能为空",
            trigger: "blur"
          }
        ],
        classifyId: [
          {
            required: true,
            message: "请选择文章类型",
            trigger: "blur"
          }
        ] /* ,
        file: [{ required: true, validator: validateUpload, trigger: "change" }] */
      },
      type: "",
      id: "",
      classifyArr: []
    };
  },
  created() {
    this.uploadAction = config.uploadAction;
  },
  mounted() {
    // this.uploadList = this.$refs.upload.fileList;
    this.init();
    let { type, id } = this.$route.params;
    this.type = type;
    this.id = id;

    //分类
    getHelpClassifyListAll().then(res => {
      if (res.code === 200) {
        this.classifyArr = res.result;
      }
    });

    if (type === "edit") {
      //编辑---通过id获取详情
      getHelpArticleById({ id }).then(res => {
        let {
          id,
          articleTitle,
          classifyId,
          articleContent,
          isShow,
          accessoryName,
          accessoryUrl
        } = res.result;
        isShow = isShow == "YES" ? true : false;
        classifyId += "";
        this.articleForm = {
          id,
          articleTitle,
          classifyId,
          articleContent,
          isShow,
          accessoryName,
          accessoryUrl
        };
      });
    }
  },
  methods: {
    downloadUrl(url) {
      // console.log(url);
      // url = url.replace("https://test.yundejia.com", "");
      // console.log(url);
      // this.$refs.pdf.downloadPDF(url, this.articleForm.accessoryName);
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    init() {},
    /**
     * 获取路由传参的值
     */
    /**
     * 保存按钮事件
     */
    handleSave(name) {
      console.log(this.articleForm);
      let { type } = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (type === "add") {
            this.add();
          } else {
            this.update();
          }
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
    add() {
      //添加
      let {
        articleTitle,
        classifyId,
        articleContent,
        isShow,
        accessoryUrl,
        accessoryName
      } = this.articleForm;
      isShow = isShow ? "YES" : "NO";
      addHelpArticle({
        articleTitle,
        classifyId,
        articleContent,
        isShow,
        accessoryUrl,
        accessoryName
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.$router.go(-1);
        }
      });
    },
    update() {
      //编辑
      let {
        id,
        articleTitle,
        classifyId,
        articleContent,
        isShow,
        accessoryUrl,
        accessoryName
      } = this.articleForm;
      isShow = isShow ? "YES" : "NO";
      updateHelpArticle({
        id,
        articleTitle,
        classifyId,
        articleContent,
        isShow,
        accessoryUrl,
        accessoryName
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.$router.go(-1);
        }
      });
    },
    beforeUpload(res, file) {
      console.log("上传前", res, file);
      // this.loading = true;
    },
    /* 文件上传时 */
    progressUpload(event, file, fileList) {
      console.log("上传进行中", event, file, fileList);
      this.uploadDisabled = true;
      this.percentage = parseInt(event.percent);
      this.loading = true;
      this.showProgress = true;
      this.articleForm.accessoryName = file.name;
    },
    /**
     * 文件超出指定大小限制时的钩子
     */
    handleMaxSize(file) {
      this.$Message.error({
        content: "文件大小超过30M，请重新上传！",
        duration: 2
      });
    },
    handleFormatError(file) {
      this.$Message.error({
        content: "文件" + file.name + "格式不正确，请上传pdf格式"
      });
    },

    /**
     * 弹框上传成功回调
     */
    handleSuccess(res, file) {
      console.log("成功", res, file);
      if (res.code == 200) {
        this.loading = false;
        this.showProgress = false;
        this.uploadDisabled = false;
        this.articleForm.accessoryUrl = res.message;
        this.percentage = 100;
        this.$Message.success({
          content: "上传附件成功！",
          duration: 2
        });
      } else {
        this.$Message.error("上传附件失败，请重新上传");
      }
    },
    /* 移除文件 */
    removeFile() {
      this.articleForm.accessoryUrl = "";
      this.articleForm.accessoryName = "";
    }
  }
};
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #333;
}
.articleaddedit {
  padding: 16px;
  height: 100%;
  overflow: auto;
}
.upload-list {
  margin-top: 8px;
  .list {
    padding: 4px;
    color: #515a6e;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out;
    overflow: hidden;
    position: relative;
    span {
      cursor: pointer;
      transition: color 0.2s ease-in-out;
    }
    .file-icon {
      margin-right: 6px;
      display: inline-block;
      width: 12px;
      height: 12px;
      color: #515a6e;
      text-align: center;
    }
    .close-icon {
      float: right;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
  }
  .list:hover {
    background: #eee;
    span {
      color: royalblue;
    }
    .close-icon {
      opacity: 1;
    }
  }
}
</style>