from django.db import models
from django.utils.translation import ugettext as _
from django.contrib.gis.db import models

class PointOfInterest(models.Model):
    """
    Point of interest represent a place where a user hs to be to complete\
    a challenge
    """
    title = models.CharField(_(u'Title'),
                             max_length=255)
    point = models.PointField(help_text="Represented as (longitude, latitude)")
    created = models.DateTimeField(auto_now_add=True)
    radius = models.IntegerField(_(u'Radius in metter'),
                                 default=10)
    description = models.TextField(_(u'Description of the POI'),
                                   blank=True)
    #photo = ImageField(upload_to='poi',
    #                   null=True,
    #                   blank=True)

    class Meta:
        verbose_name = _(u'Point of interest')
        verbose_name_plural = _(u'Points of interest')

    def __unicode__(self):
        return u'%s' % self.title


class Challenge(models.Model):
    """
    A challenge to complete to a special point of interest during a hunt
    """
    title = models.CharField(_(u'title'),
                             max_length=255)
    poi = models.ForeignKey(PointOfInterest,
                            null=False)
    numberOfPoints = models.IntegerField(_(u'Number of points the challenge represents'))
    question = models.TextField(_(u'Specific question for the challenge'))
    answer = models.CharField(_("Question answer"),
                              max_length=255)

    class Meta:
        verbose_name = _(u'Challange')
        verbose_name_plural = _(u'Challenges')

    def __unicode__(self):
        return u'Challenge : %s in poi %s' % (self.title, self.poi)

class Hunt(models.Model):
    """
    A hunt is a list of challenge that team need to perform in order to\
    get as much point as possible.
    """
    title = models.CharField(_(u'title'),
                            max_length=255)
    startingPOI =  models.ForeignKey(PointOfInterest, 
                                     null=False,
                                     related_name = 'startingPOI')
    endingPOI =  models.ForeignKey(PointOfInterest, 
                                   null=False,
                                   related_name = 'endingPOI')
    challenges = models.ManyToManyField(Challenge) 
    duration = models.IntegerField(help_text=_(u"Durationof the hunt in minutes"),
                                   default=180) 
    unlockingPass = models.TextField(_(u'Specific password for the hunt'))
    latePenalty = models.IntegerField(_(u'Penalty applied to the final score in case of delay'),
                                      default=0) 

    class Meta:
        verbose_name = _(u'Hunt')
        verbose_name_plural = _(u'Hunt')

    def __unicode__(self):
        return u'Hunt %s' % self.title
