"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileImage, Loader2, PlayCircle, Clock, X } from "lucide-react";
import { getRecentUploads, clearRecentUploads } from "@/lib/localStorage";
import { RecentUpload } from "@/lib/types";

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
}

export function UploadArea({ onFileUpload, onLoadDemo, isLoading }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecentUploads(getRecentUploads());
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onFileUpload(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleClearRecent = () => {
    clearRecentUploads();
    setRecentUploads([]);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Processing Your Report</h3>
          <p className="text-muted-foreground">
            Our AI is extracting trade data from your report. This may take a moment...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Your Trading Report</h1>
        <p className="text-muted-foreground">
          Drag and drop your trading report screenshot or PDF, or try our demo data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card className="relative">
          <CardContent 
            className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleChange}
              className="hidden"
            />
            
            <div className="text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Report</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: PNG, JPG, JPEG, PDF (Max 10MB)
              </p>
              
              {preview && (
                <div className="mt-4">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-w-full h-32 object-contain mx-auto rounded border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo Data */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <PlayCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Try Demo Data</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Explore the dashboard with sample trading data from January 2025
              </p>
              
              <Button onClick={onLoadDemo} className="w-full">
                <FileImage className="h-4 w-4 mr-2" />
                Load Demo Data
              </Button>
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p>15 trades • 5 symbols • Mixed P&L</p>
                <p>Perfect for testing all features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent Uploads
            </h3>
            {recentUploads.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearRecent}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          {recentUploads.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No recent uploads yet. Upload your first report to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm truncate max-w-[200px]">
                        {upload.filename}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {upload.tradesCount} trades • {new Date(upload.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground max-w-[150px] truncate">
                    {upload.summary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}