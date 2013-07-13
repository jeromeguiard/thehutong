from django.conf.urls import patterns, include, url
from .api import TeamHuntResource, ChallengeTeamHuntResource, UserResource, ApiKeyResource
from tastypie.api import Api

account_api = Api(api_name='v1')

account_api.register(ChallengeTeamHuntResource())
account_api.register(UserResource())
account_api.register(ApiKeyResource())
account_api.register(TeamHuntResource())

urlpatterns = patterns('api.views',
    (r'^', include(account_api.urls)),
)
