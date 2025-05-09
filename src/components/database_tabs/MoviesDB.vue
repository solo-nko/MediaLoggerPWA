<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import MovieLog from '../../database/models/MovieLog.ts';
import EntryDialogMovies from '../entry_dialogs/EntryDialogMovies.vue';
import { Messages } from '../../config/Messages.ts';
import {
	itemsPerPageOptions,
	sortHeaders,
	sortLogByCreated,
	sortLogByUpdated
} from '../../config/Utils.ts';
import IHeaderItem from '../../types/IHeaderItem.ts';

// see https://github.com/dexie/Dexie.js/issues/1608
const movies = useObservable<MovieLog[]>(from(liveQuery(() => appDatabase.movies.toArray())));
const itemsPerPageChild = defineModel('itemsPerPage', itemsPerPageOptions);
const movieHeaders: IHeaderItem[] = [
	{ title: 'Title', value: 'title', key: 'title' },
	{ title: 'Series', value: 'series', key: 'series' },
	{ title: 'Date Created', value: 'dateCreated', sortable: true, sortRaw: sortLogByCreated },
	{ title: 'Date Updated', value: 'dateModified', sortable: true, sortRaw: sortLogByUpdated },
	{ title: 'Actions', value: 'actions', key: 'actions', sortable: false }
];

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const entryDetails = ref<MovieLog>();

function editEntry(entryInfo: MovieLog) {
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}

function deleteEntryConfirmation(entryInfo: MovieLog) {
	showDeleteDialog.value = true;
	entryDetails.value = entryInfo;
}

async function deleteEntry() {
	appDatabase.movies.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<VDataTable
		v-model:items-per-page="itemsPerPageChild"
		:headers="movieHeaders"
		:items="movies"
		:sort-by="sortHeaders"
	>
		<!--	eslint-disable vue/valid-v-slot -->
		<template v-slot:item.actions="{ item }">
			<VIcon icon="$pencil" @click="editEntry(item)"></VIcon>
			<VIcon icon="$trash" @click="deleteEntryConfirmation(item)"></VIcon>
		</template>
	</VDataTable>
	<VDialog id="entry-form" v-model="showEditDialog">
		<EntryDialogMovies
			:entry="entryDetails"
			:edit-entry="true"
			@close-entry="showEditDialog = false"
		></EntryDialogMovies>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog
			:message="Messages.cantBeUndone"
			@confirm="deleteEntry"
			@cancel="showDeleteDialog = false"
		></ConfirmDialog>
	</VDialog>
</template>

<style scoped>
#entry-form {
	width: 80%;
}
</style>
