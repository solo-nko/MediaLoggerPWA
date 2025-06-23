<script setup lang="ts">
import ImportExport from "./ImportExport.vue";
import CloudSync from "./CloudSync.vue";
</script>

<template>
	<ImportExport></ImportExport>
	<VDivider id="divider"></VDivider>
	<CloudSync></CloudSync>
</template>

<style scoped>
#divider {
	margin: 2rem 0;
}
</style>
