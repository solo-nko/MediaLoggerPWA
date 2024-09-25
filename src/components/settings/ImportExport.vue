<script setup lang="ts">
import 'dexie-export-import';
import { saveAs } from 'file-saver';

import { appDatabase } from '../../database/db.ts';
import { peakImportFile } from 'dexie-export-import';

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

async function importDatabase(file) {
	const importMetadata = await peakImportFile(file);
	if (importMetadata.formatName != 'dexie') throw new Error('Invalid format');
	console.log('Database name:', importMetadata.data.databaseName);
	console.log('Database version:', importMetadata.data.databaseVersion);
	console.log('Database version:', importMetadata.data.databaseVersion);
	console.log(
		'Tables:',
		importMetadata.data.tables.map((t) => `${t.name} (${t.rowCount} rows)`).join('\n\t')
	);
	await appDatabase.delete();
	await appDatabase.import(file);
}
</script>

<template>
	<div id="flex-container">
		<VLabel>Import Database</VLabel>
		<VFileInput label="Place database file here..." accept=".json" ></VFileInput>
		<VDivider></VDivider>
		<VBtn @click="exportDatabase">Export database</VBtn>
	</div>
</template>

<style scoped>

</style>