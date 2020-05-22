<!-- 联系人信息 -->
<template>
  <div class="prrson-info">
    <Form disabled :label-width="100" :model="prrsonInfo">
      <FormItem label="联系人：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.userName" />
      </FormItem>
      <FormItem label="邮箱：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.email" />
      </FormItem>
      <FormItem label="公司名称：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.companyName" />
      </FormItem>
      <FormItem label="地址：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.addressDetail" />
      </FormItem>
      <FormItem label="联系电话：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.mobile" />
      </FormItem>
      <FormItem label="预约时间：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.appointmentTime" />
      </FormItem>
      <FormItem label="支持方式：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.supportWay" />
      </FormItem>
      <FormItem label="备注：">
        <Input type="text" style="width:400px" v-model="prrsonInfo.remark" />
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: "prrson-info",
  props: { order: Object },
  data() {
    return {
      prrsonInfo: {}
    };
  },
  watch: {
    order(val) {
      this.prrsonInfo = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.prrson-info {
  padding: 6px 80px;
}
</style>