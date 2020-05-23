<template>
  <div class="navigation main-width padding-lr">
    <div class="container">
        <div class="ul main-width">
          <router-link class="li" :class="{'active':num === index}" v-for="(item,index) in arr" :key="index" :to="item.path" replace tag="div">
            <i :class="`iconfont ${item.icon}`"></i>
            <span>{{item.name}}</span>
          </router-link>
          <!-- <div class="li active">
            <i class="iconfont iconjindutianbao"></i>
            <span>填报</span>
          </div>
          <div class="li">
            <i class="iconfont iconmine-gray"></i>
            <span>我的</span>
          </div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: { 
    
  },
  props: { 
    num:Number
  },
  data() {
    return {
      arr:[
        {
          icon:'iconjindutianbao',
          name:'填报',
          path:'/h5-report',
        },
        {
          icon:'iconmine-gray',
          name:'我的',
          path:'/h5-user',
        }
      ]
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
@import "./../common.scss";
</style>
<style lang="scss" scoped>
.navigation{
  $h:50px;
  height: $h;
  .container{
    height: $h;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.1);
    background: #fff;
    .ul{
      height: 100%;
      display: flex;
      align-items: center;
      .li{
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &.active{
          .iconfont,span{
            color: #2d8cf0;
          }
        }
        .iconfont{
          font-size: 20px;
          line-height: 16px;
        }
        span{
          font-size: 12px;
        }
      }
    }
  }
}
</style>