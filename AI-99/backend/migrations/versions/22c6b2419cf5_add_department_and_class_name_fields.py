"""Fix teacher fields (department, subject)

Revision ID: 22c6b2419cf5
Revises:
Create Date: 2025-10-31 09:08:15.959277
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, ForeignKey
from sqlalchemy.types import Integer, String

revision = '22c6b2419cf5'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    insp = inspect(bind)
    
    # Check if table exists
    try:
        columns = [col['name'] for col in insp.get_columns('teacher_details')]
        table_exists = True
    except Exception:
        table_exists = False

    if not table_exists:
        # Create full teacher_details table matching models.py
        op.create_table('teacher_details',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
            sa.Column('full_name', sa.String(length=256), nullable=False),
            sa.Column('employee_id', sa.String(length=50), nullable=False),
            sa.Column('subject', sa.String(length=100), nullable=False),
            sa.Column('department', sa.String(length=100), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
    else:
        # Alter existing table - add missing columns matching model
        with op.batch_alter_table('teacher_details', schema=None) as batch_op:
            if 'subject' not in columns:
                batch_op.add_column(sa.Column('subject', sa.String(length=100), nullable=False))
            if 'department' not in columns:
                batch_op.add_column(sa.Column('department', sa.String(length=100), nullable=False))
            # Add other model fields if missing
            if 'full_name' not in columns:
                batch_op.add_column(sa.Column('full_name', sa.String(length=256), nullable=False))
            if 'employee_id' not in columns:
                batch_op.add_column(sa.Column('employee_id', sa.String(length=50), nullable=False))

def downgrade():
    with op.batch_alter_table('teacher_details', schema=None) as batch_op:
        batch_op.drop_column('subject')
        batch_op.drop_column('department')
        batch_op.drop_column('full_name')
        batch_op.drop_column('employee_id')
