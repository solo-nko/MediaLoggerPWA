<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import EntryDialogBooks from '../EntryDialogBooks.vue';
import BookLog from '../../types/BookLog.ts';
import { cantBeUndone } from '../../config/Messages.ts';

// see https://github.com/dexie/Dexie.js/issues/1608
const books = useObservable<BookLog[]>(from(liveQuery(() => appDatabase.books.toArray())));

const bookHeaders = [
	{ title: 'Title', value: 'title', key: 'title' },
	{ title: 'Series', value: 'series' },
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
	appDatabase.books.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<!--	TODO export items per page to external variable so it links with all of them. This is customizable on the screen though so careful-->
	<VDataTable :headers="bookHeaders" :items="books" items-per-page="10">
		<template v-slot:item.actions="{ item }">
			<VIcon @click="editEntry(item)">mdi-pencil</VIcon>
			<VIcon @click="deleteEntryConfirmation(item)">mdi-delete</VIcon>
		</template>
	</VDataTable>
	<VDialog id="entry-form" v-model="showEditDialog">
		<EntryDialogBooks
			@close-entry="showEditDialog = false"
			:book-entry="entryDetails"
			:edit-entry="true"
		></EntryDialogBooks>
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
	width: 70%;
}
</style>
