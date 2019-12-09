
import {API_ID, API_HASH} from "~/js/Constants";

export default function Account(phone, apiId = null, apiHash = null) {
    this._id = phone;
    this.phone = phone;
    this.user = null;
    this.apiId = apiId == null || apiId.length === 0 ? API_ID : apiId;
    this.apiHash = apiHash == null || apiHash.length === 0 ? API_HASH : apiHash;
    this.databaseDirectory = '/acc/' + phone + '/db';
    this.filesDirectory = '/' + phone;

    return this;
}
