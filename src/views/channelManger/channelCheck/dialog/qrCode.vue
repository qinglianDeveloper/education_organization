<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-06 13:44:54
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-21 15:31:26
 -->
<template>
  <Modal
    v-model="dialogStatus"
    title="代理商审核-详情（扫销售二维码进来）"
    :mask-closable="false"
    @on-cancel="handleCancle"
    :width="800"
  >
    <div style="height:600px;overflow:auto">
      <detail :formData="formData"></detail>
      <Divider />
      <Form :model="form" ref="form" :rules="rules" :label-width="140">
        <FormItem label="审核结果:" prop="auditStatus">
          <RadioGroup v-model="form.auditStatus" @on-change="changeResult">
            <Radio label="PASSED" style="margin-right:20px">同意</Radio>
            <Radio label="REJECT">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="form.auditStatus=='PASSED'" label="代理分类:" prop="applyType" key="applyType">
          <RadioGroup v-model="form.applyType" @on-change="changeType">
            <Radio label="AGENTTOP" style="margin-right:20px">区域代理</Radio>
            <Radio label="ISV">用户代理</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          v-else-if="form.auditStatus=='REJECT'"
          label="拒绝理由:"
          prop="auditResultDesc"
          key="auditResultDesc"
        >
          <Input v-model="form.auditResultDesc" />
        </FormItem>

        <div v-if="form.applyType=='AGENTTOP'" key="second">
          <FormItem label="默认佣金比例:" prop="default">
            <div style="display:flex">
              <div style="margin-right:20px">
                <Input
                  style="width:140px;margin-right:2px"
                  v-model="form.default.ratioTop"
                  placeholder="区域代理比例"
                />
                <span style="font-weight:bold">%</span>
              </div>

              <div style="margin-right:20px">
                <Input
                  style="width:140px;margin-right:2px"
                  v-model="form.default.ratioCustomer"
                  placeholder="用户比例"
                />
                <span style="font-weight:bold">%</span>
              </div>
            </div>
          </FormItem>
          <FormItem label="默认二级佣金比例:" prop="second">
            <div style="display:flex">
              <div style="margin-right:20px">
                <Input
                  style="width:140px;margin-right:2px"
                  v-model="form.second.secondRatioTop"
                  placeholder="区域代理比例"
                />
                <span style="font-weight:bold">%</span>
              </div>
              <div style="margin-right:20px">
                <Input
                  style="width:140px;margin-right:2px"
                  v-model="form.second.ratioSecond"
                  placeholder="直销代理比例额"
                />
                <span style="font-weight:bold">%</span>
              </div>
              <div style="margin-right:20px">
                <Input
                  style="width:140px;margin-right:2px"
                  v-model="form.second.secondRatioCustomer"
                  placeholder="用户比例"
                />
                <span style="font-weight:bold">%</span>
              </div>
            </div>
          </FormItem>
        </div>

        <div v-else-if="form.applyType=='ISV'" key="one">
          <FormItem label="默认一级佣金比例:" prop="default">
            <div style="display:flex">
              <div style="margin-right:20px">
                <Input
                  style="width:140px;margin-right:2px"
                  v-model="form.default.ratioTop"
                  placeholder="用户代理比例"
                />
                <span style="font-weight:bold">%</span>
              </div>

              <div style="margin-right:20px">
                <Input
                  style="width:140px;margin-right:2px"
                  v-model="form.default.ratioCustomer"
                  placeholder="用户比例"
                />
                <span style="font-weight:bold">%</span>
              </div>
            </div>
          </FormItem>
        </div>
      </Form>
    </div>
    <div slot="footer">
      <Button type="default" @click="handleCancle">取消</Button>
      <Button type="primary" @click="handleSubmit" :loading="loading">
        <span v-if="!loading">确定</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
  </Modal>
</template>
<script>
import { applyId, auditAgent } from "@/api";
import detail from "../components/detail";
export default {
  props: { status: { type: Boolean }, id: {} },
  watch: {
    status(val) {
      this.dialogStatus = val;
      if (val) {
        this.$refs["form"].resetFields();
        this.form = {
          auditStatus: "",
          applyType: "",
          auditResultDesc: "",
          default: {
            ratioTop: "",
            ratioCustomer: ""
          },
          second: {
            secondRatioTop: "",
            ratioSecond: "",
            secondRatioCustomer: ""
          }
        };
        this.getCheckInfo();
      }
    }
  },
  components: { detail },
  data() {
    const validCommission = (rule, value, callback) => {
      let top = value.ratioTop * 1;
      let down = value.ratioCustomer * 1;
      var regPos = /^\d+(\.\d+)?$/;
      if (!value.ratioTop) {
        callback(new Error("请输入相对应的比例"));
      } else if (!value.ratioCustomer) {
        callback(new Error("请输入相对应的比例"));
      } else if (
        !regPos.test(value.ratioTop) ||
        !regPos.test(value.ratioCustomer)
      ) {
        callback(new Error("请输入非负数字"));
      } else if (top + down > 100) {
        callback(new Error("总计不超过100%"));
      } else {
        callback();
      }
    };
    const validDefault = (rule, value, callback) => {
      let top = value.secondRatioTop * 1;
      let selling = value.ratioSecond * 1;
      let customer = value.secondRatioCustomer * 1;
      var regPos = /^\d+(\.\d+)?$/;
      if (!value.secondRatioTop) {
        callback(new Error("请输入相对应的比例"));
      } else if (!value.ratioSecond) {
        callback(new Error("请输入相对应的比例"));
      } else if (!value.secondRatioCustomer) {
        callback(new Error("请输入相对应的比例"));
      } else if (
        !regPos.test(value.secondRatioTop) ||
        !regPos.test(value.ratioSecond) ||
        !regPos.test(value.secondRatioCustomer)
      ) {
        callback(new Error("请输入非负数字"));
      } else if (top + selling + customer > 100) {
        callback(new Error("总计不超过100%"));
      } else {
        callback();
      }
    };
    return {
      dialogStatus: false,
      loading: false,
      formData: {},
      form: {
        auditStatus: "",
        applyType: "",
        auditResultDesc: "",
        default: {
          ratioTop: "",
          ratioCustomer: ""
        },
        second: {
          secondRatioTop: "",
          ratioSecond: "",
          secondRatioCustomer: ""
        }
      },
      rules: {
        auditStatus: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ],
        applyType: [
          { required: true, message: "请选择代理类型", trigger: "change" }
        ],
        auditResultDesc: [
          { required: true, message: "请输入拒绝理由", trigger: "blur" }
        ],
        default: [
          {
            type: "object",
            required: true,
            validator: validCommission
          }
        ],
        second: [
          {
            type: "object",
            required: true,
            validator: validDefault
          }
        ]
      }
    };
  },
  methods: {
    getCheckInfo() {
      applyId({ id: this.id }).then(res => {
        if (res.code == 200) {
          this.formData = res.result;
        }
      });
    },
    handleCancle() {
      this.dialogStatus = false;
      this.$emit("handleCancle");
    },
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let obj = JSON.parse(JSON.stringify(this.form));
          delete obj.default;
          delete obj.second;
          if (this.form.default.ratioTop) {
            obj.ratioTop = this.form.default.ratioTop;
          }
          if (this.form.default.ratioCustomer) {
            obj.ratioCustomer = this.form.default.ratioCustomer;
          }
          if (this.form.second.secondRatioTop) {
            obj.secondRatioTop = this.form.second.secondRatioTop;
          }
          if (this.form.second.ratioSecond) {
            obj.ratioSecond = this.form.second.ratioSecond;
          }
          if (this.form.second.secondRatioCustomer) {
            obj.secondRatioCustomer = this.form.second.secondRatioCustomer;
          }
          obj.id = this.formData.id;
          if (this.formData.salesId) obj.salesId = this.formData.salesId;
          if (this.formData.agentId) obj.agentId = this.formData.agentId;
          auditAgent(obj).then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.$Message.success(res.message);
              this.$emit("channgeTableData");
              this.$emit("handleCancle");
            } else {
              this.loading = false;
            }
          });
        }
      });
    },
    changeResult(val) {
      if (val == "PASSED") {
        this.form.auditResultDesc = "";
      } else if (val == "REJECT") {
        this.form.applyType = "";
        this.form.default = {
          ratioTop: "",
          ratioCustomer: ""
        };
        this.form.second = {
          secondRatioTop: "",
          ratioSecond: "",
          secondRatioCustomer: ""
        };
      }
    },
    changeType(val) {
      this.form.default = {
        ratioTop: "",
        ratioCustomer: ""
      };
      this.form.second = {
        secondRatioTop: "",
        ratioSecond: "",
        secondRatioCustomer: ""
      };
    }
  }
};
</script>