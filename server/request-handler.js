/*************************************************************
You should implement your request handler function in this file.
requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.
You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.
*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************///var exports = export{}s.module = {};

var messages = { results: [] }; // This is where the POSTed messages will be stored. 

exports.requestHandler = function(request, response) { //Export the method in order to make it public and available to the basic-server.
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200; //The default status code 
  
  if(request.url === '/classes/messages' || request.url === '/classes/room1'){ //If the request URLs proceed

    if(request.method === 'POST'){ //If the type of request is a POST
      statusCode = 201; // Change the status code to 201;
      var body = []; //Create the body variable to store the message as it arrives in chunks.
      request.on('data', function(chunk){ //On a request.on event, push the chunks into the body array
        body.push(chunk);
      });
      
      request.on('end', function(){ //On a request.on event, at the end of the request, 
        body = JSON.parse((body.toString())); //Stringify the body since it comes in as BUFFER binary, this turns it into a JSON string, so then
                                              //use JSON.parse to turn it into an actual object
        messages.results.push(body) //push the message object into the results array inside of the messages object
      })
    }
  }else { //if the request does not match the two URLs, then return a 404- Not Found error
    statusCode = 404;
  }



  // The outgoing status.

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;                    // the headers tells you what what data/methods the server accepts 
  //console.log('these are the headers', headers)

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/json"; // tells the client what type of data is accepted/returned - this case it is JSON

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(messages)); // Since the GET requests expecta an object with an array of messages assigned to the results key.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

