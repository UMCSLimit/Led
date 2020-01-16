from django.db import models

# Create your models here.

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
    date = models.DateTimeField(verbose_name="Data dodania")
    code = models.CharField(max_length=10000,unique=True,verbose_name="Kod")
    approved = models.BooleanField(default=False,verbose_name="Status zatwierdzenia")
    date_approved = models.DateField(verbose_name="Data zatwierdzenia")
    id_lang = models.ForeignKey(Lang,on_delete=models.CASCADE)
    id_type = models.ForeignKey(Type,on_delete=models.CASCADE)
    def __str__(self):
        return self.name

