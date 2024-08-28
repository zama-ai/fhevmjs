const fetchMock = require('@fetch-mock/core');

global.fetch = fetchMock.default.fetchHandler;
