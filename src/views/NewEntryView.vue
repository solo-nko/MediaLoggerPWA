<script setup lang="ts">
import { inject, ref } from "vue";
import EntryDialogGames from "../components/entry_dialogs/EntryDialogGames.vue";
import EntryDialogTV from "../components/entry_dialogs/EntryDialogTV.vue";
import EntryDialogBooks from "../components/entry_dialogs/EntryDialogBooks.vue";
import EntryDialogMovies from "../components/entry_dialogs/EntryDialogMovies.vue";
import { settingsStore } from "../stores/store.ts";
import { injectionKeySaveToast } from "../config/Utils.ts";

// for use with dynamic component solution
/*const currentTab = ref('game');
const tabs = {
	"game": EntryDialogGames,
	"tv": EntryDialogTV,
};*/

const tabs = ref(settingsStore.defaultEntryScreen);
const configureSaveMessage = inject<(which: "add" | "edit") => void>(injectionKeySaveToast);
</script>

<template>
	<VContainer>
		<VRow justify="center">
			<VTabs id="tab-bar" v-model="tabs" align-tabs="center">
				<VTab value="game">Game</VTab>
				<VTab value="tv">TV Series</VTab>
				<VTab value="movie">Movie</VTab>
				<VTab value="book">Book</VTab>
			</VTabs>
		</VRow>
		<VRow>
			<VCol>
				<VTabsWindow id="entry-form" v-model="tabs" class="">
					<VTabsWindowItem value="game">
						<!-- if quill isn't unmounted, issues come up with rendering -->
						<EntryDialogGames
							v-if="tabs == 'game'"
							:edit-entry="false"
							:close-button="false"
							@save-entry="configureSaveMessage"
						></EntryDialogGames>
					</VTabsWindowItem>
					<VTabsWindowItem value="tv">
						<EntryDialogTV
							v-if="tabs == 'tv'"
							:edit-entry="false"
							:close-button="false"
							@save-entry="configureSaveMessage"
						></EntryDialogTV>
					</VTabsWindowItem>
					<VTabsWindowItem value="movie">
						<EntryDialogMovies
							v-if="tabs == 'movie'"
							:edit-entry="false"
							:close-button="false"
							@save-entry="configureSaveMessage"
						></EntryDialogMovies>
					</VTabsWindowItem>
					<VTabsWindowItem value="book">
						<EntryDialogBooks
							v-if="tabs == 'book'"
							:edit-entry="false"
							:close-button="false"
							@save-entry="configureSaveMessage"
						></EntryDialogBooks>
					</VTabsWindowItem>
				</VTabsWindow>
			</VCol>
		</VRow>
	</VContainer>
</template>

<style scoped>
/*#entry-form {
	margin-top: 0;
	width: 70%;
}*/
</style>
