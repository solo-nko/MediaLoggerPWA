<script setup lang="ts">
import { settingsStore } from "../../stores/store.ts";
</script>

<template>
	<h1>General</h1>
	<VContainer>
		<VRow>
			<VCol>
				<VRadioGroup v-model="settingsStore.defaultDBScreen" label="Default database screen">
					<VRadio label="Games" value="game"></VRadio>
					<VRadio label="TV" value="tv"></VRadio>
					<VRadio label="Movies" value="movie"></VRadio>
					<VRadio label="Books" value="book"></VRadio>
				</VRadioGroup>
			</VCol>
			<VCol>
				<VRadioGroup v-model="settingsStore.defaultEntryScreen" label="Default log entry screen">
					<VRadio label="Games" value="game"></VRadio>
					<VRadio label="TV" value="tv"></VRadio>
					<VRadio label="Movies" value="movie"></VRadio>
					<VRadio label="Books" value="book"></VRadio>
				</VRadioGroup>
			</VCol>
		</VRow>
	</VContainer>
</template>

<style scoped></style>
