from django.urls import path
from .views import simulate_api
urlpatterns=[path('simulate/',simulate_api)]
