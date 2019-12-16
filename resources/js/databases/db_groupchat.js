import Pouchdb from 'pouchdb-browser'

const db = new Pouchdb('telegram_groupchat');

export function getGroupChats(callback) {
    db.allDocs({include_docs: true}, function (err, docs) {
        console.log('DB:: getGroupChats', err ? err : docs);
        callback(err, docs);
    })
}

export function createGroupChat(chat) {
    db.put(chat, function (err, doc) {
        console.log('DB:: createGroupChat', err ? err : doc);
    })
}

export function createOrUpdateGroupChat(chat) {

    db.get(chat._id, function(err, doc) {
        if (err) {
            createGroupChat(chat)
        } else {
            chat._rev = doc._rev;
            db.put(chat, function(err, response) {
                console.log('DB:: update GroupChat', err ? err : response);
            });
        }
    });
}

export default db;
