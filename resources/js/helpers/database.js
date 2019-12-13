import Db from '~/js/db'

export function saveAccount(account) {
    Db.put(account)
        .then(function (response) {
            console.log('Database: saveAccount:: success', response);
        }).catch(function (err) {
            console.log('Database: saveAccount:: error',err);
        });
}

export function saveGroupChat(chat) {
    Db.put(chat)
        .then(function (response) {
            console.log('Database: saveGroupChat:: success', response);
        }).catch(function (err) {
        console.log('Database: saveGroupChat:: error',err);
    });
}
