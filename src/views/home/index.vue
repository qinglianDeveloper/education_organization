<template>
  <div class="home">
    <!-- {{"1"+menuBtns}} -->
    <datePage v-if="showData"></datePage>
    <welcomePage v-if="showWelcome"></welcomePage>
  </div>
</template>
<script>
import datePage from "./datePage";
import welcomePage from "./welcomePage";
import { mapState } from "vuex";
export default {
  name: "home",
  components: { datePage, welcomePage },
  created() {
    // console.log(this.menuBtns);
    // this.showHome();
  },
  mounted() {
    // this.showHome();
  },
  data() {
    return {
      showData: false,
      showWelcome: false
    };
  },
  methods: {
    showHome() {
      if (
        this.menuBtns.indexOf("home:data") > -1 &&
        this.menuBtns.indexOf("home:welcome") == -1
      ) {
        console.log("1");
        this.showData = true;
        this.showWelcome = false;
      } else if (
        this.menuBtns.indexOf("home:data") > -1 &&
        this.menuBtns.indexOf("home:welcome") > -1
      ) {
        console.log("2");
        this.showData = true;
        this.showWelcome = false;
      } else if (
        this.menuBtns.indexOf("home:data") == -1 &&
        this.menuBtns.indexOf("home:welcome") > -1
      ) {
        console.log("3");

        this.showData = false;
        this.showWelcome = true;
      } else if (
        this.menuBtns.indexOf("home:data") == -1 &&
        this.menuBtns.indexOf("home:welcome") == -1
      ) {
        console.log("4");

        this.showData = false;
        this.showWelcome = true;
      }
    }

    // showData() {
    //   if (
    //     this.menuBtns.indexOf("home:data") > -1 ||
    //     this.menuBtns.indexOf("home:welcome") == -1
    //   ) {
    //     return true;
    //   } else if (
    //     this.menuBtns.indexOf("home:data") > -1 ||
    //     this.menuBtns.indexOf("home:welcome") > -1
    //   ) {
    //     return true;
    //   }
    // },
    // showWelcome() {
    //   if (
    //     this.menuBtns.indexOf("home:data") == -1 ||
    //     this.menuBtns.indexOf("home:welcome") > -1
    //   ) {
    //     return true;
    //   } else if (
    //     this.menuBtns.indexOf("home:data") == -1 ||
    //     this.menuBtns.indexOf("home:welcome") == -1
    //   ) {
    //     return true;
    //   }
    // }
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  watch: {
    menuBtns() {
      this.showHome();
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>