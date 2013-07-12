from tastypie import fields
from tastypie.resources import ModelResource
from .models import Team, ChallengeTeamHunt, TeamHunt
from thehutong.hunt.api import ChallengeResource, HuntResource

class TeamResource(ModelResource):
    class Meta:
        queryset = Team.objects.all()
        resource_name = 'team'

class ChallengeTeamHuntResource(ModelResource):
    team = fields.ForeignKey(TeamResource, 'team')
    challenge = fields.ForeignKey(ChallengeResource, 'challenge')
    class Meta:
        queryset = ChallengeTeamHunt.objects.all()
        resource_name = 'challengeteamhunt'

class TeamHuntResource(ModelResource):
    team = fields.ForeignKey(TeamResource, 'team')
    hunt = fields.ForeignKey(HuntResource, 'hunt')
    challenge = fields.ToManyField(ChallengeResource, 'challenge')
    class Meta:
        queryset = TeamHunt.objects.all()
        resource_name = 'teamhunt'
