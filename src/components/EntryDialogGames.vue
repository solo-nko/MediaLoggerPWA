<script setup lang="ts">
import { appDatabase } from '../database/db.ts';
import { GameStatus } from '../../types/GameStatus.ts';
import { DateTime } from 'luxon';
import QuillEditor from './QuillEditor.vue';
import Log from '../../types/Log.ts';
import { ref } from 'vue';
import GameLog from '../../types/GameLog.ts';

const gameStatus = Object.values(GameStatus);
const emits = defineEmits(['close-entry']);

const props = withDefaults(
	defineProps<{
		gameEntry?: GameLog;
		editEntry?: boolean;
		closeButton?: boolean;
	}>(),
	{
		gameEntry: {
			title: null,
			platform: null,
			status: null,
			progress: null,
			rating: null,
			impression: null,
			dateModified: null
		},
		editEntry: true,
		closeButton: true
	}
);

const logModel = ref({
	title: props.gameEntry.title,
	platform: props.gameEntry.platform,
	status: props.gameEntry.status,
	progress: props.gameEntry.progress,
	rating: props.gameEntry.rating,
	impression: props.gameEntry.impression,
	dateModified: props.gameEntry.dateModified
});

/*
* 	title: null,
		platform: null,
		status: null,
		progress: null,
		rating: null,
		impression: null,
		modifiedDate: null
* */

function resetFields() {
	for (const key in logModel.value) {
		logModel.value[key] = null;
	}
}

function closeEntry(): void {
	if (props.closeButton) emits('close-entry');
}

async function addGame() {
	const id = await appDatabase.games.add({
		title: logModel.value.title,
		platform: logModel.value.platform,
		status: logModel.value.status,
		progress: logModel.value.progress,
		rating: logModel.value.rating,
		impression: Log.impressionToString(logModel.value.impression),
		dateCreated: Log.dateToString(DateTime.now()),
		dateModified: Log.dateToString(DateTime.now())
	});
	resetFields();
	closeEntry();
}

async function updateGame(key: number) {
	const id = await appDatabase.games.update(key, {
		title: logModel.value.title,
		platform: logModel.value.platform,
		status: logModel.value.status,
		progress: logModel.value.progress,
		rating: logModel.value.rating,
		impression: Log.impressionToString(logModel.value.impression)
	});
	closeEntry();
}
</script>

<template>
	<VCard id="card">
		<VCardTitle>Log Entry</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField label="Title" v-model="logModel.title"></VTextField>
			</VRow>
			<VRow>
				<VCol class="pl-0">
					<VTextField label="Platform" v-model="logModel.platform"></VTextField>
				</VCol>
				<VCol class="pr-0">
					<VAutocomplete
						label="Status"
						:items="gameStatus"
						v-model="logModel.status"
					></VAutocomplete>
				</VCol>
			</VRow>
			<VRow>
				<div id="rating-container">
					<VLabel id="rating-label">Rating</VLabel>
					<VSlider
						min="1"
						max="10"
						step="1"
						thumb-label
						show-ticks="always"
						v-model="logModel.rating"
					></VSlider>
				</div>
			</VRow>
			<VRow>
				<VTextarea label="Progress" v-model="logModel.progress" rows="2" no-resize></VTextarea>
			</VRow>
			<VRow class="pb-4">
				<QuillEditor v-model="logModel.impression"></QuillEditor>
			</VRow>
			<VRow>
				<VTextField
					label="Date Updated (if applicable)"
					type="date"
					v-model="logModel.dateModified"
				></VTextField>
			</VRow>
		</VContainer>
		<VCardActions>
			<VBtn @click="props.editEntry ? updateGame(props.gameEntry.id) : addGame()">Save</VBtn>
			<VBtn @click="closeEntry()" v-if="closeButton">Close</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
#card {
	width: 70%;
	padding: 3rem;
}

#rating-container {
	width: 100%;
	display: flex;
	flex-direction: column;
}

#rating-label {
	align-self: center;
}
</style>
