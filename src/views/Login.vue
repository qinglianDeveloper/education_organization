<!-- 登录页面 -->
<template>
  <div class="login">
    <div class="main">
      <h2 class="title">健康申报后台管理系统</h2>
      <div class="login-info">
        <div class="login-info-from">
          <Form ref="formCustom" :model="formCustom" :rules="rules">
            <FormItem prop="mobile">
              <Input type="text" v-model="formCustom.mobile" placeholder="请输入用户名" size="large">
                <Icon type="md-person" slot="prepend" size="20" color="#aaa" />
              </Input>
            </FormItem>
            <FormItem prop="pawssWord">
              <Input
                type="password"
                v-model="formCustom.password"
                placeholder="请输入用密码"
                size="large"
              >
                <Icon type="md-lock" slot="prepend" size="20" color="#aaa" />
              </Input>
            </FormItem>
            <FormItem prop="imageCode">
              <div class="code">
                <Input
                  type="text"
                  v-model="formCustom.validateCode"
                  placeholder="请输入验证码"
                  size="large"
                >
                  <Icon type="md-checkbox-outline" slot="prepend" size="20" color="#aaa" />
                </Input>
                <div @click="getImage" class="code-image">
                  <Sidentify :identifyCode="identifyCode"></Sidentify>
                </div>
              </div>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formCustom')" long size="large">登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sidentify from "@/components/codeImage.vue";
import { login, getImageCode } from "@/api"; //接口
export default {
  components: {
    Sidentify
  },
  data() {
    return {
      formCustom: {
        mobile: "",
        password: "",
        validateCode: ""
      },
      rules: {
        mobile: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        validateCode: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ]
      },
      identifyCode: ""
    };
  },
  created() {
    // this.refreshCode();
    this.getImageCode();
    this.keyupSubmit();
  },
  mounted() {
    // this.formCustom.imageCode = this.identifyCode;
  },
  methods: {
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.handleSubmit("formCustom");
        }
      };
    },
    /**
     * 获取验证码
     */
    getImageCode() {
      getImageCode().then(res => {
        this.identifyCode = res.result;
      });
    },
    /**
     * 登录按钮事件
     */
    handleSubmit(name) {
      // 判断输入框是否有值
      const self = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.formCustom));
          obj.validateCode = obj.validateCode.toUpperCase();
          // 发送登录请求
          login(obj).then(data => {
            // 请求成功，本地存储用户信息
            if (data.code == 200) {
              let userInfo = JSON.stringify(data.result.userDO);
              sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
              this.$store.commit("ADD_USER_INFO", userInfo);
              self.$router.push("/");
              this.$Message.success("登录成功!");
            } else {
              self.getImage();
            }
          });
        } else {
          self.$Message.error("验证码错误!");
          self.getImage();
        }
      });
    },
    getImage() {
      this.getImageCode();
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  height: 100%;
  background-image: url("../assets/background-image.jpg");
  background-size: cover;
  position: relative;
  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    .title {
      font-size: 30px;
      line-height: 30px;
      margin-bottom: 24px;
      font-weight: bolder;
      text-align: center;
      color: #fff;
    }
    .login-info {
      // width: 500px;
      background: rgba(255, 255, 255, 0.3);
      width: 540px;
      height: 300px;
      padding: 32px 80px;
    }
  }
  .code-image {
    cursor: pointer;
  }
  .code {
    display: flex;
  }
}
</style>