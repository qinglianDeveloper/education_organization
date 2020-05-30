<template>
  <div class="monitorDetails main-width padding-lr">
    <div class="big-title f18 bold text-center">
      <span>{{MM}}月{{DD}}日</span>
      <Button class="save" type="primary" size="small" style="width:50px;" @click.native="save">保存</Button>
    </div>
    <Form label-position="top">
      <FormItem label="所在培训机构">
        <Select
          v-model="organizationId"
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          @on-change="getHealthDetails"
          >
          <Option v-for="(option, index) in options" :value="option.id" :key="index">{{option.orgName}}</Option>
        </Select>
      </FormItem>
    </Form>
    <Table border :columns="columns" :data="arr">
      <template slot-scope="{row}" slot="temperatureHome">
          <Tag :color="changeTemp(row.temperatureHome)">{{row.temperatureHome }}℃</Tag>
        </template>
        <template slot-scope="{row}" slot="cough">
          <Tag :color="row.cough==1?'red':'green'">{{row.cough==1?'是':'否'}}</Tag>
        </template>
        <template slot-scope="{row}" slot="attendance">
          <Tag>{{row.attendance | changeAttendance}}</Tag>
          <!-- <i-switch v-model="row.attendance" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch> -->
        </template>
        <template slot-scope="{row}" slot="healthCode">
          <Tag :color="codeColor(row.healthCode)">{{row.healthCode | changeCode}}</Tag>
        </template>
    </Table>
  </div>
</template>
<script>
import { getOrgList,saveTemperature,healthDetails } from "@/api";
export default {
  components: {},
  data() {
    return {
      MM:'',
      DD:'',
      organizationId:'',
      creationDate:'',

      loading: false,
      options:[],
      arr: [
        /* {
          userName:'小明',
          temperatureHome:36,
          cough:1,
          healthCode:1,
          temperatureOrg:36,
          attendance:0
        } */
      ],
      columns: [
        {
          title: "姓名",
          key: "userName",
          align: 'center',
        },
        {
          title: "居家测温",
          key: "temperatureHome",
          align: 'center',
          slot: "temperatureHome"
        },
        {
          title: "咳嗽",
          key: "cough",
          align: 'center',
          slot: "cough"
        },
        {
          title: "粤康码",
          key: "healthCode",
          align: 'center',
          slot: "healthCode"
        },
        {
          title: "是否请假",
          key: "attendance",
          align: 'center',
          slot: "attendance"
        },
        {
          title: "机构测温",
          key: "temperatureOrg",
          align: 'center',
          render:(h,params) => {
            return h('Input',{
              props: {
                value:this.arr[params.index].temperatureOrg,
                type:'number',
                //disabled:true,
                //size:'small',
              },
              on: {
                input: (val) => {
                  this.arr[params.index].temperatureOrg = val;
                }
              },
            })
          }
        },
      ],
    };
  },
  filters: {
    changeCode(msg) {
      switch (msg) {
        case 0:
          return "绿码";
        case 1:
          return "红码";
        case 2:
          return "黄码";
      }
    },
    changeAttendance(msg){
      //病假，事假，正常
      switch (msg) {
        case 0:
          return "正常";
        case 1:
          return "病假";
        case 2:
          return "事假";
      }
    }
  },
  created() {
    this.setDate();
    this.remoteMethod();
  },
  mounted() {},
  methods: {
    changeTemp(msg) {
      if (msg > 37.3) {
        return "red";
      } else {
        return "green";
      }
    },
    codeColor(msg) {
      switch (msg) {
        case 0:
          return "success";
        case 1:
          return "error";
        case 2:
          return "warning";
      }
    },
    setDate(){
      let {date} = this.$route.query;
      let d = new Date(date.replace(/\-/g, '/'));    
      let YY = d.getFullYear();
      let MM = d.getMonth() + 1;
      let DD = d.getDate() ;
      let add0 = (n) => n < 10 ? '0' + n : n;
      this.creationDate = `${YY}-${add0(MM)}-${add0(DD)}`
      this.MM = MM;
      this.DD = DD;
    },
    remoteMethod (query = '') {
      //获取机构列表
      let obj = {
        orgName:query,//教育机构名称
        type:'EDUCATION', //EDUCATION: 教育机构 TRUSTEESHIP:托管机构
        pageNumber:1,
        pageSize:100,
        isAllowResume:1,//是否允许复学
      }
      this.loading = true;
      getOrgList(obj).then(res=>{
        this.loading = false;
        if(res.code === 200){
          this.options = res.result.content;
        }else{
          this.$Message.error(res.result);
        }
      });
    },
    getHealthDetails(){
      //
      let obj = {
        pageNumber:1,
        pageSize:999,
        organizationId:this.organizationId,
        creationDate:this.creationDate,
      }
      healthDetails(obj).then(res=>{
        if(res.code === 200){
          this.arr = res.result.content;
        }else{
          this.$Message.error(res.result);
        }
      })
    },
    save(){
      //保存
      let list = this.arr.map(item=>{
        return {
          id: item.id,
          temperatureOrg: item.temperatureOrg
        }
      });
      saveTemperature(list).then(res=>{
        if(res.code === 200){
          this.$Message.success("保存成功");
        }else{
          this.$Message.error(res.result);
        }
      });
    }
  }
};
</script>
<style lang="scss">
.monitorDetails {
  .ivu-table-cell{
    padding: 0 !important;
    display: flex;
    justify-content: center;
  }
  .ivu-tag{
    margin: 0;
  }
  input{
    text-align: center;
    border: none;
    outline: none;
    box-shadow:none;
  }
}
</style>
<style lang="scss" scoped>
@import "./common.scss";
.monitorDetails {
  padding: 20px 0px;
  .big-title {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 10px;
    .save {
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
    }
  }
}
</style>