<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import MovieLog from '../../types/MovieLog.ts';
import EntryDialogMovies from '../entry_dialogs/EntryDialogMovies.vue';
import { cantBeUndone } from '../../config/Messages.ts';

// see https://github.com/dexie/Dexie.js/issues/1608
const movies = useObservable<MovieLog[]>(from(liveQuery(() => appDatabase.movies.toArray())));

const movieHeaders = [
	{ title: 'Title', value: 'title', key: 'title' },
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
	appDatabase.movies.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<VDataTable :headers="movieHeaders" :items="movies" items-per-page="10">
		<template v-slot:item.actions="{ item }">
			<VIcon @click="editEntry(item)">mdi-pencil</VIcon>
			<VIcon @click="deleteEntryConfirmation(item)">mdi-delete</VIcon>
		</template>
	</VDataTable>
	<VDialog id="entry-form" v-model="showEditDialog">
		<EntryDialogMovies
			@close-entry="showEditDialog = false"
			:entry="entryDetails"
			:edit-entry="true"
		></EntryDialogMovies>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog
			@confirm="deleteEntry"
			@cancel="showDeleteDialog = false"
			:message="cantBeUndone"
		></ConfirmDialog>
	</VDialog>
</template>

<style scoped>
#entry-form {
	width: 80%;
}
</style>
