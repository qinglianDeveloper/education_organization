<template>
  <div>
    <Modal
      v-model="editEnclosureStatus"
      :title="editEnclosureTitle"
      :closable="false"
      :width="600"
      :styles="{top: '30px'}"
    >
      <Form
        ref="formItem"
        class="formInfo"
        :model="formItem"
        :label-width="70"
        label-position="right"
        :rules="ruleValidate"
      >
        <FormItem label="附件上传：" prop="annexName" :label-width="100" v-if="isPage!='edit'">
          <!-- <Button icon="ios-folder-outline">文件上传</Button> -->
          <input type="file" ref="file" style="display: none" @change="fileChange" />
          <div ref="select_frame" class="upload_box" @click="getFile">
            <Icon class="one" type="ios-cloud-upload-outline" />
            <span>将文件拖拽到这里或者点击上传文件</span>
          </div>
        </FormItem>

        <FormItem prop="annexName" :label-width="100" v-if="files && files.name">
          <div class="bottom">
            <span class="bottom-i">
              {{files.name}}
              <span style="color:rgb(48,46,242)" @click="goCancel('add')">删除</span>
            </span>
          </div>
        </FormItem>

        <FormItem prop="annexName" :label-width="100" v-if="edits && edits.annexName">
          <div class="bottom">
            <span class="bottom-i">
              {{edits.annexName}}
              <span style="color:rgb(48,46,242)" @click="goCancel('edit')">删除</span>
            </span>
          </div>
        </FormItem>

        <FormItem label="标签：" prop="tag" :label-width="100">
          <Input
            v-model="formItem.tag"
            @on-change="goInput"
            placeholder="点击下面列表选择常用标签或输入自定义标签"
            style="width:400px;"
          ></Input>
          <div class="enclo" v-if="name=='BO'||isModuleStatus=='BoFU'">
            <template v-for="(item,index) in labelListBo">
              <span :key="index" @click="changeLabel(item)">{{item.value}}</span>
            </template>
          </div>
          <div class="enclo" v-if="name=='Customer'||isModuleStatus=='CustomerFU'">
            <template v-for="(item,index) in labelListCustomer">
              <span :key="index" @click="changeLabel(item)">{{item.value}}</span>
            </template>
          </div>
        </FormItem>

        <FormItem label="备注：" prop="remark" :label-width="100">
          <Input
            type="textarea"
            v-model="formItem.remark"
            placeholder="请输入商机描述"
            style="width:400px;"
          ></Input>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确认保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
// import { getCusEnclosureDetail } from "@/api/index";
export default {
  props: [
    "editEnclosureStatus",
    "editEnclosureTitle",
    "annexTargetId",
    "relationTargetType",
    "name",
    "isModuleStatus"
  ],
  data() {
    return {
      isPage: "",
      labelListCustomer: [
        {
          value: "公司介绍",
          code: "公司介绍"
        },
        {
          value: "营业执照",
          code: "营业执照"
        },
        {
          value: "公司形象",
          code: "公司形象"
        },
        {
          value: "会议纪要",
          code: "会议纪要"
        },
        {
          value: "客户分析",
          code: "客户分析"
        }
      ],
      labelListBo: [
        {
          value: "需求说明书",
          code: "需求说明书"
        },
        {
          value: "方案设计",
          code: "方案设计"
        },
        {
          value: "项目报价",
          code: "项目报价"
        },
        {
          value: "竞争对手评估",
          code: "竞争对手评估"
        },
        {
          value: "界面设计",
          code: "界面设计"
        },
        {
          value: "项目计划",
          code: "项目计划"
        },
        {
          value: "优势分析",
          code: "优势分析"
        },
        {
          value: "会议纪要",
          code: "会议纪要"
        },
        {
          value: "项目汇报",
          code: "项目汇报"
        },
        {
          value: "竞标标书",
          code: "竞标标书"
        }
      ],
      infoNumber: 2,
      quesnumber: 2,
      otherNumber: 2,
      fileTypeList: [
        {
          value: ".doc",
          label: ".doc"
        },
        {
          value: ".xlsx",
          label: ".xlsx"
        },
        {
          value: ".txt",
          label: ".txt"
        },
        {
          value: ".pgn",
          label: ".pgn"
        }
      ],
      //   表单验证
      ruleValidate: {
        annexName: [
          {
            required: true,
            message: "文件不能为空",
            trigger: "blur"
          }
        ]
      },
      //表单字段
      formItem: {
        annexName: "",
        annexType: "",
        tag: "",
        remark: ""
      },
      files: {},
      edits: {}
    };
  },
  mounted() {
    this.$refs.select_frame.ondragleave = e => {
      e.preventDefault(); //阻止离开时的浏览器默认行为
    };
    this.$refs.select_frame.ondrop = e => {
      e.preventDefault(); //阻止拖放后的浏览器默认行为
      const data = e.dataTransfer.files; // 获取文件对象
      if (data.length < 1) {
        return; // 检测是否有文件拖拽到页面
      }
      const formData = new FormData();
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        formData.append(
          "uploadfile",
          e.dataTransfer.files[i],
          e.dataTransfer.files[i].name
        );
      }
      this.files = e.dataTransfer.files[0];
      this.edits = {};
      // this.fileList = this.fileList.concat(e.dataTransfer.files[0]);
    };
    this.$refs.select_frame.ondragenter = e => {
      e.preventDefault(); //阻止拖入时的浏览器默认行为
      this.$refs.select_frame.border = "2px dashed red";
    };
    this.$refs.select_frame.ondragover = e => {
      e.preventDefault(); //阻止拖来拖去的浏览器默认行为
    };
  },
  methods: {
    fileChange(event) {
      this.files = event.target.files[0];
      console.log(this.files);
      this.edits = {};
    },
    // 触发文件选择事件
    getFile() {
      // 事件委托点击
      this.$refs.file.click();
    },

    // 删除
    goCancel(name) {
      if (name == "add") {
        this.files = {};
      } else if (name == "edit") {
        this.edits = {};
      }
    },
    //   点击标签
    changeLabel(item) {
      this.formItem.tag = item.value;
      this.labelCode = item.code;
    },

    // 父级点击添加附件
    getEnclosureParams() {
      this.isPage = "add";
      this.$refs.formItem.resetFields();
      this.files = {};
      this.edits = {};
      if (this.formItem.id) {
        delete this.formItem.id;
      }
    },

    // 父级点击编辑附件
    getEditEnclosureParams(v) {
      this.isPage = "edit";
      this.files = {};
      //   getCusEnclosureDetail({ ids: v.id }).then(res => {
      //     console.log(res);
      //     let { id, annexName, annexType, tag, remark } = res.result;
      //     this.edits = res.result;
      //     this.formItem.id = id;
      //     if (annexName !== null) {
      //       this.formItem.annexName = annexName;
      //     }
      //     if (annexType !== null) {
      //       this.formItem.annexType = annexType;
      //     }
      //     if (tag !== null) {
      //       this.formItem.tag = tag;
      //     }
      //     if (remark !== null) {
      //       this.formItem.remark = remark;
      //     }
      //   });
    },

    goInput() {
      if (!this.formItem.tag) {
        this.labelCode = this.formItem.tag;
      }
    },
    ok() {
      let formData = new FormData();

      if (this.files && this.files.name) {
        let newForm = JSON.parse(JSON.stringify(this.formItem));
        let filesName = this.files.name.split(".");

        formData.append("annexName", filesName[0]);
        formData.append("annexType", filesName[1]);
        if (this.labelCode) {
          formData.append("tag", this.labelCode);
        }
        formData.append("remark", newForm.remark);
        if (newForm.id) {
          formData.append("id", newForm.id);
        }

        formData.append("relationTargetType", this.relationTargetType);
        if (this.$route.params.id) {
          formData.append("relationTargetId", this.$route.params.id);
        } else {
          formData.append("relationTargetId", this.annexTargetId);
        }

        formData.append("file", this.files);
        this.$emit("editEnclosureOk", formData);
      } else {
        let newForm = JSON.parse(JSON.stringify(this.formItem));
        formData.append("annexName", this.edits.annexName);
        formData.append("annexType", this.edits.annexType);
        if (this.labelCode) {
          formData.append("tag", this.labelCode);
        }
        formData.append("remark", newForm.remark);
        formData.append("relationTargetType", this.relationTargetType);
        if (this.$route.params.id) {
          formData.append("relationTargetId", this.$route.params.id);
        } else {
          formData.append("relationTargetId", this.annexTargetId);
        }

        if (newForm.id) {
          formData.append("id", newForm.id);
        }

        this.$refs.formItem.validate(valid => {
          if (valid) {
            this.$emit("editEnclosureOk", formData);
          } else {
          }
        });
      }
    },

    cancel() {
      this.$emit("editEnclosureCancel");
    }
  }
};
</script>
<style lang="scss" scoped>
.enclo {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  background: rgb(246, 246, 246);
  color: rgb(54, 144, 206);
  padding: 0 10px;
  margin-top: 15px;
  span {
    width: 20%;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }
}
.bottom {
  display: flex;
  flex-direction: column;
  background: rgb(246, 246, 246);
  padding: 15px;
  width: 400px;
  .bottom-i {
    display: flex;
    justify-content: space-between;
  }
}

.upload_box {
  width: 400px;
  height: 120px;
  border: 1px dashed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .one {
    font-size: 48px;
    color: rgb(43, 130, 245);
  }
}
</style>