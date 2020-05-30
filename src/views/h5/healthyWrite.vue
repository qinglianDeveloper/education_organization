<template>
  <div class="healthyWrite  main-width padding-lr">
    <Form :model="form" label-position="top">
      <div class="big-title f18 bold">基本信息</div>
        <FormItem label="1.所在培训机构" required>
            <Select v-model="form.organizationId">
                <Option v-for="(item,index) in options" :value="item.id" :key="index">{{ item.orgName }}</Option>
            </Select>
            <!-- <Select v-model="form.organizationId" @on-change="selectOrganization">
          <Option v-for="(item,index) in options" :key="index" :value="item.id">{{item.orgName}}</Option>
        </Select> -->
        </FormItem>
        <FormItem label="2.身份" required>
            <RadioGroup v-model="form.identity">
              <Radio :label="0" v-if="userInfo.type === 'STUDENT'">学员</Radio>
              <Radio :label="1" v-if="userInfo.type === 'TEACHER'">教员</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="3.家长姓名" v-if="form.identity === 0" required>
            <Input v-model="form.parentName" placeholder="请输入家长姓名"></Input>
        </FormItem>
        <FormItem label="4.家长联系方式" v-if="form.identity === 0" required>
            <Input v-model="form.parentPhone" placeholder="请输入家长联系方式" maxlength="11"></Input>
        </FormItem>
        <FormItem :label="`${indexNum}.姓名`" required>
            <Input v-model="form.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem :label="`${indexNum+1}.性别`" required>
            <RadioGroup v-model="form.gender">
              <Radio :label="1">男</Radio>
              <Radio :label="0">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem :label="`${indexNum+2}.出生日期`" required>
          <!-- <DatePicker type="date" placeholder="选择日期" style="width: 100%;" :editable="false"></DatePicker> -->
          <DatePicker @on-change="selectDate1" type="date" placeholder="选择日期" style="width: 100%;"></DatePicker>
        </FormItem>
        <FormItem :label="`${indexNum+3}.身份证号`" required>
            <Input v-model="form.idCardNumber" placeholder="请输入身份证号" maxlength="18"></Input>
        </FormItem>
        <FormItem :label="`${indexNum+4}.现住址`" required>
            <Input v-model="form.address" placeholder="请输入现住址"></Input>
        </FormItem>
        <FormItem :label="`${indexNum+5}.本人及家庭成员是否为新冠肺炎确诊病人或疑似病人`" required>
            <RadioGroup v-model="form.patient">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="如是，请提供诊治医院康复证明" v-show="form.patient === 1">
            <RadioGroup v-model="form.rehabilitationProve">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem :label="`${indexNum+6}.本人及家庭是否曾被要求隔离医学观察（或居家观察）`" required>
            <RadioGroup v-model="form.isolation">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="如是，请提供解除隔离观察证明" v-show="form.isolation === 1">
            <RadioGroup v-model="form.isolationProve">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>



        <div class="big-title f18 bold">流行病学史</div>
        <p style="margin-bottom:10px;">{{`${indexNum+7}.返校（参加培训）前14天，您是否有以下情况`}}</p >
        <FormItem :label="`${indexNum+7}.1是否曾出国或出境？`" required>
            <RadioGroup v-model="form.abroad">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="如是，请具体填写什么时候到过哪些国家和地区" v-show="form.abroad === 1">
            <Input v-model="form.countryArea" placeholder="请输入国家和地区"></Input>
        </FormItem>
        <FormItem :label="`${indexNum+7}.2.是否到过国内重点地区（和中高风险地区）？`" required>
            <RadioGroup v-model="form.importantArea">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem :label="`${indexNum+7}.3.是否接触过来自重点地区（和中高风险地区）或其他有本地病例持续传播地区的发热或有呼吸道症状患者？`" required>
            <RadioGroup v-model="form.contactPatient">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem :label="`${indexNum+7}.4.周围人群中有无2人及以上出现发热、干咳等症状或接触过新冠肺炎患者？`" required>
            <RadioGroup v-model="form.aroundPatient">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem :label="`${indexNum+7}.5.家人/同住人员有无发热、干咳等症状？`" required>
            <RadioGroup v-model="form.familySymptom">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="如有，请描述患者姓名、与申报人关系及诊治情况" v-show="form.familySymptom === 1">
            <Input v-model="form.familySituation" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="如果过有上述情况，最近7天是否已进行核酸检测" v-show="form.familySymptom === 1">
            <RadioGroup v-model="form.nucleicAcidTest">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
        </FormItem>

    </Form>
    
    

    <div class="button-ground">
      <Button type="primary" @click.native="submit">提交</Button>
    </div>
  </div>
</template>
<script>
import { getOrgList ,personHealth} from "@/api";
export default {
  components: { 
    
  },
  data() {
    return {
      indexNum:3,
      userInfo:{},
      options: [],
      form:{
        organizationId:'',//所在培训机构ID
        identity:'',//身份：0学员，1教员
        parentName:'',//家长姓名
        parentPhone:'',//家长联系电话
        name:'',//姓名
        gender:'',//性别
        birthday:'',//出生日期 
        idCardNumber:'',//身份证号
        address:'',//现住址
        patient:null,//本人及家庭成员是否为新冠肺炎确诊病人或疑似病人（1是，0否）
        rehabilitationProve:'',//如是，请提供诊治医院康复证明（1有，0否）
        isolation:'',//本人及家庭是否曾被要求隔离医学观察（或居家观察）（1是，0否）
        isolationProve:'',//如是，请提供解除隔离观察证明（1有，0否）
        abroad:'',//是否曾出国或出境（1是，0否）
        countryArea:'',//如是，请具体填写什么时候到过哪些国家和地区
        importantArea:'',//是否到过国内重点地区（和中高风险地区）（1是，0否）
        contactPatient:'',//是否接触过来自重点地区（和中高风险地区）或其他有本地病例持续传播地区的发热或有呼吸道症状患者？（1是，0否）
        aroundPatient:'',//周围人群中有无2人及以上出现发热、干咳等症状或接触过新冠肺炎患者？（1是，0否）
        familySymptom:'',//家人/同住人员有无发热、干咳等症状？（1有，0无）
        familySituation:'',//如有，请描述患者姓名、与申报人关系及诊治情况
        nucleicAcidTest:'',//如果过有上述情况，最近7天是否已进行核酸检测（1有，0无）
      },
    };
  },
  created() {
    this.userInfo = this.$store.state.h5_user.h5_userInfo;
    this.form.identity = this.userInfo.type === 'STUDENT' ? 0 : 1;
    switch (this.userInfo.type) {
      case 'STUDENT':
        this.indexNum = 5;
        break;
      case 'TEACHER':
        this.indexNum = 3;
        break;
      default:
        break;
    }
    this.getOrgLists();
  },
  mounted() {
    
  },
  methods: {
    selectDate1(v) {
      this.form.birthday = v;
    },
    getOrgLists(){
      //所在的机构
      let obj = {
        //principalId:this.userInfo.id,
        type:'EDUCATION', //EDUCATION: 教育机构 TRUSTEESHIP:托管机构
        pageNumber:1,
        pageSize:100,
      }
      getOrgList(obj).then(res=>{
        if(res.code === 200){
          this.options = res.result.content;
        }else{
          this.$Message.error(res.result);
        }
      });
    },
    submit(){
      //
      let {indexNum} = this;
      if(this.form.organizationId === '')return this.$Message.error('1.所在培训机构ID不能为空');
      if(this.form.identity === '')return this.$Message.error('2.身份不能为空');
      if(this.form.identity === 0 && this.form.parentName === '')return this.$Message.error('3.家长姓名不能为空');
      if(this.form.identity === 0 && this.form.parentPhone === '')return this.$Message.error('4.家长联系电话不能为空');
      if(this.form.name === '')return this.$Message.error(`${indexNum}.姓名不能为空`);
      if(this.form.gender === '')return this.$Message.error(`${indexNum+1}.性别不能为空`);
      if(this.form.birthday  === '')return this.$Message.error(`${indexNum+2}.出生日期不能为空`);
      if(this.form.idCardNumber === '')return this.$Message.error(`${indexNum+3}.身份证号不能为空`);
      if(this.form.address === '')return this.$Message.error(`${indexNum+4}.现住址不能为空`);
      if(this.form.patient === '')return this.$Message.error(`${indexNum+5}.本人及家庭成员是否为新冠肺炎确诊病人或疑似病人不能为空`);
      if(this.form.isolation === '')return this.$Message.error(`${indexNum+6}.本人及家庭是否曾被要求隔离医学观察不能为空`);
      if(this.form.abroad === '')return this.$Message.error(`${indexNum+7}.1.是否曾出国或出境不能为空`);
      if(this.form.importantArea === '')return this.$Message.error(`${indexNum+7}.2.是否到过国内重点地区（和中高风险地区）不能为空`);
      if(this.form.contactPatient === '')return this.$Message.error(`${indexNum+7}.3.是否接触过来自重点地区（和中高风险地区）或其他有本地病例持续传播地区的发热或有呼吸道症状患者不能为空`);
      if(this.form.aroundPatient === '')return this.$Message.error(`${indexNum+7}.4.周围人群中有无2人及以上出现发热、干咳等症状或接触过新冠肺炎患者不能为空`);
      if(this.form.familySymptom === '')return this.$Message.error(`${indexNum+7}.5.家人/同住人员有无发热、干咳等症状不能为空`);
      
      if(this.form.identity === 0 && !/^[1][0-9]{10}$/.test(this.form.parentPhone))return this.$Message.error('3.家长联系电话不正确');
      if(!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(this.form.idCardNumber))return this.$Message.error('2.身份证号不正确');
      personHealth(this.form).then(res=>{
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
<style lang="scss">
.healthyWrite{
  label{
    text-align: left !important;
  }
  
  .ivu-radio-group{
    display: block !important;
    >span{
      display: block !important;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "./common.scss";
.healthyWrite{
  padding: 20px 0px;
  .big-title {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    &::before{
      content: '';
      display: block;
      width: 5px;
      height: 18px;
      background: #2d8cf0;
      margin-right: 5px;
    }
  }
}
</style>