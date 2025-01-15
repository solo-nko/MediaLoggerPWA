<script setup lang="ts">
import { axiosInstance, overwriteDatabase, progressCallback } from '../../config/Utils.ts';
import { ref } from 'vue';
import { appDatabase } from '../../database/db.ts';
import { AxiosResponse } from 'axios';

const syncCode = ref(localStorage.getItem('syncCode'));
const lastSyncDate = ref(localStorage.getItem('lastSyncDate'));
const cloudSyncMsg = ref('');
const showCloudSyncMsg = ref(false);
const snackBarTimeout = ref(4000);

function triggerSnackBar(message: string): void {
	cloudSyncMsg.value = message;
	showCloudSyncMsg.value = true;
}

async function SyncToCloud() {
	const exportBlob = await appDatabase.export({ prettyJson: true, progressCallback });
	const convertedBlob = JSON.parse(await exportBlob.text());
	const updateCodeAndDate = (response: AxiosResponse) => {
		lastSyncDate.value = response.data.LastUpdated;
		localStorage.setItem('lastSyncDate', lastSyncDate.value);
		syncCode.value = response.data.SyncCode;
		localStorage.setItem('syncCode', syncCode.value);
	};
	// if there is a sync code present
	if (syncCode.value) {
		const response = await axiosInstance.put(`/logs/${syncCode.value}`, convertedBlob);
		if (response.status == 200) {
			updateCodeAndDate(response);
		} else {
			// TODO if code not found
			// ...
			updateCodeAndDate(response);
			triggerSnackBar('Sync Code not found! A new one has been issued.');
		}
	} else { // else if no sync code present
		const response = await axiosInstance.post(`/logs/`, convertedBlob);
		if (response.status === 200) {
			updateCodeAndDate(response);
			triggerSnackBar('Cloud backup successful! A Sync Code has been issued.');
		} else {
			// TODO if server encounters issue
			console.log(response);
		}
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
				triggerSnackBar('Cloud restore successful!');
			}
		} else {
			// TODO code not found
			triggerSnackBar('Cloud restore failed. Please verify your Sync Code.');
		}
	} else {
		triggerSnackBar('Please enter a Sync Code.')
	}
}
</script>

<template>
	<VLabel>Cloud Import/Export</VLabel>
	<p>Synchronise your database to the cloud! Here's how it works: <br> When you back up your database for the first
		time, it will be issued a unique "sync code" by the server. You can enter this sync code on other devices and press
		Restore in order to synchronize your database. Please note that databases are deleted from the server after 30
		days of inactivity. If your database is deleted, you will need to upload it again and receive a new sync code in
		order to resume using the cloud.</p>
	<!--	TODO add maxlength attribute later -->
	<VTextField v-model="syncCode" label="Sync Code" clearable></VTextField>
	<VBtn @click="SyncToCloud">Cloud Backup</VBtn>
	<VBtn @click="SyncFromCloud">Cloud Restore</VBtn>
	<VLabel>Last Backup: {{ lastSyncDate ? lastSyncDate : 'Unknown' }}</VLabel>
	<VSnackbar v-model="showCloudSyncMsg" :timeout="snackBarTimeout">{{ cloudSyncMsg }}</VSnackbar>
</template>

<style scoped></style>
