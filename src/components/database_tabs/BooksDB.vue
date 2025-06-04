<script setup lang="ts">
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { appDatabase } from '../../database/db.ts';
import { ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import EntryDialogBooks from '../entry_dialogs/EntryDialogBooks.vue';
import BookLog from '../../database/models/BookLog.ts';
import { Messages } from '../../config/Messages.ts';
import {
	itemsPerPageOptions,
	sortHeaders,
	sortLogByCreated,
	sortLogByUpdated
} from '../../config/Utils.ts';
import IHeaderItem from '../../types/IHeaderItem.ts';
import { useSearchStore } from '../../stores/store.ts';

// see https://github.com/dexie/Dexie.js/issues/1608
const books = useObservable<BookLog[]>(from(liveQuery(() => appDatabase.books.toArray())));
const itemsPerPageChild = defineModel('itemsPerPage', itemsPerPageOptions);
const bookHeaders: IHeaderItem[] = [
	{ title: 'Title', value: 'title', key: 'title' },
	{ title: 'Series', value: 'series' },
	{ title: 'Status', value: 'status', key: 'status' },
	{ title: 'Date Created', value: 'dateCreated', sortable: true, sortRaw: sortLogByCreated },
	{ title: 'Date Updated', value: 'dateModified', sortable: true, sortRaw: sortLogByUpdated },
	{ title: 'Actions', value: 'actions', key: 'actions', sortable: false }
];

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const entryDetails = ref<BookLog>();
const search = useSearchStore();

function editEntry(entryInfo: BookLog) {
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}

function deleteEntryConfirmation(entryInfo: BookLog) {
	showDeleteDialog.value = true;
	entryDetails.value = entryInfo;
}

async function deleteEntry() {
	appDatabase.books.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<VDataTable
		v-model:items-per-page="itemsPerPageChild"
		:headers="bookHeaders"
		:items="books"
		:sort-by="sortHeaders"
		:search="search.dbSearchValue"
	>
		<!--	eslint-disable vue/valid-v-slot -->
		<template v-slot:item.actions="{ item }">
			<VIcon icon="$pencil" @click="editEntry(item)"></VIcon>
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
			:message="Messages.cantBeUndone"
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
