from geopy import Nominatim

g = Nominatim(user_agent="wizmybus")
a = g.geocode("THIRUVANANTHAPURAM (TVM)")

def isBounded(bbox, ll):
    # Function to find if a given [lat,lng] is contained in a given boundary.

    x1,x2 = float(min(bbox[:1])),float(max(bbox[:1]))
    y1,y2 = float(min(bbox[2:])),float(max(bbox[2:]))
    if x1 <= ll[0] <= x2 and y1 <= ll[1] <= y2:
        return True
    return False

print(a.raw)
print(isBounded(a.raw['boundingbox'], [8.425597,77.076874]))