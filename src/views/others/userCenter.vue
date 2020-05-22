<!-- 个人中心 -->
<template>
  <div class="userCenter-box">
    <div class="content">
      <div class="image-box">
        <img src="../../assets/picture.jpg" alt />
        <a href="javascript:;">上传头像</a>
      </div>
      <div class="input-box">
        <div class="text">用户名:</div>
        <Input type="text" style="width:300px;" disabled v-model="data.name" />
      </div>
      <div class="input-box">
        <div class="text">Email:</div>
        <Input type="text" style="width:300px;" disabled v-model="data.email" />
      </div>
      <div class="input-box">
        <div class="text">手机号</div>
        <Input type="text" style="width:300px;" disabled v-model="data.mobile" />
      </div>
      <div class="input-box">
        <div class="text">旧密码</div>
        <Input type="password" v-model="pws.oldPassword" style="width:300px;" placeholder="请输入旧密码" />
      </div>
      <div class="input-box">
        <div class="text">新密码</div>
        <Input type="password" v-model="pws.newPassword" style="width:300px;" placeholder="请输入新密码" />
      </div>
      <div class="input-box">
        <div class="text">确认密码</div>
        <Input type="password" v-model="allNewPws" style="width:300px;" placeholder="请输入确认密码" />
      </div>
      <div class="input-box">
        <Button type="primary" size="large" @click="btnConfig">保存</Button>
        <Button @click="btnqx" size="large">重置</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { ModifyPassword } from "@/api";
export default {
  data() {
    return {
      data: {},
      pws: {
        oldPassword: "",
        newPassword: ""
      },
      allNewPws: ""
    };
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  methods: {
    btnConfig() {
      if (this.pws.oldPassword == "") {
        this.$Message.error("旧密码不能为空");
        return;
      }
      if (this.pws.newPassword == "") {
        this.$Message.error("新密码不能为空");
        return;
      }
      if (this.allNewPws == "") {
        this.$Message.error("重复新密码不能为空");
        return;
      }
      if (this.pws.newPassword != this.allNewPws) {
        this.$Message.error("新密码和确认密码输入不一致");
        return;
      }
      ModifyPassword(this.pws).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.oldPassword = "";
          this.newPassword = "";
          this.allNewPws = "";
        }
      });
    },
    btnqx() {
      this.pws.oldPassword = "";
      this.pws.newPassword = "";
      this.allNewPws = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.userCenter-box {
  width: 100vh;
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  overflow: auto;
  .content {
    .image-box {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 500px;
      img {
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      a {
        margin: 20px 0;
        width: 500px;
        text-align: center;
      }
    }
    .input-box {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: center;
      .text {
        width: 80px;
        text-align: right;
        margin-right: 10px;
      }
      button {
        margin-top: 50px;
        margin-left: 50px;
      }
    }
  }
}
</style>