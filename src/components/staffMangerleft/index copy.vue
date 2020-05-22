<template>
  <!-- 左侧 -->
  <div class="left-box">
    <Col class="left">
      <div class="left-group" v-show="showNav" :style="{width:hideStyle.hideWidth}">
        <div class="group-header">
          <p style="color:#2d8cf0">是否展开所有团队</p>
          <i-switch size="large" v-model="switch1" @on-change="switchChange">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </div>
        <Divider style="margin:10px 0" />

        <Tree :data="datas" :render="renderContent"></Tree>
      </div>
      <div class="arrow" @click="hideNav">
        <Icon type="ios-arrow-back" class="arrow-right" style="cursor: pointer;" v-show="showNav" />
        <Icon
          type="ios-arrow-forward"
          class="arrow-left"
          style="cursor: pointer;"
          v-show="!showNav"
        />
      </div>
    </Col>
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
      showNav: true,
      datas: [],
      hideStyle: {
        hideWidth: "16vw"
      },
      treeExpand: true
    };
  },
  created() {
    this.dataShow();
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
      // console.log(id);
      let active = sessionStorage.getItem("active");
      // console.log(active);
      this.$Modal.confirm({
        title: "确认删除团队",
        content: "您确认要删除该团队吗？",
        onOk: () => {
          if (active == "market") {
            deleteMarketGroup({ id }).then(res => {
              // console.log(res);
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.$emit("Team");
                this.dataShow();
              }
            });
          } else if (active == "engineer") {
            deleteEngineGroup({ id }).then(res => {
              // console.log(res);
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.dataShow();
              }
            });
          } else if (active == "service") {
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
      //保存tab栏的name，存在session里面刷新不重置
      this.active = sessionStorage.getItem("active");
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
      // salesTeam().then(res => {
      //   if (res.code == 200) {
      //     this.datas = res.result;
      //     this.openTree(this.datas);
      //   }
      // });
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
      // this.datas.forEach(item => {
      //   item.expand = false;
      //   if (item.children && item.children.length > 0) {
      //     this.openTree(item.children);
      //   }
      // });
    },
    // 左侧隐藏显示
    hideNav() {
      this.showNav = !this.showNav;
      this.$emit("showLeft", this.showNav);
    },
    renderContent(h, { root, node, data }) {
      let btnPerm = this.menuBtns;
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            border: "1px solid #e8e8e8",
            padding: "5px 5px",
            width: "100%"
          }
        },
        [
          btnPerm && btnPerm.includes("sys:dept:add"),
          h("span", [
            h(
              "span",
              {
                style: {
                  display: "inline-block",
                  margin: "0",
                  // padding: "0 4px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  verticalAlign: "top"
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
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
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
  margin-right: 30px;
  height: 85vh;
  .left {
    height: 85vh;
    display: flex;
    border: 1px solid #e8eaec;
    padding: 16px;
    .left-group {
      height: 82vh;
      overflow: auto;
      .group-header {
        display: flex;
        justify-content: space-between;
      }
    }
    .arrow {
      height: 82vh;
      line-height: 82vh;
    }
  }
}
</style>