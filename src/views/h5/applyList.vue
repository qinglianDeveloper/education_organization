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
export default {
  components: { 
    
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