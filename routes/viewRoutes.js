module.exports = function(app, db, axios, cheerio) {
  // ----- Load Index Page
  app.get("/", (req, res) => {
    db.Review.find({ isSaved: false })
      .limit(12)
      .exec(function(error, data) {
        var reviewObject = {
          review: data
        };
        console.log(reviewObject);
        res.render("index", reviewObject);
      });
  });

  // ----- Load Saved Page
  app.get("/saved", function(req, res) {
    db.Review.find({ isSaved: true })
      .populate("notes")
      .exec(function(error, data) {
        var reviewObject = {
          review: data
        };
        res.render("saved", reviewObject);
      });
  });

  // ----- Scraping contents
  app.get("/scrape", (req, res) => {
    var results = [];
    axios
      .get("https://thehimalayantimes.com/")
      .then(function(response) {
        var $ = cheerio.load(response.data);

        $("li").each(function() {
          var result = {};

          result.title = $(this)
            .children("h4")
            .children("a")
            .text()
            .trim();
          result.description = $(this)
            .children("p")
            .text()
            .trim();
          result.link = $(this)
            .children("h4")
            .children("a")
            .attr("href")
            .trim();

          results.push(result);

          //   db.Review.create(result).then(function(err, dbReview) {
          //     if (err) {
          //       console.log(err);
          //     } else {
          //       console.log(dbReview);
          //     }
          //   });
        });
        console.log(results);
        // ----- Send a message to the client
        res.send("Scrape Complete");
      })
      .catch(err => {
        console.log(err);
      });
  });
};
