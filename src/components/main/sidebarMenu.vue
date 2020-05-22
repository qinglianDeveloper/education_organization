<template>
  <Menu
    :theme="menuTheme"
    accordion
    @on-select="changeMenu"
    ref="sideMenu"
    :active-name="activeName"
    @on-open-change="openChange"
    :open-names="singleOpenName"
  >
    <template v-for="item in menuList">
      <!-- 拥有二级菜单 -->
      <Submenu v-if="item.children.length >= 1" :name="item.name" :key="item.title">
        <template slot="title">
          <Icon :type="item.icon"></Icon>
          <span class="layout-text">{{ item.title}}</span>
        </template>
        <template v-for="child in item.children">
          <MenuItem
            :name="child.name"
            :to="child.name"
            :key="'menuitem' + child.name"
            @click="activeName = child.name"
          >
            <Icon :type="child.icon" :key="'icon' + child.name"></Icon>
            <span class="layout-text" :key="'title' + child.name">{{ child.title }}</span>
          </MenuItem>
        </template>
      </Submenu>
      <!-- 拥有二级菜单 -->
    </template>
  </Menu>
</template>

<script>
import bus from "@/utils/bus";
export default {
  name: "sidebarMenu",
  data() {
    return {
      menuTheme: "light",
      activeName: "menuManage",
      openMenu: "",
      singleOpenName: []
      //once:true
    };
  },
  props: {
    menuList: Array,
    // iconSize: Number,
    openNames: {
      type: Array
    }
  },
  created() {},
  methods: {
    changeMenu(active) {
      sessionStorage.setItem("active", active);
      this.$emit("on-change", active);
      bus.$emit("on-active", active);
      /* 菜单展开 */
      // if (sessionStorage.getItem("openMenu")) {
      //   console.log(this.openMenu);
      //   if (sessionStorage.getItem("openMenu") == this.openMenu) {
      //     return;
      //   } else {
      //     sessionStorage.setItem("openMenu", this.openMenu);
      //   }
      // } else {
      //   sessionStorage.setItem("openMenu", this.openMenu);
      // }
    },
    openChange(val) {
      this.openMenu = val;
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.activeName = this.$route.name;
        this.$refs.sideMenu.updateOpened();
        this.$refs.sideMenu.updateActiveName();
      }
    });
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      this.singleOpenName = [to.meta.parentName];
    },
    menuList() {
      this.singleOpenName = [this.$route.meta.parentName];
    }
  },
  mounted() {}
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
</style>