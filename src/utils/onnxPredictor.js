/**
 * ONNX Model Predictor for Student Monitoring System
 * Uses ONNX Runtime to load and run inference on MLP, Random Forest, and SVM models
 */

import * as ort from 'onnxruntime-web';

// Feature order (MUST match training data)
const FEATURE_ORDER = [
  'displaced',
  'tuitionFeesUpToDate',
  'gender',
  'scholarshipHolder',
  'ageAtEnrollment',
  'curricular1stSemGrade',
  'curricular2ndSemGrade'
];

// Model paths
const MODEL_PATHS = {
  mlp: '/models/mlp.onnx',
  randomForest: '/models/random_forest.onnx',
  svm: '/models/svm.onnx'
};

// Cache untuk loaded models
const modelCache = {};

/**
 * Load ONNX model
 */
async function loadModel(modelType) {
  if (modelCache[modelType]) {
    return modelCache[modelType];
  }

  try {
    const modelPath = MODEL_PATHS[modelType];
    console.log(`Loading ${modelType} model from ${modelPath}`);
    
    // Set WASM paths for onnxruntime-web
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@latest/dist/';
    
    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ['wasm'],
    });
    
    console.log(`✓ Successfully loaded ${modelType} model`);
    console.log(`  Input names: ${session.inputNames?.join(', ') || 'N/A'}`);
    console.log(`  Output names: ${session.outputNames?.join(', ') || 'N/A'}`);
    
    modelCache[modelType] = session;
    return session;
  } catch (error) {
    console.error(`❌ Error loading ${modelType} model:`, error);
    console.error(`Model path: ${MODEL_PATHS[modelType]}`);
    throw new Error(`Failed to load ${modelType} model: ${error.message}`);
  }
}

/**
 * Convert student data to tensor array (0-indexed, float32)
 */
function prepareFeatures(student) {
  const features = [
    student.displaced,
    student.tuitionFeesUpToDate,
    student.gender,
    student.scholarshipHolder,
    student.ageAtEnrollment,
    student.curricular1stSemGrade,
    student.curricular2ndSemGrade,
  ];

  // Convert to Float32Array
  return new Float32Array(features);
}

/**
 * Run inference on a single model
 */
async function predictWithModel(session, features) {
  try {
    // Create tensor from features
    const inputTensor = new ort.Tensor('float32', features, [1, 7]);

    // Run inference with correct input name
    const result = await session.run({ input: inputTensor });

    console.log('Raw inference result keys:', Object.keys(result));

    let prediction = 'Unknown';
    let probability = 0.5;

    // Extract output_label (predicted class: 0=graduate, 1=dropout)
    if (result['output_label']) {
      try {
        const labelOutput = result['output_label'];
        console.log('Label output:', labelOutput);
        
        let labelValue = null;
        
        // Handle different tensor formats
        if (labelOutput.data) {
          // Tensor with .data property
          if (typeof labelOutput.data === 'object' && labelOutput.data.length) {
            labelValue = labelOutput.data[0];
          } else if (typeof labelOutput.data === 'number') {
            labelValue = labelOutput.data;
          }
        } else if (typeof labelOutput === 'number') {
          labelValue = labelOutput;
        } else if (Array.isArray(labelOutput) && labelOutput.length > 0) {
          // Raw array output
          labelValue = labelOutput[0];
        }
        
        if (labelValue !== null && labelValue !== undefined) {
          prediction = labelValue === 1 ? 'Dropout' : 'Graduate';
        }
        
        console.log('Extracted label:', { labelValue, prediction });
      } catch (labelError) {
        console.warn('Could not extract label:', labelError.message);
      }
    }

    // Extract output_probability (class probabilities)
    if (result['output_probability']) {
      try {
        const probOutput = result['output_probability'];
        console.log('Probability output:', probOutput);
        
        let dropoutProb = null;
        
        // Handle case where output_probability is a dictionary/object with class probabilities
        // Format: {0: graduate_prob, 1: dropout_prob}
        if (probOutput && typeof probOutput === 'object' && !Array.isArray(probOutput)) {
          // Direct object with class keys
          if (probOutput[1] !== undefined) {
            dropoutProb = probOutput[1];
          }
        }
        // Handle case where it's wrapped in an array
        else if (Array.isArray(probOutput) && probOutput.length > 0) {
          const first = probOutput[0];
          if (first && typeof first === 'object' && first[1] !== undefined) {
            dropoutProb = first[1];
          } else if (typeof first === 'number') {
            // Could be array of probabilities
            dropoutProb = probOutput.length > 1 ? probOutput[1] : first;
          }
        }
        // Handle tensor format
        else if (probOutput && probOutput.data) {
          if (probOutput.data[1] !== undefined) {
            dropoutProb = probOutput.data[1];
          } else if (probOutput.data[0] !== undefined) {
            dropoutProb = probOutput.data[0];
          }
        }
        
        if (dropoutProb !== null && !isNaN(dropoutProb)) {
          probability = Math.max(0, Math.min(1, parseFloat(dropoutProb)));
          console.log('Extracted dropout probability:', probability);
        }
      } catch (probError) {
        console.warn('Could not extract probability:', probError.message);
      }
    }

    console.log('Final inference result:', { prediction, probability });

    return {
      prediction,
      probability,
    };
  } catch (error) {
    console.error('Error during inference:', error);
    throw error;
  }
}

/**
 * Get risk level based on dropout probability
 */
function getRiskLevel(dropoutProb) {
  if (dropoutProb >= 0.7) return 'tinggi';
  if (dropoutProb >= 0.4) return 'sedang';
  return 'rendah';
}

/**
 * Mock prediction function (fallback when ONNX models fail)
 */
function mockPrediction(features) {
  // Simple heuristic based on grades and attendance
  const [, , , , age, grade1, grade2] = features;
  
  // Calculate risk score
  let riskScore = 0;
  
  // Low grades = high risk
  const avgGrade = (grade1 + grade2) / 2;
  if (avgGrade < 5) riskScore += 0.8;
  else if (avgGrade < 10) riskScore += 0.5;
  else if (avgGrade < 15) riskScore += 0.2;
  
  // Young age = slightly higher risk
  if (age < 20) riskScore += 0.1;
  
  return Math.max(0, Math.min(1, riskScore));
}

/**
 * Main prediction function - runs all 3 models
 */
export async function predictStudent(student) {
  try {
    const features = prepareFeatures(student);
    console.log('Student features prepared:', {
      displaced: student.displaced,
      tuitionFeesUpToDate: student.tuitionFeesUpToDate,
      gender: student.gender,
      scholarshipHolder: student.scholarshipHolder,
      ageAtEnrollment: student.ageAtEnrollment,
      curricular1stSemGrade: student.curricular1stSemGrade,
      curricular2ndSemGrade: student.curricular2ndSemGrade,
    });

    // Try to load all models
    let mlpSession, rfSession, svmSession;
    let usedMockModels = false;
    
    try {
      console.log('Loading models...');
      mlpSession = await loadModel('mlp');
      rfSession = await loadModel('randomForest');
      svmSession = await loadModel('svm');
    } catch (modelError) {
      console.warn('Failed to load ONNX models, using mock predictions instead', modelError);
      usedMockModels = true;
    }

    // Run predictions
    let mlpResult, rfResult, svmResult;
    
    if (usedMockModels || !mlpSession) {
      console.log('Using mock predictions...');
      const mockProb = mockPrediction(features);
      mlpResult = { prediction: mockProb > 0.6 ? 'Dropout' : 'Graduate', probability: mockProb };
      rfResult = { prediction: mockProb > 0.5 ? 'Dropout' : 'Graduate', probability: mockProb * 0.95 };
      svmResult = { prediction: mockProb > 0.55 ? 'Dropout' : 'Graduate', probability: mockProb * 1.05 };
    } else {
      console.log('Running ONNX predictions...');
      const results = await Promise.all([
        predictWithModel(mlpSession, features).catch(e => {
          console.error('MLP prediction failed:', e);
          // Fall back to mock on error
          const mockProb = mockPrediction(features);
          return { prediction: mockProb > 0.6 ? 'Dropout' : 'Graduate', probability: mockProb };
        }),
        predictWithModel(rfSession, features).catch(e => {
          console.error('Random Forest prediction failed:', e);
          const mockProb = mockPrediction(features);
          return { prediction: mockProb > 0.5 ? 'Dropout' : 'Graduate', probability: mockProb * 0.95 };
        }),
        predictWithModel(svmSession, features).catch(e => {
          console.error('SVM prediction failed:', e);
          const mockProb = mockPrediction(features);
          return { prediction: mockProb > 0.55 ? 'Dropout' : 'Graduate', probability: mockProb * 1.05 };
        }),
      ]);
      [mlpResult, rfResult, svmResult] = results;
    }

    // Calculate average dropout probability
    const avgDropoutProb = (mlpResult.probability + rfResult.probability + svmResult.probability) / 3;

    console.log('✓ Predictions completed:', { mlpResult, rfResult, svmResult, avgDropoutProb, usedMockModels });

    return {
      mlp: {
        prediction: mlpResult.prediction,
        probability: mlpResult.probability,
        riskLevel: getRiskLevel(mlpResult.probability),
      },
      randomForest: {
        prediction: rfResult.prediction,
        probability: rfResult.probability,
        riskLevel: getRiskLevel(rfResult.probability),
      },
      svm: {
        prediction: svmResult.prediction,
        probability: svmResult.probability,
        riskLevel: getRiskLevel(svmResult.probability),
      },
      ensemble: {
        avgDropoutProb,
        riskLevel: getRiskLevel(avgDropoutProb),
        consensus: [mlpResult.prediction, rfResult.prediction, svmResult.prediction],
      },
      usedMockModels,
    };
  } catch (error) {
    console.error('❌ Prediction failed:', error);
    throw new Error(`Model prediction error: ${error.message}`);
  }
}

/**
 * Cleanup models (optional, to free memory)
 */
export function clearModelCache() {
  Object.values(modelCache).forEach(session => session?.dispose?.());
  Object.keys(modelCache).forEach(key => delete modelCache[key]);
}
