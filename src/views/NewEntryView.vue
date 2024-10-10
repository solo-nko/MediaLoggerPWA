<script setup lang="ts">
import EntryDialogGames from '../components/EntryDialogGames.vue';
import EntryDialogTV from '../components/EntryDialogTV.vue';
import { computed, ref } from 'vue';
import { entryAddSuccess, entryEditSuccess } from '../config/Messages.ts';
import EntryDialogBooks from '../components/EntryDialogBooks.vue';
import { settingsStore } from '../stores/settings.ts';

// for use with dynamic componenet solution
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
	if (addOrEdit.value === 'add') return entryAddSuccess;
	else return entryEditSuccess;
});
</script>

<template>
	<VTabs id="tab-bar" v-model="tabs" align-tabs="center">
		<!--	<VTabs id="tab-bar" v-model="currentTab" align-tabs="center">-->
		<VTab value="game">Game</VTab>
		<VTab value="tv">TV Series</VTab>
		<VTab value="movie">Movie</VTab>
		<VTab value="book">Book</VTab>
	</VTabs>
	<!--	dynamic component solution -->
	<!--	<Component id="entry-form" :is="tabs[currentTab]"></Component>-->

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
			<h2>Movie Entry</h2>
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
</template>

<style scoped>
#tab-bar {
	width: 100%;
}

#entry-form {
	margin-top: 0;
	width: 70%;
}
</style>
