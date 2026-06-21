import onnx
import sys

model_path = sys.argv[1] if len(sys.argv) > 1 else 'mlp.onnx'

try:
    model = onnx.load(model_path)
    print(f"\n=== {model_path} ===")
    print("\nInputs:")
    for inp in model.graph.input:
        print(f"  Name: {inp.name}")
        print(f"  Shape: {[d.dim_value for d in inp.type.tensor_type.shape.dim]}")
        print(f"  Type: {inp.type.tensor_type.elem_type}")
    
    print("\nOutputs:")
    for out in model.graph.output:
        print(f"  Name: {out.name}")
        print(f"  Shape: {[d.dim_value for d in out.type.tensor_type.shape.dim]}")
        print(f"  Type: {out.type.tensor_type.elem_type}")
    
    print(f"\nNodes count: {len(model.graph.node)}")
    
except Exception as e:
    print(f"Error: {e}")
