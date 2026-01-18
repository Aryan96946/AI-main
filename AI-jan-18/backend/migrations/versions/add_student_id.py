"""add student_id column to students table

Revision ID: add_student_id
Revises: 9876a5762856
Create Date: 2025-12-07 16:57:26.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_student_id'
down_revision = '9876a5762856'
branch_labels = None
depends_on = None


def upgrade():
    # The student_id column already exists from the initial migration
    pass


def downgrade():
    # No-op since we don't want to remove the column
    pass

