from decimal import Decimal
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Genre(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(help_text="The name of the genre.", max_length=255)

    class Meta:
        verbose_name = "Genre"
        verbose_name_plural = "Genres"

    def __str__(self):
        return f"Genre(id={self.id})"


class Content(models.Model):
    description = models.TextField(
        help_text="The brief summary or synopsis of the content."
    )
    directors = models.CharField(
        help_text="The name(s) of the director(s) of the content.", 
        max_length=255
    )
    genre_ids = models.ManyToManyField(
        "Genre", help_text="The genre ids related to the content."
    )
    id = models.AutoField(primary_key=True)
    main_actors = models.CharField(
        help_text="The name(s) of the main actor(s) in the content.",
        max_length=255
    )
    rating = models.DecimalField(
        decimal_places=2,
        help_text="The rating of the content on a scale from 0.00 to 10.00.",
        max_digits=4,
        validators=[
            MaxValueValidator(Decimal("10.00")),
            MinValueValidator(Decimal("0.00"))
        ]
    )
    release_date = models.DateField(
        help_text="The release date of the content."
    )
    title = models.CharField(
        help_text="The title or name of the content.", max_length=255
    )

    class Meta:
        abstract = True


class Episode(Content):
    duration = models.PositiveIntegerField(
        help_text="The total runtime of the content, in minutes."
    )
    episode_number = models.PositiveIntegerField(
        help_text="The episode's number within its season."
    )
    season_number = models.PositiveIntegerField(
        help_text="The season number to which the episode belongs."
    )
    series_id = models.ForeignKey(
        "Series",
        help_text="The id of the series the episode belongs to.",
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Episode"
        verbose_name_plural = "Episodes"

    def __str__(self):
        return f"Episode(id={self.id})"


class Movie(Content):
    duration = models.PositiveIntegerField(
        help_text="The total runtime of the movie, in minutes."
    )
    thumbnail_url = models.URLField(
        help_text="The URL of the thumbnail image representing the movie."
    )

    class Meta:
        verbose_name = "Movie"
        verbose_name_plural = "Movies"

    def __str__(self):
        return f"Movie(id={self.id})"


class Series(Content):
    end_date = models.DateField(
        blank=True,
        help_text="The date when the series ended, or null if ongoing.",
        null=True
    )
    episode_average_duration = models.PositiveIntegerField(
        help_text="The average duration of its episodes, in minutes."
    )
    seasons = models.PositiveIntegerField(
        help_text="The total number of seasons in the series."
    )
    thumbnail_url = models.URLField(
        help_text="The URL of the thumbnail image representing the series."
    )

    class Meta:
        verbose_name = "Series"
        verbose_name_plural = "Series"

    def __str__(self):
        return f"Series(id={self.id})"
