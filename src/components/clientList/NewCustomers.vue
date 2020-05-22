<template>
  <!-- 新增客户 -->
  <Modal v-model="AddModal" title="新增客户" width="700" @on-cancel="cancel">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <FormItem label="客户名称" prop="name">
        <Input v-model="formValidate.name" style="width:300px; " />
      </FormItem>
      <FormItem label="选择用户" prop="userId">
        <Select v-model="formValidate.userId" style="width:300px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Row>
          <Col span="12">
            <FormItem label="渠道来源" prop="source">
              <Select v-model="formValidate.source" style="width:200px">
                <Option
                  v-for="item in resourceList"
                  :value="item.label"
                  :key="item.label"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="类型" prop="type">
              <Select v-model="formValidate.type" style="width:200px">
                <Option
                  v-for="item in typeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <Col span="12">
            <FormItem label="默认联系人" prop="contact">
              <Input v-model="formValidate.contact" placeholder="请输入默认联系人" style="width:200px" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="联系人电话" prop="mobilePhone">
              <Input v-model="formValidate.mobilePhone" placeholder="请输入联系人电话" style="width:200px" />
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="formValidate.remark" type="textarea" placeholder="请输入备注" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { ruleValidates } from "@/views/customerManger/table";
import { userGetList, customerSave } from "@/api";
export default {
  data() {
    return {
      AddModal: false,
      loading: false,
      cityList: [],
      userList: [],
      resourceList: [
        {
          value: "自挖掘",
          label: "SelfExplore"
        },
        {
          value: "转介绍",
          label: "OtherIntroduce"
        },
        {
          value: "线下推广",
          label: "ExpandOffline"
        },
        {
          value: "网络推广",
          label: "ExpandOnline"
        },
        {
          value: "内部资源",
          label: "InnerSource"
        },
        {
          value: "会议",
          label: "Meetting"
        },
        {
          value: "其他",
          label: "Other"
        }
      ],
      formValidate: {
        name: "",
        userId: "",
        type: "",
        source: "",
        interest: [],
        contact: "",
        mobilePhone: "",
        remark: ""
      },
      typeList: [
        {
          value: "Customer",
          label: "客户"
        },
        {
          value: "Supplier",
          label: "供应商"
        },
        {
          value: "ALYSeriver",
          label: "阿里云城市服务商"
        },
        {
          value: "ALYPartner",
          label: "阿里云合作伙伴"
        },
        {
          value: "Other",
          label: "其他"
        }
      ],
      ruleValidate: ruleValidates
    };
  },
  props: ["addShow"],
  watch: {
    addShow(newVal) {
      this.AddModal = newVal;
    }
  },
  created() {
    this.changeUser();
  },
  methods: {
    // 获取用户id
    changeUser() {
      userGetList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let obj = { value: item.id, label: item.userName };
            this.cityList.push(obj);
          });
          return this.cityList;
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          customerSave(this.formValidate).then(res => {
            if (res.code == 200) {
              this.$emit("okSubmit", false);
              sessionStorage.setItem('rowObj',res.result)
              this.$Message.success("添加成功");
            } else if (res.code == 502) {
              this.$Message.success(res.message);
            }
          });
        } else {
          this.$Message.error("请补全信息");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$emit("Submit", false);
    },
    cancel() {
      this.$emit("Submit", false);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>