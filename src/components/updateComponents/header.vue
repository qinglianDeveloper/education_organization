<template>
  <div class="header">
    <div class="search" ref="search">
      <Form style="display:flex" :model="searchForm">
        <FormItem label="任务类型" :label-width="70">
          <Select v-model="searchForm.taskType" clearable style="width:80px">
            <Option value="CALCULATE">计算</Option>
            <Option value="IMPORT">导入</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" :label-width="40">
          <Select v-model="searchForm.status" clearable style="width:80px">
            <Option
              v-for="(item,index) in statusList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="上传时间" :label-width="70">
          <DatePicker
            type="daterange"
            v-model="selectDate"
            format="yyyy-MM-dd"
            clearable
            @on-change="selectDateRange"
            placeholder="选择起始时间"
            style="width:160px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button icon="md-search" type="primary" @click="handleSearch">搜索</Button>
        </FormItem>
        <FormItem>
          <Button icon="md-cloud-upload" type="success" @click="updataAdd">上传</Button>
        </FormItem>
        <FormItem>
          <Button icon="ios-redo" @click="Refresh">刷新</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      statusList: [
        { value: "PENDING", label: "待执行" },
        { value: "INTERRUPT", label: "中断" },
        { value: "PROCESSING", label: "进行中" },
        { value: "FINISH", label: "已完成" },
        { value: "CANCEL", label: "已取消" },
        { value: "FAIL", label: "失败" }
      ],
      searchForm: {},
      selectDate: null
    };
  },
  methods: {
    Refresh() {
      this.$emit("Refresh", 1);
    },
    updataAdd() {
      this.$emit("updataAdd", true);
    },
    handleSearch() {
      this.$emit("search", this.searchForm);
    },
    /**
     * 操作时间事件
     */
    selectDateRange(v) {
      if (v.length > 0) {
        this.searchForm.beginTime = v[0];
        this.searchForm.endTime = v[1];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  // padding: 20px;
  .search {
    border: 1px solid #dcdee2;
    border-radius: 4px;
    padding-left: 6px;
    margin-bottom: 10px;
    .ivu-form {
      .ivu-form-item {
        margin: 10px 0;
        margin-right: 12px;
      }
    }
  }
  .header-content {
    span {
      font-size: 16px;
      margin-right: 10px;
    }
  }
}
</style>