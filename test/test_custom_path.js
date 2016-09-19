import Firebase from '../lib/firebase';
const [SUCCESS, ERROR] = [0, 1];
const TEAM = 'TEST_DO_NOT_UPVOTE';
const fb = new Firebase(TEAM, 'TEST/');

setTimeout(() => process.exit(ERROR), 5000);

fb.on('test', `/users/${TEAM}`, function(value) {
	console.log('Got unexpected event: ', value);
	process.exit(ERROR);
});

fb.on('test', `/TEST/${TEAM}`, function(value) {
	console.log('Got response: ', value);
	fb.defaultConnection.remove((error) => error ? process.exit(ERROR) : process.exit(SUCCESS));
});

fb.send('test', 'test');
