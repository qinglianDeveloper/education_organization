<!-- 菜单权限 -->
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button
          @click="addMenu"
          type="primary"
          icon="md-add"
          v-if="menuBtns.indexOf('sys:menu:add')>-1"
        >添加子节点</Button>
        <Button @click="addRootMenu" icon="md-add" v-if="menuBtns.indexOf('sys:menu:add')>-1">添加一级菜单</Button>
        <Button
          @click="delAll"
          icon="md-trash"
          :disabled="selectCount == 0"
          type="error"
          v-if="menuBtns.indexOf('sys:menu:delete')>-1"
        >批量删除</Button>
        <Dropdown @on-click="handleDropdown">
          <Button>
            更多操作
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新</DropdownItem>
            <DropdownItem name="expandOne">仅显示一级</DropdownItem>
            <DropdownItem name="expandTwo">仅展开两级</DropdownItem>
            <DropdownItem name="expandAll">展开所有</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Row>
      <Row
        type="flex"
        class="code-row-bg"
        :style="{'height':pageHeight+'px','margin-top':'20px','min-width':'1000px'}"
      >
        <!-- 左侧菜单树 -->
        <Col style="min-width:315px">
          <div class="treeHeader">
            <Menu mode="horizontal" :active-name="activeName" @on-select="handleMenu" class="mb10">
              <MenuItem name="1">
                <Icon type="md-desktop" />菜单权限设置
              </MenuItem>
            </Menu>
            <Alert show-icon>
              当前选择编辑：
              <span class="select-title">{{editTitle}}</span>
              <a class="select-clear" v-if="menuForm.menuId" @click="canelEdit">取消选择</a>
            </Alert>
            <Input
              v-model="searchKey"
              suffix="ios-search"
              @on-change="search"
              placeholder="输入菜单名搜索"
              clearable
            />
          </div>
          <div class="tree-bar" :style="{'max-height':treeHeight+'px'}">
            <Tree
              ref="tree"
              :data="data"
              show-checkbox
              @on-check-change="changeSelect"
              @on-select-change="selectTree"
            ></Tree>
          </div>
          <Spin size="large" fix v-if="loading"></Spin>
        </Col>
        <!-- 右侧编辑 -->
        <Col style="height:calc(100vh - 250px);overflow-y: auto;margin-left:30px">
          <Form ref="menuForm" :model="menuForm" :label-width="100">
            <FormItem label="类型：" prop="type">
              <RadioGroup v-model="menuForm.type">
                <Radio :label="0" :disabled="isCatalog">
                  <Icon type="ios-browsers" size="16" style="margin-bottom:3px;"></Icon>
                  <span>页面目录</span>
                </Radio>
                <Radio :label="1" :disabled="isButton">
                  <Icon type="ios-list-box-outline" size="16" style="margin-bottom:3px;"></Icon>
                  <span>页面菜单</span>
                </Radio>
                <Radio :label="2" :disabled="isMenu">
                  <Icon type="md-log-in" size="16" style="margin-bottom:3px;"></Icon>
                  <span>操作按钮</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="标题：" prop="title" v-if="menuForm.type===0 || menuForm.type===1">
              <Input v-model="menuForm.title" style="width:400px" />
            </FormItem>
            <FormItem label="标题：" prop="title" v-if="menuForm.type===2">
              <Poptip
                trigger="focus"
                placement="right"
                width="230"
                word-wrap
                title="提示"
                content="操作按钮名称不得重复"
                transfer
              >
                <Input v-model="menuForm.title" style="width:400px" />
              </Poptip>
            </FormItem>
            <FormItem label="名称：" prop="name">
              <Input v-model="menuForm.name" style="width:400px" />
            </FormItem>

            <!-- 图标 -->
            <FormItem label="图标：" v-if="menuForm.type!==2">
              <Input v-model="menuForm.icon" style="width:400px" />
            </FormItem>

            <FormItem label="授权标识：" prop="perms" v-if="menuForm.type != 0">
              <Poptip
                trigger="focus"
                placement="right"
                width="400"
                word-wrap
                title
                content="多个用逗号分隔"
                transfer
              >
                <Input v-model="menuForm.perms" style="width:400px" />
              </Poptip>
            </FormItem>
            <FormItem label="按钮权限类型" prop="buttonType" v-if="menuForm.type===2">
              <Select
                v-model="menuForm.buttonType"
                width="230"
                placeholder="请选择或输入搜索"
                filterable
                clearable
                style="width:400px"
              >
                <Option
                  v-for="(item, i) in dcitPermissions"
                  :key="i"
                  :value="item.value"
                >{{item.title}}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否启用：" prop="status">
              <i-switch
                size="large"
                v-model="menuForm.status"
                true-value="ENABLE"
                false-value="DISABLE"
              >
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
            <Form-item>
              <Button
                style="margin-right:5px"
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                icon="ios-create-outline"
                v-if="menuBtns.indexOf('sys:menu:update')>-1"
              >修改并保存</Button>
              <Button @click="handleReset" v-if="menuBtns.indexOf('sys:menu:update')>-1">重置</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <!-- 添加一级菜单弹框 -->
    <Modal
      :title="modalTitle"
      v-model="menuModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="menuFormAdd" :model="menuFormAdd" :label-width="85" :rules="menuFormValidate">
        <div v-if="showParent">
          <FormItem label="上级节点：">{{parentTitle}}</FormItem>
        </div>
        <FormItem label="类型" prop="type">
          <RadioGroup v-model="menuFormAdd.type">
            <Radio :label="0" :disabled="isCatalogAdd">
              <Icon type="ios-browsers" size="16" style="margin-bottom:3px;"></Icon>
              <span>页面目录</span>
            </Radio>
            <Radio :label="1" :disabled="isButtonAdd">
              <Icon type="ios-list-box-outline" size="16" style="margin-bottom:3px;"></Icon>
              <span>页面菜单</span>
            </Radio>
            <Radio :label="2" :disabled="isMenuAdd">
              <Icon type="md-log-in" size="16" style="margin-bottom:3px;"></Icon>
              <span>操作按钮</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="标题：" prop="title" v-if="menuFormAdd.type===0 ||　menuFormAdd.type===1">
          <Input v-model="menuFormAdd.title" />
        </FormItem>
        <FormItem label="标题：" prop="title" v-if="menuFormAdd.type===2">
          <Poptip trigger="focus" placement="right" word-wrap title="提示" content="操作按钮名称不得重复">
            <Input v-model="menuFormAdd.title" style="width:383px;" />
          </Poptip>
        </FormItem>
        <FormItem label="名称：" prop="name">
          <Input v-model="menuFormAdd.name" />
        </FormItem>

        <!-- 图标 -->
        <FormItem label="图标：" v-if="menuFormAdd.type===0 ||　menuFormAdd.type===1" prop="icon">
          <Input v-model="menuFormAdd.icon" style="width:383px" />
        </FormItem>

        <FormItem label="按钮类型：" prop="buttonType" v-if="menuFormAdd.type=== 2">
          <Select v-model="menuFormAdd.buttonType" placeholder="请选择或输入搜索" filterable clearable>
            <Option v-for="(item, i) in dcitPermissions" :key="i" :value="item.value">{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="授权标识：" prop="perms" v-if="menuFormAdd.type != 0">
          <Poptip trigger="focus" placement="right" word-wrap title content="多个用逗号分隔">
            <Input v-model="menuFormAdd.perms" style="width:383px;" placeholder="请输入授权标识" />
          </Poptip>
        </FormItem>
        <FormItem label="是否启用：" prop="status">
          <i-switch
            size="large"
            v-model="menuFormAdd.status"
            true-value="ENABLE"
            false-value="DISABLE"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelAdd">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getAllPermissionList,
  addPermission,
  searchPermission,
  deletePermission,
  editPermission
} from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  name: "menu-manage",
  data() {
    return {
      expandLevel: 1,
      id: null,
      loading: false, //是否加载等待
      selectCount: 0, //批量删除按钮是否可点击
      pageHeight: 0,
      activeName: 1,
      editTitle: "",
      menuForm: {
        type: 0,
        status: "ENABLE"
      },
      searchKey: "",
      treeHeight: 0, //左侧树形高度
      data: [], //左侧树形数据
      menuFormValidate: {},
      isCatalog: false, //目录按钮是否可以点击
      isMenu: true, //菜单按钮是否可以点击
      isButton: true, //操作按钮是否可以点击
      isCatalogAdd: false, //添加-目录按钮是否可以点击
      isMenuAdd: false, //添加-菜单按钮是否可以点击
      isButtonAdd: false, //添加-操作按钮是否可以点击
      submitLoading: false, //提交按钮是否等待状态
      modalTitle: "", //弹出框标题
      menuModalVisible: false, //弹出框是否显示
      menuFormAdd: {
        buttonType: ""
      },
      showParent: false,
      iconModalVisible: false,
      iconType: 0,
      dcitPermissions: [
        { value: "ADD", title: "新增" },
        { value: "UPDATE", title: "编辑" },
        { value: "DELETE", title: "删除" },
        { value: "SELECT", title: "查看" }
      ]
    };
  },
  created() {
    this.getAllList();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  methods: {
    /**
     * 页面初始化
     */
    init() {
      this.tableHeight();
    },

    /**
     * 页面高度
     */
    tableHeight() {
      let pageHeight =
        Number(document.getElementsByClassName("single-page")[0].clientHeight) -
        Number(document.getElementsByClassName("operation")[0].clientHeight) -
        55;
      this.pageHeight = pageHeight;
      let treeHeight =
        pageHeight -
        Number(document.getElementsByClassName("treeHeader")[0].clientHeight) -
        19;
      this.treeHeight = treeHeight;
    },

    /**
     * 获取页面数据
     */
    getAllList() {
      getAllPermissionList().then(res => {
        // console.log(res);
        if (res.code == 200) {
          let expandLevel = this.expandLevel;
          let menuList = res.result.adminPcList[0].children;

          menuList.forEach(e => {
            if (expandLevel === 2) {
              if (e.level === 2) {
                e.expand = false;
              }
              if (e.children && e.children.length > 0) {
                e.children.forEach(function(c) {
                  if (c.level === 3) {
                    c.expand = false;
                  }
                });
              }
            } else {
              if (e.children && e.children.length > 0) {
                e.children.forEach(function(c) {
                  if (expandLevel === 3) {
                    if (c.level === 3) {
                      c.expand = false;
                    }
                  }
                });
              }
            }
          });
          this.data = menuList;
          // this.treeChangeExpand(this.data, false);
        }
      });
    },

    treeChangeExpand(treeData, flag) {
      let _this = this;
      for (var i = 0; treeData && i < treeData.length; i++) {
        this.$set(treeData[i], "expand", flag); //重要！用set方法
        if (treeData[i].children) {
          treeData[i].children = _this.treeChangeExpand(
            treeData[i].children,
            flag
          );
        }
      }
      return treeData;
    },

    /**
     * 添加子节点按钮事件
     */
    addMenu() {
      this.$refs.menuFormAdd.resetFields();
      this.menuFormAdd.status = "ENABLE";
      if (this.menuForm.id == "" || this.menuForm.id == null) {
        this.$Message.warning("请先点击选择一个菜单权限节点");
        return;
      }
      this.parentTitle = this.menuForm.title;
      this.modalTitle = "添加菜单权限";
      this.showParent = true;
      let type = 0;
      if (this.menuForm.level === 2) {
        type = 1;
        this.isCatalogAdd = true;
        this.isMenuAdd = true;
        this.isButtonAdd = false;
      } else if (this.menuForm.level === 3) {
        type = 2;
        this.isCatalogAdd = true;
        this.isMenuAdd = false;
        this.isButtonAdd = true;
      } else if (this.menuForm.level === 4) {
        this.$Modal.error({
          title: "抱歉，不能添加啦",
          content: "仅支持2级菜单目录"
        });
        return;
      } else {
        type = 2;
        this.isCatalogAdd = false;
        this.isMenuAdd = false;
        this.isButtonAdd = false;
      }
      this.menuFormAdd = {
        type: type,
        icon: "",
        parentId: this.menuForm.id,
        level: Number(this.menuForm.level) + 1,
        status: "ENABLE",
        menuPosition: "1"
      };
      this.menuModalVisible = true;
    },

    /**
     * 添加一级菜单按钮事件
     */
    addRootMenu() {
      this.modalTitle = "添加一级菜单";
      this.isCatalogAdd = false;
      this.isMenuAdd = true;
      this.isButtonAdd = true;
      this.showParent = false;
      this.menuFormAdd = {
        icon: "",
        type: 0,
        menuPosition: "1",
        parentId: 6,
        status: "ENABLE"
      };
      this.menuModalVisible = true;
    },

    /**
     * 批量删除按钮事件
     */
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未勾选要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // console.log(ids);
          deletePermission(ids).then(res => {
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.selectList = [];
              this.selectCount = 0;
              this.canelEdit();
              this.getAllList();
            }
          });
        }
      });
    },

    /**
     * 更多操作按钮事件
     */
    handleDropdown(name) {
      if (name === "expandOne") {
        this.expandLevel = 2;
        this.getAllList();
      } else if (name === "expandTwo") {
        this.expandLevel = 3;
        this.getAllList();
      } else if (name === "expandAll") {
        this.expandLevel = 4;
        this.getAllList();
      } else if (name === "refresh") {
        this.getAllList();
      }
    },

    /**
     * 左侧Tab标签切换
     */
    handleMenu(val) {
      this.activeName = val;
      this.getAllList();
    },

    /**
     * 左侧搜索框按钮事件
     */
    search() {
      if (this.searchKey) {
        this.loading = true;
        let data = {};
        data.title = this.searchKey;
        data.menuPosition = "1";
        searchPermission(data).then(res => {
          this.loading = false;
          if (res.success) {
            this.data = res.result;
          }
        });
      } else {
        this.getAllList();
      }
    },

    /**
     * 左侧树形点击事件
     */
    changeSelect(v) {
      // console.log("选中", v);
      // 选中进行批量删除
      this.selectCount = v.length;
      this.selectList = v;
    },

    /**
     * 左侧树形选择事件
     */
    selectTree(v) {
      // console.log("点击", v);
      if (v.length > 0) {
        if (Number(v[0].level) === 2) {
          //点击目录
          this.isCatalog = false;
          this.isButton = true;
          this.isMenu = true;
        } else if (Number(v[0].level) === 3) {
          // 页面菜单选中
          this.isCatalog = true;
          this.isButton = false;
          this.isMenu = true;
        } else {
          // 操作按钮
          this.isCatalog = true;
          this.isButton = true;
          this.isMenu = false;
        }
        for (let attr in v[0]) {
          if (v[0][attr] === null) {
            v[0][attr] = "";
          }
        }
        // 进行深拷贝
        let str = JSON.stringify(v[0]);
        let menu = JSON.parse(str);
        this.menuForm = menu;
        this.editTitle = menu.title;
      } else {
        this.canelEdit();
      }
    },

    /**
     * 取消选中
     */
    canelEdit() {
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      this.$refs.menuForm.resetFields();
      this.menuForm.id = ""; //清空id不让添加子菜单再次打开
      this.menuFormAdd = { status: "ENABLE" };
      this.editTitle = "";
    },

    /**
     * 修改并保存按钮
     */
    submitEdit() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          if (!this.menuForm.id) {
            this.$Message.warning("请先点击选择要修改的菜单节点");
            return;
          }
          this.submitLoading = true;
          if (this.menuForm.sortOrder === null) {
            this.menuForm.sortOrder = "";
          }
          if (this.menuForm.buttonType === null) {
            this.menuForm.buttonType = "";
          }
          if (this.menuForm.perms == null) {
            delete this.menuForm.perms;
          }
          if (this.menuForm.type == 2) {
            this.menuForm.icon = "";
            this.menuForm.component = "";
          }
          if (this.menuForm.children || this.menuForm.children == "") {
            delete this.menuForm.children;
          }
          // console.log(this.menuForm);
          editPermission(this.menuForm).then(res => {
            this.submitLoading = false;
            if (res.success === true) {
              this.$Message.success("编辑成功");
              this.init();
              this.menuModalVisible = false;
              this.getAllList();
            }
          });
        }
      });
    },

    /**
     * 重置按钮事件
     */
    handleReset() {
      // console.log("重置");
      let type = this.menuForm.type;
      // 重置一定要有prop
      this.$refs["menuForm"].resetFields();
      this.editStatus = true;
      this.menuForm.type = type;
    },

    /**
     * 弹框取消按钮事件
     */
    cancelAdd() {
      this.menuModalVisible = false;
    },

    /**
     * 弹框添加按钮事件
     */
    submitAdd() {
      this.$refs.menuFormAdd.validate(valid => {
        if (valid) {
          // console.log(this.menuFormAdd);
          addPermission(this.menuFormAdd).then(res => {
            this.submitLoading = false;
            if (res.success === true) {
              this.$Message.success("添加成功");
              this.getAllList();
              this.menuModalVisible = false;
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  // min-width: 1200px;
  .operation {
    margin-bottom: 2vh;
    button {
      margin-right: 6px;
      font-size: 14px;
    }
  }
  .select-count {
    font-size: 13px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-title {
    font-size: 12px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
  }
  .page {
    margin-top: 2vh;
  }
  .drop-down {
    font-size: 13px;
    margin-left: 5px;
  }
}

.ivu-poptip {
  display: inline-block;
  width: 100%;
}

.ivu-poptip-rel {
  display: inline-block;
  position: relative;
  width: 100%;
}

.tree-bar {
  overflow: auto;
  margin-top: 5px;
}

.tree-bar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.tree-bar::-webkit-scrollbar-thumb {
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 2px #d1d1d1;
  background: #e4e4e4;
}
</style>