<template>
  <!-- 部门人员弹框 -->
  <Modal
    title="人员部门选择器"
    v-model="depModalVisible"
    :closable="false"
    :mask-closable="false"
    :width="500"
    :styles="{top: '30px'}"
    class="depModal"
  >
    <!-- <Input search enter-button placeholder="搜索部门、人员(多个用','分割)" /> -->
    <div class="modalTree" :style="{'max-height':scrollHeight+'px',overflow:'auto'}">
      <Tree
        ref="depTree"
        :data="depData"
        :multiple="multiple"
        :show-checkbox="checkStatus"
        @on-toggle-expand="expandCheckDep"
        style="margin-top:15px;margin-left: 15px;"
      ></Tree>
    </div>
    <div slot="footer">
      <Button type="text" @click="submitDepCancel">取消</Button>
      <Button type="primary" @click.native="submitDepEdit">提交</Button>
    </div>
  </Modal>
  <!-- 部门人员弹框 -->
</template>

<script>
/* import {
  postTree,
  getCollaboratorTree,
  getReceiveTree,
  postArchitectTree,
  getDingTree
} from "@/api/index"; */
export default {
  props: ["depModalVisible", "typeName"],
  data() {
    return {
      deptUserName: "",
      depData: [],
      nameArr: [],
      scrollHeight: 0
    };
  },
  computed: {
    multiple() {
      return this.typeName && this.typeName == "single" ? false : true;
    },
    checkStatus() {
      return this.typeName && this.typeName == "single" ? false : true;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let that = this;
      that.pageHeight();
      window.onresize = function() {
        that.pageHeight();
      };
    },
    pageHeight() {
      this.scrollHeight = document.body.clientHeight - 190;
    },

    // 父级--点击执行人
    getCollaboratorParams() {
      getCollaboratorTree().then(res => {
        if (res.code == 200) {
          if (res.result && Array.isArray(res.result)) {
            this.depData = res.result;
          } else {
            this.depData = [];
          }
        }
      });
    },

    // 数据--接收人
    getDistribution(value) {
      // getReceiveTree(value).then(res => {
      //   if (res.code == 200) {
      //     if (res.result && Array.isArray(res.result)) {
      //       this.depData = res.result;
      //     } else {
      //       this.depData = [];
      //     }
      //   }
      // });
    },
    // 父级--选择接收人--分配
    getReceiveParams() {
      this.depData = [];
      this.getDistribution({ salesType: "Sales", statusType: "ENABLE" });
    },

    // 父级--选择接收人--转移
    getTransReceiveParams() {
      this.getDistribution({ salesType: "Telesales", statusType: "ENABLE" });
    },

    // 父级--账号页面-转移
    getAcTransferParams() {
      this.getDistribution({ salesType: "Sales", statusType: "ENABLE" });
    },

    // 父级--线索分配权限管理--电销成员
    getClueDistriParams() {
      this.getDistribution({ salesType: "Telesales", statusType: "ENABLE" });
    },
    // 父级--线索黑名单管理--销售成员
    getClueBlackParams() {
      this.getDistribution({ salesType: "Sales", statusType: "ENABLE" });
    },

    // 数据--架构师
    getTechList() {
      postArchitectTree({ statusType: "ENABLE" }).then(res => {
        if (res.code == 200) {
          if (res.result && Array.isArray(res.result)) {
            this.depData = res.result;
          } else {
            this.depData = [];
          }
        }
      });
    },

    // 父级--新增商机--技服
    getBussTechParams() {
      this.depData = [];
      this.getTechList();
    },

    // 父级--新增架构师(选择员工)
    getAcPeopleParams() {
      let dataArr = [];
      getDingTree().then(res => {
        if (res.code == 200) {
          dataArr.push(res.result);
          if (dataArr && dataArr.length > 0) {
            this.depData = dataArr;
          } else {
            this.depData = [];
          }
        }
      });
      // console.log(this.depData)
    },

    // 数据--协作人
    getColloarList() {
      if (this.depData.length < 1) {
        getCollaboratorTree().then(res => {
          if (res.result && Array.isArray(res.result)) {
            this.depData = res.result;
          } else {
            this.depData = [];
          }
        });
      }
    },

    // 父级--客户详情-协作人//客户关联待办任务执行人
    getCusBoParams() {
      this.getColloarList();
    },

    expandCheckDep() {
      this.$emit("expandCheckDep");
    },
    // 取消
    submitDepCancel() {
      this.$emit("submitDepCancel");
    },
    // 提交
    submitDepEdit() {
      if (this.typeName && this.typeName == "single") {
        let arrSingle = this.$refs.depTree.getSelectedNodes();

        this.$emit("submitDepEdit", arrSingle);
      }
    }
  }
};
</script>