<script setup lang="ts">
import { axiosInstance, overwriteDatabase, progressCallback } from '../../config/Utils.ts';
import { ref } from 'vue';
import { appDatabase } from '../../database/db.ts';

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
			const importSuccess = await overwriteDatabase(pulledDB);
			if (importSuccess) {
				console.log('Import successful.');
			}
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
