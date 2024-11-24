from django.db import models


class PaymentMethod(models.Model):
    PAYMENT_TYPE_CHOICES = [
        ("bank_transfer", "Bank Transfer"),
        ("credit_card", "Credit Card"),
        ("cryptocurrency", "Cryptocurrency"),
        ("debit_card", "Debit Card"),
        ("paypal", "PayPal"),
    ]

    active = models.BooleanField(
        default=True,
        help_text="Indicates whether the payment method is currently active."
    )
    details = models.CharField(
        help_text=(
            "Secure details for the payment method, "
            "such as a token or card number."
        ),
        max_length=255
    )
    expiration_date = models.DateField(
        help_text="The expiration date of the payment method."
    )
    id = models.AutoField(primary_key=True)
    type = models.CharField(
        choices=PAYMENT_TYPE_CHOICES,
        help_text="The type of the payment method.",
        max_length=14
    )

    class Meta:
        verbose_name = "PaymentMethod"
        verbose_name_plural = "PaymentMethods"

    def __str__(self):
        return f"PaymentMethod(id={self.id})"


class User(models.Model):
    admin = models.BooleanField(
        default=False,
        help_text="Indicates whether the user has admin permissions."
    )
    email = models.EmailField(
        help_text="The user's email address.", unique=True
    )
    favorite_genre_ids = models.TextField(
        blank=True,
        help_text=(
            "The ids for the user's favorite genres; "
            "may be null if no genres are defined."
        ),
        null=True
    )
    id = models.AutoField(primary_key=True)
    name = models.CharField(help_text="The user's full name.", max_length=255)
    password = models.CharField(
        help_text="The user's password.", max_length=128
    )
    payment_method_ids = models.ManyToManyField(
        PaymentMethod,
        blank=True,
        help_text="The ids of the payment methods related to the user."
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"User(id={self.id})"
