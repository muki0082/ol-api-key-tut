# Openlayers and API data tutorial

## A really really short tutorial, explaining how to use API data from an API that uses a key, with Openlayers

In this example I created an Angular 4 application, with Openlayers4. For our example API I used Webcams.travel API. The specification and different API links and usage can be found here: https://www.webcams.travel/

The API is really well constructed and works fast, if anyone wants to explore it further and use it in more complex app - I know I am ;)

The complete code is available in this repository as an working app. I will mention here only parts that are relevant for the purpose of this short tutorial.


1. In this case, I was using a hosted library for Openlayers4 and also for jQuery. You will see below why we needed both of them.

So we have links in our index.html file like this:

```html
    <link rel="stylesheet" href="https://openlayers.org/en/v4.5.0/css/ol.css" type="text/css">
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <!--  -->
    <script src="https://openlayers.org/en/v4.5.0/build/ol.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```

Because OpenLayers are not installed for this application, we need to declare the "ol" varaiable in our app.component.ts file:

```javascript
    declare var ol: any;
```

2. The OpenLayers elements for this example include a map, vector layer and a source for that layer:

```javascript
    let vectorSource =  new ol.source.Vector({});

    let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        zIndex: 10
    });

    let center = ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857');

    let map = new ol.Map({
        view: new ol.View({
          center: center,
    			zoom: 3
        }),
        layers: [
    			new ol.layer.Tile({
            source: new ol.source.OSM(),
            zIndex: 1
          }),
          vectorLayer
        ],
        target: 'map'
    });
```

3. At the end, we create a function, that will make AJAX request towards our API, and set a request header, sending the header name and the value. In this case, we are sending a X-Mashape-Key header, with our API key as a value. 

To use AJAX in Angular, define jQuery in our app.component.ts file:

```javascript
    declare var jquery: any;
    declare var $: any;
```

So, our success function would loop through every object gotten from the API, create a Point and then a Feature using the Point. After that, every Feature is added to our vector source.

```javascript
for(let webcam of data.result.webcams) {
    let coordinates = new ol.geom.Point(ol.proj.transform([webcam.location.longitude, webcam.location.latitude], 'EPSG:4326', 'EPSG:3857'));

    let feature = new ol.Feature({
        name: 'Coordinates',
        geometry: coordinates
    });

    vectorSource.addFeature(feature);
```

The header data "injection" can be done in the beforeSend:

```javascript
    beforeSend: function(xhr) {
        xhr.setRequestHeader("X-Mashape-Key", "YOUR-API-KEY");
    }
```

Which would cause sending header name and value to the API when requesting the data.

That's it, you now have some fresh API data in your vector source, and they are added to the OSM map with OpenLayers default styling ;)

## TO-DO

1. Use npm install openlayers and import ol modules, instead of using hosted libraries.