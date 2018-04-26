var http = require('http');


function __couchdb_request(url, method, data, callback) {

// An object of options to indicate where to post to
var postOptions = {
host: '127.0.0.1',
port: '5984',
path: url,
method: method
};

var postData = null;

if (data) {
postData = JSON.stringify(data);

postOptions.headers = {
'Content-Type': 'application/json',
'Content-Length': Buffer.byteLength(postData)
}
}

// Set up the request
var request = http.request(postOptions, function (res) {

res.setEncoding('utf8');

if(callback) {
res.on('data', function (chunk) {
callback(JSON.parse(chunk));
});
}

});

// post the data
if (data) {
request.write(postData);
}

request.end();
}

// TODO: review this implementation to calculate uuid or to build a pool of uuids, to
// avoid http calls.
function __reserveUUID(callback) {

__couchdb_request("/_uuids", "GET", null, function (data) {
var uuid = data.uuids[0];

console.log("[info] retrieveing UUID from database " + uuid);
callback(uuid);
});

}

function __store(database, document, callback) {

__reserveUUID(function(id){

__couchdb_request("/" + database + "/" + id, "PUT", document, callback);

});
}

module.exports.store = __store;
