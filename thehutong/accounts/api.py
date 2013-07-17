from tastypie import fields
from tastypie.resources import ModelResource
from .models import ChallengeTeamHunt, TeamHunt
from thehutong.hunt.api import ChallengeResource, HuntResource
from tastypie.authentication import BasicAuthentication, ApiKeyAuthentication
from tastypie.authorization import Authorization
from tastypie.models import ApiKey
from django.contrib.auth.models import User
from thehutong.hunt.models import Hunt

class ApiAuthorization(Authorization):
    def read_list(self, object_list, bundle):
#        print bundle
        return object_list.filter(user=bundle.request.user)

class UserResource(ModelResource):
    class Meta:
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get', 'patch', 'put']
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = [ 'password', 'is_superuser']
        #authorization = DjangoAuthorization()

class ApiKeyResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)

    class Meta:
        allowed_methods = ['get']
        queryset = ApiKey.objects.all()
        authentication = BasicAuthentication()
        authorization = ApiAuthorization()
        resource_name = 'apikey'

class ChallengeTeamHuntResource(ModelResource):
   # user = fields.ForeignKey(UserResource, 'user', full=True)
    challenge = fields.ForeignKey(ChallengeResource, 'challenge', full=True)
    class Meta:
        queryset = ChallengeTeamHunt.objects.all()
        resource_name = 'challengeteamhunt'

class TeamHuntResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    hunt = fields.ForeignKey(HuntResource, 'hunt')
    challenge = fields.ToManyField(ChallengeTeamHuntResource, 'challenge', full=True)
    class Meta:
        queryset = TeamHunt.objects.all()
        resource_name = 'teamhunt'
        authentication = ApiKeyAuthentication()
        authorization = Authorization()
        filtering = {
            'team':('exact'),
            'hunt':('exact'),
        }
    def obj_create(self, bundle, request = None, **kwargs):
        bundle = super(TeamHuntResource, self ).obj_create(bundle, **kwargs)
        for index, chal in enumerate(bundle.obj.hunt.challenges.all()) :
            if index == 0 :
                bundle.obj.challenge.create(challenge=chal, lock = 1)
            bundle.obj.challenge.create(challenge=chal)
        return bundle
