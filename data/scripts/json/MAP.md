# Unzip shape file

unzip -o cb_2017_us_county_20m.zip

# Convert Shape to JSON

shp2json cb_2017_us_county_20m.shp -o counties.json

#To convert a GeoJSON feature collection to a newline-delimited stream of GeoJSON features

ndjson-split 'd.features' < counties.json > counties.ndjson

