<template>
  <div class="healthyMonitor main-width padding-lr">
    <div class="big-title f18 bold text-center">
      <span>5月22日</span>
      <Button class="save" type="primary" size="small" style="width:50px;">保存</Button>
    </div>
    <Form label-position="top">
      <FormItem label="所在培训机构">
        <Select v-model="model11" filterable>
          <Option v-for="(item,index) in cityList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
    <Table border :columns="columns" :data="data5"></Table>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model11: "",
      columns: [
        {
          title: "姓名",
          key: "date"
        },
        {
          title: "居家测温",
          key: "name"
        },
        {
          title: "咳嗽",
          key: "age"
        },
        {
          title: "粤康码",
          key: "address"
        },
        {
          title: "机构",
          key: "address"
        }
      ],
      data5: [
        {
          name: "Brown",
          age: "个",
          address: "10",
          date: "1"
        }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style scoped lang="scss">
@import "./common.scss";
</style>
<style lang="scss" scoped>
.healthyMonitor {
  padding: 20px 0px;
  .big-title {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 10px;
    .save {
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
    }
  }
}
</style>