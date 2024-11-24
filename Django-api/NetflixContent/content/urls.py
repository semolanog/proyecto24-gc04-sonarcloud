from django.urls import path
from .views import EpisodeViewSet, GenreViewSet, MovieViewSet, SeriesViewSet


urlpatterns = [
    path(
        "episodes/",
        EpisodeViewSet.as_view({"post": "create"}),
        name="episode-list"
    ),
    path(
        "genres/",
        GenreViewSet.as_view({"get": "list", "post": "create"}),
        name="genre-list"
    ),
    path(
        "genres/<int:id>/",
        GenreViewSet.as_view({
            "get": "retrieve", "put": "update", "delete": "destroy"
        }),
        name="genre-detail"
    ),
    path(
        "movies/",
        MovieViewSet.as_view({"post": "create"}),
        name="movie-list"
    ),
    path(
        "series/",
        SeriesViewSet.as_view({"get": "list", "post": "create"}),
        name="series-list"
    ),
    path(
        "series/<int:id>/",
        SeriesViewSet.as_view({"get": "retrieve", "put": "update"}),
        name="series-detail"
    )
]
