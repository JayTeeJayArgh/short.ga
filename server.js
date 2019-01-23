const express = require('express')
const app = express()
app.use(express.static('public'))
var http = require('http');
var fs = require('fs');
var json = './urls.json';
var jsonDB = require(json);
//-----------------------//
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  function check(url) {
    var newKey = Math.random().toString(36).substr(2, 5);
    if(jsonDB.hasOwnProperty(newKey)){
      check(url)
    } else {
      jsonDB[newKey] = `${url}`;
      fs.writeFileSync(json, JSON.stringify(jsonDB));
      res.write(`${url} is now shortend at https://short.ga/${newKey} `)
    }
  }
  var url = req.url.replace("/", "");
  if(url == "") {
    res.write(`<!DOCTYPE html><html><head><title>URL Shortener</title><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><style>body {background-color: #f2f2f2; padding: 70px 0;}</style></head><body><center><h1>URL Shortener</h1><p>A url shortener written in node js</p><hr/><h3>Pass a url and get a short one back</h3> For example: <br/><code class="w3-codespan">https://short.ga/create/https://www.foo.com</code><b> may return:</b><br/><code class="w3-codespan">https://short.ga/arjh3</code><br/><br/><br/>By using this site, you agree to our <a href="/tos">Terms Of Service</a> | <a href="http://feelmodern.gq">By ModernFeelGames</a> | <a href="mailto:hello@short.ga">Email Us</a></center></body></html>`)
  } else if(url.startsWith("create")) {
    var urlToShorten = url.replace("create/", "");
    console.log(urlToShorten);
    if(urlToShorten.startsWith("http://")) {
      check(urlToShorten)
      console.log('valid')
    } else if(urlToShorten.startsWith("https://")) {
      console.log("valid")
      check(urlToShorten)
    } else {
      console.log('invalid')
    }
    
  } else if(url == "favicon.ico"){
    //ignore favicon as a request
  } else {
    if(jsonDB.hasOwnProperty(url)){
      var wheretogo = jsonDB[url];
      res.writeHead(301,{Location: `${wheretogo}`});
    } else if (url == "tos") {
      res.write(`<!DOCTYPE html><html><head><title>Terms Of Service</title><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><style>body {background-color: #f2f2f2; padding: 70px 0;}</style></head><body><center><h1>Terms Of Service</h1><hr/><p class="w3-small">By using our site you agree to our terms of service <br/> Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the http://short.ga website (the "Service") operated by ModernFeelGames (http://feelmodern.gq) ("us", "we", or "our").<br/><br/><br/>Our Service may contain links to third-party web sites or services that are not owned or controlled by short.ga. short.ga has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that short.ga shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.<br/><br/>We do not assume responsibility for damage to your computer through use of our website. All software is provided "As Is", use at own risk.<br/>We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.<br/><br/>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.<br/><br/>You may not generate short links to any website with mature content not suitable for children under 18, any website that has or sells alcohol, anything that promotes harm of another human or animal, any website that promotes segregation, any website that promotes death, or any other website that shortens urls.<br/><br/>We retain the right to ban you from our website, and/or delete your links without warning<br/>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 15 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.<br/><br/>Spamming uneeded links, numbers and/or letters, names, or any other sensetive information is not allowed. We reserve the right to remove your links and/or permanently ban you. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p></center></body></html>`)
    } else if (url == "banned") {
      res.write("This url has been removed by our systems or staff. If you have broken our TOS, you may be banned.")
    } else {
      res.write("Error: The requested url does not exist")
    } 
  }res.end()
}).listen(process.env.PORT);