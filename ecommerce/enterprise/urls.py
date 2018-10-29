from django.conf.urls import include, url

from ecommerce.enterprise import views

OFFER_URLS = [
    url(r'^$', views.EnterpriseOfferListView.as_view(), name='list'),
    url(r'^new/$', views.EnterpriseOfferCreateView.as_view(), name='new'),
    url(r'^(?P<pk>[\d]+)/edit/$', views.EnterpriseOfferUpdateView.as_view(), name='edit'),
]

COUPON_URLS = [
    url(r'^(.*)$', views.EnterpriseCouponAppView.as_view(), name='app'),
]

urlpatterns = [
    url(r'^offers/', include(OFFER_URLS, namespace='offers')),
    url(r'^coupons/(.*)$', views.EnterpriseCouponAppView.as_view(), name='coupons'),
]
