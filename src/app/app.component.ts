import { Component, OnInit } from '@angular/core';

/* ol and jquery declarations */
declare var ol: any;
declare var require: any;

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

   	ngOnInit(): void {

      /* Source, layer and map defintions */
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

      /* Call ajax function */
      getData();

      function getData() {

        /* API url with parameters */
        let url = 'https://webcamstravel.p.mashape.com/webcams/list/orderby=popularity,asc/limit=50?lang=en&show=webcams%3Aimage%2Clocation';

        $.ajax({
          url: url,
          type: 'GET',
          data: {},
          dataType: 'json',
          success: function(data) { 
            console.log((data.result.webcams)); 
            
            /* Transform every coordinate, create a feature, and add it to the layer source */
            for(let webcam of data.result.webcams) {
              let coordinates = new ol.geom.Point(ol.proj.transform([webcam.location.longitude, webcam.location.latitude], 'EPSG:4326', 'EPSG:3857'));

              let feature = new ol.Feature({
                name: 'Coordinates',
                geometry: coordinates
              });

              vectorSource.addFeature(feature);
            }
          },
          error: function(err) { console.log(err); },
          
          /* Set a header with API key value */
          beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Key", "YOUR-API-KEY");
          }
        });

      }
    }
}