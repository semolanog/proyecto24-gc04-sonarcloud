# Generated by Django 5.1.3 on 2024-11-23 12:20

import django.core.validators
import django.db.models.deletion
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(help_text='The name of the genre.', max_length=255)),
            ],
            options={
                'verbose_name': 'Genre',
                'verbose_name_plural': 'Genres',
            },
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('description', models.TextField(help_text='The brief summary or synopsis of the content.')),
                ('directors', models.CharField(help_text='The name(s) of the director(s) of the content.', max_length=255)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('main_actors', models.CharField(help_text='The name(s) of the main actor(s) in the content.', max_length=255)),
                ('rating', models.DecimalField(decimal_places=2, help_text='The rating of the content on a scale from 0.00 to 10.00.', max_digits=4, validators=[django.core.validators.MaxValueValidator(Decimal('10.00')), django.core.validators.MinValueValidator(Decimal('0.00'))])),
                ('release_date', models.DateField(help_text='The release date of the content.')),
                ('title', models.CharField(help_text='The title or name of the content.', max_length=255)),
                ('duration', models.PositiveIntegerField(help_text='The total runtime of the movie, in minutes.')),
                ('thumbnail_url', models.URLField(help_text='The URL of the thumbnail image representing the movie.')),
                ('genre_ids', models.ManyToManyField(help_text='The genre ids related to the content.', to='content.genre')),
            ],
            options={
                'verbose_name': 'Movie',
                'verbose_name_plural': 'Movies',
            },
        ),
        migrations.CreateModel(
            name='Series',
            fields=[
                ('description', models.TextField(help_text='The brief summary or synopsis of the content.')),
                ('directors', models.CharField(help_text='The name(s) of the director(s) of the content.', max_length=255)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('main_actors', models.CharField(help_text='The name(s) of the main actor(s) in the content.', max_length=255)),
                ('rating', models.DecimalField(decimal_places=2, help_text='The rating of the content on a scale from 0.00 to 10.00.', max_digits=4, validators=[django.core.validators.MaxValueValidator(Decimal('10.00')), django.core.validators.MinValueValidator(Decimal('0.00'))])),
                ('release_date', models.DateField(help_text='The release date of the content.')),
                ('title', models.CharField(help_text='The title or name of the content.', max_length=255)),
                ('end_date', models.DateField(blank=True, help_text='The date when the series ended, or null if ongoing.', null=True)),
                ('episode_average_duration', models.PositiveIntegerField(help_text='The average duration of its episodes, in minutes.')),
                ('seasons', models.PositiveIntegerField(help_text='The total number of seasons in the series.')),
                ('thumbnail_url', models.URLField(help_text='The URL of the thumbnail image representing the series.')),
                ('genre_ids', models.ManyToManyField(help_text='The genre ids related to the content.', to='content.genre')),
            ],
            options={
                'verbose_name': 'Series',
                'verbose_name_plural': 'Series',
            },
        ),
        migrations.CreateModel(
            name='Episode',
            fields=[
                ('description', models.TextField(help_text='The brief summary or synopsis of the content.')),
                ('directors', models.CharField(help_text='The name(s) of the director(s) of the content.', max_length=255)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('main_actors', models.CharField(help_text='The name(s) of the main actor(s) in the content.', max_length=255)),
                ('rating', models.DecimalField(decimal_places=2, help_text='The rating of the content on a scale from 0.00 to 10.00.', max_digits=4, validators=[django.core.validators.MaxValueValidator(Decimal('10.00')), django.core.validators.MinValueValidator(Decimal('0.00'))])),
                ('release_date', models.DateField(help_text='The release date of the content.')),
                ('title', models.CharField(help_text='The title or name of the content.', max_length=255)),
                ('duration', models.PositiveIntegerField(help_text='The total runtime of the content, in minutes.')),
                ('episode_number', models.PositiveIntegerField(help_text="The episode's number within its season.")),
                ('season_number', models.PositiveIntegerField(help_text='The season number to which the episode belongs.')),
                ('genre_ids', models.ManyToManyField(help_text='The genre ids related to the content.', to='content.genre')),
                ('series_id', models.ForeignKey(help_text='The id of the series the episode belongs to.', on_delete=django.db.models.deletion.CASCADE, to='content.series')),
            ],
            options={
                'verbose_name': 'Episode',
                'verbose_name_plural': 'Episodes',
            },
        ),
    ]
