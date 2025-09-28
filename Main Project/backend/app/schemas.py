# backend/app/schemas.py
from marshmallow import Schema, fields, validate

class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    role = fields.Str(validate=validate.OneOf(['admin','counselor','student']), missing='student')

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class PredictSchema(Schema):
    student_id = fields.Int(required=True)
    features = fields.Dict(required=True)

class CounselingSchema(Schema):
    student_id = fields.Int(required=True)
    notes = fields.Str(required=True)
    outcome = fields.Str()
