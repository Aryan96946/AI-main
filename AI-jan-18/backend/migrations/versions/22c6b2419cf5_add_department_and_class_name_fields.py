"""Fix teacher fields (department, subject)

Revision ID: 22c6b2419cf5
Revises: 000000000000
Create Date: 2025-10-31 09:08:15.959277
"""

from alembic import op
import sqlalchemy as sa

revision = '22c6b2419cf5'
down_revision = '000000000000'
branch_labels = None
depends_on = None

def upgrade():
    # The columns are already added in the initial migration
    # This migration was originally intended to add them if missing
    # Since we're creating from scratch, these columns already exist
    pass

def downgrade():
    # No-op since columns are part of the base schema
    pass

