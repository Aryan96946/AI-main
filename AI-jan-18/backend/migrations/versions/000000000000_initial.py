"""Initial migration - create all tables

Revision ID: 000000000000
Revises: 
Create Date: 2025-01-18 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '000000000000'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('username', sa.String(128), nullable=True),
        sa.Column('email', sa.String(150), nullable=False),
        sa.Column('password_hash', sa.String(256), nullable=True),
        sa.Column('role', mysql.ENUM('student', 'teacher', 'admin', name='user_roles'), nullable=False),
        sa.Column('verified', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('otp_code', sa.String(6), nullable=True),
        sa.Column('otp_expiry', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    
    # Create audit_logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(255), nullable=True),
        sa.Column('target_id', sa.Integer(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create students table
    op.create_table(
        'students',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('student_id', sa.String(50), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(256), nullable=False),
        sa.Column('assignments_completed', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('behavior_score', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('course', sa.String(100), nullable=True),
        sa.Column('gender', sa.String(10), nullable=True),
        sa.Column('marital_status', sa.String(50), nullable=True),
        sa.Column('application_mode', sa.String(50), nullable=True),
        sa.Column('age_at_enrollment', sa.Integer(), nullable=True),
        sa.Column('scholarship_holder', sa.String(10), nullable=True),
        sa.Column('debtor', sa.String(10), nullable=True),
        sa.Column('tuition_fees_up_to_date', sa.String(10), nullable=True),
        sa.Column('cu1_enrolled', sa.Integer(), nullable=True),
        sa.Column('cu1_approved', sa.Integer(), nullable=True),
        sa.Column('cu1_grade', sa.Float(), nullable=True),
        sa.Column('cu2_enrolled', sa.Integer(), nullable=True),
        sa.Column('cu2_approved', sa.Integer(), nullable=True),
        sa.Column('cu2_grade', sa.Float(), nullable=True),
        sa.Column('attendance', sa.Float(), nullable=True),
        sa.Column('avg_score', sa.Float(), nullable=True),
        sa.Column('grade', sa.String(10), nullable=True),
        sa.Column('additional_info', sa.Text(), nullable=True),
        sa.Column('academic_score', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('student_id')
    )
    
    # Create teacher_details table
    op.create_table(
        'teacher_details',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('full_name', sa.String(256), nullable=False),
        sa.Column('employee_id', sa.String(50), nullable=False),
        sa.Column('subject', sa.String(100), nullable=False),
        sa.Column('department', sa.String(100), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create predictions table
    op.create_table(
        'predictions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('student_id', sa.Integer(), nullable=True),
        sa.Column('risk_score', sa.Float(), nullable=True),
        sa.Column('model_version', sa.String(64), nullable=True, server_default='v0.1'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['student_id'], ['students.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create counseling_sessions table
    op.create_table(
        'counseling_sessions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('student_id', sa.Integer(), nullable=True),
        sa.Column('teacher_id', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('follow_up_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['student_id'], ['students.id'], ),
        sa.ForeignKeyConstraint(['teacher_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create raw_students table
    op.create_table(
        'raw_students',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('student_id', sa.String(50), nullable=True),
        sa.Column('data', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('raw_students')
    op.drop_table('counseling_sessions')
    op.drop_table('predictions')
    op.drop_table('teacher_details')
    op.drop_table('students')
    op.drop_table('audit_logs')
    op.drop_table('users')

