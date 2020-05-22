<template>
  <div>
    <div class="header-box">
      <div class="page-box">共{{num}}记录</div>
      <div v-if="code == 3 || code == 6" class="input-box" :style="{width:InputWidth}">
        <Select v-model="model" style="width:200px" size="large">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker
          v-if="code == 3 || code == 6"
          size="large"
          type="date"
          placeholder="Select date"
          style="width: 200px"
        ></DatePicker>
        <Input
          search
          enter-button
          placeholder="Enter something..."
          size="large"
          style="width:200px"
        />
      </div>
    </div>
    <edit :ContactsEditShow="ContactsEditShow" @editFalg="editFalg" />
    <Table border :columns="columns" :data="datas"></Table>
    <pages :fromData="searchData" :total="total" />
  </div>
</template>
<script>
import {
  Contacts,
  accountInformation,
  Business,
  Enclosure,
  CommissionTask,
  operation
} from "./tableData";
import bus from "@/utils/bus";
import pages from "@/components/pageview";
import edit from './edit';
import { getListPage, listAccount, logList } from "@/api";
export default {
  components: { pages,edit },
  data() {
    return {
      InputWidth: "450px",
      cityList: [],
      ContactsEditShow: false,
      model: "",
      num: 0,
      columns: Contacts,
      datas: [],
      total: 0,
      searchData: {
        searchType: "ALL",
        corpName: "",
        name: "",
        mobilePhone: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "",
        order: "",
        isFirst: false
      }
    };
  },
  props: ["code"],
  mounted() {
    bus.$off("pagesTotal");
    bus.$on("pagesTotal", item => {
      this.searchData.pageNumber = item;
      this.dataFun();
    });
    bus.$off("pageSizeClicl");
    bus.$on("pageSizeClicl", item => {
      this.searchData.pageSize = item;
      this.dataFun();
    });
    bus.$off("item");
    bus.$on("item", item => {
      console.log(item.row);
      this.ContactsEditShow = true;
    });
    bus.$off('delOk');
    bus.$on('delOk',item => {
        this.dataFun();
    })
  },
  watch: {
    code(newVal) {
      this.dataFun(newVal);
    }
  },
  methods: {
    dataFun(val) {
      switch (val) {
        case 1:
          this.columns = Contacts;
          this._getListPage();
          break;
        case 2:
          this.columns = accountInformation;
          this._listAccount();
          break;
        case 3:
          this.columns = operation;
          this.InputWidth = "800px";
          this._logList();
          break;
        case 4:
          this.columns = Enclosure;
          break;
        case 5:
          this.columns = CommissionTask;
          break;
        case 6:
          this.columns = operation;
          this.InputWidth = "700px";
          break;
        default:
          break;
      }
    },
    _getListPage() {
      getListPage(this.searchData).then(res => {
        if (res.code == 200) {
          this.datas = res.result.content;
          this.total = res.result.content.length;
        }
      });
    },
    _listAccount() {
      listAccount(this.searchData).then(res => {
        if (res.code == 200) {
          this.datas = res.result.content;
          this.total = res.result.content.length;
        }
      });
    },
    _logList() {
      logList(this.searchData).then(res => {
        if (res.code == 200) {
          this.datas = res.result.content;
          this.total = res.result.content.length;
        }
      });
    },
    editFalg(e) {
        this.ContactsEditShow = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  background: #f0faff;
  width: 180px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #bbe3ff;
}
.header-box {
  display: flex;
  justify-content: space-between;
  .input-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
