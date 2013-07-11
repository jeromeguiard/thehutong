from tastypie.resources import ModelResource
from .models import PointOfInterest, Challenge, Hunt

class PointOfInterestResource(ModelResource):
    class Meta:
        queryset = PointOfInterest.objects.all()
        resource_name = 'poi'

class ChallengeResource(ModelResource):
    class Meta:
        queryset = Challenge.objects.all()
        resource_name = 'challenge'

class HuntResource(ModelResource):
    class Meta:
        queryset = Hunt.objects.all()
        resource_name = 'hunt'
