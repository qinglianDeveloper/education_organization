<template>
  <div>
    <Modal v-model="addShow" :title="title" width="500" @on-cancel="cancel">
      <!-- 表单 -->
      <Form :label-width="100" :model="formData">
        <FormItem label="所属团队：">
          <Input disabled v-model="teamInfo.title" />
        </FormItem>
        <FormItem label="用户名称：">
          <Select v-model="formData.userId" :disabled="disabledEdit">
            <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="真实姓名：">
          <Input placeholder="请输入您的真实姓名" v-model="formData.name" />
        </FormItem>
        <FormItem label="是否为领导：">
          <RadioGroup v-model="formData.isLeader">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="工程师级别：" v-if="active == 'engineer'">
          <RadioGroup v-model="formData.level">
            <Radio label="ADVANCED">高级</Radio>
            <Radio label="MIDDLE">中级</Radio>
            <Radio label="PRIMARY">初级</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="销售类型：" v-if="active == 'market'">
          <RadioGroup v-model="formData.salesType">
            <Radio label="Telesales">电销</Radio>
            <Radio label="DirectSales">直销</Radio>
            <Radio label="ChannelSales">渠道</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="销售级别：" v-if="active == 'market'">
          <RadioGroup v-model="formData.salesLevel">
            <Radio label="ADVANCED">高级</Radio>
            <Radio label="MIDDLE">中级</Radio>
            <Radio label="PRIMARY">初级</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="入职时间：" v-if="active == 'market'&&txt=='新增'">
          <DatePicker
            :disabled="disabledEdit"
            :value="date"
            format="yyyy-MM-dd"
            type="date"
            placeholder="Select date"
            @on-change="dateChange"
            v-model="formData.hireTime"
          ></DatePicker>
        </FormItem>
        <FormItem label="佳信用户名：" v-if="active == 'service'">
          <Input v-model="formData.jxUsername" />
        </FormItem>
        <FormItem label="佳信密码：" v-if="active == 'service'">
          <Input v-model="formData.jxPassword" type="password" />
        </FormItem>
        <FormItem label="备注：" v-if="active != 'service'">
          <Input type="textarea" v-model="formData.remark" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="handelSubmitGroup">取消</Button>
        <Button type="primary" @click="addClick">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  salesTeam,
  customerService,
  customerServiceAE,
  userGetList,
  salesSave,
  salesUpdate,
  listGroups,
  addEngineer,
  updateByEngineerId
} from "@/api";
import bus from "@/utils/bus";
import { StateTree } from "@/utils/current";
export default {
  data() {
    return {
      formData: {
        remark: ""
      },
      date: "",
      teamName: "",
      valueRadios: "YES",
      disabled: false,
      title: "新增人员",
      salesLevel: "ADVANCED",
      level: "ADVANCED",
      valueRadio: 1,
      editTxt: "",
      animal: "Telesales",
      salesName: "",
      modelCityList: "",
      userList: [],
      treeData: [],
      active: "",
      // value: "",
      addShow: false,
      formInline: {},
      disabledEdit: false
    };
  },
  props: ["salesModalVisible", "edit", "txt", "teamInfo"],
  watch: {
    salesModalVisible(newVal) {
      this.addShow = newVal;
      // console.log(this.txt);
      if (this.txt == "新增") {
        this.title = "新增人员";
        this.disabledEdit = false;
        this.formData = {};
      } else if (this.txt == "编辑") {
        this.title = "编辑人员";
        this.formData = this.edit;
        this.disabledEdit = true;
        // console.log(this.formData);
        if (this.formData.isLeader) {
          switch (this.formData.isLeader) {
            case "是":
              this.formData.isLeader = 1;
              break;
            case "否":
              this.formData.isLeader = 0;
              break;
          }
        }
        if (this.formData.salesLevel) {
          switch (this.formData.salesLevel) {
            case "高级":
              this.formData.salesLevel = "ADVANCED";
              break;
            case "中级":
              this.formData.salesLevel = "MIDDLE";
              break;
            case "初级":
              this.formData.salesLevel = "PRIMARY";
              break;
          }
        }
        if (this.formData.level) {
          switch (this.formData.level) {
            case "高级":
              this.formData.level = "ADVANCED";
              break;
            case "中级":
              this.formData.level = "MIDDLE";
              break;
            case "初级":
              this.formData.level = "PRIMARY";
              break;
          }
        }
        if (this.formData.salesType) {
          switch (this.formData.salesType) {
            case "电销":
              this.formData.salesType = "Telesales";
              break;
            case "直销":
              this.formData.salesType = "DirectSales";
              break;
            case "渠道":
              this.formData.salesType = "ChannelSales";
              break;
          }
        }
      }
    }
  },
  created() {
    // this.dataFun();
  },
  mounted() {},
  methods: {
    dataFun() {
      this.active = sessionStorage.getItem("active");
      switch (this.active) {
        case "market":
          this._listByPage();
          break;
        case "service":
          this._listByPage();
          break;
        case "engineer":
          this._listByPage();
          break;
        default:
          break;
      }
    },
    handelSubmitGroup() {
      this.disabled = false;
      this.formInline = {};
      this.$emit("hideshow", false);
    },
    addClick() {
      this.serviceAdd();
      // this.treeData = [];
      // bus.$emit("AddUpdata", 1);
    },
    //获取userid
    _listByPage() {
      userGetList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let obj = { value: item.id, label: item.userName };
            this.userList.push(obj);
            return this.userList;
          });
        }
      });
    },
    serviceAdd() {
      switch (this.active) {
        case "service":
          this.saveService();
          break;
        case "market":
          this._salesChannelAdd();
          break;
        case "engineer":
          this._addEngineer();
          break;
        default:
          break;
      }
    },
    dateChange(e) {
      this.formData.hireTime = e;
      // console.log(e);
    },
    // 销售添加
    _salesChannelAdd() {
      let obj = this.formData;
      obj.salesTeamId = this.teamInfo.id;
      console.log(obj);
      if (this.txt == "新增") {
        salesSave(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success("添加成功");
            this.$emit("hideshow", false);
            bus.$emit("hideShow", false);
          }
        });
      } else {
        salesUpdate(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success("修改成功");
            this.$emit("hideshow", false);
            bus.$emit("hideShow", false);
          }
        });
      }
    },
    // 客服添加和修改
    saveService() {
      // let obj = {
      //   id: this.formInline.newid == undefined ? "" : this.formInline.newid,
      //   name: this.formInline.peopleName,
      //   userId: this.modelCityList,
      //   isLeader: this.valueRadio,
      //   groupId: this.formInline.id, // 团队id
      //   jxUsername: this.formInline.jiaxinUser, //佳信用名
      //   jxPassword: this.formInline.jiaxinPws //架信用户密码
      // };
      let obj = this.formData;
      obj.groupId = this.teamInfo.id;
      console.log(obj);
      customerServiceAE(obj).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          bus.$emit("updataTable", 1);
          this.$emit("hideshow", false);
          bus.$emit("hideShow", false);
        }
        this.treeData = [];
      });
    },
    // 工程师添加和修改
    _addEngineer() {
      let obj = this.formData;
      obj.groupId = this.teamInfo.id;
      if (this.txt == "新增") {
        addEngineer(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("hideshow", false);
            bus.$emit("hideShow", false);
          }
        });
      } else {
        updateByEngineerId(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("hideshow", false);
            bus.$emit("hideShow", false);
          }
        });
      }
    },
    cancel() {
      this.type = 1;
      this.disabled = false;
      this.formInline = {};
      this.$emit("hideshow", false);
    },
    // 点击展示树状列表
    async addState() {
      this.type = 2;
      if (this.treeData.length > 0) {
        return;
      }
      switch (this.active) {
        case "market":
          await salesTeam().then(res => {
            if (res.code == 200) {
              let arr = res.result;
              let obj = {};
              StateTree(arr, this.switch1, obj, this.treeData);
            }
          });
          break;
        case "service":
          await customerService().then(res => {
            if (res.code == 200) {
              let arr = res.result;
              let obj = {};
              StateTree(arr, this.switch1, obj, this.treeData);
            }
          });
          break;
        case "engineer":
          await listGroups().then(res => {
            if (res.code == 200) {
              let arr = res.result;
              let obj = {};
              StateTree(arr, this.switch1, obj, this.treeData);
            }
          });
          break;
        default:
          break;
      }
    },
    selectChange(row) {
      this.formInline.userId = row[0].userId;
      this.formInline.name = row[0].title;
      this.formInline.id = row[0].id == null ? row[0].label : row[0].id;
    }
  }
};
</script>
<style lang="scss" scoped>
.model-show {
  border: 1px solid #e8eaec;
  min-width: 100px;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>