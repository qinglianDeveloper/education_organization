<template>
  <div class="healthyReport  main-width padding-lr">
    <div class="big-title f18 bold text-center">健康上报（5月22日）</div>
    <Form :model="form" label-position="top">
        <FormItem label="姓名">
            <Input v-model="form.phone" disabled placeholder="请输入姓名" maxlength="11"></Input>
        </FormItem>
        <FormItem label="居家测温（℃）">
            <Input type="number" v-model="form.phone" placeholder="请输入居家测温（℃）" maxlength="11"></Input>
        </FormItem>
        <FormItem label="咳嗽">
            <RadioGroup v-model="form.phone">
              <Radio label="男">无</Radio>
              <Radio label="女">有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="粤康码">
            <RadioGroup v-model="form.phone">
              <Radio label="男">绿码</Radio>
              <Radio label="女">红码</Radio>
              <Radio label="女">黄码</Radio>
            </RadioGroup>
        </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary">提交</Button>
    </div>
  </div>
</template>
<script>
export default {
  components: { 
    
  },
  data() {
    return {
      form:{
        phone:''
      }
    };
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    
  }
};
</script>
<style scoped lang="scss">
@import "./common.scss";
</style>
<style lang="scss" scoped>
.healthyReport{
  padding: 20px 0px;
}
</style>