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
    