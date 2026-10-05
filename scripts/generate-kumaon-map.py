"""Offline artwork build. Install shapely, pyshp and pyproj; pass a downloaded
DataMeet Census_2011 district shapefile stem as the first argument.
Source and licence: public/illustrations/ATTRIBUTION.md. No runtime map APIs.
"""
import sys
import json, shapefile, math
from shapely.geometry import shape
from shapely.ops import unary_union, transform
from pyproj import Transformer
from pathlib import Path
r=shapefile.Reader(sys.argv[1])
project=Transformer.from_crs('EPSG:4326','EPSG:32644',always_xy=True).transform
records={s.record['DISTRICT']:transform(project,shape(s.shape.__geo_interface__)).buffer(0) for s in r.iterShapeRecords() if s.record['ST_NM']=='Uttarakhand'}
kumaon_names=['Almora','Bageshwar','Champawat','Nainital','Pithoragarh','Udham Singh Nagar']
assert len(records)==13 and all(n in records for n in kumaon_names)
state=unary_union(list(records.values()))
kumaon=unary_union([records[n] for n in kumaon_names])
assert state.covers(kumaon)
# Merge first, then simplify at a 350 m display tolerance; never freehand the division.
state=state.simplify(350,preserve_topology=True)
kumaon=kumaon.simplify(350,preserve_topology=True)
x0,y0,x1,y1=state.bounds
scale=min(480/(x1-x0),355/(y1-y0))
def point(x,y): return (35+(x-x0)*scale,25+(y1-y)*scale)
def path(geom):
    polygons=list(geom.geoms) if geom.geom_type=='MultiPolygon' else [geom]
    out=[]
    for p in polygons:
        for ring in [p.exterior,*p.interiors]:
            coords=[point(x,y) for x,y in ring.coords]
            out.append('M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in coords)+'Z')
    return ''.join(out)
# The district label is deliberately a district representative point, not a city pin.
p=records['Pithoragarh'].representative_point(); px,py=point(p.x,p.y)
data={'state':path(state),'kumaon':path(kumaon),'pithoragarhDistrict':{'x':round(px,1),'y':round(py,1)},'viewBox':'0 0 550 420','kumaonDistricts':kumaon_names,'source':'DataMeet Census 2011 districts, CC BY 2.5 India','projection':'WGS84 / UTM 44N','simplificationMeters':350}
Path('src/components/home/uttarakhand-map-data.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
print('Map geometry bytes',Path('src/components/home/uttarakhand-map-data.json').stat().st_size,'Pithoragarh district point',px,py)
