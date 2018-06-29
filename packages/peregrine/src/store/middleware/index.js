import log from './log';
import promisePending from './promise-pending';
import reduxPromise from 'redux-promise';

// TODO: example extension API possibilities for this. An ordered Map maybe?
export default [promisePending, reduxPromise, log];
