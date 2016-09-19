import firebase from 'firebase';
const rootUrl = 'https://fiery-inferno-7517.firebaseio.com';


class Firebase {
    constructor (id, path='users') {
        this.id = id;
        this.path = path;
        this.connections = {};
        this.defaultConnection = new firebase(`${rootUrl}/${path}/${id}/`);
        this.connections[`${path}/${id}/`] = this.defaultConnection;
        this.register();
        process.on('SIGINT', () => this.unregister(this.defaultConnection));
        process.on('SIGINT', () => this.disconnect());
    }

    send(e, data, path=`${this.path}/${this.id}/`) {
        let dataToSend = {};
        dataToSend[e] = data;
        if (!this.connections.hasOwnProperty(path)) {
            this.connections[path] = new firebase(`${rootUrl}/${path}/`);
        }
        this.connections[path].update(dataToSend);
    }

    on(e, path, callback) {
        if (!this.connections.hasOwnProperty(path)) {
            this.connections[path] = new firebase(`${rootUrl}/${path}/`);
        }
        this.connections[path].child(e).on('value', (snapshot) => safeCallback(callback, snapshot));
    }

    unregister(connection, callback=() => {}) {
        console.log(`Unregistering user ${this.id}`);
        connection.update({'registered': false}, callback);
    }

    register() {
        console.log(`Registering user ${this.id}`);
        this.defaultConnection.update({'registered': true});
    }

    disconnect() {
        firebase.goOffline();
    }
}


function safeCallback(callback, snapshot) {
    let val = snapshot.val();
    if (val !== null && val !== undefined) {
        callback(snapshot.val());
    }
}


module.exports = Firebase;
