<template>
  <div class="signin main-width padding-lr">
    <div class="big-title f18 bold text-center">教育培训机构云服务平台</div>
    <Form :model="form" label-position="left" :label-width="60">
        <FormItem label="手机号">
            <Input v-model="form.phone" placeholder="请输入手机号" maxlength="11"></Input>
        </FormItem>
        <FormItem label="密码">
            <Input v-model="form.phone" placeholder="请输入密码"></Input>
        </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary">登录</Button>
      <router-link class="register f14 text-center" to="/h5-register" tag="div">新用户注册 ></router-link>
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
.signin{
  .big-title{
    padding: 60px 0px 80px;
  }
  .button-ground{
    margin-top: 20px;
    .register{
      padding: 10px 0px;
    }
  }
}
</style>