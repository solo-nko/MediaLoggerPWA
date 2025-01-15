<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import EntryDialogBooks from '../entry_dialogs/EntryDialogBooks.vue';
import BookLog from '../../types/BookLog.ts';
import { cantBeUndone } from '../../config/Messages.ts';
import { itemsPerPageOptions } from '../../config/Utils.ts';

// see https://github.com/dexie/Dexie.js/issues/1608
const books = useObservable<BookLog[]>(from(liveQuery(() => appDatabase.books.toArray())));
const itemsPerPageChild = defineModel('itemsPerPage', itemsPerPageOptions);
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
	<VDataTable v-model:items-per-page="itemsPerPageChild" :headers="bookHeaders" :items="books">
		<template v-slot:item.actions="{ item }">
			<VIcon icon="pencil" @click="editEntry(item)"></VIcon>
			<VIcon icon="$trash" @click="deleteEntryConfirmation(item)"></VIcon>
		</template>
	</VDataTable>
	<VDialog id="entry-form" v-model="showEditDialog">
		<EntryDialogBooks
			:entry="entryDetails"
			:edit-entry="true"
			@close-entry="showEditDialog = false"
		></EntryDialogBooks>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog
			:message="cantBeUndone"
			@confirm="deleteEntry"
			@cancel="showDeleteDialog = false"
		></ConfirmDialog>
	</VDialog>
</template>

<style scoped>
#entry-form {
	width: 70%;
}
</style>
