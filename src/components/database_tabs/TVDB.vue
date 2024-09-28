<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import EntryDialogGames from '../EntryDialogGames.vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import GameLog from '../../types/GameLog.ts';
import TVLog from '../../types/TVLog.ts';
import EntryDialogTV from '../EntryDialogTV.vue';

// see https://github.com/dexie/Dexie.js/issues/1608
const tvSeries = useObservable<TVLog[]>(from(liveQuery(() => appDatabase.television.toArray())));
const warningMessage = "This action cannot be undone."

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
	<VDataTable :headers="tvHeaders" :items="tvSeries" items-per-page="10">
		<template v-slot:item.actions="{ item }">
			<VIcon @click="editEntry(item)">mdi-pencil</VIcon>
			<VIcon @click="deleteEntryConfirmation(item)">mdi-delete</VIcon>
		</template>
	</VDataTable>
	<VDialog id="entry-form" v-model="showEditDialog">
		<EntryDialogTV
			@close-entry="showEditDialog = false"
			:tv-entry="entryDetails"
			:edit-entry="true"
		></EntryDialogTV>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog @confirm="deleteEntry" @cancel="showDeleteDialog = false" :message="warningMessage"></ConfirmDialog>
	</VDialog>
</template>

<style scoped>
#entry-form {
	width: 70%;
}
</style>
