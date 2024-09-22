<script setup lang="ts">
import { onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

let quill: Quill | null = null;
const emits = defineEmits(['content-change']);
const editorContent = defineModel();

// Quill can't be called until the DOM finishes rendering, otherwise you'll get an error
onMounted(() => {
	quill = new Quill('#editor', {
		placeholder: 'Thoughts so far',
		theme: 'snow'
	});
	quill.on('text-change', (delta, oldDelta, source) => {
		editorContent.value = quill.getContents();
		emits('content-change', delta, oldDelta, source);
	});
});
</script>

<template>
	<div id="editor-wrapper">
		<div id="editor"></div>
	</div>
</template>

<style scoped>
#editor-wrapper {
	height: 100%;
	width: 100%;
}
</style>
