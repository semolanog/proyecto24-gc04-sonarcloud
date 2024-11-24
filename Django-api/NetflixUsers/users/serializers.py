from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from .models import PaymentMethod, User
import requests


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

    def validate_favorite_genre_ids(self, value):
        if value:
            genres_url = "http://127.0.0.1:8000/genres/"
            try:
                response = requests.get(genres_url)
            except requests.RequestException as e:
                raise ValidationError(
                    f"Error retrieving Genres from {genres_url}: {str(e)}."
                )
            if response.status_code != status.HTTP_200_OK:
                raise ValidationError(
                    f"Error retrieving Genres from {genres_url}. "
                    f"Status code: {response.status_code}."
                )
            genres = response.json()
            genre_ids = set(genre["id"] for genre in genres)
            try:
                favorite_genre_ids = set(
                    int(favorite_genre_id)
                    for favorite_genre_id in value.split(",")
                )
            except ValueError:
                raise ValidationError(
                    "A valid comma-separated list of integers is required."
                )
            invalid_favorite_genre_ids = favorite_genre_ids - genre_ids
            if invalid_favorite_genre_ids:
                raise ValidationError([
                    (
                        f"Invalid pk \"{invalid_favorite_genre_id}\" - "
                        "object does not exist."
                    )
                    for invalid_favorite_genre_id in invalid_favorite_genre_ids
                ])
            return value
