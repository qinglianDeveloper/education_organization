<template>
  <div class="user main-width">
    <div class="head">
      <div class="name f20 bold cfff">{{userInfo.userName}}（{{userInfo.type | typeFilter}}）</div>
      <!-- <div class="desc f14 cfff">某某某某教育机构</div> -->
    </div>
    <CellGroup>
        <Cell title="健康日报监测记录" v-if="userInfo.type === 'ORGPRINCIPAL'" to="h5-monitorList" />
        <Cell title="机构复学申报记录" v-if="userInfo.type === 'ORGPRINCIPAL'" to="h5-applyList" />
    </CellGroup>
    <navigations :num="1"/>
  </div>
</template>
<script>
import navigations from "./components/navigations";
export default {
  components: { 
    navigations
  },
  data() {
    return {
      userInfo:{},
    };
  },
  created() {
    /* 
    STUDENT("STUDENT", "学生"),
    TEACHER("TEACHER","教师"),
    ORGPRINCIPAL("ORGPRINCIPAL", "培训机构负责人"),
    TOWNPRINCIPAL("TOWNPRINCIPAL", "镇区机构负责人"),
    EDUCATIONPRINCIPAL("EDUCATIONPRINCIPAL", "教育局负责人");
    */
    this.userInfo = this.$store.state.h5_user.h5_userInfo;
  },
  filters:{
    typeFilter(n){
      let type = '';
      switch (n) {
        case 'STUDENT':
          type = '学生';
          break;
        case 'TEACHER':
          type = '教师';
          break;
        case 'ORGPRINCIPAL':
          type = '培训机构负责人';
          break;
        case 'TOWNPRINCIPAL':
          type = '镇区机构负责人';
          break;
        case 'EDUCATIONPRINCIPAL':
          type = '教育局负责人';
          break;
        default:
          type = '';
          break;
      }
      return type;
    }
  },
  mounted() {
    
  },
  methods: {
    
  }
};
</script>
<style scoped lang="scss">
@import "./common.scss";
</style>
<style lang="scss" scoped>
.user{
  .head{
    background: #2d8cf0;
    padding: 20px 25px;
    min-height: 120px;
    margin-bottom: 30px;
    .desc{
      margin-top: 5px;
    }
  }
}
</style>