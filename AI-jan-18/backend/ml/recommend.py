def get_recommendation(score):
    if score is None or not isinstance(score, (int, float)):
        return "Invalid score provided – unable to generate recommendation."
    if not (0 <= score <= 1):
        return "Score out of range (expected 0-1) – unable to generate recommendation."
    if score >= 0.85:
        return "Very high dropout risk – initiate immediate intensive counseling and academic intervention."
    elif score >= 0.70:
        return "High dropout risk – schedule counseling soon and begin close academic monitoring."
    elif score >= 0.50:
        return "Moderate risk – monitor progress, provide academic support, and check in regularly."
    elif score >= 0.30:
        return "Low risk – encourage continued effort and perform periodic check-ins."
    else:
        return "Minimal risk – maintain regular support and positive reinforcement."