from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .models import Genre, Series
from .serializers import GenreSerializer, SeriesSerializer
import requests


USERS_URL = "http://127.0.0.1:8001/users/"
WATCHED_SERIES_URL = "http://127.0.0.1:8002/watched-series/"


def get_search_filter(search):
    if not search:
        return Q()
    return Q(title__icontains=search)


def get_users_data():
    try:
        response = requests.get(USERS_URL)
    except requests.RequestException as e:
        raise ValidationError(
            f"Error retrieving Users from {USERS_URL}: {str(e)}."
        )
    if response.status_code != status.HTTP_200_OK:
        raise ValidationError(
            f"Error retrieving Users from {USERS_URL}. "
            f"Status code: {response.status_code}."
        )
    users = response.json()
    return users


class GenreViewSet(viewsets.ModelViewSet):
    lookup_field = "id"
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

    def list(self, request):
        search = request.query_params.get("search")
        filters = get_search_filter(search)
        filtered_genres = self.queryset.filter(filters).order_by("name")
        serializer = self.serializer_class(filtered_genres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        users = get_users_data()
        genre_to_destroy_id = str(self.get_object().id)
        for user in users:
            favorite_genre_ids = set(user["favorite_genre_ids"].split(","))
            if genre_to_destroy_id in favorite_genre_ids:
                favorite_genre_ids.discard(genre_to_destroy_id)
                user["favorite_genre_ids"] = ",".join(favorite_genre_ids)
                user_to_update_url = f"{USERS_URL}{user['id']}/"
                try:
                    response = requests.put(user_to_update_url, json=user)
                except requests.RequestException as e:
                    raise ValidationError(
                        f"Error updating User at {user_to_update_url}: "
                        f"{str(e)}."
                    )
                if response.status_code != status.HTTP_200_OK:
                    raise ValidationError(
                        f"Error updating User at {user_to_update_url}. "
                        f"Status code: {response.status_code}."
                    )
        return super().destroy(request, *args, **kwargs)


class RatingOrderedContentViewSet(viewsets.ModelViewSet):
    content_name = None
    contents_name = None
    id_key = None
    lookup_field = "id"
    queryset = None
    serializer_class = None
    watched_contents_url = None


class SeriesViewSet(RatingOrderedContentViewSet):
    content_name = "Series"
    contents_name = "Series"
    id_key = "series_id"
    lookup_field = "id"
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer
    watched_contents_url = WATCHED_SERIES_URL
