import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_model(data_path="ml/student_data.csv", model_path="ml/model.pkl"):
    # Adjust paths to absolute paths inside container
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "student_data.csv")
    model_path = os.path.join(base_dir, "model.pkl")

    if not os.path.exists(data_path):
        print(f"❌ Dataset not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    required_cols = ['attendance', 'avg_score', 'assignments_completed', 'behavior_score', 'dropout']

    for col in required_cols:
        if col not in df.columns:
            print(f"❌ Missing column: {col} in dataset.")
            return

    X = df[['attendance', 'avg_score', 'assignments_completed', 'behavior_score']]
    y = df['dropout']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    joblib.dump(model, model_path)
    print(f"✅ Model trained and saved successfully at {model_path}")


if __name__ == "__main__":
    train_model()
