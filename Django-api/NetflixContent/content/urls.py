from django.urls import path
from .views import EpisodeViewSet, GenreViewSet, MovieViewSet, SeriesViewSet


urlpatterns = [
    path(
        "episodes/",
        EpisodeViewSet.as_view({"get": "list", "post": "create"}),
        name="episode-list"
    ),
    path(
        "episodes/<int:id>/",
        EpisodeViewSet.as_view({
            "get": "retrieve", "put": "update", "delete": "destroy"
        }),
        name="episode-detail"
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
        MovieViewSet.as_view({"get": "list", "post": "create"}),
        name="movie-list"
    ),
    path(
        "movies/<int:id>/",
        MovieViewSet.as_view({
            "get": "retrieve", "put": "update", "delete": "destroy"
        }),
        name="movie-detail"
    ),
    path(
        "series/",
        SeriesViewSet.as_view({"get": "list", "post": "create"}),
        name="series-list"
    ),
    path(
        "series/<int:id>/",
        SeriesViewSet.as_view({
            "get": "retrieve", "put": "update", "delete": "destroy"
        }),
        name="series-detail"
    )
]
