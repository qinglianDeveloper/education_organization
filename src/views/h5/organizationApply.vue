<template>
  <div class="organizationApply main-width padding-lr">
    <Form :model="form" label-position="top" :rules="ruleValidate">
      <FormItem label="1.机构所在镇区（街县）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="2.机构名称（全称）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="3.详细地址" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="4.教育部门办学许可证号">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="5.市场监管部门注册证号">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="6.民政部门登记证号">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="7.机构负责人" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="8.负责人电话" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="9.填报人">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="10.填报人电话" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="11.复学教职工总人数（人）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="12.复学教职员工核酸检测阴性人数（人）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="13.复学学生人数（人）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="14.来自境外、重点疫区学员人数（人）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="15.来自境外、重点疫区学生核酸检测阴性人数(人)" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="16.申请复学时间（月日）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="18.机构自查完成时间（月日）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="19.计划镇区专班验收时间（月日）" prop="phone">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="20.计划报送市专班时间（月日）">
        <Input v-model="form.phone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="21.机构自查是否符合复学条件？  ">
        <RadioGroup v-model="form.phone">
          <Radio label="是">是</Radio>
          <Radio label="否">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="22.自查情况：（必填）">
        <CheckboxGroup v-model="form.CheckboxGroup">
          <Checkbox label="Eat">是否制定突发公共卫生事件应急预案</Checkbox>
          <Checkbox label="Eat1">是否全面排查教职员工基本信息，建立“一人一档”</Checkbox>
          <Checkbox label="Eat3">是否发放疫情防控资料，开展员工疫情防控培训</Checkbox>
          <Checkbox label="Eat3">是否建立日常消杀和保洁制度，且有专人负责</Checkbox>
          <Checkbox label="Eat3">是否对复学学生基本情况进行排摸，建立学生信息台账</Checkbox>
          <Checkbox label="Eat3">是否对全体教职员工和来自境外、国内重点地区的学生返校前7天进行核酸检测</Checkbox>
          <Checkbox label="Eat3">是否建立师生进入登记、测温，以及异常健康人员信息上报制度</Checkbox>
          <Checkbox label="Eat3">是否确保学生之间距离不少于1米</Checkbox>
          <Checkbox label="Eat3">是否明确辖区发热门诊、辖区疾控机构联系方式</Checkbox>
          <Checkbox label="Eat3">是否做到“封闭式”管理，严控人员进出</Checkbox>
          <Checkbox label="Eat3">是否进行应急预案的演练</Checkbox>
          <Checkbox label="Eat3">是否设置有临时观察区</Checkbox>
          <Checkbox label="Eat3">是否通风良好（自然通风效果不佳可增加机械辅助通风设施）</Checkbox>
          <Checkbox label="Eat3">是否设置足够洗手设施或免洗手消毒剂（含乙醇60%以上）</Checkbox>
          <Checkbox label="Eat3">是否对本机构全体教师进行了一次《中山市中小学疫情防控下返校心理建设指引》专题培训？</Checkbox>
          <Checkbox label="Eat3">是否制定接送车辆防疫预案和日常消毒制度</Checkbox>
          <Checkbox label="Eat3">机构疫情防控物资情况（口罩、测温仪器、消杀用品等）</Checkbox>
        </CheckboxGroup>
        <Table border :columns="columns" :data="data5"></Table>
        <ButtonGroup >
          <Button type="default" size="small" style="width:60px;">删除行</Button>
          <Button type="default" size="small" style="width:60px;">添加行</Button>
        </ButtonGroup>
      </FormItem>
      <FormItem label="23.本机构已知晓并承诺：">
        <p>严格落实《中华人民共和国传染病防治法》，按照国家、省、市相关要求，认真履行主体责任，完善应急预案，已经落实各项防范措施（详见下面自查情况），保障教职员工、学生的生命安全和身体健康，确保不发生传染性疫情事件。若因防范措施不到位或者管理不当，发生疫情并导致疫情传播，产生重大影响，立即停课并承担相应的法律后果。</p>
        <RadioGroup v-model="form.phone">
          <Radio label="是">是</Radio>
          <Radio label="否">否</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary">申请</Button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      form: {
        phone: "",
        CheckboxGroup: []
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "Mailbox cannot be empty",
            trigger: "blur"
          },
          { type: "email", message: "Incorrect email format", trigger: "blur" }
        ]
      },
      columns: [
        {
          title: "序号",
          key: "date"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "单位",
          key: "age"
        },
        {
          title: "数量",
          key: "address"
        }
      ],
      data5: [
        {
          name: "Brown",
          age: '个',
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
.organizationApply {
  padding: 10px 0px;
}
</style>