<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import EntryDialogGames from '../EntryDialogGames.vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import GameLog from '../../types/GameLog.ts';

// see https://github.com/dexie/Dexie.js/issues/1608
const games = useObservable<GameLog[]>(from(liveQuery(() => appDatabase.games.toArray())));
const warningMessage = "This action cannot be undone."

const gameHeaders = [
	{ title: 'Title', value: 'title', key: 'title' },
	{ title: 'Platform', value: 'platform' },
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
	appDatabase.games.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<VDataTable :headers="gameHeaders" :items="games" items-per-page="10">
		<template v-slot:item.actions="{ item }">
			<VIcon @click="editEntry(item)">mdi-pencil</VIcon>
			<VIcon @click="deleteEntryConfirmation(item)">mdi-delete</VIcon>
		</template>
	</VDataTable>
	<VDialog id="entry-form" v-model="showEditDialog">
		<EntryDialogGames
			@close-entry="showEditDialog = false"
			:game-entry="entryDetails"
			:edit-entry="true"
		></EntryDialogGames>
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
