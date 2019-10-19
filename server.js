const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const elTemp = require("./elTemp.js");

const PORT = 8080;

const server = http.createServer((req, res) => {
  req.setEncoding("utf8");

  if (req.url === "/css/styles.css") {
    fs.readFile(`./public/css/styles.css`, (err, data) => {
      if (err) throw err;
      res.writeHead(200, { "content-type": "text/css" });
      res.write(data);
      res.end();
    });
  }
  // console.log(req.method);
  // console.log(req.url);
  // console.log(req.headers);

  if (req.method === "GET") {
    fs.readdir(`./public`, (err, files) => {
      if (err) throw err;
      if (req.url === "/") {
        req.url = `/index`;
      }
      if (!files.includes(`${req.url.slice(1)}.html`)) {
        req.url = "/_404";
      }
      fs.readFile(`./public${req.url}.html`, "utf8", (err, data) => {
        if (err) throw err;
        res.writeHead(200, {
          "content-type": "text/html",
          "content-length": data.length
        });
        res.write(data);
        res.end();
      });
    });
  }

  if (req.method === "POST") {
    req.on("data", chunk => {
      const elPostReq = querystring.parse(chunk);
      req.on("end", () => {
        fs.writeFile(`./public${req.url}.html`, elTemp(elPostReq), err => {
          if (err) throw err;
          fs.readFile(`./public/index.html`, "utf8", (err, data) => {
            if (err) throw err;
            if (data.includes(req.url)) {
              res.write("Element already exists");
              res.end();
              return;
            }
            let count = (data.match(/<h3>These are/g) || []).toString();
            let countEl = (data.match(/href/g) || []).length;
            let newIndex =
              data.split(count)[0].toString() +
              `<h3>These are ${countEl}</h3>` +
              data.split("</h3>")[1].toString();
            newIndex =
              newIndex.split("</ol>")[0].toString() +
              `<li>\n<a href="${req.url}.html">${
                elPostReq.name
              }</a>\n</li>\n</ol>` +
              newIndex.split("</ol>")[1].toString();
            fs.writeFile(`./public/index.html`, newIndex, err => {
              if (err) throw err;
              res.writeHead(200, {
                "content-type": "text/html",
                "content-length": newIndex.length
              });
              res.write(newIndex);
              res.end();
            });
          });
        });
      });
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
