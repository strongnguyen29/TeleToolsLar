
export default function UserAdded(exportGroupId, addChatId, userIds = []) {
    this._id = 'ua-' + exportGroupId + addChatId;
    this.exportGroupId = exportGroupId;
    this.addChatId = addChatId;
    this.userIds = userIds;
}
