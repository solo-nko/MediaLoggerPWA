<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable } from '@vueuse/rxjs';
import { appDatabase } from '../database/db.ts';
import { ref } from 'vue';
import EntryDialogGames from '../components/EntryDialogGames.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';

// ref may be required
const games = useObservable(liveQuery(() => appDatabase.games.toArray()));
const gameHeaders = [
	{ title: 'Title', value: 'title', key: 'title' },
	{ title: 'Platform', value: 'platform' },
	{ title: 'Status', value: 'status', key: 'status' },
	{ title: 'Date Created', value: 'dateCreated' },
	{ title: 'Date Updated', value: 'dateModified' },
	{ title: 'Actions', value: 'actions', key: 'actions', sortable: false }
];

const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const entryDetails = ref()
function editEntry(entryInfo) {
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}

function deleteEntryConfirmation(entryInfo) {
	showDeleteDialog.value = true;
	entryDetails.value = entryInfo;
}

async function deleteEntry() {
	appDatabase.games.delete(entryDetails.value.id)
	showDeleteDialog.value = false;
}

</script>

<template>
	<VDataTable :headers="gameHeaders" :items="games" items-per-page="10">
		<template v-slot:item.actions="{item}">
			<VLabel @click="editEntry(item)">Edit</VLabel>
			<VLabel @click="deleteEntryConfirmation(item)">Delete</VLabel>
		</template>
	</VDataTable>
	<VDialog v-model="showEditDialog">
		<EntryDialogGames @close-entry="showEditDialog = false" :game-entry="entryDetails" :edit-entry="true" ></EntryDialogGames>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog @confirm="deleteEntry" @cancel="showDeleteDialog = false"></ConfirmDialog>
	</VDialog>
</template>


<style scoped>

</style>