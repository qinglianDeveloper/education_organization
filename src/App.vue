<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import cookie from "js-cookie";
import { getUserMenu } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  name: "app",
  data() {
    return {};
  },
  async created() {
    if (sessionStorage.getItem("userInfo")) {
      await this.getMenuList();
    }
  },
  computed: {
    // ...mapState({
    //   menuList: state => state.menu.menuList
    // })
  },
  watch: {},
  created(){
    let userInfo = localStorage.getItem('h5_userInfo');
    if(userInfo !== null){
      userInfo = JSON.parse(userInfo);
      this.$store.commit("h5_saveUserInfo", userInfo);
    }


    
  },
  methods: {
    ...mapActions("menu", ["getMenuList"])
  }
};
</script>

<style lang="scss">
body {
  /* 页面是否可选择 */
  // -moz-user-select: none;
  // -webkit-user-select: none;
  // -ms-user-select: none;
  // user-select: none;
}
#app {
  height: 100%;
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 5px solid transparent;
}

::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
}

::-webkit-scrollbar-thumb {
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.2) inset;
}

::-webkit-scrollbar-corner {
  background: transparent;
}
</style>