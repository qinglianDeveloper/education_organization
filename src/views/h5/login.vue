<template>
  <div class="signin main-width padding-lr">
    <div class="big-title f18 bold text-center">教育培训机构云服务平台</div>
    <Form ref="formValidate" :rules="ruleValidate" :model="form" label-position="left" :label-width="70">
        <FormItem label="手机号" prop="mobile">
            <Input v-model="form.mobile" placeholder="请输入手机号" maxlength="11"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
        </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary" @click.native="submit('formValidate')">登录</Button>
      <router-link class="register f14 text-center" to="/h5-register" tag="div">新用户注册 ></router-link>
    </div>
  </div>
</template>
<script>
import { pwdLogin } from "@/api";
export default {
  components: { 
    
  },
  data() {
    return {
      form:{
        mobile:'',
        password:''
      },
      ruleValidate: {
          mobile: [
              { required: true, message: '手机号码不能为空', trigger: 'blur' },
              {
                type: "number",
                required: true,
                message: "请填写正确的手机号",
                trigger: "blur",
                transform(value) {
                  var myreg = /^[1][0-9]{10}$/;
                  if (!myreg.test(value)) {
                    return false;
                  } else {
                    return Number(value);
                  }
                }
              }
          ],
          password: [
              { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
      },
    };
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    submit(name){
      let {mobile,password} = this.form;
      this.$refs[name].validate((valid) => {
          if (valid) { 
            pwdLogin({mobile,password}).then(res=>{
              if(res.code === 200){
                this.$Message.success(res.result);
              }else{
                this.$Message.error(res.result);
              }
            });
          } else {
              this.$Message.error(res.result);
          }
      });
    }
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