<template>
  <div class="edit-box">
    <Modal v-model="editShow" :title="title" @on-ok="ok" @on-cancel="cancel" width="900">
      <Form :model="tankForm" :label-width="120" inline :rules="ruleValidate">
        <FormItem label="公司名称" prop="corpName">
          <Input v-model="tankForm.corpName" placeholder="请输入公司名称" style="width:300px" />
        </FormItem>
        <FormItem label="联系电话" prop="mobilePhone">
          <Input v-model="tankForm.mobilePhone" placeholder="请输入联系电话" style="width:300px" />
        </FormItem>
        <FormItem label="渠道名称" prop="channelName">
          <Input v-model="tankForm.channelName" placeholder="请输入渠道名称" style="width:300px" />
        </FormItem>
        <FormItem label="社会信用码" prop="uniformSocialCreditCode">
          <Input
            v-model="tankForm.uniformSocialCreditCode"
            placeholder="请输入社会信用码"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="审核状态" prop="auditStatus">
          <Select v-model="tankForm.auditStatus" style="width:300px">
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
        <FormItem label="企业性质">
          <Select v-model="tankForm.nature" style="width:300px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="其他联系人" prop="otherConnact">
          <Input
            v-model="tankForm.otherConnact"
            type="text"
            placeholder="请输入注册机关"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="其他联系电话" prop="otherMobilePhone">
          <Input
            v-model="tankForm.otherMobilePhone"
            type="number"
            placeholder="请输入注册编号"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="身份证" prop="idNum">
          <Input v-model="tankForm.idNum" type="number" placeholder="请输入身份证" style="width:300px" />
        </FormItem>
        <FormItem label="总代理/销售返佣比例" prop="ratioTop">
          <Input
            v-model="tankForm.ratioTop"
            type="text"
            placeholder="请输入总代理/销售返佣比例"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="二级返佣比列" prop="ratioSecond">
          <Input
            v-model="tankForm.ratioSecond"
            type="number"
            placeholder="请输入二级返佣比列"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="客户返佣比列" prop="ratioCustomer">
          <Input
            v-model="tankForm.ratioCustomer"
            type="text"
            placeholder="请输入客户返佣比列"
            style="width:300px"
          />
        </FormItem>
        <FormItem label="审核结果" prop="auditResultDesc">
          <Input
            v-model="tankForm.auditResultDesc"
            type="text"
            placeholder="请输入单位电话"
            style="width:300px"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { getById, updateAgentSecond } from "@/api";
export default {
  data() {
    return {
      title: "编辑",
      editShow: false,
      cityList: [
        { value: "PERSONAL", label: "个人" },
        { value: "COMPANY", label: "企业" }
      ],
      AddressIdList: [
        { value: "PASSED", label: "通过" },
        { value: "REJECT", label: "待审核" },
        { value: "WAITTING", label: "拒绝" }
      ],
      ruleValidate: {
        corpName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        mobilePhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        channelName: [
          { required: true, message: "渠道名称不能为空", trigger: "blur" }
        ],
        uniformSocialCreditCode: [
          { required: true, message: "请输入社会信用码", trigger: "blur" }
        ],
        corpType: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        auditStatus: [
          { required: true, message: "请选择审核结果", trigger: "blur" }
        ],
        corpType: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        nature: [
          { required: true, message: "企业性质不能为空", trigger: "blur" }
        ],
        otherConnact: [
          { required: true, message: "其他联系人不能为空", trigger: "blur" }
        ],
        otherMobilePhone: [
          { required: true, message: "其他联系电话不能为空", trigger: "blur" }
        ],
        idNum: [{ required: true, message: "身份证不能为空", trigger: "blur" }],
        ratioTop: [
          {
            required: true,
            message: "总代理/销售返佣比例不能为空",
            trigger: "blur"
          }
        ],
        ratioSecond: [
          { required: true, message: "二级返佣比列不能为空", trigger: "blur" }
        ],
        ratioCustomer: [
          { required: true, message: "客户返佣比列不能为空", trigger: "blur" }
        ],
        auditResultDesc: [
          { required: true, message: "审核结果不能为空", trigger: "blur" }
        ]
      },
      tankForm: {
        id: 0,
        connact: "", //联系人 1 2
        otherConnact: "", // 其他联系人 1
        otherMobilePhone: "", // 其他联系电话 1
        mobilePhone: "", // 联系电话  1
        corpName: "", // 公司名称 1
        channelName: "", //渠道名称 1
        idNum: "", // 身份证 1
        uniformSocialCreditCode: "", // 社会信用码 1
        auditStatus: "", // 审核状态(通过/待审核/拒绝) 1
        ratioTop: "", //总代理/销售返佣比例 1
        ratioSecond: "", // 二级返佣比列 1
        ratioCustomer: "", // 客户返佣比列 1
        auditResultDesc: "", //审核结果 1
        nature: "", //企业/个人 1
        corpType: "" //公司类型 1
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
      this.tankForm.id = newVal;
      if (newVal != 1) {
        this._getById();
      } else {
        this.tankForm = {};
      }
    }
  },
  methods: {
    //获取详情接口渲染
    _getById() {
      let obj = { id: this.tankForm.id };
      getById(obj).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.tankForm = res.result;
        }
      });
    },
    ok() {
      updateAgentSecond(this.tankForm).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.$emit("ShowChildren", false);
        }
      });
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