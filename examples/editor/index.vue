<template>
	<div class="editor">
		<div style="margin-bottom: 20px">
			<button @click="queryTextStyle">查询样式</button>
			<button style="margin-left: 10px" @click="setTextStyle">设置样式</button>
			<button style="margin-left: 10px" @click="removeTextStyle">移除样式</button>
		</div>
		<div class="editor-content"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			value: `<p>3<video src="https://video.699pic.com/videos/13/66/20/b_eIkQU5g6sVnU1696136620_10s.mp4" style="width:300px;" autoplay muted loop></video>这是一个视频</p><blockquote><span>&nbsp;MVI内提供了很多现有的辅助样式类，用于简单的样式修改，可以直接使用，无需你再次手写样式&nbsp;&nbsp;&nbsp;</span></blockquote><p><br></p><p><br></p><h5><span>Y轴滚动回弹：解决dom元素在ios端的滚动条滚动不流畅、弹性动画丢失的问题</span></h5><p><br></p><pre mvi-editor-element-key="19" mvi-hljs-language=""><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-scrolling-touch"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>文本样式</span></h5><p><br></p><pre mvi-editor-element-key="48"><span class="mvi-hljs-comment">&lt;!--&nbsp;错误文本样式&nbsp;--&gt;</span><span>&nbsp;
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span>&nbsp;</span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-error"</span><span>&gt;</span></span><span>Hello&nbsp;World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="77"><span class="mvi-hljs-comment">&lt;!--&nbsp;警告文本样式&nbsp;--&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span>&nbsp;</span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-warn"</span><span>&gt;</span></span><span>Hello&nbsp;World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="106"><span class="mvi-hljs-comment">&lt;!--&nbsp;信息文本样式&nbsp;--&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span>&nbsp;</span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-info"</span><span>&gt;</span></span><span>Hello&nbsp;World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="135"><span class="mvi-hljs-comment">&lt;!-- 成功文本样式 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-success"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="164"><span class="mvi-hljs-comment">&lt;!-- 首要文本样式 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-primary"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="193"><span class="mvi-hljs-comment">&lt;!-- 链接文本样式 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-link"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="222"><span class="mvi-hljs-comment">&lt;!-- 柔和文本样式 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-muted"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="251"><span class="mvi-hljs-comment">&lt;!-- 白色文本样式 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-white"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="280"><span class="mvi-hljs-comment">&lt;!-- 副文本样式 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-sub"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>背景样式</span></h5><p><br></p><pre mvi-editor-element-key="318"><span class="mvi-hljs-comment">&lt;!-- 成功背景色 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-bg-success"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="347"><span class="mvi-hljs-comment">&lt;!-- 警告背景色 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-bg-warn"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="376"><span class="mvi-hljs-comment">&lt;!-- 信息背景色 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-bg-info"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="405"><span class="mvi-hljs-comment">&lt;!-- 首要背景色 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-bg-primary"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="434"><span class="mvi-hljs-comment">&lt;!-- 错误背景色 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-bg-error"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="463"><span class="mvi-hljs-comment">&lt;!-- 柔和背景色 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-bg-muted"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>文本对齐方式</span></h5><p><br></p><pre mvi-editor-element-key="501"><span class="mvi-hljs-comment">&lt;!-- 左对齐 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-left"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="530"><span class="mvi-hljs-comment">&lt;!-- 右对齐 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-right"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="559"><span class="mvi-hljs-comment">&lt;!-- 居中对齐 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-center"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="588"><span class="mvi-hljs-comment">&lt;!-- 两端对齐 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-justify"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>水平垂直居中：使用flex来设置元素内容的水平和垂直居中</span></h5><p><br></p><pre mvi-editor-element-key="626"><span class="mvi-hljs-comment">&lt;!-- 块元素内容水平垂直居中 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-flex-center"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="655" mvi-hljs-language=""><span class="mvi-hljs-comment">&lt;!-- 行内元素内容水平垂直居中 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-inline-center"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>flex布局</span></h5><p><br></p><pre mvi-editor-element-key="693"><span class="mvi-hljs-comment">&lt;!-- 从左到右排列 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-flex-start"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="722"><span class="mvi-hljs-comment">&lt;!-- 从右到左排列 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-flex-end"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="751"><span class="mvi-hljs-comment">&lt;!-- 两端排列 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-flex-between"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="780"><span class="mvi-hljs-comment">&lt;!-- 等分排列 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-flex-around"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>圆角辅助</span></h5><p><br></p><pre mvi-editor-element-key="818"><span class="mvi-hljs-comment">&lt;!-- 默认圆角 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-radius-default"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="847"><span class="mvi-hljs-comment">&lt;!-- 大圆角 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-radius-round"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="876"><span class="mvi-hljs-comment">&lt;!-- 圆形 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-radius-circle"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>文本粗细</span></h5><p><br></p><pre mvi-editor-element-key="914"><span class="mvi-hljs-comment">&lt;!-- 加粗 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-bold"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="943"><span class="mvi-hljs-comment">&lt;!-- 默认 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-normal"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="972"><span class="mvi-hljs-comment">&lt;!-- 变细 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-light"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>外边距辅助：类名最后的数字取值范围为0-20</span></h5><p><br></p><pre mvi-editor-element-key="1010"><span class="mvi-hljs-comment">&lt;!-- 外边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-m-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1039"><span class="mvi-hljs-comment">&lt;!-- 左外边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-ml-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1068"><span class="mvi-hljs-comment">&lt;!-- 右外边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-mr-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1097"><span class="mvi-hljs-comment">&lt;!-- 上外边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-mt-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1126"><span class="mvi-hljs-comment">&lt;!-- 下外边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-mb-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1155"><span class="mvi-hljs-comment">&lt;!-- 水平外边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-mx-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1184"><span class="mvi-hljs-comment">&lt;!-- 垂直外边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-my-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>内边距辅助：类名最后数字取值范围为0-20</span></h5><p><br></p><pre mvi-editor-element-key="1222"><span class="mvi-hljs-comment">&lt;!-- 内边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-p-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1251"><span class="mvi-hljs-comment">&lt;!-- 左内边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-pl-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1280"><span class="mvi-hljs-comment">&lt;!-- 右内边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-pr-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1309"><span class="mvi-hljs-comment">&lt;!-- 上内边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-pt-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1338"><span class="mvi-hljs-comment">&lt;!-- 下内边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-pb-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1367"><span class="mvi-hljs-comment">&lt;!-- 水平内边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-px-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1396"><span class="mvi-hljs-comment">&lt;!-- 垂直内边距 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-py-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>文本省略</span></h5><p><br></p><pre mvi-editor-element-key="1434"><span class="mvi-hljs-comment">&lt;!-- 单行文本溢出省略 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-text-ellipsis"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1463"><span class="mvi-hljs-comment">&lt;!-- 多行文本溢出省略，类名后的数字取值范围为1-5，表示超出1-5行后显示省略号 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-ellipsis-1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>鼠标悬浮手指</span></h5><p><br></p><pre mvi-editor-element-key="1501"><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-cursor-pointer"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>输入框默认样式：仅在input元素上有效</span></h5><p><br></p><pre mvi-editor-element-key="1535"><span>&lt;</span><span class="mvi-hljs-built_in">input</span><span> </span><span class="mvi-hljs-built_in">type</span><span>=</span><span class="mvi-hljs-string">"text"</span><span> </span><span class="mvi-hljs-keyword">class</span><span>=</span><span class="mvi-hljs-string">"mvi-default-input"</span><span> /&gt;</span></pre><p><br></p><p><br></p><h5><span>文本域默认样式：仅在textarea元素上有效</span></h5><p><br></p><pre mvi-editor-element-key="1567"><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">textarea</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-default-textarea"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">textarea</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>按钮默认样式：任意元素有效</span></h5><p><br></p><pre mvi-editor-element-key="1596"><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-default-btn"</span><span>&gt;</span></span><span>Button</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>字体大小辅助</span></h5><p><br></p><pre mvi-editor-element-key="1630"><span class="mvi-hljs-comment">&lt;!-- 较小的字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-small"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1659"><span class="mvi-hljs-comment">&lt;!-- 默认字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-default"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1688"><span class="mvi-hljs-comment">&lt;!-- h1标题字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-h1"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1717"><span class="mvi-hljs-comment">&lt;!-- h2标题字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-h2"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1746"><span class="mvi-hljs-comment">&lt;!-- h3标题字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-h3"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1775"><span class="mvi-hljs-comment">&lt;!-- h4标题字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-h4"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1804"><span class="mvi-hljs-comment">&lt;!-- h5标题字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-h5"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1833"><span class="mvi-hljs-comment">&lt;!-- h6标题字体 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">p</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-font-h6"</span><span>&gt;</span></span><span>Hello World</span><span class="mvi-hljs-tag"><span>&lt;/</span><span class="mvi-hljs-name">p</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>基于断点的隐藏辅助类</span></h5><p><br></p><pre mvi-editor-element-key="1871"><span class="mvi-hljs-comment">&lt;!-- 在任意情况下都隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1895"><span class="mvi-hljs-comment">&lt;!-- 小于1920px下隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-down-lg"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1919"><span class="mvi-hljs-comment">&lt;!-- 小于1440px下隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-down-md"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1943"><span class="mvi-hljs-comment">&lt;!-- 小于992px下隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-down-sm"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1967"><span class="mvi-hljs-comment">&lt;!-- 小于640px下隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-down-xs"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="1991"><span class="mvi-hljs-comment">&lt;!-- 大于等于1920px时隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-up-xl"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2015"><span class="mvi-hljs-comment">&lt;!-- 大于等于1440px时隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-up-lg"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2039"><span class="mvi-hljs-comment">&lt;!-- 大于等于992px时隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-up-md"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2063"><span class="mvi-hljs-comment">&lt;!-- 大于等于640px时隐藏元素 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-hidden-up-sm"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>阴影辅助类</span></h5><p><br></p><pre mvi-editor-element-key="2096"><span class="mvi-hljs-comment">&lt;!-- 显示阴影效果 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">div</span><span> </span><span class="mvi-hljs-attr">class</span><span>=</span><span class="mvi-hljs-string">"mvi-shadow"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">div</span><span>&gt;</span></span></pre><p><br></p><p><br></p><h5><span>vue动画辅助类（需要结合vue的transition组件，该辅助类作为transition组件的name值直接传入）</span></h5><p><br></p><pre mvi-editor-element-key="2129"><span class="mvi-hljs-comment">&lt;!-- 渐变 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">transition</span><span> </span><span class="mvi-hljs-attr">name</span><span>=</span><span class="mvi-hljs-string">"mvi-transition-fade"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">transition</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2153"><span class="mvi-hljs-comment">&lt;!-- 自右向左渐入 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">transition</span><span> </span><span class="mvi-hljs-attr">name</span><span>=</span><span class="mvi-hljs-string">"mvi-transition-left"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">transition</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2177"><span class="mvi-hljs-comment">&lt;!-- 自左向右渐入 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">transition</span><span> </span><span class="mvi-hljs-attr">name</span><span>=</span><span class="mvi-hljs-string">"mvi-transition-right"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">transition</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2201"><span class="mvi-hljs-comment">&lt;!-- 自上向下渐入 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">transition</span><span> </span><span class="mvi-hljs-attr">name</span><span>=</span><span class="mvi-hljs-string">"mvi-transition-down"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">transition</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2225"><span class="mvi-hljs-comment">&lt;!-- 自下向上渐入 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">transition</span><span> </span><span class="mvi-hljs-attr">name</span><span>=</span><span class="mvi-hljs-string">"mvi-transition-up"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">transition</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="2249" mvi-hljs-language="plaintext"><span>&lt;!-- 自小变大渐入 --&gt;
&lt;transition name="mvi-transition-large"&gt;&lt;/transition&gt;</span></pre><pre mvi-editor-element-key="2252"><span class="mvi-hljs-comment">&lt;!-- 自大变小渐入 --&gt;</span><span>
</span><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">transition</span><span> </span><span class="mvi-hljs-attr">name</span><span>=</span><span class="mvi-hljs-string">"mvi-transition-small"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">transition</span><span>&gt;</span></span></pre><p><br></p>`,
			editor: null
		}
	},
	mounted() {
		this.editor = new AlexEditor('.editor-content', {
			value: this.value,
			disabled: false,
			allowPasteHtml: true,
			customHtmlPaste: function (data) {
				console.log(data)
				this.insertText(data)
			}
		})
		this.editor.on('copy', val => {
			console.log('复制触发', val)
		})
		this.editor.on('cut', val => {
			console.log('剪切触发', val)
		})
		this.editor.formatElementStack()
		this.editor.domRender()
	},
	methods: {
		queryTextStyle() {},
		setTextStyle() {
			this.editor.setTextStyle({
				color: '#87f390'
			})
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		},
		removeTextStyle() {
			this.editor.removeTextStyle()
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		}
	}
}
</script>
<style lang="less" scoped>
.editor {
	display: block;
	width: 100%;
	font-size: 14px;
	font-family: PingFang SC, Helvetica Neue, Helvetica, Roboto, Segoe UI, Microsoft YaHei, Arial, sans-serif;

	.editor-menus {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		width: 100%;
		margin-bottom: 20px;

		.editor-menu {
			padding: 6px 10px;
			background-color: #708af9;
			border-radius: 4px;
			color: #fff;
			font-size: 14px;
			margin: 6px;
		}
	}

	.editor-content {
		border: 1px solid #ddd;
		padding: 6px 10px;
		height: 2000px;
		overflow: auto;
		border-radius: 4px;

		:deep(p) {
			margin: 0 0 10px 0;
		}

		:deep(blockquote) {
			margin: 0 0 10px 0;
			padding: 10px 10px 10px 30px;
			border-left: 10px solid #ebedf0;
			font-size: 14px;
			background-color: #fafafa;
			color: #333;
		}

		:deep(pre) {
			padding: 16px;
			overflow: auto;
			line-height: 1.5;
			color: #505050;
			background-color: #fafafa;
			border-radius: 6px;
			font-size: 14px;
			font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
			margin: 0 0 10px 0;
		}
		:deep(code) {
			padding: 0 4px;
			color: #1f2328;
			background-color: #dfe4eb;
			font-size: 14px;
			font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
		}

		:deep(table) {
			border: 1px solid #ddd;
			border-spacing: 0;
			width: 100%;
			text-align: center;
			margin: 0 0 10px 0;

			td,
			th {
				padding: 10px;
				font-size: 14px;
				line-height: 1.5;
				border: 1px solid #ddd;
			}
		}
	}
}

:deep(.large) {
	font-size: 40px;
}
</style>
