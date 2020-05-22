<!-- 分组设置 --->
<template>
  <div class="work-group">
    <Row type="flex" justify="space-around">
      <!-- 左侧 -->
      <Col :span="showNav?'5':'1'" class="left">
        <Card dis-hover :style="{height:`${cardHeight}px`}">
          <div class="left-group" v-show="showNav">
            <div class="group-header">
              <p>组列表</p>
              <Button type="primary" size="small" @click="handleAddgroup">添加</Button>
            </div>
            <Divider style="margin:10px 0" />
            <Tree
              ref="tree"
              :data="leftTreeData"
              @on-select-change="selectTree"
              :render="renderContent"
            ></Tree>
          </div>
          <!-- 左侧栏箭头 -->
          <span style="float:right;cursor: pointer;" @click="hideNav">
            <Icon type="ios-arrow-back" class="arrow-right" v-show="showNav" />
            <Icon type="ios-arrow-forward" class="arrow-left" v-show="!showNav" />
          </span>
        </Card>
      </Col>
      <!-- 右侧 -->
      <Col :span="showNav?'18':'22'" class="right">
        <Card dis-hover :style="{height:`${cardHeight}px`}">
          <div class="right-person">
            <div class="group-header">
              <p>组成员列表</p>
              <Button type="primary" size="small" @click="handleAddperson">添加组员</Button>
            </div>
            <Divider style="margin:10px 0" />
            <!-- 表格内容 -->
            <Table
              border
              ref="table"
              :columns="columns"
              :data="tableData"
              :loading="loading"
              :height="tableHeight"
            >
              <template slot="action" slot-scope="{ row, index }">
                <Button type="error" size="small" @click="handleDel(row,index)">删除</Button>
              </template>
            </Table>
          </div>
        </Card>
      </Col>
    </Row>
    <!-- 添加组弹框 -->
    <Modal v-model="addGroup" :width="600" :styles="{top: '200px'}" title="添加技能组">
      <Form ref="groupForm" :model="groupForm" :label-width="120" :rules="groupFormRules">
        <FormItem label="技能组名称：" prop="list">
          <Input placeholder="请输入技能组名称" v-model="groupForm.list" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addGroup=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitGroup">提交</Button>
      </div>
    </Modal>
    <!-- 添加成员弹框 -->
    <Modal v-model="addPerson" :width="600" :styles="{top: '200px'}" title="taskModalTitle"></Modal>
  </div>
</template>
<script>
export default {
  name: "work-group",
  data() {
    return {
      showNav: true,
      cardHeight: 0,
      leftTreeData: [
        { label: "1", title: "技服团队1" },
        { label: "2", title: "技服团队2" }
      ],
      addGroup: false,
      addPerson: false,
      groupForm: {},
      groupFormRules: {
        list: [
          { required: true, message: "技能组名称不能为空", trigger: "blur" }
        ]
      },
      columns: [
        { title: "名称", key: "name", minWidth: 100, align: "center" },
        { title: "账号状态", key: "status", minWidth: 100, align: "center" },
        {
          title: "最近登录时间",
          key: "logintime",
          minWidth: 100,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 100
        }
      ],
      tableData: [
        {
          name: "客服1号",
          status: "正常",
          logintime: "2019-12-12 12:00:00"
        }
      ],
      loading: false,
      tableHeight: 0,
      submitLoading: false
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    init() {
      this.getCardheight();
    },
    /**
     * 左侧隐藏显示
     */
    hideNav() {
      this.showNav = !this.showNav;
    },
    /**
     * 计算两侧卡高度
     */
    getCardheight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      this.cardHeight = pageHeight - 32;
      console.log(this.cardHeight);
    },
    /**
     * 树形结构选择
     */
    selectTree(v) {
      console.log(v);
    },
    renderContent(h, { root, node, data }) {
      // console.log(data);
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            border: "1px solid #e8e8e8",
            padding: "5px 5px",
            width: "90%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-folder-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h(
              "span",
              {
                style: {
                  display: "inline-block",
                  margin: "0",
                  padding: "0 4px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  verticalAlign: "top",
                  transition: "all .2s ease-in-out"
                },
                on: {
                  click: even => {
                    console.log(data);
                    // 移除所有的背景颜色、用白色替换className
                    let ulDom = document.getElementsByClassName(
                      "ivu-tree-children"
                    );
                    // for (let i in ulDom) {
                    //   if (ulDom[i].children) {
                    //     if (ulDom[i].children[0].firstChild.nextSibling) {
                    //       if (
                    //         ulDom[i].children[0].firstChild.nextSibling
                    //           .nextElementSibling
                    //       ) {
                    //         if (
                    //           ulDom[i].children[0].firstChild.nextSibling
                    //             .nextElementSibling.children.length != 0
                    //         ) {
                    //           ulDom[
                    //             i
                    //           ].children[0].firstChild.nextSibling.nextElementSibling.children[0].lastElementChild.style.backgroundColor =
                    //             "#fff";
                    //         }
                    //       }
                    //     }
                    //   }
                    // }
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
                    // this.searchForm.groupId = data.id;
                    // this.searchForm.pageNumber = 1;
                    // this.getSalesListData();
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
              h("Icon", {
                props: Object.assign({}, this.buttonProps, {
                  type: "md-create",
                  size: "16"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.modalUser = false;
                    this.editTeam(root, node, data);
                  }
                }
              }),
              h("Icon", {
                props: Object.assign({}, this.buttonProps, {
                  type: "ios-trash",
                  size: "16"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.remove(data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    /**
     * 添加组按钮
     */
    handleAddgroup() {
      this.addGroup = true;
    },
    /**
     * 添加组弹框确定按钮
     */
    handelSubmitGroup() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          this.addGroup = false;
          // console.log(this.groupForm);
          this.data.unshift(this.groupForm);
        }
      });
      this.groupForm = {};
    },
    /**
     * 左侧编辑
     */
    editTeam() {
      console.log("编辑");
    },
    /**
     * 左侧移除
     */
    remove() {
      console.log("删除");
    },
    /**
     * 添加组成员
     */
    handleAddperson() {},
    handleDel() {}
  }
};
</script>
<style lang="scss" scoped>
.work-group {
  padding: 16px;
  .left {
    .group-header {
      display: flex;
      justify-content: space-between;
    }
    .arrow-right {
      float: right;
      line-height: 80vh;
      width: 15px;
      position: absolute;
      top: 0px;
      right: 2px;
      bottom: 0px;
    }
    .arrow-left {
      position: absolute;
      line-height: 80vh;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 0;
      padding: 10px 0;
      text-align: center;
    }
  }
  .right {
    .group-header {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>