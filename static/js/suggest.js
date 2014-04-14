$(document).ready(function() {

    var form  = $(".search");
    var query = $('.search input[name="query"]');
    var results = $('.results');

    function get_suggestions() {
        $.post("/search", { query: query.val() }, function(data) {

            results.empty();

            for (i in data) {
                var r = data[i]._source;

                //results.append("<li>"+ JSON.stringify(data[i]) );
                results.append("<div><a href='http://www.ah.nl/allerhande/recept/R-" + r.id + "' target='_blank'>"+ r.name + "</a><p>" + r.ingredients.join(', ') +"</div>");
            }
        });
    }

    // TODO throttle to rate limit
    query.on("keyup", get_suggestions);

    form.submit(function() {
        get_suggestions();
        return false;
    });

});