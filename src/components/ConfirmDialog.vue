<script setup lang="ts">
defineEmits(['confirm', 'cancel']);
const props = defineProps(['message'])
</script>

<template>
	<VCard>
		<VCardTitle>Are you sure?</VCardTitle>
		<VCardText>{{ props.message }}</VCardText>
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
