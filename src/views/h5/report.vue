<template>
  <div class="report  main-width padding-lr">
    <div class="ul" v-if="userInfo.type !== 'ORGPRINCIPAL'">
      <!-- 机构负责人 -->
      <router-link class="li" to="/h5-organizationApply" tag="div">
        <p>机构复学申报</p>
      </router-link>
      <router-link class="li" to="/h5-healthyMonitor" tag="div">
        <p>每日健康监测</p>
      </router-link>
      <div class="li unable">
        <p>每日健康监测</p>
        <p>请在复学审批通过后使用此功能<!-- 机构复学申报未通过 --></p>
    </div>
    </div>

    <div class="ul" v-if="userInfo.type !== 'TEACHER'">
      <!-- 老师 -->
      <router-link class="li" to="/h5-healthyWrite" tag="div">
        <p>人员健康申报</p>
      </router-link>
    </div>

    <div class="ul" v-if="userInfo.type !== 'STUDENT'">
      <!-- 学生 -->
      <router-link class="li" to="/h5-healthyWrite" tag="div">
        <p>人员健康申报</p>
      </router-link>
      <router-link class="li" to="/h5-healthyReport" tag="div">
        <p>每日健康监测</p>
      </router-link>
    </div>

    <navigations :num="0"/>
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
    this.userInfo = this.$store.state.h5_user.h5_userInfo;
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
.report{
  .ul{
    padding: 30px 0px;
    .li{
      margin-bottom: 30px;
      height: 130px;
      border-radius: 10px;
      box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:nth-last-child(1){
        margin-bottom: 0px;
      }
      &.unable{
        background: #d7d7d7;
        p{
          color: #797979;
        }
      }
      p{
        font-size: 18px;
        color: #3A4FAF;
      }
    }
  }
}
</style>