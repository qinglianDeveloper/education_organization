<template>
  <div class="monitorList main-width">
    <div class="text-center c666" style="padding:20px;" v-if="arr.length === 0">暂时没数据</div>
    <CellGroup v-if="arr.length > 0">
        <Cell :title="`${item}记录`" :to="`h5-monitorDetails?date=${item}`" v-for="(item,index) in arr" :key="index"/>
        <!-- <Cell title="5月22记录" to="h5-applyList" />
        <Cell title="5月22记录" to="h5-applyList" /> -->
    </CellGroup>
  </div>
</template>
<script>
import { healthList } from "@/api";
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
  },
  mounted() {
    this.getHealthList();
  },
  methods: {
    getHealthList(){
      healthList({
        //organizationId:this.userInfo.id,
        //id:'',//健康日报信息表ID
      }).then(res=>{
        if(res.code === 200){
          this.arr = res.result || [];
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
.monitorList{
  padding: 5px 0px;
}
</style>