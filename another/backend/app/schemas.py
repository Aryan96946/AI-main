from marshmallow import Schema, fields

class RegisterSchema(Schema):
    fullname = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    role = fields.Str(missing="student")

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class ProfileSchema(Schema):
    age = fields.Int()
    gender = fields.Str()
    attendance = fields.Float()
    gpa = fields.Float()
    assignments_completed = fields.Int()
    warnings = fields.Int()
    notes = fields.Str()
