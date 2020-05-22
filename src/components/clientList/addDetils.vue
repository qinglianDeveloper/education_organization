<template>
  <Modal v-model="saveShow" width="800" @on-cancel="cancel">
    <div slot="header" class="model-top">{{addEtidTitle}}{{ tabTitle }}关联</div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <Row :gutter="24">
        <Col span="14">
          <div class="select-box">
            <FormItem :label="'新建'+ tabTitle" prop="name">
              <Input
                v-model="formValidate.name"
                :placeholder="placeholder"
                @input="changeInput"
                @on-change="remoteMethod"
              >
                <Icon type="ios-search" slot="suffix" />
              </Input>
              <div v-if="oprionsLength == 0" style="color:red;">{{ txt }}</div>
              <ul class="ul" v-else-if="oprionsLength == 1">
                <li
                  v-for="(item,index) in options"
                  :key="index"
                  @click="itemBtn(item)"
                >{{ item.name || item.account }}</li>
              </ul>
            </FormItem>
          </div>
        </Col>
        <Col span="10">
          <a v-if="tabTitle == '联系人'" href="javascript:;" @click="GocantactAdd">不存在?去增加联系人</a>
          <a v-else href="javascript:;" @click="userAdd">不存在?去增加账号</a>
        </Col>
      </Row>
      <Row :gutter="24" v-if="tabTitle == '联系人'">
        <Col span="12">
          <FormItem label="部门">
            <Input v-model="formValidate.department" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="职务">
            <Input v-model="formValidate.position" />
          </FormItem>
        </Col>
      </Row>
      <FormItem label="客户">
        <Select v-model="formValidate.customerId">
          <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="备注" v-if="tabTitle == '联系人'">
        <Input type="textarea" v-model="formValidate.remark" />
      </FormItem>
      <FormItem label="默认联系人" v-if="tabTitle == '联系人'">
        <Checkbox v-model="Default" @on-change="CheckboxChange"></Checkbox>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="config">提交</Button>
      <Button @click="cancelClick">取消</Button>
    </div>
    <cantactAdd :cantactAddShow="cantactAddShow" @cancelBtn="cancelBtn" @Submission="Submission" />
    <accountModels :modelShow="userShow" @configOK="configOK" @cancelModel="cancelModel" />
  </Modal>
</template>
<script>
import {
  contactGetList,
  getAddCustomer,
  customerContactSave,
  accountListAccountChoose,
  customeraccountsave
} from "@/api";
import cantactAdd from "@/components/clientList/ContactAdd";
import accountModels from "@/components/clientList/accountModel";
export default {
  components: { cantactAdd, accountModels },
  data() {
    return {
      Default:false,
      oprionsLength: 2,
      txt: "没有查询到相关联系人，请点击去增加联系人",
      placeholder: "请输入搜索相关联系人",
      userShow: false,
      tabTitle: "",
      userList: [],
      cantactAddShow: false,
      name: "",
      saveShow: false,
      loading: false,
      options: [],
      ruleValidate: {
        name: [
          {
            required: true,
            message: "新建联系人不能为空",
            trigger: "blur"
          }
        ]
      },
      formValidate: {
        name: "",
        customerId: "",
        contactId: "",
        isDefault: 0,
        department: "",
        position: "",
        telephone: "",
        remark: ""
      },
      cityList: []
    };
  },
  props: ["DetilsAddShow", "etidRow", "addEtidTitle", "addTitle"],
  watch: {
    DetilsAddShow(newVal) {
      this.saveShow = newVal;
    },
    addTitle(val) {
      this.tabTitle = val;
    },
    etidRow(val) {
      this.formValidate.id = val.id;
      this.formValidate.contactId = val.contactId;
      this.formValidate.customerId = val.customerId;
      this.formValidate.department = val.department;
      this.formValidate.position = val.position;
      this.formValidate.remark = val.remark;
    },
    addEtidTitle(val) {
      val == "新增"
        ? (this.formValidate.id = "")
        : (this.formValidate = this.formValidate);
      val == "新增"
        ? (this.formValidate.customerId = "")
        : (this.formValidate = this.formValidate);
    }
  },
  created() {
    this._getCustomer();
  },
  methods: {
    CheckboxChange(e) {
      console.log(e)
      e == true
        ? (this.formValidate.isDefault = 1)
        : (this.formValidate.isDefault = 0);
    },
    // 客户添加
    userAdd() {
      this.userShow = true;
    },
    configOK(e) {
      this.userShow = e;
    },
    cancelModel(e) {
      this.userShow = e;
    },
    _getCustomer() {
      getAddCustomer().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let obj = { value: item.id, label: item.name };
            this.userList.push(obj);
            return this.userList;
          });
        }
      });
    },
    remote(result) {
      if (result == null) {
        this.oprionsLength = 0;
      } else {
        this.options = result;
        this.oprionsLength = 1;
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        if (this.addTitle == "联系人") {
          let obj = { name: query.data };
          contactGetList(obj).then(res => {
            let list = [];
            if (res.code == 200) {
              this.remote(res.result);
            }
          });
        } else {
          let obj = { account: query.data };
          accountListAccountChoose(obj).then(res => {
            if (res.code == 200) {
              this.txt = "没有查询到相关客户，请点击去增加客户";
              this.remote(res.result);
            }
          });
        }
      }
    },
    itemBtn(item) {
      this.formValidate.contactId = item.id;
      this.formValidate.name = item.name || item.account;
      this.options = [];
      this.oprionsLength = 2;
    },
    changeInput(e) {
      if (e.length == 0) {
        this.oprionsLength = 2;
        this.options = [];
      }
    },
    GocantactAdd() {
      this.cantactAddShow = true;
    },
    cancelBtn(e) {
      this.cantactAddShow = e;
    },
    Submission(e) {
      this.cantactAddShow = e;
    },
    config() {
      if (this.addTitle == "联系人") {
        customerContactSave(this.formValidate).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("config", false);
          } else {
            this.$Message.error(res.message);
          }
        });
      } else {
        let obj = {
          accountId: this.formValidate.contactId,
          customerId: this.formValidate.customerId,
          customerName: this.formValidate.name
        };
        customeraccountsave(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("config", false);
          } else {
            this.$Message.error(res.message);
          }
        });
      }
    },
    cancelClick() {
      this.$emit("cancelClick", false);
    },
    cancel() {
      this.$emit("cancelClick", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.model-top {
  font-size: 24px;
  font-weight: 600;
}
.select-box {
  position: relative;
  .ul::-webkit-scrollbar {
    display: none;
  }
  .ul {
    position: absolute;
    background: #fff;
    width: 100%;
    max-height: 100px;
    overflow: hidden;
    overflow: auto;
    z-index: 1;
    border: 1px solid #2d8cf0;
    border-radius: 4px;
    li {
      list-style-type: none;
      padding-left: 20px;
    }
    li:hover {
      background: #93c0f0;
      color: #fff;
    }
  }
}
</style>