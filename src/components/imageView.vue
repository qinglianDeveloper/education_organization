<!-- 上传附件组件 -->
<template>
  <div class="component">
    <div class="img-box" :style="{width:width+'px',height:height+'px'}">
      <img :src="src" alt="图片"/>
      <div class="demo-upload-list-cover">
        <Icon class="icon" type="ios-eye-outline" @click.native="show"></Icon>
        <!-- <Icon type="ios-trash-outline" @click.native="handleRemove('carousel',index)"></Icon> -->
      </div>
    </div>

     <!-- 大图弹框 -->
    <Modal title="图片查看" v-model="visible">
      <div style="text-align:center">
        <img :src="src" v-if="visible" style="width:100%" />
      </div>
    </Modal>

  </div>
</template>
<script>
import config from "@/config";
export default {
  props: { 
    width: {
      type: [String, Number],
      default: function () {
        return 50;
      }
    },
    height: {
      type: [String, Number],
      default: function () {
        return 50;
      }
    },
    src: {
      type: null,//任意类型
      default: ''
    },
   },
  data() {
    return {
      visible:false,
    };
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    show(){
      //展示图片
      let {src} = this;
      if(src !== null && src !== undefined && src !== ''){
        this.visible = true;
      }else{
        this.$Message.warning('图片链接不存在');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.component{
  .img-box{
    img{
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
    position: relative;
    margin: 0 auto;
    cursor: pointer;
    &:hover{
      .demo-upload-list-cover{
        visibility: visible;
      }
    }
    .demo-upload-list-cover{
      visibility: hidden;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      .icon{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
      }
    }
  }
}
</style>