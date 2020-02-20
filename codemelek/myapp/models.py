from django.db import models


class Answers(models.Model):
    answer = models.CharField(max_length=100)


class Questions(models.Model):
    question = models.CharField(max_length=100)
    answers = models.ForeignKey(Answers, on_delete=models.PROTECT)


class Game(models.Model):
    pincode = models.CharField(max_length=6)

    def __str__(self):
        return "Game: pincode: " + self.pincode
