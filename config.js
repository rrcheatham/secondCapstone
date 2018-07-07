exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://newuser1:2yHw9kwk@ds255930.mlab.com:55930/expense-tracker-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://newuser1:2yHw9kwk@ds129801.mlab.com:29801/test-expense-tracker-db';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
