<script setup lang="ts">
import { axiosInstance, overwriteDatabase, progressCallback } from '../../config/Utils.ts';
import { ref } from 'vue';
import { appDatabase } from '../../database/db.ts';

const syncCode = ref(localStorage.getItem('syncCode'));
const lastSyncDate = ref(localStorage.getItem('lastSyncDate'));
const cloudSyncMsg = ref('');
const showCloudSyncMsg = ref(false);

async function SyncToCloud() {
	// TODO: add code for when a sync code is presented by the client, and when that sync code is 404'd.
	const exportBlob = await appDatabase.export({ prettyJson: true, progressCallback });
	const convertedBlob = JSON.parse(await exportBlob.text())
	const response = await axiosInstance.post(`/logs/`, convertedBlob);
	if (response.status === 200) {
		lastSyncDate.value = response.data.LastUpdated;
		localStorage.setItem('lastSyncDate', lastSyncDate.value);
		syncCode.value = response.data.SyncCode
		localStorage.setItem('syncCode', syncCode.value)
	} else {
		// TODO expand
		console.log(response);
	}
}

async function SyncFromCloud() {
	if (syncCode.value) {
		const response = await axiosInstance.get(`/logs/${syncCode.value}`);
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
	<p>Synchronise your database to the cloud! Here's how it works: <br> When you back up your database for the first time, it will be issued a unique "sync code" by the server. You can enter this sync code on other devices and press Restore in order to synchronize your database. Please note that databases that are deleted from the server after 30 days of inactivity. If your database is deleted, you will need to upload it again and receive a new sync code in order to resume using the cloud.</p>
	<!--	TODO add maxlength attribute later -->
	<VTextField v-model="syncCode" label="Sync Code" clearable></VTextField>
	<VBtn @click="SyncToCloud">Cloud Backup</VBtn>
	<VBtn @click="SyncFromCloud">Cloud Restore</VBtn>
	<VLabel>Last Backup: {{ lastSyncDate ? lastSyncDate : 'Unknown' }}</VLabel>
	<VSnackbar v-model="showCloudSyncMsg" timeout="5000">{{ cloudSyncMsg }}</VSnackbar>
</template>

<style scoped></style>
