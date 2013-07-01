appengine-endpoints-backend-java
================================

This application implements a simple backend for a Tic Tac Toe game using
Google Cloud Endpoints, App Engine, and Java.

## Products
- [App Engine][1]

## Language
- [Java][2]

## APIs
- [Google Cloud Endpoints][3]

## Setup Instructions
1. Import the project into Eclipse.
1. Make sure the App Engine SDK jars are added to the `war/WEB-INF/lib`
   directory, either by adding them by hand, or having Eclipse do it. (An easy)
   way to do this in Eclipse is to unset and reset whether or not the project
   uses Google App Engine.
1. Update the value of `application` in `appengine-web.xml` to the app ID you
   have registered in the App Engine admin console and would like to use to host
   your instance of this sample.
1. Update the values in `src/com/google/devrel/samples/ttt/spi/Ids.java` to
   reflect the respective client IDs you have registered in the
   [APIs Console][4].
1. Update the value of `google.devrel.samples.ttt.CLIENT_ID` in
   [`war/js/render.js`][6] to reflect the web client ID you have registered in the
   [APIs Console][4].
1. Run the application, and ensure it's running by visiting your local server's
   address (by default [localhost:8888][5].)
1. Deploy your application.


[1]: https://developers.google.com/appengine
[2]: http://java.com/en/
[3]: https://developers.google.com/appengine/docs/java/endpoints/
[4]: https://code.google.com/apis/console
[5]: https://localhost:8888/
[6]: https://github.com/GoogleCloudPlatform/appengine-endpoints-tictactoe-java/blob/master/war/js/render.js
