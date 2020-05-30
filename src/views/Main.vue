<template>
  <div class="main">
    <!-- 左侧菜单栏 -->
    <div
      class="sidebar-menu-con menu-bar"
      :style="{width: shrink?'60px':'240px', overflow: shrink ? 'visible' : 'visible'}"
    >
      <div slot="top" class="logo-con">
        <div v-show="!shrink" class="max-title">后台管理系统</div>
        <div v-show="shrink" class="min-title">ADMIN</div>
      </div>

      <shrinkable-menu
        :shrink="shrink"
        @on-change="handleSubmenuChange"
        :before-push="beforePush"
        :menu-list="menuList"
      ></shrinkable-menu>
      <!-- :open-names="openedSubmenuArr" -->
    </div>

    <!-- 右侧头部 -->
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'240px'}">
      <!-- 头部top -->
      <div class="main-header">
        <!-- 控制左侧菜单栏显示隐藏 -->
        <div class="navicon-con">
          <Button
            :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}"
            type="text"
            @click="toggleClick"
            ghost
          >
            <Icon type="md-menu" size="20" style="color: #fff;"></Icon>
          </Button>
        </div>

        <!-- 标签提示导航 -->
        <div class="header-middle-con">
          <div class="main-breadcrumb" style="padding:0;">
            <!-- 从store中拿取面包屑 -->
            <breadcrumb-nav :currentPath="breadCrumbList"></breadcrumb-nav>
            <!-- <breadcrumb-nav :currentPath="current"></breadcrumb-nav> -->
          </div>
        </div>
        <!-- 个人图标 -->
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle">
              <Dropdown trigger="hover" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span
                    class="main-user-name"
                    style="color:white;cursor:pointer"
                  >{{ userInfo.userName }}</span>
                  <Icon type="md-arrow-dropdown" color="white" />
                  <Avatar icon="ios-person" style="background: #619fe7;margin-left: 10px;"></Avatar>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpaceOld">个人中心</DropdownItem>
                  <DropdownItem name="loginout" divided v-show="isShow">退出</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
          </div>
        </div>
      </div>
      <!-- 头部tag菜单 -->
      <div class="tags-con">
        <!-- <crumbs></crumbs> -->
        <!-- <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened> -->
        <tags-nav
          :value="$route"
          @input="handleClick"
          :list="tagNavList"
          @on-close="handleCloseTag"
        />
      </div>
    </div>

    <!-- 右侧内容部分 -->
    <div class="single-page-con" :style="{left: shrink?'60px':'240px'}">
      <!-- 动态组件 -->
      <div class="single-page">
        <!-- <keep-alive :include="cachePage"> -->
        <router-view></router-view>
        <!-- </keep-alive> -->
      </div>
    </div>
  </div>
</template>
<script>
import shrinkableMenu from "@/components/main/shrinkable-menu";
import breadcrumbNav from "@/components/main/breadcrumb-nav";
// import crumbs from "@/components/Crumbs";
import TagsNav from "@/components/tags-nav";
import Cookies from "js-cookie";
import { getUserMenu } from "@/api";
import { getNewTagList, routeEqual } from "@/libs/util";
import { mapActions, mapMutations, mapState } from "vuex";
import { routers } from "@/router/router";
export default {
  components: { shrinkableMenu, breadcrumbNav, TagsNav },
  data() {
    return {
      shrink: false,
      menuList: [],
      menuTheme: "light",
      current: [{ title: "首页" }],
      userInfo: {
        name: "管理员"
        // avatarPath: "../assets/picture.jpg"
      },
      isShow: true,
      pageTagsList: [],
      list: []
    };
  },
  created() {
    this.getMenuList();
    getUserMenu().then(res => {
      // console.log("菜单菜单", res);
      if (res.code == 200) {
        this.menuList = res.result;
        this.menuList.forEach((item, index) => {
          if (item.name == "home-main") {
            this.menuList.splice(index, 1);
          }
        });
        // console.log(12, this.menuList);
        let sortIdFn = function(obj1, obj2) {
          var val1 = obj1.id;
          var val2 = obj2.id;
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        };
        this.menuList.sort(sortIdFn);

        this.menuList.forEach((item, index) => {
          item.children.sort(sortIdFn);
        });
      }
    });
    this.getUserInfo();
  },
  mounted() {
    this.setTagNavList();
    // console.log(this.tagNavList);
    this.setHomeRoute(routers);
    this.setBreadCrumb(this.$route);
    // console.log("111111", routers);
    // 刷新时
    this.list = this.$route.matched;
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      });
    }
    // console.log(this.tagNavList);
  },
  methods: {
    ...mapActions("menu", ["getMenuList"]),
    ...mapMutations([
      "setBreadCrumb",
      "setTagNavList",
      "addTag",
      "closeTag",
      "setTagNavList",
      "setHomeRoute"
    ]),
    getUserInfo() {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    },
    /**
     * 控制左侧菜单栏状态
     */
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },

    handleSubmenuChange(val) {
      // console.log(val);
      // console.log(123)
    },
    beforePush(name) {
      // console.log(name);
      return true;
    },
    /**
     * 控制左侧菜单栏状态
     */
    toggleClick() {
      // console.log("控制");
      this.shrink = !this.shrink;
    },
    /**
     * 个人图标点击事件
     */
    handleClickUserDropdown(name) {
      if (name == "ownSpaceOld") {
        // console.log(this);
        this.$router.push("/usercenter");
      } else if (name == "loginout") {
        this.$Modal.confirm({
          title: "确认退出",
          content: "您确认要退出健康申报后台管理系统?",
          onOk: () => {
            sessionStorage.removeItem("userInfo");
            localStorage.removeItem("tagNaveList");
            // 清空打开的页面等数据
            // localStorage.clear();
            this.$router.push("/login");
          }
        });
      }
    },

    // tag标签

    handleClick(item) {
      this.turnToPage(item);
    },
    handleCloseTag(res, type, route) {
      if (type !== "others") {
        if (type === "all") {
          this.turnToPage(this.$config.homeName);
          // this.turnToPage( 'home');
        } else {
          // console.log(routeEqual(this.$route, route));
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }

      this.setTagNavList(res);
    },
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === "string") name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    }
  },
  watch: {
    $route(newRoute) {
      // console.log(newRoute);
      // 监听路由变化
      // this.list = [];
      // this.list.push(this.$route.matched);

      // 添加tag菜单标签--vuex
      const { name, query, params, meta } = newRoute;
      console.log(11111, newRoute);
      this.addTag({
        route: { name, query, params, meta },
        type: "push"
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    },
    breadCrumbList(val) {
      // console.log("val", val);
    }
  },
  computed: {
    // pageTagsList() {
    //   return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    // }
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList; // 当前面包屑数组
    }
  }
};
</script>
<style lang="scss" scoped>
.lock-screen-back {
  border-radius: 50%;
  z-index: -1;
  box-shadow: 0 0 0 0 #667aa6 inset;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 3s;
}

.main {
  position: absolute;
  width: 100%;
  height: 100%;
  .unlock-con {
    width: 0px;
    height: 0px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 11000;
  }
  .sidebar-menu-con {
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 21;
    transition: width 0.3s; // background: rgb(73, 80, 96)
    // background: #515a6e;
  }
  .layout-text {
    display: inline-block;
    white-space: nowrap;
    position: absolute;
  }
  .main-hide-text .layout-text {
    display: none;
  }
  &-content-container {
    position: relative;
  }
  &-header-con {
    box-sizing: border-box;
    position: fixed;
    display: block;
    padding-left: 200px;
    width: 100%;
    height: 100px;
    z-index: 20;
    box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    transition: padding 0.3s;
  }
  &-breadcrumb {
    padding: 8px 15px 0;
  }
  &-menu-left {
    background: #464c5b;
    height: 100%;
  }
  .tags-con {
    min-width: 710px;
    height: 40px;
    z-index: -1;
    overflow: hidden;
    background: #edf0f5;
    .tags-outer-scroll-con {
      position: relative;
      box-sizing: border-box;
      padding-right: 120px;
      width: 100%;
      height: 100%;
      .tags-inner-scroll-body {
        position: absolute;
        padding: 2px 10px;
        overflow: visible;
        white-space: nowrap;
        transition: left 0.3s ease;
      }
      .close-all-tag-con {
        position: absolute;
        right: 0px;
        top: 0;
        box-sizing: border-box;
        padding-top: 8px;
        text-align: center;
        width: 110px;
        height: 100%;
        background: white;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
        z-index: 10;
      }
    }
  }
  &-header {
    min-width: 710px;
    height: 60px;
    background: #fff;
    box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    position: relative;
    z-index: 11;
    .navicon-con {
      display: inline-block;
      height: 60px;
      display: flex;
      align-items: center;
    }
    .header-middle-con {
      overflow: hidden;
      color: #c5cae9;
      font-size: 10px;
      height: 60px;
      line-height: 60px;
    }
    .header-avator-con {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      min-width: 10%;
      display: flex;
      align-items: center;
    }
  }
  .single-page-con {
    min-width: 710px;
    padding: 10px 10px 30px;

    position: absolute;
    top: 100px;
    right: 0;
    bottom: 0;
    overflow: auto;
    background-color: #edf0f5;
    z-index: 1;
    transition: left 0.3s;
    .single-page {
      // padding: 10px;
      height: 100%;
      //  height: calc(100vh - 120px);
      overflow-y: hidden;
      overflow-x: hidden;
      background: #fff;
      // padding: 10px;
      border-radius: 4px;
    }
  }
  &-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
}

.taglist-moving-animation-move {
  transition: transform 0.3s;
}
.main-header-con {
  position: absolute;
  top: 0;
}
.logo-con {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0074e7;
  font-size: 14px;
  color: #fff;
  img {
    width: 55px;
    height: 29px;
  }
  .min-title {
    color: #fff;
    font-size: 20px;
  }
}

.menu-bar {
  overflow: auto;
  overflow-x: hidden;
}

.menu-bar::-webkit-scrollbar {
  // width: 6px;
  // height: 6px;
  display: none;
}

.menu-bar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c3c3c3;
}

.menu-bar::-webkit-scrollbar-track {
  background: #fff;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
.main-header {
  background-color: #288cf0;
  display: flex;
  align-items: center;
}

.search_item {
  width: 100%;
  height: 30px;
  background: rgba(247, 247, 247, 1);
  border-radius: 2px;
  display: flex;
  align-items: center;
  position: relative;
  .seat {
    position: absolute;
    background: white;
    width: 100%;
    left: 0;
    top: 31px;
    display: flex;
    flex-direction: column;
    .child {
      padding: 10px 0 10px 20px;
      cursor: pointer;
    }
    .name-ii {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .one {
    height: 100%;
    width: 180px;
    background-color: transparent;

    .ivu-input.ivu-input-default {
      background-color: transparent !important;
      border: none;
      outline: none;
      transition: none !important;
    }
  }

  .search_ico {
    flex: 1;
    background-color: transparent;
    height: 100%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.ivu-shrinkable-menu {
  overflow: auto;
  height: calc(100% - 60px);
}
</style>