from django.db import models
from django.contrib.auth.models import User
from thehutong.hunt.models import Hunt, Challenge
from django.utils.translation import ugettext as _

class Team(models.Model):
    """
    A team that is going to perfom hunts
    """
    name = models.TextField(_(u"Team name"),
                           max_length=200)
    user = models.OneToOneField(User,
                                unique=True,
                                verbose_name=_(u'user'))
    created = models.DateTimeField(auto_now_add=True) 

class ChallengeTeamHunt(models.Model):
    """
    Individual challenge performed by a team durin a hunt
    """
    COMPLETED = 1
    IN_PROGRESS = 2
    NOT_STARTED = 0

    LOCKED = 0
    UNLOCKED =1 

    COMPLETED_STATUS=(
        (COMPLETED, _(u'Completed')),
        (IN_PROGRESS, _(u'In progress')),
        (NOT_STARTED, _(u'Not started')),
    )

    LOCKED_STATUS=(
        (LOCKED , _(u'Challenge locked')),
        (UNLOCKED , _(u'Challenge unlock'))
    )

    challenge = models.ForeignKey(Challenge)
    team = models.ForeignKey(Team)
    points = models.IntegerField(help_text = _(u"Point earned while the challenge has been completed"),
                                default=0)
    status = models.IntegerField(_(u'Completed status for the challenge'),
                                 choices=COMPLETED_STATUS,
                                 default=NOT_STARTED)
    comment = models.CharField(_(u'Comment about the challenge'),
                              max_length = 140)
    lock = models.IntegerField(_(u'Challenge lock status'),
                              choices=LOCKED_STATUS,
                              default=LOCKED)

class TeamHunt(models.Model):
    """
    When a team start a hunt it will generate this object to follow it \
    individually
    """
    team = models.ForeignKey(Team)
    hunt = models.ForeignKey(Hunt)
    created = models.DateTimeField(auto_now_add=True)
    challenge = models.ManyToManyField(ChallengeTeamHunt)
