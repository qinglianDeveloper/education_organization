<template>
  <div class="applyListTrusteeship main-width">
    <div class="text-center c666" style="padding:20px;" v-if="arr.length === 0">暂时没数据</div>
    <CellGroup v-if="arr.length > 0">
        <Cell :title="item.organizationName" @click.native="goLink(item)" v-for="(item,index) in arr" :key="index">
            <span :class="{'color0':item.status === 0,'color1':item.status === 1,'color2':item.status === 2}" slot="extra">{{item.status | statusFilter}}</span>
        </Cell>
    </CellGroup>
  </div>
</template>
<script>
import { getNurserylist } from "@/api";
export default {
  components: { 
    
  },
  data() {
    return {
      userInfo:{},
      arr:[]
    };
  },
  created() {
    this.userInfo = this.$store.state.h5_user.h5_userInfo;
    this.getNurserylists();
  },
  filters:{
    statusFilter(n){
      let status = '';
      switch (n) {
        case 0:
          status = '已提交';
          break;
        case 1:
          status = '查收资料';//通过
          break;
        case 2:
          status = '未通过';
          break;
        default:
          status = '没有对应的状态';
          break;
      }
      return status;
    }
  },
  mounted() {
    
  },
  methods: {
    goLink(item){
      //链接跳转
      let {id,status} = item;
      if(status === 0){
        this.$Message.success("请耐心等待");
      }
      if(status === 1){
        this.$Message.success("审核已通过");
      }
      if(status === 2){
        this.$router.push(`/h5-applyFail/${id}`);
      }
    },
    getNurserylists(){
      //条件搜索复学审批表列表
      let obj = {
        pageNumber:1,
        pageSize:999,
        //status:1,//0已提交，1通过，2未通过
        //organizationId:this.userInfo.id,
      }
      getNurserylist(obj).then(res=>{
        this.arr = res.result.content;
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "./common.scss";
</style>
<style lang="scss" scoped>
.applyListTrusteeship{
  padding: 5px 0px;
  .color0{
    color: #434343;
  }
  .color1{
    color: #008000;
  }
  .color2{
    color: #FF0000;
  }
}
</style>