<!-- 在线客服主页 -->
<template>
  <!-- test -->
  <div class="customer-server">
    <div class="btns">
      <Button type="error" @click="callcenter" style="margin-right:10px">切换呼叫</Button>
      <Button type="success" @click="coustomer">在线客服</Button>
    </div>
    <iframe
      :src="iframeSrc"
      frameborder="0"
      class="server"
      id="thirdSiteIframe"
      allow="geolocation; microphone; camera; midi; encrypted-media;"
    ></iframe>
  </div>
</template>
<script>
import { getJxToken } from "@/api";
export default {
  name: "customer-server",
  data() {
    return {
      iframeSrc: "",
      modal: false,
      jxToken: "",
      agentUrl: "https://agent2.jiaxincloud.com/",
      active: 3
    };
  },
  created() {
    this.getJxToken();
    // this.loginByToke(this.jxToken);
  },
  methods: {
    callcenter() {
      var content = {
        type: 3,
        data: 3
      };
      $("#thirdSiteIframe")[0].contentWindow.postMessage(
        JSON.stringify(content),
        this.agentUrl
      );
    },
    coustomer() {
      var content = {
        type: 3,
        data: 1
      };
      $("#thirdSiteIframe")[0].contentWindow.postMessage(
        JSON.stringify(content),
        this.agentUrl
      );
    },

    jiaxinDoCallback(e) {
      var cb = eval("(" + e.data + ")");
      if (cb.eventType == "clickKey") {
        var cb = eval("(" + e.data + ")");
        //					if(cb.eventType == "calling") {
        $("#calling").html("新的电话：" + result.phone);
      }
    },

    getJxToken() {
      getJxToken().then(res => {
        // console.log("1321321", res);
        if (res.code == 200) {
          this.jxToken = res.result;
          this.loginByToke(this.jxToken);
          window.addEventListener(
            "message",
            () => {
              this.jiaxinDoCallback();
            },
            false
          );
        }
      });
    },
    loginByToke(jxToken) {
      var agentURL = "//agent2.jiaxincloud.com/";
      //				var thirdSite = "https://thirdparty.site.com"; //第三方系统域名
      var username = jxToken.username;
      var loginToken = jxToken.token;
      var url =
        "https://" +
        agentURL +
        "user/loginByToken?username=" +
        username +
        "&token=" +
        loginToken +
        "&thirdParty=embedIndex&backupPage=/embed/embedLogin.html&type=CBAS";
      // $("#thirdSiteIframe")[0].src = url; //此处为第三方系统iframe的ID(需注意)
      this.iframeSrc = url;
      console.log(this.iframeSrc);
    }
  }
};
</script>
<style lang="scss" scoped>
.customer-server {
  width: 100%;
  height: 100%;
  position: relative;
  .btns {
    position: absolute;
    top: 10px;
    left: 10px;
    background: white;
    padding: 10px;
  }
  .open-big {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.server {
  width: 100%;
  height: 100%;
}
.conter {
  margin: 0;
}
</style>