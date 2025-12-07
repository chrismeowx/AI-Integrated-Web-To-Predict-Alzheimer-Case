from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
from torchvision import transforms
from PIL import Image
import io
import base64
import cv2
import numpy as np
from timm import create_model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = create_model("swin_tiny_patch4_window7_224", pretrained=False, num_classes=4)
model.load_state_dict(torch.load("damodel.pth", map_location="cpu"))
model.eval()

class_names = [
    "Mild Demented",
    "Moderately Demented",
    "Non Demented",
    "Very Mild Demented"
]

def get_swin_target_layer(model):
    return model.layers[-1].blocks[-1].norm2  


class SwinGradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer

        self.activations = None
        self.gradients = None

        # Register hooks
        self.fwd_hook = target_layer.register_forward_hook(self.save_activation)
        self.bwd_hook = target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, inp, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def __call__(self, x):
        output = self.model(x)
        pred = output.argmax(dim=1)

        self.model.zero_grad()
        output[0, pred].backward()

        acts = self.activations         # [1, 49, C] or similar
        grads = self.gradients          # same shape

        # Global average pooling the gradients (over sequence dimension)
        weights = grads.mean(dim=1)     # shape [1, C]

        # Weighted sum
        cam = (acts * weights.unsqueeze(1)).sum(dim=-1)  # → shape [1, 49]

        # Reshape ke spatial map (7x7 untuk swin tiny)
        spatial_size = int(np.sqrt(cam.shape[1]))
        cam = cam.reshape(1, spatial_size, spatial_size)

        cam = torch.relu(cam)
        cam = cam.squeeze().detach().numpy()

        # SAFE NORMALIZATION
        cam_min, cam_max = cam.min(), cam.max()
        if cam_max - cam_min == 0:
            cam = np.zeros_like(cam)  # fallback jika flat
        else:
            cam = (cam - cam_min) / (cam_max - cam_min)

        return cam, pred.item()


cam_generator = SwinGradCAM(model, get_swin_target_layer(model))


# ============================
# HEATMAP OVERLAY + BASE64
# ============================

def generate_gradcam_base64(img_np, heatmap):
    h, w = img_np.shape[:2]

    cam = cv2.resize(heatmap, (w, h))
    cam_uint8 = np.uint8(255 * cam)
    cam_color = cv2.applyColorMap(cam_uint8, cv2.COLORMAP_JET)

    overlay = 0.4 * cam_color + 0.6 * img_np
    overlay = np.uint8(overlay)

    # Convert → Base64
    _, buffer = cv2.imencode(".png", overlay)
    base64_str = base64.b64encode(buffer).decode("utf-8")

    return base64_str


# ============================
# MAIN ROUTE
# ============================

@app.post("/guess")
async def guess(file: UploadFile = File(...)):
    # Read file
    content = await file.read()
    img = Image.open(io.BytesIO(content)).convert("RGB")
    img_np = np.array(img)

    # Transform to model format
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
    ])

    input_tensor = transform(img).unsqueeze(0)

    # Predict + GradCAM
    heatmap, pred_idx = cam_generator(input_tensor)
    predicted_class = class_names[pred_idx]

    # Base64 GradCAM
    gradcam_b64 = generate_gradcam_base64(img_np, heatmap)

    return {
        "class": predicted_class,
        "gradcam": gradcam_b64
    }
