const app = {
    'url': 'https://api.giphy.com/v1/gifs/search?',
    'apiKey': 'UriJDI0sExlg14EoS5tPvZjUA5SkbnYh',
    'topics': [
        "Synthwave", "Alternative Rock", "Classic Rock", "Punk Rock", 
        "Lo-Fi HipHop"
    ],
    'alertHTML': {
        'alertDiv': $('<div>').attr({
                                "class": `alert alert-dismissible fade show`,
                                "role": "alert",
                            }),
        'alertButton': $('<button>').attr({
                                    "type": "button",
                                    "class": "close",
                                    "data-dismiss": "alert",
                                    "aria-label": "Close",
                                }),
        'alertSpan': $('<span>').attr({
                                    "aria-hidden": "true",
                                }).append("&times;"),
    },
    succAlert: function (keyword) {
        app.alertHTML.alertButton.append(app.alertSpan);
        if (!app.checkGiphyExist(keyword)) {
            app.alertHTML.alertDiv.html("<strong>" + keyword + `</strong> has 
            been added to the <strong>Dyanmic Giphys</strong> drop down menu.    
            `).addClass("alert-success");
        } else {
            app.alertHTML.alertDiv.html("<strong>" + keyword + `</strong> has 
            already been added, please try another keyword!
            `).addClass("alert-danger");
        }
        app.alertHTML.alertDiv.append(app.alertHTML.alertButton);
        $("#alert").append(app.alertHTML.alertDiv);
        setTimeout(app.closeAlert, 4000);
    },
    closeAlert: function () {
        $(".alert").alert("close");
    },
    checkGiphyExist: function (keyword) {
        var existing = $(".giphy-link").map(function() {
                            return $(this).text();
                        }).get(),
            check = existing.some(function(element){
                        return element == keyword;
                    });
        return check;
    }
}

app.topics.forEach(function(element) {
    var ghtml = `<li class="nav-item">
                    <a class="giphy-link nav-link" href="#">` + element + `</a>
                </li>`;
    $("#giphy-buttons").prepend(ghtml);
});

$("#add-giphy").submit(function(event) {
    event.preventDefault()
    var keyword = $("#keyword-input").val().trim(),
        aKeyword = $("<a>").attr({
                            "href": "#",
                            "class": "giphy-link dropdown-item",
                        });
    app.succAlert(keyword);
    if (!app.checkGiphyExist(keyword)) {
        aKeyword.text(keyword);
        $("#new-giphy").append(aKeyword);
        $("#keyword-input").val("");
    };
});

$(".giphy-link").on("click", function(){

    url += '?' + $.param({
        'api_key': app.apiKey,
        'q': '',
        'limit': '10',
        'rating': 'PG-13',
    })

    $.ajax({
        url: app.url,
        method: 'GET',
    }).done(function(result) {
        console.log(result);
    }).fail(function(err) {
        throw err;
    });
});
