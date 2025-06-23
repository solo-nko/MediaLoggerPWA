<script setup lang="ts">
import { liveQuery } from "dexie";
import { useObservable, from } from "@vueuse/rxjs";
import { inject, ref } from "vue";
import { appDatabase } from "../../database/db.ts";
import ConfirmDialog from "../ConfirmDialog.vue";
import TVLog from "../../database/models/TVLog.ts";
import EntryDialogTV from "../entry_dialogs/EntryDialogTV.vue";
import Messages from "../../config/Messages.ts";
import {
	injectionKeySaveToast,
	sortHeaders,
	sortLogByCreated,
	sortLogByUpdated
} from "../../config/Utils.ts";
import IHeaderItem from "../../types/IHeaderItem.ts";
import { useLogDbStore } from "../../stores/store.ts";

// see https://github.com/dexie/Dexie.js/issues/1608
const tvSeries = useObservable<TVLog[]>(from(liveQuery(() => appDatabase.television.toArray())));
const tvHeaders: IHeaderItem[] = [
	{ title: "Title", value: "title", key: "title" },
	{ title: "Episode", value: "episode" },
	{ title: "Status", value: "status", key: "status" },
	{ title: "Date Created", value: "dateCreated", sortable: true, sortRaw: sortLogByCreated },
	{ title: "Date Updated", value: "dateModified", sortable: true, sortRaw: sortLogByUpdated },
	{ title: "Actions", value: "actions", key: "actions", sortable: false }
];

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const entryDetails = ref<TVLog>();
const logDbStore = useLogDbStore();
const configureSaveMessage = inject<(which: "add" | "edit") => void>(injectionKeySaveToast);

function editEntry(entryInfo: TVLog) {
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}

function deleteEntryConfirmation(entryInfo: TVLog) {
	showDeleteDialog.value = true;
	entryDetails.value = entryInfo;
}

async function deleteEntry() {
	appDatabase.television.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<VDataTable
		v-model:items-per-page="logDbStore.itemsPerPage"
		:items-per-page-options="logDbStore.itemsPerPageOptions"
		:headers="tvHeaders"
		:items="tvSeries"
		:sort-by="sortHeaders"
		:search="logDbStore.dbSearchValue"
	>
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
			@save-entry="configureSaveMessage"
		></EntryDialogTV>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog
			:message="Messages.CANNOT_UNDO"
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
