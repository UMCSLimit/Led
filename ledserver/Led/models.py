# -*- coding: utf-8 -*-
from django.db import models

from django.db.models.aggregates import Count
from random import randint

class Type(models.Model):
    app = models.CharField(max_length=20,verbose_name="Typ aplikacji")
    def __str__(self):
        return self.app

class Lang(models.Model):
    lang = models.CharField(max_length=20,verbose_name="Rozszerzenie pliku")
    def __str__(self):
        return self.lang

class Animation(models.Model):
    name = models.CharField(max_length=30,unique=True,verbose_name="Nazwa")
    author = models.CharField(max_length=30,verbose_name="Autor kodu")
    date = models.DateTimeField(auto_now_add=True, blank=True, verbose_name="Data dodania")
    description = models.CharField(max_length=200, unique=False, blank=True, verbose_name="Opis")
    code = models.TextField(max_length=10000,unique=False,verbose_name="Kod")
    approved = models.BooleanField(null=True, default=False,blank=True,verbose_name="Status zatwierdzenia")
    date_approved = models.DateField(null=True, blank=True,verbose_name="Data zatwierdzenia")
    id_lang = models.ForeignKey(Lang,on_delete=models.CASCADE)
    id_type = models.ForeignKey(Type,on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    def get_random():
        return Animation.objects.filter(approved=True).order_by("?").first()


class Example(models.Model):
    id_animation = models.ForeignKey(Animation,on_delete=models.DO_NOTHING)
    def __str__(self):
        return str(self.id_animation)