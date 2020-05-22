<template>
  <div class="add-worklist">
    <div class="card">
      <div class="title">工单基本内容</div>
      <Form
        class="form"
        ref="workForm"
        :model="workForm"
        :label-width="100"
        :rules="ruleCustom"
        :disabled="isRedact"
      >
        <FormItem label="工单标题：" prop="orderTitle">
          <Input type="text" v-model="workForm.orderTitle" style="width:280px" />
        </FormItem>
        <div style="display:flex;">
          <FormItem label="工单模板：" prop="templateId" style="margin-right:60px">
            <!-- <Input type="text" v-model="workForm.template" /> -->
            <Select
              v-model="workForm.templateId"
              filterable
              style="width:280px"
              @on-change="selectTemplate"
            >
              <Option
                v-for="item in template"
                :value="item.id"
                :key="item.id"
              >{{ item.templateName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="工单类型：" prop="typeId">
            <Select v-model="workForm.typeId" style="width:280px" filterable>
              <Option v-for="item in type" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
            </Select>
          </FormItem>
        </div>
        <FormItem label="详细描述：" prop="description">
          <tinymce-editor v-model="workForm.description" :disabled="isRedact"></tinymce-editor>
        </FormItem>
        <FormItem label="上传附件：">
          <Upload
            :action="uploadAction"
            :before-upload="handleBefore"
            :on-success="handleSuccess"
            ref="upload"
            :data="file"
            :max-size="30720"
            :on-exceeded-size="handleMaxSize"
          >
            <Button icon="ios-cloud-upload-outline">上传附件</Button>
          </Upload>
        </FormItem>
        <FormItem label="工单属性：" class="work-attribute">
          <FormItem label="优先级：" :label-width="100" class="priority" prop="priority">
            <Select v-model="workForm.priority" style="width:160px" size="small">
              <Option
                v-for="item in priority"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem
            label="受理组："
            :label-width="100"
            class="deal-group"
            prop="acceptGroupId"
            :show-message="false"
          >
            <Select
              v-model="workForm.acceptGroupId"
              style="width:160px"
              size="small"
              filterable
              @on-change="selectGroups"
            >
              <Option
                v-for="item in acceptGroupId"
                :value="item.id"
                :key="item.id"
              >{{ item.groupName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="受理人：" :label-width="100" class="deal-person" prop="acceptorId">
            <Select v-model="workForm.acceptorId" style="width:160px" size="small" filterable>
              <Option v-for="item in acceptorId" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem
            label="相关客户："
            :label-width="100"
            class="related-client"
            prop="customerId"
            :show-message="false"
          >
            <Select v-model="workForm.customerId" style="width:160px" size="small" filterable>
              <Option v-for="item in customerId" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </FormItem>
      </Form>
      <div>
        <span>自定义工单属性：</span>
        <Form ref="feildsItem" :model="feildsItem" :label-width="100" style="margin:10px 0 0 110px">
          <template v-for="(item,index) in customArr">
            <FormItem
              :label="item.fieldName+'：'"
              :prop="item.fieldName"
              :rules="rul(item)"
              :key="index"
            >
              <Select
                v-if="item.fieldType=='PULL'?true:false"
                style="width:400px;margin-bottom:10px"
                @on-change="changeItem($event, item.fieldName)"
                v-model="feildsItem[item.fieldName]"
              >
                <Option v-for="(it,i) in item.optionContent" :key="i" :value="it">{{it}}</Option>
              </Select>
              <RadioGroup
                v-if="item.fieldType=='RADIO'?true:false"
                style="width:400px;margin-bottom:10px"
                @on-change="changeItem($event, item.fieldName)"
                v-model="feildsItem[item.fieldName]"
              >
                <Radio v-for="(it,i) in item.optionContent" :key="i" :label="it"></Radio>
              </RadioGroup>
              <CheckboxGroup
                v-if="item.fieldType=='CHECK'?true:false"
                style="width:400px;margin-bottom:10px"
                @on-change="changeRadioGroup($event)"
                v-model="feildsItem[item.fieldName]"
              >
                <Checkbox v-for="(it,i) in item.optionContent" :key="i" :label="it"></Checkbox>
              </CheckboxGroup>
              <Input
                v-if="item.fieldType=='SINGLE'?true:false"
                style="width:400px;margin-bottom:10px"
                v-model="feildsItem[item.fieldName]"
              />
              <Input
                v-if="item.fieldType=='MULTI'?true:false"
                type="textarea"
                style="width:400px;margin-bottom:10px"
                v-model="feildsItem[item.fieldName]"
              />
              <!-- {{feildsItem[item.fieldName]}} -->
              <DatePicker
                v-if="item.fieldType=='DATE'?true:false"
                type="date"
                style="width:400px;margin-bottom:10px"
                v-model="feildsItem[item.fieldName]"
                @on-change="changeDate"
              ></DatePicker>
            </FormItem>
            <!-- 其他选项 -->
            <FormItem
              v-if="isOther(feildsItem[item.fieldName])"
              :label="item.fieldName+'-其他：'"
              :key="index+'other'"
            >
              <Input
                style="width:400px;margin-bottom:10px"
                v-model="feildsItem[item.fieldName+'other']"
              />
            </FormItem>
          </template>
        </Form>
      </div>
    </div>
    <Row type="flex" justify="center" style="margin:10px 0">
      <Button
        type="primary"
        style="margin-right:12px"
        @click="handleAddwork"
        :disabled="isRedact"
      >创建</Button>
      <Button type="default" style="margin-right:12px" @click="handleCancel">取消</Button>
      <Button
        type="text"
        size="small"
        style="font-size:12px;color:#5cadff;margin-top:8px"
        @click="handleReset('workForm')"
        :disabled="isRedact"
      >清空内容</Button>
    </Row>
  </div>
</template>
<script>
/* 富文本编辑框 */
import TinymceEditor from "@/components/tinymce-editor/tinymce-editor";
import {
  getAddTemplate,
  getAddType,
  getInfoById,
  getAddGroups,
  getAddPerson,
  getAddCustomer,
  addOrder
} from "@/api";
import config from "@/config";
import { join } from "path";
export default {
  name: "addwork-list",
  components: { TinymceEditor },
  data() {
    return {
      code: "",
      isRedact: false, //表单是否可以编辑
      workForm: {},
      ruleCustom: {
        orderTitle: [
          { required: true, message: "请输入工单标题", trigger: "blur" }
        ],
        templateId: [
          {
            required: true,
            message: "请选择工单模板",
            trigger: "blur",
            type: "number"
          }
        ],
        typeId: [
          {
            required: true,
            message: "请选择工单类型",
            trigger: "blur",
            type: "number"
          }
        ],
        acceptGroupId: [
          {
            required: true,
            message: "请选择受理组",
            trigger: "blur",
            type: "number"
          }
        ],
        customerId: [
          {
            required: true,
            message: "请选择相关客户",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      template: [],
      type: [],
      priority: [
        { value: "HIGH", label: "高" },
        { value: "MIDDLE", label: "中" },
        { value: "LOW", label: "低" }
      ],
      acceptGroupId: [],
      acceptorId: [],
      customerId: [],
      customArr: [],
      uploadAction: "",
      file: { title: "" },
      feildsItem: {},
      feildsRules: {}
    };
  },
  created() {
    this.uploadAction = config.uploadAction;
    this.getRouterData();
    // if (this.code != "add") {
    //   this.isRedact = true;
    // }
    this.getAddPull();
  },
  methods: {
    isOther(item) {
      // console.log(item);
      if (item == "其他") {
        return true;
      }
      if (item && Array.isArray(item) && item.indexOf("其他") > -1) {
        return true;
      }
    },
    rul(val) {
      // console.log(val);
      let obj = {};
      if (val.isRequired == "YES") {
        if (val.fieldType == "CHECK") {
          obj = {
            required: true,
            type: "array",
            min: 1,
            message: "不能为空！",
            trigger: "change"
          };
        } else if (val.fieldType == "DATE") {
          obj = {
            required: true,
            message: "不能为空！",
            type: "date",
            trigger: "change"
          };
        } else {
          obj = { required: true, message: "不能为空！", trigger: "blur" };
        }
      } else {
        return;
      }
      return obj;
    },
    /**
     * 获取路由传递的值
     */
    getRouterData() {
      this.code = this.$route.params.code;
      // console.log("code", this.code);
    },
    /**
     * 下拉框数据
     */
    getAddPull() {
      // 模板下拉数据
      getAddTemplate().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.template = res.result;
        }
      });
      // 类型下拉数据
      getAddType().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.type = res.result;
        }
      });
      // 受理组下拉数据
      getAddGroups().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.acceptGroupId = res.result;
        }
      });
      // 相关客户下拉数据
      getAddCustomer().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.customerId = res.result;
        }
      });
    },

    /**
     * 模板下拉选中事件
     */
    selectTemplate(value) {
      // console.log(value);
      this.feildsItem = {};
      getInfoById({ id: value }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.customArr = res.result.workOrderFieldListList;
          this.customArr.forEach(item => {
            if (item.optionContent) {
              item.optionContent = item.optionContent.split(",");
            }
          });
          // console.log(this.feildsRules);
        }
      });
    },

    /**
     * 受理组下拉选中事件
     */
    selectGroups(value) {
      // console.log(value);
      // 受理人下拉数据
      getAddPerson({ groupId: value }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.acceptorId = res.result;
          this.workForm.acceptorId = "";
        }
      });
    },
    /**
     * 自定义属性选中事件
     */
    changeItem($event, name) {
      // console.log($event, name);
      // this.feildsItem[name] = $event;
      // console.log(this.feildsItem);
    },
    changeRadioGroup(value, i) {
      // console.log(value, i);
      // console.log(this.feildsItem);
    },
    /**
     * @description: 日期选择
     * @param {type}
     * @return:
     */
    changeDate(newDate) {
      console.log(newDate);
    },
    /**
     * 创建按钮事件
     */
    handleAddwork() {
      // console.log(this.feildsItem);

      let arr = [];
      this.customArr.forEach(item => {
        let obj = {};
        for (let i in this.feildsItem) {
          if (i == item.fieldName) {
            obj.fieldValue = this.feildsItem[i];
          }
          if (i == item.fieldName + "other") {
            obj.otherName = item.fieldName + "other";
            obj.otherValue = this.feildsItem[i];
          }
        }
        obj.fieldName = item.fieldName;
        obj.fieldType = item.fieldType;
        obj.isRequired = item.isRequired;
        obj.status = item.status;
        obj.optionContent = item.optionContent;
        obj.other = item.other;
        arr.push(obj);
      });
      this.workForm.feildsItem = JSON.stringify(arr);
      console.log(this.workForm);

      this.$refs.workForm.validate(big => {
        if (big) {
          this.$refs.feildsItem.validate(small => {
            if (small) {
              addOrder(this.workForm).then(res => {
                if (res.code == 200) {
                  this.$Message.success("新增工单成功！");
                  this.$router.go(-1);
                } else {
                  this.$Message.error("新增工单失败！");
                }
              });
            } else {
              this.$Message.error("请按要求输入工单信息！");
            }
          });
        } else {
          this.$Message.error("请按要求输入工单信息！");
        }
      });
    },
    /**
     * 取消按钮事件
     */
    handleCancel() {
      this.$Modal.confirm({
        title: "确认离开",
        content: "您确认要离开新建工单?",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    },
    handleBefore(file) {
      this.file.title = file.name;
    },
    /**
     * 弹框上传成功回调
     */
    handleSuccess(res, file, filelist) {
      if (res.code == 200) {
        // console.log(filelist);
        let arr = [];
        filelist.forEach(item => {
          arr.push(item.response.message);
        });
        this.workForm.accessoryUrl = arr.join(",");
        // console.log(this.workForm.accessoryUrl);
        // this.workForm.file = res.message;
        this.$Message.success({
          content: "上传附件成功！",
          duration: 2
        });
      } else {
        this.$Message.error("上传附件失败，请重新上传");
      }
    },
    /**
     * 文件超出指定大小限制时的钩子
     */
    handleMaxSize(file) {
      this.$Message.error({
        content: "文件大小超过30M，请重新上传！",
        duration: 2
      });
    },

    /**
     * 清空按钮事件
     */
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$refs.upload.clearFiles();
    }
  }
};
</script>
<style lang="scss" scoped>
.add-worklist {
  height: 100%;
  padding: 30px 60px;
  .card {
    height: 96%;
    border: 1px solid #dcdee2;
    border-radius: 6px;
    padding: 20px 30px;
    overflow: auto;
    .title {
      font-size: 16px;
      margin-bottom: 20px;
      color: #2d8cf0;
    }
    .work-attribute {
      .ivu-form-item-content {
        .ivu-form-item {
          font-size: 12px;
          display: inline-block;
          min-width: 268px;
        }
      }
    }
  }
}
</style>