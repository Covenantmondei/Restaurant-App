from django.urls import path
from .views import *

urlpatterns = [
    path("create_resturant",CreateRestaurant.as_view(), name='createRestaurant'),
    path("buyfood", BuyFood.as_view(), name="buy")

]