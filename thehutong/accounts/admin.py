from django.contrib import admin
from django.contrib.gis import admin
from .models import ChallengeTeamHunt, TeamHunt  

#class TeamAdmin(admin.ModelAdmin):
#    pass
#admin.site.register(Team, TeamAdmin)

class ChallengeTeamHuntAdmin(admin.ModelAdmin):
    pass
admin.site.register(ChallengeTeamHunt, ChallengeTeamHuntAdmin)

class TeamHuntAdmin(admin.ModelAdmin):
    pass
admin.site.register(TeamHunt, TeamHuntAdmin)
