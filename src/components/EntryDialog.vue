<script setup lang="ts">
import { appDatabase } from '../database/db.ts';
import { GameStatus } from '../../types/GameStatus.ts';
import { DateTime } from 'luxon';
import QuillEditor from './QuillEditor.vue';
import Log from '../../types/Log.ts';
import { ref } from 'vue';

const gameStatus = Object.values(GameStatus);
const emits = defineEmits(['close-entry']);

const gameLogEntry = ref({
	title: null,
	platform: null,
	status: null,
	progress: null,
	impression: null,
	modifiedDate: null
});

function resetFields() {
	for (const key in gameLogEntry.value) {
		gameLogEntry.value[key] = null;
	}
}

function closeEntry(): void {
	emits('close-entry');
}

async function addGame() {
	const id = await appDatabase.games.add({
		title: gameLogEntry.value.title,
		platform: gameLogEntry.value.platform,
		status: gameLogEntry.value.status,
		progress: gameLogEntry.value.progress,
		impression: Log.impressionToString(gameLogEntry.value.impression),
		dateCreated: Log.dateToString(DateTime.now()),
		dateModified: Log.dateToString(DateTime.now())
	});
	resetFields();
	closeEntry();
}

async function updateGame() {
	const id = await appDatabase.games.update({});
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
					<VAutocomplete
						label="Status"
						:items="gameStatus"
						v-model="gameLogEntry.status"
					></VAutocomplete>
				</VCol>
			</VRow>
			<VRow>
				<VTextarea label="Progress" v-model="gameLogEntry.progress" rows="2" no-resize></VTextarea>
			</VRow>
			<VRow class="pb-4">
				<QuillEditor v-model="gameLogEntry.impression"></QuillEditor>
			</VRow>
			<VRow>
				<VTextField
					label="Date Updated (if applicable)"
					type="date"
					v-model="gameLogEntry.modifiedDate"
				></VTextField>
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
</style>
