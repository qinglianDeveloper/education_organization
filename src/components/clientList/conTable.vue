<template>
  <div class="contacts">
    <div>
      <span>已有联系人</span>
      <span @click="selectAdd" class="add">新增联系人</span>
    </div>

    <!-- 添加联系人弹框 -->
    <add-contacts
      ref="concactName"
      :typeName="typeName"
      :addContactTitle="addContactTitle"
      :addContactStatus="addContactStatus"
      @addContactOk="addContactOk"
      @addContactCancel="addContactCancel"
    ></add-contacts>
    <!-- 添加联系人弹框 -->

    <table>
      <tr>
        <th></th>
        <th>联系人</th>
        <th>部门</th>
        <th>职务</th>
        <th>电话号码</th>
      </tr>
      <template v-for="(item,index) in cusFollowTable">
        <tr :key="index">
          <td>
            <Checkbox v-model="item.check" @click.native="selectColumn(item)"></Checkbox>
          </td>
          <td>{{item.contactName?item.contactName:item.name?item.name:''}}</td>
          <td>{{item.department}}</td>
          <td>{{item.position}}</td>
          <td>{{item.mobilePhone}}</td>
        </tr>
      </template>
    </table>
    <div class="choose">
      <span>已选联系人：</span>
      <template v-for="(item,index) in checkArr">
        <span
          :key="index"
          class="select"
        >{{item.contactName?item.contactName:item.name?item.name:''}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import AddContacts from "@/components/clientList/addContacts"; //添加联系人弹框
// import { setTimeout } from "timers";
export default {
  props: ["cusFollowTable", "typeName"],
  components: {
    AddContacts
  },
  data() {
    return {
      animal: "已有联系人",
      addContactTitle: "",
      addContactStatus: false,
      isCheckStatus: false,
      checkArr: [],
      changename: ""
    };
  },

  methods: {
    // 父级新增事件
    getClearParams() {
      this.checkArr = [];
    },
    // 父级编辑事件
    getEditParams(value) {
      this.checkArr = value;
      // this.$nextTick(()=>{
      // this.checkArr.forEach(item =>{
      //   this.selectColumn(item);
      // })

      // if(this.cusFollowTable.length > 0){
      //   setTimeout(()=>{
      //   }, 100);
      // }
      // })
    },

    // 表格选中项
    selectColumn(value) {
      let index = this.cusFollowTable.findIndex(v => v.id == value.id);
      let checkArr = [];
      if (index > -1 && !value.check) {
        checkArr.push(this.cusFollowTable[index]);
      }
      this.checkArr = checkArr;

      this.$emit("selectColumn", this.checkArr);
    },

    // 点击新增联系人
    selectAdd() {
      this.changename = "新增联系人";
      this.addContactStatus = true;
      this.addContactTitle = "添加联系人";
      this.$refs.concactName.getParamsList();
    },
    addContactOk(value) {
      this.addContactStatus = false;
      this.$emit("addContactOk", value);
    },
    addContactCancel() {
      this.addContactStatus = false;
    }
  }
};
</script>

<style scoped lang="scss">
table {
  margin-top: 15px;
  width: 100%;
  border: 1px solid #e9eaec;
  border-collapse: collapse;
}

th {
  background-color: #f8f8f9;
}

th,
td {
  padding: 5px;
  border: 1px solid #e9eaec;
  text-align: center;
  vertical-align: top;
  line-height: 30px;
}

// 联系人
.contacts {
  padding: 0 60px 0 0;
  .add {
    cursor: pointer;
    padding-left: 15px;
    color: rgb(36, 117, 236);
  }
  .contacts-table {
    margin: 15px 0;
  }

  .choose {
    margin-top: 15px;
    .select {
      background: rgb(239, 239, 239);
      border-radius: 5px;
      font-size: 15px;
      padding: 3px 10px;
      margin-right: 9px;
      .one {
        cursor: pointer;
        padding-left: 3px;
        font-size: 13px;
      }
    }
  }
}
</style>
