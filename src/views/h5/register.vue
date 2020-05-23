<template>
  <div class="register main-width padding-lr">
    <div class="big-title f18 bold text-center">教育培训机构云服务平台</div>
    <Form :model="form" label-position="left" :label-width="70">
        <FormItem label="手机号">
          <div class="flex">
            <Input v-model="form.phone" placeholder="请输入手机号" maxlength="11"></Input>
            <Button type="primary" style="width:140px;margin-left:10px;">获取验证码</Button>
          </div>
        </FormItem>
        <FormItem label="验证码">
            <Input v-model="form.phone" placeholder="请输入验证码"></Input>
        </FormItem>
        <FormItem label="角色">
            <RadioGroup v-model="form.phone">
              <Radio label="培训机构负责人"></Radio>
              <Radio label="教师"></Radio>
              <Radio label="学生"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="培训机构">
            <Input v-model="form.phone" placeholder="请选择你所在的培训机构"></Input>
        </FormItem>
        <FormItem label="姓名">
            <Input v-model="form.phone" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="密码">
            <Input v-model="form.phone" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="确认密码">
            <Input v-model="form.phone" placeholder="请输入再次输入密码"></Input>
        </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary">注册</Button>
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
.register{
  .big-title{
    padding: 30px 0px;
  }
  .flex{
    display: flex;
    align-items: center;
  }
  .button-ground{
    padding: 10px 0px 20px;
  }
}
</style>