
A compact "search engine", for a [Cavia](https://issuu.com/studieverenigingvia) article, to find recipes based on their name and ingredients.

## Dependencies

* This is a small nodeJS and Elasticsearch project.
* Make sure you `npm install` to get the correct modules

## Usage

* Have Elasticsearch (2.x) running
* Use `npm start`
* There is now an app on your specified port (example: `localhost:9001`).

* Getting started
    * To setup the initial ES mapping go to `localhost:9001/install`.
    * Then you can use bulk insert by going to `localhost:9001/bulk`.


## Info & Further reading

* Elasticsearch database tutorial to get started: [http://red-badger.com/blog/2013/11/08/getting-started-with-elasticsearch/](http://red-badger.com/blog/2013/11/08/getting-started-with-elasticsearch/)

* On fuzzy search: [https://www.found.no/foundation/fuzzy-search/](https://www.found.no/foundation/fuzzy-search/)
