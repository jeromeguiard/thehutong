from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'thehutong.views.home', name='home'),
    # url(r'^thehutong/', include('thehutong.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/hunt/', include('thehutong.hunt.urls')),
    url(r'^api/account/', include('thehutong.account.urls')),
)
