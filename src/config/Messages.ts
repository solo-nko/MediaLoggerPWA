const Messages = {
	ENTRY_EDIT_SUCCESS: 'Entry successfully edited!',
	ENTRY_ADD_SUCCESS: 'Entry successfully added!',
	CANNOT_UNDO: 'This action cannot be undone.',
	NO_BLANK_TITLE: 'Please enter a title.',
	SEARCHING_CODE: 'Searching for code...',
	LOG_NOT_FOUND: 'Log not found. Please verify your Sync Code.',
	CLOUD_RESTORE_SUCCESS: 'Cloud restore successful!',
	INQUIRY_IN_PROGRESS: 'Inquiring...',
	INQUIRY_SUCCESS: 'Log found! Press restore to download it. This cannot be undone.',
	CLOUD_RESTORE_FAIL: 'Cloud restore failed.',
	CLOUD_RESTORE_FAIL_ABORT: 'Cloud restore failed or aborted.'
} as const;

export default Messages;
