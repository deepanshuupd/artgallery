# Regional graphics

## Uttarakhand map
Source: DataMeet/maps, Districts/Census_2011/2011_Dist.{shp,dbf,shx,prj}, downloaded 5 October 2026.
https://github.com/datameet/maps/tree/master/Districts/Census_2011
Licence: Creative Commons Attribution 2.5 India. https://creativecommons.org/licenses/by/2.5/in/

Modified: merged all 13 Uttarakhand districts for the state boundary and the six Kumaon districts for the highlighted region; projected WGS84 coordinates into UTM zone 44N; topology-preserving 350-metre display simplification; exported rounded SVG paths in src/components/home/uttarakhand-map-data.json.
Kumaon membership checked against https://kumaon.gov.in/about-department/introduction/ and Garhwal against https://garhwal.uk.gov.in/.
The Pithoragarh marker identifies its district using an interior representative point; it is not a surveyed city coordinate. This is a simplified administrative origin illustration, not a navigation map or a claim about exclusive cultural boundaries. Visible source/licence credit appears under the map.

The interactive Our Story map uses the same source in `src/components/about/story-map-data.json`. Its build utility is `scripts/generate-story-map.py`: shared edges are noded before a joint, 350-metre coverage simplification, then all six Kumaon district polygons are exported individually. Geometric validation checks 13 source districts, six Kumaon districts, matching edges and complete coverage. District representative points are not surveyed city locations. The original homepage geometry is unchanged.

## Aipan-inspired line border
Original geometric repeat created for KumaonRang from lines, diamonds and dots, informed by the owner's Aipan photograph. No Pinterest stock, AI-modified or watermarked artwork copied. It is a decorative interpretation, not a named ritual motif.

Display outline was visually cross-checked against Survey of India, Uttarakhand English, first edition 2026, scale 1:500,000. This does not certify survey accuracy; the shipped geometry remains the credited DataMeet snapshot. Source file hashes: reports/uttarakhand-redesign/map-source-manifest.json. Rebuild utility: scripts/generate-kumaon-map.py.
