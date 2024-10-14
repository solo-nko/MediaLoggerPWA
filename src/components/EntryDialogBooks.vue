<script setup lang="ts">
import { appDatabase } from '../database/db.ts';
import { BookStatus } from '../types/BookStatus.ts';
import { DateTime } from 'luxon';
import QuillEditor from './QuillEditor.vue';
import Log from '../types/Log.ts';
import { ref } from 'vue';

const bookStatus = Object.values(BookStatus);

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

const logModel = ref({
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
}

function closeEntry(): void {
	if (props.closeButton) emits('close-entry');
}

function saveEntry(editOrAdd: 'edit' | 'add') {
	emits('save-entry', editOrAdd);
}

async function addBook() {
	const id = await appDatabase.books.add({
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
	const id = await appDatabase.books.update(key, {
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
	<VCard id="card">
		<VCardTitle>Add New Book</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField label="Title" v-model="logModel.title"></VTextField>
			</VRow>
			<VRow>
				<VCol class="pl-0" cols="2">
					<VCheckbox label="Audiobook" v-model="logModel.audiobook"></VCheckbox>
				</VCol>
				<VCol cols="7">
					<!--			TODO: clear N/A on focus-->
					<VTextField label="Series" v-model="logModel.series"></VTextField>
				</VCol>
				<VCol class="pr-0" cols="3">
					<VAutocomplete
						label="Status"
						:items="bookStatus"
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
			<VBtn @click="props.editEntry ? updateBook(props.entry.id) : addBook()">Save</VBtn>
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
