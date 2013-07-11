from django.db import models
from django.contrib.translation import ugettext_lazy as _

class PointOfInterest(models.Model):
    """
    Point of interest represent a place where a user hs to be to complete\    a challenge
    """
    title = models.CharField(_('Title'), max_length=255)
    point = models.PointField(help_text="Represented as (longitude, latitude)")
    created = models.DateTimeField(auto_now_add=True)
    radius = models.IntegerField(_('Radius in metter'), default=10)
    description = models.TextField(_('Description of the POI'), blank=True)
    photo = ImageField(upload_to='poi', null=True, blank=True)

class Challenge(models.Model):
    """
    A challenge to complete to a special point of interest during a hunt
    """
    title = models.CharField(_('title'), max_length=255)
    poi = models.ForeignKey(PointOfInterest, null=False)
    numberOfPoints = models.IntegerField(_('Number of points the challenge represents'))
    question = models.TextField(_('Specific question for the challenge'))
    answer = models.CharField(_("Question answer"), max_length=255)

class Hunt(models.Model):
    """
    A hunt is a list of challenge that team need to perform in order to\
    get as much point as possible.
    """
    title = modelsCharField(_('title'), max_length=255)
    startingPOI =  models.ForeignKey(PointOfInterest, null=False)
    endingPOI =  models.ForeignKey(PointOfInterest, null=False)
    challenges = 
    duration = 
    unlockingPass = models.TextField(_('Specific password for the hunt'))
    latePenalty = models.IntegerField(_('Penalty applied to the final score in case of delay', default=0) 
