from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    rating = models.FloatField(null=True)
    image = models.ImageField(upload_to='restaurant_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name


class Food(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='foods', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='food_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name



class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='reviews', on_delete=models.CASCADE)
    customer = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f'Review by {self.customer.name} for {self.restaurant.name}'


class Customers(models.Model):
    resturant_name = models.OneToOneField(Review, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order_no = models.IntegerField(default=0, null=True)

    def _str_(self):
        return self.name