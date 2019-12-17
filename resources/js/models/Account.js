
import {API_ID, API_HASH} from "~/js/Constants";

export default function Account(phone, apiId = null, apiHash = null) {
    this._id = 'acc-' + phone;
    this.phone = phone;
    this.user = null;
    this.apiId = apiId;
    this.apiHash = apiHash;
    this.databaseDirectory = '/acc/' + phone + '/db';
    this.filesDirectory = '/' + phone + '/files';

    return this;
}
