<!-- 公司信息维护 -->
<template>
  <div class="info">
    <Divider>公司信息维护</Divider>
    <!-- 编辑信息 -->
    <div class="edit">
      <Form ref="companyInfo" :model="companyInfo" :label-width="100" :rules="rules" class="form">
        <div style="display:flex">
          <FormItem label="公司官网:" prop="website" style="flex:1;margin-right:20px">
            <Input v-model="companyInfo.website" />
          </FormItem>
          <FormItem label="后台地址:" prop="websiteAdmin" style="flex:1">
            <Input v-model="companyInfo.websiteAdmin" />
          </FormItem>
        </div>
        <div style="display:flex">
          <FormItem label="座机号码:" prop="telephone" style="flex:1;margin-right:20px">
            <Input v-model="companyInfo.telephone" class="input" />
          </FormItem>
          <FormItem label="发票地址:" prop="invoiceAddress" style="flex:1">
            <Input v-model="companyInfo.invoiceAddress" class="input" />
          </FormItem>
        </div>
        <div style="display:flex">
          <FormItem label="发票联系人:" prop="invoiceContact" style="flex:1;margin-right:20px">
            <Input v-model="companyInfo.invoiceContact" class="input" />
          </FormItem>
          <FormItem label="手机号:" prop="invoiceContactMobile" style="flex:1">
            <Input v-model="companyInfo.invoiceContactMobile" class="input" />
          </FormItem>
        </div>
        <div style="display:flex">
          <FormItem label="授权书:" prop="proxyLetter" style="flex:1;margin-right:20px">
            <uploadImage
              ref="uploadImage"
              :imgNum="1"
              :data="companyInfo.proxyLetter"
              @success="proxySuccess"
            />
          </FormItem>
          <FormItem label="发票图片:" prop="invoicePicUrl" style="flex:1">
            <uploadImage
              ref="uploadImage"
              :imgNum="1"
              :data="companyInfo.invoicePicUrl"
              @success="uploadSuccess"
            />
          </FormItem>
        </div>
        <FormItem label="公司简介:" prop="desc">
          <Input type="textarea" v-model="companyInfo.desc" class="input" />
        </FormItem>
        <FormItem label="证照信息:" prop="certificate">
          <tinymce-editor
            ref="editor"
            v-model="companyInfo.certificate"
            :disabled="false"
            :language="'zh_CN'"
            :skin="'oxide'"
          ></tinymce-editor>
        </FormItem>
      </Form>
      <Row type="flex" justify="center">
        <Button type="primary" @click="updateCompanyInfo" :loading="submitloading">
          <span v-if="!submitloading">保存</span>
          <span v-else>Loading...</span>
        </Button>
        <!-- <Button style="margin-left:10px">取消</Button> -->
      </Row>
    </div>
  </div>
</template>
<script>
import uploadImage from "@/components/uploadImage";
import TinymceEditor from "@/components/tinymce-editor/tinymce-editor";
import { getCompanyInfo, updateCompanyInfo } from "@/api";
export default {
  name: "companyInfo",
  components: { uploadImage, TinymceEditor },
  data() {
    return {
      submitloading: false,
      companyInfo: {
        website: "",
        telephone: "",
        invoiceAddress: "",
        invoiceContact: "",
        invoiceContactMobile: "",
        invoicePicUrl: "",
        desc: "",
        certificate: "",
        proxyLetter: "", //授权书
        websiteAdmin: "" //后台地址
      },
      rules: {
        website: [
          { required: true, message: "官网地址不能为空", trigger: "blur" },
          {
            type: "string",
            max: 50,
            message: "不能超过50位",
            trigger: "change"
          }
        ],
        telephone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "必须为数字", trigger: "change" },
          { max: 20, message: "不能超过20位", trigger: "change" }
        ],
        invoiceAddress: [
          { required: true, message: "发票地址不能为空", trigger: "blur" },
          {
            type: "string",
            max: 50,
            message: "不能超过50位",
            trigger: "change"
          }
        ],
        invoiceContact: [
          { required: true, message: "发票联系人不能为空", trigger: "blur" },
          {
            type: "string",
            max: 10,
            message: "不能超过10位",
            trigger: "change"
          }
        ],
        invoiceContactMobile: [
          { required: true, message: "联系人手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ],
        desc: [
          { required: true, message: "公司简介不能为空", trigger: "blur" },
          {
            type: "string",
            max: 50,
            message: "不能超过50位",
            trigger: "change"
          }
        ],
        certificate: [
          { required: true, message: "公司简介不能为空", trigger: "blur" }
        ],
        proxyLetter: [
          {
            required: true,
            message: "请上传授权书",
            trigger: "blur",
            trigger: "change"
          }
        ],
        websiteAdmin: [
          { required: true, message: "后台管理地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCompanyInfo();
  },
  methods: {
    getCompanyInfo() {
      getCompanyInfo().then(res => {
        if (res.code == 200 && res.result) {
          this.companyInfo = res.result;
        }
      });
    },
    uploadSuccess(e) {
      this.companyInfo.invoicePicUrl = e;
    },
    proxySuccess(e) {
      this.companyInfo.proxyLetter = e;
    },
    updateCompanyInfo() {
      this.$refs.companyInfo.validate(valid => {
        if (valid) {
          this.submitloading = true;
          for (let i in this.companyInfo) {
            if (
              this.companyInfo[i] == undefined ||
              this.companyInfo[i] == "undefined"
            ) {
              delete this.companyInfo[i];
            }
            if (i == "createdTime") {
              delete this.companyInfo[i];
            }
            if (i == "updateTime") {
              delete this.companyInfo[i];
            }
          }
          updateCompanyInfo(this.companyInfo).then(res => {
            if (res.code == 200) {
              setTimeout(() => {
                this.$Message.success(res.message);
                this.submitloading = false;
              }, 1000);
            } else {
              this.submitloading = false;
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.info {
  padding: 16px;
  position: relative;
  .edit {
    margin-top: 20px;
    height: calc(100vh - 300px);
    width: 70%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    .form {
      height: calc(100% - 30px);
      overflow: auto;
    }
  }
  .input {
    width: 100%;
  }
}
</style>