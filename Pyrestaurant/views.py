from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Restaurant,Food,Review,Customers
from .serializers import RestaurantSerializer,FoodSerializer,CustomersSerializer,ReviewSerializer

class CreateRestaurant(APIView):
    def post(self,request):
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message": f'{serializer.data["name"]} Resturant Created'})
        return Response({"Error":serializer.errors})


class SearchRestaurant(APIView):
    def get(self, request):
        restaurant_name = request.GET.get('restaurant')
        restaurant = Restaurant.objects.filter(name__icontains=restaurant_name).first()
        try:
            if restaurant:
                serializer = RestaurantSerializer(restaurant)
                return Response(serializer.data)
            return Response({"Error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        except Restaurant.DoesNotExist:
            return Response({"Error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
    

class GetAllRestaurants(APIView):
    def get(self, request):
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)
    


class AddFood(APIView):

    def post(self, request):
        try:
            serializer = FoodSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"Message": f'{serializer.data["name"]} Food Added Successfully'})
            return Response({"Error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class BuyFood(APIView):
    def get(self, request):
        restaurant_name = request.GET.get('restaurant')

        foods = Food.objects.filter(restaname=restaurant_name)
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        restaurant_name = request.data.get("restaurantName")
        customer_name = request.data.get("customerName")
        rating = request.data.get("rating")
        comment = request.data.get("review")

        data = {
            "restaurant":restaurant_name,
            "customer":customer_name,
            "rating":rating,
            "comment":comment
        }

        data2 = {
            "restaurant":restaurant_name,
            "name":customer_name
        }

        serializers = ReviewSerializer(data=data)
        if serializers.is_valid():
            serializers.save()
        
            serializers = CustomersSerializer(data=data2)
            if serializers.is_valid():
                num = Customers.objects.get(name=customer_name)
                num.order_no += 1
                num.save()
                serializers.save()

                return Response({"message":"Created customer"}, status=status.HTTP_201_CREATED)
            return Response({"Message":"Review added successfully"}, status=status.HTTP_201_CREATED)