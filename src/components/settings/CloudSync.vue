<script setup lang="ts">
import { axiosInstance } from '../../config/Utils.ts';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import { peakImportFile } from 'dexie-export-import';

const syncCode = ref(localStorage.getItem('syncCode'));
const lastSyncDate = ref(localStorage.getItem('lastSyncDate'));
const cloudSyncMsg = ref('');
const showCloudSyncMsg = ref(false);

function SyncToCloud() {
	// set synccode to localstorage
}

async function SyncFromCloud() {
	if (syncCode.value) {
		const response = await axiosInstance.get(`/logs/${syncCode.value}`);
		console.log(response);
		if (response.status === 200) {
			// convert to blob
			const pulledDB = new Blob([JSON.stringify(response.data.IndexedDB)]);
			console.log(pulledDB instanceof Blob);
			// TODO this is copied straight from the local import, so let's turn this into a function and use it for both
			const importMetadata = await peakImportFile(pulledDB);
			if (importMetadata.formatName != 'dexie') throw new Error('Invalid format');
			console.log('Database name:', importMetadata.data.databaseName);
			console.log('Database version:', importMetadata.data.databaseVersion);
			console.log(
				'Tables:',
				importMetadata.data.tables.map((t) => `${t.name} (${t.rowCount} rows)`).join('\n\t')
			);
			await appDatabase.import(pulledDB, { clearTablesBeforeImport: true });

			console.log('Import successful.');
		}
	} else {
		showCloudSyncMsg.value = true;
		cloudSyncMsg.value = 'Sync Code required for backup.';
	}
}
</script>

<template>
	<VLabel>Cloud Import/Export</VLabel>
	<!--	TODO add maxlength attribute later -->
	<VTextField label="Sync Code" v-model="syncCode" clearable></VTextField>
	<VBtn @click="SyncToCloud">Backup</VBtn>
	<VBtn @click="SyncFromCloud">Restore</VBtn>
	<VLabel>Last Backup: {{ lastSyncDate ? lastSyncDate : 'Unknown' }}</VLabel>
	<VSnackbar timeout="5000" v-model="showCloudSyncMsg">{{ cloudSyncMsg }}</VSnackbar>
</template>

<style scoped></style>
