<script setup lang="ts">
import { DateTime } from 'luxon';
import { ref } from 'vue';
import { appDatabase } from '../../database/db.ts';
import { GameStatus } from '../../database/models/GameStatus.ts';
import QuillEditor from '../QuillEditor.vue';
import Log from '../../database/models/Log.ts';
import Messages from '../../config/Messages.ts';
import IGameLog from '../../types/IGameLog.ts';

const gameStatus = Object.values(GameStatus);
const emits = defineEmits(['close-entry', 'save-entry']);
const quill = ref(null);
const showSaveWarning = ref(false);

const props = withDefaults(
	defineProps<{
		entry?;
		editEntry?: boolean;
		closeButton?: boolean;
	}>(),
	{
		entry: {
			title: null,
			platform: null,
			status: null,
			progress: null,
			rating: null,
			impression: null,
			dateModified: DateTime.now().toISODate()
		},
		editEntry: true,
		closeButton: true
	}
);

const logModel = ref<IGameLog>({
	title: props.entry.title,
	platform: props.entry.platform,
	status: props.entry.status,
	progress: props.entry.progress,
	rating: props.entry.rating,
	impression: props.entry.impression,
	dateModified: props.entry.dateModified
});

function resetFields() {
	for (const key in logModel.value) {
		logModel.value[key] = null;
	}
	if (quill.value) quill.value.clearEditor();
}

function closeEntry(): void {
	if (props.closeButton) emits('close-entry');
}

function saveEntry(editOrAdd: 'edit' | 'add') {
	emits('save-entry', editOrAdd);
}

function fieldsOk(): boolean {
	if (!logModel.value.title) {
		showSaveWarning.value = true;
		return false;
	} else {
		showSaveWarning.value = false;
		return true;
	}
}

function setToToday() {
	logModel.value.dateModified = DateTime.now().toISODate();
}

async function addGame() {
	if (!fieldsOk()) return;
	await appDatabase.games.add({
		title: logModel.value.title,
		platform: logModel.value.platform,
		status: logModel.value.status,
		progress: logModel.value.progress,
		rating: logModel.value.rating,
		impression: logModel.value.impression,
		dateCreated: Log.dateToString(DateTime.now()),
		dateModified: Log.dateToString(DateTime.now())
	});
	resetFields();
	saveEntry('add');
	closeEntry();
}

async function updateGame(key: number) {
	if (!fieldsOk()) return;
	await appDatabase.games.update(key, {
		title: logModel.value.title,
		platform: logModel.value.platform,
		status: logModel.value.status,
		progress: logModel.value.progress,
		rating: logModel.value.rating,
		impression: logModel.value.impression,
		dateModified: logModel.value.dateModified
	});
	saveEntry('edit');
	closeEntry();
}
</script>

<template>
	<VCard class="entry-card">
		<VCardTitle>{{ editEntry ? 'Edit' : 'Add New' }} Game</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField v-model="logModel.title" label="Title"></VTextField>
			</VRow>
			<VRow>
				<VCol class="pl-0">
					<VTextField v-model="logModel.platform" label="Platform"></VTextField>
				</VCol>
				<VCol class="pr-0">
					<VAutocomplete
						v-model="logModel.status"
						label="Status"
						:items="gameStatus"
					></VAutocomplete>
				</VCol>
			</VRow>
			<VRow>
				<div id="rating-container">
					<VLabel id="rating-label">Rating ({{ logModel.rating ? logModel.rating : 1 }}/10)</VLabel>
					<VSlider
						v-model="logModel.rating"
						min="1"
						max="10"
						step="1"
						thumb-label
						show-ticks="always"
						color="accent"
					></VSlider>
					<!--	TODO: decide whether to use this-->
					<!--					<VRating v-model="logModel.rating" length="10" hover active-color="blue"></VRating>-->
				</div>
			</VRow>
			<VRow>
				<VTextarea v-model="logModel.progress" label="Progress" rows="2" no-resize></VTextarea>
			</VRow>
			<VRow class="pb-4">
				<QuillEditor ref="quill" v-model="logModel.impression"></QuillEditor>
			</VRow>
			<VRow align="center">
				<VTextField
					v-model="logModel.dateModified"
					label="Date Updated (if applicable)"
					type="date"
				></VTextField>
				<VBtn class="today-btn" flat @click="setToToday">Today</VBtn>
			</VRow>
		</VContainer>
		<VCardActions>
			<VBtn @click="props.editEntry ? updateGame(props.entry.id) : addGame()">Save</VBtn>
			<VBtn v-if="closeButton" @click="closeEntry()">Close</VBtn>
			<div v-show="showSaveWarning" class="save-warning">{{ Messages.NO_BLANK_TITLE }}</div>
		</VCardActions>
	</VCard>
</template>

<style lang="scss">
@use '../../style/entry';
</style>
