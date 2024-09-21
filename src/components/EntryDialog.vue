<script setup lang="ts">
import { appDatabase } from '../database/db.ts';
import { onMounted, ref } from 'vue';
import { GameStatus } from '../../types/GameStatus.ts';
import { DateTime } from 'luxon';
import Quill from 'quill';
import { Delta } from 'quill/core';
import 'quill/dist/quill.snow.css';

let quill: Quill;
// Quill can't be called until the DOM finishes rendering, otherwise you'll get an error
onMounted(() => {
	quill = new Quill('#editor', {
		placeholder: 'Thoughts so far',
		theme: 'snow'
	});
});

const gameStatus = Object.values(GameStatus);
const quillDelta = ref<Delta>()

const emits = defineEmits(['close-entry'])

const gameLogEntry = ref({
	title: null,
	progress: null,
	platform: null,
	status: null,
	modifiedDate: null
});

function resetFields() {
	for (const key in gameLogEntry.value) {
		gameLogEntry.value[key] = null;
	}
}

function closeEntry(): void {
	emits('close-entry')
}

async function addGame() {
	let luxonModified: DateTime;
	if (gameLogEntry.value.modifiedDate) {
		luxonModified = DateTime.fromISO(gameLogEntry.value.modifiedDate);
	} else {
		luxonModified = DateTime.now();
	}
	const id = await appDatabase.games.add({
		title: gameLogEntry.value.title,
		platform: gameLogEntry.value.platform,
		progress: gameLogEntry.value.progress,
		status: gameLogEntry.value.status,
		dateCreated: DateTime.now().toString(),
		// if date hasn't been modified in the UI, use the current time
		dateModified: luxonModified.toString()
	});
	resetFields();
	closeEntry()
}

</script>

<template>
	<VCard id="card">
		<VCardTitle>Log Entry</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField label="Title" v-model="gameLogEntry.title"></VTextField>
			</VRow>
			<VRow>
				<VCol class="pl-0">
					<VTextField label="Platform" v-model="gameLogEntry.platform"></VTextField>
				</VCol>
				<VCol class="pr-0">
					<VAutocomplete label="Status" :items="gameStatus" v-model="gameLogEntry.status"></VAutocomplete>
				</VCol>
			</VRow>
			<VRow>
				<VTextarea label="Progress" v-model="gameLogEntry.progress" rows="2" no-resize></VTextarea>
			</VRow>
			<VRow class="pb-4">
				<div id="editor-wrapper">
					<div id="editor"></div>
				</div>
			</VRow>
			<VRow>
				<VTextField label="Date Updated (if applicable)" type="date" v-model="gameLogEntry.modifiedDate"></VTextField>
			</VRow>
		</VContainer>
		<VCardActions>
			<VBtn @click="addGame">Save</VBtn>
			<VBtn @click="closeEntry()">Close</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
#card {
	width: 70%;
	padding: 3rem;
}

#editor-wrapper {
	height: 100%;
	width: 100%;
}

</style>