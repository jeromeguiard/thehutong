from django.db import models

class PointOfInterest(models.Model):
    """
    Point of interest represent a place where a user hs to be to complete\    a challenge
    """
class Challenge(models.Model):
    """
    A challenge to complete to a special point of interest during a hunt
    """

class Hunt(models.Model):
    """
    A hunt is a list of challenge that team need to perform in order to\
    get as much point as possible.
    """
