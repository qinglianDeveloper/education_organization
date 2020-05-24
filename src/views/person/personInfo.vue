<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-23 14:53:38
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-24 17:30:50
--> 
<template>
  <div class="trainlist">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>学生教师信息列表</span>
        </div>
        <!-- <div class="export-btn">
          <Button type="primary" icon="md-add" @click="add">新建</Button>
        </div>-->
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <Row>
      <!-- 教师 -->
      <Tabs :value="TabsValue" @on-click="clickTabs">
        <TabPane label="教师" name="teacher">
          <Table
            :columns="columnsTeacher"
            :data="dataTeacher"
            border
            ref="table"
            :loading="loadingTeacher"
            :height="tableHeight"
            @on-selection-change="changeSelectTeacher"
          >
            <template slot="action" slot-scope="{row,index}">
              <Button type="success" size="small" @click="handleDetails(row,index)">查看详情</Button>
            </template>
          </Table>
        </TabPane>
        <!-- 学生 -->
        <TabPane label="学生" name="student">
          <Table
            :columns="columnsStuden"
            :data="dataStuden"
            border
            ref="table"
            :loading="loadingStuden"
            :height="tableHeight"
            @on-selection-change="changeSelectStuden"
          >
            <template slot="action" slot-scope="{row,index}">
              <Button type="success" size="small" @click="handleDetails(row,index)">查看详情</Button>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
          :page-size="searchForm.pageSize"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
    </Row>
    <!-- 详情弹框 -->
    <Modal v-model="modalStatus" :title="modalTitle">
      <div class="personInfo-Modal">
        <Form :model="form" label-position="top">
          <div class="big-title">基本信息</div>
            <FormItem label="1.所在培训机构" required>
                <!-- <Select v-model="form.organizationId">
                    <Option v-for="(item,index) in options" :value="item.id" :key="index">{{ item.orgName }}</Option>
                </Select> -->
                <Input v-model="form.parentName" placeholder="请输入家长姓名"></Input>
            </FormItem>
            <FormItem label="3.家长姓名" v-if="form.identity === 0" required>
                <Input v-model="form.parentName" placeholder="请输入家长姓名"></Input>
            </FormItem>
            <FormItem label="4.家长联系方式" v-if="form.identity === 0" required>
                <Input v-model="form.parentPhone" placeholder="请输入家长联系方式" maxlength="11"></Input>
            </FormItem>
            <FormItem label="5.姓名" required>
                <Input v-model="form.name" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="6.性别" required>
                <RadioGroup v-model="form.gender">
                  <Radio :label="1">男</Radio>
                  <Radio :label="0">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="7.出生日期" required>
              <!-- <DatePicker @on-change="selectDate1" type="date" placeholder="选择日期" style="width: 100%;"></DatePicker> -->
              <Input v-model="form.birthday" placeholder="请输入家长姓名"></Input>
            </FormItem>
            <FormItem label="8.身份证号" required>
                <Input v-model="form.idCardNumber" placeholder="请输入身份证号" maxlength="18"></Input>
            </FormItem>
            <FormItem label="9.现住址" required>
                <Input v-model="form.address" placeholder="请输入现住址"></Input>
            </FormItem>
            <FormItem label="10.本人及家庭成员是否为新冠肺炎确诊病人或疑似病人" required>
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
            <FormItem label="11.本人及家庭是否曾被要求隔离医学观察（或居家观察）" required>
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
            <p style="margin-bottom:10px;">12.返校（参加培训）前14天，您是否有以下情况</p >
            <FormItem label="12.1是否曾出国或出境？ " required>
                <RadioGroup v-model="form.abroad">
                  <Radio :label="1">是</Radio>
                  <Radio :label="0">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="如是，请具体填写什么时候到过哪些国家和地区" v-show="form.abroad === 1">
                <Input v-model="form.countryArea" placeholder="请输入国家和地区"></Input>
            </FormItem>
            <FormItem label="12.2.是否到过国内重点地区（和中高风险地区）？" required>
                <RadioGroup v-model="form.importantArea">
                  <Radio :label="1">是</Radio>
                  <Radio :label="0">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="12.3.是否接触过来自重点地区（和中高风险地区）或其他有本地病例持续传播地区的发热或有呼吸道症状患者？" required>
                <RadioGroup v-model="form.contactPatient">
                  <Radio :label="1">是</Radio>
                  <Radio :label="0">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="12.4.周围人群中有无2人及以上出现发热、干咳等症状或接触过新冠肺炎患者？" required>
                <RadioGroup v-model="form.aroundPatient">
                  <Radio :label="1">是</Radio>
                  <Radio :label="0">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="12.5.家人/同住人员有无发热、干咳等症状？" required>
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
      </div>
    </Modal>
  </div>
</template>
<script>
import { getTeacherList, getStudentList,personHealthByUser } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  data() {
    return {
      form:{},
      TabsValue: "teacher",
      columnsTeacher: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "教师姓名",
          align: "center",
          key: "userName",
          minWidth: 100
        },
        {
          title: "提交时间",
          align: "center",
          key: "registrationTime",
          minWidth: 160
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 130,
          fixed: "right"
        }
      ],
      dataTeacher: [],
      loadingTeacher: false,
      tableHeight: 0,
      columnsStuden: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "学生姓名",
          align: "center",
          key: "userName",
          minWidth: 100
        },
        {
          title: "提交时间",
          align: "center",
          key: "registrationTime",
          minWidth: 160
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 130,
          fixed: "right"
        }
      ],
      dataStuden: [],
      loadingStuden: false,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      modalStatus: false,
      modalTitle: ""
    };
  },
  created() {
    this.searchForm.orgId = this.$route.query.id;
    this.TabsValue = "teacher";
    this.getTableData();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 120;
    },
    getTableData() {
      if (this.TabsValue == "teacher") {
        getTeacherList(this.searchForm).then(res => {
          if (res.code == 200) {
            res.result.content.forEach(item => {
              if (item.registrationTime) {
                item.registrationTime = dateFormat(item.registrationTime);
              }
            });
            this.dataTeacher = res.result.content;
            this.total = res.result.totalElements;
          }
        });
      } else if (this.TabsValue == "student") {
        getStudentList(this.searchForm).then(res => {
          if (res.code == 200) {
            res.result.content.forEach(item => {
              if (item.registrationTime) {
                item.registrationTime = dateFormat(item.registrationTime);
              }
            });
            this.dataStuden = res.result.content;
            this.total = res.result.totalElements;
          }
        });
      }
    },
    changeSelectTeacher() {},
    changeSelectStuden() {},
    clickTabs(name) {
      this.TabsValue = name;
      //   console.log(name);
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getTableData();
    },
    handleDetails(row, index) {
      this.getPersonHealthDetail(row.id);
      if (this.TabsValue == "teacher") {
        this.modalTitle = "查看详情";
      } else if (this.TabsValue == "student") {
        this.modalTitle = "查看详情";
      }
      this.modalStatus = true;
    },
    getPersonHealthDetail(id){
      //详情
      personHealthByUser({id}).then(res=>{
        if(res.code === 200){

        }
      });
    },
    changePage(e) {
      this.searchForm.pageNumber = e;
      this.getTableData();
    },
    changePageSize(e) {
      this.searchForm.pageSize = e;
      this.getTableData();
    }
  }
};
</script>
<style lang="scss">
.personInfo-Moda{
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
.trainlist {
  padding: 16px;
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
  .footer {
    margin-top: 10px;
  }
}
.personInfo-Modal{
  position: relative;
  &::after{
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
  }
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