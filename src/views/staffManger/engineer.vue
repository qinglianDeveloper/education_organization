<!-- 工程师管理 --->
<template>
  <div class="engineer">
    <div style="display:flex">
      <!-- 左侧组件 -->
      <leftComponents style="margin-right:20px" />
      <!-- 右侧 -->
      <Card dis-hover style="width:calc(100% - 280px)">
        <div class="group-header">
          <p style="color:#2d8cf0">工程师组列表</p>
          <Button
            type="primary"
            size="small"
            v-if="menuBtns.indexOf('workorder:engineer:add')>-1"
            @click="handleAddperson"
          >添加组员</Button>
        </div>
        <!-- 表格内容 -->
        <TableFrom :searchForm="searchForm" @engineerEdit="engineerEdit"></TableFrom>
        <!-- 分页部分 -->
        <pages :fromData="searchForm" :total="searchForm.total" />
      </Card>
    </div>
    <!-- 添加成员弹框 -->
    <!-- <add
      :salesModalVisible="salesModalVisible"
      :edit="edit"
      :txt="txt"
      :teamInfo="teamInfo"
      @hideshow="hideshow"
    />-->
    <add :addStatus="addStatus" @handleCancle="addCancle" :teamInfo="teamInfo"></add>
    <edit :editStatus="editStatus" @handleCancle="editCancle" :userId="userId"></edit>
  </div>
</template>
<script>
import leftComponents from "@/components/staffMangerleft/index";
import pages from "@/components/pageview";
import TableFrom from "@/components/table";
import add from "./dialog/addEngineer";
import edit from "./dialog/editEngineer";
import bus from "@/utils/bus";
import { mapState } from "vuex";
export default {
  name: "engineer",
  components: { leftComponents, pages, TableFrom, add, edit },
  data() {
    return {
      txt: "",
      cardHeight: 0,
      salesModalVisible: false, //添加组员弹框
      disabled: false, //弹框是否可以编辑
      salesModalTitle: "",
      salesForm: {
        status: false,
        level: "",
        isLeader: "",
        remark: ""
      },
      salesFormValidate: {
        // 表单验证规则
        team: [{ required: true, message: "请选择销售团队", trigger: "blur" }],
        user: [{ required: true, message: "请选择销售人员", trigger: "blur" }]
      },
      modelTeam: "",
      teamList: [],
      modalType: 0, // 添加或编辑标识
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      edit: "",
      teamInfo: {},
      addStatus: false,
      editStatus: false,
      userId: ""
    };
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  mounted() {
    bus.$off("total");
    bus.$on("total", item => {
      this.searchForm.total = item;
    });
    bus.$off("rowObj");
    bus.$on("rowObj", item => {
      this.txt = "编辑";
      this.edit = item;
      this.salesModalVisible = true;
    });
    bus.$on("datas", item => {
      // console.log("新增", item);
      this.teamInfo = item;
    });
  },
  methods: {
    // 添加组员弹框-取消按钮
    addCancle() {
      this.addStatus = false;
    },
    editCancle() {
      this.editStatus = false;
    },
    // 编辑组员弹框状态
    engineerEdit(id) {
      this.userId = id;
      console.log(this.userId);
      this.editStatus = true;
    },
    /**
     * 添加组成员
     */
    handleAddperson() {
      if (this.teamInfo.id) {
        this.addStatus = true;
      } else {
        this.$Message.warning("请先点击选择一个团队");
      }
    },
    /**
     * 弹框确定按钮
     */
    handelSubmitSales() {
      if (this.disabled) {
        this.salesModalVisible = false;
      } else {
      }
    },
    hideshow(e) {
      this.salesModalVisible = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.table-list {
  height: 74vh;
  overflow: auto;
}
.engineer {
  padding: 16px;
  .group-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .footer {
    margin-top: 2vh;
  }
}
</style>