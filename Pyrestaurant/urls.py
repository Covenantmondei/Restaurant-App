from django.urls import path
from .views import CreateRestaurant

urlpatterns = [
    path("create_resturant",CreateRestaurant.as_view(), name='createRestaurant')

]