from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import PaymentMethod, User
from .serializers import PaymentMethodSerializer, UserSerializer


def get_email_filter(email):
    if not email:
        return Q()
    return Q(email=email)


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
