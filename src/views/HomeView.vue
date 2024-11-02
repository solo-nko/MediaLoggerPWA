<script setup lang="ts">
import { computed, ref } from 'vue';
import EntryDialogGames from '../components/entry_dialogs/EntryDialogGames.vue';
import { appDatabase } from '../database/db.ts';
import { from, useObservable } from '@vueuse/rxjs';
import GameLog from '../types/GameLog.ts';
import { liveQuery } from 'dexie';
import TVLog from '../types/TVLog.ts';
import BookLog from '../types/BookLog.ts';
import EntryDialogTV from '../components/entry_dialogs/EntryDialogTV.vue';
import EntryDialogBooks from '../components/entry_dialogs/EntryDialogBooks.vue';

// keep an eye on this void typing. might be problematic
const currentGames = useObservable<GameLog[] | void>(
	from(
		liveQuery(() =>
			appDatabase.games
				.where('status')
				.anyOf(['Playing', 'Replaying'])
				.toArray()
				.then((promisedArray) => {
					playingGames.value = promisedArray.filter((game) => {
						return game.status == 'Playing';
					});
					replayingGames.value = promisedArray.filter((game) => {
						return game.status == 'Replaying';
					});
				})
		)
	)
);

const playingGames = ref<GameLog[]>();
const isThereGamesPlaying = computed(() => {
	if (playingGames.value) return playingGames.value.length > 0;
	else return false;
});
const replayingGames = ref<GameLog[]>();
const isThereGamesReplaying = computed(() => {
	if (replayingGames.value) return replayingGames.value.length > 0;
	else return false;
});

const currentTV = useObservable<TVLog[] | void>(
	from(
		liveQuery(() =>
			appDatabase.television
				.where('status')
				.anyOf(['Watching', 'Rewatching'])
				.toArray()
				.then((promisedArray) => {
					watchingTV.value = promisedArray.filter((tv) => {
						return tv.status == 'Watching';
					});
					rewatchingTV.value = promisedArray.filter((tv) => {
						return tv.status == 'Rewatching';
					});
				})
		)
	)
);

const watchingTV = ref<TVLog[]>();
const isThereTVWatching = computed(() => {
	if (watchingTV.value) return watchingTV.value.length > 0;
	else return false;
});
const rewatchingTV = ref<TVLog[]>();
const isThereTVRewatching = computed(() => {
	if (rewatchingTV.value) return rewatchingTV.value.length > 0;
	else return false;
});

const currentBooks = useObservable<BookLog[] | void>(
	from(
		liveQuery(() =>
			appDatabase.books
				.where('status')
				.anyOf(['Reading', 'Rereading'])
				.toArray()
				.then((promisedArray) => {
					readingBooks.value = promisedArray.filter((book) => {
						return book.status == 'Reading';
					});
					rereadingBooks.value = promisedArray.filter((book) => {
						return book.status == 'Rereading';
					});
				})
		)
	)
);

const readingBooks = ref<BookLog[]>([]);
const isThereBooksReading = computed(() => {
	if (readingBooks.value) return readingBooks.value.length > 0;
	else return false;
});
const rereadingBooks = ref<BookLog[]>([]);
const isThereBooksRereading = computed(() => {
	if (rereadingBooks.value) return rereadingBooks.value.length > 0;
	else return false;
});

const entryDetails = ref();
const showEditDialog = ref(false);
const whichDialog = ref('Game');
const dialogs = {
	Game: EntryDialogGames,
	TV: EntryDialogTV,
	Book: EntryDialogBooks
};

function editEntry(entryInfo, dialogType = 'Game') {
	whichDialog.value = dialogType;
	showEditDialog.value = true;
	entryDetails.value = entryInfo;
}
</script>

<template>
	<VContainer height="100%">
		<VRow id="intro-text">
			<VCol>
				<h1>Welcome to the Media Logger!</h1>
				<p>
					This app allows you to keep track of your ongoing media. You can input games, movies,
					television/anime, and books.
				</p>
			</VCol>
		</VRow>
		<VDivider id="divider" thickness="3" color="accent" opacity="1"></VDivider>
		<VRow justify="space-around">
			<!-- Games -->
			<VCol>
				<VCard class="dashboard-card">
					<VCardTitle>Current Games</VCardTitle>
					<VCardSubtitle>Playing</VCardSubtitle>
					<VList>
						<template v-for="game in playingGames" :key="game.id">
							<VListItem>
								<VRow class="now-playing-item" justify="space-between">
									<VCol tag="div" cols="auto" class="item-title">
										<span>{{ game.title }}</span>
									</VCol>
									<VCol tag="div" cols="auto">
										<VIcon @click="editEntry(game, 'Game')" icon="$pencil"></VIcon>
									</VCol>
								</VRow>
							</VListItem>
						</template>
						<VDivider v-if="isThereGamesReplaying"></VDivider>
						<VCardSubtitle v-if="isThereGamesReplaying">Replaying</VCardSubtitle>
						<template v-for="game in replayingGames" :key="game.id">
							<VListItem>
								<VRow class="now-playing-item" justify="space-between">
									<VCol tag="div" cols="auto" class="item-title">
										<span>{{ game.title }}</span>
									</VCol>
									<VCol tag="div" cols="auto">
										<VIcon @click="editEntry(game, 'Game')" icon="$pencil"></VIcon>
									</VCol>
								</VRow>
							</VListItem>
						</template>
					</VList>
				</VCard>
			</VCol>
			<VCol>
				<!-- TV -->
				<VCard>
					<VCardTitle>Current Television</VCardTitle>
					<VCardSubtitle>Watching</VCardSubtitle>
					<VList>
						<template v-for="tv in watchingTV" :key="tv.id">
							<VListItem>
								<VRow class="now-playing-item" justify="space-between">
									<VCol tag="div" cols="auto" class="item-title">
										<span>{{ tv.title }}</span>
									</VCol>
									<VCol tag="div" cols="auto">
										<VIcon @click="editEntry(tv, 'TV')" icon="$pencil"></VIcon>
									</VCol>
								</VRow>
							</VListItem>
						</template>
						<VDivider v-if="isThereTVRewatching"></VDivider>
						<VCardSubtitle v-if="isThereTVRewatching">Rewatching</VCardSubtitle>
						<template v-for="tv in rewatchingTV" :key="tv.id">
							<VListItem>
								<VRow class="now-playing-item" justify="space-between">
									<VCol tag="div" cols="auto" class="item-title">
										<span>{{ tv.title }}</span>
									</VCol>
									<VCol tag="div" cols="auto">
										<VIcon @click="editEntry(tv, 'TV')" icon="$pencil"></VIcon>
									</VCol>
								</VRow>
							</VListItem>
						</template>
					</VList>
				</VCard>
			</VCol>
			<VCol>
				<!-- Books -->
				<VCard>
					<VCardTitle>Current Books</VCardTitle>
					<VCardSubtitle>Reading</VCardSubtitle>
					<VList>
						<template v-for="book in readingBooks" :key="book.id">
							<VListItem>
								<VRow justify="space-between">
									<VCol tag="div" cols="auto" class="item-title">
										<span>{{ book.title }}</span>
									</VCol>
									<VCol tag="div" cols="auto">
										<VIcon @click="editEntry(book, 'Book')" icon="$pencil"></VIcon>
									</VCol>
								</VRow>
							</VListItem>
						</template>
						<VDivider v-if="isThereBooksRereading"></VDivider>
						<VCardSubtitle v-if="isThereBooksRereading">Rereading</VCardSubtitle>
						<template v-for="book in rereadingBooks" :key="book.id">
							<VListItem>
								<VRow justify="space-between">
									<VCol tag="div" cols="auto" class="item-title">
										<span>{{ book.title }}</span>
									</VCol>
									<VCol tag="div" cols="auto">
										<VIcon @click="editEntry(book, 'Book')" icon="$pencil"></VIcon>
									</VCol>
								</VRow>
							</VListItem>
						</template>
					</VList>
				</VCard>
			</VCol>
		</VRow>
		<VDialog v-model="showEditDialog">
			<!-- Because there are multiple different types of edit dialogs and only one needs to be rendered at a time, we use a dynamic component -->
			<Component
				:is="dialogs[whichDialog]"
				@close-entry="showEditDialog = false"
				:entry="entryDetails"
				:edit-entry="true"
			></Component>
		</VDialog>
	</VContainer>
</template>

<style scoped>
#intro-text {
	justify-content: center;
	text-align: center;
	width: 100%;
}

#divider {
	margin: 1rem 0;
}

.item-title {
	flex-shrink: 1;
	font-weight: bold;
}

.now-playing-item {
	flex-wrap: nowrap;
}


</style>
