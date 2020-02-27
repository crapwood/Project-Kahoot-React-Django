from django.urls import path
from . import views

app_name = 'myapp'
urlpatterns = [
    path('', views.index, name='index'),
    path('create/', views.create, name='createpage'),
    path('join/', views.join, name='joinpage'),
    path('quiz/', views.quiz, name='questionspage'),
    path('participants/', views.participants, name='participantspage'),
    path('games/', views.games_on_play, name='game_rooms_onPlay'),
    path('onanswer/', views.on_answer, name='on_answer'),
    path('next/', views.next, name='next_question'),
]
