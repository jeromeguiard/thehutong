from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    """
    A team that is going to perfom hunts
    """

class TeamHunt(models.Model):
    """
    When a team start a hunt it will generate this object to follow it \
    individually
    """

class ChallengeTeamHunt(models.Model):
    """
    Individual challenge performed by a team durin a hunt
    """
