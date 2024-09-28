<script setup lang="ts">
import 'dexie-export-import';
import { saveAs } from 'file-saver';

import { appDatabase } from '../../database/db.ts';
import { peakImportFile } from 'dexie-export-import';
import { ref } from 'vue';

const importedFile = ref<File>()
const displayDBImportMsg = ref(false)

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
	if (!file) throw new Error('No file provided.');
	const importMetadata = await peakImportFile(file);
	if (importMetadata.formatName != 'dexie') throw new Error('Invalid format');
	console.log('Database name:', importMetadata.data.databaseName);
	console.log('Database version:', importMetadata.data.databaseVersion);
	console.log(
		'Tables:',
		importMetadata.data.tables.map((t) => `${t.name} (${t.rowCount} rows)`).join('\n\t')
	);
	await appDatabase.import(file, {clearTablesBeforeImport: true});
	displayDBImportMsg.value = true;
	importedFile.value = undefined;
}
</script>

<template>
	<div id="flex-container">
		<VLabel>Import Database</VLabel>
		<VFileInput label="Place database file here..." accept=".json" v-model="importedFile"></VFileInput>
		<VBtn @click="importDatabase(importedFile)">Import database</VBtn>
	<!--	TODO Add confirmation, as importing will also clear the existing database -->
		<VDivider></VDivider>
		<VBtn @click="exportDatabase">Export database</VBtn>
		<VSnackbar timeout="5000" v-model="displayDBImportMsg">Database successfully imported! <VBtn @click="displayDBImportMsg = false">Close</VBtn></VSnackbar>
	</div>
</template>

<style scoped></style>
