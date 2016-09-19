import Firebase from '../lib/firebase';
const [SUCCESS, ERROR] = [0, 1];
const TEAM = 'TEST_DO_NOT_UPVOTE';
const fb = new Firebase(TEAM, 'TEST/');

setTimeout(() => process.exit(ERROR), 5000);

fb.unregister(fb.defaultConnection);

fb.unregister(fb.defaultConnection, (error) => {
	if (error) {
		process.exit(ERROR);
	}
	fb.defaultConnection.remove((error) => error ? process.exit(ERROR) : process.exit(SUCCESS));
});
