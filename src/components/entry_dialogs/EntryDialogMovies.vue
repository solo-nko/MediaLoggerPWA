<script setup lang="ts">
import { appDatabase } from '../../database/db.ts';
import { DateTime } from 'luxon';
import QuillEditor from '../QuillEditor.vue';
import Log from '../../database/models/Log.ts';
import { ref } from 'vue';
import { Messages } from '../../config/Messages.ts';
import IMovieLog from '../../types/IMovieLog.ts';

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
			series: 'N/A',
			rating: null,
			impression: null,
			dateModified: null
		},
		editEntry: true,
		closeButton: true
	}
);

const logModel = ref<IMovieLog>({
	title: props.entry.title,
	series: props.entry.series,
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

function clearNA(event: Event) {
	const inputElement = event.target as HTMLInputElement;
	if (inputElement.value == 'N/A') logModel.value.series = '';
}

function replaceNA(event: Event) {
	const inputElement = event.target as HTMLInputElement;
	if (inputElement.value == '') logModel.value.series = 'N/A';
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

async function addMovie() {
	if (!fieldsOk()) return;
	await appDatabase.movies.add({
		title: logModel.value.title,
		series: logModel.value.series,
		rating: logModel.value.rating,
		impression: logModel.value.impression,
		dateCreated: Log.dateToString(DateTime.now()),
		dateModified: Log.dateToString(DateTime.now())
	});
	resetFields();
	saveEntry('add');
	closeEntry();
}

async function updateMovie(key: number) {
	if (!fieldsOk()) return;
	await appDatabase.books.update(key, {
		title: logModel.value.title,
		series: logModel.value.series,
		rating: logModel.value.rating,
		impression: logModel.value.impression,
		dateModified: logModel.value.dateModified
	});
	saveEntry('edit');
	closeEntry();
}
</script>

<template>
	<VCard id="card">
		<VCardTitle>{{ editEntry ? 'Edit' : 'Add New' }} Movie</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField v-model="logModel.title" label="Title"></VTextField>
			</VRow>
			<VRow>
				<VTextField
					v-model="logModel.series"
					label="Series"
					@focus="clearNA($event)"
					@blur="replaceNA($event)"
				></VTextField>
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
					<!--					<VRating v-model="logModel.rating" length="10" hover active-color="blue"></VRating>-->
				</div>
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
			<VBtn @click="props.editEntry ? updateMovie(props.entry.id) : addMovie()">Save</VBtn>
			<VBtn v-if="closeButton" @click="closeEntry()">Close</VBtn>
			<div v-show="showSaveWarning" class="save-warning">{{ Messages.noBlankTitle }}</div>
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
