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
    <Table border :columns="columns" :data="arr"></Table>
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
      arr: [],
      columns: [
        {
          title: "姓名",
          key: "userName",
          align: 'center',
        },
        {
          title: "居家测温",
          key: "name22",
          align: 'center',
        },
        {
          title: "咳嗽",
          key: "cough",
          align: 'center',
        },
        {
          title: "粤康码",
          key: "temperatureHome",
          align: 'center',
          /* render:(h,params) => {
            return h('i',{
              props: {
                value:'',
              },
            })
          } */
        },
        {
          title: "机构测温",
          key: "temperatureOrg",
          align: 'center',
          render:(h,params) => {
            return h('Input',{
              props: {
                value:'',
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
        }
      ],
    };
  },
  created() {
    this.setDate();
    this.remoteMethod();
  },
  mounted() {},
  methods: {
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
      saveTemperature().then(res=>{
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
<style scoped lang="scss">
@import "./common.scss";
</style>
<style lang="scss" scoped>
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