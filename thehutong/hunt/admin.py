from django.contrib import admin
from django.contrib.gis import admin
from .models import PointOfInterest, Challenge, Hunt

class PointOfInterestAdmin(admin.ModelAdmin):
    pass
admin.site.register(PointOfInterest, PointOfInterestAdmin)

class ChallengeAdmin(admin.ModelAdmin):
    pass
admin.site.register(Challenge, ChallengeAdmin)

class HuntAdmin(admin.ModelAdmin):
    pass
admin.site.register(Hunt, HuntAdmin)
