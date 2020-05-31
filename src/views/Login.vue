<!-- 登录页面 -->
<template>
  <div class="login">
    <div class="main">
      <h2 class="title">健康申报后台管理系统</h2>
      <!-- 登录 -->
      <div class="login-info" v-show="isLogin">
        <div class="login-info-from">
          <Form ref="formCustom" :model="formCustom" :rules="rules">
            <FormItem prop="mobile">
              <Input type="text" v-model="formCustom.mobile" placeholder="请输入手机号" size="large">
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
            <!-- <FormItem prop="imageCode">
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
            </FormItem>-->
            <FormItem>
              <Button type="primary" @click="handleSubmit('formCustom')" long size="large">登录</Button>
            </FormItem>
          </Form>
          <!-- 注册 -->
          <div style="text-align:right">
            <Button type="text" style="color:blue" @click="goRegister">注册新用户</Button>
          </div>
        </div>
      </div>
      <!-- 注册 -->
      <div v-show="!isLogin" class="register-info">
        <Form ref="formValidate" :rules="ruleValidate" :model="form" :label-width="80">
          <FormItem label="手机号" prop="mobile">
            <div style="display:flex">
              <Input v-model="form.mobile" placeholder="请输入手机号" maxlength="11"></Input>
              <Button
                type="primary"
                style="width:140px;margin-left:10px;"
                @click="getMobileValidator"
                v-if="!isDisabledCode"
              >获取验证码</Button>
              <div
                v-else
                style="width:140px;margin-left:10px;border-radius:4px;background-color:#eee;color:#888;text-align:center"
              >{{timer_num}}后再次获取</div>
            </div>
          </FormItem>
          <FormItem label="验证码" prop="validator">
            <Input v-model="form.validator" placeholder="请输入验证码"></Input>
          </FormItem>
          <FormItem label="角色" prop="type">
            <RadioGroup v-model="form.type">
              <Radio label="ORGPRINCIPAL">培训机构负责人</Radio>
              <Radio label="TRUSTEESHIPORGPRINCIPAL">托管机构负责人</Radio>
              <Radio label="TEACHER">教师</Radio>
              <Radio label="STUDENT">学生</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="培训机构" prop="orgId" v-show="form.type=='TEACHER'||form.type=='STUDENT'">
            <Select
              placeholder="请选择你所在的培训机构"
              v-model="form.orgId"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <Option
                v-for="(option, index) in options"
                :value="option.id"
                :key="index"
              >{{option.orgName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="姓名" prop="userName">
            <Input v-model="form.userName" placeholder="请输入姓名"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="password2">
            <Input type="password" v-model="form.password2" placeholder="请输入再次输入密码"></Input>
          </FormItem>
        </Form>
        <div style="text-align:center">
          <Button @click="goBack" style="margin-right:6px">返回</Button>
          <Button type="primary" @click.native="submit('formValidate')">注册</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Sidentify from "@/components/codeImage.vue";
import { login, getImageCode, register, orgList, mobileValidator } from "@/api"; //接口
export default {
  components: {
    // Sidentify
  },
  data() {
    return {
      timer_num: 60,
      timeClock: null,
      isLogin: true,
      isDisabledCode: false,
      form: {
        mobile: "",
        validator: "",
        type: "", //学生 STUDENT 老师 TEACHER 培训机构负责人 ORGPRINCIPAL
        userName: "",
        password: "",
        password2: "",
        orgId: "" //培训机构的Id
      },
      ruleValidate: {
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            type: "number",
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur",
            transform(value) {
              var myreg = /^[1][0-9]{10}$/;
              if (!myreg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            }
          }
        ],
        validator: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ],
        type: [{ required: true, message: "角色不能为空", trigger: "blur" }],
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      },
      loading: false,
      options: [],
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
    // this.getImageCode();
    this.keyupSubmit();
  },
  mounted() {
    // this.formCustom.imageCode = this.identifyCode;
  },
  methods: {
    // 倒计时
    sendCode() {
      this.timeClock = setInterval(() => {
        this.timer_num = this.timer_num - 1;
        if (this.timer_num == 0) {
          clearInterval(this.timeClock);
          this.isDisabledCode = false;
        }
      }, 1000);
    },
    getMobileValidator() {
      //获取验证码
      let { mobile } = this.form;
      if (!/^[1][0-9]{10}$/.test(mobile)) {
        return this.$Message.error("手机号码有误!");
      }
      this.isDisabledCode = true;
      this.timer_num = 60;
      this.sendCode();
      mobileValidator({ phone: mobile }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    goRegister() {
      clearInterval(this.timeClock);
      this.isLogin = false;
      this.formCustom = {
        mobile: "",
        password: "",
        validateCode: ""
      };
    },
    goBack() {
      clearInterval(this.timeClock);
      this.isLogin = true;
      this.form = {
        mobile: "",
        validator: "",
        type: "", //学生 STUDENT 老师 TEACHER 培训机构负责人 ORGPRINCIPAL
        userName: "",
        password: "",
        password2: "",
        orgId: "" //培训机构的Id
      };
    },
    submit(name) {
      let {
        mobile,
        validator,
        type,
        userName,
        password,
        password2,
        orgId
      } = this.form;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (password !== password2)
            return this.$Message.error("两次密码不一致!");
          if ((type === "STUDENT" || type === "TEACHER") && orgId === "")
            return this.$Message.error("培训机构不能为空!");
          if (type === "ORGPRINCIPAL" || type === "TRUSTEESHIPORGPRINCIPAL")
            orgId = "";
          register({ mobile, validator, type, userName, password, orgId }).then(
            res => {
              if (res.code === 200) {
                this.$Message.success(res.result);
                this.goBack();
              } else {
                this.$Message.error(res.result);
              }
            }
          );
        } else {
          this.$Message.error(res.result);
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        orgList({ orgName: query }).then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.options = res.result;
          } else {
            this.$Message.error(res.result);
          }
        });
      } else {
        this.options = [];
      }
    },
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
              // self.getImage();
            }
          });
        } else {
          self.$Message.error("验证码错误!");
          // self.getImage();
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
    transform: translate(-50%, -75%);
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
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.8);
      width: 540px;
      height: 280px;
      padding: 32px 80px;
    }
    .register-info {
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.8);
      width: 540px;
      padding: 32px 40px;
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