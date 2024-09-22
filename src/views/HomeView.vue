<script setup lang="ts">
import { ref } from 'vue';
import GameLog from '../types/GameLog.ts';
import { DateTime } from 'luxon';
import { GameStatus } from '../types/GameStatus.ts';
import EntryDialog from '../components/EntryDialogGames.vue';
import EntryDialogGames from '../components/EntryDialogGames.vue';

const testGames = [{ title: 'game1' }, { title: 'game2' }, { title: 'game3' }, { title: 'game4' }];
// const nowPlayingGames = ref<GameLog[]>([
// 	{
// 		title: 'Red Dead Redemption 2',
// 		platform: 'PlayStation 5',
// 		dateCreated: null,
// 		dateModified: null,
// 		status: GameStatus.Playing
// 	},
// 	{
// 		title: 'Arknights',
// 		platform: 'Mobile',
// 		dateCreated: null,
// 		dateModified: null,
// 		status: GameStatus.Indefinite
// 	},
// 	{
// 		title: 'Ace Attorney: Apollo Justice',
// 		platform: 'Nintendo 3DS',
// 		dateCreated: null,
// 		dateModified: null,
// 		status: GameStatus.Playing
// 	}
// ]);

const showDialog = ref(false);
</script>

<template>
	<h1>Welcome to the Media Logger!</h1>
	<VContainer>
		<VRow justify="space-around">
			<VCard>
				<VCardTitle>Current Games</VCardTitle>
				<VList>
					<VListItem v-for="game in testGames"
						>{{ game.title }} <VBtn v-on:click="showDialog = true">Edit</VBtn>
					</VListItem>
				</VList>
				<!--				<VExpansionPanels>-->
				<!--					<VExpansionPanel v-for="game in nowPlayingGames" :title="game.title">-->
				<!--					</VExpansionPanel>-->
				<!--				</VExpansionPanels>-->
			</VCard>
			<VCard>
				<VCardTitle>Current Television</VCardTitle>
			</VCard>
		</VRow>
		<VDialog v-model="showDialog">
			<EntryDialogGames @close-entry="showDialog = false"></EntryDialogGames>
		</VDialog>
	</VContainer>
</template>

<style scoped></style>
