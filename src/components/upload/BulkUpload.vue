<template>
  <!-- 导入对话框 -->
  <Modal v-model="modal1" :title="title" width="1000">
    <Upload
      ref="files"
      multiple
      name="files"
      type="drag"
      :max-size="30720"
      :data="uploadData"
      :action="uploadUrl"
      :before-upload="handleUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :format="fileFormat"
      :on-format-error="handleFormatError"
      :show-upload-list="showList"
    >
      <div style="padding: 30px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>拖拽到此或者点击上传文件</p>
      </div>
    </Upload>
    <div>
      <div>
        <Row class="hover" v-for="(item,index) in uplist" :key="index">
          <Col span="2">
            <img @click="handleView" class="image-icon" src="@/assets/xls.png" alt />
          </Col>
          <Col span="15">
            <span class="text-ellipsis">{{item.name | changeName}}</span>
          </Col>
          <Col span="7">
            <span class="c_8">{{item.size | changeSize}}</span>
            <Icon
              @click="handleRemove(index)"
              class="fr close-icon c_ef4 fs18"
              type="md-close-circle"
            />
          </Col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="primary" :loading="submitLoading" @click="ok">提交</Button>
    </div>
  </Modal>
</template>
<script>
// import { correction } from "@/api/index.js";
// import { parse } from 'path';
export default {
  data() {
    return {
      files: null,
      showList: true,
      // loading: true,
      remarkVal: "",
      fileFormat: ["xlsx", "xls", "docx", "doc"],
      uplist: [], // 存放上传文件数组{名字,大小}
      exportAccount: "",
      exportCstType: "",
      uploadData: {},
      year: "",
      MonQua: false,
      typePOST: false,
      typePRE: true,
      paytype: true,
      monthTIME: true,
      quartertime: false,
      times: true,
      uploadUrl: (() =>
        location.href.indexOf("http://47.96.93.191") != -1
          ? "/ams-admin/admin/smc/data/"
          : "/admin/smc/data/")(),
      submitLoading: false,
      selectedIndex: 0,
      fileData: []
    };
  },
  props: {
    openUpload: {
      type: Boolean,
      default: false
    },
    uploadconfig: {
      type: Object,
      defalut: {}
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    modal1: {
      get() {
        return this.openUpload;
      },
      set(val) {
        this.$emit("close", false);
        this.uplist = [];
      }
    }
  },
  created() {
    // console.log(this.openUpload);
    let path = this.$route.path;
  },
  watch: {},
  methods: {
    ok() {
      if (!this.files) return;
      let content = "确认上传已选的条件";
      this.modal1 = false;
      let that = this;
      this.$Modal.confirm({
        title: "提示",
        content: content,
        // 确认所选资料是否有误
        onOk: files => {
          for (let i = 0; i < this.fileData.length; i++) {
            let item = this.fileData[i];
            that.$refs.files.post(item.files);
          }
          this.fileData = [];
          // this.files);
          // this.$Message.success("文件已上传");
        },
        onCancel: () => {
          this.$Message.warning({
            content: "文件已取消上传",
            duration: 3
          });
        }
      });
    },
    dataCall(item, callback) {
      if (typeof callback === "function") {
        callback();
      }
    },
    cancel() {
      this.modal1 = false;
      if (this.$route.path != "/data-operation/performance-correction") {
        this.$Message.warning({
          content: "上传已取消",
          duration: 3
        });
      }
    },

    handleView() {
      this.visible = true;
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
    handleUpload(file) {
      this.files = file;
      let that = this;
      let _temp = {};
      _temp["imgUrl"] = file.name;
      _temp["name"] = file.name;
      _temp["size"] = file.size;
      // 根据文件名显示默认值
      let isRep = false;
      //  if(this.uplist.includes())
      this.uplist.forEach(item => {
        if (item.name == _temp.name) {
          isRep = true;
          this.$Message.error({
            content: "选择的文件重复!",
            duration: 3
          });
          return false;
        } else {
          // this.uplist.push(_temp);
        }
      });
      this.selectedIndex = this.uplist.length;
      if (!isRep) {
        this.uplist.push(_temp);
      }
      // this.uplist.push(_temp);
      // this.$refs.files.clearFiles();
      this.showList = true;
      return false;
      // console.log(file);
    },
    // 文件上传成功时的钩子，返回字段为 response, file, fileList
    uploadSuccess(response, file, fileList) {
      // console.log('上传成功')
      let _temp = {};
      _temp["imgUrl"] = file.name;
      _temp["name"] = file.name;
      _temp["size"] = file.size;
      this.$emit("uploadSuccess");
      if (response.code === 200) {
        this.$Message.warning({
          content: "文件上传成功",
          duration: 4
        });
      } else if (response.message) {
        this.$Message.error({
          content: response.message,
          duration: 4
        });
      }
      // this.uplist.push(_temp);
      // this.showList = false;
    },
    // 文件上传失败时的钩子，返回字段为 error, file, fileList
    uploadError(error, file, fileList) {
      this.$Message.error({ content: "上传格式验证失败", duration: 3 });
    },
    // 文件格式验证失败时的钩子，返回字段为 file, fileList
    handleFormatError(file, fileList) {
      this.$Message.error({ content: "上传格式验证失败", duration: 3 });
    },

    // 删除上传列表
    handleRemove(index) {
      this.files = null;
      this.uplist = this.uplist.filter((i, z) => z != index);
    },

    // 日期发生变化时触发
    beginTimepePRE(data) {
      this.begindata = data;
    },
    endTimepePRE(data) {
      this.enddata = data;
    },
    // 下拉选择器触发
    selectdata(value) {
      if (value === "ACCOUNTING") {
        this.MonQua = true;
        this.paytype = false;
        this.times = false;
      } else if (value != "ACCOUNTING") {
        this.MonQua = false;
      }
      if (value === "SAND") {
        this.times = true;
        this.paytype = true;
      }
      if (value === "POST") {
        this.typePRE = false;
        this.typePOST = true;
      }
      if (value === "PRE") {
        this.typePRE = true;
        this.typePOST = false;
      }
      if (value === "UPDATE") {
        this.times = true;
        this.paytype = true;
      }
    },
    // 编辑默认值
    handleFile(sourceType, taskType, exportAccount, exportCstType, index) {
      this.selectedIndex = index;
      this.sourceType = sourceType;
      this.taskType = taskType;
      this.exportAccount = exportAccount;
      this.exportCstType = exportCstType;
    },
    accounFile(sourceType, taskType, exportAccount, year, frequency, index) {
      this.selectedIndex = index;
      this.sourceType = sourceType;
      this.exportAccount = exportAccount;
      this.taskType = taskType;
      this.year = year;
      if (frequency.indexOf("Q") != -1) {
        this.searchName = "quarter";
      } else {
        this.searchName = "month";
      }
      this.searchVal = frequency;
    }
  },
  filters: {
    changeSize: function(value) {
      if (value > Math.pow(10, 12)) {
        return (value / Math.pow(10, 12)).toFixed(2) + "tb";
      } else if (value > Math.pow(10, 9)) {
        return (value / Math.pow(10, 9)).toFixed(2) + "gb";
      } else if (value > Math.pow(10, 6)) {
        return (value / Math.pow(10, 6)).toFixed(2) + "mb";
      } else if (value > Math.pow(10, 3)) {
        return (value / Math.pow(10, 3)).toFixed(2) + "kb";
      } else if (value > 1) {
        return value + "b";
      }
    },
    changeName: function(value) {
      // console.log(value.length);
      return value;
    },
    accountText: function(val) {
      let value = "";
      switch (val) {
        case "data@gzmain":
          value = "广莲主账号";
          break;
        case "data@szmain":
          value = "深莲主账号";
          break;
        case "data@fuwushang":
          value = "服务商主账号";
          break;
        case "data@szfuwu":
          value = "深圳服务商账号";
          break;
        case "data@yunheng":
          value = "云恒";
          break;
        case "data@clotus0508":
          value = "青莲CLOTUS";
          break;
        case "data@dgmain":
          value = "东莞主账号";
          break;
        case "data@gxmain":
          value = "广西主账号";
          break;
        default:
          value = "服务商账号";
      }
      return value;
    },
    filterName: function(val) {
      let value = "";
      switch (val) {
        case "Q1":
          value = "第一季度";
          break;
        case "Q2":
          value = "第二季度";
          break;
        case "Q3":
          value = "第三季度";
          break;
        case "Q4":
          value = "第四季度";
          break;
        case "01":
          value = "1月";
          break;
        case "01":
          value = "1月";
          break;
        case "02":
          value = "2月";
          break;
        case "03":
          value = "3月";
          break;
        case "04":
          value = "4月";
          break;
        case "05":
          value = "5月";
          break;
        case "06":
          value = "6月";
          break;
        case "07":
          value = "7月";
          break;
        case "08":
          value = "8月";
          break;
        case "09":
          value = "9月";
          break;
        case "10":
          value = "10月";
          break;
        case "11":
          value = "11月";
          break;
        default:
          value = "12月";
          break;
      }
      return value;
    },
    filterSource(val) {
      let value = "";
      switch (val) {
        case "MAIN":
          value = "主账号数据";
          break;
        case "SERVICER":
          value = "服务商数据";
          break;
        case "MAIN_ADJUST":
          value = "主账号调账数据";
          break;
        case "MAIN_SERVICER":
          value = "城市服务商数据";
          break;
        case "SERVICER_ADJUST":
          value = "主账号调账数据";
          break;
        default:
          value = "服务商调账数据";
      }
      return value;
    }
  }
};
</script>
<style lang="scss" scoped>
.hover {
  padding: 5px 10px 0 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  // color: #468847;
  // background: #dff0d8;
  background: #eee;
  cursor: pointer;
  .text-ellipsis {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 16px;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .ivu-modal-body {
    padding: 16px;
    font-size: 12px;
    line-height: 1.5;
    background-color: #fff;
  }
  .image-icon {
    width: 30px;
    height: 30px;
  }
  &:hover {
    // background: #d5f0d9;
    // color: #5ca84a;
    .close-icon {
      display: block;
    }
  }
  .close-icon {
    display: none;
    margin-top: 5px;
  }
  span {
    line-height: 30px;
  }
}
.select {
  border: 1px solid #8ce6b0;
  background-color: #edfff3;
}
</style>
