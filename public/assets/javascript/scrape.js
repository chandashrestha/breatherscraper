// Grab Articles

$(document).ready(() => {

    // Event handlers
    $(document).on("click", "#clear", deleteArticle);
    $(document).on("click", ".scrape-new", scrapeArticle);

    $(".save").on("click", function () {
        var thisId = $(this).attr("data-id");
        // console.log(thisId);
        saveArticle(thisId);
    });

    $(".delete").on("click", function () {
        var thisId = $(this).attr("data-id");
        // console.log(thisId);
        delSelectedArticle(thisId);
    });

    $(".notesave").on("click", function () {
        var thisId = $(this).attr("data-id");
        console.log(thisId);
        if (!$("#noteText" + thisId).val()) {
            alert("please write something")
        } else {
            noteAdd(thisId);
        }
    });

    $(document).on('click', '.deleteNote', function () {
        var noteId = $(this).attr("data-note-id");
        var articleId = $(this).attr("data-article-id");
        console.log(noteId);
        console.log(articleId);
        noteDelete(noteId, articleId)
    });

    // Delete Article
    function deleteArticle(event) {
        event.stopPropagation();

        $.ajax({
            method: "DELETE",
            url: "/api/articles"
        }).done(function (data) {
            window.location = "/"
        })
    };

    // Scrape Article
    function scrapeArticle(event) {
        event.stopPropagation();

        $.ajax({
            method: "GET",
            url: "/scrape"
        }).done(function () {
            window.location = "/";
        })
    };

    // Save Article
    function saveArticle(data) {
        // console.log(data);
        $.ajax({
            method: "POST",
            url: "/api/articles/" + data,
            data: data
        }).done(function () {
            window.location = "/";
        })
    };

    // Delete Selected Saved Articles
    function delSelectedArticle(data) {
        // console.log(data);
        $.ajax({
            method: "DELETE",
            url: "/api/Articles/" + data,
            data: data
        }).done(function () {
            window.location = "/saved";
        })
    };

    // Adding Notes
    function noteAdd(data) {
        $.ajax({
            method: "POST",
            url: "/api/notes/" + data,
            data: {
                text: $("#noteText" + data).val(),
                article: data
            }
        }).done(function (data) {
            // console.log(data)
            $("#noteText" + data).val("");
            window.location = "/saved"
        });
    };

    // Delete a note
    function noteDelete(noteId, articleId) {
        $.ajax({
            method: "DELETE",
            url: "/api/notes/" + noteId + "/" + articleId
        }).done(function (data) {
            console.log(data)
            $(".modalNote").modal("hide");
            window.location = "/saved"
        })
    }
});