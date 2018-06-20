var url = "https://api.giphy.com/v1/gifs/search?",
    topics = ["Synthwave", "Alternative Rock", "Classic Rock", "Punk Rock", "Lo-Fi HipHop"];

url += '?' + $.param({
    'api_key': 'UriJDI0sExlg14EoS5tPvZjUA5SkbnYh',
    'q': '',
    'limit': '10',
    'rating': 'PG-13',
})

topics.forEach(function(element) {
    var ghtml = `<li class="nav-item">
                    <a class="nav-link" href="#">` + element + `</a>
                </li>`;
    $("#giphy-buttons").prepend(ghtml);
});

$("#button").on("click", function(){
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {
        console.log(result);
    }).fail(function(err) {
        throw err;
    });
});
