from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.UUIDField(pk=True)
    username = fields.CharField(max_length=64, unique=True, description="username")
    email = fields.CharField(max_length=255, unique=True, description="email")
    password = fields.CharField(max_length=255, description="password_hash")
    created_at = fields.DatetimeField()

    class Meta:
        table = "users"
        indexes = ("email",)


# class Record(Model):
#     id = fields.UUIDField(pk=True)
#     user_id = fields.ForeignKeyField("models.User", description="user_id")
#     types = fields.CharField(max_length=1000, description="type of record")
#     amount = fields.FloatField(description="amount")
#     detail = fields.CharField(max_length=10000, description="detail")
#     created_at = fields.DatetimeField(auto_now_add=True)
#     last_updated = fields.DatetimeField(auto_now=True)

#     class Meta:
#         table = "records"
#         indexes = ("user_id", "created_at")
