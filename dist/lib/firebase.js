'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rootUrl = 'https://beacon-wallboard.firebaseio.com/';

var Firebase = function () {
    function Firebase(id) {
        var _this = this;

        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'users';

        _classCallCheck(this, Firebase);

        this.id = id;
        this.path = path;
        this.connections = {};
        this.defaultConnection = new _firebase2.default(rootUrl + '/' + path + '/' + id + '/');
        this.connections[path + '/' + id + '/'] = this.defaultConnection;
        this.register();
        process.on('SIGINT', function () {
            return _this.unregister(_this.defaultConnection);
        });
        process.on('SIGINT', function () {
            return _this.disconnect();
        });
    }

    _createClass(Firebase, [{
        key: 'send',
        value: function send(e, data) {
            var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.path + '/' + this.id + '/';

            var dataToSend = {};
            dataToSend[e] = data;
            if (!this.connections.hasOwnProperty(path)) {
                this.connections[path] = new _firebase2.default(rootUrl + '/' + path + '/');
            }
            this.connections[path].update(dataToSend);
        }
    }, {
        key: 'get',
        value: function get(path, callback) {
            if (!this.connections.hasOwnProperty(path)) {
                this.connections[path] = new _firebase2.default(rootUrl + '/' + path + '/');
            }
            this.connections[path].once('value', function (snapshot) {
                return safeCallback(callback, snapshot);
            });
        }
    }, {
        key: 'on',
        value: function on(e, path, callback) {
            if (!this.connections.hasOwnProperty(path)) {
                this.connections[path] = new _firebase2.default(rootUrl + '/' + path + '/');
            }
            this.connections[path].child(e).on('value', function (snapshot) {
                return safeCallback(callback, snapshot);
            });
        }
    }, {
        key: 'unregister',
        value: function unregister(connection) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

            console.log('Unregistering user ' + this.id);
            connection.update({ 'registered': false }, callback);
        }
    }, {
        key: 'register',
        value: function register() {
            console.log('Registering user ' + this.id);
            this.defaultConnection.update({ 'registered': true });
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            _firebase2.default.goOffline();
        }
    }, {
        key: 'foundBeacon',
        value: function foundBeacon(beacon) {
            if (beacon.proximity != null && beacon.proximity !== undefined) {
                this.send('beacon/' + beacon.uuid, beacon.proximity);
            }
        }
    }]);

    return Firebase;
}();

function safeCallback(callback, snapshot) {
    var val = snapshot.val();
    if (val !== null && val !== undefined) {
        callback(snapshot.val());
    }
}

module.exports = Firebase;