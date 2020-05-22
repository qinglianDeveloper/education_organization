<!--
 * @Author: your name
 * @Date: 2019-12-06 19:55:22
 * @LastEditTime: 2020-04-27 22:58:18
 * @LastEditors: sueRimn
 * @Description: In User Settings Edit
 * @FilePath: \lwy_admin_web\src\components\staffMangerleft\add.vue
 -->
<template>
  <Modal v-model="addGroup" :width="600" :title="title" @on-cancel="handelSubmitGroup">
    <Form :model="groupForm" :label-width="140" :rules="groupFormRules">
      <FormItem label="父级团队" prop="father" v-if="title == '新增团队'">
        <Input v-model="groupForm.father" disabled />
      </FormItem>
      <FormItem label="团队名称" prop="team">
        <Input v-model="groupForm.team" />
      </FormItem>
      <FormItem label="团队类型">
        <RadioGroup v-if="active == 'market'" v-model="groupForm.type">
          <Radio label="SalesTeam">销售</Radio>
          <Radio label="TeleSalesTeam">电销</Radio>
        </RadioGroup>
        <RadioGroup v-else v-model="groupForm.status">
          <Radio label="ENABLE">有效</Radio>
          <Radio label="DISABLE">无效</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注">
        <Input v-model="groupForm.remark" type="textarea" placeholder="备注..." />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handelSubmitGroup">取消</Button>
      <Button type="primary" :loading="submitLoading" @click="addClick">提交</Button>
    </div>
  </Modal>
</template>
<script>
import {
  salesAdd,
  salesTeamUp,
  customerServiceSave,
  insertGroup,
  enineerUp
} from "@/api";
export default {
  data() {
    return {
      parentId: "",
      active: "",
      RadioList: [],
      title: "新增销售团队",
      types: "",
      txt: "",
      addGroup: false,
      groupForm: {
        status: "ENABLE",
        father: "",
        fatherId: 0,
        team: "",
        type: "SalesTeam",
        remark: "",
        level: ""
      },
      submitLoading: false,
      groupFormRules: {
        father: [
          { required: true, message: "父级团队不能为空", trigger: "blur" }
        ],
        team: [{ required: true, message: "团队名称不能为空", trigger: "blur" }]
      }
    };
  },
  props: ["show", "childrenData", "type"],
  watch: {
    show(newVal) {
      this.addGroup = newVal;
    },
    childrenData(newVal) {
      console.log("111", newVal);
      this.parentId = newVal.parentId;
      this.groupForm.level = newVal.level;
      this.groupForm.fatherId = newVal.label == null ? newVal.id : newVal.label;
      this.groupForm.father = newVal.title;
      if (this.type == "新增") {
        this.title = "新增团队";
        this.groupForm.team = "";
        this.groupForm.remark = "";
        this.groupForm.type = "SalesTeam";
        this.groupForm.status = "ENABLE";
      } else {
        this.title = "编辑团队";
        this.groupForm.team = this.childrenData.title;
        this.groupForm.remark = this.childrenData.remark;
        this.groupForm.type = this.childrenData.type;
        this.groupForm.status = this.childrenData.status;
      }
      this.types = this.type;
      // console.log("222", this.groupForm);
    }
    // type(newVal) {
    //   // console.log(newVal);
    //   if (newVal == "新增") {
    //     this.title = "新增团队";
    //     this.groupForm.team = "";
    //     this.groupForm.remark = "";
    //     this.groupForm.type = "SalesTeam";
    //   } else {
    //     this.title = "编辑团队";
    //     this.groupForm.team = this.childrenData.title;
    //     this.groupForm.remark = this.childrenData.remark;
    //     this.groupForm.type = this.childrenData.type;
    //   }
    //   this.types = newVal;
    // }
  },
  created() {
    this.modelShowFun();
  },
  methods: {
    modelShowFun() {
      this.active = sessionStorage.getItem("active");
      switch (this.active) {
        case "market":
          this.txt = "销售";
          break;
        case "engineer":
          this.txt = "工程师";
          break;
        case "service":
          this.txt = "客服";
          break;
        default:
          break;
      }
    },
    handelSubmitGroup() {
      this.$emit("handelSubmitGroup", false);
    },
    addClick() {
      console.log(this.groupForm);
      let active = sessionStorage.getItem("active");
      switch (active) {
        case "market":
          this.SaleAdd();
          break;
        case "engineer":
          this._insertGroup();
          break;
        case "service":
          this.serviceSave();
          break;

        default:
          break;
      }
    },
    // 销售新增修改
    SaleAdd() {
      if (this.types == "新增") {
        let obj = {
          parentId: this.groupForm.fatherId,
          teamName: this.groupForm.team,
          type: this.groupForm.type,
          remark: this.groupForm.remark,
          level: parseInt(this.groupForm.level) + 1
        };
        salesAdd(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success("添加成功");
            this.$emit("salesAdd", false);
            this.$emit("Team");
            this.groupForm = {};
            this.groupForm.classTeam = "销售";
            obj = {};
          }
        });
      } else {
        let obj = {
          id: this.groupForm.fatherId,
          teamName: this.groupForm.team,
          type: this.groupForm.type,
          remark: this.groupForm.remark
        };
        salesTeamUp(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success("修改成功");
            this.$emit("salesAdd", false);
            this.$emit("Team");
            this.groupForm = {};
            this.groupForm.classTeam = "销售";
            obj = {};
          }
        });
      }
    },
    // 客服新增修改
    serviceSave() {
      console.log(this.groupForm);
      let pid = this.parentId == undefined ? "-1" : this.parentId;
      let obj = {
        id: this.types == "编辑" ? this.groupForm.fatherId : "",
        groupName: this.groupForm.team,
        parentId: this.types == "新增" ? this.groupForm.fatherId : pid,
        type: "",
        status: this.groupForm.status,
        remark: this.groupForm.remark
      };
      customerServiceSave(obj).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.$emit("salesAdd", false);
          this.groupForm = {};
          obj = {};
        }
      });
    },

    _insertGroup() {
      if (this.types == "新增") {
        let obj = {
          parentId: this.groupForm.fatherId,
          groupName: this.groupForm.team,
          status: this.groupForm.status,
          remark: this.groupForm.remark,
          level: parseInt(this.groupForm.level) + 1
        };
        insertGroup(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("salesAdd", false);
            this.groupForm = {};
            obj = {};
          }
        });
      } else {
        let obj = {
          parentId: this.parentId == undefined ? 1 : this.parentId,
          id: this.groupForm.fatherId,
          groupName: this.groupForm.team,
          groupType: "",
          status: this.groupForm.status,
          remark: this.groupForm.remark,
          level: this.groupForm.level
        };
        enineerUp(obj).then(res => {
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.$emit("salesAdd", false);
            this.groupForm = {};
            obj = {};
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>