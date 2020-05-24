<template>
  <div class="organizationApply main-width padding-lr">
    <Form ref="formValidate" :model="form" label-position="top" :rules="ruleValidate">
      <FormItem label="1.机构名称（全称）" required>
        <!-- <Input v-model="form.organizationName" placeholder="请输入"></Input> -->
        <Select v-model="form.organizationId" @on-change="selectOrganization">
          <Option v-for="(item,index) in options" :key="index" :value="item.id">{{item.orgName}}</Option>
        </Select>
      </FormItem>
      <FormItem label="2.机构所在镇区（街县）" required>
        <Input v-model="form.organizationTown" placeholder="请输入" disabled></Input>
      </FormItem>
      <FormItem label="3.详细地址" required>
        <Input v-model="form.address" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="4.教育部门办学许可证号">
        <Input v-model="form.schoolPermitNo" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="5.市场监管部门注册证号">
        <Input v-model="form.marketRegulationNo" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="6.民政部门登记证号">
        <Input v-model="form.civilAffairsNo" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="7.人社部门登记证号">
        <Input v-model="form.mohrssNo" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="8.机构负责人" required>
        <Input v-model="form.organizationPrincipal" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="9.负责人电话" required>
        <Input v-model="form.principalPhone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="10.填报人" required>
        <Input v-model="form.filledName" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="11.填报人电话" required>
        <Input v-model="form.filledPhone" placeholder="请输入" maxlength="11"></Input>
      </FormItem>
      <FormItem label="12.复学教职工总人数（人）" required>
        <Input v-model="form.teacherCount" placeholder="请输入" type="number"></Input>
      </FormItem>
      <FormItem label="13.复学教职员工核酸检测阴性人数（人）" required>
        <Input v-model="form.negativeTeacherCount" placeholder="请输入" type="number"></Input>
      </FormItem>
      <FormItem label="14.复学学生人数（人）" required>
        <Input v-model="form.stuCount" placeholder="请输入" type="number"></Input>
      </FormItem>
      <FormItem label="15.来自境外、重点疫区学员人数（人）" required>
        <Input v-model="form.outStuCount" placeholder="请输入" type="number"></Input>
      </FormItem>
      <FormItem label="16.来自境外、重点疫区学生核酸检测阴性人数(人)" required>
        <Input v-model="form.negativeOutStuCount" placeholder="请输入" type="number"></Input>
      </FormItem>
      <FormItem label="17.申请复学时间（月日）" required>
        <DatePicker @on-change="selectDate1" type="date" placeholder="选择日期" style="width: 100%;"></DatePicker>
      </FormItem>
      <FormItem label="18.机构自查完成时间（月日）" required>
        <DatePicker @on-change="selectDate2" type="date" placeholder="选择日期" style="width: 100%;"></DatePicker>
      </FormItem>
      <FormItem label="19.计划镇区专班验收时间（月日）" required>
        <DatePicker @on-change="selectDate3" type="date" placeholder="选择日期" style="width: 100%;"></DatePicker>
      </FormItem>
      <FormItem label="20.计划报送市专班时间（月日）" required>
        <DatePicker @on-change="selectDate4" type="date" placeholder="选择日期" style="width: 100%;"></DatePicker>
      </FormItem>
      <FormItem label="21.机构自查是否符合复学条件？" required>
        <RadioGroup v-model="form.eligible">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="22.自查情况：（必填）" required>
        <RadioGroup v-model="form.checka">
          <span>是否制定突发公共卫生事件应急预案</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkb">
          <span>是否全面排查教职员工基本信息，建立“一人一档”</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkc">
          <span>是否发放疫情防控资料，开展员工疫情防控培训</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkd">
          <span>是否建立日常消杀和保洁制度，且有专人负责</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checke">
          <span>是否对复学学生基本情况进行排摸，建立学生信息台账</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkf">
          <span>是否对全体教职员工和来自境外、国内重点地区的学生返校前7天进行核酸检测</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkg">
          <span>是否建立师生进入登记、测温，以及异常健康人员信息上报制度</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkh">
          <span>是否确保学生之间距离不少于1米</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checki">
          <span>是否明确辖区发热门诊、辖区疾控机构联系方式</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkj">
          <span>是否做到“封闭式”管理，严控人员进出</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkk">
          <span>是否进行应急预案的演练</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkl">
          <span>是否设置有临时观察区</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkm">
          <span>是否通风良好（自然通风效果不佳可增加机械辅助通风设施）</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkn">
          <span>是否设置足够洗手设施或免洗手消毒剂（含乙醇60%以上）</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checko">
          <span>是否对本机构全体教师进行了一次《中山市中小学疫情防控下返校心理建设指引》专题培训？</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
        <RadioGroup v-model="form.checkp">
          <span>是否制定接送车辆防疫预案和日常消毒制度</span>
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="机构疫情防控物资情况（口罩、测温仪器、消杀用品等））">
        <Table ref="myTable" border :columns="columns" :data="form.supplies" size="small"></Table>
        <ButtonGroup >
          <Button type="default" size="small" style="width:60px;" @click.native="deletItem">删除行</Button>
          <Button type="default" size="small" style="width:60px;" @click.native="addItem">添加行</Button>
        </ButtonGroup>
      </FormItem>
      <FormItem label="23.本机构已知晓并承诺：" required>
        <p>严格落实《中华人民共和国传染病防治法》，按照国家、省、市相关要求，认真履行主体责任，完善应急预案，已经落实各项防范措施（详见下面自查情况），保障教职员工、学生的生命安全和身体健康，确保不发生传染性疫情事件。若因防范措施不到位或者管理不当，发生疫情并导致疫情传播，产生重大影响，立即停课并承担相应的法律后果。</p>
        <RadioGroup v-model="form.protocol">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="button-ground">
      <Button type="primary" @click.native="submit('formValidate')">申请</Button>
    </div>
    <!-- <vueCityPicker ref="vueCityPicker" @success="chooseCity"></vueCityPicker> -->
  </div>
</template>
<script>
import { adressInfo , applySubmit,orgList } from "@/api";
import vueCityPicker from "./components/vueCityPicker";
export default { 
  components: {/* vueCityPicker */},
  data() {
    return {
      userInfo:{},
      options:[],
      form: {
        supplies:[{
          id:1,
          name:'',//名称
          unit:'',//单位
          number:'',//数量
        }],
        organizationId:'',
        organizationTown:'',//机构所在镇区（街县）
        organizationName:'',//机构名称（全称）
        address:'',//详细地址
        schoolPermitNo:'',//教育部门办学许可证号
        marketRegulationNo:'',//市场监管部门注册证号
        civilAffairsNo:'',//民政部门登记证号
        mohrssNo:'',//人社部门登记证号
        organizationPrincipal:'',//机构负责人
        principalPhone:'',//负责人电话
        filledName:'',//填报人
        filledPhone:'',//填报人电话
        teacherCount:'',//复学教职工总人数（人）
        negativeTeacherCount:'',//复学教职员工核酸检测阴性人数（人）
        stuCount:'',//复学学生人数（人）
        outStuCount:'',//来自境外、重点疫区学员人数（人）
        negativeOutStuCount:'',//来自境外、重点疫区学生核酸检测阴性人数（人）
        startDate:'',//申请复学时间（月日）
        readyDate:'',//机构自查完成时间（月日）
        acceptanceDate:'',//计划镇区专班验收时间（月日）
        submitDate:'',//计划报送市专班时间（月日）
        eligible:'',//机构自查是否符合复学条件
        checka:'',//
        checkb:'',//
        checkc:'',//
        checkd:'',//
        checke:'',//
        checkf:'',//
        checkg:'',//
        checkh:'',//
        checki:'',//
        checkj:'',//
        checkk:'',//
        checkl:'',//
        checkm:'',//
        checkm:'',//
        checkn:'',//
        checko:'',//
        checkp:'',//
        protocol:'',//本机构已知晓并承诺（1是，0否）
      },
      ruleValidate: {
        /* organizationTown: [
          { required: true, message: '机构所在镇区不能为空', trigger: 'blur' }
        ],
        organizationName: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        organizationPrincipal: [
          { required: true, message: '机构负责人不能为空', trigger: 'blur' }
        ],
        principalPhone: [
          { required: true, message: '负责人电话不能为空', trigger: 'blur' },
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
        filledName: [
          { required: true, message: '填报人不能为空', trigger: 'blur' }
        ],
        filledPhone: [
          { required: true, message: '填报人电话不能为空', trigger: 'blur' }
        ],

        teacherCount: [
          { required: true, message: '复学教职工总人数不能为空', trigger: 'blur' }
        ],
        negativeTeacherCount: [
          { required: true, message: '复学教职员工核酸检测阴性人数不能为空', trigger: 'blur' }
        ],
        stuCount: [
          { required: true, message: '复学学生人数不能为空', trigger: 'blur' }
        ],
        outStuCount: [
          { required: true, message: '来自境外、重点疫区学员人数不能为空', trigger: 'blur' }
        ],
        negativeOutStuCount: [
          { required: true, message: '来自境外、重点疫区学生核酸检测阴性人数不能为空', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '申请复学时间不能为空', trigger: 'blur' }
        ],
        readyDate: [
          { required: true, message: '机构自查完成时间不能为空', trigger: 'blur' }
        ],
        acceptanceDate: [
          { required: true, message: '计划镇区专班验收时间不能为空', trigger: 'blur' }
        ],
        submitDate: [
          { required: true, message: '计划报送市专班时间不能为空', trigger: 'blur' }
        ],
        eligible: [
          { required: true, message: '机构自查是否符合复学条件不能为空', trigger: 'blur' }
        ],
        protocol: [
          { required: true, message: '本机构已知晓并承诺必选', trigger: 'blur' }
        ] */
      },
      columns: [
        {
          title: "序号",
          key: "id",
          align: 'center',
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          render:(h,params) => {
              return h('Input',{
                    props: {
                      value:'',
                      //size:'small',
                  },
                    on: {
                      input: (val) => {
                          this.form.supplies[params.index].name = val;
                        }
                    },
                })
            }
        },
        /* {
          title: "名称",
          key: "name",
          render: (h, params) => {
            this.form.supplies[params.index] = params.row;
            return h(
              "div",
              this.$refs.myTable.$scopedSlots.name({
                row: params.row,
                idx: params.row._index
              })
            );
          }
        }, */
        /* {
          title: "名称",
          key: "name"
        }, */
        {
          title: "单位",
          key: "unit",
          render:(h,params) => {
              return h('Input',{
                    props: {
                      value:'',
                      //size:'small',
                  },
                    on: {
                      input: (val) => {
                          this.form.supplies[params.index].unit = val;
                        }
                    },
                })
            }
        },
        {
          title: "数量",
          key: "number",
          render:(h,params) => {
              return h('Input',{
                    props: {
                      value:'',
                      //size:'small',
                  },
                    on: {
                      input: (val) => {
                          this.form.supplies[params.index].number = val;
                        }
                    },
                })
            }
        }
      ],
    };
  },
  created() {
    this.userInfo = this.$store.state.h5_user.h5_userInfo;
    this.getOrgList();
  },
  mounted() {
    
  },
  methods: {
    getOrgList() {//{ principalId: this.userInfo.id }
      orgList({ principalId: this.userInfo.id }).then(res => {
        if (res.code == 200) {
          this.options = res.result;
        }
      });
    },
    selectOrganization(val) {
      this.options.forEach(item => {
        if (item.id == val) {
          this.form.organizationTown = item.area;
          this.form.address = item.areaDetail;
          this.form.organizationName = item.orgName;
        }
      });
    },
    /* chooseCity(v){
      this.form.organizationTown = v;
    }, */
    selectDate1(v) {
      this.form.startDate = v;
    },
    selectDate2(v) {
      this.form.readyDate = v;
    },
    selectDate3(v) {
      this.form.acceptanceDate = v;
    },
    selectDate4(v) {
      this.form.submitDate = v;
    },
    deletItem(){
      //删除行
      if(this.form.supplies.length === 1)return;
      this.form.supplies.pop();
    },
    addItem(){
      //添加行
      let obj = {
          id:this.form.supplies.length+1,
          name:'',//名称
          unit:'',//单位
          number:'',//数量
      };
      this.form.supplies.push(obj)
    },
    submit(name){
      let form = JSON.parse(JSON.stringify(this.form));
      
      if(this.form.organizationName === '')return this.$Message.error('1.机构名称不能为空');
      if(this.form.organizationTown === '')return this.$Message.error('2.机构所在镇区不能为空');
      if(this.form.address === '')return this.$Message.error('3.详细地址不能为空');
      if(this.form.organizationPrincipal === '')return this.$Message.error('8.机构负责人不能为空');
      if(this.form.principalPhone === '')return this.$Message.error('9.负责人电话不能为空');
      if(this.form.filledName === '')return this.$Message.error('10.填报人不能为空');
      if(this.form.filledPhone === '')return this.$Message.error('11.填报人电话不能为空');
      if(this.form.teacherCount === '')return this.$Message.error('12.复学教职工总人数不能为空');
      if(this.form.negativeTeacherCount === '')return this.$Message.error('13.复学教职员工核酸检测阴性人数不能为空');
      if(this.form.stuCount === '')return this.$Message.error('14.复学学生人数不能为空');
      if(this.form.outStuCount === '')return this.$Message.error('15.来自境外、重点疫区学员人数不能为空');
      if(this.form.negativeOutStuCount === '')return this.$Message.error('16.来自境外、重点疫区学生核酸检测阴性人数不能为空');
      if(this.form.startDate === '')return this.$Message.error('17.申请复学时间不能为空');
      if(this.form.readyDate === '')return this.$Message.error('18.机构自查完成时间不能为空');
      if(this.form.acceptanceDate === '')return this.$Message.error('19.计划镇区专班验收时间不能为空');
      if(this.form.submitDate === '')return this.$Message.error('20.计划报送市专班时间不能为空');
      if(this.form.eligible === '')return this.$Message.error('21.本机构已知晓并承诺不能为空');
      for (const key in form) {
        if (form.hasOwnProperty(key)) {
          const element = form[key];
          if(key.indexOf('check')>-1){
            if(element === '')return this.$Message.error('22.自查情况必须要全部选择');
          }
        }
      }
      if(this.form.protocol === '')return this.$Message.error('23.本机构已知晓并承诺不能为空');
      
      
      if(!/^[1][0-9]{10}$/.test(this.form.principalPhone))return this.$Message.error('9.负责人电话不正确');
      if(!/^[1][0-9]{10}$/.test(this.form.filledPhone))return this.$Message.error('11.填报人电话不正确');
      

      applySubmit(form).then(res=>{
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
<style lang="scss">
.organizationApply{
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
.organizationApply {
  padding: 10px 0px;
}
</style>