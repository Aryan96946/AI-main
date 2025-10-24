import pandas as pd

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.fillna(0, inplace=True)
    df['attendance'] = df['attendance'].clip(0, 100)
    df['behavior_score'] = df['behavior_score'].clip(0, 5)
    return df
