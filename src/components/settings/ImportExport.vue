<script setup lang="ts">
import 'dexie-export-import';
import { saveAs } from 'file-saver';

import { appDatabase } from '../../database/db.ts';
import { peakImportFile } from 'dexie-export-import';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';

const importedFile = ref<File>();
const showDBImportSuccess = ref(false);
const showDBImportFailure = ref(false);
const DBImportFailureMsg = ref('');
const showDBImportConfirm = ref(false);
const importWarningMessage =
	'Importing a new database will clear the existing one. This cannot be undone!';

function progressCallback({ totalRows, completedRows }): boolean {
	try {
		console.log(`Progress: ${completedRows} / ${totalRows} rows completed`);
		return true;
	} catch (error) {
		return false;
	}
}

async function exportDatabase() {
	const blob = await appDatabase.export({ prettyJson: true, progressCallback });
	const fileName = 'database.json';
	saveAs(blob, fileName);
}

async function importDatabase(file: Blob) {
	showDBImportConfirm.value = false;
	if (!file) {
		DBImportFailureMsg.value = 'Import failed! No file was provided.';
		showDBImportFailure.value = true;
		return;
	}
	const importMetadata = await peakImportFile(file);
	if (importMetadata.formatName != 'dexie') throw new Error('Invalid format');
	console.log('Database name:', importMetadata.data.databaseName);
	console.log('Database version:', importMetadata.data.databaseVersion);
	console.log(
		'Tables:',
		importMetadata.data.tables.map((t) => `${t.name} (${t.rowCount} rows)`).join('\n\t')
	);
	await appDatabase.import(file, { clearTablesBeforeImport: true });
	showDBImportSuccess.value = true;
	importedFile.value = undefined;
}
</script>

<template>
	<div id="flex-container">
		<VLabel>Import Database from JSON</VLabel>
		<VFileInput
			label="Place database file here..."
			accept=".json"
			v-model="importedFile"
		></VFileInput>
		<VBtn @click="showDBImportConfirm = true">Import database</VBtn>
		<VBtn @click="exportDatabase">Export database</VBtn>
		<VDialog v-model="showDBImportConfirm">
			<ConfirmDialog
				@confirm="importDatabase(importedFile)"
				@cancel="showDBImportConfirm = false"
				:message="importWarningMessage"
			></ConfirmDialog>
		</VDialog>
		<VSnackbar timeout="5000" v-model="showDBImportSuccess"
			>Database successfully imported!
			<VBtn @click="showDBImportSuccess = false">Close</VBtn>
		</VSnackbar>
		<VSnackbar timeout="5000" v-model="showDBImportFailure">{{ DBImportFailureMsg }}</VSnackbar>
	</div>
</template>

<style scoped></style>
