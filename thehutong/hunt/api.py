from tastypie import fields
from tastypie.resources import ModelResource
from .models import PointOfInterest, Challenge, Hunt

class PointOfInterestResource(ModelResource):
    class Meta:
        queryset = PointOfInterest.objects.all()
        resource_name = 'poi'

class ChallengeResource(ModelResource):
    poi = fields.ForeignKey(PointOfInterestResource, 'poi')
    class Meta:
        queryset = Challenge.objects.all()
        resource_name = 'challenge'

class HuntResource(ModelResource):
    startingPOI = fields.ForeignKey(PointOfInterestResource, 'startingPOI')
    endingPOI = fields.ForeignKey(PointOfInterestResource, 'endingPOI')
    challenges = fields.ToManyField(ChallengeResource, 'challenges')
    class Meta:
        queryset = Hunt.objects.all()
        resource_name = 'hunt'
