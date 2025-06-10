<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { axiosInstance, overwriteDatabase } from '../config/Utils.ts';
import Messages from '../config/Messages.ts';
import { DateTime } from 'luxon';

const emits = defineEmits(['confirm', 'cancel']);
const props = defineProps<{
	dryRun?: boolean;
	message?: string;
	syncCode: string;
	triggerSnackBar: (message: string) => void;
}>();

const restoreLoading = ref(true);
const restoreDisabled = ref(true);
const lastSyncDate = ref('');
const pulledDB = ref<Blob>(undefined);
const controller = new AbortController();
const { signal } = controller;
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
	controller.abort();
	emits('cancel');
};

// first step, check with the server for the log and pull it down if possible
onMounted(async () => {
	try {
		if (props.dryRun) return;
		const response = await axiosInstance.get(`/logs/${props.syncCode}`, { signal });
		console.log(response);
		if (response.status === 200) {
			// convert to blob
			pulledDB.value = new Blob([JSON.stringify(response.data.IndexedDB)]);
			lastSyncDate.value = response.data.LastUpdated;
			restoreLoading.value = false;
			restoreDisabled.value = false;
			labelText.value = `Log Date: ${lastSyncDateFormatted.value}`;
		}
	} catch (error) {
		console.log(error);
		labelText.value = Messages.LOG_NOT_FOUND;
		restoreLoading.value = false;
		props.triggerSnackBar(Messages.CLOUD_RESTORE_FAIL_ABORT);
	}
});
</script>

<template>
	<VCard>
		<VCardTitle>Cloud Restore</VCardTitle>
		<VCardText>{{ lastSyncDate ? Messages.INQUIRY_SUCCESS : '' }} </VCardText>
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
