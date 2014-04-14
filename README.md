CAVIA Search suggestions
=========

A compact "search engine" to find recepi's based on their name and ingredients.

## Usage

If you have elasticsearch, node and npm installed you can use `npm start` (assuming elasticsearch runs on localhost:9200). There is now an app on your specified port (ex: `localhost:9001`).


To setup the initial mapping go to `localhost:9001/install`.


Then you can use bulk insert by going to `localhost:9001/bulk`.


And there you have it, a tiny search engine for recepi's.


## Dependencies

This is a small nodeJS and elasticsearch project. Make sure you `npm install` to get the correct modules:

* elasticsearch
* ejs
* express
* request-json

## Info & Further reading

Elasticsearch database tutorial / getting started:

http://red-badger.com/blog/2013/11/08/getting-started-with-elasticsearch/

Fuzzy search:

https://www.found.no/foundation/fuzzy-search/

Constructing more complicated mapping in ElasticSearch:

http://euphonious-intuition.com/2012/08/more-complicated-mapping-in-elasticsearch/
