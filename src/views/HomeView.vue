<script setup lang="ts">
import { ref } from 'vue';
import EntryDialogGames from '../components/EntryDialogGames.vue';
import { appDatabase } from '../database/db.ts';
import { from, useObservable } from '@vueuse/rxjs';
import GameLog from '../types/GameLog.ts';
import { liveQuery } from 'dexie';
import TVLog from '../types/TVLog.ts';
import BookLog from '../types/BookLog.ts';

const currentGames = useObservable<GameLog[]>(
	from(liveQuery(() => appDatabase.games.where('status').anyOf(['Playing', 'Replaying']).toArray()))
);

const currentTV = useObservable<TVLog[]>(
	from(
		liveQuery(() =>
			appDatabase.television.where('status').anyOf(['Watching', 'Rewatching']).toArray()
		)
	)
);

const currentBooks = useObservable<BookLog[]>(
	from(liveQuery(() => appDatabase.books.where('status').anyOf(['Reading', 'Rereading']).toArray()))
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
						<VListItem v-if="game.status === 'Playing'">
							<span class="item-title">{{ game.title }}</span>
						</VListItem>
					</template>
					<VDivider></VDivider>
					<VCardSubtitle>Replaying</VCardSubtitle>
					<template v-for="game in currentGames" :key="game.id">
						<VListItem v-if="game.status === 'Replaying'">
							<span class="item-title">{{ game.title }}</span>
						</VListItem>
					</template>
				</VList>
			</VCard>
			<VCard>
				<VCardTitle>Current Television</VCardTitle>
				<VCardSubtitle>Watching</VCardSubtitle>
				<VList>
					<template v-for="tv in currentTV" :key="tv.id">
						<VListItem v-if="tv.status === 'Watching'">
							<span class="item-title">{{ tv.title }}</span>
						</VListItem>
					</template>
					<VDivider></VDivider>
					<VCardSubtitle>Rewatching</VCardSubtitle>
					<template v-for="tv in currentTV" :key="tv.id">
						<VListItem v-if="tv.status === 'Rewatching'">
							<span class="item-title">{{ tv.title }}</span>
						</VListItem>
					</template>
				</VList>
			</VCard>
			<VCard>
				<VCardTitle>Current Books</VCardTitle>
				<VCardSubtitle>Reading</VCardSubtitle>
				<VList>
					<template v-for="book in currentBooks" :key="book.id">
						<VListItem v-if="book.status === 'Reading'">
							<span class="item-title">{{ book.title }}</span>
						</VListItem>
					</template>
					<VDivider></VDivider>
					<VCardSubtitle>Rereading</VCardSubtitle>
					<template v-for="book in currentBooks" :key="book.id">
						<VListItem v-if="book.status === 'Rereading'">
							<span class="item-title">{{ book.title }}</span>
						</VListItem>
					</template>
				</VList>
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
