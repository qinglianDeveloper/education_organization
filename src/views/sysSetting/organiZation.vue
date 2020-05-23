<!-- 组织架构-test -->
<template>
  <div style="padding:16px;">
    <!-- {{menuBtns}} -->
    <div style="display:flex">
      <!-- 左侧导航-test -->
      <div>
        <Card class="card-height">
          <div v-show="showNav" style="min-width:300px">
            <Input
              slot="title"
              search
              v-model="searchVal"
              placeholder="请输入员工或部门名称"
              @on-search="searchData"
              @on-change="searchData"
            />
            <Tabs :animated="false" @on-click="tabChange">
              <TabPane label="组织架构">
                <Scroll v-if="!searchVal" :height="treeHeight">
                  <Tree :data="departmentTree" :render="renderContent"></Tree>
                </Scroll>
                <!-- @on-select-change="onSelectDep" -->
                <!-- 搜索展示 -->
                <div v-else>
                  <Card title="部门" :padding="0" shadow v-show="deptList.length">
                    <CellGroup>
                      <Cell
                        v-for="(item,z) in deptList"
                        :title="item.name"
                        :key="z"
                        @click.native="onSearchDep(item)"
                      />
                    </CellGroup>
                  </Card>
                  <Card title="人员" :padding="0" shadow v-show="userList.length">
                    <CellGroup>
                      <Cell
                        v-for="(item,z) in userList"
                        :title="item.name"
                        :key="z"
                        @click.native="edit(item)"
                      />
                    </CellGroup>
                  </Card>
                  <Card
                    title="暂无此数据"
                    :padding="0"
                    shadow
                    v-show="!userList.length && !deptList.length"
                  ></Card>
                </div>
              </TabPane>
              <!-- 角色Tab -->
              <TabPane :label="role">
                <Menu active-name="1" width="auto" v-if="!searchVal">
                  <MenuItem
                    :name="index"
                    v-for="(item,index) in selectAllRole"
                    :key="index"
                    @click.native="selectRole(item)"
                  >{{item.roleName}}</MenuItem>
                </Menu>
                <!-- 搜索展示 -->
                <div v-else>
                  <CellGroup v-show="roleList.length">
                    <Cell
                      v-for="(item,z) in roleList"
                      :title="item.roleName"
                      :key="z"
                      @click.native="selectRole(item)"
                    />
                  </CellGroup>
                  <Card title="暂无此数据" :padding="0" shadow v-show="!roleList.length"></Card>
                </div>
              </TabPane>
            </Tabs>

            <Divider style="margin:14px 0;" />
          </div>
        </Card>
      </div>
      <!-- 右侧 -->
      <div style="flex:1">
        <Card style="width:99%;margin-left:2%;" class="card-height" ref="cardHeight">
          <!-- 新增按钮 -->
          <div class="addbutton">
            <Button
              size="small"
              icon="md-add"
              type="primary"
              @click="addStaff"
              v-show="showAdd"
              v-if="menuBtns.indexOf('sys:userDept:add')>-1"
            >新增员工</Button>
          </div>
          <!-- 列表 -->
          <div v-if="!isEdit">
            <p slot="title">{{tableTitle}}</p>
            <Divider style="margin:14px 0;" />
            <Table
              border
              :columns="colTableList"
              :data="listTable"
              :loading="loadTable"
              :height="tableHeight"
            >
              <template slot-scope="{ row }" slot="action">
                <Button
                  type="primary"
                  size="small"
                  @click="edit(row)"
                  style="margin-right:6px"
                  v-if="menuBtns.indexOf('sys:user:update')>-1"
                >编辑</Button>
                <Button
                  type="error"
                  size="small"
                  @click="handleDele(row)"
                  v-if="menuBtns.indexOf('sys:userDept:delete')>-1"
                >删除</Button>
              </template>
            </Table>
            <!-- 分页 -->
            <Row type="flex" justify="end" class="page" ref="pageFooter">
              <Page
                :current="curPage"
                :total="totalPages"
                @on-change="changePage"
                @on-page-size-change="changeSizePage"
                :page-size-opts="pageSizeOpts"
                show-sizer
                show-total
              />
            </Row>
          </div>
          <!-- 编辑 -->
          <div v-else>
            <p slot="title">
              <Icon type="ios-arrow-dropleft-circle" class="pr5" @click="goBack" />编辑员工
            </p>
            <Divider style="margin:14px 0;" />
            <!-- form表单 -->
            <Spin size="large" fix v-if="showDetail"></Spin>
            <Form ref="formCustom" :model="formCustom" :label-width="80" v-else>
              <FormItem label="姓名:" prop="userName">
                <Input type="text" v-model="formCustom.userName" style="width:500px;"></Input>
              </FormItem>
              <FormItem label="手机:" prop="mobile">
                <Input type="text" v-model="formCustom.mobile" style="width:500px;" disabled></Input>
              </FormItem>
              <FormItem label="邮箱:" prop="email">
                <Input type="text" v-model="formCustom.email" style="width:500px;"></Input>
              </FormItem>
              <FormItem label="部门:" prop="name">
                <Input type="text" v-model="formCustom.deptNames" style="width:500px;" disabled></Input>
              </FormItem>
              <FormItem label="选择角色:" prop="rolesName">
                <Select
                  v-model="roles"
                  filterable
                  multiple
                  @on-change="rolesChange"
                  style="width:500px;"
                >
                  <Option
                    v-for="item in selectAllRole"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.roleName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="备注:" prop="remark">
                <Input type="text" v-model="formCustom.remark" style="width:500px;"></Input>
              </FormItem>

              <FormItem>
                <Button type="primary" @click="handleSubmit">保存</Button>
                <Button @click="handleCancel" style="margin-left: 8px">取消</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
      <!-- 新增部门弹框 -->
      <Modal v-model="Modal" :title="modalTitle">
        <Form :model="sectionForm" ref="sectionForm" :label-width="94">
          <FormItem label="部门名称：" prop="name">
            <Input v-model="sectionForm.name" />
          </FormItem>
          <FormItem label="上级部门：" prop="superior">
            <Input v-model="sectionForm.superior" disabled />
          </FormItem>
          <FormItem label="备注：" prop="remark">
            <Input type="textarea" v-model="sectionForm.remark" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">取消</Button>
          <Button type="primary" @click="submit('sectionForm')">确认</Button>
        </div>
      </Modal>
      <!-- 修改部门弹框 -->
      <Modal v-model="updateModal" title="修改部门信息">
        <Form :model="updateForm" ref="updateForm" :label-width="94">
          <FormItem label="部门名称：" prop="name">
            <Input v-model="updateForm.name" />
          </FormItem>
          <FormItem label="备注：" prop="remark">
            <Input type="textarea" v-model="updateForm.remark" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="updateModal=false">取消</Button>
          <Button type="primary" @click="submit('updateForm')">确认</Button>
        </div>
      </Modal>
      <!-- 新增员工弹框 -->
      <Modal v-model="userModal" :title="userTitle">
        <Form :model="userForm" ref="addUserForm" :label-width="94">
          <FormItem
            label="真实姓名："
            prop="userName"
            :rules=" {
            required: true,
            message: '请输入用户的真实姓名',
            trigger: 'blur'
          }"
          >
            <Input v-model="userForm.userName"></Input>
          </FormItem>
          <FormItem
            label="用户："
            prop="userId"
            :rules=" {
            required: true,
            message: '请选择用户手机号',
            trigger: 'change',
            type:'number'
          }"
          >
            <Select v-model="userForm.userId" filterable>
              <Option
                v-for="(item,index) in userLists"
                :key="index"
                :value="item.id"
              >{{item.mobile}}-{{item.name?'('+item.name+')':''}}</Option>
            </Select>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <Input v-model="userForm.email"></Input>
          </FormItem>
          <FormItem
            label="角色："
            prop="roles"
            :rules=" { required: true, type: 'array', min: 1, message: '请选择角色', trigger: 'change' }"
          >
            <!-- <Input v-model="userForm.roles"></Input> -->
            <Select v-model="userForm.roles" filterable multiple>
              <!-- @on-change="addRolesChange" -->
              <Option
                v-for="item in selectAllRole"
                :value="item.id"
                :key="item.id"
              >{{ item.roleName }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="userModal=false">取消</Button>
          <Button type="primary" @click="submit('addUserForm')">确认</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import {
  selectAllRole,
  getListTree,
  listByPage,
  getDetailById,
  updateEmployee,
  addDept,
  searchDeptUser,
  addUserToDept,
  getUserToSearch,
  updateDept,
  getDeptInfo,
  deleteEmployee,
  deleteDept
} from "@/api";
import { mapState } from "vuex";
export default {
  name: "organi-manage",
  data() {
    return {
      // 新增弹框
      Modal: false,
      modalTitle: "新增部门",
      sectionForm: {},
      //修改部门信息
      updateModal: false,
      updateForm: {},
      // 搜索展示
      deptList: [],
      userList: [],

      // 新增员工弹框
      userModal: false,
      userTitle: "新增部门员工",
      userForm: {},
      userLists: [],

      showNav: true,
      searchVal: "", //搜索的值
      treeHeight: 0, //树的高度
      departmentTree: [], //树的值
      role: "角色",
      selectAllRole: [], // 请求返回的全部角色列表
      // syncLoading: false,
      isEdit: false,
      tableTitle: "健康申报登记管理",
      colTableList: [
        {
          title: "姓名",
          key: "userName",
          minWidth: 120
        },
        {
          title: "部门",
          key: "deptNames",
          align: "center",
          minWidth: 100
        },
        {
          title: "角色",
          key: "roleNames",
          align: "center",
          minWidth: 160
        },
        {
          title: "操作",
          key: "action",
          minWidth: 140,
          align: "center",
          slot: "action"
        }
      ], //右侧表格表头
      listTable: [], //右侧表格内容
      loadTable: true, //右侧表格是否显示等待
      tableHeight: 0, //右侧表格高度
      curPage: 1,
      totalPages: 0,
      pageSizeOpts: [5, 10, 15, 20],
      pageSize: 10,
      deptId: "",
      roleId: "",
      showDetail: false,
      employDetail: {},
      initDept: [],
      roleList: [],
      //   form表单
      formCustom: {
        userName: "",
        userId: "",
        email: "",
        roles: "",
        remark: ""
      },
      roles: [], // 当前角色选中列表
      styleBtn: {
        width: "35px",
        height: "18px",
        "font-size": "12px",
        padding: "3px",
        "line-height": "11px",
        "margin-left": "3px"
      },
      isTree: true,
      showAdd: false //新增员工按钮显示隐藏
    };
  },
  created() {
    this.getUserToSearch();
  },
  async mounted() {
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
      this.pageHeight();
      this.getAllRoles();
      this.getDptTree();
    },

    /**
     * 获取组织架构树
     */
    getDptTree() {
      getListTree().then(res => {
        if (res.code == 200) {
          this.departmentTree = res.result;
          // console.log("组织架构树", res.result);
        }
      });
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
                  verticalAlign: "top"
                  // transition: "all .2s ease-in-out"
                },
                on: {
                  click: even => {
                    let ulDom = document.getElementsByClassName(
                      "ivu-tree-children"
                    );
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
                    if (data) {
                      this.isEdit = false;
                      this.loadTable = true;
                      this.tableTitle = data.title;
                      this.deptId = data.id;
                      this.showAdd = true; //显示新增按钮
                      // console.log(data.id);
                      this.userForm.deptId = data.id; //点击左侧数的时候，将点击的部门id传给右侧新增部门员工的弹框
                      this.getEmployeesListByPage();
                    }
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
              btnPerm && btnPerm.includes("sys:dept:add")
                ? h("Icon", {
                    props: Object.assign({}, this.buttonProps, {
                      type: "md-add",
                      size: "16"
                    }),
                    style: {
                      marginRight: "4px"
                    },
                    on: {
                      click: () => {
                        // console.log("新增");
                        this.addDept(data);
                      }
                    }
                  })
                : "",
              btnPerm && btnPerm.includes("sys:dept:delete")
                ? h("Icon", {
                    props: Object.assign({}, this.buttonProps, {
                      type: "md-remove",
                      size: "16"
                    }),
                    style: {
                      marginRight: "4px"
                    },
                    on: {
                      click: () => {
                        // console.log("删除");
                        this.$Modal.confirm({
                          title: "确认删除",
                          content: "您确认要删除该部门吗？",
                          onOk: () => {
                            // console.log(data.id);
                            deleteDept({ id: data.id }).then(res => {
                              if (res.code == 200) {
                                this.$Message.success(res.message);
                                this.getDptTree();
                              }
                            });
                          }
                        });
                      }
                    }
                  })
                : "",
              btnPerm && btnPerm.includes("sys:dept:update")
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
                        // console.log("修改");
                        this.updateDept(data);
                      }
                    }
                  })
                : ""
            ]
          )
        ]
      );
    },

    /**
     * 新增部门
     */
    addDept(data) {
      this.sectionForm = {};
      this.Modal = true;
      // console.log(data);
      this.sectionForm.parentid = data.id * 1;
      this.sectionForm.superior = data.text;
    },
    goBack() {},
    /**
     * 弹框确认
     */
    submit(name) {
      // console.log(name);
      if (name == "sectionForm") {
        this.$refs[name].validate(valid => {
          // console.log(valid);
          if (valid) {
            // console.log(this.sectionForm);
            addDept(this.sectionForm).then(res => {
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.getDptTree();
                this.Modal = false;
              }
            });
          }
        });
      } else if (name == "addUserForm") {
        this.$refs[name].validate(valid => {
          if (valid) {
            let obj = {};
            obj.roleIds = this.userForm.roles;
            obj.userName = this.userForm.userName;
            obj.deptId = this.deptId;
            obj.userId = this.userForm.userId;
            obj.email = this.userForm.email;
            addUserToDept(obj).then(res => {
              // console.log(name, obj);
              // console.log(res);
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.userModal = false;
                this.getEmployeesListByPage();
              }
            });
          }
        });
      } else if (name == "updateForm") {
        // console.log(this.updateForm);
        this.updateForm.order = "";
        updateDept(this.updateForm).then(res => {
          this.$refs[name].validate(valid => {
            if (res.code == 200) {
              this.$Message.success(res.message);
              this.updateModal = false;
              this.getDptTree();
            }
          });
        });
      }
    },
    /**
     * 弹框取消
     */
    cancel() {
      this.Modal = false;
    },

    /**
     * 修改部门信息
     */
    updateDept(data) {
      this.updateForm = {};
      // console.log("修改",data.id);
      this.updateModal = true;
      getDeptInfo(data.id).then(res => {
        // console.log(res)
        this.updateForm = res.result;
      });
      // updateDept().then(res=>{
      //   console.log(res)
      // })
    },

    /**
     * 点击架构tree发送的网络请求获取右边表格数据
     */
    getEmployeesListByPage() {
      let obj = {};
      obj.deptId = this.deptId;
      obj.pageNumber = this.curPage;
      obj.pageSize = this.pageSize;

      listByPage(obj).then(res => {
        // console.log(res);
        this.totalPages = res.result.totalElements;
        this.listTable = res.result.content;
        // 表格去掉loading状态
        this.loadTable = false;
        // console.log("人员", res);
      });
    },

    /**
     * 获取所有角色
     */
    getAllRoles() {
      selectAllRole().then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.selectAllRole = res.result;
        }
      });
    },

    /**
     * 角色点击事件
     */
    selectRole(data) {
      this.loadTable = true;
      this.isEdit = false;
      this.roleId = data.id;
      // console.log(data);
      this.getRolelistByPage();
    },

    /**
     * 角色点击发送的网络请求
     */
    getRolelistByPage() {
      let obj = {};
      obj.roleId = this.roleId;
      obj.pageNumber = this.curPage;
      obj.pageSize = this.pageSize;
      listByPage(obj).then(res => {
        this.totalPages = res.result.totalElements;
        this.listTable = res.result.content;
        this.loadTable = false;
      });
    },

    /**
     * 搜索查询
     */
    searchData() {
      // console.log(this.searchVal);
      searchDeptUser({ searchTxt: this.searchVal }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.deptList = res.result.deptList;
          let arr = [];
          res.result.userList.forEach(item => {
            let obj = {};
            obj.id = item.id;
            obj.name = item.userName;
            arr.push(obj);
          });
          this.userList = arr;
        }
      });
    },

    /**
     * 搜索展示点击部门
     */
    onSearchDep(data) {
      this.isEdit = false;
      this.loadTable = true;
      this.tableTitle = data.title;
      this.deptId = data.id;
      this.getEmployeesListByPage();
    },

    /**
     * 计算页面高度
     */
    pageHeight() {
      /**
       * 计算表格高度(占全高度);每条数据 48px,表头 40px
       */
      this.tableHeight =
        Number(document.getElementsByClassName("single-page")[0].clientHeight) -
        Number(this.$refs.pageFooter.$el.offsetHeight) -
        134;
      this.treeHeight = this.$refs.cardHeight.$el.offsetHeight - 194;
    },

    /**
     * 左侧Tab标签切换
     */
    tabChange(name) {
      this.userForm = {};
      // console.log(name);
      this.listTable = [];
      if (name == 1) {
        this.tableTitle = "角色";
        this.isTree = false;
        this.getAllRoles();
      } else if (name == 0) {
        this.tableTitle = "广州青莲网络科技有限公司";
        this.isTree = true;
        this.getDptTree();
      }
    },

    /**
     * 左侧隐藏显示
     */
    hideNav() {
      this.showNav = !this.showNav;
    },

    /**
     * 编辑
     */
    edit(val) {
      this.employDetail = val;
      let obj = { id: val.id };
      getDetailById(obj).then(res => {
        // console.log(val.id, res);
        if (res.code == 200) {
          this.showAdd = false; //隐藏新增按钮
          this.showDetail = true;
          this.isEdit = true;

          this.initDept = res.result.deptList;
          let data = res.result.userDO;
          this.formCustom = res.result.userDO;
          // for (let key in this.formCustom) {
          //   this.formCustom[key] = data[key] == null ? "" : data[key];
          // }
          // console.log(this.formCustom);
          // 员工角色列表
          this.roles = [];
          res.result.roleList.forEach(i => {
            this.roles.push(i.id);
          });
          this.showDetail = false;
        }
      });
    },
    /**
     * 删除
     */
    handleDele(row) {
      let obj = {};
      obj.deptId = this.deptId;
      obj.userId = row.id;
      // console.log(obj);
      this.$Modal.confirm({
        title: "确认删除员工",
        content: "您确认要删除该员工？",
        onOk: () => {
          deleteEmployee(obj).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.message);
              this.getEmployeesListByPage();
            } else {
              this.$Message.error(res.message);
            }
          });
        }
      });
      // deleteEmployee(obj).then(res => {
      //   console.log(res);
      //   if (res.code == 200) {
      //     this.$Message.success();
      //   }
      // });
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.curPage = v;
      this.getEmployeesListByPage();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changeSizePage(v) {
      this.pageSize = v;
      this.getEmployeesListByPage();
    },
    rolesChange() {},
    /**
     * 保存按钮事件
     */
    handleSubmit() {
      let obj = {};
      obj.userId = this.formCustom.id;
      obj.userName = this.formCustom.userName;
      obj.roleIds = this.roles;
      obj.remark = this.formCustom.remark;
      obj.email = this.formCustom.email;
      updateEmployee(obj).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.showAdd = true; //隐藏新增按钮
          this.isEdit = false;
          this.getEmployeesListByPage();
        }
      });
      // this.loadTable = true;
      // this.updateEmployDetail(() => {
      //   this.isTree ? this.getEmployeesListByPage() : this.getRolelistByPage();
      //   this.isEdit = false;
      //   this.$Message.success("保存成功!");
      // });
    },

    /**
     * 新增部门员工
     */
    addStaff() {
      this.userForm = {};
      // console.log(this.userForm);
      this.userModal = true;
    },

    /**
     * 更新员工详情
     */
    getUserToSearch() {
      getUserToSearch().then(res => {
        if (res.code == 200) {
          console.log(res);
          this.userLists = res.result;
        }
      });
    },

    // 取消按钮
    handleCancel() {
      this.isEdit = false;
      this.showAdd = true; //隐藏新增按钮
    }
  }
};
</script>
<style lang="scss" scoped>
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
.addbutton {
  position: absolute;
  right: 16px;
}
.page {
  margin-top: 2vh;
}

.pointer {
  cursor: pointer;
}

.card-height {
  height: calc(100vh - 180px);
  overflow-x: auto;
  position: relative;
}
.update-empl {
  position: absolute;
  // right: 20px;
  bottom: 20px;
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

.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.ivu-scroll-container {
  overflow-y: auto;
}
.ivu-tabs-ink-bar {
  height: 2px;
  width: 60px !important;
  // width: 50%;
  box-sizing: border-box;
  background-color: #2d8cf0;
  position: absolute;
  left: 0;
  margin-left: 13px;
  bottom: 1px;
  z-index: 1;
  transition: transform 0.3s ease-in-out;
  transform-origin: 0 0;
}
.ivu-tabs-nav .ivu-tabs-tab {
  display: inline-block;
  height: 100%;
  width: 65%;
  padding: 8px 16px;
  margin-right: 25px;
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease-in-out;
}
.ivu-col-span-5 {
  display: block;
  width: 18%;
}
</style>