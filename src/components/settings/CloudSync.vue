<script setup lang="ts">
import {
	axiosInstance,
	injectionKeySnackbarTimeout,
	progressCallback
} from '../../config/Utils.ts';
import { computed, inject, ref } from 'vue';
import { appDatabase } from '../../database/db.ts';
import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import RestoreConfirmDialog from '../RestoreConfirmDialog.vue';
import { AjaxResponse } from 'rxjs/internal/ajax/AjaxResponse';

const syncCode = ref(localStorage.getItem('syncCode'));
const lastSyncDate = ref(localStorage.getItem('lastSyncDate'));
const lastSyncDateFormatted = computed(() => {
	const inputSyncDate = DateTime.fromISO(lastSyncDate.value);
	if (inputSyncDate.isValid) return inputSyncDate.toLocaleString(DateTime.DATETIME_FULL);
	return 'Unknown';
});
const cloudSyncMsg = ref('');
const showCloudSyncMsg = ref(false);
const dateStampLoading = ref(false);
const loadingOperation = ref(false);
const showRestoreDialog = ref(false);
const snackbarTimeout = inject(injectionKeySnackbarTimeout);

// returns true if empty, or a string if not six characters
const syncCodeCharLimit = (value: string) => {
	if (!value) return true;
	return value.length == 6 || 'Sync Code must be 6 characters.';
};

function triggerSnackBar(message: string): void {
	cloudSyncMsg.value = message;
	showCloudSyncMsg.value = true;
	loadingOperation.value = false;
}

async function SyncToCloud() {
	dateStampLoading.value = true;
	loadingOperation.value = true;
	// export media log as blob
	const exportBlob = await appDatabase.export({ prettyJson: true, progressCallback });
	// create JSON from blob, so the server can parse it correctly
	const convertedBlob = JSON.parse(await exportBlob.text());
	/**
	 * Updates Sync Code and Last Updated fields, both shown to the user and stored in browser localStorage. Intended to use the same values stored in the cloud database, which is why it requires the axios response as a parameter.
	 */
	const updateCodeAndDate = (response: AxiosResponse) => {
		if ('LastUpdated' in response.data && 'SyncCode' in response.data) {
			lastSyncDate.value = response.data.LastUpdated;
			// setting to localStorage allows the browser to recall this value when the page is loaded again later
			localStorage.setItem('lastSyncDate', lastSyncDate.value);
			syncCode.value = response.data.SyncCode;
			localStorage.setItem('syncCode', syncCode.value);
		} else {
			console.log('API response payload incomplete.');
			console.log('API Response:');
			console.log(response.data);
		}
		dateStampLoading.value = false;
	};
	// if there is a sync code present, this will be considered a PUT request.
	if (syncCode.value) {
		await axiosInstance
			.put(`/logs/${syncCode.value}`, convertedBlob)
			.then((responseSuccess) => {
				if (responseSuccess.status === 200) {
					updateCodeAndDate(responseSuccess);
					triggerSnackBar('Cloud backup successfully updated!');
				} else if (responseSuccess.status === 201) {
					updateCodeAndDate(responseSuccess);
					triggerSnackBar('Sync Code not found! A new one has been issued.');
				}
			})
			.catch((responseError) => {
				console.log('error: ', responseError);
				if (responseError.status === 503) {
					triggerSnackBar('The server isn\'t responding right now. Please try again later.');
				} else {
					triggerSnackBar('A server error has occurred. Please try again later.');
				}
			});
	} else {
		// else if no sync code present, this will be considered a POST request
		await axiosInstance.post(`/logs/`, convertedBlob).then((response) => {
			if (response.status === 201) {
				updateCodeAndDate(response);
				triggerSnackBar('Cloud backup successful! A Sync Code has been issued.');
			}
		}).catch((error) => {
			if (error.status == 503) {
				triggerSnackBar('The server isn\'t responding right now. Please try again later.');
			} else {
				triggerSnackBar('A server error has occurred. Please try again later.');
			}
		});
	}
	// make sure loading status goes away
	if (dateStampLoading.value) {
		dateStampLoading.value = false;
	}
}

function openRestoreDialog() {
	loadingOperation.value = true;
	// if sync code is valid
	if (syncCode.value !== null && syncCode.value.length == 6) {
		showRestoreDialog.value = true;
	} else {
		triggerSnackBar('Please enter a valid Sync Code.');
	}
}
</script>
<template>
	<div id="container-cloud-sync">
		<VLabel class="label-cloud-sync">Cloud Import/Export</VLabel>
		<p>
			Synchronise your media log to the cloud! Here's how it works: <br />
			When you back up your log for the first time, it will be issued a unique "Sync Code" by the
			server. You can enter this Sync Code on other devices and press Restore in order to download
			your media log. Please note that media logs are deleted from the server after 30 days of
			inactivity. If your log is deleted, you will need to upload it again (with the Cloud Backup
			button) and receive a new Sync Code in order to resume using the cloud.
		</p>
		<VTextField
			v-model="syncCode"
			label="Sync Code"
			:rules="[syncCodeCharLimit]"
			clearable
			variant="filled"
		></VTextField>
		<div class="button-row">
			<VBtn :disabled="loadingOperation" :loading="loadingOperation" @click="SyncToCloud"
			>Cloud Backup
			</VBtn>
			<VBtn :disabled="loadingOperation" :loading="loadingOperation" @click="openRestoreDialog"
			>Cloud Restore
			</VBtn>
		</div>
		<VSkeletonLoader id="backup-stamp" type="text" :loading="dateStampLoading">
			<VLabel>Last Backup: {{ lastSyncDateFormatted }}</VLabel>
		</VSkeletonLoader>
	</div>
	<VDialog v-model="showRestoreDialog">
		<RestoreConfirmDialog
			:sync-code="syncCode"
			:trigger-snack-bar="triggerSnackBar"
			@confirm="showRestoreDialog = false"
			@cancel="
				() => {
					showRestoreDialog = false;
					loadingOperation = false;
				}
			"
		/>
	</VDialog>

	<VSnackbar v-model="showCloudSyncMsg" :timeout="snackbarTimeout">{{ cloudSyncMsg }}</VSnackbar>
</template>

<style scoped>
#container-cloud-sync {
	display: flex;
	flex-direction: column;
}

.button-row {
	display: flex;
	justify-content: space-around;
}

#backup-stamp {
	margin: 1rem;
	display: flex;
	justify-content: center;
	text-align: center;
}

p {
	font-size: 85%;
	margin-bottom: 1rem;
}
</style>
