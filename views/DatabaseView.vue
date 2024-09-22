<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable } from '@vueuse/rxjs';
import { appDatabase } from '../src/database/db';
import { ref } from 'vue';
import EntryDialogGames from '../src/components/EntryDialogGames.vue';

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
const entryDetails = ref()
function editEntry(entryInfo) {
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}

</script>

<template>
	<VDataTable :headers="gameHeaders" :items="games" items-per-page="10">
		<template v-slot:item.actions="{item}">
			<VLabel @click="editEntry(item)">Edit</VLabel>
		</template>
	</VDataTable>
	<VDialog v-model="showEditDialog">
		<EntryDialogGames @close-entry="showEditDialog = false" :game-entry="entryDetails" :edit-entry="true" ></EntryDialogGames>
	</VDialog>
</template>


<style scoped>

</style>