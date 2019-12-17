import Pouchdb from 'pouchdb-browser'

const db = new Pouchdb('telegram_user');

export function getUsers(callback) {
    db.allDocs({include_docs: true}, function (err, docs) {
        console.log('DB:: getUsers', err ? err : docs);
        callback(err, docs);
    })
}

export function getUser(phone, callback) {
    db.get('acc-' + phone, function (err, doc) {
        console.log('DB: getAccount:', (err ? err : doc));
        callback(err, doc)
    });
}

export function createAccount(account) {
    db.put(account, function (err, doc) {
        console.log('DB: createAccount:', (err ? err : doc));
    });
}

export function createOrUpdateAccount(account) {

    db.get(account._id, function(err, doc) {
        if (err) {
            createAccount(account)
        } else {
            account._rev = doc._rev;
            db.put(account, function(err, response) {
                if (err) {
                    console.log('DB:: update: failed', err);
                } else {
                    console.log('DB:: update: success', response);
                }
            });
        }
    });
}

export default db;
