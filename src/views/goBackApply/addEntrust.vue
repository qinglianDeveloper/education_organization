<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-24 11:03:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-30 22:08:49
--> 
<template>
  <div class="add-entrust">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>新增托管机构复学审批</span>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <div class="form">
      <Form ref="form" :model="form" label-position="top" :rules="ruleValidate">
        <FormItem label="所在托管机构" prop="organizationId">
          <Select v-model="form.organizationId" @on-change="selectOrganization">
            <Option v-for="(item,index) in orgList" :value="item.id" :key="index">{{ item.orgName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="机构所在镇区" prop="organizationTown">
          <Input v-model="form.organizationTown" placeholder="请输入" disabled></Input>
        </FormItem>
        <FormItem label="详细地址" prop="areaDetail">
          <Input v-model="form.areaDetail" placeholder="请输入" disabled></Input>
        </FormItem>
        <FormItem label="机构负责人" prop="orgHead">
          <Input v-model="form.orgHead" placeholder="请输入机构负责人"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="legalPersonPhone">
          <Input v-model="form.legalPersonPhone" placeholder="请输入联系电话" maxlength="11" type="number"></Input>
        </FormItem>
        <FormItem label="法人代表" prop="legalPerson">
          <Input v-model="form.legalPerson" placeholder="请输入法人代表姓名"></Input>
        </FormItem>
        <div class="big-title f18 bold">证照情况</div>
        <FormItem
          :label="`1.是否按规定办理《民办非企业登记证》《工商营业执照》《食品经营许可证》以及取得消防验收合格证明材料，并在显眼处公示。`"
          prop="orgManageOne"
        >
          <RadioGroup v-model="form.orgManageOne">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">健全机构疫情防控体系</div>
        <FormItem
          :label="`2.成立负责人为第一责任人的疫情防控工作小组和疫情防控专项机构，职责明确、责任到岗。与属地卫生健康部门、疾控中心、市场监管部门、医院、辖区派出所、社区等建立联防联控机制。`"
          prop="orgManageTwo"
        >
          <RadioGroup v-model="form.orgManageTwo">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">制定两个方案</div>
        <FormItem :label="`3.制定详细完备且可操作的托管服务工作方案。`" prop="orgManageThree">
          <RadioGroup v-model="form.orgManageThree">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`4.制定突发公共卫生事件应急预案，应急处置流程设计科学合理，责任落实到位，并已开展应急演练。`" prop="orgManageFour">
          <RadioGroup v-model="form.orgManageFour">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">建立传染病防控制度</div>
        <FormItem :label="`5.传染病疫情及突发公共卫生事件的报告制度`" prop="orgManageFive">
          <RadioGroup v-model="form.orgManageFive">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`6.学生午检、晚检制度`" prop="orgManageSix">
          <RadioGroup v-model="form.orgManageSix">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`7.学生健康管理制度`" prop="orgManageSeven">
          <RadioGroup v-model="form.orgManageSeven">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`8.通风、消毒等制度`" prop="orgManageEight">
          <RadioGroup v-model="form.orgManageEight">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`9.环境卫生检查通报制度`" prop="orgManageNine">
          <RadioGroup v-model="form.orgManageNine">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`10.食堂、宿舍（寝室或休眠区）等人员密集场所的管理规范。`" prop="orgManageTen">
          <RadioGroup v-model="form.orgManageTen">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">暂不返岗人员排查</div>
        <FormItem
          :label="`11.暂不返岗人员排 查	对全体员工，以及来自境外（含港澳台）、中高风险地区、隔离未满14天托管学生进行排查，并建立人员清单。对有发热、咳嗽等症状不返回机构员工进行排查，并建立人员清单。`"
          prop="peopleManageOne"
        >
          <RadioGroup v-model="form.peopleManageOne">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">返岗人员排查</div>
        <FormItem
          :label="`12.对员工健康状况进行全面摸排，收集所有员工的《从业人员健康卡》归档。所有员工均需进行核酸检测，结果为阴性且无发热、干咳、乏力、腹泻等身体不适症状方可返岗复工。`"
          prop="peopleManageTwo"
        >
          <RadioGroup v-model="form.peopleManageTwo">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">外来人员管控</div>
        <FormItem :label="`13.未经机构准许，无关人员不准进入机构。外卖、快递、投递等一律实行无接触配送。`" prop="peopleManageThree">
          <RadioGroup v-model="form.peopleManageThree">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">员工健康监测</div>
        <FormItem
          :label="`14.严格落实员工健康管理，全面掌握员工身体健康状况，加强晨午晚检和体温监测登记，做好因病缺勤登记、追踪、报告工作。若有员工出现发热、干咳、乏力、鼻塞、流涕、咽痛、腹泻及胸闷等症状，应尽快到正规医院（或发热门诊）就医，禁止带病上班。`"
          prop="peopleManageFour"
        >
          <RadioGroup v-model="form.peopleManageFour">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">疫情防控知识培训</div>
        <FormItem
          :label="`15.托管机构要加强对员工开展防控制度、个人防护与消毒等知识和技能培训；学习新冠肺炎疫情防控和其他传染病（流感、水痘、诺如病毒等）防控知识，切实提高防病意识。`"
          prop="peopleTrainOne"
        >
          <RadioGroup v-model="form.peopleTrainOne">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">疫情防控物资准备</div>
        <FormItem
          :label="`16.按规定标准准备医用外科口罩和儿童专用口罩、紫外线消毒灯、喷雾器、水银温度计、体温枪、一次性橡胶手套、消毒用品、呕吐物处理材料等防控物资。`"
          prop="materialSupportOne"
        >
          <RadioGroup v-model="form.materialSupportOne">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">机构清洁消毒</div>
        <FormItem
          :label="`17.按照《广东省中小学校和托幼机构防控新冠肺炎疫情工作指南（第二版）》要求对托管机构环境进行彻底清洁消杀，并留有记录。`"
          prop="envirManageOne"
        >
          <RadioGroup v-model="form.envirManageOne">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`18.设置口罩等防控物资废弃物专用垃圾箱，定时进行有效消毒处理。`" prop="envirManageTwo">
          <RadioGroup v-model="form.envirManageTwo">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">洗手设施</div>
        <FormItem
          :label="`19.按标准配备足量的洗手池，达到每40-45人配设一个洗手盆或0.6m长的洗手槽的要求。配备必要的洗手液（肥皂）、纸巾或干手机等设施设备，张贴“七步洗手法”。`"
          prop="envirManageThree"
        >
          <RadioGroup v-model="form.envirManageThree">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">通风状况</div>
        <FormItem
          :label="`20.托管机构要保持室内空气流通，加强通风换气。首选自然通风，无法采用自然通风的，必须采用机械通风，并确保所有通风设备保持正常运转。`"
          prop="envirManageFour"
        >
          <RadioGroup v-model="form.envirManageFour">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">设置隔离留观室（区）</div>
        <FormItem :label="`21.场所相对独立。确保有足够的空间，通风良好，标识醒目。配备口罩、休息座椅及消毒等防护用品。`" prop="envirManageFive">
          <RadioGroup v-model="form.envirManageFive">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`22.配有专人负责，熟知应急处置流程。`" prop="envirManageSix">
          <RadioGroup v-model="form.envirManageSix">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">机构出入管理</div>
        <FormItem :label="`23.封闭式管理。做好员工、学生进入机构有序测量体温的准备。`" prop="envirManageSeven">
          <RadioGroup v-model="form.envirManageSeven">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">进行安全隐患检查</div>
        <FormItem :label="`24.重点排查托管机构消防安全、食品安全、饮用水安全、周边环境等。`" prop="envirManageEight">
          <RadioGroup v-model="form.envirManageEight">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">食品安全管理</div>
        <FormItem
          :label="`25.按照《关于开展广东省2020年学校校园及周边食品安全专项检查工作的通知》（粤市监〔2020〕11号）做好自查工作，尤其是人员健康、食材采购、贮存情况等，对设备和场所进行全面清理消毒。对所有餐具用具进行彻底的清洗消毒。彻底清查库存食材，及时清理过期、变质的食材。`"
          prop="envirManageNine"
        >
          <RadioGroup v-model="form.envirManageNine">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`26.供应商管理到位，供货渠道稳定。校园生活必需品准备充足、供应有序。`" prop="envirManageTen">
          <RadioGroup v-model="form.envirManageTen">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`27.从集体用餐配送单位订餐的，核查供餐单位按照食品安全管理要求生产，保障供应情况。`" prop="envirManageEleven">
          <RadioGroup v-model="form.envirManageEleven">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`28.食堂人员充足、身体健康、持证上岗，上岗前经过食品安全和疫情防控知识培训。`" prop="envirManageTwelve">
          <RadioGroup v-model="form.envirManageTwelve">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">楼道、厕所场所管理</div>
        <FormItem :label="`29.定时清洁、消毒。`" prop="envirManageThirteen">
          <RadioGroup v-model="form.envirManageThirteen">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <div class="big-title f18 bold">用餐管理</div>
        <FormItem :label="`30.制定疫情期间员工、学生用餐方案，方案科学可行，做到合理用餐，避免群体性聚集用餐。`" prop="otherOne">
          <RadioGroup v-model="form.otherOne">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`机构自评意见（是否具备开展托管服务条件）`" prop="selfAssessment">
          <Input v-model="form.selfAssessment" type="textarea" placeholder="自评意见" :rows="6" />
        </FormItem>
      </Form>
    </div>
    <Divider />
    <div class="button-ground">
      <Button type="primary" @click.native="submit('form')" style="margin-right:6px">申请</Button>
      <Button type="default" @click.native="goBack('form')">返回列表</Button>
    </div>
  </div>
</template>
<script>
import { trusteeshipAdd, orgList } from "@/api";
export default {
  data() {
    return {
      userId: "",
      orgList: [],
      form: {
        orgHead: "", //机构负责人
        organizationId: "", //托管机构ID
        organizationTown: "", //机构所在镇区
        legalPerson: "", //法人代表
        legalPersonPhone: "", //联系电话
        orgManageOne: "", //
        orgManageTwo: "", //
        orgManageThree: "", //
        orgManageFour: "", //
        orgManageFive: "", //
        orgManageSix: "", //
        orgManageSeven: "", //
        orgManageEight: "", //
        orgManageNine: "", //
        orgManageTen: "", //
        peopleManageOne: "", //
        peopleManageTwo: "", //
        peopleManageThree: "", //
        peopleManageFour: "", //
        peopleTrainOne: "", //
        materialSupportOne: "", //
        envirManageOne: "", //
        envirManageTwo: "", //
        envirManageThree: "", //
        envirManageFour: "", //
        envirManageFive: "", //
        envirManageSix: "", //
        envirManageSeven: "", //
        envirManageEight: "", //
        envirManageNine: "", //
        envirManageTen: "", //
        envirManageEleven: "", //
        envirManageTwelve: "", //
        envirManageThirteen: "", //
        otherOne: "", //
        selfAssessment: "" //
      },
      ruleValidate: {
        orgHead: [
          { required: true, message: "机构负责人人不能为空", trigger: "blur" }
        ],
        organizationId: [
          {
            required: true,
            message: "请选择托管机构",
            trigger: "change",
            type: "number"
          }
        ],
        organizationTown: [
          {
            required: true,
            message: "机构所在镇区不能为空",
            trigger: "blur",
            trigger: "change"
          }
        ],
        legalPerson: [
          { required: true, message: "法人代表不能为空", trigger: "blur" }
        ],
        legalPersonPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          {
            type: "number",
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur",
            trigger: "change",
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
        orgManageOne: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageTwo: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageThree: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageFour: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageFive: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageSix: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageSeven: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageEight: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageNine: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        orgManageTen: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        peopleManageOne: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        peopleManageTwo: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        peopleManageThree: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        peopleManageFour: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        peopleTrainOne: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        materialSupportOne: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageOne: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageTwo: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageThree: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageFour: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageFive: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageSix: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageSeven: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageEight: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageNine: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageTen: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageEleven: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageTwelve: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        envirManageThirteen: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        otherOne: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        selfAssessment: [],
        userId: "",
        orgList: []
      }
    };
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
    this.getOrgList();
  },
  methods: {
    getOrgList() {
      orgList({ principalId: this.userId, type: "TRUSTEESHIP" }).then(res => {
        if (res.code == 200) {
          this.orgList = res.result;
        }
      });
    },
    selectOrganization(val) {
      this.orgList.forEach(item => {
        if (item.id == val) {
          this.form.organizationTown = item.area;
          this.form.areaDetail = item.areaDetail;
          this.form.orgHead = item.principalName;
          this.form.legalPersonPhone = item.principalMobile;
        }
      });
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        console.log(valid);
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form));
          trusteeshipAdd(obj).then(res => {
            if (res.code === 200) {
              this.$Message.success("新增复学审批成功");
              this.goBack();
            }
          });
        }
      });
    },
    goBack() {
      this.$router.push({ name: "EntrustApplyList" });
    }
  }
};
</script>
<style lang="scss">
.add-entrust {
  padding: 16px;
  label {
    text-align: left !important;
  }
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 6px;
    .title {
      color: #2d8cf0;
      font-weight: bold;
      line-height: 32px;
    }
  }
  .form {
    height: calc(100vh - 300px);
    overflow: auto;
    padding: 0 20px;
  }
  .button-ground {
    text-align: center;
  }
  .big-title {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    &::before {
      content: "";
      display: block;
      width: 5px;
      height: 18px;
      background: #2d8cf0;
      margin-right: 5px;
    }
  }
}
</style>