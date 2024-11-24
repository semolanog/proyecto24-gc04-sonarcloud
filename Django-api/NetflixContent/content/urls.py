from django.urls import path
from .views import GenreViewSet, SeriesViewSet


urlpatterns = [
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
        "series/",
        SeriesViewSet.as_view({"post": "create"}),
        name="series-list"
    )
]
