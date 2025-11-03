from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.UUIDField(pk=True)
    username = fields.CharField(max_length=64, unique=True, description="username")
    email = fields.CharField(max_length=255, unique=True, description="email")
    password = fields.CharField(max_length=255, description="password_hash")
    created_at = fields.DatetimeField(auto_now_add=True, timestamptz=True)

    class Meta:
        table = "users"
        indexes = ("email",)


class Transactions(Model):
    id = fields.UUIDField(pk=True)
    user_id = fields.CharField(max_length=255, description="owner")
    amout = fields.FloatField(description="amount")
    type = fields.CharField(max_length=255, description="type of record")
    detail = fields.CharField(max_length=10**4, description="detail")
    tag = fields.CharField(max_length=255, description="tag")
    lastest_edit = fields.DatetimeField(auto_now=True, timestamptz=True)
    created_at = fields.DatetimeField(auto_now_add=True, timestamptz=True)

    class Meta:
        table = "transactions"
        indexes = ("user_id", "created_at")


class Financial(Model):
    user_id = fields.TextField(pk=True)
    daily_spending_limit = fields.FloatField(description="daily spending limit")
    monthly_income = fields.FloatField(description="monthly income")
    notify_over_budget = fields.BooleanField(description="notify over budget", default=False)
    notify_low_saving = fields.BooleanField(description="notify low saving", default=False)
    goal_description = fields.CharField(max_length=10**4, description="goal description")
    conclusion_routine = fields.CharField(max_length=10**4, description="conclusion routine")
    update_at = fields.DatetimeField(auto_now=True, timestamptz=True)

    class Meta:
        table = "users_setting"
        indexes = ("user_id",)
