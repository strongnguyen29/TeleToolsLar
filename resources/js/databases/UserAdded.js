import Pouchdb from 'pouchdb-browser'
import UserAdded from "../models/UserAdded";

const db = new Pouchdb('telegram_chetmembers');

export function getUserAdded(exportGroupId, addChatId, userId, callback) {
    let id = 'ua-' + exportGroupId + addChatId + userId;
    db.get(id, function (err, doc) {
        console.log('DB: getUserAdded:', (err ? err : doc));
        callback(err, doc)
    });
}

export function isUserAdded(exportGroupId, addChatId, userId, callback) {
    let id = 'ua-' + exportGroupId + addChatId + userId;
    db.get(id, function (err, doc) {
        callback(!!doc);
    });
}

export function createUserAdded(exportGroupId, addChatId, userId) {
    let userAdd = new UserAdded(exportGroupId, addChatId, userId);
    db.put(userAdd, function (err, doc) {
    });
}
