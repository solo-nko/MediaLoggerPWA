<script setup lang="ts">
defineEmits(['confirm', 'cancel']);
</script>

<template>
	<VCard>
		<VCardTitle>Are you sure?</VCardTitle>
		<VCardActions>
			<VBtn @click="$emit('confirm')">Yes</VBtn>
			<VBtn @click="$emit('cancel')">Cancel</VBtn>
		</VCardActions>
	</VCard>
</template>

<style scoped>
.v-card {
	margin: 0 auto;
	width: 50%;
}
</style>
