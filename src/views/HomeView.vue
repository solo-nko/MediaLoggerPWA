<script setup lang="ts">
import { ref } from 'vue';
import EntryDialogGames from '../components/EntryDialogGames.vue';
import { appDatabase } from '../database/db.ts';
import { from, useObservable } from '@vueuse/rxjs';
import GameLog from '../types/GameLog.ts';
import { liveQuery } from 'dexie';

const currentGames = useObservable<GameLog[]>(
	from(
		liveQuery(() => appDatabase.games.where('status').anyOf(['playing', 'indefinite']).toArray())
	)
);

const showDialog = ref(false);
</script>

<template>
	<h1>Welcome to the Media Logger!</h1>
	<VContainer>
		<VRow justify="space-around">
			<VCard>
				<VCardTitle>Current Games</VCardTitle>
				<VCardSubtitle>Playing</VCardSubtitle>
				<VList>
					<template v-for="game in currentGames" :key="game.id">
						<VListItem v-if="game.status === 'playing'">
							<span class="item-title">{{ game.title }}</span>
						</VListItem>
					</template>
					<VDivider></VDivider>
					<VCardSubtitle>Replaying</VCardSubtitle>
					<template v-for="game in currentGames" :key="game.id">
						<VListItem v-if="game.status === 'indefinite'">
							<span class="item-title">{{ game.title }}</span>
						</VListItem>
					</template>
				</VList>
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

<style scoped>
.item-title {
	font-weight: bold;
}
</style>
