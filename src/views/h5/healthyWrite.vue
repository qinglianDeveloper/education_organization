<template>
  <div class="healthyWrite  main-width padding-lr">
    <Form :model="form" label-position="top">
      <div class="big-title f18 bold">基本信息</div>
        <FormItem label="1.所在培训机构">
            <Select v-model="model11" filterable>
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="2.身份">
            <RadioGroup v-model="form.phone">
              <Radio label="男">学员</Radio>
              <Radio label="女">教员</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="3.家长姓名">
            <Input v-model="form.phone" placeholder="请输入家长姓名" maxlength="11"></Input>
        </FormItem>
        <FormItem label="4.家长联系方式">
            <Input v-model="form.phone" placeholder="请输入家长联系方式" maxlength="11"></Input>
        </FormItem>
        <FormItem label="5.姓名">
            <Input v-model="form.phone" placeholder="请输入姓名" maxlength="11"></Input>
        </FormItem>
        <FormItem label="6.性别">
            <RadioGroup v-model="form.phone">
              <Radio label="男">男</Radio>
              <Radio label="女">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="7.出生日期">
          <DatePicker type="date" placeholder="选择日期" style="width: 100%;" :editable="false"></DatePicker>
        </FormItem>
        <FormItem label="8.身份证号">
            <Input v-model="form.phone" placeholder="请输入身份证号" maxlength="11"></Input>
        </FormItem>
        <FormItem label="现住址">
            <Input v-model="form.phone" placeholder="请输入身份证号" maxlength="11"></Input>
        </FormItem>
        <FormItem label="10.本人及家庭成员是否为新冠肺炎确诊病人或疑似病人">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="11.本人及家庭是否曾被要求隔离医学观察（或居家观察）">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
            </RadioGroup>
        </FormItem>



        <div class="big-title f18 bold">流行病学史</div>
        <p style="margin-bottom:10px;">返校（参加培训）前14天，您是否有以下情况</p>
        <FormItem label="1.是否曾出国或出境？ ">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="如是，请具体填写什么时候到过哪些国家和地区">
            <Input v-model="form.phone" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="2.是否到过国内重点地区（和中高风险地区）？">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="3.是否接触过来自重点地区（和中高风险地区）或其他有本地病例持续传播地区的发热或有呼吸道症状患者？">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="4.周围人群中有无2人及以上出现发热、干咳等症状或接触过新冠肺炎患者？">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="5.家人/同住人员有无发热、干咳等症状？">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="如有，请描述患者姓名、与申报人关系及诊治情况">
            <Input v-model="form.phone" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="6.如果过有上述情况，最近7天是否已进行核酸检测">
            <RadioGroup v-model="form.phone">
              <Radio label="男">是</Radio>
              <Radio label="女">否</Radio>
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
      },
      cityList: [
        {
            value: 'New York',
            label: 'New York'
        },
        {
            value: 'London',
            label: 'London'
        },
        {
            value: 'Sydney',
            label: 'Sydney'
        },
        {
            value: 'Ottawa',
            label: 'Ottawa'
        },
        {
            value: 'Paris',
            label: 'Paris'
        },
        {
            value: 'Canberra',
            label: 'Canberra'
        }
    ],
    model11: '',
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