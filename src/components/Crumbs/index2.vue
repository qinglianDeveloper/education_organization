<template>
  <div class="crumbs-box">
    <ul class="ul">
      <li
        v-for="(item,index) in list"
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
      arr: [],
      list: [{ name: "home", title: "首页" }],
      selectList: ["关闭全部", "关闭其他"],
      routeOld: "",
      obj: {}
    };
  },
  created() {
    let list = JSON.parse(sessionStorage.getItem("list"));
    if (list.length == 0) {
      this.list = this.list;
    } else {
      this.list = list;
    }
  },
  mounted() {
    bus.$off("on-active");
    bus.$on("on-active", item => {
      this.active = item;
    });
  },
  watch: {
    active(val) {
      this.quetyList(val);
      this.unique(this.arr);
    },
    list(val) {
      sessionStorage.setItem("list", JSON.stringify(val));
    },
    $route(val, old) {
      this.routeOld = old;
    }
  },
  methods: {
    unique(arr) {
      if (!Array.isArray(arr)) {
        console.log("type error!");
        return;
      }
      for (var i = 0; i < arr.length; i++) {
        if (this.list.indexOf(arr[i]) === -1) {
          this.list.push(arr[i]);
        }
      }
    },
    quetyList(val) {
      let arr = menuList.menuList;
      let newArr = [];
      for (let i in arr) {
        let children = arr[i].children;
        for (let j in children) {
          if (val == children[j].name) {
            this.arr.push(children[j]);
          }
        }
      }
    },
    btnLi(item, index) {
      this.obj = item;
      this.isActive = index;
      sessionStorage.setItem("activeIndex", index);
    },
    closeBtn(item, index) {
      this.list.splice(index, 1);
      if (item.name == this.$route.name) {
        this.$router.push(this.routeOld.fullPath);
      }
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
    overflow: auto;
    width: 94%;
    li {
      margin-left: 20px;
      flex-shrink: 0;
      border: 1px solid #fff;
      background: #fff;
      list-style-type: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      a {
        text-align: center;
        display: block;
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