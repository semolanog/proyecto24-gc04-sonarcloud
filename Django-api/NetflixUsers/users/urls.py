from django.urls import path
from .views import PaymentMethodViewSet, UserViewSet

urlpatterns = [
    path(
        "payment-methods/",
        PaymentMethodViewSet.as_view({"get": "list", "post": "create"}),
        name="payment-method-list"
    ),
    path(
        "payment-methods/<int:id>/",
        PaymentMethodViewSet.as_view({
            "get": "retrieve", "put": "update", "delete": "destroy"
        }),
        name="payment-method-detail"
    ),
    path(
        "users/",
        UserViewSet.as_view({"post": "create"}),
        name="user-list"
    )
]
