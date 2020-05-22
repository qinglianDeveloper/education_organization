<template>
  <div class="goods-details">
    <div class="content" :style="{height:`${mainHeight}px`}">
      <!-- 商品基本信息 -->
      <Card>
        <p slot="title">商品基本信息</p>
        <Form :label-width="150" class="info">
          <FormItem label="商品名称：">
            <span class="span">{{info.productName}}</span>
          </FormItem>
          <FormItem label="主图：">
            <div class="demo-upload-list">
              <img :src="info.mainImageUrl" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(info.mainImageUrl)"></Icon>
              </div>
            </div>
          </FormItem>
          <FormItem label="轮播图：">
            <div class="demo-upload-list" v-for="(item,index) in bannerUrls" :key="index">
              <img :src="item" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              </div>
            </div>
          </FormItem>
          <FormItem label="商品分类：">
            <span class="span">{{info.categoryName}}</span>
          </FormItem>
          <FormItem label="副标题：">
            <span class="span">{{info.subTitle}}</span>
          </FormItem>
          <FormItem label="积分返佣比列：">
            <span class="span">{{info.creditRakebackRatio}}</span>
          </FormItem>
          <FormItem label="返佣比列：">
            <span class="span">{{info.cashRakebackRatio}}</span>
          </FormItem>
          <FormItem label="库存：">
            <span class="span">{{info.stock}}</span>
          </FormItem>
          <FormItem label="是否生成工单">
            <span class="span">{{info.isAutoWorkorder=="0"?"否":"是"}}</span>
          </FormItem>
          <FormItem label="是否上架：">
            <span class="span">{{info.status=="DISABLE"?"已下架":"已上架"}}</span>
          </FormItem>
          <FormItem label="商品排序：">
            <span class="span">{{info.sort}}</span>
          </FormItem>
        </Form>
      </Card>
      <!-- 商品规格 -->
      <Card style="margin-top:20px;">
        <p slot="title">商品规格</p>
        <Form
          class="info"
          v-for="(item,index) in attribute"
          :key="index"
          style="border-bottom: 1px solid #ddd;padding-top:16px;"
        >
          <FormItem label="规格名称：" :label-width="100">
            <span class="span">{{item.attributeName}}</span>
          </FormItem>
          <FormItem label="单价：" :label-width="80">
            <span class="span">{{item.price}}</span>
          </FormItem>
          <FormItem label="规格详情：" :label-width="100">
            <div
              v-for="(arit,i) in item.productAttributeValueDetailVOList"
              :key="i"
              class="details"
            >
              <span style="margin-right:10px">规格值：{{arit.attributeValue}};</span>
              <span>规格系数：{{arit.ratio}}</span>
            </div>
          </FormItem>
        </Form>
      </Card>
      <!-- 商品详情 -->
      <Card style="margin-top:20px;">
        <p slot="title">商品详情</p>
        <div v-html="detail"></div>
      </Card>
    </div>
    <!-- 大图弹框 -->
    <Modal title="图片查看" v-model="visible">
      <div style="text-align:center">
        <img :src="showUrl" v-if="visible" style="width:100%" />
      </div>
    </Modal>
  </div>
</template>
<script>
import { getGoodsDetails } from "@/api";
export default {
  name: "goods-details",
  data() {
    return {
      info: {}, //商品基本信息
      attribute: [], //商品属性规格
      detail: "", //商品详情.
      visible: false,
      bannerUrls: [],
      mainHeight: null
    };
  },
  created() {
    this.getGoodsDetails();
  },
  mounted() {
    this.pageHeight();
  },
  methods: {
    getGoodsDetails() {
      let id = this.$route.query.id;
      getGoodsDetails(id).then(res => {
        if (res.code == 200) {
          // console.log(res.result);
          this.info = res.result.productDetailVO;
          this.attribute = res.result.productAttributeDOList;
          this.detail = res.result.productDetail;
          let urls = res.result.productDetailVO.bannerUrls;
          if (urls) {
            this.bannerUrls = urls.split(",");
          }
          //   console.log(this.bannerUrls);
        }
      });
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      this.mainHeight = pageHeight - 32;
    },
    /**
     * 图片查看按钮
     */
    handleView(item) {
      // console.log(item);
      this.showUrl = item;
      this.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.goods-details {
  padding: 16px;
  .content {
    height: calc(100% - 32px);
    overflow: auto;
    .info {
      display: flex;
      flex-wrap: wrap;
      .span {
        display: inline-block;
        min-width: 100px;
        padding: 0 14px;
        background: rgb(240, 249, 255);
        border: 1px solid rgb(88, 194, 255);
        border-radius: 4px;
        height: 34px;
      }
    }
    .details {
      float: left;
      margin-right: 4px;
      min-width: 100px;
      padding: 0 14px;
      background: rgb(240, 249, 255);
      border: 1px solid rgb(88, 194, 255);
      border-radius: 4px;
    }
  }
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }
  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }
  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}
</style>