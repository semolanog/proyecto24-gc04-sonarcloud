from rest_framework import serializers
from .models import Episode, Genre, Movie, Series


class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = [
            "description", "directors", "duration", "episode_number",
            "genre_ids", "id", "main_actors", "rating", "release_date",
            "season_number", "series_id", "title"
        ]
        

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]
        

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            "description", "directors", "duration", "genre_ids", "id",
            "main_actors", "rating", "release_date", "thumbnail_url",
            "title"
        ]
        

class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = [
            "description", "directors", "end_date", "episode_average_duration",
            "genre_ids", "id", "main_actors", "rating", "release_date",
            "seasons", "thumbnail_url", "title"
        ]
