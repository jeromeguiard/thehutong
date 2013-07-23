from django.contrib import admin
from django.contrib.gis import admin
from .models import PointOfInterest, Challenge, Hunt

BEIJING_LAT = 4850913.57056
BEIJING_LON = 12958378.95748
DEFAULT_ZOOM = 11


class PointOfInterestAdmin(admin.OSMGeoAdmin):
    default_lat = BEIJING_LAT
    default_lon = BEIJING_LON
    default_zoom = DEFAULT_ZOOM        
admin.site.register(PointOfInterest, PointOfInterestAdmin)

class ChallengeAdmin(admin.ModelAdmin):
    pass
admin.site.register(Challenge, ChallengeAdmin)

class HuntAdmin(admin.ModelAdmin):
    pass
admin.site.register(Hunt, HuntAdmin)
