<template>
  <div class="crumbs-box">
    <ul class="ul">
      <li
        v-for="(item,index) in arr"
        :key="index"
        :class="index == isActive ? 'is-active' : ''"
        @click="btnLi(item,index)"
      >
        <router-link :class="item.title == '首页'? 'li-width':''" :to="item.name">{{ item.title }}</router-link>
        <Icon
          v-if="item.title != '首页'"
          type="md-close"
          class="close"
          @click="closeBtn(item,index)"
        />
      </li>
    </ul>
    <Dropdown trigger="click" class="Tablist" @on-click="changeMenu">
      <Button type="primary">
        标签选项
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem :name="index" v-for="(item,index) in selectList" :key="index">{{ item }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import bus from "@/utils/bus";
import menuList from "@/utils/menu";
export default {
  data() {
    return {
      isActive: 0,
      active: "",
      arr: [{ name: "home", title: "首页" }],
      selectList: ["关闭全部", "关闭其他"],
      routeOld: "",
      obj: {}
    };
  },
  mounted() {
    bus.$off("on-active");
    bus.$on("on-active", item => {
      this.active = item;
      for (let i in this.arr) {
        if (item == this.arr[i].name) {
          this.isActive = i;
        }
      }
    });
  },
  watch: {
    active(newVal) {
      let arr = menuList.menuList;
      for (let i in arr) {
        let children = arr[i].children;
        for (let o in children) {
          if (newVal == children[o].name) {
            this.arr.push(children[o]);
          } else {
            for (let w in this.arr) {
              if (this.arr[w].name == newVal) {
                return;
              }
            }
          }
        }
      }
    },
    arr(newVal, oldVal) {
      sessionStorage.setItem("list", JSON.stringify(newVal));
      if (newVal.length == 1) {
        this.$router.push("/");
        this.isActive = 0;
      }
      this.isActive = newVal.length - 1;
    },
    $route(val, old) {
      this.routeOld = old;
    }
  },
  created() {
    let list = sessionStorage.getItem("list");
    let array = JSON.stringify([{ name: "home", title: "首页" }]);
    list == null ? (list = array) : (list = list);
    if (this.arr.length == 1) {
      this.arr = JSON.parse(list);
    }
    this.isActive = sessionStorage.getItem("activeIndex");
  },
  methods: {
    closeBtn(item, index) {
      this.arr.splice(index, 1);
      if (item.name == this.$route.name) {
        this.$router.push(this.routeOld.fullPath);
      }
    },
    btnLi(item, index) {
      this.obj = item;
      this.isActive = index;
      sessionStorage.setItem("activeIndex", index);
    },
    changeMenu(name) {
      if (name == 0) {
        this.arr = [{ name: "home", title: "首页" }];
        sessionStorage.removeItem("list");
      } else {
        this.arr = [{ name: "home", title: "首页" }, this.obj];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.is-active {
  box-shadow: 0px 0px 2px 2px #288cf0;
}
.li-width {
  padding: 0 30px;
}
.crumbs-box {
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .ul::-webkit-scrollbar {
    display: none;
  }
  .ul {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    overflow-x: scroll;
    width: 90%;
    li {
      margin-left: 10px;
      flex-shrink: 0;
      border: 1px solid #fff;
      background: #fff;
      list-style-type: none;
      border-radius: 4px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      a {
        text-align: center;
        display: block;
        margin-right: 10px;
      }
      .close {
        font-size: 18px;
      }
    }
    li:hover {
      box-shadow: 0px 0px 2px 2px #288cf0;
      cursor: pointer;
    }
  }
}
</style>