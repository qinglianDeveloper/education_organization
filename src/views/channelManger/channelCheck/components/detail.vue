<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-06 13:45:54
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-06 18:17:14
 -->
<template>
  <Form :model="formData" :label-width="140">
    <div class="twoitem">
      <FormItem label="公司名称:" prop="corpName" class="item">
        <span>{{formData.corpName}}</span>
      </FormItem>
      <FormItem label="公司简称:" prop="channelName" class="item">
        <span>{{formData.channelName}}</span>
      </FormItem>
    </div>
    <div class="twoitem">
      <FormItem label="联系人姓名:" prop="connact" class="item">
        <span>{{formData.connact}}</span>
      </FormItem>
      <FormItem label="联系人手机号:" prop="mobilePhone" class="item">
        <span>{{formData.mobilePhone}}</span>
      </FormItem>
    </div>
    <FormItem
      label="统一社会信用代码:"
      prop="uniformSocialCreditCode"
      class="item"
      style="background:rgb(238,244,255);width:730px"
    >
      <span style="width:600px">{{formData.uniformSocialCreditCode}}</span>
    </FormItem>
    <div style="display:flex">
      <FormItem label="营业执照:" prop="businessLicense" class="item">
        <div class="demo-upload-list">
          <img :src="formData.businessLicense" />
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(formData.businessLicense)"></Icon>
          </div>
        </div>
      </FormItem>
      <FormItem ref="sealAuthorizationBookUrl" label="授权书:" prop="sealAuthorizationBookUrl">
        <div class="demo-upload-list">
          <img :src="formData.sealAuthorizationBookUrl" />
          <div class="demo-upload-list-cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(formData.sealAuthorizationBookUrl)"
            ></Icon>
          </div>
        </div>
      </FormItem>
      <Modal title="图片查看" v-model="visible">
        <img :src="imageUrl" style="width: 100%" />
      </Modal>
    </div>
  </Form>
</template>
<script>
export default {
  props: {
    formData: {}
  },
  data() {
    return {
      imageUrl: "",
      visible: false
    };
  },
  methods: {
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