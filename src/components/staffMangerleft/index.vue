<template>
  <!-- 左侧 -->
  <div class="left-box">
    <div class="left-group">
      <div class="group-header">
        <span style="color:#2d8cf0">是否展开所有团队</span>
        <i-switch size="large" v-model="switch1" @on-change="switchChange">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </div>
      <Divider style="margin:10px 0" />
      <Tree :data="datas" :render="renderContent"></Tree>
    </div>
    <!-- 添加组弹框 -->
    <add
      @Team="Team"
      :show="show"
      :childrenData="childrenData"
      :type="type"
      @handelSubmitGroup="handelSubmitGroup"
      @salesAdd="salesAdd"
    />
  </div>
</template>
<script>
import add from "./add";
import {
  salesTeam,
  customerService,
  listGroups,
  deleteMarketGroup,
  deleteEngineGroup,
  deleteServertGroup
} from "@/api";
import bus from "@/utils/bus";
import { mapState } from "vuex";
export default {
  props: ["list"],
  components: { add },
  data() {
    return {
      // modalVisible: false,
      btnDelete: true,
      groupIds: [],
      type: "",
      childrenData: {},
      switch1: true,
      show: false,
      datas: [],
      treeExpand: true,
      active: ""
    };
  },
  created() {
    this.active = this.$route.name;
    this.dataShow();
    console.log(this.active);
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  watch: {
    list(val) {
      this.datas = val;
    }
  },
  methods: {
    Team() {
      // console.log("dddd");
      this.$emit("Team");
    },
    handleDelete(id) {
      this.$Modal.confirm({
        title: "确认删除团队",
        content: "您确认要删除该团队吗？",
        onOk: () => {
          if (this.active == "market") {
            deleteMarketGroup({ id }).then(res => {
              // console.log(res);
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.$emit("Team");
                this.dataShow();
              }
            });
          } else if (this.active == "engineer") {
            deleteEngineGroup({ id }).then(res => {
              // console.log(res);
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.dataShow();
              }
            });
          } else if (this.active == "service") {
            deleteServertGroup({ id }).then(res => {
              // console.log(res);
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.dataShow();
              }
            });
          }
        }
      });
    },
    dataShow() {
      switch (this.active) {
        case "market":
          this._salesTeam();
          break;
        case "service":
          this._customerService();
          break;
        case "engineer":
          // console.log(1111);
          this._listGroups();
          break;
        default:
          break;
      }
    },
    //销售 显示
    _salesTeam() {
      this.openTree(this.datas);
    },
    // 客服管理
    _customerService() {
      customerService().then(res => {
        if (res.code == 200) {
          this.datas = res.result;
          this.openTree(this.datas);
        }
      });
    },
    // 工程师
    _listGroups() {
      listGroups().then(res => {
        // console.log("工程师树", res);
        if (res.code == 200) {
          this.datas = res.result;
          this.openTree(this.datas);
        }
      });
    },
    /**
     * 团队树全部展开
     */
    openTree(arr) {
      arr.forEach(item => {
        item.expand = this.treeExpand;
        if (item.children && item.children.length > 0) {
          this.openTree(item.children);
        }
      });
    },
    //显示禁用销售团队
    switchChange() {
      this.treeExpand = !this.treeExpand;
      this.dataShow();
    },
    renderContent(h, { root, node, data }) {
      let btnPerm = this.menuBtns;
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
            border: "1px solid #eee",
            boxSizing: "border-box",
            padding: "5px"
          }
        },
        [
          btnPerm && btnPerm.includes("sys:dept:add"),
          h(
            "span",
            {
              style: {
                float: "left",
                marginRight: "20px"
              }
            },
            [
              h(
                "span",
                {
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: even => {
                      bus.$emit("datas", data);
                      // console.log(data);
                      // 移除所有的背景颜色、用白色替换className
                      let ulDom = document.getElementsByClassName(
                        "ivu-tree-children"
                      );
                      console.log(ulDom);
                      for (let i in ulDom) {
                        if (ulDom[i].children) {
                          if (ulDom[i].children[0].firstChild.nextSibling) {
                            if (
                              ulDom[i].children[0].firstChild.nextSibling
                                .nextElementSibling
                            ) {
                              if (
                                ulDom[i].children[0].firstChild.nextSibling
                                  .nextElementSibling.children.length != 0
                              ) {
                                ulDom[
                                  i
                                ].children[0].firstChild.nextSibling.nextElementSibling.children[0].lastElementChild.style.backgroundColor =
                                  "#fff";
                              }
                            }
                          }
                        }
                      }
                      let treeUl =
                        even.target.parentNode.parentNode.parentNode.parentNode
                          .parentNode.childNodes;
                      treeUl.forEach(item => {
                        if (item.tagName == "UL") {
                          item.childNodes[0].lastElementChild.childNodes[0].lastElementChild.style.backgroundColor =
                            "#fff";
                        }
                      });
                      // 当前点击选中树添加颜色
                      even.target.style.backgroundColor = "#d5e8fc";
                    }
                  }
                },
                data.disabled == false ? data.title : `${data.title}`
              )
            ]
          ),
          h(
            "span",
            {
              style: {
                float: "right",
                display: "flex",
                flexWrap: "nowrap",
                cursor: "pointer"
              }
            },
            [
              (btnPerm && btnPerm.includes("smc:salesTeam:add")) ||
              btnPerm.includes("workorder:engineerGroup:add") ||
              btnPerm.includes("customerService:group:modify")
                ? h("Icon", {
                    props: Object.assign({}, this.buttonProps, {
                      type: "md-add",
                      size: "16"
                    }),
                    style: {
                      marginRight: "8px"
                    },
                    on: {
                      click: () => {
                        this.type = "新增";
                        this.childrenData = data;
                        this.show = true;
                      }
                    }
                  })
                : "",
              (btnPerm && btnPerm.includes("smc:salesTeam:delete")) ||
              btnPerm.includes("workorder:engineerGroup:delete") ||
              btnPerm.includes("customerService:group:delete")
                ? h("Icon", {
                    props: Object.assign({}, this.buttonProps, {
                      type: "md-remove",
                      size: "16"
                    }),
                    style: {
                      marginRight: "8px"
                    },
                    on: {
                      click: () => {
                        this.handleDelete(data.id);
                      }
                    }
                  })
                : "",
              (btnPerm && btnPerm.includes("smc:salesTeam:update")) ||
              btnPerm.includes("workorder:engineerGroup:update") ||
              btnPerm.includes("customerService:group:modify")
                ? h("Icon", {
                    props: Object.assign({}, this.buttonProps, {
                      type: "md-create",
                      size: "16"
                    }),
                    style: {
                      marginRight: "8px"
                    },
                    on: {
                      click: () => {
                        this.type = "编辑";
                        this.childrenData = data;
                        console.log(data);
                        this.show = true;
                      }
                    }
                  })
                : ""
            ]
          )
        ]
      );
    },
    // 取消按钮
    handelSubmitGroup(e) {
      this.show = e;
    },
    //提交按钮
    salesAdd(e) {
      this.show = e;
      // 先清空，在赋值
      this.datas = [];
      this.dataShow();
    }
  }
};
</script>
<style lang="scss" scoped>
.left-box {
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding: 6px;
  min-width: 260px;
  overflow-x: auto;
  .left-group {
    height: 83vh;
    overflow: auto;
    .group-header {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>