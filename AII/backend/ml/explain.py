import shap
import pandas as pd
import numpy as np

def explain_prediction(model, X_sample):
    try:
        if isinstance(X_sample, pd.Series):
            X_sample = X_sample.to_frame().T

        preprocessor = model.named_steps["preprocessor"]
        classifier = model.named_steps["classifier"]

        X_trans = preprocessor.transform(X_sample)

        feature_names = preprocessor.get_feature_names_out()

        if hasattr(classifier, "predict_proba"):
            explainer = shap.TreeExplainer(classifier)
            shap_raw = explainer.shap_values(X_trans)
            shap_values = shap_raw[1][0]
        else:
            explainer = shap.TreeExplainer(classifier)
            shap_values = explainer.shap_values(X_trans)[0]

        explanation = {
            name: round(float(val), 3)
            for name, val in zip(feature_names, shap_values)
        }

        return explanation

    except Exception as e:
        return {"error": "Explanation failed", "details": str(e)}
