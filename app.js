var express = require('express');
var engine  = require('ejs-locals');

// filename for bulk insert
var input = 'input.json';

// App
var port = 9001;
var app  = express();

// Express app configuration
app.configure(function() {

  // Allow POST body to be submitted
  app.use(express.bodyParser());

  // Front-end settings
  app.use(express.static(__dirname + '/static'));
  app.engine('ejs', engine);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
});


// Database settings
var db_name    = 'ah';     // Must be lowercase
var table_name = 'recept';

// Official elasticsearch client
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

// JSON request client, for extending the elasticsearch client.
var request    = require('request-json');
var raw_client = request.newClient('http://localhost:9200/' + db_name + '/');



/*********************************************
    GET
*/

// Search form
app.get(['/', '/search'], function(req, res) {
    res.render('index');
});

// Insert new document
app.get(['/insert', '/new', '/create'], function(req, res) {
    res.render('create');
});

app.get('/bulk', function(req, res) {
    var recepis = require('./' + input);

    var args = {
        index : db_name,
        type  : table_name,
        body  : {}
    };

    for (i in recepis) {
        args.body = recepis[i];

        client.create(args, function(err, es_res) {
            if (err)
                console.log(err);
        });
    }

    res.json("Done");
});

// Run this once to create the mapping
app.get('/install', function(req, res) {

    client.index({
      index: db_name,
      type: table_name,
    },
    function (err, es_res) {
        client.indices.putMapping({
            index: db_name,
            type: table_name,
            body: {
                // Setup the data model
                properties: {
                    id           : { type: "string" },
                    name         : { type: "string" },
                    ingredients  : { type: "string", index_name : "ingredient" }
                }
            }
        },
        function (err, es_res) {
            res.json(es_res);
        });
    });
});

/*********************************************
    POST
*/

// Return search results
app.post('/search', function(req, res) {
    var query   = req.body.query;
    var results = [];

    var lookup = {
        size : 50,

        query: {
            multi_match : {
                query  : query,
                fields : ["name^3", "ingredients"]
            }
        }
    };

    raw_client.post('_search/', lookup, function(err, raw_res, body) {
        if (body && body.hits)
            results = body.hits.hits;

        res.json(results);
    });
});


app.listen(port);
console.log("Server running at port: " + port)