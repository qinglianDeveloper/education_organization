<template>
  <div>
    <Modal
      v-model="addCoopeStatus"
      :title="addCoopeTitle"
      :width="700"
      class="box"
      :styles="{top: '30px'}"
      class-name="modal_box"
      :closable="false"
      :mask-closable="false"
    >
      <div :style="{height:scrollHeight+'px',overflow: 'auto'}">
        <!-- 基本信息 -->
        <Form
          ref="formItem"
          class="formInfo"
          :model="formItem"
          :label-width="80"
          label-position="left"
          :rules="ruleValidate"
        >
          <div style="display: flex;justify-content: space-between;">
            <FormItem label prop="followType" :label-width="10">
              <Select
                placeholder="请选择跟进类型"
                v-model="formItem.followType"
                style="width: 150px;"
                :disabled="typeName=='BO'&&!nameDiff||typeName=='Clue'&&!nameDiff||typeName=='Customer'&&!nameDiff"
              >
                <Option
                  v-for="item in cooperTypeList"
                  :key="item.value"
                  :value="item.value"
                  @click.native="selectCoopType(item.label)"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
            <FormItem label prop="followMethod" :label-width="10">
              <Select v-model="formItem.followMethod" style="width: 150px;" placeholder="请选择跟进方式">
                <Option
                  v-for="item in methodsList"
                  :key="item.value"
                  :value="item.value"
                  @click.native="selectMethods(item.label)"
                >{{item.value}}</Option>
              </Select>
            </FormItem>

            <FormItem label prop="followTime" :label-width="10">
              <DatePicker
                @on-change="selectDate"
                v-model="formItem.followTime"
                type="datetime"
                placeholder="选择日期"
                style="width: 190px"
              ></DatePicker>
            </FormItem>
          </div>

          <div style="margin-top: -22px;">
            <FormItem label prop="followContent" :label-width="10">
              <div style="width: 100%;position: relative;">
                <Input
                  :maxlength="200"
                  type="textarea"
                  v-model="formItem.followContent"
                  placeholder="勤跟进,多签单"
                  :rows="4"
                ></Input>
                <span
                  class="val_length"
                >{{formItem.followContent?formItem.followContent.length + " / 200":"0/200"}}</span>
              </div>
            </FormItem>
          </div>
          <FormItem label="跟进对象:" prop="followTargetName" :label-width="80" class="namegroup">
            <Input
              :disabled="typeName=='BO'&&!nameDiff||typeName=='Clue'&&!nameDiff||typeName=='Customer'&&!nameDiff"
              class="one"
              search
              v-model="formItem.followTargetName"
              placeholder="请输入对应客户"
              @on-change="searchCustom"
              @on-search="searchName"
            ></Input>

            <div class="name" v-show="nameStatus" style="max-height: 200px;overflow: auto;">
              <template v-for="(item,index) in findNameArr">
                <span
                  v-if="findNameArr&&findNameArr.length>0"
                  :key="index"
                  class="name-i"
                  @click="clickName(item)"
                >{{isModuleStatus=='BoFU'?item.title:isModuleStatus=='ClueFU'?item.customerName:isModuleStatus=='CustomerFU'?item.name:''}}</span>
              </template>

              <span v-if="!findNameArr||findNameArr.length<1" class="name-ii">暂无数据</span>
            </div>
          </FormItem>

          <FormItem
            label="联系人:"
            :label-width="80"
            v-if="typeName!='Clue'&& isModuleStatus != 'ClueFU'"
          >
            <!-- 表格 -->
            <con-table
              ref="contactTPage"
              :cusFollowTable="cusFollowTable"
              :typeName="typeName"
              @selectColumn="selectColumn"
              @addContactOk="addContactOk"
            ></con-table>
            <!-- 表格 -->
          </FormItem>

          <!-- <FormItem label="所属阶段:" prop="select3" :label-width="80">
            <Select v-model="formItem.select3" style="width: 200px;">
              <Option v-for="item in select3" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>-->

          <FormItem
            label="附件:"
            prop="annexNames"
            :label-width="80"
            v-if="typeName!='Clue'&& isModuleStatus != 'ClueFU'"
          >
            <Button @click="clickUpload">上传附件</Button>
            <div class="upLoad">
              <template v-for="item in annexBox">
                <div :key="item.annexId" class="one">
                  <span>{{item.annexName}}</span>
                  <span class="right" @click="annexCancel(item)">删除</span>
                </div>
              </template>
            </div>
          </FormItem>

          <!-- <div style="margin-left: 20px;">
            <Checkbox v-model="single" @on-change="changeBox">新建下次跟进任务:</Checkbox>
          </div>-->

          <div v-show="boxStatus">
            <FormItem label="跟进时间:" prop="date2" :label-width="80">
              <DatePicker
                v-model="formItem.date2"
                @on-change="selectDate2"
                type="date"
                placeholder="选择日期"
                style="width: 200px"
              ></DatePicker>
            </FormItem>

            <FormItem label="跟进内容:" prop="textarea2" :label-width="80">
              <div style="width: 100%;position: relative;">
                <Input
                  :maxlength="200"
                  :rows="4"
                  type="textarea"
                  v-model="formItem.textarea2"
                  placeholder="请输入跟进内容"
                ></Input>
                <span
                  class="val_length"
                >{{formItem.textarea2?formItem.textarea2.length + " / 200":"0/200"}}</span>
              </div>
            </FormItem>

            <FormItem label="跟进提醒:" prop="select4" :label-width="80">
              <Select v-model="formItem.select4" style="width: 200px;">
                <Option v-for="item in select4" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>

            <FormItem label="提醒方式:" prop="fruit" :label-width="80">
              <CheckboxGroup v-model="formItem.fruit">
                <Checkbox label="钉钉提醒"></Checkbox>
                <Checkbox label="短信提醒"></Checkbox>
                <Checkbox label="邮件提醒"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </div>
        </Form>
        <!-- 基本信息 -->
      </div>

      <!-- 附件弹框 -->
      <EditEnclosure
        ref="enclosureName"
        editEnclosureTitle="新增附件"
        :annexTargetId="formItem.followTargetId"
        :name="typeName"
        :isModuleStatus="isModuleStatus"
        :relationTargetType="typeName"
        :editEnclosureStatus="editEnclosureStatus"
        @editEnclosureCancel="editEnclosureCancel"
        @editEnclosureOk="editEnclosureOk"
      ></EditEnclosure>
      <!-- 附件弹框 -->

      <div slot="footer">
        <Button @click="bCancel">取消</Button>
        <Button type="primary" @click="save">确认保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import ConTable from "@/components/clientList/conTable.vue"; //公共表格
import EditEnclosure from "@/components/clientList/editEnclosure"; //附件弹框
// import {
//   getCustomerContact,
//   getCustomerSearchPermit,
//   getClueSearch,
//   getBusinessSearch,
//   getFollowDetail,
//   getBusinessContact,
//   postBusinessContact,
//   postAddCusContact
// } from "@/api/index";
// import axios from "axios";
// import { setTimeout } from "timers";
export default {
  props: ["addCoopeStatus", "addCoopeTitle", "typeName", "nameDiff"],
  components: {
    ConTable,
    EditEnclosure
  },
  data() {
    return {
      isModuleStatus: "",
      annexBox: [],
      editEnclosureStatus: false,
      cusFollowTable: [],
      findNameArr: [],
      nameStatus: false,
      scrollHeight: 0,
      single: "", //新建下次跟进任务状态
      boxStatus: false, //新建下次跟进任务是否展开
      depModalVisible: false,
      depModalVisible2: false,
      depModalVisible3: false,
      animal: "",
      cooperTypeList: [
        {
          value: "线索跟进",
          label: "Clue"
        },
        {
          value: "客户跟进",
          label: "Customer"
        },
        {
          value: "商机跟进",
          label: "BO"
        }
      ],
      methodsList: [
        {
          value: "邮件",
          label: "Email"
        },
        {
          value: "电话",
          label: "Phone"
        },
        {
          value: "QQ",
          label: "QQ"
        },
        {
          value: "上门拜访",
          label: "Visit"
        },
        {
          value: "微信",
          label: "WeChat"
        },
        {
          value: "钉钉",
          label: "DingDing"
        },
        {
          value: "客户来访",
          label: "CustomerVisited"
        },
        {
          value: "其他",
          label: "Other"
        }
      ],

      select4: [
        {
          value: "准时提醒",
          label: "准时提醒"
        },
        {
          value: "提前5分钟",
          label: "提前5分钟"
        },
        {
          value: "提前15分钟",
          label: "提前15分钟"
        },
        {
          value: "提前30分钟",
          label: "提前30分钟"
        },
        {
          value: "提前1小时",
          label: "提前1小时"
        },
        {
          value: "提前2小时",
          label: "提前2小时"
        },
        {
          value: "提前1天",
          label: "提前1天"
        }
      ],
      // 表单验证
      ruleValidate: {
        followType: [
          {
            required: true,
            message: "跟进类型不能为空",
            trigger: "blur"
          }
        ],
        followTargetName: [
          {
            required: true,
            message: "跟进对象不能为空",
            trigger: "blur"
          }
        ],
        followMethod: [
          {
            required: true,
            message: "跟进方式不能为空",
            trigger: "blur"
          }
        ],
        followTime: [
          {
            required: true,
            message: "跟进时间不能为空",
            trigger: "blur"
          }
        ],
        followContent: [
          {
            required: true,
            message: "跟进内容不能为空",
            trigger: "blur"
          }
        ]
      },
      //   表单字段
      formItem: {
        followType: "",
        followMethod: "",
        followTime: "",
        followContent: "",
        followTargetName: "",
        annexNames: ""
      },

      searchForm: {
        pageNumber: 1,
        pageSize: 10
      }
    };
  },
  computed: {},
  created() {
    this.init();
    if (this.typeName == "BO") {
      this.formItem.followType = "商机跟进";
    } else if (this.typeName == "Customer") {
      this.formItem.followType = "客户跟进";
    } else if (this.typeName == "Clue") {
      this.formItem.followType = "线索跟进";
    }
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
    // 附件删除
    annexCancel(val) {
      let index = this.annexBox.findIndex(v => v.annexId == val.annexId);
      this.annexBox.splice(index, 1);
    },
    // 新增跟进--点击上传附件
    clickUpload() {
      this.editEnclosureStatus = true;
      this.$refs.enclosureName.getEnclosureParams();
    },
    editEnclosureCancel() {
      this.editEnclosureStatus = false;
    },
    editEnclosureOk(formData) {
      this.editEnclosureStatus = false;
      // value.relationTargetType = "Customer";
      // value.relationTargetId = this.$route.params.id;

      // this.getAddEnclosureList(value);

      let config = {
        headers: {
          "Content-Type":
            "multipart/form-data;boundary = " + new Date().getTime()
        }
      };

      let postUrl;
      if (location.href.indexOf("47.96.93.191") > -1) {
        postUrl = `http://47.96.93.191:8868/admin/cmc/annex/save`;
      } else {
        postUrl = `/admin/cmc/annex/save`;
      }

      axios
        .post(postUrl, formData, config)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.annexBox.push(res.result);
            this.$Message.success("新增附件成功");
          }
        })
        .catch(e => {
          this.$Message.success("新增附件失败");
          console.log(e);
        });
    },
    // 数据--获取客户关联的联系人列表
    getCusContactList(value) {
      getCustomerContact({ customerId: value }).then(res => {
        if (res.code == 200) {
          res.result.map(item => {
            item.check = false;
          });
          this.cusFollowTable = res.result;
        }
      });
    },

    // 数据--新增客户联系人
    getAddCusContact(value) {
      postAddCusContact(value).then(res => {
        if (res.code == 200) {
          this.$Message.success("新增联系人成功");
          this.getCusContactList(this.formItem.followTargetId);
        }
      });
    },

    // 数据--商机联系人列表
    getBusContact(value, id) {
      getBusinessContact({ boId: value }).then(res => {
        if (res.code == 200) {
          res.result.map(item => {
            item.check = false;
          });
          this.cusFollowTable = res.result;

          if (id) {
            // console.log('this.cusFollowTable')
            // console.log(id)
            // console.log(this.cusFollowTable)
            this.cusFollowTable.find(v => v.contactId == id).check = true;
          }
        }
      });
    },

    // 数据--新增商机联系人
    getAddBusContact(value) {
      postBusinessContact(value).then(res => {
        if (res.code == 200) {
          this.$Message.success("新增联系人成功");
          this.getBusContact(this.formItem.followTargetId);
        }
      });
    },

    // 新增联系人
    addContactOk(value) {
      if (this.typeName == "BO") {
        if (this.$route.params.id) {
          value.boId = this.$route.params.id;
        } else {
          value.boId = this.formItem.followTargetId;
        }
        this.getAddBusContact(value);
      } else if (this.typeName == "Customer") {
        if (this.$route.params.id) {
          value.customerId = this.$route.params.id;
        } else {
          value.customerId = this.formItem.followTargetId;
        }
        this.getAddCusContact(value);
      } else if (this.typeName == "Clue") {
        delete value.isDefault;
      }
    },

    // 选择拜访方式
    selectMethods(v) {
      this.methodsName = v;
    },

    // 父级新增跟进(客户，线索，商机)
    getCusFollowParams(value, name) {
      if (this.typeName != "Clue") {
        this.$refs.contactTPage.getClearParams();
      }

      this.$refs.formItem.resetFields();
      this.cusFollowTable = [];
      if (this.formItem.contactId) {
        delete this.formItem.contactId;
      }
      if (this.formItem.contactName) {
        delete this.formItem.contactName;
      }
      this.annexBox = [];
      this.formItem.followTargetId = value.id;

      this.editCooperId = "";
      console.log(value);
      // 模块关联联系人
      console.log(name);
      if (name == "Customer") {
        this.getCusContactList(value.id);
        this.formItem.followTargetName = value.name;
      } else if (name == "BO") {
        this.getBusContact(value.id);
        this.formItem.followTargetName = value.name;
      } else if (name == "Clue") {
        this.formItem.followTargetName = value.name;
      }
    },

    // 父级点击新增跟进--跟进页面
    getCooperFollowParams() {
      this.$refs.contactTPage.getClearParams();
      this.cusFollowTable = [];
      if (this.formItem.contactId) {
        delete this.formItem.contactId;
      }
      if (this.formItem.contactName) {
        delete this.formItem.contactName;
      }
      this.annexBox = [];

      this.editCooperId = "";
      this.isModuleStatus = "";
      this.$refs.formItem.resetFields();
    },
    selectCoopType(code) {
      let { followType } = this.formItem;
      if (followType == "线索跟进") {
        this.isModuleStatus = "ClueFU";
      } else if (followType == "客户跟进") {
        this.isModuleStatus = "CustomerFU";
      } else if (followType == "商机跟进") {
        this.isModuleStatus = "BoFU";
      }

      this.$emit("selectCoopType", code);
    },

    // 父级点击编辑跟进--跟进页面
    getEditCooperParams(value) {
      this.methodsName = "";
      getFollowDetail({ ids: value.id }).then(res => {
        if (res.code == 200) {
          let {
            followType,
            followMethod,
            followTime,
            followContent,
            followTargetName,
            id,
            followTargetId,
            annexIds,
            annexNames,
            contactName,
            contactId
          } = res.result;
          this.editCooperId = id;
          // 跟进类型和联系人接口
          if (followType == "CustomerFU") {
            this.formItem.followType = "客户跟进";
            this.getCusContactList(id);
          } else if (followType == "BoFU") {
            this.formItem.followType = "商机跟进";
            this.getBusContact(followTargetId, contactId);
          } else if (followType == "ClueFU") {
            this.formItem.followType = "线索跟进";
          }
          // 跟进方式
          if (followMethod) {
            this.formItem.followMethod = followMethod;
          }
          // 跟进时间
          if (followTime) {
            this.formItem.followTime = followTime;
          }
          // 跟进内容
          if (followContent) {
            this.formItem.followContent = followContent;
          }
          // 跟进对象名称
          if (followTargetName) {
            this.formItem.followTargetName = followTargetName;
          }
          // 联系人
          let contactArr = [];
          if (contactName && contactId) {
            contactArr.push({
              name: contactName,
              contactId: contactId,
              id,
              check: true
            });
            // console.log('this.cusFollowTable')
            // console.log(this.cusFollowTable)

            // this.$set(contactArr, 0, {
            //   name: contactName,
            //   contactId: contactId,
            //   check: true
            // });
          }

          this.$refs.contactTPage.getEditParams(contactArr);

          this.formItem.contactName = contactName;
          this.formItem.contactId = contactId;

          // 附件
          let arr = [];
          let arrName = [];
          let arrId = [];
          if (annexNames) {
            arrName = annexNames.split(",");
          }
          if (annexIds) {
            arrId = annexIds.split(",");
          }
          arrId.forEach((item, index) => {
            let obj = {
              annexId: item,
              annexName: arrName[index]
            };
            arr.push(obj);
          });
          this.annexBox = arr;

          this.formItem.followTargetId = followTargetId;
        }
      });
    },

    // 搜索对应客户
    searchCustom(v) {
      if (!this.formItem.followTargetName) {
        this.nameStatus = false;
      }
    },
    // 搜索客户名称
    searchName() {
      if (!this.isModuleStatus) {
        this.$Message.error("请先选择跟进类型");
        return;
      }

      if (this.formItem.followTargetName) {
        this.nameStatus = true;
      }

      if (this.isModuleStatus == "CustomerFU") {
        this.searchForm.searchType = "ALL";
        this.searchForm.name = this.formItem.followTargetName;
        getCustomerSearchPermit(this.searchForm).then(res => {
          this.findNameArr = res.content;
        });
      } else if (this.isModuleStatus == "ClueFU") {
        getClueSearch({ keyword: this.formItem.followTargetName }).then(res => {
          this.findNameArr = res.result;
        });
      } else if (this.isModuleStatus == "BoFU") {
        getBusinessSearch({ title: this.formItem.followTargetName }).then(
          res => {
            this.findNameArr = res.result;
          }
        );
      }
    },
    // 点击客户名称
    clickName(item) {
      this.nameStatus = false;
      this.formItem.followTargetName =
        this.isModuleStatus == "BoFU"
          ? item.title
          : this.isModuleStatus == "ClueFU"
          ? item.customerName
          : this.isModuleStatus == "CustomerFU"
          ? item.name
          : "";
      this.formItem.followTargetId = item.id;

      if (this.isModuleStatus == "CustomerFU") {
        this.getCusContactList(item.id);
      } else if (this.isModuleStatus == "BoFU") {
        this.getBusContact(item.id);
      }
    },
    // 选择时间
    selectDate(v) {
      this.formItem.followTime = v;
    },
    selectDate2(v) {
      this.formItem.date2 = v;
    },
    // 新建下次跟进任务
    changeBox() {
      if (this.single) {
        this.boxStatus = true;
      } else {
        this.boxStatus = false;
      }
    },
    // 表格选中项
    selectColumn(value) {
      console.log(value);

      if (value && value.length > 0) {
        if (!this.cusFollowTable.length || this.cusFollowTable.length <= 0)
          return;
        this.cusFollowTable.map(v => {
          v.check = false;
          return v;
        });

        this.cusFollowTable.find(v => v.id == value[0].id).check = true;
        if (this.typeName == "Customer") {
          this.formItem.contactName = value[0].contactName;
          this.formItem.contactId = value[0].contactId;
        } else if (this.typeName == "BO") {
          this.formItem.contactName = value[0].name;
          this.formItem.contactId = value[0].contactId;
        }
      } else {
        this.formItem.contactName = "";
        this.formItem.contactId = "";
      }
    },

    // 点击取消
    bCancel() {
      this.$emit("coopeCancel");
    },
    // 点击确认保存
    save() {
      let newForm = JSON.parse(JSON.stringify(this.formItem));
      let { followMethod } = this.formItem;

      if (this.editCooperId) {
        newForm.id = this.editCooperId;
      }

      if (this.typeName == "Customer") {
        newForm.followType = "CustomerFU";
      } else if (this.typeName == "Clue") {
        newForm.followType = "ClueFU";
      } else if (this.typeName == "BO") {
        newForm.followType = "BoFU";
      }

      if (followMethod) {
        let methodList = [
          { name: "邮件", code: "Email" },
          { name: "电话", code: "Phone" },
          { name: "QQ", code: "QQ" },
          { name: "上门拜访", code: "Visit" },
          { name: "微信", code: "WeChat" },
          { name: "钉钉", code: "DingDing" },
          { name: "客户来访", code: "CustomerVisited" },
          { name: "其他", code: "Other" }
        ];
        let index = methodList.findIndex(v => v.name == followMethod);
        newForm.followMethod = methodList[index].code;
      }

      // 附件
      let ananxName = [];
      let ananxId = [];
      this.annexBox.map(item => {
        ananxName.push(item.annexName);
        ananxId.push(item.annexId);
      });
      newForm.annexNames = ananxName.join(",");
      newForm.annexIds = ananxId.join(",");
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.$emit("coopeSave", newForm);
        } else {
          // this.$Message.error('*号为必填内容');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid rgb(239, 239, 239);
  margin-bottom: 20px;
  .info-header-txt {
    font-size: 14px;
  }
  .info-header-i {
    display: flex;
    align-self: flex-end;
    font-size: 16px;
  }
}
.contacts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-top: 1px solid rgb(239, 239, 239);
  border-bottom: 1px solid rgb(239, 239, 239);
  margin: 20px 0;
  .info-header-txt {
    font-size: 14px;
  }
  .info-header-i {
    display: flex;
    align-self: flex-end;
    font-size: 16px;
  }
}
// 表格
.formInfo {
  padding-right: 50px;
  .upLoad {
    background: rgb(246, 246, 246);
    padding: 0 15px;
    margin-top: 10px;
    .one {
      display: flex;
      justify-content: space-between;
      .right {
        color: rgb(68, 58, 236);
      }
    }
  }

  .managebox {
    border: 1px solid rgb(212, 214, 218);
    height: 35px;
    background: white;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding-right: 25px;
    color: rgb(105, 105, 105);
    .managebox-i {
      padding: 0 5px;
      height: 25px;
      line-height: 25px;
      background: rgb(242, 242, 242);
      border: 1px solid rgb(230, 230, 230);
      border-radius: 3px;
      margin-left: 8px;
      .manage-cancel {
        font-size: 16px;
        padding-left: 8px;
        cursor: pointer;
      }
    }
    .default {
      padding: 0 90px 0 10px;
      display: inline-block;
      color: rgb(191, 193, 200);
    }
  }
}

.ivu-form-item {
  margin: 22px !important;
}

.ivu-modal-body {
  padding: 0;
}

.ivu-modal-footer {
  margin-top: 20px;
}
.namegroup {
  .one {
    width: 300px;
  }
  .name {
    width: 300px;
    border: 1px solid rgb(212, 214, 218);
    display: flex;
    flex-direction: column;
    .name-i {
      padding: 0 5px;
      display: inline-block;
      cursor: pointer;
    }
    .name-ii {
      text-align: center;
      display: inline-block;
      cursor: pointer;
    }
  }
}

.val_length {
  position: absolute;
  right: 5%;
  bottom: 3%;
  color: rgb(185, 188, 194);
}
</style>
