// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const { MONGODB_URI }  = process.env;

const config = {
    MONGODB_URI: MONGODB_URI,
    SALT_WORK_FACTOR: 10,
}

export default config;
