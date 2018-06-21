const app = {
    'url': 'https://api.giphy.com/v1/gifs/search',
    'apiKey': 'UriJDI0sExlg14EoS5tPvZjUA5SkbnYh',
    'topics': [
        "Synthwave", "Alternative Rock", "Classic Rock", "Punk Rock", 
        "Lo-Fi HipHop"
    ],
    buildImage: function (keyword, rating, url) {
        var  wrapperDiv = $('<div>').attr({
                                            "class": 'col-3',
                                        }), 
            card = $('<div>').attr({
                                    'class': 'card',
                                    'style': 'width: 18rem;',
                                }),
            img = $('<img>').attr({
                                    'class': 'card-img-top',
                                    'src': url,
                                    'alt': keyword,
                                }),
            cardBody = $('<div>').attr({
                                        'class': 'card-body',
                                    }),
            cardText = $('<p>').addClass('card-text').html(
                                                '<strong>Rating: </strong>' + 
                                                rating.toUpperCase()
                                            );
        wrapperDiv.append(card.append(img).append(cardBody.append(cardText)));
        return wrapperDiv;
    },
    buildAlert: function (keyword) {
        var alertDiv = $('<div>').attr({
                                "class": `alert alert-dismissible fade show`,
                                "role": "alert",
                            }),
            alertBtn = $('<button>').attr({
                                            "type": "button",
                                            "class": "close",
                                            "data-dismiss": "alert",
                                            "aria-label": "Close",
                                        }),
            alertSpan = $('<span>').attr({
                                        "aria-hidden": "true",
                                    }).html("&times;");
        alertBtn.append(alertSpan);
        alertDiv.append(alertBtn);
        return alertDiv;
    },
    flashAlert: function (keyword) {
        var alert = app.buildAlert(keyword);
        if (!app.checkGiphyExist(keyword)) {
           alert.prepend("<strong>" + keyword + `</strong> has 
            been added to the <strong>Dyanmic Giphys</strong> drop down menu.    
            `).addClass("alert-success");
        } else {
            alert.prepend("<strong>" + keyword + `</strong> has 
            already been added, please try another keyword!
            `).addClass("alert-danger");
        }
        $("#alert").append(alert);
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

//Build links for default topics
app.topics.forEach(function(element) {
    var ghtml = `<li class="nav-item">
                    <a class="giphy-link nav-link" href="#">` + element + `</a>
                </li>`;
    $("#giphy-buttons").prepend(ghtml);
});

//Build links in the drop down menu for new topics entered by the user in search
$("#add-giphy").submit(function(event) {
    event.preventDefault()
    var keyword = $("#keyword-input").val().trim(),
        aKeyword = $("<a>").attr({
                            "href": "#",
                            "class": "giphy-link dropdown-item",
                        });
    if(keyword != ""){
        app.flashAlert(keyword);
        if (!app.checkGiphyExist(keyword)) {
            aKeyword.text(keyword);
            $("#new-giphy").append(aKeyword);
            $("#keyword-input").val("");
        };
    }
});

//Even listener for when a giph-link is clicked
$(".giphy-link").on("click", function(event){
    event.preventDefault();
    
    var url = app.url,
        keyword = $(this).text();

    url += '?' + $.param({
        'api_key': app.apiKey,
        'q': keyword,
        'limit': '10',
        'rating': 'PG-13',
    })

    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(results) {
        var data = results.data;
        $("#images").empty();
        data.forEach(function(element){
            var rating = element['rating'],
                imgURL = element.images.downsized_medium.url;
            $("#images").append(app.buildImage(keyword, rating, imgURL));
        })
    }).fail(function(err) {
        throw err;
    });
});