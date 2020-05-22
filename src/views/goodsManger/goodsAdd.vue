<!-- 新增商品 -->
<template>
  <Card class="goods-add">
    <div class="header" ref="header">
      <Row type="flex" justify="space-between">
        <p style="font-size:16px;color:#288cf0;margin-bottom:16px">当前正在进行第 {{ current + 1 }} 步</p>
        <Button @click="handelCancel" size="small" icon="md-close" style="font-size:12px">关闭</Button>
      </Row>
      <Steps :current="current">
        <Step title="填写商品信息"></Step>
        <Step title="填写规格及详情"></Step>
        <Step title="填写商品详情"></Step>
      </Steps>
    </div>
    <!-- 步骤内容 -->
    <Row>
      <div ref="content" :style="{height:`${contentHeight}px`,padding:'20px 10%'}" class="content">
        <addOne v-show="addone" :goods="productDetailVO" ref="mychild"></addOne>
        <addTwo
          v-show="addtwo"
          :goods="goodsAttribute"
          :design="formula"
          :chDesign="formulaName"
          ref="two"
          @sendMessage="onSendMessage"
        ></addTwo>
        <addThree v-show="addthree" ref="three"></addThree>
      </div>
    </Row>
    <!-- 操作步骤 -->
    <Row type="flex" justify="center">
      <div ref="footer" class="footer">
        <Button type="dashed" @click="previous" v-if="previousShow">{{previousContent}}</Button>
        <Button type="primary" @click="next">{{nextContent}}</Button>
      </div>
    </Row>
  </Card>
</template>
<script>
import addOne from "@/components/goodsAdd/add-one";
import addTwo from "@/components/goodsAdd/add-two";
import addThree from "@/components/goodsAdd/add-three";
import { addGoods } from "@/api";
export default {
  name: "goods-add",
  components: {
    addOne,
    addTwo,
    addThree
  },
  data() {
    return {
      test: "",
      current: 0,
      contentHeight: 0, //内容高度
      previousShow: false,
      previousContent: "上一步，填写规格及详情",
      nextContent: "下一步，填写规格及详情",
      addone: true,
      addtwo: false,
      addthree: false,
      productDetailVO: { stock: 1, sort: 1, mainImageUrl: "", bannerUrls: "" },
      goodsAttribute: [
        {
          big: 66,
          attributeCode: "A",
          nameSort: 0,
          status: 1,
          type: "SELECT",
          show: true,
          attributeName: "",
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
        }
      ],
      productDetail: "",
      formula: "",
      formulaName: ""
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    /**
     * 页面初始化
     */
    init() {
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },

    /**
     * 修改计算公式的值
     */
    onSendMessage(obj) {
      this.formulaName = obj.chDesign;
      this.formula = obj.design;
      // console.log(obj);
    },

    /**
     * 计算页面高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.contentHeight = pageHeight - headerHeight - footerHeight - 72;
    },

    /**
     * 下一步方法
     */
    next() {
      // console.log("下一步");
      let check = this.$refs.mychild.checkForm();
      // console.log(check);
      // console.log("信息", this.goodsForm);
      // console.log("屬性", this.goodsAttribute);
      // console.log("富文本", this.$refs.three.msg);
      let checkTwo = this.$refs.two.checkForm();
      // console.log(checkTwo);

      if (check) {
        // if (this.current < 3) {
        //   this.current = 2;
        // } else {
        //   this.current += 1;
        // }
        if (this.current < 2) {
          if (this.current == 1) {
            // console.log("2");
            if (checkTwo) {
              this.current += 1;
            } else {
              this.current = 1;
              // console.log("没通过");
            }
          } else {
            this.current += 1;
          }

          switch (this.current) {
            case 0:
              this.nextContent = "下一步，填写规格及详情";
              this.addone = true;
              this.addtwo = false;
              this.addthree = false;
              break;
            case 1:
              this.nextContent = "下一步，填写商品详情";
              this.previousContent = "上一步，填写商品信息";
              this.previousShow = true;
              this.addone = false;
              this.addtwo = true;
              this.addthree = false;
              break;
            case 2:
              this.nextContent = "保存";
              this.previousContent = "上一步，填写规格及详情";
              this.previousShow = true;
              this.addone = false;
              this.addtwo = false;
              this.addthree = true;
              break;

            default:
              break;
          }
        } else {
          // console.log("保存");
          let obj = {};
          this.productDetail = this.$refs.three.msg;
          obj.productSaveVO = this.productDetailVO;
          obj.productSaveVO.formula = this.formula;
          obj.productSaveVO.formulaName = this.formulaName;

          obj.productAttributeSaveVOList = this.goodsAttribute;
          obj.productDetail = this.productDetail;
          // obj.express = this.design;
          var jsp = JSON.stringify(obj);

          // console.log(jsp);
          addGoods(jsp).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("新增成功！");
              this.$router.push({ name: "goodsList" });
            } else {
              this.$Message.error("新增失败！");
            }
          });
        }
      }
    },

    /**
     * 上一步方法
     */
    previous() {
      if (this.current == 0) {
        this.current = 1;
        // this.current = 0;
      } else {
        this.current -= 1;
      }
      switch (this.current) {
        case 0:
          this.previousShow = false;
          this.addone = true;
          this.addtwo = false;
          this.addthree = false;
          break;
        case 1:
          this.previousShow = true;
          this.nextContent = "下一步，填写商品详情";
          this.previousContent = "上一步，填写商品信息";
          this.addone = false;
          this.addtwo = true;
          this.addthree = false;
          break;
        case 2:
          this.previousShow = true;
          this.nextContent = "保存";
          this.previousContent = "上一步，填写规格及详情";
          this.addone = false;
          this.addtwo = false;
          this.addthree = true;
          break;

        default:
          break;
      }
    },

    /**
     * 取消按钮方法
     */
    handelCancel() {
      this.$Modal.confirm({
        title: "确认离开",
        content: "您确认要离开新增?",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.goods-add {
  .content {
    border: 1px solid #dcdee2;
    border-radius: 4px;
    margin: 20px 0;
    overflow: auto;
  }
  .footer {
    button:first-child {
      margin-right: 10px;
    }
  }
}
</style>