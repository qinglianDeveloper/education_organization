<template>
  <Modal v-model="show" title="编辑" @on-cancel="cancel" width="900">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100" inline>
      <FormItem prop="name" label="姓名">
        <Input type="text" v-model="formInline.name" placeholder="Username" style="width:700px" />
      </FormItem>
      <FormItem label="手机号码" prop="mobilePhone">
        <Input v-model="formInline.mobilePhone" style="width:700px" />
      </FormItem>
      <FormItem label="固定电话" prop="telephone">
        <Input v-model="formInline.telephone" style="width:700px" />
      </FormItem>
      <FormItem label="个人邮箱" prop="email">
        <Input v-model="formInline.email" style="width:700px" />
      </FormItem>
      <FormItem label="公司名称" prop="corpName">
        <Input v-model="formInline.corpName" style="width:700px" />
      </FormItem>
      <FormItem label="部门" prop="department">
        <Input v-model="formInline.department" style="width:700px" />
      </FormItem>
      <FormItem label="职务" prop="position">
        <Input v-model="formInline.position" style="width:700px" />
      </FormItem>
      <FormItem label="公司地址" prop="corpAddress">
        <Input v-model="formInline.corpAddress" style="width:700px" />
      </FormItem>
      <FormItem label="性别" prop="sex">
        <Input v-model="formInline.sex" style="width:700px" />
      </FormItem>
      <FormItem label="民族" prop="nation">
        <Input v-model="formInline.nation" style="width:700px" />
      </FormItem>
      <FormItem label="微信号" prop="wechat">
        <Input v-model="formInline.wechat" style="width:700px" />
      </FormItem>
      <FormItem label="QQ" prop="qq">
        <Input v-model="formInline.qq" style="width:700px" />
      </FormItem>
      <FormItem label="生日" prop="birthday">
        <Input v-model="formInline.birthday" style="width:700px" />
      </FormItem>
      <FormItem label="兴趣爱好" prop="hobby">
        <Input v-model="formInline.hobby" style="width:700px" />
      </FormItem>
      <FormItem label="省份" prop="ProvinceVal">
        <Select
          v-model="ProvinceVal"
          placeholder="请选择省份"
          @on-change="ProvinceChange"
          style="width:700px"
        >
          <Option v-for="item in Province" :key="item.id" :value="item.id">{{ item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="城市" prop="CityVal">
        <Select
          v-model="CityVal"
          placeholder="请选择城市"
          :disabled="disabledCityVal"
          @on-change="cityChange"
          style="width:700px"
        >
          <Option v-for="item in City" :key="item.id" :value="item.id">{{ item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="县区" prop="area">
        <Select v-model="area" placeholder="请选择县区" :disabled="disabledarea" style="width:700px">
          <Option v-for="item in areaList" :key="item.id" :value="item.id">{{ item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="家庭地址" prop="houseAddress">
        <Input v-model="formInline.houseAddress" style="width:700px" />
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="formInline.remark" style="width:700px" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="configOk">提交</Button>
      <Button @click="cancelBtn">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { getList } from "@/api/";
import { StateTree } from "@/utils/current";
export default {
  data() {
    return {
      show: false,
      items: {},
      ruleInline: {
        name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
        mobilePhone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "个人邮箱不能为空", trigger: "blur" }
        ],
        corpName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        department: [
          { required: true, message: "部门不能为空", trigger: "blur" }
        ],
        position: [
          { required: true, message: "职务不能为空", trigger: "blur" }
        ],
        corpAddress: [
          { required: true, message: "公司地址不能为空", trigger: "blur" }
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        nation: [{ required: true, message: "民族不能为空", trigger: "blur" }],
        wechat: [
          { required: true, message: "微信号不能为空", trigger: "blur" }
        ],
        qq: [{ required: true, message: "QQ不能为空", trigger: "blur" }],
        birthday: [
          { required: true, message: "生日不能为空", trigger: "blur" }
        ],
        hobby: [
          { required: true, message: "兴趣爱好不能为空", trigger: "blur" }
        ],
        ProvinceVal: [
          { required: true, message: "省份不能为空", trigger: "blur" }
        ],
        CityVal: [{ required: true, message: "城市不能为空", trigger: "blur" }],
        area: [{ required: true, message: "县区不能为空", trigger: "blur" }],
        houseAddress: [
          { required: true, message: "家庭地址不能为空", trigger: "blur" }
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      },
      disabledarea: true,
      disabledCityVal: true,
      Province: [],
      ProvinceVal: "",
      City: [],
      CityVal: "",
      area: "",
      areaList: [],
      formInline: {
        id: "",
        name: "",
        mobilePhone: "",
        telephone: "",
        email: "",
        corpName: "",
        department: "",
        position: "",
        corpAddress: "",
        sex: "",
        nation: "",
        wechat: "",
        qq: "",
        birthday: "",
        hobby: "",
        areaId: "",
        area: "",
        houseAddress: "",
        remark: ""
      }
    };
  },
  props: ["ContactsEditShow"],
  watch: {
    ContactsEditShow(newVal) {
      this.show = newVal;
    }
  },
  created() {
    this._getList();
  },
  methods: {
    _getList() {
      getList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let obj = { id: item.id, name: item.name, children: item.children };
            return arr;
          });
          this.Province = arr;
        }
      });
    },
    ProvinceChange(e) {
      this.disabledarea = false;
      let arr = this.Province;
      for (let i in arr) {
        let arrs = arr[i].children;
        for (let j in arrs) {
          if (e == arrs[j].pid) {
            let obj = {
              id: arrs[j].id,
              name: arrs[j].name,
              children: arrs[j].children
            };
            this.City.push(obj);
          }
        }
      }
    },
    cityChange(e) {
      this.disabledCityVal = false;
      for (let i in this.City) {
        let areaArr = this.City[i].children;
        for (let j in areaArr) {
          if (e == areaArr[j].pid) {
            let obj = { id: areaArr[j].id, name: areaArr[j].name };
            this.areaList.push(obj);
          }
        }
      }
    },
    cancel() {
      this.$emit("editFalg", false);
    },
    cancelBtn() {
      this.$emit("editFalg", false);
    },
    configOk() {
      this.formInline.areaId =
        this.ProvinceVal + "," + this.CityVal + "," + this.area;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>