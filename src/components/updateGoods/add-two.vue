<!-- 步骤二 -->
<template>
  <div>
    <div class="btn">
      <span>属性设置：</span>
      <Button type="success" @click="addAttribute">添加</Button>
    </div>
    <template v-for="(card,index) in goods">
      <Row :key="index" style="margin-bottom:10px">
        <Card dis-hover>
          <div class="select-name">
            <Form ref="cardName" style="display:flex;" :rules="rules" :model="card">
              <Select
                v-model="card.type"
                :label-in-value="true"
                style="margin:0 10px;width:100px"
                @on-change="selectChange($event, index)"
                placeholder="单项选择"
              >
                <Option
                  v-for="item in selects"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <FormItem label="规格名称：" :label-width="100" prop="attributeName">
                <Input
                  type="text"
                  placeholder="请输入名称"
                  style="width:160px"
                  v-model="card.attributeName "
                ></Input>
              </FormItem>
              <FormItem label="单价：" :label-width="70" style="margin-left:20px" prop="price">
                <InputNumber placeholder="请输入单价" style="width:160px" v-model="card.price"></InputNumber>
              </FormItem>
            </Form>
            <div class="close" style="margin-left:50px">
              <Button
                type="error"
                shape="circle"
                icon="md-close"
                style="font-size:20px"
                @click="closeCard(card,index)"
              ></Button>
            </div>
          </div>
          <div class="info" v-if="card.type=='SELECT'?true:false">
            <span style="width:98px;text-align:center">规格详情：</span>
            <Card style="flex:1" dis-hover>
              <Row :gutter="24" style="margin-bottom:12px">
                <Col span="10" style="text-align:center">规格值</Col>
                <!-- <Col span="7" style="text-align:center">规格系数</Col> -->
                <Col span="10" style="text-align:center">规格系数</Col>
              </Row>
              <!-- 添加 -->
              <Row :gutter="24" v-for="(item, i) in card.productAttributeValueSaveVOList" :key="i">
                <div v-if="item">
                  <Form
                    style="display:flex;justify-content: space-around"
                    :rules="attributeRules"
                    :model="item"
                    ref="item"
                  >
                    <FormItem style="width:40%" prop="attributeValue">
                      <Input v-model="item.attributeValue" placeholder="请输入..." />
                    </FormItem>
                    <FormItem style="width:40%" prop="ratio">
                      <InputNumber v-model="item.ratio" placeholder="请输入..." style="width:70%"></InputNumber>
                    </FormItem>
                    <FormItem>
                      <Button
                        type="error"
                        size="small"
                        @click="removeList(index,i)"
                        style="margin:4px 0"
                      >删除</Button>
                    </FormItem>
                  </Form>
                </div>
              </Row>
              <!-- 添加行按钮 -->
              <div class="addlist">
                <Button type="primary" size="small" @click="addList(index)">添加</Button>
              </div>
            </Card>
          </div>
        </Card>
      </Row>
    </template>
    <div class="comp">
      <span class="tit">总价计算公式：</span>
      <span>{{formula}}</span>
      <Button type="primary" size="small" style="margin-left:10px;" @click="handleChange">修改</Button>
    </div>
    <!-- 公式弹框 -->
    <Modal v-model="modal" :title="modalTitle">
      <div>
        <div class="code">
          <span class="code-name">规格名称：</span>
          <div>
            <span
              v-for="(item,index) in goods"
              :key="index"
              class="span"
              @click="selectName(item)"
            >{{item.attributeName}}</span>
          </div>
        </div>
        <div class="symbol">
          <span class="symbol-name">算法符号：</span>
          <span
            v-for="(item,index) in symbolList"
            :key="index"
            class="span"
            @click="selectSymbol(item)"
          >{{item.label}}</span>
        </div>
      </div>
      <div class="show">
        <span class="show-name">计算公式：</span>
        <!-- <Input disabled v-model="formula" style="width:400px"></Input> -->
        <span class="show-content">{{formula}}</span>
      </div>
      <Button type="error" size="small" @click="handleClear" style="margin:10px 0 0 70px;">清空</Button>
      <div slot="footer">
        <Button type="default" @click="modal=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    goods: Array,
    design: String,
    chDesign: String,
    mulaName: String,
    mula: String
  },
  watch: {
    mulaName(val) {
      console.log(val);
      this.formula = val;
    },
    mula(val) {
      // console.log(val);
    }
  },
  data() {
    return {
      cardForm: [
        {
          nameSort: 1,
          status: 1,
          model: "",
          show: true,
          attributeName: "",
          items: [
            {
              value: "",
              price: null,
              nameSort: 1,
              status: 1
            }
          ]
        }
      ],
      bindex: 0,
      sindex: 0,
      selects: [
        {
          value: "SELECT",
          label: "单项选择"
        },
        {
          value: "TEXT",
          label: "手动输入"
        }
      ],
      rules: {
        attributeName: [
          { required: true, message: "请填写规格名称", trigger: "blur" }
        ],
        price: [
          {
            required: true,
            message: "请填写单价",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      attributeRules: {
        attributeValue: [
          { required: true, message: "请填写规格值", trigger: "blur" }
        ],
        ratio: [
          {
            required: true,
            message: "请填写规格系数",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      modal: false,
      modalTitle: "",
      show: false,
      name: "",
      symbol: "",
      formula: "",
      code: "",
      symbolList: [
        { value: "+", label: " + " },
        { value: "-", label: " - " },
        { value: "*", label: " * " },
        { value: "/", label: " / " },
        { value: "(", label: " ( " },
        { value: ")", label: " ) " }
      ]
      // model1: "",
      // show: true
    };
  },
  created() {
    if (this.chDesign) {
      this.formula = this.chDesign;
      this.show = true;
    }
  },
  methods: {
    addAttribute() {
      // 获取数组最后一个元素的big值，然后转成字母
      let y = this.goods[this.goods.length - 1].attributeCode.charCodeAt();
      let ascll = y + 1;
      // console.log("112222", this.goods);
      ascll = String.fromCharCode(ascll);

      this.bindex = this.bindex + 1;

      this.goods.push({
        attributeCode: ascll,
        nameSort: this.bindex,
        status: 1,
        type: "SELECT",
        show: true,
        price: null,
        productAttributeValueSaveVOList: [
          {
            small: 98,
            attributeValueCode: "a",
            ratio: null,
            nameSort: 0,
            status: 1
          }
        ]
      });
      this.sindex = 1;
    },

    /**
     * 下拉选择事件
     */
    selectChange(value, index) {
      // console.log(value, index);
      if (value.value == "TEXT") {
        this.goods[index].show = false;
      } else {
        // this.goods[index].show = true;
        this.goods[index].productAttributeValueSaveVOList.push({
          small: 98,
          attributeValueCode: "a",
          ratio: null,
          nameSort: 0,
          status: 1
        });
      }
    },

    /**
     * 添加规格详情行
     */
    addList(i) {
      // 外的规格
      let addlist = this.goods[i];
      let list = addlist.productAttributeValueSaveVOList;
      // 规格详情行的条数
      let leng = list.length;
      let code = list[leng - 1].attributeValueCode;
      let y = code.charCodeAt();
      let ascll = String.fromCharCode(y + 1);

      // console.log(ascll);
      this.sindex = this.sindex + 1;
      list.push({
        attributeValueCode: ascll,
        nameSort: this.sindex,
        ratio: null,
        status: 1
      });
      // console.log(list);
    },

    /**
     * 删除规格详情行
     */
    removeList(i, index) {
      let addlist = this.goods[i].productAttributeValueSaveVOList;
      if (addlist.length > 1) {
        addlist.splice(index, 1);
      } else {
        this.$Message.error("至少保留一条规格");
      }
    },
    /**
     * 关闭卡
     */
    closeCard(row, index) {
      // console.log(row, index);
      // console.log(index);
      if (this.goods.length > 1) {
        this.goods.splice(index, 1);
      } else {
        this.$Message.error("至少保留一条规格");
      }
    },

    /**
     * 校验输入框
     */
    checkForm() {
      let check;
      let arr = this.$refs.cardName;
      let brr = this.$refs.item;
      // 遍历大框内容
      for (let i = 0, leng = arr.length; i < leng; i++) {
        arr[i].validate(valid => {
          if (valid == false) {
            check = false;
            return check;
          } else {
            // 遍历内框行内容，如果值存在则通过
            if (brr.length > 0) {
              for (let j = 0, leng = brr.length; j < leng; j++) {
                brr[j].validate(valid => {
                  if (valid == false) {
                    check = false;
                    return check;
                  } else {
                    check = true;
                    return check;
                  }
                });
              }
            } else {
              check = true;
              return check;
            }
          }
        });
      }
      return check;
    },

    /**
     * 新增或修改公式
     */
    handleChange() {
      this.modal = true;
      this.modalTitle = "新增计算公式";
    },
    /**
     * 选择名称
     */
    selectName(item) {
      this.formula = this.formula.concat(item.attributeName);
      this.code = this.code.concat(item.attributeCode);
      this.onChange();
    },
    /**
     * 选择符号
     */
    selectSymbol(item) {
      this.formula = this.formula.concat(item.label);
      this.code = this.code.concat(item.value);
    },
    /**
     * 清空按钮事件
     */
    handleClear() {
      // console.log("101");
      this.formula = "";
      this.code = "";
      this.$emit("sendMessage", { chDesign: "", design: "" });
    },
    /**
     * 提交按钮
     */
    handleSubmit() {
      // console.log("000");
      // this.chDesign = this.formula;
      this.$emit("sendMessage", { chDesign: this.formula, design: this.code });
      this.show = true;
      this.modal = false;
    },
    onChange() {
      // this.name = "";
      // this.symbol = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  margin-bottom: 10px;
}
.select-name {
  display: flex;
  padding-bottom: 20px;
  span {
    width: 70px;
    line-height: 32px;
  }
}
.info {
  display: flex;
  span {
    width: 70px;
    line-height: 32px;
  }
}
.tit {
  font-size: 12px;
  font-weight: bold;
}
.symbol {
  display: flex;
  margin: 12px 0;
  .symbol-name {
    // display: inline-block;
    width: 70px;
    line-height: 32px;
    height: 32px;
  }
  .span {
    font-size: 16px;
    font-weight: bold;
    margin-right: 6px;
    border-radius: 4px;
    border: 1px solid #ddd;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 4px;
    cursor: pointer;
    color: #fff;
    background: #2d8cf0;
    width: 30px;
    text-align: center;
  }
  .span:hover {
    background: #5cadff;
  }
}
.code {
  display: flex;
  .code-name {
    height: 30px;
    line-height: 30px;
  }
  .span {
    margin-right: 6px;
    border-radius: 4px;
    border: 1px solid #ddd;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 4px;
    cursor: pointer;
    color: #fff;
    background: #2d8cf0;
  }
  .span:hover {
    background: #5cadff;
  }
}
.show {
  display: flex;
  .show-name {
    // display: inline-block;
    width: 70px;
    line-height: 32px;
    height: 32px;
  }
  .show-content {
    display: inline-block;
    min-width: 100px;
    font-size: 12px;
    padding: 0 6px;
    height: 30px;
    line-height: 28px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #eee;
  }
}
</style>