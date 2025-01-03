# Generated by Django 5.1.3 on 2024-11-23 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WatchedEpisode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('episode_id', models.IntegerField(help_text='The id of the episode that was watched.')),
                ('user_id', models.IntegerField(help_text='The id of the user who watched the episode.')),
            ],
            options={
                'verbose_name': 'WatchedEpisode',
                'verbose_name_plural': 'WatchedEpisodes',
                'unique_together': {('episode_id', 'user_id')},
            },
        ),
        migrations.CreateModel(
            name='WatchedMovie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('movie_id', models.IntegerField(help_text='The id of the movie that was watched.')),
                ('user_id', models.IntegerField(help_text='The id of the user who watched the movie.')),
            ],
            options={
                'verbose_name': 'WatchedMovie',
                'verbose_name_plural': 'WatchedMovies',
                'unique_together': {('movie_id', 'user_id')},
            },
        ),
        migrations.CreateModel(
            name='WatchedSeries',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('series_id', models.IntegerField(help_text='The id of the series that was watched.')),
                ('user_id', models.IntegerField(help_text='The id of the user who watched the series.')),
            ],
            options={
                'verbose_name': 'WatchedSeries',
                'verbose_name_plural': 'WatchedSeries',
                'unique_together': {('series_id', 'user_id')},
            },
        ),
    ]
