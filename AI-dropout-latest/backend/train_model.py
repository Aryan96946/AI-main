# train a simple model and save to backend/model/dropout_model.joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from joblib import dump
import os

# create toy dataset
np.random.seed(0)
N = 1000
attendance = np.random.normal(80, 15, N).clip(0,100)
gpa = np.random.normal(2.8, 0.7, N).clip(0,4)
assignments = np.random.randint(0, 20, N)
engagement = np.random.normal(50, 25, N).clip(0,100)

# define simple rule to label dropout risk
risk = ((attendance < 60) & (gpa < 2.0)) | ((assignments < 5) & (engagement < 30))
y = risk.astype(int)

X = pd.DataFrame({
    'attendance_percent': attendance,
    'gpa': gpa,
    'assignments_completed': assignments,
    'engagement_score': engagement
})

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

os.makedirs('model', exist_ok=True)
dump(model, 'model/dropout_model.joblib')
print("Saved model to model/dropout_model.joblib")
