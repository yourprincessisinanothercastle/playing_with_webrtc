
const TILESIZE = 32;

const MESSAGING = 'messaging';
const TILE = 'tile';
const TILEIMAGE = 'tileimage';

const WORKER_MAIN_MESSAGETYPES = {
  MESSAGING,
  TILE,
  TILEIMAGE,
};

const INIT = 'init';
const MAIN_WORKER_MESSAGETYPES = {
  INIT,
};

const RELIABLE = 'reliable';
const UNRELIABLE = 'unreliable';
const RTCMESSAGETYPE = 'msgtype';

const RELIABILITY = {
  RELIABLE, UNRELIABLE,
};

export default {
  RTCMESSAGETYPE,
  WORKER_MAIN_MESSAGETYPES,
  MAIN_WORKER_MESSAGETYPES,
  RELIABILITY,
  TILESIZE,
};
