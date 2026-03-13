"""Fix teacher fields (department, subject)

Revision ID: 22c6b2419cf5
Revises:
Create Date: 2025-10-31 09:08:15.959277
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = '22c6b2419cf5'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # inspector to check existing columns
    bind = op.get_bind()
    insp = inspect(bind)
    columns = [col['name'] for col in insp.get_columns('teacher_details')]

    with op.batch_alter_table('teacher_details') as batch_op:
        if 'subject' not in columns:
            batch_op.add_column(sa.Column('subject', sa.String(length=100), nullable=True))

        if 'department' not in columns:
            batch_op.add_column(sa.Column('department', sa.String(length=100), nullable=True))

def downgrade():
    with op.batch_alter_table('teacher_details') as batch_op:
        batch_op.drop_column('subject')
        batch_op.drop_column('department')
