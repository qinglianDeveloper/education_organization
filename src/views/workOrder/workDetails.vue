<!-- 工单详情 -->
<template>
  <div class="work-details">
    <div class="card">
      <!-- 头部按钮组 -->
      <Row class="header" type="flex" justify="space-between">
        <div class="info">
          <p class="work-title">
            <span>标题：</span>
            <span>{{workForm.orderTitle}}</span>
          </p>
          <p class="work-company">
            <span>客户名称：</span>
            <!-- <span style="color:#2d8cf0">{{workForm.customer}}</span> -->
            <Button
              size="small"
              type="text"
              @click="toUserDetail"
              v-show="workForm.customer"
            >{{workForm.customer}}</Button>
          </p>
        </div>
        <div class="btn-group" v-if="showButtonGroup">
          <Button
            type="default"
            size="small"
            @click="handleAllot"
            v-if="showAllot(workForm.status)"
          >分配</Button>
          <Button
            type="default"
            size="small"
            @click="handleDispose"
            v-if="showDispose(workForm.status)"
          >受理</Button>
          <Button
            type="default"
            size="small"
            @click="handleTransfer"
            v-if="showTransfer(workForm.status)"
          >转交</Button>
          <Button
            type="default"
            size="small"
            @click="handleFinish"
            v-show="!isResport"
            v-if="showFinish(workForm.status)"
          >完成</Button>
          <Button
            type="default"
            size="small"
            @click="handleGoback"
            v-if="showGoback(workForm.status)"
          >退回</Button>
          <Button
            type="default"
            size="small"
            @click="handleClose"
            v-if="showClose(workForm.status)"
          >关闭</Button>
          <Button type="default" size="small" @click="handleDel" v-if="showDel(workForm.status)">删除</Button>
          <Button
            :type="edit?'default':'primary'"
            size="small"
            @click="handleEdit"
            v-if="showEdit(workForm.status)"
          >{{edit?"编辑":"保存"}}</Button>
        </div>
        <Divider style="margin:14px 0" />
      </Row>
      <!-- 内容部分 -->
      <Row class="content">
        <!-- 标签切换 -->
        <Tabs type="card">
          <TabPane label="工单内容" name="name1">
            <div class="work-order-content">
              <Form
                class="form"
                ref="workForm"
                :model="workForm"
                :label-width="100"
                :rules="ruleCustom"
              >
                <FormItem label="工单标题：" prop="orderTitle">
                  <Input
                    type="text"
                    v-model="workForm.orderTitle"
                    style="width:280px"
                    :disabled="edit||orederEdit"
                  />
                </FormItem>
                <div style="display:flex;">
                  <FormItem label="工单模板：" prop="templateId" style="margin-right:60px">
                    <Select
                      :disabled="true"
                      v-model="workForm.templateId"
                      filterable
                      style="width:280px"
                      @on-change="selectTemplate"
                    >
                      <Option
                        v-for="item in template"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.templateName }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="工单类型：" prop="typeId">
                    <Select
                      v-model="workForm.typeId"
                      style="width:280px"
                      filterable
                      :disabled="edit||orederEdit"
                    >
                      <Option
                        v-for="item in type"
                        :value="item.id"
                        :key="item.id"
                        :disabled="edit"
                      >{{ item.typeName }}</Option>
                    </Select>
                  </FormItem>
                </div>
                <FormItem label="详细描述：" prop="description">
                  <tinymce-editor v-model="workForm.description" :disabled="edit"></tinymce-editor>
                </FormItem>
                <FormItem label="上传附件：" v-if="showButtonGroup">
                  <Button
                    type="primary"
                    v-show="edit"
                    @click="handleDownload(workForm.accessoryUrl)"
                  >下载附件</Button>
                  <Upload
                    v-show="!edit"
                    :action="uploadAction"
                    :before-upload="handleBefore"
                    :on-success="handleSuccess"
                    ref="upload"
                    :data="file"
                    :max-size="30720"
                    :on-exceeded-size="handleMaxSize"
                  >
                    <Button icon="ios-cloud-upload-outline">上传附件</Button>
                  </Upload>
                </FormItem>
                <FormItem label="工单属性：" class="work-attribute">
                  <FormItem label="优先级：" :label-width="100" class="priority" prop="priority">
                    <Select
                      v-model="workForm.priority"
                      style="width:160px"
                      size="small"
                      :disabled="edit"
                    >
                      <Option
                        v-for="item in priority"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    label="受理组："
                    :label-width="100"
                    class="deal-group"
                    prop="acceptGroupId"
                    :show-message="false"
                  >
                    <Select
                      v-model="workForm.acceptGroupId"
                      style="width:160px"
                      size="small"
                      filterable
                      @on-change="selectGroups"
                      :disabled="true"
                    >
                      <Option
                        v-for="item in acceptGroupId"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.groupName }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="受理人：" :label-width="100" class="deal-person" prop="acceptorId">
                    <Select
                      v-model="workForm.acceptorId"
                      style="width:160px"
                      size="small"
                      filterable
                      :disabled="edit"
                    >
                      <Option
                        v-for="item in acceptorId"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    label="相关客户："
                    :label-width="100"
                    class="related-client"
                    prop="customerId"
                    :show-message="false"
                  >
                    <Select
                      v-model="workForm.customerId"
                      style="width:160px"
                      size="small"
                      filterable
                      :disabled="true"
                    >
                      <Option
                        v-for="item in customerId"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </FormItem>
              </Form>
              <div>
                <span>自定义工单属性：</span>
                <Form
                  ref="feildsItem"
                  :model="feildsItem"
                  :label-width="100"
                  style="margin:10px 0 0 110px"
                >
                  <template v-for="(item,index) in customArr">
                    <FormItem
                      :label="item.fieldName+'：'"
                      :prop="item.fieldName"
                      :rules="rul(item)"
                      :key="index"
                    >
                      <Select
                        v-if="item.fieldType=='PULL'?true:false"
                        style="width:400px;margin-bottom:10px"
                        @on-change="changeItem($event, item.fieldName)"
                        v-model="item.fieldValue"
                        :disabled="edit"
                      >
                        <Option v-for="(it,i) in item.optionContent" :key="i" :value="it">{{it}}</Option>
                      </Select>
                      <RadioGroup
                        v-if="item.fieldType=='RADIO'?true:false"
                        style="width:400px;margin-bottom:10px"
                        @on-change="changeItem($event, item.fieldName)"
                        v-model="item.fieldValue"
                      >
                        <Radio
                          v-for="(it,i) in item.optionContent"
                          :key="i"
                          :label="it"
                          :disabled="edit"
                        ></Radio>
                      </RadioGroup>
                      <CheckboxGroup
                        v-if="item.fieldType=='CHECK'?true:false"
                        style="width:400px;margin-bottom:10px"
                        @on-change="changeRadioGroup($event)"
                        v-model="item.fieldValue"
                      >
                        <Checkbox
                          v-for="(it,i) in item.optionContent"
                          :key="i"
                          :label="it"
                          :disabled="edit"
                        ></Checkbox>
                      </CheckboxGroup>
                      <Input
                        v-if="item.fieldType=='SINGLE'?true:false"
                        style="width:400px;margin-bottom:10px"
                        v-model="item.fieldValue"
                        :disabled="edit"
                      />
                      <Input
                        v-if="item.fieldType=='MULTI'?true:false"
                        type="textarea"
                        style="width:400px;margin-bottom:10px"
                        v-model="item.fieldValue"
                        :disabled="edit"
                      />
                      <DatePicker
                        v-if="item.fieldType=='DATE'?true:false"
                        type="date"
                        style="width:400px;margin-bottom:10px"
                        v-model="item.fieldValue"
                        @on-change="changeDate"
                        :disabled="edit"
                      ></DatePicker>
                    </FormItem>
                    <!-- 其他选择 -->
                    <!-- v-if="item.fieldValue=='其他'" -->
                    <FormItem
                      v-if="isOther(item.fieldValue)"
                      :label="item.fieldName+'-其他：'"
                      :key="index+'other'"
                    >
                      <Input
                        style="width:400px;margin-bottom:10px"
                        v-model="item.otherValue"
                        :disabled="edit"
                      />
                    </FormItem>
                  </template>
                </Form>
              </div>
            </div>
          </TabPane>
          <TabPane label="工单属性" name="name2">
            <Form ref="workProperty" :label-width="100" class="work-property" :model="workProperty">
              <FormItem label="创建渠道：">
                <span style="width:300px">{{workForm.createChannel}}</span>
              </FormItem>
              <FormItem label="工单类型：">
                <span style="width:300px">{{workForm.typeName}}</span>
              </FormItem>
              <FormItem label="编号：">
                <span style="width:300px">{{workForm.workOrderNum}}</span>
              </FormItem>
              <FormItem label="受理人：">
                <span style="width:300px">{{workForm.acceptor}}</span>
              </FormItem>
              <FormItem label="受理组：">
                <span style="width:300px">{{workForm.groupName}}</span>
              </FormItem>
              <FormItem label="分配人：">
                <span style="width:300px">{{workForm.assigner}}</span>
              </FormItem>
              <FormItem v-for="(value, key, index) in feildsItem" :key="index" :label="key+'：'">
                <span>{{value}}</span>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="订单属性" name="name3">
            <Form ref="orderProperty" :label-width="80" class="order-property" v-if="hasOrder">
              <FormItem
                v-for="(item,index) in orderProperty"
                :key="index"
                :label="item.attributeName+'：'"
              >
                <span>{{item.attributeValue}}</span>
              </FormItem>
            </Form>
            <Tag color="red" v-else>{{orderMessage}}</Tag>
          </TabPane>
          <TabPane label="操作历史" name="name4">
            <Table
              :columns="logColumns"
              :data="listData"
              border
              ref="table"
              :loading="loading"
              :height="tableHeight"
            ></Table>
            <!-- 分页部分 -->
            <Row type="flex" justify="end" class="page">
              <div ref="footer" class="footer">
                <Page
                  :current="searchForm.pageNumber"
                  :total="total"
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                  :page-size-opts="[10,20,50]"
                  show-total
                  show-elevator
                  show-sizer
                ></Page>
              </div>
            </Row>
          </TabPane>

          <TabPane label="备注" name="name5">
            <Row style="margin-bottom:6px">
              <Button type="primary" size="small" @click="addRemark" v-if="showButtonGroup">新增备注</Button>
            </Row>
            <Table ref="table" :columns="columns" :data="remarkData" border>
              <template slot-scope="{ row }" slot="accessory">
                <Button
                  type="default"
                  size="small"
                  v-show="row.remarkUrl?true:false"
                  v-if="showButtonGroup"
                >
                  <a :href="row.remarkUrl">下载</a>
                </Button>
                <Button
                  type="default"
                  size="small"
                  disabled
                  v-show="row.remarkUrl?false:true"
                  v-if="showButtonGroup"
                >无附件</Button>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="small" @click="handleDelete(row,index)">删除</Button>
              </template>
            </Table>
          </TabPane>
          <!-- 验收报告 -->
          <TabPane label="验收报告" name="name6">
            <Form :label-width="100" ref="report" :model="report" :rules="reportRules">
              <FormItem label="报告内容：">
                <Input
                  :disabled="!showButtonGroup"
                  type="textarea"
                  :autosize="{minRows: 4,maxRows: 5}"
                  v-model="report.reportDesc"
                ></Input>
              </FormItem>
              <FormItem label="附件：" prop="reportUrl" v-if="showButtonGroup">
                <!-- 下载 -->
                <Button type="primary" @click="downloadReport" v-if="showDownloadReport">下载附件</Button>
                <!-- 上传 -->
                <upload-remark
                  @success="reportUpload"
                  ref="remarkRef"
                  v-if="showUploadReport"
                  :data="report.reportUrl"
                  :fileNum="1"
                ></upload-remark>
              </FormItem>
            </Form>
            <Row>
              <Button
                @click="handleReport"
                type="primary"
                v-show="isResport"
                v-if="showButtonGroup"
              >提交报告</Button>
            </Row>
          </TabPane>
        </Tabs>
      </Row>
    </div>

    <!-- 新增备注弹框 -->
    <Modal v-model="Modal" :title="modalTitle" :mask-closable="false">
      <Form :model="remarkForm" :label-width="94" ref="remarkForm">
        <FormItem
          label="备注内容："
          prop="remarkContent"
          :rules="{ required: true, message: '请输入备注内容', trigger: 'blur' ,type: 'string'}"
        >
          <Input type="textarea" v-model="remarkForm.remarkContent" />
        </FormItem>
        <FormItem label="附件：">
          <upload-remark @success="remarkUpload" ref="remarkRef"></upload-remark>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="Modal=false">取消</Button>
        <Button type="primary" @click="handleSubmit('orderStatus')">确定</Button>
      </div>
    </Modal>

    <!-- 选择工程师弹框 -->
    <Modal v-model="engineerModal" :title="engineerTitle">
      <Form :model="work" ref="work">
        <FormItem
          label="工程师组："
          :label-width="96"
          prop="enginnerGroup"
          :rules="{ required: true, message: '请选择工程师组', trigger: 'blur',type:'number' }"
        >
          <Select v-model="work.enginnerGroup" @on-change="selectGroup">
            <Option
              v-for="(item,index) in acceptGroupId"
              :key="index"
              :value="item.id"
            >{{ item.groupName }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="工程师："
          :label-width="96"
          prop="engineerId"
          :rules="{ required: true, message: '请选择工程师', trigger: 'blur',type:'number' }"
        >
          <Select v-model="work.engineerId">
            <Option v-for="(item,index) in workOptions" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="engineerModal=false">取消</Button>
        <Button type="primary" @click="handleSure">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import TinymceEditor from "@/components/tinymce-editor/tinymce-editor";
import {
  getOrderInfo,
  getAddTemplate,
  getAddType,
  getInfoById,
  getAddGroups,
  getAddPerson,
  getAddCustomer,
  getRemark,
  addRemark,
  getListFlow,
  removeRemark,
  getEngineer,
  allotWork,
  shiftWork,
  finishedWork,
  closeWork,
  disposeWork, //处理
  removeWork,
  gobackWork,
  getOrderProterty,
  updateWorkOrder, //修改工单
  getReport,
  addReport,
  getByOrderId //从订单看工单详情
} from "@/api";
import { dateFormat } from "@/utils/current";
import config from "@/config";
import uploadRemark from "@/components/uploadRemark";
import { getBlob } from "@/libs/download";
import downlaod from "file-saver";
import { mapState } from "vuex";
export default {
  name: "work-details",
  components: { TinymceEditor, uploadRemark },
  data() {
    return {
      showButtonGroup: true,
      // 操作历史
      loading: false,
      tableHeight: 0,
      logColumns: [
        { title: "操作人", key: "creator", minWidth: 140, align: "center" },
        {
          title: "操作内容",
          key: "operationContent",
          minWidth: 160,
          align: "center"
        },
        {
          title: "操作时间",
          key: "changeTime",
          minWidth: 160,
          align: "center"
        },
        { title: "状态", key: "status", minWidth: 100, align: "center" }
      ],
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      //主要
      title: "我是工单标题",
      companyName: "",
      workForm: {},
      ruleCustom: {
        orderTitle: [
          { required: true, message: "请输入工单标题", trigger: "blur" }
        ],
        templateId: [
          {
            required: true,
            message: "请选择工单模板",
            trigger: "blur",
            type: "number"
          }
        ],
        typeId: [
          {
            required: true,
            message: "请选择工单类型",
            trigger: "blur",
            type: "number"
          }
        ],
        acceptGroupId: [
          {
            required: true,
            message: "请选择受理组",
            trigger: "blur",
            type: "number"
          }
        ],
        customerId: [
          {
            required: true,
            message: "请选择相关客户",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      template: [],
      type: [],
      priority: [
        { value: "HIGH", label: "高" },
        { value: "MIDDLE", label: "中" },
        { value: "LOW", label: "低" }
      ],
      acceptGroupId: [],
      acceptorId: [],
      customerId: [],
      customArr: [],
      uploadAction: "",
      file: { title: "" },
      feildsItem: {},
      feildsRules: {},

      listData: [],
      // 备注
      remarkData: [],
      columns: [
        {
          title: "操作人",
          key: "creator",
          align: "center",
          minWidth: 100
        },
        {
          title: "内容",
          key: "remarkContent",
          align: "center",
          minWidth: 140
        },
        {
          title: "备注时间",
          key: "createdTime",
          align: "center",
          minWidth: 160
        },
        {
          title: "附件",
          slot: "accessory",
          align: "center",
          minWidth: 140
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 80
        }
      ],
      // 验收报告
      report: {
        reportDesc: "",
        reportUrl: ""
      },
      // 工单内容编辑开关
      edit: true,
      // 工单属性
      workProperty: {},
      // 新增弹框
      Modal: false,
      modalTitle: "",
      remarkForm: {},

      // 选择工程师
      engineerModal: false,
      engineerTitle: "选择工程师",
      work: {},
      workOptions: [],
      status: "",

      // 订单属性
      orderProperty: [],

      isResport: false,
      orederEdit: false,

      showDownloadReport: false,
      showUploadReport: true,
      hasOrder: true,
      orderMessage: "",
      reportRules: {
        reportUrl: [
          { required: true, message: "附件不能为空", trigger: "changer" }
        ]
      }
    };
  },
  created() {
    this.getOrderInfo();
    this.getAddPull();
    this.uploadAction = config.uploadAction;
  },
  mounted() {
    this.pageHeight();
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  methods: {
    isOther(item) {
      // console.log(item);
      if (item == "其他") {
        return true;
      }
      if (item && Array.isArray(item) && item.indexOf("其他") > -1) {
        return true;
      }
    },
    /* 日期选择 */
    changeDate(newDate) {
      console.log(newDate);
    },
    selectGroup(id) {
      getAddPerson({ groupId: id }).then(res => {
        if (res.code == 200) {
          this.workOptions = res.result;
        }
      });
    },
    // 分配按钮权限
    showAllot(status) {
      if (this.menuBtns.indexOf("workorder:record:add") > -1) {
        if (status == "DISALLOW") {
          return true;
        }
      } else {
        return false;
      }
    },
    // 受理按钮权限
    showDispose(status) {
      if (this.menuBtns.indexOf("workorder:workOrder:accept") > -1) {
        if (status == "DISAFFECT") {
          return true;
        }
      } else {
        return false;
      }
    },
    // 转交按钮权限
    showTransfer(status) {
      if (this.menuBtns.indexOf("workorder:record:transfer") > -1) {
        if (status == "ACCEPT") {
          return true;
        }
      } else {
        return false;
      }
    },
    // 完成按钮权限
    showFinish(status) {
      if (this.menuBtns.indexOf("workorder:workOrder:solve") > -1) {
        if (status == "ACCEPT") {
          return true;
        }
      } else {
        return false;
      }
    },
    // 退回按钮权限
    showGoback(status) {
      if (this.menuBtns.indexOf("workorder:record:rollback") > -1) {
        if (status == "ACCEPT") {
          return true;
        }
      } else {
        return false;
      }
    },
    // 关闭按钮权限
    showClose(status) {
      if (this.menuBtns.indexOf("workorder:workOrder:close") > -1) {
        if (status == "DISALLOW" || status == "SOLVE" || status == "ACCEPT") {
          return true;
        }
      } else {
        return false;
      }
    },
    // 删除按钮权限
    showDel(status) {
      if (this.menuBtns.indexOf("workorder:workOrder:delete") > -1) {
        if (status == "DISALLOW" || status == "ACCEPT" || status == "SOLVE") {
          return true;
        }
      } else {
        return false;
      }
    },
    // 编辑按钮权限
    showEdit(status) {
      // console.log("123", status);
      if (this.menuBtns.indexOf("workorder:workOrder:update") > -1) {
        if (status == "DISALLOW" || status == "DISAFFECT") {
          return true;
        }
      } else {
        return false;
      }
    },

    handleDownload(url) {
      if (url) {
        getBlob(url).then(blob => {
          saveAs(blob);
        });
        return false;
      } else {
        this.$Message.error("此工单没有附件！");
      }
    },

    /**
     * 跳转到客户详情
     */
    toUserDetail() {
      this.$router.push({
        name: "clientDetails",
        query: {
          id: this.workForm.customerId
        }
      });
    },

    // 动态校验
    rul(val) {
      // console.log(val);
      let obj = {};
      if (val.isRequired == "YES") {
        if (val.fieldType == "CHECK") {
          obj = {
            required: true,
            type: "array",
            min: 1,
            message: "不能为空！",
            trigger: "change"
          };
        } else if (val.fieldType == "DATE") {
          obj = {
            required: true,
            message: "不能为空！",
            type: "date",
            trigger: "change"
          };
        } else {
          obj = { required: true, message: "不能为空！", trigger: "blur" };
        }
      } else {
        return;
      }
      return obj;
    },
    /**
     * 页面初始化
     */
    init() {
      this.getRouter();
    },
    /**
     * 获取工程师下拉列表
     */
    getEngineer(id) {
      getAddPerson({ groupId: id }).then(res => {
        if (res.code == 200) {
          this.workOptions = res.result;
          // console.log(this.workOptions);
        }
      });
    },
    /**
     * 弹框提交按钮
     */
    handleSure() {
      // console.log(this.work);
      this.$refs.work.validate(valid => {
        // console.log(valid);
        if (valid) {
          if (this.status == "Transfer") {
            shiftWork(this.work).then(res => {
              if (res.code == 200) {
                this.$Message.success("工单转交成功！");
                this.engineerModal = false;
                this.getOrderInfo();
              } else {
                this.$Message.error("工单转交失败！");
              }
            });
          } else if (this.status == "Allot") {
            allotWork(this.work).then(res => {
              if (res.code == 200) {
                this.$Message.success("工单分配成功！");
                this.engineerModal = false;
                this.getOrderInfo();
              } else {
                this.$Message.error("工单分配失败！");
              }
            });
          }
        }
      });
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      // console.log(pageHeight);
      let headerHeight = 32 + 52 + 90;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight;
      // console.log(this.tableHeight);
    },

    /**
     * 获取详情
     */
    getOrderInfo() {
      let id = this.$route.query.workID;
      let from = this.$route.query.from;
      if (from == "workOrder") {
        this.showButtonGroup = true;
        getOrderInfo({ id }).then(res => {
          console.log(id, "查看工单", res);
          if (res.code == 200) {
            this.workForm = res.result;
            // 判断是手动创建还是订单生成
            // console.log(this.workForm.createChannel);
            if (this.workForm.createChannel == "MANUALLY") {
              this.orederEdit = false;
            } else {
              this.orederEdit = true;
            }
            // 弹框下拉
            this.getEngineer(this.workForm.acceptGroupId);
            // console.log(this.workForm);
            this.workForm.customerId = this.workForm.customerId * 1;
            this.selectGroups(this.workForm.acceptGroupId);
            this.selectTemplate(this.workForm.templateId);
            this.customArr = JSON.parse(this.workForm.feildsItem);
            // console.log(this.customArr);
            this.getOrderProterty(this.workForm.id);
            this.getReport(this.workForm.id);
            this.getRemark(this.workForm.id);
            this.getListFlow(this.workForm.workOrderNum);
          }
        });
      } else if (from == "Order") {
        this.showButtonGroup = false;
        // console.log("订单看工单");
        getByOrderId({ orderId: id }).then(res => {
          // console.log(id, "订单看工单", res);
          if (res.code == 200) {
            this.workForm = res.result;
            // 判断是手动创建还是订单生成
            // console.log(this.workForm.createChannel);
            if (this.workForm.createChannel == "MANUALLY") {
              this.orederEdit = false;
            } else {
              this.orederEdit = true;
            }
            // 弹框下拉
            // console.log(this.workForm);
            this.getEngineer(this.workForm.acceptGroupId);
            this.workForm.customerId = this.workForm.customerId * 1;
            this.selectGroups(this.workForm.acceptGroupId);
            this.selectTemplate(this.workForm.templateId);
            this.customArr = JSON.parse(this.workForm.feildsItem);
            this.getOrderProterty(this.workForm.id);
            this.getRemark(this.workForm.id);
            this.getReport(this.workForm.id);
            this.getListFlow(this.workForm.workOrderNum);
          }
        });
      }
    },
    /**
     * 模板下拉选中事件
     */
    selectTemplate(value) {
      this.feildsItem = {};
      // console.log(this.feildsItem);
      if (value) {
        // getInfoById({ id: value }).then(res => {
        //   // console.log(res);
        //   if (res.code == 200 && res.result !== null) {
        //     this.customArr = res.result.workOrderFieldListList;
        //     this.customArr.forEach(item => {
        //       if (item.optionContent) {
        //         item.optionContent = item.optionContent.split(",");
        //       }
        //     });
        //     // console.log(this.customArr);
        //   }
        // });
      }
    },
    handleBefore(file) {
      this.file.title = file.name;
    },
    /**
     * 弹框上传成功回调
     */
    handleSuccess(res, file, filelist) {
      // console.log(res);
      if (res.code == 200) {
        let arr = [];
        filelist.forEach(item => {
          arr.push(item.response.message);
        });
        this.workForm.accessoryUrl = arr.join(",");
        // console.log(this.workForm.accessoryUrl);
        this.$Message.success({
          content: "上传附件成功！",
          duration: 2
        });
      } else {
        this.$Message.error("上传附件失败，请重新上传");
      }
    },
    /**
     * 文件超出指定大小限制时的钩子
     */
    handleMaxSize(file) {
      this.$Message.error({
        content: "文件大小超过30M，请重新上传！",
        duration: 2
      });
    },

    /**
     * 下拉框数据
     */
    getAddPull() {
      // 模板下拉数据
      getAddTemplate().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.template = res.result;
        }
      });
      // 类型下拉数据
      getAddType().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.type = res.result;
        }
      });
      // 受理组下拉数据
      getAddGroups().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.acceptGroupId = res.result;
          // console.log("组", res.result);
        }
      });
      // 相关客户下拉数据
      getAddCustomer().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.customerId = res.result;
        }
      });
    },
    /**
     * 受理组下拉选中事件
     */
    selectGroups(value) {
      // console.log(value);
      // 受理人下拉数据
      getAddPerson({ groupId: value }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.acceptorId = res.result;
        }
      });
    },

    /**
     * 自定义属性选中事件
     */
    changeItem($event, name) {
      // console.log($event, name);
      // this.feildsItem[name] = $event;
      // console.log(this.feildsItem);
    },
    changeRadioGroup(value, i) {
      // console.log(value, i);
      // console.log(this.feildsItem);
    },
    /**
     * 获取订单属性
     */
    getOrderProterty(id) {
      let obj = {};
      obj.workOrderId = id;
      getOrderProterty(obj).then(res => {
        // console.log("订单属性", res);
        if (res.code == 200 && res.result != null) {
          // console.log(res);
          this.hasOrder = true;
          this.orderProperty = JSON.parse(res.result.productSpecsName);
          // this.orderProperty = JSON.parse(this.order);
        } else if (res.code == 200 && res.message != null) {
          this.hasOrder = false;
          this.orderMessage = res.message;
          // console.log(res.message);
        }
      });
    },
    /**
     * 操作历史列表
     */
    getListFlow(workOrderNum) {
      this.searchForm.workOrderNo = workOrderNum;
      // console.log("历史", this.searchForm);
      getListFlow(this.searchForm).then(res => {
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.changeTime) {
              item.changeTime = dateFormat(item.changeTime);
            }
          });
          this.listData = res.result.content;
          this.changeLanguage(this.listData);
          this.total = res.result.totalElements;
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.status) {
          case "DISALLOW":
            item.status = "待分配";
            break;
          case "DISAFFECT":
            item.status = "待受理";
            break;
          case "ACCEPT":
            item.status = "已受理";
            break;
          case "SOLVE":
            item.status = "已解决";
            break;
          case "CLOSE":
            item.status = "已关闭";
            break;
        }
      });
      return arr;
    },
    /**
     * 备注列表数据
     */
    getRemark() {
      let obj = {};
      obj.workOrderId = this.workForm.id;
      getRemark(obj).then(res => {
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
            }
          });
          this.remarkData = res.result.content;
          // console.log(this.remarkData);
        }
      });
    },
    /**
     * 新增备注
     */
    addRemark() {
      this.remarkForm = {};
      this.$refs.remarkRef.clearFiles();
      this.Modal = true;
      this.modalTitle = "新增备注";
      this.remarkForm.workOrderId = this.workForm.id;
    },
    /**
     * 弹框上传成功回调
     */
    remarkUpload(urls) {
      // console.log(urls);
      this.remarkForm.remarkUrl = urls;
    },
    /**
     * 弹框确定按钮
     */
    handleSubmit() {
      // console.log(this.remarkForm);
      addRemark(this.remarkForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.$Message.success("新增备注成功！");
          this.Modal = false;
          this.getRemark();
        } else {
          this.$Message.error("新增备注失败！");
        }
      });
    },
    handleAllot() {
      this.work = {};
      this.work.workOrderId = this.workForm.id;
      this.work.enginnerGroup = this.workForm.acceptGroupId;
      this.status = "Allot";
      this.engineerModal = true;
      this.engineerTitle = "分配工单";
    },
    handleDispose() {
      // console.log("处理");
      this.$Modal.confirm({
        title: "是否受理",
        content: "是否受理此工单？",
        onOk: () => {
          disposeWork({ id: this.workForm.id }).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("受理工单成功");
              this.getOrderInfo();
            } else {
              this.$Message.error("受理工单失败");
            }
          });
        }
      });
    },
    handleTransfer() {
      // console.log("转交");
      this.work = {};
      this.work.workOrderId = this.workForm.id;
      this.work.enginnerGroup = this.workForm.acceptGroupId;
      this.status = "Transfer";
      this.engineerModal = true;
      this.modalTitle = "转交工单";
    },
    handleFinish() {
      // console.log("完成");
      this.$Modal.confirm({
        title: "是否已完成",
        content: "此工单是否已经完成？",
        onOk: () => {
          finishedWork({ id: this.workForm.id }).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("状态变更成功");
              this.$router.push({ name: "workList" });
            } else {
              this.$Message.error("状态变更失败");
            }
          });
        }
      });
    },
    handleGoback() {
      // console.log("退回");
      this.$Modal.confirm({
        title: "是否退回",
        content: "是否要退回？",
        onOk: () => {
          gobackWork({ workOrderId: this.workForm.id }).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("工单退回成功");
              this.$router.go(-1);
            } else {
              this.$Message.error("工单退回失败");
            }
          });
        }
      });
    },
    handleClose() {
      // console.log("关闭");
      this.$Modal.confirm({
        title: "是否关闭",
        content: "是否要关闭？",
        onOk: () => {
          closeWork({ id: this.workForm.id }).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("状态变更成功");
            } else {
              this.$Message.error("状态变更失败");
            }
          });
        }
      });
    },
    handleDel() {
      this.$Modal.confirm({
        title: "是否删除",
        content: "是否要删除此工单？",
        onOk: () => {
          removeWork({ id: this.workForm.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success("删除工单成功！");
              this.$router.go(-1);
            } else {
              this.$Message.error("删除工单失败！");
            }
          });
        }
      });
    },
    handleEdit() {
      // console.log("编辑");
      if (this.edit) {
        this.edit = !this.edit;
      } else {
        this.workForm.feildsItem = JSON.stringify(this.customArr);
        // console.log(this.workForm);
        this.$Modal.confirm({
          title: "确认修改",
          content: "您确认要保存修改的工单？",
          onOk: () => {
            updateWorkOrder(this.workForm).then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$Message.success("工单修改成功！");
                this.$router.go(-1);
              } else {
                this.$Message.error("工单修改失败！");
              }
            });
          }
        });
      }
    },
    handleDelete(row, index) {
      this.$Modal.confirm({
        title: "删除备注",
        content: "您确认删除这条备注？",
        onOk: () => {
          removeRemark({ id: row.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success("删除备注成功！");
              this.getRemark();
            } else {
              this.$Message.error("删除备注失败！");
            }
          });
        }
      });
      // console.log(row, index);
    },
    /**
     * 验收报告上传成功回调
     */
    reportUpload(urls) {
      // console.log(urls);
      this.report.reportUrl = urls;
    },

    /**
     * 查看验收报告
     */
    downloadReport() {
      let url = this.report.reportUrl;
      getBlob(url).then(blob => {
        saveAs(blob);
      });
    },

    /**
     * 查看验收报告
     */
    getReport(id) {
      let obj = {};
      obj.wId = id;
      getReport(obj).then(res => {
        // console.log(res);
        if (res.code == 200) {
          if (res.result == null) {
            this.isResport = true;
            this.showDownloadReport = false;
            this.showUploadReport = true;
          } else {
            this.isResport = false;
            this.report = res.result;
            this.showDownloadReport = true;
            this.showUploadReport = false;
          }
        }
      });
    },
    /**
     * 验收报告提交
     */
    handleReport() {
      this.report.workOrderId = this.workForm.id;
      // console.log(this.report);
      this.$refs.report.validate(valid => {
        if (valid) {
          addReport(this.report).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success(res.message);
              this.getOrderInfo();
            } else {
              this.$Message.error(res.message);
            }
          });
        }
      });
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getListFlow();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getListFlow();
    }
  }
};
</script>
<style lang="scss" scoped>
.work-details {
  width: 100%;
  height: 100%;
  .card {
    width: 100%;
    height: 100%;
    padding: 16px;
    .work-order-content {
      height: calc(100vh - 300px);
      overflow: auto;
    }
    .header {
      margin-bottom: 10px;
      .btn-group {
        button {
          margin-right: 10px;
        }
      }
      .info {
        display: flex;
        align-items: flex-end;
        .work-title {
          font-size: 16px;
          font-weight: bold;
          margin-right: 40px;
          line-height: 16px;
        }
        .work-company {
          font-size: 12px;
          line-height: 12px;
        }
      }
    }
    .content {
      .ivu-tabs-tabpane {
        padding: 10px;
        overflow: auto;
      }
      .action-log {
        border: 1px solid #dcdee2;
        .ivu-list-items {
          .ivu-list-item {
            padding: 8px 12px;
            .ivu-list-item-meta {
              flex: none;
            }
          }
          .log {
            margin-left: 60px;
          }
          .accessory {
            margin-left: 60px;
          }
        }
      }
    }
    .work-attribute {
      .ivu-form-item-content {
        .ivu-form-item {
          font-size: 12px;
          display: inline-block;
          min-width: 268px;
        }
      }
    }
    .content {
      height: 100%;
    }
    .ivu-tabs {
      height: 100%;
    }
    .ivu-tabs-content {
      height: 100%;
    }
  }
  .footer {
    margin-top: 2vh;
  }
}
</style>