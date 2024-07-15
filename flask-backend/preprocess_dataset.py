# preprocess_dataset.py
import pandas as pd

# Load the dataset
df = pd.read_csv('nutrients_csvfile.csv')

# Example preprocessing: lowercasing food names for easier matching
df['Food'] = df['Food'].str.lower()

# Save the processed dataset for quick access
df.to_pickle('nutritional_facts.pkl')
