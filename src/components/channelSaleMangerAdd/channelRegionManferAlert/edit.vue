<template>
  <div class="edit-box">
    <Modal v-model="editShow" :title="title" @on-ok="ok" @on-cancel="cancel" width="880">
      <Form :model="tankForm" :label-width="100" inline :rules="ruleValidate">
        <FormItem label="手机号" prop="Phone">
          <Select v-model="tankForm.mobilePhone" style="width:300px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="代理名称" prop="corpName">
          <Input v-model="tankForm.corpName" placeholder="请输入代理名称" style="width:300px" />
        </FormItem>
        <FormItem label="渠道名称" prop="channelName">
          <Input v-model="tankForm.channelName" placeholder="请输入渠道名称" style="width:300px" />
        </FormItem>
        <FormItem label="所属销售" prop="parentChannelCode">
          <Select v-model="tankForm.salesUserId" style="width:300px">
            <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属地区" prop="supportAddressId">
          <Select v-model="tankForm.supportAddressId" style="width:300px">
            <Option
              v-for="item in AddressIdList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="企业名称" prop="corpType">
          <Input v-model="tankForm.corpType" type="text" placeholder="请输入企业名称" style="width:300px" />
        </FormItem>
        <FormItem label="注册时间">
          <DatePicker type="date" placeholder="请选择注册时间" style="width:300px" @on-change="dateChange"></DatePicker>
        </FormItem>
        <FormItem label="注册机关" prop="registAuthority">
          <Input
            v-model="tankForm.registAuthority"
            type="text"
            placeholder="请输入注册机关"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="注册编号" prop="registNumber">
          <Input
            v-model="tankForm.registNumber"
            type="number"
            placeholder="请输入注册编号"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="注册资金" prop="registMoney">
          <Input
            v-model="tankForm.registMoney"
            type="number"
            placeholder="请输入注册资金"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="法人姓名" prop="legalPersonName">
          <Input
            v-model="tankForm.legalPersonName"
            type="text"
            placeholder="请输入法人姓名"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="法人电话" prop="legalPersonPhone">
          <Input
            v-model="tankForm.legalPersonPhone"
            type="number"
            placeholder="请输入法人电话"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="单位地址" prop="companyAddress">
          <Input
            v-model="tankForm.companyAddress"
            type="text"
            placeholder="请输入单位地址"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="单位电话" prop="companyPhone">
          <Input
            v-model="tankForm.companyPhone"
            type="number"
            placeholder="请输入单位电话"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="企业性质" prop="companyNature">
          <Input
            v-model="tankForm.companyNature"
            type="text"
            placeholder="请输入企业性质"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="职工人数" prop="numberOfWorkers">
          <Input
            v-model="tankForm.numberOfWorkers"
            type="number"
            placeholder="请输入职工人数"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="主要经营产品类型" prop="productType">
          <Input
            v-model="tankForm.productType"
            type="text"
            placeholder="请输入主要经营产品类型"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="主营客户群体类型" prop="customerType">
          <Input
            v-model="tankForm.customerType"
            type="text"
            placeholder="请输入主营客户群体类型"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="主营业务详细描述" prop="businessDescription">
          <Input
            type="textarea"
            :autosize="true"
            v-model="tankForm.businessDescription"
            placeholder="请输入主营业务详细描述"
          />
        </FormItem>
        <FormItem label="附件">
          <Upload :action="uploadAction" style="width:300px;" :on-success="handleSuccess">
            <Button icon="ios-cloud-upload-outline">上传</Button>
          </Upload>
        </FormItem>
        <FormItem label="是否启用" style="width:100%;">
          <RadioGroup v-model="animal" @on-change="radioChange">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import {
  addAgentTop,
  platformUser,
  salesList,
  getList,
  uploadAction,
  updateAgentTop,
  getById
} from "@/api";
export default {
  data() {
    return {
      type: 1,
      title: "新增",
      animal: "是",
      uploadAction: uploadAction,
      editShow: false,
      cityList: [],
      cityList1: [],
      AddressIdList: [],
      ruleValidate: {
        Phone: [
          { required: true, message: "请选择一个手机号", trigger: "blur" }
        ],
        corpName: [
          { required: true, message: "代理名称不能为空", trigger: "blur" }
        ],
        channelName: [
          { required: true, message: "渠道名称不能为空", trigger: "blur" }
        ],
        parentChannelCode: [
          { required: true, message: "请选择一个所属销售", trigger: "blur" }
        ],
        supportAddressId: [{ required: true, type: "number", trigger: "blur" }],
        corpType: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        // dateChange: [
        //   { required: true, message: "注册时间不能为空", trigger: "blur" }
        // ],
        registAuthority: [
          { required: true, message: "注册机关不能为空", trigger: "blur" }
        ],
        registNumber: [
          { required: true, message: "注册编号不能为空", trigger: "blur" }
        ],
        registMoney: [
          { required: true, message: "注册资金不能为空", trigger: "blur" }
        ],
        legalPersonName: [
          { required: true, message: "法人姓名不能为空", trigger: "blur" }
        ],
        legalPersonPhone: [
          { required: true, message: "法人电话不能为空", trigger: "blur" }
        ],
        companyAddress: [
          { required: true, message: "单位地址不能为空", trigger: "blur" }
        ],
        companyPhone: [
          { required: true, message: "单位电话不能为空", trigger: "blur" }
        ],
        companyNature: [
          { required: true, message: "企业性质不能为空", trigger: "blur" }
        ],
        numberOfWorkers: [
          {
            required: true,
            message: "职工人数不能为空",
            trigger: "blur"
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
            message: "主要经营产品类型不能为空",
            trigger: "blur"
          }
        ],
        businessDescription: [
          {
            required: true,
            message: "请输入主营业务详细描述不能为空",
            trigger: "blur"
          }
        ]
      },
      tankForm: {
        mobilePhone: "", // 联系电话
        corpName: "", // 代理名称
        channelName: "", //渠道名称
        salesUserId: "", // 销售编码
        supportAddressId: "", //服务区域
        registDate: "", // 注册时间
        registAuthority: "", //注册机关
        registNumber: "", //注册编码
        registMoney: "", //注册资金
        legalPersonName: "", // 法人姓名
        legalPersonPhone: "", //法人电话
        companyAddress: "", //单位地址
        companyPhone: "", //单位电话
        companyNature: "", //企业性质
        numberOfWorkers: "", //职工人数
        productType: "", //主要经营类型
        customerType: "", //主要客户群体类型
        businessDescription: "", // 主要业务相信描述
        corpType: "", //公司类型
        file: "", // 附件
        status: "ENABLE" // 状态(有效:ENABLE,无效:DISABLE)
      }
    };
  },
  props: ["modal", "modaltype", "EditId"],
  watch: {
    modal(newVal) {
      this.editShow = newVal;
    },
    modaltype(newVal) {
      newVal == 1 ? (this.title = "新增") : (this.title = "编辑");
    },
    EditId(newVal) {
      this.type = newVal;
      if(newVal != 1) {
        this._getById();
      } else {
        this.tankForm = {};
      }
        
    }
  },
  created() {
    this._platformUser();
    this._salesList();
    this._getList();
  },
  methods: {
    //获取详情接口渲染
    _getById() {
      let obj = { id: this.type };
      console.log(obj)
      getById(obj).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.tankForm = res.result;
        }
      });
    },
    //获取通用接口地址 -- 刘康
    _getList() {
      getList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          let obj;
          arr.map(item => {
            obj = { value: item.id, label: item.name };
            this.AddressIdList.push(obj);
          });
        }
      });
    },
    // 获取所属销售 -- 刘康
    _salesList() {
      salesList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let str = item.userId == null ? "" : item.userId;
            let obj = { value: str, label: str };
            this.cityList1.push(obj);
          });
        }
      });
    },
    //获取手机号码  -- 刘康
    _platformUser() {
      platformUser().then(res => {
        if (res.code == 200) {
          console.log(res);
          res.result.content.map(item => {
            let obj = { value: item.mobile, label: item.mobile };
            this.cityList.push(obj);
          });
        }
      });
    },
    ok() {
      if (this.tankForm.mobilePhone == "") {
        this.$Message.error("联系电话不能为空");
        return;
      }
      if (this.tankForm.corpName == "") {
        this.$Message.error("代理名称不能为空");
        return;
      }
      if (this.tankForm.channelName == "") {
        this.$Message.error("渠道名称不能为空");
        return;
      }
      if (this.tankForm.salesUserId == "") {
        this.$Message.error("销售编码不能为空");
        return;
      }
      if (this.tankForm.supportAddressId == "") {
        this.$Message.error("服务区域不能为空");
        return;
      }
      if (this.tankForm.registAuthority == "") {
        this.$Message.error("注册机关不能为空");
        return;
      }
      if (this.tankForm.registNumber == "") {
        this.$Message.error("注册编码不能为空");
        return;
      }
      if (this.tankForm.registMoney == "") {
        this.$Message.error("注册资金不能为空");
        return;
      }
      if (this.tankForm.legalPersonName == "") {
        this.$Message.error("法人姓名不能为空");
        return;
      }
      if (this.tankForm.legalPersonPhone == "") {
        this.$Message.error("法人电话不能为空");
        return;
      }
      if (this.tankForm.companyAddress == "") {
        this.$Message.error("单位地址不能为空");
        return;
      }
      if (this.tankForm.companyPhone == "") {
        this.$Message.error("单位电话不能为空");
        return;
      }
      if (this.tankForm.companyNature == "") {
        this.$Message.error("企业性质不能为空");
        return;
      }
      if (this.tankForm.numberOfWorkers == "") {
        this.$Message.error("职工人数不能为空");
        return;
      }
      if (this.tankForm.productType == "") {
        this.$Message.error("主要经营类型不能为空");
        return;
      }
      if (this.tankForm.customerType == "") {
        this.$Message.error("主要客户群体类型不能为空");
        return;
      }
      if (this.tankForm.businessDescription == "") {
        this.$Message.error("主要业务相信描述不能为空");
        return;
      }
      if (this.type == 1) {
        addAgentTop(this.tankForm).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("ShowChildren", false);
            this.tankForm = {};
          }
        });
      } else {
        updateAgentTop(this.tankForm).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("ShowChildren", false);
            this.tankForm = {};
          }
        });
      }
    },
    cancel() {
      this.$emit("ShowChildren", false);
      // this._getById();
    },
    //新增日期选择 -- 刘康
    dateChange(e) {
      this.tankForm.registDate = e;
    },
    //获取图片 -- 刘康
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.tankForm.file = res.message;
      }
    },
    // 单选框选择 -- 刘康
    radioChange() {
      this.animal == "是"
        ? (this.tankForm.status = "ENABLE")
        : (this.tankForm.status = "DISABLE");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>