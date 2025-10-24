const res = await API.post("/predict", {
   student_id,
   attendance,
   avg_score,
   assignments_completed,
   behavior_score
});

setRisk(res.data.risk_score);
setSuggestion(res.data.recommendation);
