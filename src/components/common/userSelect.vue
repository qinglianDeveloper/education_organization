<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 13:45:29
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-28 14:56:55
 -->
<template>
  <div>
    <Input v-model="form.username" @on-change="searchUser" placeholder="请搜索用户" icon="ios-search"></Input>
    <div class="username" v-show="dropdownStatus" style="max-height: 200px;overflow: auto;">
      <template v-for="(item,index) in userlist">
        <span
          v-if="userlist&&userlist.length>0"
          :key="index"
          class="name-i"
          @click="clickName(item)"
        >{{item.userName}}</span>
      </template>
      <span v-if="!userlist||userlist.length<1" class="name-ii">暂无数据</span>
    </div>
  </div>
</template>
<script>
import { userGetList } from "@/api";
export default {
  props: {
    data: {
      type: String,
      default: ""
    }
  },
  watch: {
    data(val) {
      this.form.username = val;
    }
  },
  data() {
    return {
      form: {
        username: "",
        userId: ""
      },
      timer: null,
      dropdownStatus: false,
      userlist: []
    };
  },
  methods: {
    // 获取用户列表
    userGetList() {
      userGetList({ name: this.form.username }).then(res => {
        if (res.code == 200) {
          this.userlist = res.result;
        }
      });
    },
    searchUser() {
      this.form.userId = "";
      this.$emit("userChange", this.form);
      if (this.form.username) {
        this.dropdownStatus = true;
      }
      clearTimeout(this.timer);
      this.dropdownStatus = true;
      this.timer = setTimeout(() => {
        if (this.form.username) {
          this.userGetList();
        } else {
          this.dropdownStatus = false;
        }
        clearTimeout(this.timer);
      }, 500);
    },
    clickName(item) {
      this.form.username = item.userName;
      this.form.userId = item.id;
      this.$emit("selectUser", this.form);
      this.dropdownStatus = false;
      this.userlist = [];
    }
  }
};
</script>
<style lang="scss" scoped>
.username {
  position: absolute;
  background: #fff;
  z-index: 9999;
  width: 100%;
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
</style>
<!--
    用于员工模块的下拉模糊搜索
    接收一个用户名
    传出用户名和用户ID
-->