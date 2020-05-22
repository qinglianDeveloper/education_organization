<template>
  <div class="header">
    <Tabs value="全部账号" @on-click="tabBtn">
      <TabPane v-for="(item,index) in tabTxt" :key="index" :label="item" :name="item"></TabPane>
      <div slot="extra" class="button">
        <Button
          type="primary"
          icon="md-add"
          @click="addAccount"
          v-if="menuBtns.indexOf('customer:account:add')>-1"
        >添加账号</Button>
        <!-- <Button type="primary" icon="md-add" @click="addAccount">添加账号</Button> -->
        <!-- <Button icon="ios-redo">导入</Button>
        <Button icon="ios-redo">导入</Button>
        <Button type="warning">
          导出
          <Icon type="ios-undo" />
        </Button>-->
      </div>
    </Tabs>
    <addModel :modelAdd="modelAdd" @configOK="configOK" />
  </div>
</template>
<script>
import addModel from "./addModel";
import bus from "@/utils/bus";
import { mapState } from "vuex";
export default {
  components: { addModel },
  data() {
    return {
      tabTxt: ["全部账号", "我的账号"],
      modelAdd: false,
      editData: {}
    };
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  methods: {
    addAccount() {
      this.modelAdd = true;
      bus.$emit("txt", "新增");
    },
    configOK(e) {
      this.modelAdd = e;
    },
    tabBtn(e) {
      bus.$emit("e", e);
    }
  }
};
</script>
<style lang="scss" scoped>
.button {
  //
  button {
    margin-left: 20px;
  }
}
.header {
}
</style>