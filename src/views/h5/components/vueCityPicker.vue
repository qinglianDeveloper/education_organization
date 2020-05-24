<template>
  <div class="vueCityPicker">
    <vue-city-picker ref="picker" :data="data" :title="title" :cancel-txt="cancelTxt" :confirm-txt="confirmTxt" :selected-index="selectedIndex" @select="select"></vue-city-picker>	
  </div>
</template>
<script>

import vueCityPicker from 'vue-city-bspicker';
import { adressInfo } from "@/api";
export default {
  components: { 
    vueCityPicker
  },
  data() {
    return {
      data:[],
      selectedIndex: [18, 17, 0],
      text: '',
      title: '',
      cancelTxt: '取消',
      confirmTxt:'确定'
    };
  },
  async created() {
    await this.getAdressInfo();
  },
  mounted() {
    //this.show();
  },
  methods: {
    getAdressInfo(){
      //地址
      return Promise.all([
        adressInfo({level:1}),
        adressInfo({level:2}),
        adressInfo({level:3}),
      ]).then(arr=>{
        //province, city, area
        function handle(arg){
          for (let i = 0; i < arg.length; i++) {
            const element = arg[i];
            element.text = element.name;
            element.parentId = element.pid;
          }
          return arg;
        }
        let province = handle(arr[0].result);
        console.log('province: ', province);
        let city = handle(arr[0].result);
        let area = handle(arr[0].result);
        //this.data = [province, city, area];
      });
    },
    show(){
        this.$refs['picker'].show();
    },
    select(){
        console.log(arguments)
        let str = arguments[2].join(' ');
        this.$emit('success',str);
    }
  }
};
</script>
<style lang="scss" scoped>
.vueCityPicker{
  z-index:99999999999;
}
</style>