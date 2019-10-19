function elTemp(elPostReq) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements - ${elPostReq.name}</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>${elPostReq.name}</h1>
    <h2>${elPostReq.symbol}</h2>
    <h3>Atomic number ${elPostReq.number}</h3>
    <p>${elPostReq.description}</p>
    <p><a href="/">back</a></p>
  </body>
  </html>`;
}
module.exports = elTemp;
