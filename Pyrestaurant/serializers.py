from rest_framework import serializers
from .models import *

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
        
class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'

class CustomersSerializer(serializers.ModelSerializer):
    restaurant = serializers.CharField(source='resturant_name.name', read_only=True)

    class Meta:
        model = Customers
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'