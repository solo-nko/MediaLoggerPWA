<script setup lang="ts">
import { onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Log from '../database/models/Log.ts';

let quill: Quill | null = null;
const toolbarOptions = [
	['bold', 'italic', 'underline'],
	[{ list: 'ordered' }, { list: 'bullet' }],
	['link', 'clean']
];
const emits = defineEmits(['content-change']);

// this should only ever be a string, not a Deltay
// TODO: test for issues here
const editorContent = defineModel<string>();

// Quill can't be called until the DOM finishes rendering, otherwise you'll get an error
onMounted(() => {
	quill = new Quill('#editor', {
		placeholder: 'Thoughts so far',
		theme: 'snow',
		modules: {
			toolbar: toolbarOptions
		}
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
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

#editor-wrapper {
	height: 100%;
	width: 100%;
}

#editor {
	font-family: 'Roboto', sans-serif;
}

/*
https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md#deep-selectors
*/
::v-deep(.ql-editor) {
	background-color: rgba(var(--v-theme-surface));
}

/*
https://stackoverflow.com/questions/59315115/reactquill-how-to-style-placeholder-attribute
*/
::v-deep(.ql-editor.ql-blank::before) {
	color: rgba(var(--v-theme-placeholderText));
}

::v-deep(.ql-stroke, .ql-picker-label:hover .ql-stroke) {
	fill: none;
	stroke: rgba(var(--v-theme-placeholderText));
}

::v-deep(.ql-fill) {
	fill: rgba(var(--v-theme-placeholderText));
}

/*investigate later*/
/*
.ql-active .ql-stroke {
	fill: none;
	stroke: red !important;
}

button:hover .ql-fill,
.ql-picker-label:hover .ql-fill {
	fill: red !important;
	stroke: none;
}

.ql-active .ql-fill {
	fill: red !important;
	stroke: none;
}*/
</style>
