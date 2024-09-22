<script setup lang="ts">

defineEmits(['confirm', 'cancel'])

</script>

<template>
<VCard>
	<VLabel>Are you sure?</VLabel>
	<VCardActions>
		<VBtn @click="$emit('confirm')">Yes</VBtn>
		<VBtn @click="$emit('cancel')">Cancel</VBtn>
	</VCardActions>
</VCard>
</template>

<style scoped>

</style>