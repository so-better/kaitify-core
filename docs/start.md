

#### 更新日志<Badge type="tip" text="^1.9.0" />
<div id="editor"></div>

<script setup>
import { ref, onMounted } from 'vue'
import { KNode, Editor } from "../lib/kaitify-core.es"

const editor = ref()

onMounted(()=>{
  editor.value = Editor.configure({
    el:'#editor'
  })
})
</script>
<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>