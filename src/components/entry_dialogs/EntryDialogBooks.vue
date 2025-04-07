<script setup lang="ts">
import { appDatabase } from '../../database/db.ts';
import { BookStatus } from '../../database/models/BookStatus.ts';
import { DateTime } from 'luxon';
import QuillEditor from '../QuillEditor.vue';
import Log from '../../database/models/Log.ts';
import { ref } from 'vue';
import { Messages } from '../../config/Messages.ts';
import IBookLog from '../../types/IBookLog.ts';
import { useDisplay } from 'vuetify';

const bookStatus = Object.values(BookStatus);
const emits = defineEmits(['close-entry', 'save-entry']);
const quill = ref(null);
const showSaveWarning = ref(false);
const { smAndDown } = useDisplay();

const props = withDefaults(
	defineProps<{
		entry?;
		editEntry?: boolean;
		closeButton?: boolean;
	}>(),
	{
		entry: {
			title: null,
			audiobook: false,
			series: 'N/A',
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

const logModel = ref<IBookLog>({
	title: props.entry.title,
	audiobook: props.entry.audiobook,
	status: props.entry.status,
	series: props.entry.series,
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

async function addBook() {
	if (!fieldsOk()) return;
	await appDatabase.books.add({
		title: logModel.value.title,
		audiobook: logModel.value.audiobook,
		series: logModel.value.series,
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

async function updateBook(key: number) {
	if (!fieldsOk()) return;
	await appDatabase.books.update(key, {
		title: logModel.value.title,
		audiobook: logModel.value.audiobook,
		series: logModel.value.series,
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
		<VCardTitle>{{ editEntry ? 'Edit' : 'Add New' }} Book</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField v-model="logModel.title" label="Title"></VTextField>
			</VRow>
			<VRow v-if="smAndDown" justify="center" align="center">
				<VCheckbox v-model="logModel.audiobook" name="audiobook" label="Audiobook"></VCheckbox>
			</VRow>
			<VRow>
				<VCol v-if="!smAndDown" class="pl-0" cols="2">
					<VCheckbox v-model="logModel.audiobook" name="audiobook" label="Audiobook"></VCheckbox>
				</VCol>
				<VCol cols="7">
					<VTextField
						v-model="logModel.series"
						label="Series"
						@focus="clearNA($event)"
						@blur="replaceNA($event)"
					></VTextField>
				</VCol>
				<VCol class="pr-0" :cols="smAndDown ? undefined : 3">
					<VAutocomplete
						v-model="logModel.status"
						label="Status"
						:items="bookStatus"
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
			<VBtn @click="props.editEntry ? updateBook(props.entry.id) : addBook()">Save</VBtn>
			<VBtn v-if="closeButton" @click="closeEntry()">Close</VBtn>
			<div v-show="showSaveWarning" class="save-warning">{{ Messages.noBlankTitle }}</div>
		</VCardActions>
	</VCard>
</template>

<style lang="scss">
@use '../../style/entry';
</style>
