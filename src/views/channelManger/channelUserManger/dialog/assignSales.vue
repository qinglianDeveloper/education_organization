<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-05 20:34:07
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-05 22:31:11
 -->
<template>
  <Modal v-model="modalStatus" title="指派销售" @on-cancel="handleCancle">
    <Form ref="formValidate" :model="form" :rules="ruleValidate">
      <FormItem label="销售人员:" prop="salesId" :label-width="100">
        <Select v-model="form.salesId" placeholder="请选择需要分配的销售人员">
          <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
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
import { salesList, assignSales } from "@/api";
export default {
  props: {
    status: {
      type: Boolean
    },
    assingRow: {}
  },
  watch: {
    status(val) {
      this.modalStatus = val;
      this.$refs["formValidate"].resetFields();
      if (val) {
        this.getUserList();
      }
    }
  },
  data() {
    return {
      modalStatus: false,
      loading: false,
      form: {
        salesId: ""
      },
      ruleValidate: {
        salesId: [
          {
            required: true,
            message: "请选择销售人员",
            trigger: "change",
            type: "number"
          }
        ]
      },
      userList: []
    };
  },
  methods: {
    getUserList() {
      return salesList().then(res => {
        if (res.code == 200) {
          let list = [];
          res.result.map(item => {
            let obj = { value: item.id, label: item.name };
            list.push(obj);
            return list;
          });
          this.userList = list;
        }
      });
    },
    handleCancle() {
      this.modalStatus = false;
      this.$emit("handleCancle");
    },
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        // console.log(valid);
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form));
          obj.id = this.assingRow.id;
          this.loading = true;
          assignSales(obj).then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.$emit("handleCancle");
              this.$emit("channgeTableData");
              this.$Message.success(res.message);
            } else {
              this.loading = false;
            }
          });
        }
      });
    }
  }
};
</script>