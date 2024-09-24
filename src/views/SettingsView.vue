<script setup lang="ts">
import Dexie from 'dexie';
import 'dexie-export-import';
import { saveAs } from 'file-saver';

import { appDatabase } from '../database/db.ts';

function progressCallback({ totalRows, completedRows }) {
	console.log(`Progress: ${completedRows} / ${totalRows} rows completed`);
}

async function exportDatabase() {
	const blob = await appDatabase.export({ prettyJson: true, progressCallback });
	const fileName = 'database.json';
	saveAs(blob, fileName);
}
</script>

<template>
	<VBtn @click="exportDatabase">Export database</VBtn>
</template>

<style scoped></style>
