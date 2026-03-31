import os
import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from pathlib import Path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "students.csv")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "preprocess.pkl")

df = pd.read_csv(DATA_PATH)
df.columns = df.columns.str.strip()

num_cols = df.select_dtypes(include=["int64", "float64"]).columns.tolist()
cat_cols = df.select_dtypes(include=["object"]).columns.tolist()

num_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

cat_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

preprocessor = ColumnTransformer([
    ("num", num_pipe, num_cols),
    ("cat", cat_pipe, cat_cols)
])

preprocessor.fit(df)

Path(PREPROCESSOR_PATH).parent.mkdir(parents=True, exist_ok=True)
joblib.dump(preprocessor, PREPROCESSOR_PATH)

print(f"Preprocessor fitted and saved to {PREPROCESSOR_PATH}")
