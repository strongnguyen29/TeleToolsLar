import Pouchdb from 'pouchdb-browser'

const db = new Pouchdb('telegram_chetmembers');

export function getListChatMembers(callback) {
    db.allDocs({include_docs: true}, function (err, docs) {
        console.log('DB:: getListChatMembers', err ? err : docs);
        callback(err, docs);
    })
}

export function getChatMembers(groupId, callback) {
    db.get('cm-' + groupId, function (err, doc) {
        console.log('DB: getChatMembers:', (err ? err : doc));
        callback(err, doc)
    });
}

export function createChatMembers(ChatMembers) {
    db.put(ChatMembers, function (err, doc) {
        console.log('DB: createChatMembers:', (err ? err : doc));
    });
}

export function update(ChatMembers) {
    if (ChatMembers.hasOwnProperty('_rev')) {
        db.put(ChatMembers, function(err, response) {
            if (err) {
                console.log('DB:: ChatMembers update: failed', err);
            } else {
                console.log('DB:: ChatMembers update: success', response);
            }
        });
    }
}

export function updateOrCreateChatMembers(ChatMembers) {

    db.get(ChatMembers._id, function(err, doc) {
        if (err) {
            createChatMembers(ChatMembers);
        } else {
            account._rev = doc._rev;
            db.put(ChatMembers, function(err, response) {
                if (err) {
                    console.log('DB:: ChatMembers update: failed', err);
                } else {
                    console.log('DB:: ChatMembers update: success', response);
                }
            });
        }
    });
}

export function addChatMember(groupId, userId) {
    db.get('cm-' + groupId, function (err, doc) {
        if (err) {
            console.log('DB:: addChatMember get: failed', err);
            return;
        }

        doc.members.push(userId);
        db.put(doc, function(err, response) {
            if (err) {
                console.log('DB:: addChatMember update: failed', err);
            } else {
                console.log('DB:: addChatMember update: success', response);
            }
        });
    })
}

export default db;
