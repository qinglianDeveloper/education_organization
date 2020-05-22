<!-- 步骤三 -->
<template>
  <div>
    <tinymce-editor
      ref="editor"
      v-model="msg"
      :disabled="disabled"
      :language="language"
      :skin="skin"
      @onClick="onClick"
    ></tinymce-editor>
  </div>
</template>
<script>
import TinymceEditor from "../tinymce-editor/tinymce-editor";
import config from "@/config";
export default {
  components: {
    TinymceEditor
  },
  data() {
    return {
      disabled: false,
      msg: "",
      language: "zh_CN",
      skin: "oxide"
    };
  },
  methods: {
    // 鼠标单击的事件
    onClick(e, editor) {
      // console.log("Element clicked");
      // console.log(e);
      // console.log(editor);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>