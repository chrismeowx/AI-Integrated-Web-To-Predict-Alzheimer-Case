"use client";

import Image from "next/image";
import Navbar from "@/app/Navbar";
import { useState } from "react";
import axios from "axios";

export default function Home() {  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState("");    
  const [gradcam, setGradcam] = useState(null);
  const [loading, setLoading] = useState(false);

  // HANDLE FILE UPLOAD (AUTO PREDICT)
  const handleFileChange = async (e) => {
    const img = e.target.files[0];
    if (!img) return;

    setFile(img);
    setPreview(URL.createObjectURL(img));
    setResult("");
    setGradcam(null);
    setLoading(true); // start loading

    const formData = new FormData();
    formData.append("file", img);

    try {
      const res = await axios.post(
        "http://localhost:8000/guess",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data.class);
      setGradcam(res.data.gradcam);

    } catch (err) {
      console.error(err);
      setResult("Error predicting image");
    }

    setLoading(false); // done loading
  };

  return (
    <div className="bg-black min-h-screen text-white px-20 py-20">
      <Navbar />

      <div className="mt-10 mb-10">
        <h1 className="my-3 text-5xl font-bold">Guess with AI</h1>
        <p className="text-lg max-w-6xl">
          Upload a brain MRI image in order to use this AI. The AI (powered by Swin Transformer) was trained using{" "}
          <a href="https://www.kaggle.com/datasets/marcopinamonti/alzheimer-mri-4-classes-dataset" className="underline">
            this dataset
          </a>. It will classify the condition and generate a Grad-CAM heatmap showing which area influenced the prediction.
        </p>
      </div>

      {/* UPLOAD + PREVIEW SECTION (before prediction) */}
      {!gradcam && (
        <div className="">
          {preview && (
            <div className="mt-6 w-[700px] p-10 border border-gray-700 shadow-lg gap-10 bg-gray-900 block">
              <Image
                src={preview}
                alt="Uploaded"
                width={350}
                height={350}
                className="border border-gray-600"
              />

              {loading && (
                <p className="mt-5 text-lg animate-pulse text-gray-300">
                  Processing image...
                </p>
              )}
            </div>
          )}

          {/* Upload button — only show if NOT loading and NOT finished */}
          {!loading && !gradcam && (
            <div className="flex gap-3 justify mt-10">
              <label className="p-5 w-[180px] text-center rounded-lg cursor-pointer text-black bg-white hover:bg-black hover:text-white">
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>
      )}

      {/* GRADCAM RESULT SECTION (after prediction) */}
      {gradcam && (
        <div className="p-10 w-[1100px] h-[580px] border border-gray-700 shadow-lg gap-10 bg-gray-900">
          <div className="mb-7">
            <h1 className="font-semibold text-3xl mb-5">Grad-CAM Heatmap</h1>
            <Image 
              src={`data:image/png;base64,${gradcam}`}
              alt="GradCAM"
              width={300}
              height={300}
              className="rounded-lg border border-white"
            />
          </div>

          {result && (
            <div>
              <h2 className="font-semibold text-2xl">
                Prediction: <span className="text-white-300">{result}</span>
              </h2>
              <p className="mt-2">The explanation is defined here.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
