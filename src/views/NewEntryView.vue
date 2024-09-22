<script setup lang="ts">
import EntryDialogGames from '../components/EntryDialogGames.vue';
</script>

<template>
	<EntryDialogGames :edit-entry="false" :close-button="false" id="entry-form"></EntryDialogGames>
</template>

<style scoped>
#entry-form {
	width: 70%;
}
</style>
