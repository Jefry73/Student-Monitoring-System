import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

BASE = os.getcwd()
MODEL_DIR = os.path.normpath(os.path.join(BASE, '..', 'model'))
DATA_PATH = os.path.join(BASE, 'data_processed.csv')

df = pd.read_csv(DATA_PATH)
cols = [
    'Displaced',
    'Tuition fees up to date',
    'Gender',
    'Scholarship holder',
    'Age at enrollment',
    'Curricular units 1st sem (grade)',
    'Curricular units 2nd sem (grade)',
]
X = df[cols].astype(float)
label_map = {'graduate': 0, 'dropout': 1}
y = df['Target'].astype(str).str.strip().str.lower().map(label_map).astype(int)

_, X_test, _, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

for name in ['random_forest', 'svm', 'mlp']:
    path = os.path.join(MODEL_DIR, name + '.pkl')
    model = joblib.load(path)
    y_pred = model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred, labels=[0, 1])
    print(name, cm.tolist())
