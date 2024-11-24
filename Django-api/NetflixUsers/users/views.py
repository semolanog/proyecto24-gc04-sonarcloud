from rest_framework import viewsets
from .models import PaymentMethod, User
from .serializers import PaymentMethodSerializer, UserSerializer


class PaymentMethodViewSet(viewsets.ModelViewSet):
    lookup_field = "id"
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer


class UserViewSet(viewsets.ModelViewSet):
    lookup_field = "id"
    queryset = User.objects.all()
    serializer_class = UserSerializer
