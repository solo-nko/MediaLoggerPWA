const Messages = {
	CANNOT_UNDO: "This action cannot be undone.",
	CLOUD_BACKUP_SUCCESS: "Cloud backup successful!",
	CLOUD_RESTORE_FAIL: "Cloud restore failed.",
	CLOUD_RESTORE_FAIL_ABORT: "Cloud restore failed or aborted.",
	CLOUD_RESTORE_SUCCESS: "Cloud restore successful!",
	CLOUD_UPDATE_SUCCESS:
		"Cloud backup successful! Your sync code was not found, so a new one has been issued.",
	ENTRY_ADD_SUCCESS: "Entry successfully added!",
	ENTRY_EDIT_SUCCESS: "Entry successfully edited!",
	ERROR_RESPONSE_404: "Log not found. Please verify your Sync Code.",
	ERROR_RESPONSE_503: "The server isn't responding right now. Please try again later.",
	ERROR_SERVER: "A server error has occurred. Please try again later.",
	INQUIRY_IN_PROGRESS: "Inquiring...",
	INQUIRY_SUCCESS: "Log found! Press restore to download it. This cannot be undone.",
	NO_BLANK_TITLE: "Please enter a title.",
	SEARCHING_CODE: "Searching for code...",
	ENTER_VALID_CODE: "Please enter a valid Sync Code."
} as const;

export default Messages;
