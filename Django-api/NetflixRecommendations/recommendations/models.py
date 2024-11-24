from django.db import models


class WatchedEpisode(models.Model):
    episode_id = models.IntegerField(
        help_text="The id of the episode that was watched."
    )
    user_id = models.IntegerField(
        help_text="The id of the user who watched the episode."
    )

    class Meta:
        unique_together = ("episode_id", "user_id")
        verbose_name = "WatchedEpisode"
        verbose_name_plural = "WatchedEpisodes"

    def __str__(self):
        return (
            f"WatchedEpisode(episode_id={self.episode_id}, "
            f"user_id={self.user_id})"
        )


class WatchedMovie(models.Model):
    movie_id = models.IntegerField(
        help_text="The id of the movie that was watched."
    )
    user_id = models.IntegerField(
        help_text="The id of the user who watched the movie."
    )

    class Meta:
        unique_together = ("movie_id", "user_id")
        verbose_name = "WatchedMovie"
        verbose_name_plural = "WatchedMovies"

    def __str__(self):
        return (
            f"WatchedMovie(movie_id={self.movie_id}, user_id={self.user_id})"
        )


class WatchedSeries(models.Model):
    series_id = models.IntegerField(
        help_text="The id of the series that was watched."
    )
    user_id = models.IntegerField(
        help_text="The id of the user who watched the series."
    )

    class Meta:
        unique_together = ("series_id", "user_id")
        verbose_name = "WatchedSeries"
        verbose_name_plural = "WatchedSeries"

    def __str__(self):
        return (
            f"WatchedSeries(series_id={self.series_id}, "
            f"user_id={self.user_id})"
        )
