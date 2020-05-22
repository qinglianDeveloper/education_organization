<template>
  <div class="edit-box">
    <Modal v-model="editShow" :title="title" @on-ok="ok" @on-cancel="cancel" width="900">
      <Form :model="tankForm" :label-width="150" inline :rules="ruleValidate" ref="tankForm">
        <FormItem label="手机号" prop="mobilePhone">
          <Input
            class="input"
            v-model="tankForm.mobilePhone"
            placeholder="请输入手机号"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="代理名称" prop="corpName">
          <Input
            class="input"
            v-model="tankForm.corpName"
            placeholder="请输入代理名称"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="渠道名称" prop="channelName">
          <Input
            class="input"
            v-model="tankForm.channelName"
            placeholder="请输入渠道名称"
            style="width:260px"
          />
        </FormItem>

        <FormItem label="所属销售" prop="salesUserId">
          <Select
            v-model="tankForm.salesUserId"
            placeholder="请选择销售"
            style="width:260px"
            :disabled="title=='新增'?false:true"
          >
            <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>

        <FormItem label="企业名称" prop="companyName">
          <Input
            class="input"
            v-model="tankForm.companyName"
            placeholder="请输入企业名称"
            style="width:260px"
          />
        </FormItem>
        <!-- <FormItem label="注册时间" prop="registDate">
          <DatePicker type="date" placeholder="请选择注册时间" style="width: 260px"></DatePicker>
        </FormItem>-->
        <FormItem label="注册机关" prop="registAuthority">
          <Input
            v-model="tankForm.registAuthority"
            type="text"
            placeholder="请输入注册机关"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="注册编号" prop="registNumber">
          <Input
            v-model="tankForm.registNumber"
            type="text"
            placeholder="请输入注册编号"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="注册资金" prop="registMoney">
          <Input v-model="tankForm.registMoney" placeholder="请输入注册资金" style="width:260px" number />
        </FormItem>
        <FormItem label="法人姓名" prop="legalPersonName">
          <Input v-model="tankForm.legalPersonName" placeholder="请输入法人姓名" style="width:260px" />
        </FormItem>
        <FormItem label="法人电话" prop="legalPersonPhone">
          <Input
            v-model="tankForm.legalPersonPhone"
            type="text"
            placeholder="请输入法人电话"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="单位地址" prop="companyAddress">
          <Input v-model="tankForm.companyAddress" placeholder="请输入单位地址" style="width:260px" />
        </FormItem>
        <FormItem label="单位电话" prop="companyPhone">
          <Input v-model="tankForm.companyPhone" placeholder="请输入单位电话" style="width:260px" />
        </FormItem>
        <FormItem label="企业性质" prop="companyNature">
          <Input
            v-model="tankForm.companyNature"
            type="text"
            placeholder="请输入企业性质"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="职工人数" prop="numberOfWorkers">
          <Input
            v-model="tankForm.numberOfWorkers"
            placeholder="请输入职工人数"
            style="width:260px"
            number
          />
        </FormItem>
        <FormItem label="主要经营产品类型" prop="productType">
          <Input
            v-model="tankForm.productType"
            type="text"
            placeholder="请输入主要经营产品类型"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="主要客户群体类型" prop="customerType">
          <Input
            v-model="tankForm.customerType"
            type="text"
            placeholder="请输入主要客户群体类型"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="主要业务详细描述" prop="businessDescription">
          <Input
            v-model="tankForm.businessDescription"
            type="text"
            placeholder="请输入主要业务详细描述"
            style="width:260px"
          />
        </FormItem>
        <FormItem label="附件">
          <!-- <Upload
            multiple
            type="drag"
            :action="uploadAction"
            :data="file"
            :before-upload="handleBefore"
            :on-success="handleSuccess"
          >
            <div style="width:260px">
              <p>上传</p>
            </div>
          </Upload>-->
          <upload-remark @success="reportUpload" ref="remarkRef" :data="tankForm.file" :fileNum="1"></upload-remark>
        </FormItem>
        <FormItem label="是否启用">
          <RadioGroup v-model="tankForm.status">
            <Radio label="ENABLE">启用</Radio>
            <Radio label="DISABLE">禁用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="handelSubmitGroup">取消</Button>
        <Button type="primary" @click="ok" :loading="loading">
          <span v-if="!loading">确定</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getById,
  updateAgentTop,
  salesList,
  uploadAction,
  addAgentTop
} from "@/api";
import { dateFormat } from "@/utils/current";
import config from "@/config";
import uploadRemark from "@/components/uploadRemark";
export default {
  components: { uploadRemark },
  data() {
    return {
      loading: false,
      file: { title: "" },
      single: "",
      title: "编辑",
      salesName: "",
      editShow: false,
      userList: [],
      uploadAction: uploadAction,
      AddressIdList: [
        { value: "PASSED", label: "通过" },
        { value: "REJECT", label: "待审核" },
        { value: "WAITTING", label: "拒绝" }
      ],
      ruleValidate: {
        mobilePhone: [
          {
            required: true,
            message: "手机号码不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        corpName: [
          {
            required: true,
            message: "代理名称不能为空",
            trigger: "blur"
          }
        ],
        channelName: [
          {
            required: true,
            message: "渠道名称不能为空",
            trigger: "blur"
          }
        ],
        salesUserId: [
          {
            required: true,
            message: "所属销售不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        companyName: [
          // 公司类型
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur"
          }
        ],
        registDate: [
          // {
          //   required: true,
          //   message: "注册时间不能为空",
          //   trigger: "blur"
          // }
        ],
        registAuthority: [
          {
            required: true,
            message: "注册机关不能为空",
            trigger: "blur"
          }
        ],
        registNumber: [
          {
            required: true,
            message: "注册编号不能为空",
            trigger: "blur"
          }
        ],
        registMoney: [
          {
            required: true,
            message: "注册资金不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        legalPersonName: [
          {
            required: true,
            message: "法人姓名不能为空",
            trigger: "blur"
          }
        ],
        legalPersonPhone: [
          {
            required: true,
            message: "法人手机不能为空",
            trigger: "blur"
          }
        ],
        companyAddress: [
          {
            required: true,
            message: "单位地址不能为空",
            trigger: "blur"
          }
        ],
        companyPhone: [
          {
            required: true,
            message: "单位电话不能为空",
            trigger: "blur"
          }
        ],
        companyNature: [
          {
            required: true,
            message: "企业性质不能为空",
            trigger: "blur"
          }
        ],
        numberOfWorkers: [
          {
            required: true,
            message: "职工人数不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        productType: [
          {
            required: true,
            message: "主要经营产品类型不能为空",
            trigger: "blur"
          }
        ],
        customerType: [
          {
            required: true,
            message: "主要客户群体类型不能为空",
            trigger: "blur"
          }
        ],
        businessDescription: [
          {
            required: true,
            message: "主要业务详细描述不能为空",
            trigger: "blur"
          }
        ]
      },
      tankForm: {
        mobilePhone: "", //联系电话
        corpName: "", //代理名称
        channelName: "", //渠道名称
        salesUserId: "", //销售Id
        supportAddressId: "", //服务区域
        registDate: "", //注册时间
        registAuthority: "", //注册机关
        registNumber: "", //注册编号
        registMoney: "", //注册资金
        legalPersonName: "", //法人姓名
        legalPersonPhone: "", //法人电话
        companyAddress: "", //单位地址
        companyPhone: "", //单位电话
        companyNature: "", //企业性质
        numberOfWorkers: "", //职工人数
        productType: "", //主要经营产品类型
        customerType: "", //主营客户群体类型
        businessDescription: "", //主营业务详细描述
        companyName: "", //公司类型
        file: "", //附件
        status: "ENABLE" //状态(有效:ENABLE,无效:DISABLE)
      }
    };
  },
  created() {
    this.uploadAction = config.uploadAction; //上传文件路径
  },
  props: ["modal", "modaltype", "EditId"],
  watch: {
    modal(newVal) {
      this.editShow = newVal;
      // console.log(this.EditId);
      if (this.modaltype != 1) {
        this.tankForm.id = this.EditId;
        this._getById();
      } else {
        this.tankForm = {};
      }
    },
    modaltype(newVal) {
      newVal == 1 ? (this.title = "新增") : (this.title = "编辑");
    }
    // EditId(newVal) {
    //   this.tankForm.id = newVal;
    //   if (newVal != 1) {
    //     this._getById();
    //   } else {
    //     this.tankForm = {};
    //   }
    // }
  },
  created() {
    this._salesList();
  },
  methods: {
    /**
     * 附件上传成功回调
     */
    reportUpload(urls) {
      // console.log(urls);
      this.tankForm.file = urls;
    },
    //获取详情接口渲染
    _getById() {
      let obj = { id: this.tankForm.id };
      getById(obj).then(res => {
        if (res.code == 200) {
          console.log("dddd", res);
          this.tankForm = res.result;
          if (res.result.sales) {
            this.salesName = res.result.sales.name;
            this.tankForm.salesUserId = res.result.sales.userId;
          }
          this.tankForm.registDate = dateFormat(res.result.createdTime);
          // createdTime
        }
      });
    },
    ok() {
      this.$refs.tankForm.validate(valid => {
        // console.log(valid);
        if (valid) {
          if (this.title == "新增") {
            this.loading = true;
            addAgentTop(this.tankForm).then(res => {
              if (res.code == 200) {
                this.loading = false;
                this.$Message.success(res.message);
                this.tankForm = {};
                this.$emit("ShowChildren", false);
                this.editShow = false;
              } else {
                this.loading = false;
              }
            });
          } else {
            this.loading = true;
            updateAgentTop(this.tankForm).then(res => {
              if (res.code == 200) {
                this.loading = false;
                this.$Message.success(res.message);
                this.tankForm = {};
                this.$emit("ShowChildren", false);
                this.editShow = false;
              } else {
                this.loading = false;
              }
            });
          }
        }
      });
    },
    _salesList() {
      salesList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          let list = [];
          arr.map(item => {
            let obj = { value: item.userId, label: item.name };
            list.push(obj);
            return list;
          });
          this.userList = list;
        }
      });
    },
    cancel() {
      this.$emit("ShowChildren", false);
      this.tankForm = {};
    },
    handelSubmitGroup() {
      this.$emit("ShowChildren", false);
      this.tankForm = {};
    },
    handleBefore(file) {
      this.file.title = file.name;
    },
    //获取图片 -- 刘康
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.tankForm.file = res.message;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
