<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 10:45:11
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 09:52:21
 -->
<template>
  <Row>
    <div class="search">
      <Form :model="formDate" ref="searchForm" style="display:flex;float:left" :label-width="60">
        <FormItem label="姓名">
          <Input v-model="formDate.salesName" placeholder="请输入姓名" />
        </FormItem>
        <FormItem label="年月">
          <DatePicker
            v-model="formDate.date"
            type="month"
            placeholder="请选择年月"
            style="width: 200px"
            @on-change="selectDate"
            :clearable="false"
            transfer
          ></DatePicker>
        </FormItem>
      </Form>
      <Button type="primary" @click="handleSearch" style="float:right;margin:11px 0">搜索</Button>
    </div>
  </Row>
</template>
<script>
export default {
  props: {
    form: {
      type: Object
    }
  },
  watch: {
    form: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        console.log(1111, val);
        this.formDate.date = val.date;
        this.formDate.year = val.year;
        this.formDate.month = val.month;
      },
      immediate: true
    }
  },
  data() {
    return {
      formDate: {}
    };
  },

  methods: {
    // 搜索按钮
    handleSearch() {
      let obj = JSON.parse(JSON.stringify(this.formDate));
      delete obj.date;
      let arr = [];
      arr.push(obj.year);
      arr.push(obj.month);
      obj.date = arr.join("-");
      this.$emit("handleSearch", obj);
    },
    selectDate(val) {
      this.formDate.date = val;
      let arr = val.split("-");
      this.formDate.year = arr[0];
      this.formDate.month = arr[1];
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding: 0 6px;
  margin-bottom: 10px;
  overflow: hidden;
  .ivu-form {
    .ivu-form-item {
      margin: 10px 0;
      margin-right: 12px;
    }
  }
}
</style>