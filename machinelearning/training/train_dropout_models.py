import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, roc_auc_score
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data_processed.csv")
MODEL_DIR = os.path.normpath(os.path.join(BASE_DIR, "..", "model"))

os.makedirs(MODEL_DIR, exist_ok=True)

FEATURE_COLUMNS = [
    "Displaced",
    "Tuition fees up to date",
    "Gender",
    "Scholarship holder",
    "Age at enrollment",
    "Curricular units 1st sem (grade)",
    "Curricular units 2nd sem (grade)",
]

TARGET_COLUMN = "Target"
LABEL_MAP = {"graduate": 0, "dropout": 1,}
RISK_LABELS = [
    (0.70, "High Risk"),
    (0.40, "Medium Risk"),
    (0.00, "Low Risk"),
]


def load_data(csv_path):
    df = pd.read_csv(csv_path)
    if TARGET_COLUMN not in df.columns:
        raise ValueError("Target column '{}' not found in {}".format(TARGET_COLUMN, csv_path))

    for feature in FEATURE_COLUMNS:
        if feature not in df.columns:
            raise ValueError("Feature column '{}' not found in {}".format(feature, csv_path))

    df[TARGET_COLUMN] = df[TARGET_COLUMN].astype(str).str.strip().str.lower().map(LABEL_MAP)
    if df[TARGET_COLUMN].isnull().any():
        missing = df.loc[df[TARGET_COLUMN].isnull(), TARGET_COLUMN].unique()
        raise ValueError(
            "Some target values could not be mapped to 0/1: {}. Check target labels.".format(missing.tolist())
        )

    X = df[FEATURE_COLUMNS].astype(float)
    y = df[TARGET_COLUMN].astype(int)
    return X, y


def risk_label(probability):
    for threshold, label in RISK_LABELS:
        if probability >= threshold:
            return label
    return "Unknown"


def evaluate_model(model, X_test, y_test, name):
    y_pred = model.predict(X_test)
    proba = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X_test)[:, 1]
    elif hasattr(model, "decision_function"):
        proba = model.decision_function(X_test)
    else:
        proba = y_pred

    print("\n=== {} ===".format(name))
    print(classification_report(y_test, y_pred, target_names=["Graduate", "Dropout"]))
    try:
        print("ROC AUC:", roc_auc_score(y_test, proba))
    except Exception:
        pass
    return proba


def save_pipeline(pipeline, name):
    path = os.path.join(MODEL_DIR, "{}.pkl".format(name))
    joblib.dump(pipeline, path)
    print("[+] Saved model: {}".format(path))
    return path


def export_onnx(model, name, n_features):
    try:
        initial_type = [("input", FloatTensorType([None, n_features]))]
        onnx_model = convert_sklearn(model, initial_types=initial_type, target_opset=15)
        out_path = os.path.join(MODEL_DIR, "{}.onnx".format(name))
        with open(out_path, "wb") as f:
            f.write(onnx_model.SerializeToString())
        print("[+] Exported ONNX model: {}".format(out_path))
    except Exception as exc:
        print("[!] ONNX export failed for {}: {}".format(name, exc))


def save_metadata():
    metadata = {
        "feature_columns": FEATURE_COLUMNS,
        "label_map": LABEL_MAP,
        "risk_thresholds": RISK_LABELS,
    }
    out_path = os.path.join(MODEL_DIR, "model_metadata.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print("[+] Saved model metadata: {}".format(out_path))


def save_risk_csv(X_test, y_test, proba_dict):
    output = X_test.copy()
    output["Target"] = y_test.map({0: "Graduate", 1: "Dropout"})
    for model_name, proba in proba_dict.items():
        output["{}_dropout_prob".format(model_name)] = proba
        output["{}_risk_label".format(model_name)] = [risk_label(p) for p in proba]

    out_path = os.path.join(MODEL_DIR, "sample_risk_predictions.csv")
    output.to_csv(out_path, index=False)
    print("[+] Saved sample risk predictions: {}".format(out_path))


def main():
    print("\n=== Starting Dropout Prediction Model Training ===\n")
    
    print("[*] Loading data from: " + DATA_PATH)
    X, y = load_data(DATA_PATH)
    print("[+] Loaded {} samples, {} features".format(len(X), len(X.columns)))
    print("    Label distribution: {}".format(dict(y.value_counts())))
    
    print("\n[*] Training/test split (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )
    print("[+] Train: {}, Test: {}".format(len(X_train), len(X_test)))

    models = {
        "random_forest": RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            class_weight="balanced",
        ),
        "svm": Pipeline([
            ("scaler", StandardScaler()),
            ("svc", CalibratedClassifierCV(
                SVC(kernel="rbf", random_state=42, class_weight="balanced"),
                ensemble=False,
            )),
        ]),
        "mlp": Pipeline([
            ("scaler", StandardScaler()),
            (
                "mlp",
                MLPClassifier(
                    hidden_layer_sizes=(32, 16),
                    activation="relu",
                    solver="adam",
                    max_iter=500,
                    random_state=42,
                ),
            ),
        ]),
    }

    proba_dict = {}
    for model_name, model in models.items():
        print("\n[*] Training {}...".format(model_name))
        trained = model.fit(X_train, y_train)
        save_pipeline(trained, model_name)
        proba = evaluate_model(trained, X_test, y_test, model_name)
        proba_dict[model_name] = proba
        export_onnx(trained, model_name, X_test.shape[1])

    print("\n[*] Saving predictions and metadata...")
    save_risk_csv(X_test, y_test, proba_dict)
    save_metadata()

    print("\n" + "="*60)
    print("[+] TRAINING COMPLETE!")
    print("="*60)
    print("\nModels saved to: " + MODEL_DIR)
    print("  - random_forest.pkl")
    print("  - svm.pkl")
    print("  - mlp.pkl")
    print("  - model_metadata.json")
    print("  - sample_risk_predictions.csv")


if __name__ == "__main__":
    main()