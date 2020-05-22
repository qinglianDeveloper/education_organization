<template>
  <div>
    <Modal
      v-model="addContactStatus"
      :title="addContactTitle"
      :closable="false"
      :width="600"
      :mask-closable="false"
    >
      <Form
        ref="formItem"
        class="formInfo"
        :model="formItem"
        :label-width="70"
        label-position="right"
        :rules="ruleValidate"
      >
        <div style="display: flex;">
          <FormItem label="联系人：" prop="name" :label-width="100">
            <Input
              v-model="formItem.name"
              placeholder="请输入联系人"
              style="width: 150px;margin-right:20px;"
            ></Input>
          </FormItem>

          <FormItem label="联系电话：" prop="mobilePhone" :label-width="100">
            <Input v-model="formItem.mobilePhone" placeholder="请输入联系电话" style="width: 150px;"></Input>
          </FormItem>
        </div>

        <div style="display: flex;">
          <FormItem label="部门：" prop="department" :label-width="100">
            <Input
              v-model="formItem.department"
              placeholder="请输入部门"
              style="width: 150px;margin-right:20px;"
            ></Input>
          </FormItem>
          <FormItem label="职务：" prop="position" :label-width="100">
            <Input v-model="formItem.position" placeholder="请输入职务" style="width: 150px;"></Input>
          </FormItem>
        </div>

        <FormItem label="性别：" prop="sex" :label-width="100">
          <RadioGroup v-model="formItem.sex">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
            <Radio label="未知">未知</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem
          v-if="typeName=='customer'||typeName=='BO'"
          label
          prop="isDefault"
          :label-width="100"
        >
          <Checkbox v-model="formItem.isDefault">默认联系人</Checkbox>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  props: ["addContactStatus", "addContactTitle", "typeName"],
  data() {
    return {
      //表单字段
      formItem: {
        name: "",
        mobilePhone: "",
        department: "",
        position: "",
        sex: "",
        isDefault: false
      },
      // 表单验证
      ruleValidate: {
        name: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: "blur"
          }
        ],
        mobilePhone: [
          {
            type: "number",
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur",
            transform(value) {
              var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
              if (!myreg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    // 父级点击新增联系人
    getParamsList(value) {
      this.$refs.formItem.resetFields();
      this.formItem.id = "";
    },

    // 父级点击编辑联系人
    getEditParamsList(value) {
      this.formItem.id = value.editContactId;
    },

    // 父级--客户详情--添加联系人
    getAddContactParams() {
      this.$refs.formItem.resetFields();
      this.formItem.id = "";
      this.formItem.customerId = this.$route.params.id;
    },

    ok() {
      let newForm = JSON.parse(JSON.stringify(this.formItem));
      let { sex, isDefault } = this.formItem;
      if (sex == "男") {
        newForm.sex = "Man";
      } else if (sex == "女") {
        newForm.sex = "Woman";
      } else if (sex == "未知") {
        newForm.sex = "Unknown";
      }

      if (isDefault) {
        newForm.isDefault = 1;
      } else {
        newForm.isDefault = 0;
      }
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.$emit("addContactOk", newForm);
            }, 50);
          });
        } else {
        }
      });
    },
    cancel() {
      this.$emit("addContactCancel");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>