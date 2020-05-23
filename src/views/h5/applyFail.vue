<template>
  <div class="applyFail main-width padding-lr">
    <div class="big-title f18 bold text-center">您的申请未通过</div>
    <Form :model="form" label-position="top" style="min-height:200px;">
        <FormItem label="原因如下：">
            <p>原因555555</p>
        </FormItem>
    </Form>
    <div class="button-ground">
      <Button class="Button" type="primary">重新申请</Button>
      <Button class="Button" type="default">返回</Button>
    </div>
  </div>
</template>
<script>
export default {
  components: { 
    
  },
  data() {
    return {
      form:{
        phone:''
      }
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
.applyFail{
  .big-title{
    padding: 30px 0px;
    color: #f00;
  }
  .Button{
    margin: 10px 0px;
  }
}
</style>