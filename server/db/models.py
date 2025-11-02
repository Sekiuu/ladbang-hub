from tortoise import fields
from tortoise.models import Model

class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=64, unique=True, description="username")
    email = fields.CharField(max_length=255, unique=True, description="email")
    password = fields.CharField(max_length=255, description="password_hash")
    created_at = fields.DatetimeField(auto_now_add=True, timestamptz=True)

    class Meta:
        table = "users"
        indexes = ("email",)

class Record(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", description="owner")
    amout = fields.FloatField(description="amount")
    type = fields.CharField(max_length=255, description="type of record")
    detail = fields.CharField(max_length=10**4, description="detail")
    tag = fields.CharField(max_length=255, description="tag")
    last_edit = fields.DatetimeField(auto_now=True, timestamptz=True)
    created_at = fields.DatetimeField(auto_now_add=True, timestamptz=True)

    class Meta:
        table = "records"
        indexes = ("user_id", "created_at")
