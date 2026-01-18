"""Rename acodemic_score to academic_score

Revision ID: 9876a5762856
Revises: 22c6b2419cf5
Create Date: 2025-12-07 14:28:06.465667

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '9876a5762856'
down_revision = '22c6b2419cf5'
branch_labels = None
depends_on = None


def upgrade():
    # The schema is already correct from the initial migration
    # This migration was originally designed for an existing database
    # No changes needed since initial migration created the correct schema
    pass


def downgrade():
    # No-op since the schema is the same
    pass

