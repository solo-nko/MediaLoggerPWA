<script setup lang="ts">
import { appDatabase } from '../../database/db.ts';
import { GameStatus } from '../../types/GameStatus.ts';
import { DateTime } from 'luxon';
import QuillEditor from '../QuillEditor.vue';
import Log from '../../types/Log.ts';
import { ref } from 'vue';

const gameStatus = Object.values(GameStatus);
const emits = defineEmits(['close-entry', 'save-entry']);

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

const logModel = ref({
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
	// TODO: reset quill editor contents
}

function closeEntry(): void {
	if (props.closeButton) emits('close-entry');
}

function saveEntry(editOrAdd: 'edit' | 'add') {
	emits('save-entry', editOrAdd);
}

async function addGame() {
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
	// TODO: validate fields before saving, namely for blanks
	closeEntry();
}
</script>

<template>
	<VCard id="card">
		<VCardTitle>Add New Game</VCardTitle>
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
					<!--					<VRating v-model="logModel.rating" length="10" hover active-color="blue"></VRating>-->
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
			<VBtn @click="props.editEntry ? updateGame(props.entry.id) : addGame()">Save</VBtn>
			<VBtn @click="closeEntry()" v-if="closeButton">Close</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
/* Used this internal class to access the VCard component styling because the #card id wasn't working*/
/*noinspection CssUnusedSymbol*/
.v-card {
	padding: 1rem 3rem;
}

#rating-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	/* align-items: center; */
}

#rating-label {
	align-self: center;
}
</style>
