<template>
  <div class="healthyReport  main-width padding-lr">
    <div class="big-title f18 bold text-center">健康申报（{{MM}}月{{DD}}日）</div>
    <Form :model="form" label-position="top">
        <FormItem label="姓名" required>
            <Input v-model="form.userName" disabled placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="居家测温（℃）" required>
            <Input type="number" v-model="form.temperatureHome" placeholder="请输入居家测温（℃）"></Input>
        </FormItem>
        <FormItem label="咳嗽" required>
            <RadioGroup v-model="form.cough">
              <Radio :label="0">无</Radio>
              <Radio :label="1">有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="粤康码" required>
            <RadioGroup v-model="form.healthCode">
              <Radio :label="0">绿码</Radio>
              <Radio :label="1">红码</Radio>
              <Radio :label="2">黄码</Radio>
            </RadioGroup>
        </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary" @click.native="submit">提交</Button>
    </div>
  </div>
</template>
<script>
import { studentHealth } from "@/api";
export default {
  components: { 
    
  },
  data() {
    return {
      MM:'',
      DD:'',
      userInfo:{},
      form:{
        userName:'',
        temperatureHome:'',//居家体温
        cough:null,//是否咳嗽，0否，1是
        healthCode:null,//健康码，0绿，1红，2黄
      }
    };
  },
  created() {
    this.userInfo = this.$store.state.h5_user.h5_userInfo;
    this.form.userName = this.userInfo.userName;
    let d = new Date();
    this.MM = d.getMonth() + 1;
    this.DD = d.getDate() ;
  },
  mounted() {
    
  },
  methods: {
    submit(){
      if(this.form.userName === '')return this.$Message.error('姓名不能为空');
      if(this.form.temperatureHome === '')return this.$Message.error('居家体温不能为空');
      if(this.form.cough === null)return this.$Message.error('不能为空');
      if(this.form.healthCode === null)return this.$Message.error('不能为空');
      studentHealth(this.form).then(res=>{
        if(res.code === 200){
          this.$Message.success("保存成功");
          this.$router.go(-1);
        }else{
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
.healthyReport{
  padding: 20px 0px;
}
</style>