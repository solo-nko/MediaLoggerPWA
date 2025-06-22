<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { DateTime } from 'luxon';
import { overwriteDatabase } from '../config/Utils.ts';
import Messages from '../config/Messages.ts';
import { useSyncStore } from '../stores/store.ts';

const emits = defineEmits(['confirm', 'cancel']);
const props = defineProps<{
	dryRun?: boolean;
	message?: string;
	triggerSnackBar: (message: string) => void;
}>();

const syncStore = useSyncStore();
const restoreLoading = ref(true);
const restoreDisabled = ref(true);
const lastSyncDate = ref('');
const pulledDB = ref<Blob>(undefined);
const lastSyncDateFormatted = computed(() => {
	const inputSyncDate = DateTime.fromISO(lastSyncDate.value);
	if (inputSyncDate.isValid) return inputSyncDate.toLocaleString(DateTime.DATETIME_FULL);
	return 'Unknown';
});
const labelText = ref<string>(Messages.INQUIRY_IN_PROGRESS);

const syncFromCloud = async () => {
	try {
		if (pulledDB.value !== undefined) {
			console.log(`pulled DB is Blob? ${pulledDB.value instanceof Blob}`);
			const importSuccess = await overwriteDatabase(pulledDB.value);
			if (importSuccess) {
				props.triggerSnackBar(Messages.CLOUD_RESTORE_SUCCESS);
			}
		}
	} catch (error) {
		console.log(error);
		props.triggerSnackBar(Messages.CLOUD_RESTORE_FAIL);
	}
	emits('confirm');
};

const onCancel = () => {
	emits('cancel');
};

// first step, check with the server for the log and pull it down if possible
onMounted(async () => {
	if (props.dryRun) return;
	await syncStore.SyncFromCloud().then((result) => {
		if (result.status >= 200 && result.status < 300 && result.pulledLog !== undefined) {
			// set log data
			pulledDB.value = result.pulledLog;
			// set synced date
			lastSyncDate.value = result.lastUploadedDate;
			labelText.value = `Log Date: ${lastSyncDateFormatted.value}`;
			// unlock "restore" button
			restoreDisabled.value = false;
		} else {
			labelText.value = Messages.ERROR_RESPONSE_404;
			props.triggerSnackBar(Messages.CLOUD_RESTORE_FAIL_ABORT);
		}
		restoreLoading.value = false;
	});
});
</script>

<template>
	<VCard>
		<VCardTitle>Cloud Restore</VCardTitle>
		<VCardText>{{ lastSyncDate ? Messages.INQUIRY_SUCCESS : '' }}</VCardText>
		<VCardText>
			<VLabel>{{ labelText }}</VLabel>
		</VCardText>
		<VCardActions>
			<VBtn :loading="restoreLoading" :disabled="restoreDisabled" @click="syncFromCloud"
				>Restore
			</VBtn>
			<VBtn @click="onCancel">Cancel</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
.v-label {
	white-space: unset;
}
</style>
