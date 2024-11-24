from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .models import WatchedEpisode, WatchedMovie, WatchedSeries
from .serializers import (
    WatchedEpisodeSerializer, WatchedMovieSerializer, WatchedSeriesSerializer
)
import requests


EPISODES_URL = "http://127.0.0.1:8000/episodes/"
MOVIES_URL = "http://127.0.0.1:8000/movies/"
SERIES_URL = "http://127.0.0.1:8000/series/"
USERS_URL = "http://127.0.0.1:8001/users/"


def get_contents_url(contents_url, user):
    favorite_genre_ids = user['favorite_genre_ids']
    if not favorite_genre_ids:
        return contents_url
    return f"{contents_url}?genre_ids={favorite_genre_ids}"


def get_id_filter(id_name, id_value):
    if not id_value:
        return Q()
    try:
        id_value = int(id_value)
    except ValueError:
        raise ValidationError({
            id_name: "A valid integer is required."
        })
    return Q(**{id_name: id_value})


def get_recommended_content_ids(
    contents_name, contents_url, id_key, model, user_id
):
    try:
        response = requests.get(contents_url)
    except requests.RequestException as e:
        raise ValidationError(
            f"Error retrieving {contents_name} from {contents_url}: {str(e)}."
        )
    if response.status_code != status.HTTP_200_OK:
        raise ValidationError(
            f"Error retrieving {contents_name} from {contents_url}. "
            f"Status code: {response.status_code}."
        )
    contents = response.json()
    content_ids = set(content["id"] for content in contents)
    watched_content_ids = set(
        model.objects.filter(user_id=user_id).values_list(id_key, flat=True)
    )
    recommended_content_ids = list(content_ids - watched_content_ids)
    return recommended_content_ids


def get_required_id(id_name, id_value):
    if not id_value:
        raise ValidationError({id_name: "This field is required."})
    try:
        return int(id_value)
    except ValueError:
        raise ValidationError({id_name: "A valid integer is required."})


def get_user_data(user_id):
    user_url = f"{USERS_URL}{user_id}"
    try:
        response = requests.get(user_url)
    except requests.RequestException as e:
        raise ValidationError(
            f"Error retrieving User from {user_url}: {str(e)}."
        )
    if response.status_code not in {
        status.HTTP_200_OK, status.HTTP_404_NOT_FOUND
    }:
        raise ValidationError(
            f"Error retrieving User from {user_url}. "
            f"Status code: {response.status_code}."
        )
    if response.status_code == status.HTTP_404_NOT_FOUND:
        raise ValidationError({
            "user_id": f"Invalid pk \"{user_id}\" - object does not exist."
        })
    return response.json()


class RecommendedContentViewSet(viewsets.ViewSet):
    contents_name = None
    contents_url = None
    id_key = None
    model = None

    def list(self, request):
        user_id = request.query_params.get("user_id")
        user_id = get_required_id("user_id", user_id)
        user = get_user_data(user_id)
        contents_url = get_contents_url(self.contents_url, user)
        recommended_content_ids = get_recommended_content_ids(
            self.contents_name, contents_url, self.id_key, self.model, user_id
        )
        return Response(recommended_content_ids, status=status.HTTP_200_OK)


class RecommendedEpisodesViewSet(RecommendedContentViewSet):
    contents_name = "Episodes"
    contents_url = EPISODES_URL
    id_key = "episode_id"
    model = WatchedEpisode


class RecommendedMoviesViewSet(RecommendedContentViewSet):
    contents_name = "Movies"
    contents_url = MOVIES_URL
    id_key = "movie_id"
    model = WatchedMovie


class RecommendedSeriesViewSet(RecommendedContentViewSet):
    contents_name = "Series"
    contents_url = SERIES_URL
    id_key = "series_id"
    model = WatchedSeries


class WatchedContentViewSet(viewsets.ModelViewSet):
    id_key = None
    queryset = None
    serializer_class = None

    def list(self, request):
        content_id = request.query_params.get(self.id_key)
        filters = get_id_filter(self.id_key, content_id)
        user_id = request.query_params.get("user_id")
        filters &= get_id_filter("user_id", user_id)
        watched_episodes = self.queryset.filter(filters)
        serializer = self.serializer_class(watched_episodes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request):
        content_id = request.query_params.get(self.id_key)
        content_id = get_required_id(self.id_key, content_id)
        user_id = request.query_params.get("user_id")
        user_id = get_required_id("user_id", user_id)
        try:
            watched_content = self.queryset.get(
                **{self.id_key: content_id, "user_id": user_id}
            )
        except self.queryset.model.DoesNotExist:
            raise ValidationError(
                f"No {self.queryset.model._meta.verbose_name} "
                "matches the given query."
            )
        watched_content.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WatchedEpisodeViewSet(WatchedContentViewSet):
    id_key = "episode_id"
    queryset = WatchedEpisode.objects.all()
    serializer_class = WatchedEpisodeSerializer


class WatchedMovieViewSet(WatchedContentViewSet):
    id_key = "movie_id"
    queryset = WatchedMovie.objects.all()
    serializer_class = WatchedMovieSerializer


class WatchedSeriesViewSet(WatchedContentViewSet):
    id_key = "series_id"
    queryset = WatchedSeries.objects.all()
    serializer_class = WatchedSeriesSerializer
