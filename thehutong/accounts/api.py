from tastypie.resources import ModelResource
from .models import Team, ChallengeTeamHunt, TeamHunt


class TeamResource(ModelResource):
    class Meta:
        queryset = Team.objects.all()
        resource_name = 'team'

class ChallengeTeamHuntResource(ModelResource):
    class Meta:
        queryset = ChallengeTeamHunt.objects.all()
        resource_name = 'challengeteamhunt'

class TeamHuntResource(ModelResource):
    class Meta:
        queryset = TeamHunt.objects.all()
        resource_name = 'teamhunt'
