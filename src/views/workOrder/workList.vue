<!-- 工单列表 --->
<template>
  <div class="work-list">
    <!-- 新建工单按钮 -->
    <div class="add-bt">
      <Button
        @click="handleAddwork"
        type="success"
        icon="md-add"
        v-if="menuBtns.indexOf('workorder:workOrder:add')>-1"
      >新建工单</Button>
    </div>
    <div class="card">
      <Tabs value="ALL" @on-click="selectTabs">
        <TabPane label="全部工单" name="ALL">
          <all ref="all"></all>
        </TabPane>
        <TabPane label="我的工单" name="SELF">
          <person ref="self"></person>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import person from "@/components/work-list/person";
import all from "@/components/work-list/all";
import { mapState } from "vuex";
export default {
  name: "work-list",
  components: { person, all },
  data() {
    return {
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        number: "",
        status: "",
        createTime: "",
        priority: ""
      },
      loading: false,
      tableHeight: 0,
      total: 0
    };
  },
  created() {},
  mounted() {
    // this.init();
  },
  destroyed() {},
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  methods: {
    selectTabs(name) {
      // console.log(name);
      if (name == "ALL") {
        this.$refs.all.getWorkList();
      } else if (name == "SELF") {
        this.$refs.self.getWorkList();
      }
    },
    /**
     * 新建工单列表
     */
    handleAddwork() {
      this.$router.push({ name: "addworkList", params: { code: "add" } });
    }
  }
};
</script>
<style lang="scss" scoped>
.work-list {
  height: 100%;
  position: relative;
  .add-bt {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 999;
  }
  .card {
    padding: 16px;
    height: 100%;
  }
}
</style>