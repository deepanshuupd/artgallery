"""Build the interactive story map offline from the credited DataMeet districts.

Usage: python scripts/generate-story-map.py /path/to/2011_Dist
Requires pyshp, pyproj and Shapely >= 2.1; never runs in the website.
"""
import json
import sys
from pathlib import Path

import shapefile
from pyproj import Transformer
from shapely import coverage_is_valid, coverage_simplify
from shapely.geometry import shape
from shapely.ops import polygonize, transform, unary_union

project = Transformer.from_crs("EPSG:4326", "EPSG:32644", always_xy=True).transform
reader = shapefile.Reader(sys.argv[1])
records = {
    row.record["DISTRICT"]: transform(project, shape(row.shape.__geo_interface__)).buffer(0)
    for row in reader.iterShapeRecords() if row.record["ST_NM"] == "Uttarakhand"
}
kumaon_names = ["Almora", "Bageshwar", "Champawat", "Nainital", "Pithoragarh", "Udham Singh Nagar"]
assert len(records) == 13 and all(name in records for name in kumaon_names)
names = sorted(records)
original_state = unary_union(list(records.values()))
overlap = sum(g.area for g in records.values()) - original_state.area
assert overlap / original_state.area < .0001, "Source overlap needs manual review"

# Node shared edges and resolve only the source's microscopic overlapping slivers
# before simplifying the entire coverage together. Independent district
# simplification would introduce visible gaps along shared borders.
faces = polygonize(unary_union([g.boundary for g in records.values()]))
parts = {name: [] for name in names}
for face in faces:
    inside = face.representative_point()
    owners = [name for name in names if records[name].covers(inside)]
    if owners:
        parts[owners[0]].append(face)
coverage = [unary_union(parts[name]) for name in names]
assert coverage_is_valid(coverage), "Districts must share matching edges"
simplified = dict(zip(names, coverage_simplify(coverage, tolerance=350)))
assert coverage_is_valid(list(simplified.values()))
state = unary_union(list(simplified.values()))
kumaon = unary_union([simplified[name] for name in kumaon_names])
garhwal = unary_union([g for name, g in simplified.items() if name not in kumaon_names])
assert abs(state.area - kumaon.area - garhwal.area) < 1
x0, y0, x1, y1 = state.bounds
scale = min(480 / (x1 - x0), 355 / (y1 - y0))

def point(x, y):
    return {"x": round(35 + (x - x0) * scale, 1), "y": round(25 + (y1 - y) * scale, 1)}

def path(geometry):
    polygons = list(geometry.geoms) if geometry.geom_type == "MultiPolygon" else [geometry]
    segments = []
    for polygon in polygons:
        for ring in [polygon.exterior, *polygon.interiors]:
            coords = [point(x, y) for x, y in ring.coords]
            segments.append("M" + "L".join(f'{p["x"]},{p["y"]}' for p in coords) + "Z")
    return "".join(segments)

districts = []
for name in kumaon_names:
    district = simplified[name]
    marker = district.representative_point()
    districts.append({"name": name, "id": name.lower().replace(" ", "-"), "path": path(district), "point": point(marker.x, marker.y)})
data = {"viewBox": "0 0 550 420", "state": path(state), "garhwal": path(garhwal), "kumaon": path(kumaon), "districts": districts}
output = Path("src/components/about/story-map-data.json")
output.write_text(json.dumps(data, separators=(",", ":")) + "\n")
print(f"Exported {len(districts)} Kumaon districts; shared-edge coverage valid; {output.stat().st_size:,} bytes.")
print(f"Resolved source overlap: {overlap / original_state.area:.10%}; markers identify districts, not city coordinates.")
