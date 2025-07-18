<script setup lang="ts">
import { liveQuery } from "dexie";
import { useObservable, from } from "@vueuse/rxjs";
import { inject, ref } from "vue";
import { appDatabase } from "../../database/db.ts";
import EntryDialogGames from "../entry_dialogs/EntryDialogGames.vue";
import ConfirmDialog from "../ConfirmDialog.vue";
import GameLog from "../../database/models/GameLog.ts";
import Messages from "../../config/Messages.ts";
import {
	sortHeaders,
	sortLogByCreated,
	sortLogByUpdated,
	injectionKeySaveToast
} from "../../config/Utils.ts";
import IHeaderItem from "../../types/IHeaderItem.ts";
import { useLogDbStore } from "../../stores/store.ts";

// see https://github.com/dexie/Dexie.js/issues/1608
const games = useObservable<GameLog[]>(from(liveQuery(() => appDatabase.games.toArray())));
const gameHeaders: IHeaderItem[] = [
	{ title: "Title", value: "title", key: "title" },
	{ title: "Platform", value: "platform" },
	{ title: "Status", value: "status", key: "status" },
	{ title: "Date Created", value: "dateCreated", sortable: true, sortRaw: sortLogByCreated },
	{ title: "Date Updated", value: "dateModified", sortable: true, sortRaw: sortLogByUpdated },
	{ title: "Actions", value: "actions", key: "actions", sortable: false }
];

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const entryDetails = ref<GameLog>();
const logDbStore = useLogDbStore();
const configureSaveMessage = inject<(which: "add" | "edit") => void>(injectionKeySaveToast);

function editEntry(entryInfo: GameLog) {
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}

function deleteEntryConfirmation(entryInfo: GameLog) {
	showDeleteDialog.value = true;
	entryDetails.value = entryInfo;
}

async function deleteEntry() {
	appDatabase.games.delete(entryDetails.value.id);
	showDeleteDialog.value = false;
}
</script>

<template>
	<VDataTable
		v-model:items-per-page="logDbStore.itemsPerPage"
		:items-per-page-options="logDbStore.itemsPerPageOptions"
		:headers="gameHeaders"
		:items="games"
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
		<EntryDialogGames
			:entry="entryDetails"
			:edit-entry="true"
			@close-entry="showEditDialog = false"
			@save-entry="configureSaveMessage"
		></EntryDialogGames>
	</VDialog>
	<VDialog v-model="showDeleteDialog">
		<ConfirmDialog
			:message="Messages.CANNOT_UNDO"
			@confirm="deleteEntry"
			@cancel="showDeleteDialog = false"
		></ConfirmDialog>
	</VDialog>
</template>

<style scoped lang="scss">
#entry-form {
	width: 80%;
}
</style>
