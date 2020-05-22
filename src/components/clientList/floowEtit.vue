<template>
  <Modal v-model="follwEdit" title="编辑" width="800" @on-cancel="cancel">
    <Card>
      <p slot="title">基本信息</p>
      <p slot="extra" @click.prevent="changeLimit1">
        <Icon type="md-menu" />
      </p>
      <Form ref="formValidate" :model="followFrom" :rules="ruleValidate" :label-width="100">
        <FormItem label="客户全称" prop="name">
          <Input v-model="followFrom.name" placeholder="输入客户全称" />
        </FormItem>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="简称" prop="shortName">
              <Input v-model="followFrom.shortName" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="类型" prop="type">
              <Select v-model="followFrom.type">
                <Option
                  v-for="item in typeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="编号" prop="code">
              <Input v-model="followFrom.code" />
            </FormItem>
          </Col>
          <Col span="12">
            <!-- <FormItem label="归属分销商">
              <Input v-model="followFrom.code" />
            </FormItem>-->
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="关联业务" prop="relationBusiness">
              <Select v-model="followFrom.relationBusiness">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="产品标签" prop="productTag">
              <Input v-model="followFrom.productTag" />
              <!-- <Select v-model="followFrom.productTag">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>-->
            </FormItem>
          </Col>
        </Row>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="followFrom.status">
            <Radio label="Potential">潜在</Radio>
            <Radio label="MakeDeal">已成单</Radio>
            <Radio label="Disable">失效</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input type="textarea" v-model="followFrom.remark" />
        </FormItem>
      </Form>
    </Card>
    <Card>
      <p slot="title">联系方式</p>
      <p slot="extra" @click.prevent="changeLimit1">
        <Icon type="md-menu" />
      </p>
      <Form ref="formValidate" :model="followFrom" :rules="ruleValidate" :label-width="100">
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="电话:" prop="telephone">
              <Input v-model="followFrom.telephone" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="传真:" prop="fax">
              <Input v-model="followFrom.fax" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="网址:" prop="website">
              <Input v-model="followFrom.website" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱:" prop="email">
              <Input v-model="followFrom.email" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="区域" prop="area">
              <Input v-model="followFrom.area" />
              <!-- <Select v-model="followFrom.area">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>-->
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮编" prop="postcode">
              <Input v-model="followFrom.postcode" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="地址" prop="address">
          <Input type="textarea" v-model="followFrom.address" placeholder="输入地址" />
        </FormItem>
      </Form>
    </Card>
    <Card>
      <p slot="title">商务特征</p>
      <p slot="extra" @click.prevent="changeLimit1">
        <Icon type="md-menu" />
      </p>
      <Form ref="formValidate" :model="followFrom" :rules="ruleValidate" :label-width="100">
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="来源" prop="source">
              <Select v-model="followFrom.source">
                <Option
                  v-for="item in sourceList"
                  :value="item.label"
                  :key="item.label"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关系等级" prop="relationshipLevel">
              <Select v-model="followFrom.relationshipLevel">
                <Option
                  v-for="item in LevelList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="阶段" prop="stage">
              <Select v-model="followFrom.stage">
                <Option
                  v-for="item in stageList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card>
      <p slot="title">客观特侦</p>
      <p slot="extra" @click.prevent="changeLimit1">
        <Icon type="md-menu" />
      </p>
      <Form ref="formValidate" :model="followFrom" :rules="ruleValidate" :label-width="100">
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="企业性质" prop="enterpriseNature">
              <!-- <Input v-model="followFrom.enterpriseNature" /> -->
              <Select v-model="followFrom.enterpriseNature">
                <Option
                  v-for="item in NatureList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="行业" prop="industry">
              <Select v-model="followFrom.industry">
                <Option
                  v-for="item in industryList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="人员规模" prop="staffSize">
              <Select v-model="followFrom.staffSize">
                <Option
                  v-for="item in staffSizeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="法人代表" prop="juridicalPerson">
              <Input v-model="followFrom.juridicalPerson" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="业务区域" prop="businessArea">
              <Input v-model="followFrom.businessArea" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="成立时间" prop="establishTime">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                v-model="followFrom.establishTime"
                placeholder="Select date"
                @on-change="dateChange"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="主营业务" prop="businessScope">
          <Input v-model="followFrom.businessScope" placeholder="输入主营业务" />
        </FormItem>
        <FormItem label="公司简介" prop="companyDescription">
          <Input type="textarea" v-model="followFrom.companyDescription" placeholder="输入公司简介" />
        </FormItem>
      </Form>
    </Card>
    <Card>
      <p slot="title">IT情况</p>
      <p slot="extra" @click.prevent="changeLimit1">
        <Icon type="md-menu" />
      </p>
      <Form ref="formValidate" :model="followFrom" :rules="ruleValidate" :label-width="120">
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="IT人员规模" prop="itPeopleScale">
              <Select v-model="followFrom.itPeopleScale">
                <Option
                  v-for="item in staffSizeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="研发人员规模" prop="developPeopleScale">
              <Select v-model="followFrom.developPeopleScale">
                <Option
                  v-for="item in staffSizeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="运维人员规模" prop="operationalPeopleScale">
              <Select v-model="followFrom.operationalPeopleScale">
                <Option
                  v-for="item in staffSizeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="云账号数量" prop="cloudAccountNum">
              <Input v-model="followFrom.cloudAccountNum" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="已使用云平台" prop="cloudPlatformUsed">
          <Input v-model="followFrom.cloudPlatformUsed" />
        </FormItem>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="阿里云现有系统">
              <Input v-model="followFrom.systemOfAliyun" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否经典网络" prop="isClassicNetwork">
              <RadioGroup v-model="followFrom.isClassicNetwork">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="现有云产品" prop="cloudProductUsed">
              <Input v-model="followFrom.cloudProductUsed" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="年消费规模">
              <Input v-model="followFrom.scaleOfYearConsume" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="是否线下机房" prop="isHasEnginroomOffline">
              <RadioGroup v-model="followFrom.isHasEnginroomOffline">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否有IDC" prop="isHasIdc">
              <RadioGroup v-model="followFrom.isHasIdc">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="线下系统" prop="systemOffline">
              <Input v-model="followFrom.systemOffline" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否虚拟化" prop="isVirtual">
              <RadioGroup v-model="followFrom.isVirtual">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="IT预算" prop="itBudget">
              <Input v-model="followFrom.itBudget" />
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem label="IT信息版本号" prop="itVersion">
              <Input v-model="followFrom.itVersion" />
            </FormItem>
          </Col>-->
        </Row>
        <FormItem label="线下服务器及存储硬件" prop="serverAndHardwareOffline">
          <Input v-model="followFrom.serverAndHardwareOffline" />
        </FormItem>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="主要数据库" prop="mainDatabase">
              <Select v-model="followFrom.mainDatabase">
                <Option
                  v-for="item in mainDatabaseList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="主要开发语言" prop="mainDevelopLanguage">
              <Input v-model="followFrom.mainDevelopLanguage" />
              <!-- <Select v-model="followFrom.mainDevelopLanguage">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>-->
            </FormItem>
          </Col>
        </Row>
        <FormItem label="IT信息id" prop="itId">
          <Input v-model="followFrom.itId" />
        </FormItem>
        <FormItem label="核心业务系统" prop="mainBusinessSystem">
          <Input v-model="followFrom.mainBusinessSystem" />
        </FormItem>
        <FormItem label="补充说明" prop="itRemark">
          <Input type="textarea" v-model="followFrom.itRemark" placeholder="输入补充说明" />
        </FormItem>
      </Form>
    </Card>
    <div slot="footer">
      <Button
        v-if="menuBtns.indexOf('customer:customer:update')>-1"
        @click="handleSubmit('formValidate')"
      >提交</Button>
      <Button @click="handleReset('formValidate')">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { log } from "util";
import { mapState } from "vuex";
import { uploadAction, customerupdate, customerInfo } from "@/api";
import { validatePhone, checkTel, validateEmail } from "@/utils/current";
import bus from "@/utils/bus";
export default {
  data() {
    return {
      mainDatabaseList: [
        { value: "Oracle", label: "Oracle" },
        { value: "Mysql", label: "Mysql" },
        { value: "H2", label: "H2" },
        { value: "MongoDB", label: "MongoDB" },
        { value: "MicrosoftSQLServer", label: "MicrosoftSQLServer" },
        { value: "DB2", label: "DB2" },
        { value: "Redis", label: "Redis" },
        { value: "MicrosoftAccess", label: "MicrosoftAccess" }
      ],
      NatureList: [
        { value: "StateEnterprise", label: "国企" },
        { value: "ForeignEnterprise", label: "外企" },
        { value: "PrivateEnterprise", label: "私企" },
        { value: "Other", label: "其他" }
      ],
      staffSizeList: [
        { value: "SIZE_10_20", label: "10-20人" },
        { value: "SIZE_20_50", label: "20-50人" },
        { value: "SIZE_50_100", label: "50-100人" },
        { value: "SIZE_100_200", label: "100-200人" },
        { value: "SIZE_200_500", label: "200-500人" },
        { value: "SIZE_Above500", label: "500人以上" }
      ],
      industryList: [
        { value: "RealEstateAndArchitecture", label: "房地产与建筑" },
        { value: "Finance", label: "金融业" },
        { value: "ElectronicCommerce", label: "电子商务" },
        { value: "Healthcare", label: "医疗与健康" },
        { value: "EducationAndResearch", label: "教育与科研" },
        { value: "EntertainmentAndSports", label: "文体娱乐与出行消费" },
        { value: "RetailAndWholesale", label: "实体零售与批发" },
        { value: "InternetGame", label: "互联网游戏" },
        { value: "WarehouseAndTransportation", label: "物流仓储与交通运输" },
        {
          value: "SoftWareDevelopAndWebServices",
          label: "软件开发服务与互联网服务"
        },
        { value: "Other", label: "其他" }
      ],
      stageList: [
        { value: "CustomerDevelopment", label: "客户开发阶段" },
        { value: "InfancyCooperation", label: "初期合作阶段" },
        { value: "StableCooperation", label: "稳定合作阶段" },
        { value: "StrategicCooperation", label: "战略合作阶段" }
      ],
      LevelList: [
        { value: "Familiar", label: "密切" },
        { value: "Good", label: "较好" },
        { value: "Normal", label: "一般" },
        { value: "Bad", label: "较差" }
      ],
      name: { title: "" },
      uploadActions: "",
      follwEdit: false,
      sourceList: [
        { value: "自挖掘", label: "SelfExplore" },
        { value: "转介绍", label: "OtherIntroduce" },
        // { value: "线下推广", label: "ExpandOffline" },
        {
          value: "网络推广",
          label: "ExpandOnline"
        },
        {
          value: "内部资源",
          label: "InnerSource"
        },
        {
          value: "会议",
          label: "Meetting"
        },
        {
          value: "其他",
          label: "Other"
        }
      ],
      cityList: [
        { value: "Aliyun", label: "云业务-阿里云" },
        { value: "CloudService", label: "云业务-云服务" },
        { value: "OtherCloud", label: "云业务-其他云" },
        { value: "Hardware", label: "云业务-硬件" },
        { value: "Software", label: "云业务-软件" },
        { value: "Service", label: "云业务-服务" },
        { value: "DingTalk", label: "云业务-钉钉" },
        { value: "SystemDevelopment", label: "云业务-系统开发" },
        { value: "Applet", label: "云业务-app小程序" },
        { value: "Other", label: "云业务-其他" }
      ],
      typeList: [
        {
          value: "客户",
          label: "客户"
        },
        {
          value: "供应商",
          label: "供应商"
        },
        {
          value: "代理商",
          label: "代理商"
        },
        {
          value: "阿里云服务商",
          label: "阿里云服务商"
        },
        {
          value: "阿里云合作伙伴",
          label: "阿里云合作伙伴"
        },
        {
          value: "其他",
          label: "其他"
        }
      ],
      methodsArray: [],
      ruleValidate: {
        // name: [
        //   { required: true, message: "客户名称不能为空", trigger: "blur" }
        // ],
        // shortName: [
        //   { required: true, message: "简称不能为空", trigger: "blur" }
        // ],
        // type: [{ required: true, message: "请选择类型", trigger: "change" }],
        // code: [
        //   { required: true, message: "编号不能为空", trigger: "blur" }
        //   // { type: "number", message: "只能输入数字", trigger: "blur" }
        // ],
        // relationBusiness: [
        //   { required: true, message: "关联业务不能为空", trigger: "blur" }
        // ],
        // productTag: [
        //   { required: true, message: "产品标签不能为空", trigger: "blur" }
        // ],
        // remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        // telephone: [
        //   { required: true, validator: validatePhone, trigger: "blur" }
        // ],
        // fax: [
        //   { required: true, validator: checkTel, trigger: "blur" },
        //   { required: true, message: "传真号码不能为空", trigger: "blur" }
        // ],
        // website: [{ required: true, message: "网址不能为空", trigger: "blur" }],
        // email: [
        //   { required: true, message: "邮箱不能为空", trigger: "blur" }
        //   // { required: true, validator: validateEmail, trigger: "blur" }
        // ],
        // area: [{ required: true, message: "区域不能为空", trigger: "blur" }],
        // postcode: [
        //   { required: true, message: "邮编不能为空", trigger: "blur" }
        //   // { type: "number", message: "只能输入数字", trigger: "blur" }
        // ],
        // address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        // relationshipLevel: [
        //   { required: true, message: "请选择关系等级", trigger: "change" }
        // ],
        // source: [
        //   { required: true, message: "请选择相关来源", trigger: "change" }
        // ],
        // stage: [{ required: true, message: "请选择阶段", trigger: "change" }],
        // enterpriseNature: [
        //   { required: true, message: "请选择企业性质", trigger: "change" }
        // ],
        // industry: [
        //   { required: true, message: "请选择行业", trigger: "change" }
        // ],
        // staffSize: [
        //   { required: true, message: "请选择人员规模", trigger: "change" }
        // ],
        // juridicalPerson: [
        //   { required: true, message: "法人代表不能为空", trigger: "blur" }
        // ],
        // businessArea: [
        //   { required: true, message: "业务区域不能为空", trigger: "blur" }
        // ],
        // establishTime: [
        //   { required: true, message: "请填入成立时间", trigger: "change" }
        // ],
        // businessScope: [
        //   { required: true, message: "主营业务不能为空", trigger: "blur" }
        // ],
        // companyDescription: [
        //   { required: true, message: "公司简介不能为空", trigger: "blur" }
        // ],
        // itPeopleScale: [
        //   { required: true, message: "请选择IT人员规模", trigger: "change" }
        // ],
        // developPeopleScale: [
        //   { required: true, message: "请选择研发人员规模", trigger: "change" }
        // ],
        // operationalPeopleScale: [
        //   { required: true, message: "请选择运维人员规模", trigger: "change" }
        // // ],
        // cloudAccountNum: [
        //   { required: true, message: "云账号数量不能为空", trigger: "blur" }
        //   // { type: "number", message: "只能输入数字", trigger: "blur" }
        // ],
        // cloudPlatformUsed: [
        //   { required: true, message: "已使用云平台不能为空", trigger: "blur" }
        // ],
        // systemOfAliyun:[
        //   { required: true, message: "阿里云现有系统不能为空", trigger: "blur" },
        // ],
        // isClassicNetwork: [
        //   { required: true, message: "请选择经典网络", trigger: "change" }
        // ],
        // cloudProductUsed: [
        //   { required: true, message: "现有云产品不能为空", trigger: "blur" }
        // ],
        // scaleOfYearConsume:[
        //   { required: true, message: "年消费规模不能为空", trigger: "blur" },
        // ],
        // isHasEnginroomOffline: [
        //   { required: true, message: "请选择线下机房", trigger: "change" }
        // ],
        // isHasIdc: [
        //   { required: true, message: "请选择是否有IDC", trigger: "change" }
        // ],
        // systemOffline: [
        //   { required: true, message: "线下系统不能为空", trigger: "blur" }
        // ],
        // isVirtual: [
        //   { required: true, message: "请选择是否虚拟化", trigger: "change" }
        // ],
        // status: [{ required: true, message: "请选择状态", trigger: "change" }],
        // itVersion: [
        //   { required: true, message: "IT版本号不能为空", trigger: "blur" },
        //   // { type: "number", message: "只能输入数字", trigger: "blur" }
        // ],
        // mainDatabase: [
        //   { required: true, message: "请选择主要数据库", trigger: "change" }
        // ],
        // mainDevelopLanguage: [
        //   { required: true, message: "主要开发语言不能为空", trigger: "blur" }
        // ]
      },
      followFrom: {
        id: "", // 唯一标识
        name: "", // 客户名称
        shortName: "", // 简称
        code: "", // 编号
        status: "", //关联状态,（关联customer_status）
        type: "", // 类型,（关联customer_type）
        relationBusiness: "", //关联业务 ,（关联 business_type
        productTag: "", // 产品标签 ,（关联product_label）
        remark: "", // 备注
        telephone: "", // 固定电话号码
        fax: "", // 传真
        website: "", // 网址
        areaId: "", // 区域id
        area: "", // 区域
        address: "", // 详细地址
        email: "", //邮箱
        postcode: "", // 邮政编码
        source: "", // 客户来源
        relationshipLevel: "", // 关系等级
        stage: "", // 客户阶段
        creditRatings: "", // 信用等级,（关联 credit_ratings）
        enterpriseNature: "", // 企业性质,（关联 enterprise_nature）
        industry: "", // 所属行业, （关联 industry_type）
        staffSize: "", // 人员规模,（关联 staff_size)
        juridicalPerson: "", // 法人代表
        businessArea: "", // 业务区域
        establishTime: "", // 成立时间yyyy-MM-dd
        businessScope: "", // 业务范围
        companyDescription: "", //企业描述
        version: 0, // 版本号
        itId: "", //it信息id
        itPeopleScale: "", // IT人员规模,（关联 staff_size）
        developPeopleScale: "", //开发人员规模,（关联 staff_size）
        operationalPeopleScale: "", // 运维人员规模, （关联 staff_size）
        mainDevelopLanguage: "", //主开发语言,(关联 develop_language)
        mainDatabase: "", //主要数据库,（关联 database）
        cloudPlatformUsed: "", //已使用的云平台
        mainBusinessSystem: "", //核心业务系统
        cloudAccountNum: 0, // 云账号个数
        systemOfAliyun: "", //阿里云现有系统
        isClassicNetwork: "", // 是否经典网络
        cloudProductUsed: "", // 现有云产品
        isHasEnginroomOffline: "", // 是否拥有线下机房
        scaleOfYearConsume: "", // 年消费规模
        isVirtual: "", //是否虚拟化
        isHasIdc: "", // 是否有用IDC
        itBudget: "", // IT预算
        systemOffline: "", // 线下系统
        serverAndHardwareOffline: "", // 线下服务器和存储硬件
        itRemark: "", // IT信息补充说明
        itVersion: 0 //IT信息版本号
      },
      data: {}
    };
  },
  props: ["etidShow"],
  watch: {
    etidShow(newVal) {
      this.follwEdit = newVal;
    }
  },
  mounted() {
    bus.$off("etidId");
    bus.$on("etidId", item => {
      this._customerInfo();
    });
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  methods: {
    cancel() {
      this.$emit("handlesubmit", false);
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          customerupdate(this.followFrom).then(res => {
            if (res.code == 200) {
              this.$Message.success("修改成功!");
              this.$emit("handlesubmit", false);
              bus("submitEtid", false);
            }
          });
        } else {
          this.$Message.error("请把必填信息填写完整");
        }
      });
    },
    _customerInfo() {
      let id = this.$route.query.id;
      // console.log(123);
      customerInfo(id).then(res => {
        if (res.code == 200) {
          this.followFrom.id = id;
          this.followFrom.name =
            res.result.customerInfoBaseVO.name == null
              ? ""
              : res.result.customerInfoBaseVO.name;
          this.followFrom.shortName =
            res.result.customerInfoBaseVO.shortName == null
              ? ""
              : res.result.customerInfoBaseVO.shortName;
          this.followFrom.code =
            res.result.customerInfoBaseVO.code == null
              ? ""
              : res.result.customerInfoBaseVO.code;
          this.followFrom.status =
            res.result.customerInfoBaseVO.status == null
              ? ""
              : res.result.customerInfoBaseVO.status;
          this.followFrom.type =
            res.result.customerInfoBaseVO.type == null
              ? ""
              : res.result.customerInfoBaseVO.type;
          this.followFrom.relationBusiness =
            res.result.customerInfoBaseVO.relationBusiness == null
              ? ""
              : res.result.customerInfoBaseVO.relationBusiness;
          this.followFrom.productTag =
            res.result.customerInfoBaseVO.productTag == null
              ? ""
              : res.result.customerInfoBaseVO.productTag;
          this.followFrom.remark =
            res.result.customerInfoBaseVO.remark == null
              ? ""
              : res.result.customerInfoBaseVO.remark;
          this.followFrom.telephone =
            res.result.customerInfoContactVO.telephone == null
              ? ""
              : res.result.customerInfoContactVO.telephone;
          this.followFrom.fax =
            res.result.customerInfoContactVO.fax == null
              ? ""
              : res.result.customerInfoContactVO.fax;
          this.followFrom.website =
            res.result.customerInfoContactVO.website == null
              ? ""
              : res.result.customerInfoContactVO.website;
          this.followFrom.areaId =
            res.result.customerInfoContactVO.areaId == null
              ? ""
              : res.result.customerInfoContactVO.areaId;
          this.followFrom.area =
            res.result.customerInfoContactVO.area == null
              ? ""
              : res.result.customerInfoContactVO.area;
          this.followFrom.address =
            res.result.customerInfoContactVO.address == null
              ? ""
              : res.result.customerInfoContactVO.address;
          this.followFrom.email =
            res.result.customerInfoContactVO.email == null
              ? ""
              : res.result.customerInfoContactVO.email;
          this.followFrom.postcode =
            res.result.customerInfoContactVO.postcode == null
              ? ""
              : res.result.customerInfoContactVO.postcode;
          this.followFrom.source =
            res.result.customerInfoBussinessVO.source == null
              ? ""
              : res.result.customerInfoBussinessVO.source;
          this.followFrom.relationshipLevel =
            res.result.customerInfoBussinessVO.relationshipLevel == null
              ? ""
              : res.result.customerInfoBussinessVO.relationshipLevel;
          this.followFrom.stage =
            res.result.customerInfoBussinessVO.stage == null
              ? ""
              : res.result.customerInfoBussinessVO.stage;
          this.followFrom.creditRatings =
            res.result.customerInfoBussinessVO.creditRatings == null
              ? ""
              : res.result.customerInfoBussinessVO.creditRatings == null
              ? ""
              : res.result.customerInfoBussinessVO.stage;
          this.followFrom.enterpriseNature =
            res.result.customerInfoObjectiveVO.enterpriseNature == null
              ? ""
              : res.result.customerInfoBussinessVO.stage;
          this.followFrom.industry =
            res.result.customerInfoObjectiveVO.industry == null
              ? ""
              : res.result.customerInfoBussinessVO.stage;
          this.followFrom.staffSize =
            res.result.customerInfoObjectiveVO.staffSize == null
              ? ""
              : res.result.customerInfoObjectiveVO.staffSize;
          this.followFrom.juridicalPerson =
            res.result.customerInfoObjectiveVO.juridicalPerson == null
              ? ""
              : res.result.customerInfoObjectiveVO.juridicalPerson;
          this.followFrom.businessArea =
            res.result.customerInfoObjectiveVO.businessArea == null
              ? ""
              : res.result.customerInfoObjectiveVO.businessArea;
          this.followFrom.establishTime =
            res.result.customerInfoObjectiveVO.establishTime == null
              ? ""
              : res.result.customerInfoObjectiveVO.establishTime;
          this.followFrom.businessScope =
            res.result.customerInfoObjectiveVO.businessScope == null
              ? ""
              : res.result.customerInfoObjectiveVO.businessScope;
          this.followFrom.companyDescription =
            res.result.customerInfoObjectiveVO.companyDescription == null
              ? ""
              : res.result.customerInfoObjectiveVO.companyDescription;
          this.followFrom.version =
            res.result.customerInfoOtherVO.version == null
              ? 0
              : res.result.customerInfoOtherVO.version;
          this.followFrom.itId =
            res.result.customerInfoITVO.itId == null
              ? ""
              : res.result.customerInfoITVO.itId;
          this.followFrom.itPeopleScale =
            res.result.customerInfoITVO.itPeopleScale == null
              ? ""
              : res.result.customerInfoITVO.itPeopleScale;
          this.followFrom.developPeopleScale =
            res.result.customerInfoITVO.developPeopleScale == null
              ? ""
              : res.result.customerInfoITVO.developPeopleScale;
          this.followFrom.operationalPeopleScale =
            res.result.customerInfoITVO.operationalPeopleScale == null
              ? ""
              : res.result.customerInfoITVO.operationalPeopleScale;
          this.followFrom.mainDevelopLanguage =
            res.result.customerInfoITVO.mainDevelopLanguage == null
              ? ""
              : res.result.customerInfoITVO.mainDevelopLanguage;
          this.followFrom.mainDatabase =
            res.result.customerInfoITVO.mainDatabase == null
              ? ""
              : res.result.customerInfoITVO.mainDatabase;
          this.followFrom.cloudPlatformUsed =
            res.result.customerInfoITVO.cloudPlatformUsed == null
              ? ""
              : res.result.customerInfoITVO.cloudPlatformUsed;
          this.followFrom.mainBusinessSystem =
            res.result.customerInfoITVO.mainBusinessSystem == null
              ? ""
              : res.result.customerInfoITVO.mainBusinessSystem;
          this.followFrom.cloudAccountNum =
            res.result.customerInfoITVO.cloudAccountNum == null
              ? ""
              : res.result.customerInfoBussinessVO.cloudAccountNum;
          this.followFrom.systemOfAliyun =
            res.result.customerInfoITVO.systemOfAliyun == null
              ? ""
              : res.result.customerInfoITVO.systemOfAliyun;
          this.followFrom.isClassicNetwork =
            res.result.customerInfoITVO.isClassicNetwork == null
              ? ""
              : res.result.customerInfoITVO.isClassicNetwork;
          this.followFrom.cloudProductUsed =
            res.result.customerInfoITVO.cloudProductUsed == null
              ? ""
              : res.result.customerInfoITVO.cloudProductUsed;
          this.followFrom.isHasEnginroomOffline =
            res.result.customerInfoITVO.isHasEnginroomOffline == null
              ? ""
              : res.result.customerInfoITVO.isHasEnginroomOffline;
          this.followFrom.scaleOfYearConsume =
            res.result.customerInfoITVO.scaleOfYearConsume == null
              ? ""
              : res.result.customerInfoITVO.scaleOfYearConsume;
          this.followFrom.isVirtual =
            res.result.customerInfoITVO.isVirtual == null
              ? ""
              : res.result.customerInfoITVO.isVirtual;
          this.followFrom.isHasIdc =
            res.result.customerInfoITVO.isHasIdc == null
              ? ""
              : res.result.customerInfoITVO.isHasIdc;
          this.followFrom.itBudget =
            res.result.customerInfoITVO.itBudget == null
              ? ""
              : res.result.customerInfoITVO.itBudget;
          this.followFrom.systemOffline =
            res.result.customerInfoITVO.systemOffline == null
              ? ""
              : res.result.customerInfoITVO.systemOffline;
          this.followFrom.serverAndHardwareOffline =
            res.result.customerInfoITVO.serverAndHardwareOffline == null
              ? ""
              : res.result.customerInfoBussinessVO.serverAndHardwareOffline;
          this.followFrom.itRemark =
            res.result.customerInfoITVO.itRemark == null
              ? ""
              : res.result.customerInfoITVO.itRemark;
          this.followFrom.itVersion =
            res.result.customerInfoITVO.itVersion == null
              ? 0
              : res.result.customerInfoITVO.itVersion;
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$emit("handlesubmit", false);
    },
    dateChange(e) {
      this.followFrom.establishTime = e;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>