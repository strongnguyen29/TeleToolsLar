import Pouchdb from 'pouchdb-browser'
import UserAdded from "../models/UserAdded";

const db = new Pouchdb('telegram_chetmembers');

export function getUsersAdded(exportGroupId, addChatId, callback) {
    let id = 'ua-' + exportGroupId + addChatId;
    db.get(id, function (err, doc) {
        console.log('DB: getUsersAdded:', (err ? err : doc));
        if (err) {
            createUsersAdded(exportGroupId, addChatId, [], function (err, doc) {
                getUsersAdded(exportGroupId, addChatId, callback);
            });
        } else {
            callback(err, doc)
        }
    });
}

export function createUsersAdded(exportGroupId, addChatId, userIds, callback) {
    let userAdded = new UserAdded(exportGroupId, addChatId, userIds);
    db.put(userAdded, function (err, doc) {
        console.log('DB: createUsersAdded:', (err ? err : doc));
        callback(err, doc);
    })
}

export function updateUsersAdded(userAdded) {
    db.put(userAdded, function (err, doc) {
        console.log('DB: updateUsersAdded:', (err ? err : doc));
    })
}
