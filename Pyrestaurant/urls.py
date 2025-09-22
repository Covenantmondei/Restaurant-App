from django.urls import path
from .views import *

urlpatterns = [
    path("create",CreateRestaurant.as_view(), name='createRestaurant'),
    path("food/buy", BuyFood.as_view(), name="buy"),
    path("search/", SearchRestaurant.as_view(), name="searchRestaurant"),
    path("food/add", AddFood.as_view(), name="addFood"),
    path("all", GetAllRestaurants.as_view(), name="allRestaurants"),
    path("food/get", GetFood.as_view(), name="getFood"),
    path("customers/", TopCustomers.as_view(), name="topcustomers"),
    path("reviews/", TopReviews.as_view(), name="topreviews"),
    path("getall", Restaurantsall.as_view(), name="restaurant")
]