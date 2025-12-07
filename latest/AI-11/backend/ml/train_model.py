import os
import joblib
import pandas as pd
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "students.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

COLUMN_MAP = {
    "Age at enrollment": "age_at_enrollment",
    "Marital status": "marital_status",
    "Application mode": "application_mode",
    "Application order": "application_order",
    "Course": "course",
    "Daytime/evening attendance": "attendance_type",
    "Previous qualification": "previous_qualification",
    "Mother's qualification": "mother_qualification",
    "Father's qualification": "father_qualification",
    "Curricular units 1st sem (grade)": "curricular_units_1st_sem_grade",
    "Curricular units 2nd sem (grade)": "curricular_units_2nd_sem_grade",
    "Unemployment rate": "unemployment_rate",
    "Inflation rate": "inflation_rate",
    "GDP": "gdp"
}

FEATURES = list(COLUMN_MAP.values())

def load_data(path=DATA_PATH):
    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()
    df = df.rename(columns=COLUMN_MAP)
    df = df.dropna(subset=["Target"])
    df["Target"] = df["Target"].astype(str)
    return df

def build_preprocessor(X):
    cat_cols = [c for c in X.columns if X[c].dtype == "object"]
    num_cols = [c for c in X.columns if X[c].dtype != "object"]

    num_pipe = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    cat_pipe = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    return ColumnTransformer([
        ("num", num_pipe, num_cols),
        ("cat", cat_pipe, cat_cols)
    ])

def train_and_save(path=DATA_PATH, model_path=MODEL_PATH):
    df = load_data(path)
    feature_cols = [c for c in FEATURES if c in df.columns]
    X = df[feature_cols]
    y = df["Target"]

    preprocessor = build_preprocessor(X)

    clf = RandomForestClassifier(
        n_estimators=300,
        max_depth=15,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", clf)
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    print(classification_report(y_test, preds))

    Path(model_path).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Saved model to {model_path}")

if __name__ == "__main__":
    train_and_save()
