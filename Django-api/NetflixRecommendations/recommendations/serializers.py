from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from .models import WatchedEpisode, WatchedMovie, WatchedSeries
import requests


EPISODES_URL = "http://127.0.0.1:8000/episodes/"
MOVIES_URL = "http://127.0.0.1:8000/movies/"
SERIES_URL = "http://127.0.0.1:8000/series/"
USERS_URL = "http://127.0.0.1:8001/users/"


def validate_resource_id(class_name, url, value):
    if value:
        url = f"{url}{value}/"
        try:
            response = requests.get(url)
        except requests.RequestException as e:
            raise ValidationError(
                f"Error retrieving {class_name} from {url}: {str(e)}."
            )
        if response.status_code not in {
            status.HTTP_200_OK, status.HTTP_404_NOT_FOUND
        }:
            raise ValidationError(
                f"Error retrieving {class_name} from {url}. "
                f"Status code: {response.status_code}."
            )
        if response.status_code == status.HTTP_404_NOT_FOUND:
            raise ValidationError(
                f"Invalid pk \"{value}\" - object does not exist."
            )
        return value


class WatchedEpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchedEpisode
        fields = ["episode_id", "user_id"]

        def validate_episode_id(self, value):
            return validate_resource_id("Episode", EPISODES_URL, value)

        def validate_user_id(self, value):
            return validate_resource_id("User", USERS_URL, value)


class WatchedMovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchedMovie
        fields = ["movie_id", "user_id"]

        def validate_movie_id(self, value):
            return validate_resource_id("Movie", MOVIES_URL, value)

        def validate_user_id(self, value):
            return validate_resource_id("User", USERS_URL, value)


class WatchedSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchedSeries
        fields = ["series_id", "user_id"]

        def validate_series_id(self, value):
            return validate_resource_id("Series", SERIES_URL, value)

        def validate_user_id(self, value):
            return validate_resource_id("User", USERS_URL, value)
