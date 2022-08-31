const port = process.env.PORT || 3000;
// const port = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const articles = [];

//top page code
// app.get("/", (req, res) => {
//   res.json(`welcome to japanese news`);
// });

//fetching news article code
app.get("/news", (req, res) => {
  axios
    .get("https://japannews.yomiuri.co.jp/society/general-news/")
    .then((response) => {
      const html = response.data;
      cheerio.load(html);
      const $ = cheerio.load(html);

      $(".bloc_2 > ul > li > a", html).each(function () {
        const title = $(this).find("h2").text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url,
          source: "Yomiuri",
        });
      });

      return axios.get("https://japantoday.com/category/national");
    })
    .then((response) => {
      const html = response.data;
      cheerio.load(html);
      const $ = cheerio.load(html);

      $(".media-sm", html).each(function () {
        const title = $(this).find("h3 > a").text();
        const item = $(this).find("h3 > a").attr("href");
        const prepend = "https://japantoday.com";
        const url = prepend + item;
        articles.push({
          title,
          url,
          source: "Japantoday",
        });
      });

      return axios.get("https://mainichi.jp/english/japan/");
    })
    .then((response) => {
      const html = response.data;
      cheerio.load(html);
      const $ = cheerio.load(html);

      $(".list-typeD > li > a", html).each(function () {
        const title = $(this).find(".midashi").text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url,
          source: "Mainichi",
        });
      });
      res.json(articles);
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
