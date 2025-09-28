"""
Simple training script to create a dropout model.
This uses simulated data for demo; replace with real dataset.
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from joblib import dump
import os

def generate_synthetic(n=1000, random_state=42):
    rng = np.random.RandomState(random_state)
    age = rng.randint(17, 30, size=n)
    attendance = rng.uniform(40, 100, size=n)
    gpa = rng.uniform(0.5, 4.0, size=n)
    assignments = rng.poisson(5, size=n)
    warnings = rng.binomial(3, 0.2, size=n)
    # Target: high dropout when low attendance, low gpa, many warnings
    score = (60 - attendance) * 0.03 + (2.5 - gpa) * 0.4 + (warnings * 0.2) + rng.normal(0, 0.1, size=n)
    prob = 1 / (1 + np.exp(-score))
    y = (prob > 0.5).astype(int)
    df = pd.DataFrame({
        "age": age,
        "attendance": attendance,
        "gpa": gpa,
        "assignments_completed": assignments,
        "warnings": warnings,
        "dropout": y
    })
    return df

def train_and_save(path="model/dropout_model.joblib"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df = generate_synthetic(2000)
    X = df[["attendance","gpa","assignments_completed","warnings","age"]].values
    y = df["dropout"].values
    X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=42)
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    print("Train score:", clf.score(X_train, y_train))
    print("Test score:", clf.score(X_test, y_test))
    dump(clf, path)
    print("Saved model to", path)

if __name__ == "__main__":
    train_and_save()
