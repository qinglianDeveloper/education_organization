<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 23:10:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-11 14:57:02
 -->
<template>
  <Modal
    v-model="detailStatus"
    title="用户代理详情"
    :mask-closable="false"
    @on-cancel="handleCancle"
    :width="800"
  >
    <Form ref="formValidate" :model="form" :label-width="140" style="height:600px;overflow:auto">
      <div class="twoitem">
        <FormItem label="所属销售:" prop="salesId" class="item">
          <span>{{form.salesName}}</span>
        </FormItem>
        <FormItem label="状态:" prop="status" class="item">
          <span>{{form.status}}</span>
        </FormItem>
      </div>
      <div class="twoitem">
        <FormItem label="企业名称:" prop="companyName" class="item">
          <span>{{form.companyName}}</span>
        </FormItem>
        <FormItem label="公司简称:" prop="channelName" class="item">
          <span>{{form.channelName}}</span>
        </FormItem>
      </div>
      <div class="twoitem">
        <FormItem label="联系人姓名:" prop="connact" class="item">
          <span>{{form.connact}}</span>
        </FormItem>
        <FormItem label="联系人手机号:" prop="mobilePhone" class="item">
          <span>{{form.mobilePhone}}</span>
        </FormItem>
      </div>
      <FormItem
        label="统一社会信用代码:"
        prop="uniformSocialCreditCode"
        class="item"
        style="background:rgb(238,244,255);width:730px"
      >
        <span style="width:600px">{{form.uniformSocialCreditCode}}</span>
      </FormItem>
      <div class="twoitem">
        <FormItem label="法人姓名:" prop="legalPersonName" class="item">
          <span>{{form.legalPersonName}}</span>
        </FormItem>
        <FormItem label="法人联系方式:" prop="legalPersonPhone" class="item">
          <span>{{form.legalPersonPhone}}</span>
        </FormItem>
      </div>
      <div class="twoitem">
        <FormItem label="注册资金:" prop="registMoney" class="item">
          <span>{{form.registMoney}}</span>
        </FormItem>
        <FormItem label="职工人数:" prop="numberOfWorkers" class="item">
          <span>{{form.numberOfWorkers}}</span>
        </FormItem>
      </div>
      <div class="twoitem">
        <FormItem label="主要客户群体类型:" prop="customerType" class="item">
          <span>{{form.customerType}}</span>
        </FormItem>
        <FormItem label="主营业务内容:" prop="businessDescription" class="item">
          <span>{{form.businessDescription}}</span>
        </FormItem>
      </div>
      <FormItem
        label="单位地址:"
        prop="companyAddress"
        class="item"
        style="background:rgb(238,244,255);width:730px"
      >
        <span style="width:600px">{{form.companyAddress}}</span>
      </FormItem>
      <div style="display:flex">
        <FormItem label="营业执照:" prop="businessLicense" class="item">
          <div class="demo-upload-list">
            <img :src="form.businessLicense" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(form.businessLicense)"></Icon>
            </div>
          </div>
        </FormItem>
        <FormItem ref="sealAuthorizationBookUrl" label="授权书:" prop="sealAuthorizationBookUrl">
          <div class="demo-upload-list">
            <img :src="form.sealAuthorizationBookUrl" />
            <div class="demo-upload-list-cover">
              <Icon
                type="ios-eye-outline"
                @click.native="handleView(form.sealAuthorizationBookUrl)"
              ></Icon>
            </div>
          </div>
        </FormItem>
      </div>
      <FormItem
        label="一级佣金比例:"
        prop="commission"
        class="item"
        style="background:rgb(238,244,255);width:730px"
      >
        <span>{{form.commissionRate}}</span>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleCancle">确定</Button>
    </div>
    <Modal title="图片查看" v-model="visible">
      <img :src="imageUrl" style="width: 100%" />
    </Modal>
  </Modal>
</template>
<script>
import { getByIsvId } from "@/api";
export default {
  props: {
    status: {
      type: Boolean
    },
    detailId: {}
  },
  watch: {
    status(val) {
      this.detailStatus = val;
      if (val) {
        this.getFormInfo();
      }
    }
  },
  data() {
    return {
      detailStatus: false,
      form: {},
      visible: false,
      imageUrl: ""
    };
  },
  methods: {
    getFormInfo() {
      getByIsvId({ id: this.detailId }).then(res => {
        if (res.code == 200) {
          this.form = res.result;
          if (this.form.status) {
            switch (this.form.status) {
              case "ENABLE":
                this.form.status = "有效";
                break;
              case "DISABLE":
                this.form.status = "无效";
                break;
            }
          }
        }
      });
    },
    handleCancle() {
      this.detailStatus = false;
      this.$emit("handleCancle");
    },
    handleView(url) {
      this.visible = true;
      this.imageUrl = url;
    }
  }
};
</script>
<style lang="scss" scoped>
.twoitem {
  display: flex;
  .item {
    background: rgb(238, 244, 255);
    span {
      display: inline-block;
      width: 210px;
    }
  }
  .item:first-child {
    margin-right: 30px;
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
</style>