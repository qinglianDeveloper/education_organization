<template>
  <div class="upload">
    <my-header @Refresh="Refresh" @updataAdd="updataAdd" @search="search"></my-header>
    <!-- 表格内容 -->
    <Table border :loading="loading" :columns="columns" :data="data" :height="tableHeight">
      <template slot-scope="{ row }" slot="uploadAttachmentsUrl">
        <a :href="row.uploadAttachmentsUrl">{{row.uploadAttachments}}</a>
      </template>
      <template slot-scope="{ row }" slot="downloadAttachmentsUrl">
        <a :href="row.downloadAttachmentsUrl">{{row.downloadAttachments}}</a>
      </template>
    </Table>
    <!-- 弹框内容 -->
    <Modal
      v-model="updataModel"
      title="数据导入"
      width="700"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :closable="false"
    >
      <Upload
        type="drag"
        :action="uploadActions"
        :before-upload="handleBefore"
        :on-success="handleSuccess"
        :on-format-error="handleFormatError"
        :on-progress="progressUpload"
        ref="upload"
        :data="file"
        :format="['xlsx','xls']"
        :show-upload-list="false"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>请选择需要上传的文件</p>
        </div>
      </Upload>
      <!-- 文件上传列表 -->
      <ul class="upload-list" v-if="uploadData.fileName">
        <li class="list">
          <span class="letter" @click="downloadUrl(uploadData.filePath)">
            <Icon type="md-document" class="file-icon" />
            {{uploadData.fileName}}
          </span>
          <Icon type="ios-close" class="close-icon" @click="removeFile" />
        </li>
      </ul>
      <Progress :percent="percentage" :stroke-width="2" v-if="showProgress" />
      <div slot="footer">
        <Button type="primary" @click="Submission" :loading="submitLoading">
          <span v-if="!submitLoading">提交</span>
          <span v-else>附件上传中...</span>
        </Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
    <!-- 分页部分 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchDate.pageNumber"
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
  </div>
</template>
<script>
import config from "@/config";
import myHeader from "@/components/updateComponents/header";
import { column } from "@/components/updateComponents/updateTable";
import { dateFormat } from "@/utils/current";
import { calTaskList, uploadAction, financeImport } from "@/api";
// import pages from "@/components/pageview";
import bus from "@/utils/bus";
import { getBlob } from "@/libs/download";
import downlaod from "file-saver";
export default {
  components: { myHeader },
  data() {
    return {
      percentage: 0,
      showProgress: false,
      submitLoading: false,
      tableHeight: 0,
      cityList: [
        { value: "ALY", label: "阿里云" },
        { value: "HWY", label: "华为云" },
        { value: "JSY", label: "金山云" },
        { value: "TXY", label: "腾讯云" },
        { value: "BDY", label: "百度云" }
      ],
      uploadActions: uploadAction,
      date: "",
      file: { title: "" },
      uploadData: {
        filePath: "", // 文件
        fileName: "", // 文件名
        dataType: "", // 数据类型
        paramYear: "", // 年份
        paramMonth: "" // 月份
      },
      obj: {},
      columns: column,
      updataModel: false,
      data: [],
      loading: false,
      searchDate: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  created() {
    this._calTaskList();
    this.initHeight();
    this.uploadActions = config.uploadAction; //上传文件路径
  },
  mounted() {
    bus.$off("delOk");
    bus.$on("delOk", item => {
      this._calTaskList();
    });
  },
  methods: {
    downloadUrl(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    /**
     * 行内下载文件
     */
    handleDownload(url) {
      getBlob(url).then(blob => {
        saveAs(blob);
        // console.log(saveAs());
      });
    },
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 300;
    },
    _calTaskList() {
      // console.log(this.searchDate);
      calTaskList(this.searchDate).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.total = res.result.totalElements;
          this.data = res.result.content;
          this.data.map(item => {
            switch (item.status) {
              case "PENDING":
                item.status = "待执行";
                break;
              case "INTERRUPT":
                item.status = "中断";
                break;
              case "PROCESSING":
                item.status = "进行中";
                break;
              case "FINISH":
                item.status = "已完成";
                break;
              case "CANCEL":
                item.status = "已取消";
                break;
              case "FAIL":
                item.status = "失败";
                break;

              default:
                break;
            }
            switch (item.dataType) {
              case "ALY":
                item.dataType = "阿里云";
                break;
              case "HWY":
                item.dataType = "华为云";
                break;
              case "JSY":
                item.dataType = "金山云";
                break;
              case "TXY":
                item.dataType = "腾讯云";
                break;
              case "BDY":
                item.dataType = "百度云";
                break;

              default:
                break;
            }
            switch (item.taskType) {
              case "CALCULATE":
                item.taskType = "计算";
                break;
              case "IMPORT":
                item.taskType = "导入";
                break;

              default:
                break;
            }
            return this.data;
          });
        }
      });
    },
    Refresh() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this._calTaskList();
      }, 1000);
    },
    updataAdd() {
      this.updataModel = true;
      this.obj = {};
      this.uploadData = {
        filePath: "", // 文件
        fileName: "", // 文件名
        dataType: "", // 数据类型
        paramYear: "", // 年份
        paramMonth: "" // 月份
      };
    },
    /**
     * 搜索按钮事件
     */
    search(obj) {
      // 合并对象
      Object.assign(this.searchDate, obj);
      // console.log(this.searchDate);
      this._calTaskList();
    },
    handleBefore(file) {
      this.file.title = file.name;
      this.fileName = file.name;

      let str = file.name.split("_");
      console.log(str);
      if (str[1] == "STANDARDORDER") {
        this.uploadData.dataType = "STANDARD";
      } else if (str[1] == "UNSTANDARDORDER") {
        this.uploadData.dataType = "UNSTANDARD";
      }
      this.uploadData.fileName = file.name;
      this.uploadData.paramYear = str[0];
      this.uploadData.paramMonth = str[1];
      let type = str[2];
      if (type.indexOf("云厂商") > -1) {
        // console.log("111", type);
        this.uploadData.dataType = "YUNORDER";
      }
      // switch (type) {
      //   case "阿里":
      //     this.uploadData.dataType = "ALY";
      //     break;
      //   case "华为":
      //     this.uploadData.dataType = "HWY";
      //     break;
      //   case "金山":
      //     this.uploadData.dataType = "JSY";
      //     break;
      //   case "腾讯":
      //     this.uploadData.dataType = "TXY";
      //     break;
      //   case "百度":
      //     this.uploadData.dataType = "BDY";
      //     break;
      //   default:
      //     break;
      // }
      if (this.uploadData.paramMonth.indexOf("Q")) {
        this.obj = {
          fileName: this.uploadData.fileName, // 文件名
          dataType: this.uploadData.dataType, // 数据类型
          paramYear: this.uploadData.paramYear, // 年份
          paramMonth: this.uploadData.paramMonth // 季度
        };
      } else {
        this.obj = {
          // filePath: res.message, // 文件
          fileName: this.uploadData.fileName, // 文件名
          dataType: this.uploadData.dataType, // 数据类型
          paramYear: this.uploadData.paramYear, // 年份
          paramQuarter: this.uploadData.paramMonth // 季度
        };
      }
    },
    /* 文件上传时 */
    progressUpload(event, file, fileList) {
      // console.log("上传进行中", event, file, fileList);
      this.percentage = parseInt(event.percent);
      this.submitLoading = true;
      this.showProgress = true;
      this.uploadData.fileName = file.name;
    },
    handleSuccess(res, file, filelist) {
      // console.log(file);
      if (res.code == 200) {
        this.submitLoading = false;
        this.showProgress = false;
        this.percentage = 100;
        this.obj.filePath = res.message;
      }
    },
    handleFormatError(file) {
      this.$Message.error({
        content: "文件" + file.name + "格式不正确，请上传xlsx/xls格式"
      });
    },
    /* 移除文件 */
    removeFile() {
      this.uploadData.filePath = "";
      this.uploadData.fileName = "";
    },
    Submission() {
      console.log(this.obj);
      financeImport(this.obj).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.updataModel = false;
          this._calTaskList();
          this.$refs.upload.clearFiles();
        }
      });
    },
    cancel() {
      this.updataModel = false;
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchDate.pageNumber = v;
      this._calTaskList();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchDate.pageSize = v;
      this._calTaskList();
    }
  }
};
</script>
<style lang="scss" scoped>
.upload {
  padding: 16px;
}
.model-header {
  height: 50px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
}
.footer {
  margin-top: 2vh;
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