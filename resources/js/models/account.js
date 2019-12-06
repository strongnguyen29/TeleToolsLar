

export default function Account(phone) {
    this.phone = phone;
    this.user = null;
    this.apiId = null;
    this.apiHash = null;
    this.databaseDirectory = '/acc/' + phone + '/db';
    this.filesDirectory = '/' + phone;

    return this;
}
