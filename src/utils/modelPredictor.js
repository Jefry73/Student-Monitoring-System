/**
 * Dropout Prediction Model Utilities for React
 * Uses exported Random Forest model + mock SVM/MLP for frontend prototyping
 */

// Import the Random Forest model (pure JavaScript function)
// The random_forest.js file exports a score() function that takes 7 features
// and returns [graduate_prob, dropout_prob]
import { score as randomForestScore } from '../../../machinelearning/model/random_forest.js';

// Feature order (IMPORTANT: Must match training data)
export const FEATURE_ORDER = [
  'Displaced',
  'Tuition fees up to date',
  'Gender',
  'Scholarship holder',
  'Age at enrollment',
  'Curricular units 1st sem (grade)',
  'Curricular units 2nd sem (grade)'
];

// Risk thresholds
const RISK_THRESHOLDS = {
  'High Risk': 0.70,
  'Medium Risk': 0.40,
  'Low Risk': 0.0
};

/**
 * Get risk label from dropout probability
 */
export function getRiskLabel(probability) {
  if (probability >= RISK_THRESHOLDS['High Risk']) return 'High Risk';
  if (probability >= RISK_THRESHOLDS['Medium Risk']) return 'Medium Risk';
  return 'Low Risk';
}

/**
 * Mock SVM prediction using scaled Random Forest output
 * (SVM typically slightly more confident, so we adjust)
 */
function mockSVMPredict(features) {
  const rfResult = randomForestScore(features);
  const rfDropoutProb = rfResult[1];
  // SVM tends to be slightly more confident; adjust slightly
  const svmProb = Math.min(0.95, rfDropoutProb * 1.05);
  return [1 - svmProb, svmProb];
}

/**
 * Mock MLP prediction using neural network-like smoothing
 */
function mockMLPPredict(features) {
  const rfResult = randomForestScore(features);
  const rfDropoutProb = rfResult[1];
  // MLP with sigmoid activation produces smoother probabilities
  const mlpProb = rfDropoutProb * 0.98; // Slightly more conservative
  return [1 - mlpProb, mlpProb];
}

/**
 * Predict dropout probability using Random Forest model
 * @param {number[]} features - Array of 7 numeric features in order: [displaced, tuitionUpToDate, gender, scholarshipHolder, ageAtEnroll, sem1Grade, sem2Grade]
 * @returns {Object} Prediction result with probabilities and risk labels
 */
export function predictDropoutRandomForest(features) {
  if (!Array.isArray(features) || features.length !== 7) {
    throw new Error('Features must be an array of 7 numbers');
  }

  const result = randomForestScore(features);
  const dropoutProb = result[1]; // Index 1 is dropout probability

  return {
    model: 'random_forest',
    graduate_prob: result[0],
    dropout_prob: dropoutProb,
    risk_label: getRiskLabel(dropoutProb),
    confidence: Math.max(result[0], dropoutProb)
  };
}

/**
 * Predict dropout probability using all three models (Random Forest + mocked SVM/MLP)
 * Returns ensemble average
 * @param {number[]} features - Array of 7 numeric features
 * @returns {Object} Ensemble prediction with individual model results
 */
export function predictDropoutEnsemble(features) {
  if (!Array.isArray(features) || features.length !== 7) {
    throw new Error('Features must be an array of 7 numbers');
  }

  // Get predictions from all models
  const rfResult = randomForestScore(features);
  const svmResult = mockSVMPredict(features);
  const mlpResult = mockMLPPredict(features);

  const rfDropout = rfResult[1];
  const svmDropout = svmResult[1];
  const mlpDropout = mlpResult[1];

  // Ensemble: average of all three models
  const ensembleDropout = (rfDropout + svmDropout + mlpDropout) / 3;

  return {
    random_forest: {
      dropout_prob: rfDropout,
      risk_label: getRiskLabel(rfDropout)
    },
    svm: {
      dropout_prob: svmDropout,
      risk_label: getRiskLabel(svmDropout)
    },
    mlp: {
      dropout_prob: mlpDropout,
      risk_label: getRiskLabel(mlpDropout)
    },
    ensemble: {
      dropout_prob: ensembleDropout,
      risk_label: getRiskLabel(ensembleDropout),
      avg_confidence: (
        Math.max(rfResult[0], rfDropout) +
        Math.max(svmResult[0], svmDropout) +
        Math.max(mlpResult[0], mlpDropout)
      ) / 3
    }
  };
}

/**
 * Predict for multiple students
 * @param {Array<Object>} students - Array of student objects with features array
 * @returns {Array<Object>} Predictions for each student
 */
export function predictStudentBatch(students) {
  return students.map(student => ({
    nim: student.nim,
    name: student.name,
    ...predictDropoutEnsemble(student.features)
  }));
}

/**
 * Convert student data to features array
 * Handles both numeric and boolean inputs
 */
export function studentToFeatures(student) {
  return [
    student.displaced ? 1 : 0,                    // Displaced
    student.tuitionUpToDate ? 1 : 0,             // Tuition fees up to date
    student.gender === 'M' ? 1 : 0,              // Gender (1=Male, 0=Female)
    student.scholarshipHolder ? 1 : 0,           // Scholarship holder
    student.ageAtEnrollment || 18,               // Age at enrollment
    student.curricular1stSemGrade || 0,          // Curricular units 1st sem (grade)
    student.curricular2ndSemGrade || 0           // Curricular units 2nd sem (grade)
  ];
}

/**
 * Example usage with sample data
 */
export function examplePrediction() {
  // Example student features: [displaced, tuitionUpToDate, gender, scholarshipHolder, ageAtEnroll, sem1Grade, sem2Grade]
  const features = [0, 1, 1, 0, 19, 14.5, 13.2];

  console.log('[*] Example Prediction');
  console.log('Features:', features);

  const ensemble = predictDropoutEnsemble(features);
  console.log('Ensemble Results:', ensemble);

  return ensemble;
}
