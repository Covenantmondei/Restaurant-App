from django.urls import path
from .views import *

urlpatterns = [
    path("create",CreateRestaurant.as_view(), name='createRestaurant'),
    path("food/buy", BuyFood.as_view(), name="buy"),
    path("search/", SearchRestaurant.as_view(), name="searchRestaurant"),
    path("food/add", AddFood.as_view(), name="addFood"),
    path("all", GetAllRestaurants.as_view(), name="allRestaurants"),  # <-- Add this line
]