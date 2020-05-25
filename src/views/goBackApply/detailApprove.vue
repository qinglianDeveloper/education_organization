<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-24 11:03:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-25 20:08:41
--> 
<template>
  <div class="add">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>复学审批详情</span>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <div class="form">
      <Form ref="formValidate" :model="form" label-position="top">
        <FormItem label="1.机构名称（全称）" prop="organizationName">
          <span class="item">{{form.organizationName}}</span>
        </FormItem>
        <FormItem label="2.机构所在镇区（街县）" prop="organizationTown">
          <span class="item">{{form.organizationTown}}</span>
        </FormItem>
        <FormItem label="3.详细地址" prop="address">
          <span class="item">{{form.address}}</span>
        </FormItem>
        <FormItem label="4.教育部门办学许可证号">
          <span class="item">{{form.schoolPermitNo}}</span>
        </FormItem>
        <FormItem label="5.市场监管部门注册证号">
          <span class="item">{{form.marketRegulationNo}}</span>
        </FormItem>
        <FormItem label="6.民政部门登记证号">
          <span class="item">{{form.civilAffairsNo}}</span>
        </FormItem>
        <FormItem label="7.人社部门登记证号">
          <span class="item">{{form.mohrssNo}}</span>
        </FormItem>
        <FormItem label="8.机构负责人" prop="organizationPrincipal">
          <span class="item">{{form.organizationPrincipal}}</span>
        </FormItem>
        <FormItem label="9.负责人电话" prop="principalPhone">
          <span class="item">{{form.principalPhone}}</span>
        </FormItem>
        <FormItem label="10.填报人" prop="filledName">
          <span class="item">{{form.filledName}}</span>
        </FormItem>
        <FormItem label="11.填报人电话" prop="filledPhone">
          <span class="item">{{form.filledPhone}}</span>
        </FormItem>
        <FormItem label="12.复学教职工总人数（人）" prop="teacherCount">
          <span class="item">{{form.teacherCount}}</span>
        </FormItem>
        <FormItem label="13.复学教职员工核酸检测阴性人数（人）" prop="negativeTeacherCount">
          <span class="item">{{form.negativeTeacherCount}}</span>
        </FormItem>
        <FormItem label="14.复学学生人数（人）" prop="stuCount">
          <span class="item">{{form.stuCount}}</span>
        </FormItem>
        <FormItem label="15.来自境外、重点疫区学员人数（人）" prop="outStuCount">
          <span class="item">{{form.outStuCount}}</span>
        </FormItem>
        <FormItem label="16.来自境外、重点疫区学生核酸检测阴性人数(人)" prop="negativeOutStuCount">
          <span class="item">{{form.negativeOutStuCount}}</span>
        </FormItem>
        <FormItem label="17.申请复学时间（月日）" prop="startDate">
          <span class="item">{{form.startDate}}</span>
        </FormItem>
        <FormItem label="18.机构自查完成时间（月日）" prop="readyDate">
          <span class="item">{{form.readyDate}}</span>
        </FormItem>
        <FormItem label="19.计划镇区专班验收时间（月日）" prop="acceptanceDate">
          <span class="item">{{form.acceptanceDate}}</span>
        </FormItem>
        <FormItem label="20.计划报送市专班时间（月日）" prop="submitDate">
          <span class="item">{{this.form.submitDate}}</span>
        </FormItem>
        <FormItem label="21.机构自查是否符合复学条件？" prop="eligible">
          <span class="item">{{form.eligible==1?'是':'否'}}</span>
        </FormItem>
        <p style="margin-bottom:10px">
          <span
            style="display:inline-block;margin-right:4px;line-height:1;font-family:SimSun;font-size:14px;color:#ed4014;"
          >*</span> 22.自查情况：（必填）
        </p>
        <!-- <FormItem label=""> -->
        <div style="margin-left:16px">
          <FormItem
            prop="checka"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否制定突发公共卫生事件应急预案</span>
            <span class="item">{{form.checka==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkb"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否全面排查教职员工基本信息，建立“一人一档”</span>
            <span class="item">{{form.checkb==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkc"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否发放疫情防控资料，开展员工疫情防控培训</span>
            <span class="item">{{form.checkc==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkd"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否建立日常消杀和保洁制度，且有专人负责</span>
            <span class="item">{{form.checkd==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checke"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否对复学学生基本情况进行排摸，建立学生信息台账</span>
            <span class="item">{{form.checke==1?'是':'否'}}</span>
          </FormItem>

          <FormItem
            prop="checkf"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否对全体教职员工和来自境外、国内重点地区的学生返校前7天进行核酸检测</span>
            <span class="item">{{form.checkf==1?'是':'否'}}</span>
          </FormItem>

          <FormItem
            prop="checkg"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否建立师生进入登记、测温，以及异常健康人员信息上报制度</span>
            <span class="item">{{form.checkg==1?'是':'否'}}</span>
          </FormItem>

          <FormItem
            prop="checkh"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否确保学生之间距离不少于1米</span>
            <span class="item">{{form.checkh==1?'是':'否'}}</span>
          </FormItem>

          <FormItem
            prop="checki"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否明确辖区发热门诊、辖区疾控机构联系方式</span>
            <span class="item">{{form.checki==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkj"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否做到“封闭式”管理，严控人员进出</span>
            <span class="item">{{form.checkj==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkk"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否进行应急预案的演练</span>
            <span class="item">{{form.checkk==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkl"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否设置有临时观察区</span>
            <span class="item">{{form.checkl==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkm"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否通风良好（自然通风效果不佳可增加机械辅助通风设施）</span>
            <span class="item">{{form.checkm==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkn"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否设置足够洗手设施或免洗手消毒剂（含乙醇60%以上）</span>
            <span class="item">{{form.checkn==1?'是':'否'}}</span>
          </FormItem>

          <FormItem
            prop="checko"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否对本机构全体教师进行了一次《中山市中小学疫情防控下返校心理建设指引》专题培训？</span>
            <span class="item">{{form.checko==1?'是':'否'}}</span>
          </FormItem>
          <FormItem
            prop="checkp"
            :rules="{required: true,message:'请选择',trigger: 'change', type:'number'}"
          >
            <span style="margin-right:20px">是否制定接送车辆防疫预案和日常消毒制度</span>
            <span class="item">{{form.checkp==1?'是':'否'}}</span>
            <!-- </FormItem> -->
          </FormItem>
        </div>
        <FormItem label="机构疫情防控物资情况（口罩、测温仪器、消杀用品等））">
          <Table ref="myTable" border :columns="columns" :data="form.supplies" size="small"></Table>
          <ButtonGroup>
            <Button type="error" size="small" style="width:60px;" @click.native="deletItem">删除行</Button>
            <Button type="primary" size="small" style="width:60px;" @click.native="addItem">添加行</Button>
          </ButtonGroup>
        </FormItem>
        <FormItem label="23.本机构已知晓并承诺：" prop="protocol">
          <p>严格落实《中华人民共和国传染病防治法》，按照国家、省、市相关要求，认真履行主体责任，完善应急预案，已经落实各项防范措施（详见下面自查情况），保障教职员工、学生的生命安全和身体健康，确保不发生传染性疫情事件。若因防范措施不到位或者管理不当，发生疫情并导致疫情传播，产生重大影响，立即停课并承担相应的法律后果。</p>
          <span class="item">{{form.protocol==1?'是':'否'}}</span>
        </FormItem>
      </Form>
    </div>
    <Divider />
    <div class="button-ground">
      <Button type="default" @click.native="goBack('formValidate')">返回列表</Button>
    </div>
  </div>
</template>
<script>
import { applyDetailById } from "@/api";
export default {
  data() {
    return {
      id: "",
      userId: "",
      orgList: [],
      form: {
        supplies: [
          {
            id: 1,
            name: "", //名称
            unit: "", //单位
            number: "" //数量
          }
        ],
        organizationTown: "", //机构所在镇区（街县）
        organizationName: "", //机构名称（全称）
        address: "", //详细地址
        schoolPermitNo: "", //教育部门办学许可证号
        marketRegulationNo: "", //市场监管部门注册证号
        civilAffairsNo: "", //民政部门登记证号
        mohrssNo: "", //人社部门登记证号
        organizationPrincipal: "", //机构负责人
        principalPhone: "", //负责人电话
        filledName: "", //填报人
        filledPhone: "", //填报人电话
        teacherCount: "", //复学教职工总人数（人）
        negativeTeacherCount: "", //复学教职员工核酸检测阴性人数（人）
        stuCount: "", //复学学生人数（人）
        outStuCount: "", //来自境外、重点疫区学员人数（人）
        negativeOutStuCount: "", //来自境外、重点疫区学生核酸检测阴性人数（人）
        startDate: "", //申请复学时间（月日）
        readyDate: "", //机构自查完成时间（月日）
        acceptanceDate: "", //计划镇区专班验收时间（月日）
        submitDate: "", //计划报送市专班时间（月日）
        checka: "", //
        checkb: "", //
        checkc: "", //
        checkd: "", //
        checke: "", //
        checkf: "", //
        checkg: "", //
        checkh: "", //
        checki: "", //
        checkj: "", //
        checkk: "", //
        checkl: "", //
        checkm: "", //
        checkm: "", //
        checkn: "", //
        checko: "", //
        checkp: "", //
        protocol: "" //本机构已知晓并承诺（1是，0否）
      },
      columns: [
        {
          title: "名称",
          key: "name",
          align: "center"
        },
        {
          title: "单位",
          key: "unit"
        },
        {
          title: "数量",
          key: "number"
        }
      ]
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.applyDetailById();
  },
  methods: {
    applyDetailById() {
      applyDetailById({ id: this.id }).then(res => {
        if (res.code == 200) {
          console.log(res);
          this.form = res.result;
        }
      });
    },
    goBack() {
      this.$router.push({ name: "goBackList" });
    }
  }
};
</script>
<style lang="scss" scoped>
.add {
  padding: 16px;
  .item {
    display: inline-block;
    background: #2b85e4;
    color: #fff;
    // min-width: 100px;
    padding: 0 20px;
    text-align: center;
    border-radius: 4px;
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
    height: calc(100vh - 280px);
    overflow: auto;
    padding: 0 20px;
  }
  .button-ground {
    text-align: center;
  }
}
</style>