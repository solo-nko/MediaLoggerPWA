<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { axiosInstance, overwriteDatabase } from '../config/Utils.ts';
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

const syncFromCloud = async () => {
	try {
		if (pulledDB.value !== undefined) {
			console.log(`pulled DB is Blob? ${pulledDB.value instanceof Blob}`);
			const importSuccess = await overwriteDatabase(pulledDB.value);
			if (importSuccess) {
				props.triggerSnackBar('Cloud restore successful!');
			}
		}
	} catch (error) {
		console.log(error);
		props.triggerSnackBar('Cloud restore failed. Please verify your Sync Code.');
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
		}
	} catch (error) {
		console.log(error);
		// TODO: change text from 'inquiring...' when this happens
		props.triggerSnackBar('Log not found. Please verify your Sync Code');
	}
});
</script>

<template>
	<VCard>
		<VCardTitle>Cloud Restore</VCardTitle>
		<VCardText>{{
			lastSyncDate ? 'Log found! Press restore to download it. This cannot be undone.' : ''
		}}</VCardText>
		<VCardText>
			<VLabel>{{ lastSyncDate ? `Log Date: ${lastSyncDateFormatted}` : 'Inquiring...' }}</VLabel>
		</VCardText>
		<VCardActions>
			<VBtn :loading="restoreLoading" :disabled="restoreDisabled" @click="syncFromCloud"
				>Restore</VBtn
			>
			<VBtn @click="onCancel">Cancel</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
.v-label {
	white-space: unset;
}
</style>
