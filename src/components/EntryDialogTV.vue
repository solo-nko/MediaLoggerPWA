<script setup lang="ts">
import { appDatabase } from '../database/db.ts';
import { DateTime } from 'luxon';
import QuillEditor from './QuillEditor.vue';
import Log from '../types/Log.ts';
import { ref } from 'vue';
import { TVStatus } from '../types/TVStatus.ts';

const tvStatus = Object.values(TVStatus);
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
			season: null,
			episode: null,
			status: null,
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
	season: props.entry.season,
	episode: props.entry.episode,
	status: props.entry.status,
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
	if (editOrAdd === 'edit') emits('save-entry', editOrAdd);
	else emits('save-entry', editOrAdd);
}

async function addTV() {
	const id = await appDatabase.television.add({
		title: logModel.value.title,
		season: logModel.value.season,
		episode: logModel.value.episode,
		status: logModel.value.status,
		rating: logModel.value.rating,
		impression: logModel.value.impression,
		dateCreated: Log.dateToString(DateTime.now()),
		dateModified: Log.dateToString(DateTime.now())
	});
	resetFields();
	closeEntry();
}

async function updateTV(key: number) {
	const id = await appDatabase.television.update(key, {
		title: logModel.value.title,
		season: logModel.value.season,
		episode: logModel.value.episode,
		status: logModel.value.status,
		rating: logModel.value.rating,
		impression: logModel.value.impression,
		dateModified: logModel.value.dateModified
	});
	closeEntry();
}
</script>

<template>
	<VCard id="card">
		<VCardTitle>Add New TV Series</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField label="Title" v-model="logModel.title"></VTextField>
			</VRow>
			<VRow>
				<VCol class="pl-0" cols="3">
					<VTextField label="Season" v-model="logModel.season" type="number"></VTextField>
				</VCol>
				<VCol cols="3">
					<VTextField label="Episode" v-model="logModel.episode" type="number"></VTextField>
				</VCol>
				<VCol class="pr-0" cols="6">
					<VAutocomplete label="Status" :items="tvStatus" v-model="logModel.status"></VAutocomplete>
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
			<VBtn @click="props.editEntry ? updateTV(props.entry.id) : addTV()">Save</VBtn>
			<VBtn @click="closeEntry()" v-if="closeButton">Close</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
/* Used this internal class to access the VCard component styling because the #card id wasn't working */
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
