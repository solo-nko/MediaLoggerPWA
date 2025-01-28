<script setup lang="ts">
import EntryDialogGames from '../components/entry_dialogs/EntryDialogGames.vue';
import EntryDialogTV from '../components/entry_dialogs/EntryDialogTV.vue';
import EntryDialogBooks from '../components/entry_dialogs/EntryDialogBooks.vue';
import EntryDialogMovies from '../components/entry_dialogs/EntryDialogMovies.vue';
import { computed, ref } from 'vue';
import { Messages } from '../config/Messages.ts';
import { settingsStore } from '../stores/settings.ts';

// for use with dynamic component solution
/*const currentTab = ref('game');
const tabs = {
	"game": EntryDialogGames,
	"tv": EntryDialogTV,
};*/

const tabs = ref(settingsStore.defaultEntryScreen);
const showSaveSuccess = ref(false);

const addOrEdit = ref('');

function configureSaveMessage(which) {
	showSaveSuccess.value = true;
	addOrEdit.value = which;
}

const saveMessage = computed(() => {
	if (addOrEdit.value === 'add') return Messages.entryAddSuccess;
	return Messages.entryEditSuccess;
});
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
				<VSnackbar v-model="showSaveSuccess" timeout="5000">{{ saveMessage }}</VSnackbar>
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
