from django.conf.urls import patterns, include, url
from .api import TeamResource, ChallengeTeamHuntResource, TeamHuntResource
from tastypie.api import Api

account_api = Api(api_name='account')
account_api.register(TeamResource())
account_api.register(ChallengeTeamHuntResource())
account_api.register(TeamHuntResource())

urlpatterns = patterns('api.views',
    (r'^', include(account_api.urls)),
)
