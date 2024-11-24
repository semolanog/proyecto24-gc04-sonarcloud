from rest_framework import serializers
from .models import PaymentMethod, User


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["active", "details", "expiration_date", "id", "type"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "admin", "email", "favorite_genre_ids", "id",
            "name", "password", "payment_method_ids"
        ]
