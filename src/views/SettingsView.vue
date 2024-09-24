<script setup lang="ts">
import Dexie from 'dexie';
import 'dexie-export-import';
import { saveAs } from 'file-saver';

import { appDatabase } from '../database/db.ts';
import { peakImportFile } from 'dexie-export-import';

function progressCallback({ totalRows, completedRows }) {
	console.log(`Progress: ${completedRows} / ${totalRows} rows completed`);
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
	<VBtn @click="exportDatabase">Export database</VBtn>
</template>

<style scoped></style>
