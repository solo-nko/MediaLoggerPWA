<script setup lang="ts">
import { RouterView } from 'vue-router';
import { computed, onMounted, provide, ref } from 'vue';
import { useThemeStore } from './stores/store.ts';
import {
	injectionKeySaveSuccess,
	injectionKeySaveToast,
	injectionKeySnackbarTimeout
} from './config/Utils.ts';
import { Messages } from './config/Messages.ts';

const themeStore = useThemeStore();
const showSaveSuccess = ref(false);
const addOrEdit = ref('');
const snackBarTimeout = ref(3000);

const saveMessage = computed(() => {
	if (addOrEdit.value === 'add') return Messages.ENTRY_ADD_SUCCESS;
	if (addOrEdit.value === 'edit') return Messages.ENTRY_EDIT_SUCCESS;
	return '';
});

const configureSaveMessage = (which: 'add' | 'edit') => {
	showSaveSuccess.value = true;
	addOrEdit.value = which;
};

onMounted(() => {
	themeStore.loadTheme();
});

provide(injectionKeySaveToast, configureSaveMessage);
provide(injectionKeySaveSuccess, showSaveSuccess);
provide(injectionKeySnackbarTimeout, snackBarTimeout);
</script>

<template>
	<VApp>
		<VAppBar color="primary">
			<VAppBarTitle>Media Logger</VAppBarTitle>
			<VBtn icon="$themeSwitch" @click="themeStore.toggleTheme()"></VBtn>
		</VAppBar>
		<VMain id="content-area">
			<VContainer>
				<RouterView v-slot="{ Component }">
					<KeepAlive>
						<Component :is="Component"></Component>
					</KeepAlive>
				</RouterView>
			</VContainer>
		</VMain>
		<VSnackbar v-model="showSaveSuccess" :timeout="snackBarTimeout">{{ saveMessage }} </VSnackbar>
		<VBottomNavigation grow bg-color="primary" color="textOnColor" order="-1" tag="footer">
			<VBtn :to="{ name: 'Home' }">
				<VIcon icon="$home"></VIcon>
				Home
			</VBtn>
			<VBtn :to="{ name: 'Entry' }">
				<VIcon icon="$add"></VIcon>
				Entry
			</VBtn>
			<VBtn :to="{ name: 'Database' }">
				<VIcon icon="$table"></VIcon>
				Log
			</VBtn>
			<VBtn :to="{ name: 'Settings' }">
				<VIcon icon="$settings"></VIcon>
				Settings
			</VBtn>
		</VBottomNavigation>
	</VApp>
</template>

<style scoped>
#content-area {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
