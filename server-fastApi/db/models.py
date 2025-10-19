from tortoise import fields
from tortoise.models import Model

class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=64, unique=True, description="username")
    email = fields.CharField(max_length=255, unique=True, description="email")
    password = fields.CharField(max_length=255, description="password_hash")
    created_at = fields.DatetimeField()

    class Meta:
        table = "users"
        indexes = ("email",)