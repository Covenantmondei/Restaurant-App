from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import *
from .serializers import *

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

        if restaurant:
            serializer = RestaurantSerializer(restaurant)
            food = Food.objects.filter(restaurant=restaurant)
            food_serializer = FoodSerializer(food, many=True)

            reviews = Review.objects.filter(restaurant=restaurant)
            reviews_serializer = ReviewSerializer(reviews, many=True)

            customers = Customers.objects.filter(resturant_name=restaurant).order_by('-order_no')[:5]
            customers_serializer = CustomersSerializer(customers, many=True)

            return Response({
                "restaurant": serializer.data,
                "foods": food_serializer.data,
                "reviews": reviews_serializer.data,
                "customers": customers_serializer.data,
            })

        return Response({"Error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    

class GetAllRestaurants(APIView):
    def get(self, request):
        restaurants = Restaurant.objects.order_by('-created_at')[:5]
        rating = Restaurant.objects.all()

        for i in rating:
            if i.rating > 5:
                i.rating = 5
                i.save()

        
        data = []
        for restaurant in restaurants:
            restaurant_data = RestaurantSerializer(restaurant).data
            foods = Food.objects.filter(restaurant=restaurant)
            foods_data = FoodSerializer(foods, many=True).data
            data.append({
                "restaurant": restaurant_data,
                "foods": foods_data
            })
        return Response(data)
    

class Restaurantsall(APIView):
    def get(self, request):
        restaurants = Restaurant.objects.order_by('-created_at')
        rating = Restaurant.objects.all()

        for i in rating:
            if i.rating > 5:
                i.rating = 5
                i.save()

        
        data = []
        for restaurant in restaurants:
            restaurant_data = RestaurantSerializer(restaurant).data
            foods = Food.objects.filter(restaurant=restaurant)
            foods_data = FoodSerializer(foods, many=True).data
            data.append({
                "restaurant": restaurant_data,
                "foods": foods_data
            })
        return Response(data)
    


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
        restid = Restaurant.objects.get(name=restaurant_name).id

        foods = Food.objects.filter(restaurant=restid)
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        restaurant_name = request.data.get("restaurantName")
        customer_name = request.data.get("customerName")
        rating = request.data.get("rating")
        comment = request.data.get("review")
        rid = Restaurant.objects.get(name=restaurant_name).id

        data = {
            "restaurant":rid,   
            "customer":customer_name,
            "rating":rating,
            "comment":comment
        }

        data2 = {
            "resturant_name":rid,
            "name":customer_name,
            "rating":rating
        }


        serializers = ReviewSerializer(data=data)
        if serializers.is_valid():
            serializers.save()
        
            serializers = CustomersSerializer(data=data2)
            if serializers.is_valid():
                customers = Customers.objects.filter(resturant_name=rid)
                if customers.filter(name=customer_name).exists():
                    i = customers.get(name=customer_name)
                    i.order_no +=1
                    i.save()
                else:
                    serializers.save()
                    num = customers.get(name=customer_name)
                    num.order_no += 1
                    num.save()

                restaurant = Restaurant.objects.get(id=rid)

                if restaurant.rating != 0:
                    restaurant.rating = (restaurant.rating + int(rating))/2
                else:
                    restaurant.rating += int(rating)

                restaurant.save()

                return Response({"message":"Created customer"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error":serializers.errors})
            return Response({"Message":"Review added successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error":serializers.errors})
        

class GetFood(APIView):
    def get(self, request):
        restaurant_name = request.GET.get('restaurant')
        foods = Food.objects.filter(restaurant__name=restaurant_name)
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data)
    

class TopCustomers(APIView):
    def get(self, request):
        customers = Customers.objects.order_by('-order_no')[:5]
        serializers = CustomersSerializer(customers, many=True)
        return Response(serializers.data)
    

class TopReviews(APIView):
    def get(self, request):
        reviews = Review.objects.all()[:5]
        serializers = ReviewSerializer(reviews, many=True)
        return Response(serializers.data)
    

# class Home(APIView):
    # def get(self, request):
    #     return Response({"message":"Hello world"})