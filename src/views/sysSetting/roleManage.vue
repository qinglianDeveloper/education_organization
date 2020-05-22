<!-- 角色权限管理 -->
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <div id="table-header" ref="header">
            <Row class="operationMenu">
              <Form
                ref="searchForm"
                :model="searchForm"
                inline
                :label-width="70"
                class="search-form"
              >
                <Form-item label="角色名称" prop="roleName">
                  <Input
                    search
                    v-model="searchForm.roleName"
                    enter-button
                    placeholder="请输入角色名"
                    style="width: 300px"
                    @on-search="handleSearch"
                  />
                </Form-item>
                <Form-item class="fr" style="float:right">
                  <Button
                    @click="addRole"
                    type="primary"
                    icon="md-add"
                    v-if="menuBtns.indexOf('sys:role:add')>-1"
                  >添加角色</Button>
                  <Button
                    @click="delAll"
                    type="error"
                    icon="md-trash"
                    :disabled="selectCount == 0"
                    v-if="menuBtns.indexOf('sys:role:delete')>-1"
                  >批量删除</Button>
                  <Button @click="init" icon="md-refresh">刷新</Button>
                  <circleLoading v-if="operationLoading" />
                </Form-item>
              </Form>
            </Row>
            <Row>
              <Alert show-icon>
                已选择
                <span class="select-count">{{selectCount}}</span> 项
                <!-- <a class="select-clear" @click="clearSelectAll">清空</a> -->
              </Alert>
            </Row>
          </div>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              ref="table"
              sortable="custom"
              @on-sort-change="changeSort"
              @on-selection-change="changeSelect"
              id="tableList"
              :height="tableHeight"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="pageNumber"
              :total="total"
              :page-size="pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- 编辑 -->
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable="false" :width="500">
      <Form ref="roleForm" :model="roleForm" :label-width="80" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </FormItem>
        <FormItem label="角色编码" prop="roleSign">
          <Input v-model="roleForm.roleSign" placeholder />
        </FormItem>
        <FormItem label="是否可用" prop="status" v-if="modalType!==0">
          <RadioGroup v-model="roleForm.status">
            <Radio label="ENABLE">可用</Radio>
            <Radio label="DISABLE">不可用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="roleForm.remark" type="textarea" placeholder="请输入备注..." />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>
    <!-- 菜单权限 -->
    <Modal
      :title="modalTitle"
      v-model="permModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
      class="permModal"
    >
      <div class="modalTree">
        <Tree ref="tree" :data="permData" multiple></Tree>
        <Spin size="large" v-if="treeLoading"></Spin>
      </div>
      <div slot="footer">
        <Button type="text" @click="cancelPermEdit">取消</Button>
        <Button @click="selectTreeAll">全选/反选</Button>
        <Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>
      </div>
    </Modal>
    <!-- 数据权限 -->
    <Modal
      :title="modalTitle"
      v-model="depModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
      class="depModal"
    >
      <Form :label-width="70">
        <FormItem label="数据范围">
          <Select v-model="dataType">
            <Option v-for="(item,index) in roleData" :value="item.value" :key="index">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
      <Alert show-icon>默认可查看自己数据，需要查看其他数据范围请点击选择自定义权限数据</Alert>

      <div class="custom" v-if="dataType=='CUSTOM'">
        <div class="top">
          <span>团队类型：</span>
          <Select v-model="teamType" style="width:200px">
            <Option
              v-for="item in teamList"
              :value="item.value"
              :key="item.value"
              @click.native="changeTeam"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div :style="{'max-height':scrollHeight+'px',overflow:'auto'}">
          <Tree
            ref="saleTeamPage"
            :data="teamTreeData"
            :multiple="true"
            :show-checkbox="true"
            @on-check-change="checkGroupTree"
            style="margin-top:15px"
          ></Tree>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="submitCancelEdit">取消</Button>
        <Button type="primary" :loading="submitDepLoading" @click="submitDepEdit">提交</Button>
      </div>
    </Modal>
    <!-- 数据权限 -->
  </div>
</template>
<script>
import circleLoading from "@/components/circle-loading";
import { mapState } from "vuex";
import {
  getRoleList,
  addRole,
  deleteRole,
  editRole,
  getAllPermissionList,
  allotRoleMenu,
  addRoleData,
  getPowerTree,
  treeList, //销售团队树
  getEngineerTree, //工程师团队树
  getServiceTree, //客服团队树
  getAgencyList //代理列表
} from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  name: "role-manager",
  components: {
    circleLoading
  },
  data() {
    return {
      salesIds: [],
      technicalIds: [],
      customerServiceIds: [],
      agentIds: [],

      //请求回来的销售、工程师、客服、代理树
      salesTreeData: [],
      engineerTreeData: [],
      serviceTreeData: [],
      agencyTreeData: [],

      modalType: 0,

      powerNumer: 0,
      editDepartments: [],
      /* 搜索框内容 */
      searchForm: {
        roleName: ""
      },
      selectCount: 0, //批量删除按钮是否可用
      operationLoading: false,
      loading: true, //表格是否加载状态
      treeLoading: true, //树形是否加载状态
      /* 表格标题 */
      columns: [
        {
          type: "selection",
          align: "center",
          width: 60,
          fixed: "left"
        },
        {
          title: "序号",
          key: "id",
          align: "center",
          width: 80
        },
        {
          title: "角色名称",
          key: "roleName",
          // sortable: true,
          tooltip: true,
          minWidth: 160
        },
        {
          title: "备注",
          key: "remark",
          // sortable: true,
          tooltip: true,
          minWidth: 140
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          // sortable: true,
          width: 100,
          render: (h, params) => {
            if (params.row.status === "ENABLE") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "green"
                    }
                  },
                  "启用"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "red"
                    }
                  },
                  "禁用"
                )
              ]);
            }
          }
        },
        {
          title: "创建时间",
          key: "createdTime",
          align: "center",
          // sortable: true,
          sortType: "desc",
          minWidth: 170
        },
        {
          title: "更新时间",
          key: "updateTime",
          align: "center",
          // sortable: true,
          minWidth: 170
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 300,
          render: (h, params) => {
            let btnPerm = this.menuBtns;
            return h("div", [
              btnPerm && btnPerm.includes("sys:roleMenu:add")
                ? h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          if (this.permData.length == 0) {
                            this.$Message.error("加载菜单权限中...");
                          } else {
                            this.editPerm(params.row);
                          }
                        }
                      }
                    },
                    "菜单权限"
                  )
                : "",
              btnPerm && btnPerm.includes("sys:roleData:add")
                ? h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          // console.log("数据权限");
                          this.editDep(params.row);
                        }
                      }
                    },
                    "数据权限"
                  )
                : "",
              btnPerm && btnPerm.includes("sys:role:delete")
                ? h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.remove(params.row);
                        }
                      }
                    },
                    "删除"
                  )
                : "",
              btnPerm && btnPerm.includes("sys:role:update")
                ? h(
                    "Button",
                    {
                      props: {
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.edit(params.row);
                        }
                      }
                    },
                    "编辑"
                  )
                : ""
            ]);
            // }
          },
          fixed: "right"
        }
      ],
      data: [], //表格内容
      tableHeight: 0, //表格高度
      /* 分页选项 */
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      modalTitle: "", //弹出框标题
      roleModalVisible: false, //弹出框是否显示
      roleForm: {
        remark: "",
        // status: "DISABLE",
        // menuIds: [],
        roleName: "",
        roleSign: ""
      },
      roleFormValidate: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleSign: [
          { required: true, message: "角色编码不能为空", trigger: "blur" }
        ]
      },
      submitLoading: false, //提交按钮等待
      permModalVisible: false, //菜单权限弹出框
      permData: [], //树形数据
      submitPermLoading: false, //菜单权限-提交等待
      depModalVisible: false, //数据权限-弹出框
      dataType: "ONESELF", //数据权限-弹出框是否有树形数据
      treeForm: {}, //新增配置权限字段
      /* 数据权限-弹出框树形表格标题 */
      roleData: [
        {
          value: "ALL",
          label: "全部权限"
        },
        {
          value: "ONESELF",
          label: "仅本人权限"
        },
        {
          value: "CUSTOM",
          label: "自定义"
        }
      ],
      submitDepLoading: false, //数据权限-弹出框提交按钮是否等待
      configureStatus: false, //数据权限-弹出框是否显示
      teamTreeData: [],
      teamType: "",
      teamList: [
        {
          value: "sales",
          label: "销售团队"
        },
        {
          value: "engineer",
          label: "工程师团队"
        },
        {
          value: "service",
          label: "客服团队"
        },
        {
          value: "agency",
          label: "代理"
        }
      ],
      scrollHeight: 0,
      powerTreeData: [],
      // editConfigStatus: false, //数据权限-配置权限弹出框
      editPowTreeData: [], //数据权限-配置权限弹出框内容
      deleteStatus: false, //删除按钮弹框
      deletePage: "",
      editRolePermId: ""
    };
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
     * 页面初试化，刷新按钮事件
     */
    init() {
      //获取权限角色列表
      this.getRoleList();
      // 获取所有菜单权限树
      this.getPermList();
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },

    /**
     * 获取角色列表
     */
    getRoleList() {
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: this.sortColumn,
        order: this.sortType,
        roleName: this.searchForm.roleName
      };
      getRoleList(params).then(res => {
        // console.log("列表", res.result.content);
        if (res.code === 200) {
          this.loading = false;
          this.total = parseInt(res.result.totalElements);
          res.result.content.forEach(item => {
            if (item.updateTime) {
              item.updateTime = dateFormat(item.updateTime);
            }
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
            }
          });
          this.data = res.result.content;
        }
      });
    },

    editPerm(v) {
      console.log("菜单", this.permData);
      this.editRolePermId = v.id;
      this.modalTitle = "分配 " + v.roleName + " 的菜单权限(点击选择)";
      // 匹配勾选
      let rolePerms = [];
      if (v.menuIds) {
        rolePerms = v.menuIds.split(",");
      }
      // console.log(rolePerms)
      // 递归判断子节点
      this.permModalVisible = true;
      // console.log(this.permData, rolePerms);
      this.checkPermTree(this.permData, rolePerms);
      // if (this.permData.length != 0) {
      // }
    },

    /**
     * 获取所有菜单权限树
     */
    getPermList(callback) {
      this.treeLoading = true;
      getAllPermissionList().then(res => {
        // console.log("菜单权限树",res.result.adminPcList[0]);
        if (res.code == 200) {
          this.treeLoading = false;
          this.deleteDisableNode(res.result.adminPcList[0].children);
          this.permData = res.result.adminPcList[0].children;
          if (typeof callback === "function") {
            callback(res.result);
          }
        }
      });
    },
    /**
     * 递归判断子节点，在编辑状态下看是否被选中
     */
    checkPermTree(permData, rolePerms) {
      // console.log(permData, rolePerms);
      permData.forEach(p => {
        if (this.hasPerm(p, rolePerms)) {
          p.selected = true;
        } else {
          p.selected = false;
        }
        if (p.children && p.children.length > 0) {
          this.checkPermTree(p.children, rolePerms);
        }
      });
    },

    /**
     * 判断角色拥有的权限节点勾选
     */
    hasPerm(p, rolePerms) {
      let flag = false;
      // console.log(rolePerms);
      for (let i = 0; i < rolePerms.length; i++) {
        if (p.menuId) {
          if (p.menuId === rolePerms[i]) {
            flag = true;
            break;
          }
        } else {
          if (p.id == rolePerms[i]) {
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        return true;
      }
      return false;
    },

    /**
     * 递归标记禁用节点
     */
    deleteDisableNode(permData) {
      // console.log(permData)
      permData.forEach(e => {
        if (e.status === "DISABLE") {
          e.title = "[已禁用] " + e.title;
          e.disabled = true;
        }
        if (e.children && e.children.length > 0) {
          this.deleteDisableNode(e.children);
        }
      });
      // console.log(permData)
    },

    /**
     * 计算页面高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      // console.log(headerHeight);
      this.tableHeight = pageHeight - headerHeight - 81;
      this.scrollHeight = document.body.clientHeight - 340;
    },

    /**
     * 搜索框事件
     */
    handleSearch() {
      // console.log(this.searchForm);
      this.getRoleList();
    },

    /**
     * 添加角色按钮事件
     */
    addRole() {
      this.modalType = 0;
      this.modalTitle = "添加角色";
      this.$refs.roleForm.resetFields();
      delete this.roleForm.id;
      this.roleModalVisible = true;
    },

    /**
     * 批量删除按钮事件
     */
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          let deleteIdList = [];
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.operationLoading = true;
          deleteRole(ids).then(res => {
            // console.log(res);
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.getRoleList();
            }
          });
        }
      });
    },

    /**
     * 清空按钮事件
     */
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },

    /**
     * 表格排序
     */
    changeSort(e) {
      if (e.key == "roleName") {
        this.sortColumn = "role_name";
      } else if (e.key == "createTime") {
        this.sortColumn = "create_time";
      } else if (e.key == "updateTime") {
        this.sortColumn = "update_time";
      } else {
        this.sortColumn = e.key;
      }
      // this.sortColumn = e.key;
      this.sortType = e.order;
      if (e.order === "normal") {
        this.sortType = "";
      }
      this.getRoleList();
    },

    /**
     * 表格是否选中
     */
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },

    changePage(v) {
      this.pageNumber = v;
      this.getRoleList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getRoleList();
    },

    /**
     * 弹出框取消按钮事件
     */
    cancelRole() {
      this.roleModalVisible = false;
    },

    /**
     * 弹出框提交按钮事件
     */
    submitRole() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            // 添加
            this.submitLoading = true;
            let obj = {};
            obj.roleSign = this.roleForm.roleSign;
            obj.roleName = this.roleForm.roleName;
            // 新增默认状态时开启
            // obj.status = this.roleForm.status ;
            obj.remark = this.roleForm.remark;
            addRole(obj).then(res => {
              this.submitLoading = false;
              if (res.code === 200) {
                this.$Message.success("操作成功");
                this.getRoleList();
                this.roleModalVisible = false;
              }
            });
          } else {
            // 编辑
            // this.submitLoading = true;
            let obj = {};
            obj.status = this.roleForm.status;
            obj.roleSign = this.roleForm.roleSign;
            obj.roleName = this.roleForm.roleName;
            obj.id = this.roleForm.id;
            obj.remark = this.roleForm.remark;
            // console.log(data);
            editRole(obj).then(res => {
              this.submitLoading = false;
              if (res.code === 200) {
                this.getRoleList();
                this.$Message.success("操作成功");
                this.roleModalVisible = false;
              }
            });
          }
        }
      });
    },

    /**
     * 菜单权限弹框关闭
     */
    cancelPermEdit() {
      // console.log("菜单权限-取消");
      this.permModalVisible = false;
    },

    /**
     * 菜单权限-全选反选
     */
    selectTreeAll() {
      this.selectAllFlag = !this.selectAllFlag;
      let select = this.selectAllFlag;
      this.selectedTreeAll(this.permData, select);
    },
    // 递归全选节点
    selectedTreeAll(permData, select) {
      permData.forEach(e => {
        if (!e.disabled) {
          e.selected = select;
          if (e.children && e.children.length > 0) {
            this.selectedTreeAll(e.children, select);
          }
        }
      });
    },

    /**
     * 菜单权限-提交按钮
     */
    submitPermEdit() {
      this.submitPermLoading = true;
      let permIds = new Array();
      let selectedNodes = this.$refs.tree.getSelectedNodes();
      selectedNodes.forEach(function(e) {
        permIds.push(e.id);
      });
      let that = this;
      // console.log(this.editRolePermId,permIds)
      allotRoleMenu({
        roleId: this.editRolePermId,
        menuIds: permIds
      }).then(res => {
        this.submitPermLoading = false;
        if (res.success === true) {
          this.$Message.success("操作成功");
          this.getRoleList();
          this.permModalVisible = false;
        }
      });
    },

    /**
     * 数据权限弹框关闭
     */
    submitCancelEdit() {
      this.depModalVisible = false;
      this.getRoleList();
    },

    /**
     * 数据权限弹框提交
     */
    submitDepEdit() {
      let obj = {};
      if (this.dataType == "CUSTOM") {
        // 自定义的时候
        console.log(this.salesIds);
        obj.salesIds = this.salesIds.join(",");
        console.log(this.technicalIds);
        obj.technicalIds = this.technicalIds.join(",");
        obj.customerServiceIds = this.customerServiceIds.join(",");
        obj.agentIds = this.agentIds.join(",");
        obj.roleId = this.editRolePermId;
        obj.roleDataType = this.dataType;
      } else {
        // 全部或仅个人的时候
        obj.roleId = this.editRolePermId;
        obj.roleDataType = this.dataType;
      }

      console.log(obj);
      addRoleData(obj).then(res => {
        this.submitDepLoading = false;
        if (res.success === true) {
          this.$Message.success("操作成功");
          this.getRoleList();
          this.depModalVisible = false;
        }
      });
    },

    /**
     * 表格数据权限选项
     */
    editDep(v) {
      // console.log("数据权限", v);
      this.depModalVisible = true;
      this.treeForm.roleId = v.id;
      this.getSalesTeamList();
      this.getEngineerTeamList();
      this.getServiceTeamList();
      this.getAgencyTeamList();
      if (v.dataType) {
        // 编辑
        this.dataType = v.dataType;
        this.editRolePermId = v.id;
        this.modalTitle = "编辑 " + v.roleName + " 的数据权限";
        // 发送请求返回数据权限的数据
        getPowerTree({ roleId: v.id }).then(res => {
          if (res.code == 200) {
            console.log("角色的数据权限", res);
            // 将请求回来的数据权限赋值
            let data = res.result;
            if (data.salesIds) {
              this.salesIds = data.salesIds.split(",");
              this.listChecked(this.salesTreeData, this.salesIds);
            }
            if (data.engineerIds) {
              this.technicalIds = data.engineerIds.split(",");
              console.log(this.technicalIds);
              this.listChecked(this.engineerTreeData, this.technicalIds);
            }
            if (data.customerServiceIds) {
              this.customerServiceIds = data.customerServiceIds.split(",");
              this.listChecked(this.serviceTreeData, this.customerServiceIds);
            }
            if (data.agentIds) {
              this.agentIds = data.agentIds.split(",");
              this.listChecked(this.agencyTreeData, this.agentIds);
            }
          }
          // 编辑状态下默认显示销售，展开销售树
          this.teamType = "sales";
          this.teamTreeData = this.salesTreeData;
        });
      } else {
        //新增
        this.dataType = "ONESELF";
        this.editRolePermId = v.id;
        this.modalTitle = "分配 " + v.roleName + " 的数据权限";
      }
    },
    /**
     * 递归判断子节点是否勾选，在编辑数据权限  checked
     */
    listChecked(treeData, ids) {
      // console.log("测试", treeData, ids);
      treeData.forEach(item => {
        if (this.hasIds(item, ids)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        if (item.children && item.children.length > 0) {
          this.listChecked(item.children, ids);
        }
      });
    },
    /**
     * 拿到数和ids做对比，如果有返回true，没有就返回false
     */

    hasIds(item, ids) {
      let flag = false;
      for (let i = 0; i < ids.length; i++) {
        if (item.id == ids[i] && item.type != "team") {
          flag = true;
          break;
        }
      }
      if (flag) {
        return true;
      }
      return false;
    },

    // 数据--销售团队树
    getSalesTeamList() {
      treeList().then(res => {
        console.log("销售团队树", res);
        if (res.code == 200) {
          if (res.result && Array.isArray(res.result)) {
            this.salesTreeData = res.result;
          } else {
            this.salesTreeData = [];
          }
        }
      });
    },
    // 数据--工程师团队树
    getEngineerTeamList() {
      getEngineerTree().then(res => {
        console.log("工程师团队树", res);
        if (res.code == 200) {
          if (res.result && Array.isArray(res.result)) {
            this.engineerTreeData = res.result;
          } else {
            this.engineerTreeData = [];
          }
        }
      });
    },
    // 数据--客服团队树
    getServiceTeamList() {
      getServiceTree().then(res => {
        console.log("客服团队树", res);
        if (res.code == 200) {
          if (res.result && Array.isArray(res.result)) {
            this.serviceTreeData = res.result;
          } else {
            this.serviceTreeData = [];
          }
        }
      });
    },
    // 数据--代理团队树
    getAgencyTeamList() {
      getAgencyList().then(res => {
        console.log("代理", res);
        if (res.code == 200) {
          if (res.result && Array.isArray(res.result)) {
            // this.teamTreeData = res.result;
            let arr = [];
            res.result.forEach(item => {
              let obj = {};
              obj.id = item.id;
              obj.title = item.corpName;
              arr.push(obj);
            });
            this.agencyTreeData = arr;
          } else {
            this.agencyTreeData = [];
          }
        }
      });
    },

    // 选择团队类型
    changeTeam() {
      if (this.teamType == "sales") {
        // this.getSalesTeamList();
        this.teamTreeData = this.salesTreeData;
      } else if (this.teamType == "engineer") {
        // this.getEngineerTeamList();
        this.teamTreeData = this.engineerTreeData;
      } else if (this.teamType == "service") {
        // this.getServiceTeamList();
        this.teamTreeData = this.serviceTreeData;
      } else if (this.teamType == "agency") {
        // this.getAgencyTeamList();
        this.teamTreeData = this.agencyTreeData;
      }
    },

    // 判断角色拥有的权限节点勾选
    hasDepPerm(p, roleDepIds) {
      // console.log(p, roleDepIds);
      let flag = false;
      for (let i = 0; i < roleDepIds.length; i++) {
        // p.forEach(function(item){

        if (p.id == roleDepIds[i]) {
          flag = true;
          break;
        }

        // 判断部门选中
        if (
          p.hasChildren &&
          p.id == roleDepIds[i].targetId &&
          roleDepIds[i].type == 1
        ) {
          flag = true;
          break;
        }
        // 判断销售选中
        if (
          !p.hasChildren &&
          p.id == `s_${roleDepIds[i].targetId}` &&
          roleDepIds[i].type == 2
        ) {
          flag = true;
          break;
        }
        // })
      }

      if (flag) {
        return true;
      }
      return false;
    },
    // 选中事件
    checkGroupTree(v) {
      if (this.teamType == "sales") {
        let arr = [];
        v.forEach(item => {
          if (item.type == "person") {
            arr.push(item.id * 1);
          }
        });
        this.salesIds = arr;
        // console.log(this.salesIds);
      } else if (this.teamType == "engineer") {
        let arr = [];
        v.forEach(item => {
          if (item.type == "engineer") {
            arr.push(item.id * 1);
          }
        });
        this.technicalIds = arr;
        // console.log(this.technicalIds);
      } else if (this.teamType == "service") {
        let arr = [];
        v.forEach(item => {
          if (item.type == "customer") {
            arr.push(item.id * 1);
          }
        });
        this.customerServiceIds = arr;
        // console.log(this.customerServiceIds);
      } else if (this.teamType == "agency") {
        let arr = [];
        v.forEach(item => {
          arr.push(item.id * 1);
        });
        this.agentIds = arr;
        // console.log(this.agentIds);
      }
    },

    /**
     * 行内删除事件
     */
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除角色 " + v.roleName + " ?",
        onOk: () => {
          this.operationLoading = true;
          let deleteIdList = [];
          deleteRole(v.id).then(res => {
            this.operationLoading = false;
            if (res.code === 200) {
              this.$Message.success("删除成功");
              this.getRoleList();
            }
          });
        }
      });
    },

    /**
     * 行内编辑事件
     */
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑角色";
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let roleInfo = JSON.parse(str);
      this.roleForm = roleInfo;
      this.roleModalVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  .operationMenu {
    button {
      margin-right: 5px;
    }
    // margin-bottom: 2vh;
  }
  .select-count {
    font-size: 13px;
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

.custom {
  .one {
    height: 30px;
  }
  .two {
    height: 30px;
    margin: 0 10px;
  }
  .three {
    height: 30px;
  }
}

.configure {
  width: 100%;
  display: flex;
  .configure-l {
    width: 50%;
    display: flex;
    justify-content: center;
    .txt {
      display: inline-block;
      height: 30px;
      padding-bottom: 15px;
    }
  }
}

.permModal {
  .ivu-modal-body {
    max-height: 560px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.5;
    padding: 16px;
  }
}

.depModal {
  .ivu-modal-body {
    max-height: 560px;
    min-height: 130px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.5;
    padding: 16px;
  }
}
#tableList {
  height: calc(100vh - 44px);
}

.modalTree {
  margin-top: 15px;
  max-height: calc(100vh - 200px - 100px);
  overflow-x: hidden;
  overflow-y: auto;
}
</style>