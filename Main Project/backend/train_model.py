# backend/train_model.py
import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, 'latest_model.joblib')

# Replace this path with your CSV file
DATA_PATH = os.environ.get('TRAIN_DATA', os.path.join(os.path.dirname(__file__), 'data', 'train.csv'))

def load_data(path=DATA_PATH):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Training data not found at {path}. Place a CSV with a 'label' column.")
    df = pd.read_csv(path)
    return df

def build_and_train(df):
    if 'label' not in df.columns:
        raise ValueError("Dataset must contain a 'label' column with 0/1 outcomes.")
    X = df.drop(columns=['label'])
    y = df['label']

    # choose numeric features
    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    # for demo: if none, attempt fallback to specific names
    if not numeric_features:
        numeric_features = ['attendance_rate', 'gpa', 'age']

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', numeric_transformer, numeric_features)
    ], remainder='drop')

    clf = Pipeline(steps=[('pre', preprocessor), ('clf', RandomForestClassifier(n_estimators=200, random_state=42))])

    X_train, X_test, y_train, y_test = train_test_split(X[numeric_features], y, test_size=0.2, random_state=42)
    clf.fit(X_train, y_train)
    print('train score', clf.score(X_train, y_train))
    print('test score', clf.score(X_test, y_test))
    joblib.dump(clf, MODEL_PATH)
    print('model saved to', MODEL_PATH)

if __name__ == '__main__':
    df = load_data()
    build_and_train(df)
