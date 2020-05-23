<template>
  <div class="user main-width">
    <div class="head">
      <div class="name f20 bold cfff">张三（机构负责人）</div>
      <div class="desc f14 cfff">某某某某教育机构</div>
    </div>
    <CellGroup>
        <Cell title="每日健康监测记录" to="h5-monitorList" />
        <Cell title="机构复学申报记录" to="h5-applyList" />
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
      
    };
  },
  created() {
    
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