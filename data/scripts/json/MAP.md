# Unzip shape file

unzip -o cb_2017_us_county_20m.zip

# Convert Shape to JSON

shp2json cb_2017_us_county_20m.shp -o counties.json

#To convert a GeoJSON feature collection to a newline-delimited stream of GeoJSON features

ndjson-split 'd.features' < counties.json > counties.ndjson

# Join GeoJSON and Metrics
## Left join so that we don't loose features

ndjson-join --left 'd.GEOID' counties-geoid.ndjson zip-zcta-geoid-unemp-popden-fix.ndjson > counties-geoid-join-left.ndjson

# Merge Properties

ndjson-map 'd[0].properties = Object.assign(d[0].properties, d[1] ? {unemp:+d[1].unemp,
den: +d[1].density_sq_mile,ZCTA5:d[1].ZCTA5} : {unemp:0,den:0,ZCTA5:d[0].GEOID}), d[0]' < counties-geoid-join-left.ndjson > counties-join-out.ndjson

# Removed properties, if any

ndjson-filter 'delete d.GEOID, true' < counties-join-out.ndjson > counties-join-metrics.ndjson

# Redundant to Unique Map

ndjson-reduce 'p[d.properties.GEOID] = d, p' '{}' < counties-join-metrics.ndjson > counties-join-metrics-reduce.ndjson

# Object to Features Array

ndjson-split 'Object.keys(d).map(function(f){return d[f];})' < counties-join-metrics-reduce.ndjson > counties-join-metrics-unique.ndjson


# NDJSON to GEOJSON

ndjson-reduce 'p.features.push(d), p' '{type: "FeatureCollection", features: []}' < counties-join-unique.ndjson > counties-metrics-geo.json

#NDJSON to TopoJSON

geo2topo -n counties-join-metrics-unique.ndjson > counties-metrics-topo.json