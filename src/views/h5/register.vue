<template>
  <div class="register main-width padding-lr">
    <div class="big-title f18 bold text-center">教育培训机构云服务平台</div>
    <Form ref="formValidate" :rules="ruleValidate" :model="form" label-position="left" :label-width="80">
        <FormItem label="手机号" prop="mobile">
          <div class="flex">
            <Input v-model="form.mobile" placeholder="请输入手机号" maxlength="11"></Input>
            <Button type="primary" style="width:140px;margin-left:10px;" @click.native="getMobileValidator">获取验证码</Button>
          </div>
        </FormItem>
        <FormItem label="验证码" prop="validator">
            <Input v-model="form.validator" placeholder="请输入验证码"></Input>
        </FormItem>
        <FormItem label="角色" prop="type">
            <RadioGroup v-model="form.type">
              <Radio label="ORGPRINCIPAL">培训机构负责人</Radio>
              <Radio label="TEACHER">教师</Radio>
              <Radio label="STUDENT">学生</Radio>
          </RadioGroup>
        </FormItem>
        <!-- <FormItem label="培训机构" v-show="form.type !== 'ORGPRINCIPAL' && form.type !== ''" prop="orgId"> -->
        <FormItem label="培训机构" prop="orgId" v-show="form.type !== 'ORGPRINCIPAL' && form.type !== ''">
            <Select 
              placeholder="请选择你所在的培训机构"
              v-model="form.orgId"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="loading">
              <Option v-for="(option, index) in options" :value="option.id" :key="index">{{option.orgName}}</Option>
            </Select>
        </FormItem>
        <FormItem label="姓名" prop="userName">
            <Input v-model="form.userName" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="password2">
            <Input type="password" v-model="form.password2" placeholder="请输入再次输入密码"></Input>
        </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary" @click.native="submit('formValidate')">注册</Button>
    </div>
  </div>
</template>
<script>
import { register,orgList,mobileValidator } from "@/api";

export default {
  components: { 
    
  },
  data() {
    return {
      form:{
        mobile:'',
        validator:'',
        type:'',//学生 STUDENT 老师 TEACHER 培训机构负责人 ORGPRINCIPAL
        userName:'',
        password:'',
        password2:'',
        orgId:'',//培训机构的Id
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
          validator: [
              { required: true, message: '验证码不能为空', trigger: 'blur' }
          ],
          type: [
              { required: true, message: '角色不能为空', trigger: 'blur' }
          ],
          userName: [
              { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          password2: [
              { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          orgId: [
            //{ required: true, message: '培训机构不能为空', trigger: 'change' },
              /* {
                type: "string",
                required: true,
                message: "培训机构不能为空",
                trigger:"blur",
                transform(value) {
                  if(value === '')return false;
                  console.log('value: ', value);
                  console.log(888888888888,this);
                }
              } */
          ],
      },
      loading: false,
      options:[],
    };
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    remoteMethod (query) {
        if (query !== '') {
            this.loading = true;
            orgList({orgName:query}).then(res=>{
              this.loading = false;
              if(res.code === 200){
                this.options = res.result;
              }else{
                this.$Message.error(res.result);
              }
            });
        } else {
            this.options = [];
        }
    },
    getMobileValidator(){
      //获取验证码
      let {mobile} = this.form;
      if (!/^[1][0-9]{10}$/.test(mobile)) return this.$Message.error('手机号码有误!');
      mobileValidator({phone:mobile}).then(res=>{
        if(res.code === 200){
          this.$Message.success(res.result);
        }else{
          this.$Message.error(res.result);
        }
      });
    },
    submit(name){
      let {mobile,validator,type,userName,password,password2,orgId} = this.form;
      this.$refs[name].validate((valid) => {
          if (valid) { 
            if(password !== password2)return this.$Message.error('两次密码不一致!');
            if(type !== 'ORGPRINCIPAL' && orgId === '')return this.$Message.error('培训机构不能为空!');
            if(type === 'ORGPRINCIPAL') orgId = '';
            register({mobile,validator,type,userName,password,orgId}).then(res=>{
              if(res.code === 200){
                this.$Message.success(res.result);
                this.$router.replace('h5-login');
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