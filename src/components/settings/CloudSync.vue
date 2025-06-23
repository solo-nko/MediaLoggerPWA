<script setup lang="ts">
import { inject, ref } from "vue";
import Messages from "../../config/Messages.ts";
import { injectionKeySnackbarTimeout } from "../../config/Utils.ts";
import RestoreConfirmDialog from "../RestoreConfirmDialog.vue";
import { useSyncStore } from "../../stores/store.ts";

const syncStore = useSyncStore();
const cloudSyncMsg = ref("");
const showCloudSyncMsg = ref(false);
const dateStampLoading = ref(false);
const loadingOperation = ref(false);
const showRestoreDialog = ref(false);
const snackbarTimeout = inject(injectionKeySnackbarTimeout);

/** Returns true if valid, or a string explaining why if invalid */
const isSyncCodeFieldInputValid = () => {
	return syncStore.syncCodeValid || "Sync Code must be 6 characters.";
};

/** Displays snack bar message.
 * @param message message to display */
function triggerSnackBar(message: string): void {
	cloudSyncMsg.value = message;
	showCloudSyncMsg.value = true;
}

async function SyncToCloudAndNotify() {
	dateStampLoading.value = true;
	loadingOperation.value = true;
	syncStore
		.SyncToCloud()
		.then((result) => {
			if (result === 200) triggerSnackBar(Messages.CLOUD_BACKUP_SUCCESS);
			else if (result === 201) triggerSnackBar(Messages.CLOUD_UPDATE_SUCCESS);
			else if (result === 503) triggerSnackBar(Messages.ERROR_RESPONSE_503);
			else if (typeof result === "number") triggerSnackBar(Messages.ERROR_SERVER);
		})
		.finally(() => {
			loadingOperation.value = false;
			dateStampLoading.value = false;
		});
}

function openRestoreDialog() {
	// if sync code is valid
	if (syncStore.syncCodeValid) {
		loadingOperation.value = true;
		showRestoreDialog.value = true;
	} else {
		triggerSnackBar(Messages.ENTER_VALID_CODE);
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
			v-model.lazy="syncStore.syncCode"
			label="Sync Code"
			:rules="[isSyncCodeFieldInputValid]"
			clearable
			variant="filled"
		></VTextField>
		<div class="button-row">
			<VBtn :disabled="loadingOperation" :loading="loadingOperation" @click="SyncToCloudAndNotify"
				>Cloud Backup
			</VBtn>
			<VBtn :disabled="loadingOperation" :loading="loadingOperation" @click="openRestoreDialog"
				>Cloud Restore
			</VBtn>
		</div>
		<VSkeletonLoader id="backup-stamp" type="text" :loading="dateStampLoading">
			<VLabel>Last Backup: {{ syncStore.lastBackupDateFormatted }}</VLabel>
		</VSkeletonLoader>
	</div>
	<VDialog
		v-model="showRestoreDialog"
		@after-leave="
			() => {
				loadingOperation = false;
				syncStore.AbortSync();
			}
		"
	>
		<RestoreConfirmDialog
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
