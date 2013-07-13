from tastypie import fields
from tastypie.resources import ModelResource
from .models import ChallengeTeamHunt, TeamHunt
from thehutong.hunt.api import ChallengeResource, HuntResource
from tastypie.authentication import BasicAuthentication
from tastypie.authorization import Authorization
from tastypie.models import ApiKey
from django.contrib.auth.models import User

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


#class TeamResource(ModelResource):
#    class Meta:
#        queryset = Team.objects.all()
#        resource_name = 'team'

class ChallengeTeamHuntResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)
    challenge = fields.ForeignKey(ChallengeResource, 'challenge', full=True)
    class Meta:
        queryset = ChallengeTeamHunt.objects.all()
        resource_name = 'challengeteamhunt'

class TeamHuntResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)
    hunt = fields.ForeignKey(HuntResource, 'hunt', full=True)
    challenge = fields.ToManyField(ChallengeResource, 'challenge')
    class Meta:
        queryset = TeamHunt.objects.all()
        resource_name = 'teamhunt'
        filtering = {
            'team':('exact'),
            'hunt':('exact'),
        }
