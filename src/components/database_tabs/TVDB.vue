<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import TVLog from '../../types/TVLog.ts';
import EntryDialogTV from '../entry_dialogs/EntryDialogTV.vue';
import { cantBeUndone } from '../../config/Messages.ts';
import { itemsPerPageOptions } from '../../config/Utils.ts';

// see https://github.com/dexie/Dexie.js/issues/1608
const tvSeries = useObservable<TVLog[]>(from(liveQuery(() => appDatabase.television.toArray())));
const itemsPerPageChild = defineModel('itemsPerPage', itemsPerPageOptions);
const tvHeaders = [
	{ title: 'Title', value: 'title', key: 'title' },
	{ title: 'Episode', value: 'episode' },
	{ title: 'Status', value: 'status', key: 'status' },
	{ title: 'Date Created', value: 'dateCreated' },
	{ title: 'Date Updated', value: 'dateModified' },
	{ title: 'Actions', value: 'actions', key: 'actions', sortable: false }
];

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const entryDetails = ref();

function editEntry(entryInfo) {
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}

function deleteEntryConfirmation(entryInfo) {
	showDeleteDialog.value = true;
	entryDetails.value = entryInfo;
}

async function deleteEntry() {
	appDatabase.television.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<VDataTable v-model:items-per-page="itemsPerPageChild" :headers="tvHeaders" :items="tvSeries">
		<!--	eslint-disable vue/valid-v-slot -->
		<template v-slot:item.actions="{ item }">
			<VIcon icon="$pencil" @click="editEntry(item)"></VIcon>
			<VIcon icon="$trash" @click="deleteEntryConfirmation(item)"></VIcon>
		</template>
	</VDataTable>
	<VDialog id="entry-form" v-model="showEditDialog">
		<EntryDialogTV
			:entry="entryDetails"
			:edit-entry="true"
			@close-entry="showEditDialog = false"
		></EntryDialogTV>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog
			:message="cantBeUndone"
			@cancel="showDeleteDialog = false"
			@confirm="deleteEntry"
		></ConfirmDialog>
	</VDialog>
</template>

<style scoped>
#entry-form {
	width: 80%;
}
</style>
