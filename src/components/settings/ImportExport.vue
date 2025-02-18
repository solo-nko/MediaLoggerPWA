<script setup lang="ts">
import 'dexie-export-import';
import { saveAs } from 'file-saver';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import { overwriteDatabase, progressCallback } from '../../config/Utils.ts';
import { DateTime } from 'luxon';

const importedFile = ref<File>();
const showDBImportSuccess = ref(false);
const showDBImportFailure = ref(false);
const DBImportFailureMsg = ref('');
const showDBImportConfirm = ref(false);
const importWarningMessage =
	'Importing a new database will clear the existing one. This cannot be undone!';
const loadingOperation = ref(false);

async function exportDatabase() {
	loadingOperation.value = true;
	const exportBlob = await appDatabase.export({ prettyJson: true, progressCallback });
	const timeString = DateTime.now().toFormat('yyyyLLdd_HHmmss');
	const fileName = `database${timeString}.json`;
	saveAs(exportBlob, fileName);
	loadingOperation.value = false;
}

async function importDatabase(file: Blob) {
	loadingOperation.value = true;
	showDBImportConfirm.value = false;
	if (!file) {
		DBImportFailureMsg.value = 'Import failed! No file was provided.';
		showDBImportFailure.value = true;
		loadingOperation.value = false;
		return;
	}
	showDBImportSuccess.value = await overwriteDatabase(file);
	importedFile.value = undefined;
	loadingOperation.value = false;
}
</script>

<template>
	<div id="container-import-export">
		<VLabel>Import Media Log from JSON</VLabel>
		<p>
			You can use the Export Media Log button to download your entire media log as a small JSON
			file. You can then later import it from this file. To protect the integrity of your media log,
			it is strongly recommended to avoid directly editing the JSON file.
		</p>
		<VFileInput
			v-model="importedFile"
			label="Place database file here..."
			accept=".json"
		></VFileInput>
		<div class="button-row">
			<VBtn :loading="loadingOperation" :disabled="loadingOperation" @click="exportDatabase"
				>Export Media Log to file</VBtn
			>
			<VBtn
				:loading="loadingOperation"
				:disabled="loadingOperation"
				@click="showDBImportConfirm = true"
				>Import Media Log from file</VBtn
			>
		</div>
		<VDialog v-model="showDBImportConfirm">
			<ConfirmDialog
				:message="importWarningMessage"
				@confirm="importDatabase(importedFile)"
				@cancel="showDBImportConfirm = false"
			></ConfirmDialog>
		</VDialog>
		<VSnackbar v-model="showDBImportSuccess" timeout="5000"
			>Database successfully imported!
			<VBtn @click="showDBImportSuccess = false">Close</VBtn>
		</VSnackbar>
		<VSnackbar v-model="showDBImportFailure" timeout="5000">{{ DBImportFailureMsg }}</VSnackbar>
	</div>
</template>

<style scoped>
.button-row {
	display: flex;
	justify-content: space-around;
}

p {
	font-size: 85%;
	margin-bottom: 1rem;
}
</style>
