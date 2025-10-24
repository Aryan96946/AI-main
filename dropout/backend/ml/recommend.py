def get_recommendation(score):
    if score >= 0.75:
        return "High risk – schedule counseling immediately."
    elif score >= 0.5:
        return "Moderate risk – monitor academic progress closely."
    else:
        return "Low risk – encourage continued effort."
