<template>
  <div class="applyList main-width">
    <CellGroup>
        <Cell title="某某某机构复学申请记录" to="h5-applyFail">
            <span class="color1" slot="extra">已通过</span>
        </Cell>
        <Cell title="某某某机构复学申请记录" to="h5-applyFail">
            <span class="color2" slot="extra">未通过</span>
        </Cell>
        <Cell title="某某某机构复学申请记录" to="h5-applyFail">
            <span class="color3" slot="extra">已提交</span>
        </Cell>
    </CellGroup>
  </div>
</template>
<script>
import { getAuditlist } from "@/api";
export default {
  components: { 
    
  },
  data() {
    return {
      userInfo:{},
    };
  },
  created() {
    this.userInfo = this.$store.state.h5_user.h5_userInfo;
    this.getAuditlists();
  },
  mounted() {
    
  },
  methods: {
    getAuditlists(){
      //条件搜索复学审批表列表
      let obj = {
        pageNumber:1,
        pageSize:1,
        //status:1,//0已提交，1通过，2未通过
        organizationId:this.userInfo.id,
      }
      getAuditlist(obj).then(res=>{

      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "./common.scss";
</style>
<style lang="scss" scoped>
.applyList{
  padding: 5px 0px;
  .color1{
    color: #008000;
  }
  .color2{
    color: #FF0000;
  }
  .color3{
    color: #434343;
  }
}
</style>