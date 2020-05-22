<!-- 呼叫中心主页 --->
<template>
  <div class="call-home">
    <!-- <p>叫中心主页</p> -->
    <iframe id="thirdSiteIframe" style="width: 1280px; height: 600px;"></iframe>
  </div>
</template>
<script>
export default {
  name: "call-home",
  created() {},
  mounted() {
    this.sendMessage1();
  },
  data() {
    return {
      agentUrl: "http://agent2.jiaxincloud.com/"
    };
  },
  methods: {
    sendMessage1() {
      var content = {
        type: 3,
        data: 3
      };
      console.log(
        window.document.getElementById("thirdSiteIframe").contentWindow
      );
      window.document
        .getElementById("thirdSiteIframe")
        .contentWindow.postMessage(JSON.stringify(content), this.agentUrl);
    }
  }
};
</script>
<style lang="scss" scoped>
.call-home {
  padding: 16px;
}
</style>