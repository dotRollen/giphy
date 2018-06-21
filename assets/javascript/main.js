const app = {
    'url': 'https://api.giphy.com/v1/gifs/',
    'apiKey': 'UriJDI0sExlg14EoS5tPvZjUA5SkbnYh',
    'topics': [
        "Synthwave", "Alternative Rock", "Classic Rock", "Punk Rock", 
        "Gorillaz"
    ],
    buildImage: function (obj) {
        var  wrapperDiv = $('<div>').attr({
                                "class": 'col-lg-4 col-md-6 col-sm-6 col-xs-12',
                            }), 
            card = $('<div>').attr({
                                    'class': 'card',
                                    'style': 'width: 18rem;',
                                }),
            img = $('<img>').attr({
                                    'class': 'giphy-img card-img-top',
                                    'src': obj.imgURLStill,
                                    'id': obj.id,
                                    'alt': obj.id,
                                    'data-value': 'still'
                                }),
            cardBody = $('<div>').attr({
                                        'class': 'card-body',
                                    }),
            cardText = $('<p>').addClass('card-text').html(
                                            '<p><strong>Title: </strong>' +
                                            obj.title + 
                                            '</p><p><strong>Rating: </strong>' + 
                                            obj.rating.toUpperCase() 
                                        ),
            download = $("<a>").attr({
                                    "href": obj.imgURL,
                                    "class": `btn btn-primary
                                            btn-sm file-request`,
                                    "download": '',
                        }).html('<i class="fa fa-download"></i> Download');
        wrapperDiv.append(
                card.append(img).append(
                    cardBody.append(cardText.append(download)
                )
            )
        );
        return wrapperDiv;
    },
    buildAlert: function () {
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

//Event listener for when a giph-link is clicked
$("body").on("click", ".giphy-link", function(event){
    event.preventDefault();
    
    var url = app.url,
        keyword = $(this).text();

    url += 'search?' + $.param({
        'api_key': app.apiKey,
        'q': keyword,
        'limit': '12',
        'rating': 'PG-13',
    })

    $.ajax({
        'url': url,
        'method': 'GET',
    }).done(function(results) {
        // console.log(results.type.gif);
        var data = results.data;
        data.forEach(function(element){
            var obj = { 
                'id': element['id'],
                'rating': element['rating'],
                'title': element['title'],
                'imgURLStill': element.images.fixed_height_still.url,
                'imgURL': element.images.fixed_height.url,
            };

            $("#giphy-images").append(app.buildImage(obj));
        })
    }).fail(function(err) {
        throw err;
    });
});

//Event listener for when a user clicks on the image. Image pause/unpause
$("body").on("click", ".giphy-img", function(event){
    var img = $(this),
        id = img.attr("id"),
        url = app.url;
    
    url += id + '?' + $.param({'api_key': app.apiKey});

    $.ajax({
        'url': url,
        'method': 'GET',
    }).done(function(results) {
        var images = results.data.images,
            still = images.fixed_height_still.url,
            notStill = images.fixed_height.url;
        if(img.attr("data-value") == "not-still") {
            img.attr({
                "src": still,
                "data-value": "still",
            });
        } else {
            img.attr({
                "src": notStill,
                "data-value": "not-still",
            });
        }
    })
});

// $("body").on("click", ".file-request", function(event){
//     var url = $(this).attr("id");
//     window.location = url;
// });