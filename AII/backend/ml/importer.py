import os
import json
import pandas as pd
from sqlalchemy.exc import SQLAlchemyError
from models import RawStudent, Student, db

COMMON_ID_FIELDS = ["student_id", "id", "student id", "studentid", "sid", "email"]


def _normalize_key(key):
    return key.strip().lower().replace(" ", "_")


def _pick_student_id(row):
    for key in COMMON_ID_FIELDS:
        key_norm = _normalize_key(key)
        if key_norm in row and row[key_norm]:
            return str(row[key_norm])
    return None


def import_csv_file(app, csv_path, commit_every=200):
    df = pd.read_csv(csv_path, dtype=object, keep_default_na=True)

    # normalize column names
    df = df.rename(columns=lambda c: _normalize_key(c))
    df = df.where(pd.notnull(df), None)

    total = len(df)
    successes = 0
    failures = 0
    updated = 0
    created = 0

    academic_field_map = {
        "curricular_units_1st_sem_enrolled": "cu1_enrolled",
        "curricular_units_1st_sem_approved": "cu1_approved",
        "curricular_units_1st_sem_grade": "cu1_grade",
        "curricular_units_2nd_sem_enrolled": "cu2_enrolled",
        "curricular_units_2nd_sem_approved": "cu2_approved",
        "curricular_units_2nd_sem_grade": "cu2_grade",
        "attendance": "attendance",
        "avg_score": "avg_score",
        "academic_score": "academic_score",
    }

    with app.app_context():
        session = db.session

        for idx, row in df.iterrows():
            row_dict = row.to_dict()
            sid = _pick_student_id(row_dict)

            try:
                # Save raw uploaded CSV row
                raw = RawStudent(student_id=sid, data=json.dumps(row_dict))
                session.add(raw)
                successes += 1

                if sid:
                    # lookup student by student_id or email
                    student = None

                    if hasattr(Student, "student_id"):
                        student = session.query(Student).filter_by(student_id=sid).first()

                    if not student and hasattr(Student, "email"):
                        student = session.query(Student).filter_by(email=sid).first()

                    if student:
                        # basic fields
                        for fld in ("name", "full_name", "email", "age", "gender"):
                            csv_key = _normalize_key(fld)
                            val = row_dict.get(csv_key)
                            if val is not None and hasattr(student, fld):
                                setattr(student, fld, val)

                        # academic fields
                        for csv_key, model_attr in academic_field_map.items():
                            if csv_key in row_dict and hasattr(student, model_attr):
                                val = row_dict[csv_key]
                                if val is not None:
                                    try:
                                        if model_attr.endswith("_grade") or model_attr in ("attendance", "avg_score"):
                                            val = float(val)
                                        else:
                                            val = int(val)
                                    except Exception:
                                        val = None

                                    setattr(student, model_attr, val)

                        updated += 1

                    else:
                        # create new student record
                        s_kwargs = {}
                        if hasattr(Student, "student_id"):
                            s_kwargs["student_id"] = sid
                        if hasattr(Student, "name") and row_dict.get("name"):
                            s_kwargs["name"] = row_dict.get("name")

                        new_s = Student(**s_kwargs)
                        session.add(new_s)
                        created += 1

                # periodic commit
                if (idx + 1) % commit_every == 0:
                    session.commit()

            except SQLAlchemyError:
                session.rollback()
                failures += 1

        session.commit()

    return {
        "total": total,
        "raw_saved": successes,
        "failures": failures,
        "students_created": created,
        "students_updated": updated,
    }
