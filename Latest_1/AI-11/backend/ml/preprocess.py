import pandas as pd
import numpy as np

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = df.columns.str.strip()

    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].astype(str).str.strip()

    for col in df.columns:
        if df[col].dtype == object:
            try:
                df[col] = pd.to_numeric(df[col])
            except:
                pass

    bool_map = {
        "yes": 1, "no": 0,
        "sim": 1, "nao": 0,
        "s": 1, "n": 0,
        "true": 1, "false": 0,
        "1": 1, "0": 0
    }

    bool_cols = [
        "Debtor",
        "Tuition fees up to date",
        "Scholarship holder",
        "Educational special needs",
        "Daytime/evening attendance"
    ]

    for col in bool_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.lower().map(bool_map).fillna(df[col])

    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns
    df[numeric_cols] = df[numeric_cols].fillna(0)

    categorical_cols = df.select_dtypes(include=["object"]).columns
    df[categorical_cols] = df[categorical_cols].fillna("Unknown")

    grade_cols = [
        "Curricular units 1st sem (grade)",
        "Curricular units 2nd sem (grade)"
    ]

    for col in grade_cols:
        if col in df.columns:
            df[col] = df[col].clip(0, 20)

    academic_cols = [
        "Curricular units 1st sem (evaluations)",
        "Curricular units 1st sem (approved)",
        "Curricular units 2nd sem (evaluations)",
        "Curricular units 2nd sem (approved)"
    ]

    for col in academic_cols:
        if col in df.columns:
            df[col] = df[col].clip(lower=0)

    if "Unemployment rate" in df.columns:
        df["Unemployment rate"] = df["Unemployment rate"].clip(0, 100)

    if "Inflation rate" in df.columns:
        df["Inflation rate"] = df["Inflation rate"].clip(-10, 50)

    if "GDP" in df.columns:
        df["GDP"] = df["GDP"].clip(lower=0)

    return df
