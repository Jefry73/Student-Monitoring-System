import onnxruntime as rt
import numpy as np

# Load and test each model
models = ['mlp.onnx', 'random_forest.onnx', 'svm.onnx']
test_features = np.array([[1, 1, 1, 0, 20, 13.74, 13.68]], dtype=np.float32)

for model_name in models:
    print(f"\n{'='*50}")
    print(f"Testing {model_name}")
    print(f"{'='*50}")
    
    try:
        sess = rt.InferenceSession(model_name, providers=['CPUExecutionProvider'])
        
        print(f"Input names: {sess.get_inputs()[0].name}")
        print(f"Input shape: {sess.get_inputs()[0].shape}")
        
        print(f"\nOutputs:")
        for output in sess.get_outputs():
            print(f"  Name: {output.name}")
            print(f"  Shape: {output.shape}")
        
        # Run inference
        input_name = sess.get_inputs()[0].name
        outputs = sess.run(None, {input_name: test_features})
        
        print(f"\nOutput values:")
        for i, output in enumerate(outputs):
            print(f"  Output {i} ({sess.get_outputs()[i].name}):")
            print(f"    Type: {type(output)}")
            print(f"    Shape: {output.shape}")
            print(f"    Value: {output}")
            print(f"    Data: {output.data if hasattr(output, 'data') else 'N/A'}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
