from django.conf.urls import patterns, include, url
from .models import Team, ChallengeTeamHunt, TeamHunt
from tastypie.api import Api

account_api = Api(api_name='account')
account_api.register(Team())
account_api.register(ChallengeTeamHunt())
account_api.register(TeamHunt())

urlpatterns = patterns('api.views',
    (r'^', include(account_api.urls)),
)
