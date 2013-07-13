from django.conf.urls import patterns, include, url
from .api import PointOfInterestResource, ChallengeResource, HuntResource
from tastypie.api import Api

hunt_api = Api(api_name='v1')
hunt_api.register(PointOfInterestResource())
hunt_api.register(ChallengeResource())
hunt_api.register(HuntResource())

urlpatterns = patterns('api.views',
    (r'^', include(hunt_api.urls)),
)
