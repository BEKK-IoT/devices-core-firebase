import Firebase from '../lib/firebase';
const TEAM = 'TEST_DO_NOT_UPVOTE';
const fb = new Firebase(TEAM);
const [SUCCESS, ERROR] = [0, 1];
setTimeout(() => process.exit(ERROR), 5000);

fb.on('test', `/users/${TEAM}`, function(value) {
	console.log('Got response: ', value);
	fb.defaultConnection.remove((error) => error ? process.exit(ERROR) : process.exit(SUCCESS));
});

fb.send('test', 'test');
