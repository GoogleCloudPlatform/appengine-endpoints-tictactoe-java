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

## Configuration Instructions
- Update the value of `application` in `appengine-web.xml` to the app ID you
	have registered in the App Engine admin console and would like to use to host
	your instance of this sample.
- Update the values in `src/com/google/devrel/samples/ttt/spi/Ids.java` to
	reflect the respective client IDs you have registered in the
	[APIs Console][4].
- This sample does not bundle a copy of the App Engine SDK. You will need to
	supply your own and include required files in requisite locations in your
	`war` directory.


[1]: https://developers.google.com/appengine
[2]: http://java.com/en/
[3]: https://developers.google.com/appengine/docs/java/endpoints/
[4]: https://code.google.com/apis/console