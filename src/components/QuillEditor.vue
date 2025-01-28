<script setup lang="ts">
import { onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Log from '../database/models/Log.ts';
// TODO set available text format tools
let quill: Quill | null = null;
const emits = defineEmits(['content-change']);

// this should only ever be a string, not a Delta
// TODO: test for issues here
const editorContent = defineModel<string>();

// Quill can't be called until the DOM finishes rendering, otherwise you'll get an error
onMounted(() => {
	quill = new Quill('#editor', {
		placeholder: 'Thoughts so far',
		theme: 'snow'
	});
	// if there is already content loaded from the database, use that
	if (editorContent.value && typeof editorContent.value === 'string') {
		quill.setContents(Log.impressionFromString(editorContent.value));
	}
	/* eslint-disable */
	quill.on('text-change', (delta, oldDelta, source) => {
		// send changes typed into the editor up to the parent
		editorContent.value = Log.impressionToString(quill.getContents());
		emits('content-change');
	});
});

function clearEditor() {
	if (quill != null) {
		quill.setContents([{ insert: '\n' }]);
	}
}

defineExpose({ clearEditor });
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
