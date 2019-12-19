
export default function UserAdded(exportGroupId, addChatId, userId) {
    this._id = 'ua-' + exportGroupId + addChatId + userId;
    this.exportGroupId = exportGroupId;
    this.addChatId = addChatId;
    this.userId = userId;
}
