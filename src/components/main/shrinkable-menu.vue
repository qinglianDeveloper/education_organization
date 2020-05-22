<template>
  <!-- 菜单栏判断是否展开 -->
  <div style="background: white;" class="ivu-shrinkable-menu">
    <slot name="top"></slot>
    <sidebar-menu
      v-show="!shrink"
      :menu-list="menuList"
      :open-names="openNames"
      @on-change="handleChange"
    ></sidebar-menu>
    <sidebar-menu-shrink
      v-show="shrink"
      :menu-list="menuList"
      :icon-color="shrinkIconColor"
      @on-change="handleChange"
    ></sidebar-menu-shrink>
  </div>
</template>

<script>
import sidebarMenu from "./sidebarMenu.vue";
import sidebarMenuShrink from "./sidebarMenuShrink.vue";
// import util from "@/libs/util";
export default {
  name: "shrinkableMenu",
  components: {
    sidebarMenu,
    sidebarMenuShrink
  },
  // props: ["menuList"],
  props: {
    shrink: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: Array,
      required: true
    },
    beforePush: {
      type: Function
    },
    openNames: {
      type: Array
    }
  },
  computed: {
    bgColor() {
      return this.theme === "dark" ? "#515a6e" : "#fff";
    },
    shrinkIconColor() {
      return this.theme === "dark" ? "#fff" : "#515a6e";
    }
  },
  methods: {
    handleChange(name) {
      let willpush = true;
      if (this.beforePush !== undefined) {
        if (!this.beforePush(name)) {
          willpush = false;
        }
      }
      if (willpush) {
        this.$router.push({
          name: name
        });
      }
      this.$emit("on-change", name);
    }
  },
  created() {
    // console.log(this.menuList);
  }
};
</script>
<style lang="scss" scoped>
.ivu-shrinkable-menu {
  height: 100%;
  width: 100%;
}

.ivu-btn-text:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
.ivu-shrinkable-menu {
  overflow: auto;
}
.ivu-shrinkable-menu::-webkit-scrollbar {
  // width: 6px;
  // height: 6px;
  display: none;
}

.ivu-shrinkable-menu::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c3c3c3;
}

.ivu-shrinkable-menu::-webkit-scrollbar-track {
  background: #fff;
}
</style>