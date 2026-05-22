import React, { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import axios from "axios";

import {
  UploadCloud,
  Loader2,
  CheckCircle,
} from "lucide-react";

const UploadPage = () => {

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const uploadResume = async () => {

    if (!file) return;

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setResult(response.data);

    } catch (error) {

      console.error(error);

      alert("Upload Failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            Upload Resume
          </h1>

          <p className="text-gray-400 mt-2">
            Upload PDF resume for AI analysis
          </p>
        </div>

        <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-16 text-center">

          <UploadCloud
            size={70}
            className="mx-auto text-cyan-400 mb-6"
          />

          <h2 className="text-2xl font-bold mb-3">
            Drag & Drop Resume
          </h2>

          <p className="text-gray-400 mb-6">
            Upload PDF resume for analysis
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(
                e.target.files
                  ? e.target.files[0]
                  : null
              )
            }
            className="mb-6"
          />

          <button
            onClick={uploadResume}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-semibold"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Uploading...
              </div>
            ) : (
              "Upload Resume"
            )}
          </button>
        </div>

        {result && (

          <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8">

            <div className="flex items-center gap-4">

              <CheckCircle
                size={40}
                className="text-green-400"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  Upload Successful
                </h2>

                <p className="text-gray-300 mt-1">
                  Resume Category:
                  {" "}
                  <span className="text-cyan-400 font-bold">
                    {result.category}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;