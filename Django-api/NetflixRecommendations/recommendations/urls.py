from django.urls import path
from .views import (
    RecommendedEpisodesViewSet, RecommendedMoviesViewSet,
    RecommendedSeriesViewSet, WatchedEpisodeViewSet, WatchedMovieViewSet,
    WatchedSeriesViewSet
)


urlpatterns = [
    path(
        "recommended-episodes/",
        RecommendedEpisodesViewSet.as_view({"get": "list"}),
        name="recommended-episode-list"
    ),
    path(
        "recommended-movies/",
        RecommendedMoviesViewSet.as_view({"get": "list"}),
        name="recommended-movies-list"
    ),
    path(
        "recommended-series/",
        RecommendedSeriesViewSet.as_view({"get": "list"}),
        name="recommended-series-list"
    ),
    path(
        "watched-episodes/",
        WatchedEpisodeViewSet.as_view({
            "get": "list", "post": "create", "delete": "destroy"
        }),
        name="watched-episode-list"
    ),
    path(
        "watched-movies/",
        WatchedMovieViewSet.as_view({
            "get": "list", "post": "create", "delete": "destroy"
        }),
        name="watched-movie-list"
    ),
    path(
        "watched-series/",
        WatchedSeriesViewSet.as_view({
            "get": "list", "post": "create", "delete": "destroy"
        }),
        name="watched-series-list"
    )
]
