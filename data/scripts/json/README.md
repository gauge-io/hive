
# CSV to .ndjson

csv2json -n < example.csv > example.ndjson

# Add new property to ndjson file using ndjson-map

ndjson-map 'd.ZCTA5CE10 = d.zcta, d' < Zipcode-ZCTA-Population-Density-And-Area-Unsorted.ndjson > Zipcode-ZCTA-Population-Density-And-Area-Unsorted-ZCTA5CE10.ndjson

# Join Geojson and Metric

ndjson-join 'd.ZCTA5CE10' us_counties.ndjson Zipcode-ZCTA-Population-Density-And-Area-Unsorted-ZCTA5CE10.ndjson > us_counties-join.ndjson

# Add density to geojson and remove extra properties

ndjson-map 'd[0].properties.dens = d[1].density_sq_mile, d[0]' < us_counties-join.ndjson > us_counties-den.ndjson

# Delete extra properties

ndjson-filter 'delete d.properties.AWATER10, true' < us_counties-den.ndjson > us_counties-final.ndjson

# Update properties

ndjson-map 'd.properties = {ZCTA:d.ZCTA5CE10,GEOID:d.GEOID10,une:d.unempr,den:d.dens}, d' < us_counties-final.ndjson > us_counties-1.ndjson

# Convert ndjson to GeoJSON
ndjson-reduce < us_counties-final.ndjson | ndjson-map '{type: "FeatureCollection", features: d}' > us_counties_final.json