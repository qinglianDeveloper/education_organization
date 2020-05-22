<template>
  <div>
    <Modal
      v-model="addCustomerStatus"
      :title="addCustomerTitle"
      :closable="false"
      :width="650"
      :mask-closable="false"
    >
      <Form
        ref="formItem"
        class="formInfo"
        :model="formItem"
        :label-width="100"
        label-position="right"
        :rules="ruleValidate"
      >
        <FormItem label="客户全称：" prop="cstName">
          <Input
            :maxlength="100"
            v-model="formItem.cstName"
            placeholder="请输入客户全称"
            style="width:460px;"
          ></Input>
        </FormItem>

        <div style="display:flex;">
          <FormItem label="类型：" prop="type">
            <Cascader
              v-model="formItem.type"
              :data="typeList"
              :render-format="format"
              @on-change="changeSelect"
              style="width:180px"
            ></Cascader>
          </FormItem>

          <FormItem label="来源：" prop="source">
            <Select v-model="formItem.source" placeholder="选择来源" style="width:180px;">
              <Option
                v-for="item in resourceList"
                :value="item.value"
                :key="item.value"
                @click.native="changeResource(item)"
              >{{item.value}}</Option>
            </Select>
          </FormItem>
        </div>

        <div>
          <FormItem label="选择用户：" prop="userId">
            <Select v-model="formItem.userId" style="width:450px">
                <Option
                  v-for="item in salesList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
          </FormItem>
        </div>

        <div style="display:flex;">
          <FormItem label="姓名：" prop="contactName">
            <Input
              :maxlength="50"
              v-model="formItem.contactName"
              placeholder="请输入联系人姓名"
              style="width:180px;"
            ></Input>
          </FormItem>

          <FormItem label="手机号码：" prop="mobilePhone">
            <Input
              :maxlength="50"
              v-model="formItem.mobilePhone"
              placeholder="请输入手机号码"
              style="width:180px;"
            ></Input>
          </FormItem>
        </div>

        <FormItem label="归属分销商：" prop="parentCstName" class="namegroup" :label-width="120">
          <Input
            class="one"
            search
            v-model="formItem.parentCstName"
            :placeholder="placeLabel"
            @on-change="searchCustom"
            @on-search="searchName"
          ></Input>

          <div
            class="name"
            v-show="nameStatus"
            style="max-height: 200px;overflow: auto;"
            @scroll="scrollEvent"
          >
            <template v-for="(item,index) in findNameArr">
              <span
                v-if="findNameArr&&findNameArr.length>0"
                :key="index"
                class="name-i"
                @click="clickName(item)"
              >{{item.name}}</span>
            </template>

            <span v-if="!findNameArr||findNameArr.length<1" class="name-ii">暂无数据</span>
          </div>
        </FormItem>

        <FormItem label="备注：" prop="remark">
          <div style="width: 460px;position: relative;">
            <Input
              :maxlength="200"
              :rows="4"
              type="textarea"
              v-model="formItem.remark"
              placeholder="请输入备注"
              style="width:460px;"
            ></Input>
            <span class="val_length">{{formItem.remark.length + " / 200"}}</span>
          </div>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确认保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { userGetList } from "@/api";
import { mapState } from "vuex";
export default {
  props: ["addCustomerStatus", "addCustomerTitle"],
  data() {
    return {
      placeLabel: "请搜索归属分销商",
      nameStatus: false,
      findNameArr: [],
      infoNumber: 2,
      quesnumber: 2,
      otherNumber: 2,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      title: [
        {
          value: "客户",
          label: "客户"
        },
        {
          value: "供应商",
          label: "供应商"
        },
        {
          value: "代理商",
          label: "代理商"
        },
        {
          value: "阿里云服务商",
          label: "阿里云服务商"
        },
        {
          value: "阿里云合作伙伴",
          label: "阿里云合作伙伴"
        },
        {
          value: "其他",
          label: "其他"
        }
      ],
      resourceList: [
        {
          value: "自挖掘",
          label: "SelfExplore"
        },
        {
          value: "转介绍",
          label: "OtherIntroduce"
        },
        {
          value: "线下推广",
          label: "ExpandOffline"
        },
        {
          value: "网络推广",
          label: "ExpandOnline"
        },
        {
          value: "内部资源",
          label: "InnerSource"
        },
        {
          value: "会议",
          label: "Meetting"
        },
        {
          value: "其他",
          label: "Other"
        }
      ],
      typeList: [
        {
          value: "Customer",
          label: "客户"
        },
        {
          value: "Supplier",
          label: "供应商"
        },
        {
          value: "Agent",
          label: "代理商",
          children: [
            {
              value: "ALYSeriver",
              label: "阿里云城市服务商"
            },
            {
              value: "ALYPartner",
              label: "阿里云合作伙伴"
            }
          ]
        },
        {
          value: "Other",
          label: "其他"
        }
      ],

      //   表单验证
      ruleValidate: {
        cstName: [
          {
            required: true,
            message: "客户全称不能为空",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            trigger: "change",
            validator: function(rule, value, callback) {
              if (value.length == 0) {
                return callback(new Error("类型不能为空"));
              }
              callback();
            }
          }
        ],
        source: [
          {
            required: true,
            message: "来源不能为空",
            trigger: "blur"
          }
        ],
        contactName: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        mobilePhone: [
          {
            type: "number",
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur",
            transform(value) {
              var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
              if (!myreg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            }
          }
        ],
        parentCstName: [
          {
            required: true,
            message: "归属分销商名称不能为空",
            trigger: "blur"
          }
        ]
      },
      salesList: [],
      //表单字段
      formItem: {
        cstName: "", //客户全称
        userId: "", // 用户id
        type: "", //类型
        source: "", //来源
        contactName: "", //姓名
        mobilePhone: "", //手机号码
        remark: "", //备注
        // parentCstName: ""
      },
      addSelectSource: "", //选择来源
      addSelectType: "", //选择类型

      lock: false // 锁定加载
    };
  },
  mounted() {},
  created() {
    this._listByPage();
  },
  methods: {
    _listByPage() {
      userGetList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let obj = { value: item.id, label: item.userName };
            this.salesList.push(obj);
            return this.salesList;
          });
          console.log(this.salesList);
        }
      });
    },
    // 点击分级
    format(labels, selectedData) {
      let index = labels.length - 1;
      let data = selectedData[index];
      if (data && data.length > 0) {
        return labels[index];
      }
      return labels[index];
    },
    changeSelect(v, item) {
      let code = v[v.length - 1];
      this.addSelectType = code;
    },

    // 数据--搜索补全
    getSearchList() {
      //   getCustomerSearch(this.searchForm).then(res => {
      //     this.findNameArr = this.findNameArr.concat(res.content);
      //     // 如果没有数据就锁定，page就不在允许增加，也不允许加载数据
      //     if (res.content.length <= 0) {
      //       this.lock = true;
      //     }
      //   });
    },

    // 父级新增客户
    getParamsList() {
      this.$refs.formItem.resetFields();
    },

    // 选择来源
    changeResource(item) {
      this.addSelectSource = item.label;
    },

    scrollEvent(e) {
      this.throttled(this.nameScrollFn(e), 300);
    },
    /**
     * 滚动事件
     */
    nameScrollFn(e) {
      //距离底部5px时，开始加载数据
      if (e instanceof Event) {
        var el = e.target;
        var scHeight = el.scrollHeight,
          scTop = el.scrollTop,
          clHeight = el.clientHeight;
        if (scHeight - scTop > clHeight + 5) return;
      }

      console.log("距离底部5px时");
      // 锁定了就不准加载了
      if (!this.lock) {
        this.searchForm.pageNumber = this.searchForm.pageNumber + 1;
        this.getSearchList();
      }
    },

    // 搜索变化时
    searchCustom() {
      // 搜索框变化时解锁, 只有在滚动加载的时候才锁定
      this.lock = false;
      this.findNameArr = [];
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10
      };
      //   searchCustom(this, this.formItem.parentCstName);
    },
    // 搜索客户名称
    searchName() {
      this.lock = false;
      this.findNameArr = [];
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10
      };
      //   searchName(this, "customer");
      //   this.searchForm.name = this.formItem.parentCstName;
      //   this.getSearchList();
    },
    // 点击客户名称
    clickName(item) {
      //   clickName(this, item, "customer");
      //   this.formItem.parentCstId = item.id;
    },
    ok() {
      let newForm = JSON.parse(JSON.stringify(this.formItem));
      if (this.addSelectSource) {
        newForm.source = this.addSelectSource;
      }

      if (this.addSelectType) {
        newForm.type = this.addSelectType;
      }

      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.$emit("addCustomerOk", newForm);
        } else {
        }
      });
    },
    cancel() {
      this.$emit("addCustomerCancel");
    },
    now() {
      return new Date().getTime();
    },
    //节流
    throttled: function(func, wait, options) {
      var self = this;
      var timeout, context, args, result;
      var previous = 0;
      if (!options) options = {};

      var later = function() {
        previous = options.leading === false ? 0 : self.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };

      var throttled = function() {
        var now = self.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };

      throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
      };

      return throttled;
    }
  }
};
</script>
<style lang="scss" scoped>
.namegroup {
  .one {
    width: 300px;
  }
  .name {
    width: 300px;
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
}
.val_length {
  position: absolute;
  right: 5%;
  bottom: 3%;
  color: rgb(185, 188, 194);
}
</style>