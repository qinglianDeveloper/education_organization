<template>
  <div id="app">
    <router-view></router-view>
    <div class="copyright">
      <div class="copyright-box">
        <a
          href="http://www.beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >粤ICP备20027211号-1 &nbsp;&nbsp;&nbsp;</a>
        <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44200002444192"
          target="_blank"
          rel="noopener noreferrer"
        >粤公网安备 44200002444192号</a>
      </div>
    </div>
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
  created() {
    let userInfo = localStorage.getItem("h5_userInfo");
    if (userInfo !== null) {
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
  min-height: 100vh;
  position: relative;
  >div:not(.copyright){
    min-height: 100vh;
  }
}
@media screen and (min-width: 900px)  {
  .copyright {
    $h: 20px;
    height: 0px;
    .copyright-box {
      height: $h !important;
      position: fixed;
      left: 50%;
      margin-left: 150px;
    }
  }
}
.copyright {
  $h: 42px;
  height: $h;
  z-index: 1;
  .copyright-box {
    height: $h;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    background: rgba($color: #fff, $alpha: 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    a {
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0px 5px;
      font-size: 12px;
    }
  }
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