        // Load Counties TopoJSON
        // 
        // 1. Filter topologies where our profiles are situated.
        // 2. Get GeoJSON features of these topologies
        // 3. Get centroid of GeoJSON features
        // 4. Build a Map of properties.zcta to feature
        // 5. Add a Point feature for every profile
        // 6. Build a GeoJSON data source
        
        // 
        
        // data/scripts/json/us_counties-final-quantized-topo.json
        // data/TopoJSON/us_counties_final.json
        // data/TopoJSON/mapshaper/us_counties_final-topo-webmercator.json
        // data/TopoJSON/mapshaper/us_counties_final-topo.json
        // 
        /*
        d3.json("data/TopoJSON/geojson-io/us_counties_final-topo.topojson").then(function(oTopo){

            //console.log('oTopo', oTopo);

            // 1. Filter topologies where our profiles are situated.
            // 'us_counties_final'
            var aTopologies = getTopoFromZip(oTopo.objects['collection'].geometries, aZipUnique);

            console.log("Found topologies", aTopologies, 'aMissingZCTA' , aZipUnique);


            // 2. Get GeoJSON features of these topologies
            // 

            var aFeatureGeo = topo2Geo(aTopologies, oTopo.arcs);

            console.log('Geo Features', aFeatureGeo);

            // 3. Get centroid of GeoJSON features
            // 
            var aFeatureCentroids = getGeoCentroid(aFeatureGeo);

            console.log('Centroid Geo Features', aFeatureCentroids);

            // 4. Build a GeoJSON data source
            // 
            var aGeoJSON = getFeatureCollectionFromFeatures(aFeatureCentroids);

            console.log('GeoJSON', aGeoJSON);

            // 5. Add the data source to map with clustering
            // 
            callback(turf.toWgs84(aGeoJSON));
            
        });
        */
    
       
        // Work with GeoJSON
        // 
        // data/TopoJSON/mapshaper/us_counties_final-topo.json
        // data/GeoJSON/counties/cb_2017_us_zcta510_500k_1per.json
        /*
        d3.json("data/TopoJSON/mapshaper/us_counties_final-geo.json").then(function(oGeoJSON){

            //console.log('oTopo', oTopo);

            // 1. Filter features where our profiles are situated.
            // 
            var aFeatureGeo = getFeaturesFromZip(oGeoJSON.features, aZipUnique);

            console.log("Found features", aFeatureGeo, 'aMissingZCTA' , aZipUnique);

            // 3. Get centroid of GeoJSON features
            // 
            var aFeatureCentroids = getGeoCentroid(aFeatureGeo);

            console.log('Centroid Geo Features', aFeatureCentroids);

            // 4. Build a Map of properties.zcta to feature
            // 
            var oZCTAFeature = d3.map(aFeatureCentroids, function(f){
                return f.properties.ZCTA;
            });

            // 5. Add a Point feature for every profile
            // 
            var aProfileCentroids = aProfiles.map(function(p){
                // TODO
                // Find the ZCTA via lookup
                // 
                return oZCTAFeature.get(p._zip);
            }).filter(function(p){
                return !!p;
            });

            // 6. Build a GeoJSON data source
            // 
            var aGeoJSON = getFeatureCollectionFromFeatures(aProfileCentroids);

            console.log('GeoJSON', aGeoJSON);

            // 5. Add the data source to map with clustering
            // 
            callback(aGeoJSON);
            
        });

        */
        /*
        d3.csv("data/CSV/uszipsv1.2-zip-to-zcta-reduced.csv").then(function(oTopo){

            //console.log('oTopo', oTopo);
            
        });*/
