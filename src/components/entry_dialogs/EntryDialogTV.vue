<script setup lang="ts">
import { DateTime } from "luxon";
import { ref } from "vue";
import { appDatabase } from "../../database/db.ts";
import QuillEditor from "../QuillEditor.vue";
import Log from "../../database/models/Log.ts";
import { TVStatus } from "../../database/models/TVStatus.ts";
import Messages from "../../config/Messages.ts";
import ITVLog from "../../types/ITVLog.ts";

const tvStatus = Object.values(TVStatus);
const emits = defineEmits(["close-entry", "save-entry"]);
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

const logModel = ref<ITVLog>({
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
	if (quill.value) quill.value.clearEditor();
}

function closeEntry(): void {
	if (props.closeButton) emits("close-entry");
}

function saveEntry(editOrAdd: "edit" | "add") {
	if (editOrAdd === "edit") emits("save-entry", editOrAdd);
	else emits("save-entry", editOrAdd);
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

async function addTV() {
	if (!fieldsOk()) return;
	await appDatabase.television.add({
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
	saveEntry("add");
	closeEntry();
}

async function updateTV(key: number) {
	if (!fieldsOk()) return;
	await appDatabase.television.update(key, {
		title: logModel.value.title,
		season: logModel.value.season,
		episode: logModel.value.episode,
		status: logModel.value.status,
		rating: logModel.value.rating,
		impression: logModel.value.impression,
		dateModified: logModel.value.dateModified
	});
	saveEntry("edit");
	closeEntry();
}
</script>

<template>
	<VCard class="entry-card">
		<VCardTitle>{{ editEntry ? "Edit" : "Add New" }} TV Series</VCardTitle>
		<VContainer>
			<VRow>
				<VTextField v-model="logModel.title" label="Title"></VTextField>
			</VRow>
			<VRow>
				<VCol class="pl-0" cols="3">
					<VTextField v-model.number="logModel.season" label="Season" type="number"></VTextField>
				</VCol>
				<VCol cols="3">
					<VTextField v-model.number="logModel.episode" label="Episode" type="number"></VTextField>
				</VCol>
				<VCol class="pr-0" cols="6">
					<VAutocomplete v-model="logModel.status" label="Status" :items="tvStatus"></VAutocomplete>
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
			<VBtn @click="props.editEntry ? updateTV(props.entry.id) : addTV()">Save</VBtn>
			<VBtn v-if="closeButton" @click="closeEntry()">Close</VBtn>
			<div v-show="showSaveWarning" class="save-warning">{{ Messages.NO_BLANK_TITLE }}</div>
		</VCardActions>
	</VCard>
</template>

<style lang="scss">
@use "../../style/entry";
</style>
