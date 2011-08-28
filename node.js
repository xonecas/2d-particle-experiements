/*jshint node:true, curly:true, eqeqeq:true, onevar:true */

var _http   = require('http'),
   _path    = require('path'),
   _fs      = require('fs'),
   _url     = require('url'),
   PORT     = 8080,
   HTDOCS   = __dirname,
   CACHE    = 0, // 1000 * 60 * 60 * 24 * 30, /* one month */
   EXTNAMES = {
      'html': 'text/html',
      'htm' : 'text/html',
      'css' : 'text/css',
      'js'  : 'application/javascript'
   };


_http.createServer(function (req, res) {
   var url, pathname;

   /* I only want GET requests */
   if (req.method === 'GET') {
      url = _url.parse(req.url, true);

      /* fix / (root) request */
      if (url.pathname === '/') {
         url.pathname = '/index.html';
      }

      /* make sure we only serve files within HTDOCS */
      pathname = HTDOCS + url.pathname;
      _path.exists(pathname, function (exists) {
         if (!exists) { /* @TODO check for .dotfiles */
            res.writeHead(404);
            return res.end("Sorry, no file for you.");
         }

         pathname = _path.resolve(HTDOCS + url.pathname);
         _fs.readFile(pathname, 'utf8', function (err, out) {
            var extname    = _path.extname(url.pathname).substring(1),
               contentType = EXTNAMES[extname];

            if (err) {
               res.writeHead(500);
               res.end("Could not resolve path request");
               throw err;
            }

            res.writeHead(200, {
               "content-type"    : contentType +", charset=UTF-8",
               "content-length"  : out.length,
               "cache-control"   : "public, max-age="+CACHE
            });
            res.end(out);
         
         });
      });
   } else {
      res.writeHead(405);
      res.end('Sorry, only taking GET requests right now.');
   }
}).listen(PORT);
