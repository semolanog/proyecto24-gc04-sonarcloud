from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .models import PaymentMethod, User
from .serializers import PaymentMethodSerializer, UserSerializer
import requests


WATCHED_EPISODES_URL = "http://127.0.0.1:8002/watched-episodes/"
WATCHED_MOVIES_URL = "http://127.0.0.1:8002/watched-movies/"
WATCHED_SERIES_URL = "http://127.0.0.1:8002/watched-series/"


def get_email_filter(email):
    if not email:
        return Q()
    return Q(email=email)


def destroy_related_watched_contents(
        content_name, contents_name, id_key, watched_contents_url
):
    try:
        response = requests.get(watched_contents_url)
    except requests.RequestException as e:
        raise ValidationError(
            f"Error retrieving Watched{contents_name} "
            f"from {watched_contents_url}: {str(e)}."
        )
    if response.status_code != status.HTTP_200_OK:
        raise ValidationError(
            f"Error retrieving Watched{contents_name} from "
            f"{watched_contents_url}. Status code: {response.status_code}."
        )
    watched_contents_to_destroy = response.json()
    for watched_content_to_destroy in watched_contents_to_destroy:
        watched_content_to_destroy_url = (
            f"{watched_contents_url}&{id_key}="
            f"{watched_content_to_destroy[id_key]}"
        )
        try:
            response = requests.delete(watched_content_to_destroy_url)
        except requests.RequestException as e:
            raise ValidationError(
                f"Error deleting Watched{content_name} at "
                f"{watched_content_to_destroy_url}: {str(e)}."
            )
        if response.status_code != status.HTTP_204_NO_CONTENT:
            raise ValidationError(
                f"Error deleting Watched{content_name} at "
                f"{watched_content_to_destroy_url}. "
                f"Status code: {response.status_code}."
            )


class PaymentMethodViewSet(viewsets.ModelViewSet):
    lookup_field = "id"
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer


class UserViewSet(viewsets.ModelViewSet):
    lookup_field = "id"
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        email = request.query_params.get("email")
        filters = get_email_filter(email)
        filtered_users = self.queryset.filter(filters)
        serializer = self.serializer_class(filtered_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        id = self.get_object().id
        url = f"{WATCHED_EPISODES_URL}?user_id={id}"
        destroy_related_watched_contents(
            "Episode", "Episodes", "episode_id", url
        )
        url = f"{WATCHED_MOVIES_URL}?user_id={id}"
        destroy_related_watched_contents("Movie", "Movies", "movie_id", url)
        url = f"{WATCHED_SERIES_URL}?user_id={id}"
        destroy_related_watched_contents("Series", "Series", "series_id", url)
        return super().destroy(request, *args, **kwargs)
