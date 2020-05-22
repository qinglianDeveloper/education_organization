<template>
  <Modal title="新增联系人" v-model="contactShow" width="800" @on-cancel="cancel">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="客户" prop="customerId">
            <Select v-model="formValidate.customerId">
              <Option
                v-for="item in userList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="手机号码" prop="mobilePhone">
            <Input v-model="formValidate.mobilePhone" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="固定电话" prop="telephone">
            <Input v-model="formValidate.telephone" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="部门" prop="department">
            <Input v-model="formValidate.department" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="职务" prop="position">
            <Input v-model="formValidate.position" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="邮箱" prop="email">
            <Input v-model="formValidate.email" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="性别" prop="sex" v-model="formValidate.sex">
            <Radio label="MAN">男</Radio>
            <Radio label="WOMAN">女</Radio>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="公司名称" prop="corpName">
            <Input v-model="formValidate.corpName" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="公司地址" prop="corpAddress">
            <Input v-model="formValidate.corpAddress" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="民族" prop="nation">
            <Input v-model="formValidate.nation" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="生日" prop="birthday">
            <DatePicker type="date" placeholder="Select date" v-model="formValidate.birthday"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="国家" prop="country">
            <Input v-model="formValidate.country" />
          </FormItem>
        </Col>
        <Col span="12">
          <!--  -->
        </Col>
      </Row>
      <FormItem label="省份" prop="provincetitle">
        <Select v-model="provincetitle" @on-change="provinceChange">
          <Option v-for="item in datas" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="市级" prop="citytitle">
        <Select v-model="citytitle" :disabled="citydisabled" @on-change="cityChange">
          <Option v-for="item in cList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="区县" prop="area">
        <Select v-model="areatitle" :disabled="areadisabled" @on-change="areaChange">
          <Option v-for="item in aList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="家庭住址" prop="houseAddress">
        <Input type="textarea" v-model="formValidate.houseAddress" />
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input type="textarea" v-model="formValidate.remark" />
      </FormItem>
      <!-- <FormItem label="默认联系人"> -->
      <!-- <CheckboxGroup v-model="formValidate.isDefault">
          <Checkbox label="Eat"></Checkbox>
      </CheckboxGroup>-->
      <!-- </FormItem> -->
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button @click="handleReset('formValidate')">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { validateEmail,checkTel,validatePhone } from '@/utils/current' 
import { getList, getAddCustomer, contactsaveContact } from "@/api";
import { getChinaArea } from "@/utils/current";
export default {
  data() {
    return {
      citydisabled: true,
      areadisabled: true,
      userList: [],
      datas: [],
      cityLIst: [],
      cList: [],
      areaList: [],
      aList: [],
      contactShow: false,
      provincetitle: "",
      citytitle: "",
      areatitle: "",
      ruleValidate: {
        // customerId: [
        //   // { required: true, message: '请点击下拉选择客户', trigger: 'change' }
        // ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        mobilePhone: [
          { required: true, message: "手机不能为空", trigger: "blur" },
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "固定电话不能为空", trigger: "blur" },
          { required: true, validator: checkTel, trigger: "blur" }
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" },
        { required: true, validator: validateEmail, trigger: "blur" }],
        corpName: [{ required: true, message: "不能为空", trigger: "blur" }],
        department: [{ required: true, message: "不能为空", trigger: "blur" }],
        position: [{ required: true, message: "不能为空", trigger: "blur" }],
        corpAddress: [{ required: true, message: "不能为空", trigger: "blur" }],
        // sex: [{ required: true, message: "性别不能为空", trigger: "change" }],
        nation: [{ required: true, message: "不能为空", trigger: "blur" }],
        wechat: [{ required: true, message: "微信不能为空", trigger: "blur" }],
        qq: [{ required: true, message: "QQ不能为空", trigger: "blur" }],
        // birthday: [{ required: true, message: "不能为空", trigger: "change" }],
        hobby: [{ required: true, message: "不能为空", trigger: "blur" }],
        country: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        houseAddress: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
        // areaId: [{ required: true, message: "姓名不能为空", trigger: "change" }]
      },
      formValidate: {
        customerId: "", //客户ID
        isDefault: false, //是否是默认联系人
        name: "", //姓名
        mobilePhone: "", //手机号码
        telephone: "", //固定电话
        email: "", // 邮箱
        corpName: "", //公司名称
        department: "", //部门
        position: "", //职务
        corpAddress: "", //公司地址
        sex: "", //性别
        nation: "", //民族
        wechat: "", // 微信
        qq: "", // QQ
        birthday: "", // 生日
        hobby: "", //兴趣爱好
        country: "", //国家
        areaId: "", //地区
        houseAddress: "", //家庭地址
        remark: "" //备注
      }
    };
  },
  props: ["cantactAddShow"],
  watch: {
    cantactAddShow(newVal) {
      this.contactShow = newVal;
    }
  },
  created() {
    this._getList();
    this._getCustomer();
  },
  methods: {
    _getCustomer() {
      getAddCustomer().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let obj = { value: item.id, label: item.name };
            this.userList.push(obj);
            return this.userList;
          });
        }
      });
    },
    _getList(children) {
      getList().then(res => {
        if (res.code == 200) {
          let arr = res.result.map(province => {
            let obj = {
              value: province.id,
              label: province.name,
              level: province.level,
              children: province.children
            };
            this.datas.push(obj);
            obj.children.map(items => {
              let obj1 = {
                value: items.id,
                label: items.name,
                pid: items.pid,
                children: items.children
              };
              this.cityLIst.push(obj1);
              obj1.children.map(areaItem => {
                this.areaList.push({
                  value: areaItem.id,
                  label: areaItem.name,
                  pid: areaItem.pid
                });
              });
            });
          });
        }
      });
    },
    provinceChange(e) {
      this.citydisabled = false;
      this.cityLIst.map(item => {
        if (e == item.pid) {
          this.cList.push(item);
        }
      });
    },
    cityChange(e) {
      this.areadisabled = false;
      this.areaList.map(item => {
        if (e == item.pid) {
          this.aList.push(item);
        }
      });
    },
    areaChange(e) {
      this.formValidate.areaId =
        this.provincetitle + "," + this.citytitle + "," + this.areatitle;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          contactsaveContact(this.formValidate).then(res => {
            if (res.code == 200) {
              this.$emit("Submission", false);
              this.$Message.success(res.message);
            } else if (res.code == 502) {
              this.$Message.error(res.message);
            }
          });
        } else {
          this.$Message.error("请补全信息");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$emit("cancelBtn", false);
    },
    cancel() {
      this.$emit("cancelBtn", false);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>