<!-- 用户协议配置 --->
<template>
  <div class="userAllocationAddEdit">
    <Row>
      <Form ref="form" :model="formItem" :label-width="100" :rules="carouselRules">
        <FormItem label="协议类型" prop="type">
          <Select v-model="formItem.type">
            <Option value="USERAGREEMENT">用户协议</Option>
            <Option value="PRIVACYAGREEMEN">隐私协议</Option>
            <Option value="COMMISSIONRULES">佣金规则</Option>
            <Option value="INTEGRALRULE">积分规则</Option>
            <!-- <Option value="YUNREGISTRATIONSTATEMENT">云账户注册说明</Option> -->
            <Option value="HOWTOVIEWYUNID">查看云ID</Option>
            <Option value="OPERATIONMANUALYUNREGISTER">操作手册(云注册)</Option>
            <Option value="AGENCYAGREEMENT">云的家代理协议</Option>
          </Select>
        </FormItem>
        <FormItem label="协议版本号" prop="versions">
          <Input v-model="formItem.versions" placeholder="请输入版本号"></Input>
        </FormItem>
        <Row>
          <Col span="10">
            <FormItem label="开始时间" prop="startTime">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                placeholder="请选择开始时间"
                :options="startTimeOption"
                @on-change="startDate"
                :value="formItem.startTime"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="结束时间" prop="endTime">
              <DatePicker
                type="date"
                placeholder="请选择线束时间"
                :options="endTimeOption"
                @on-change="endDate"
                :value="formItem.endTime"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="状态：" prop="status">
          <i-switch size="large" v-model="formItem.status">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
      </Form>
      <tinymce-editor
        ref="editor"
        v-model="formItem.content"
        :disabled="false"
        :language="'zh_CN'"
        :skin="'oxide'"
      ></tinymce-editor>
    </Row>
    <div class="footer">
      <Button class="Button" type="info" @click="save">保存</Button>
      <Button class="Button" @click="handleCancel">取消</Button>
    </div>
  </div>
</template>
<script>
import { addAgreement, updateAgreement, getAgreementById } from "@/api";
import TinymceEditor from "@/components/tinymce-editor/tinymce-editor";
import config from "@/config";
//import { dateFormat } from "@/utils/current";
export default {
  name: "userAllocationAddEdit",
  components: {
    TinymceEditor
  },
  data() {
    return {
      type: "add",
      id: "null",
      formItem: {
        type: "USERAGREEMENT",
        versions: "",
        startTime: "",
        endTime: "",
        content: "",
        status: true
      },
      carouselRules: {
        versions: [
          { required: true, message: "版本号不能为空", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "编辑器内容不能为空", trigger: "blur" }
        ]
      },
      startTimeOption: {},
      endTimeOption: {}
    };
  },
  mounted() {
    // console.log(this.$route);
    let { type, id } = this.$route.query;
    this.type = type;
    this.id = id;
    if (type === "edit") {
      //编辑---通过id获取详情
      getAgreementById({ id }).then(res => {
        if (res.code === 200) {
          let {
            id,
            type,
            versions,
            startTime,
            endTime,
            content,
            status
          } = res.result;
          startTime = startTime.split("T")[0];
          endTime = endTime.split("T")[0];
          this.startDate(startTime);
          this.endDate(endTime);
          status = status == "ENABLE" ? true : false;
          this.formItem.id = id;
          this.formItem.type = type;
          this.formItem.versions = versions;
          this.formItem.startTime = startTime;
          this.formItem.endTime = endTime;
          this.formItem.content = content;
          this.formItem.status = status;
        }
      });
      console.log("1", this.formItem);
    }
  },
  filters: {
    formatTime(value) {
      //return dateFormat(value);//格式：年-月-日 时:分:秒
      return value.split("T")[0]; //格式：年-月-日
    }
  },
  methods: {
    // changeSwitch(v) {
    //   //改变状态按钮事件
    //   this.formItem.status = v;
    // },
    startDate(startTime) {
      //开始时间
      this.formItem.startTime = startTime;
      this.endTimeOption = {
        disabledDate(endTime) {
          return endTime < new Date(startTime);
        }
      };
    },
    endDate(endTime) {
      //结束时间
      this.formItem.endTime = endTime;
      this.startTimeOption = {
        disabledDate(startTime) {
          return startTime > new Date(endTime);
        }
      };
    },
    addAgreement() {
      //添加
      let {
        type,
        versions,
        startTime,
        endTime,
        content,
        status
      } = this.formItem;
      status = status ? "ENABLE" : "DISABLE";
      addAgreement({
        type,
        versions,
        startTime,
        endTime,
        content,
        status
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.$router.go(-1);
        }
      });
    },
    updateAgreement() {
      //编辑
      let {
        id,
        type,
        versions,
        startTime,
        endTime,
        content,
        status
      } = this.formItem;
      status = status ? "ENABLE" : "DISABLE";
      updateAgreement({
        id,
        type,
        versions,
        startTime,
        endTime,
        content,
        status
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.$router.push("/userAllocation");
        }
      });
    },
    save() {
      //保存
      let { type } = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (type === "add") {
            this.addAgreement();
          } else {
            this.updateAgreement();
          }
        }
      });
    },
    handleCancel() {
      this.$Modal.confirm({
        title: "确认返回",
        content: "您确认要离开?",
        onOk: () => {
          this.$router.push("/userAllocation");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.userAllocationAddEdit {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow: auto;
  max-width: 900px;
  .footer {
    padding: 15px;
    display: flex;
    justify-content: center;
    .Button {
      margin: 0 5px;
    }
  }
}
</style>