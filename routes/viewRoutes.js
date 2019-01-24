module.exports = function(app, db, axios, cheerio) {
  // Load Index Page
  app.get("/", (req, res) => {
    db.Article.find({ isSaved: false })
      .limit(12)
      .exec(function(error, data) {
        var articleObject = {
          article: data
        };
        console.log(articleObject);
        res.render("index", articleObject);
      });
  });

  // Load Saved Page
  app.get("/saved", function(req, res) {
    db.Article.find({ isSaved: true })
      .populate("notes")
      .exec(function(error, data) {
        var articleObject = {
          article: data
        };
        res.render("saved", articleObject);
      });
  });

  // Scraping contents
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
            console.log(result);

        //   let newArticle = new db.Article({
        //     title: result.title,
        //     description: result.description,
        //     link: result.link
        //   });
        //   newArticle.save();
        });
        console.log(results);
        // Send a message to the client
        res.send("Scrape Complete");
      })
      .catch(err => {
        console.log(err);
      });
  });
};
