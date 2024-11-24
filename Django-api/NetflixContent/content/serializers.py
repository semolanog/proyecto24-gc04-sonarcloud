from rest_framework import serializers
from .models import Genre, Series
        

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]
        

class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = [
            "description", "directors", "end_date", "episode_average_duration",
            "genre_ids", "id", "main_actors", "rating", "release_date",
            "seasons", "thumbnail_url", "title"
        ]
