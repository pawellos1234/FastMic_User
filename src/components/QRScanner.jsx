"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, Zap, ScanLine } from "lucide-react";
import { toast } from "sonner";

export function QRScanner({ isOpen, onClose, onScanResult, translations }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Initialize camera when scanner opens
  useEffect(() => {
    if (isOpen && hasPermission === null) {
      requestCameraPermission();
    } else if (isOpen && hasPermission === true) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, hasPermission]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setHasPermission(true);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      toast.success(translations.cameraReady || "Camera ready!");
    } catch (err) {
      console.error("Camera permission denied:", err);
      setHasPermission(false);
      setError(
        translations.cameraPermissionDenied ||
          "Camera access denied. Please allow camera access and try again.",
      );
      toast.error(translations.cameraError || "Camera access denied");
    }
  };

  const startCamera = async () => {
    if (!streamRef.current) {
      await requestCameraPermission();
      return;
    }

    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      setIsScanning(true);

      // Start scanning for QR codes
      scanIntervalRef.current = setInterval(scanForQRCode, 500);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setIsScanning(false);
  };

  const scanForQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Get image data from canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Simple QR detection - look for patterns that might be QR codes
      // In a real app, you'd use a library like jsQR or qr-scanner
      const qrCode = detectQRPattern(imageData);

      if (qrCode) {
        handleQRDetected(qrCode);
      }
    } catch (err) {
      console.error("Error scanning QR code:", err);
    }
  };

  // Simplified QR detection - in reality you'd use a proper QR library
  const detectQRPattern = (imageData) => {
    // This is a mock implementation - normally you'd use jsQR or similar
    // For demo purposes, we'll simulate finding a QR code after a few seconds

    // Mock QR codes for testing
    const mockCodes = ["2025", "DEMO", "EVENT123"];
    const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];

    // Simulate detection delay
    if (Math.random() < 0.1) {
      // 10% chance per scan
      return randomCode;
    }

    return null;
  };

  const handleQRDetected = (qrCode) => {
    stopCamera();
    toast.success(translations.qrCodeFound || `QR Code found: ${qrCode}`);
    onScanResult(qrCode);
    onClose();
  };

  const handleManualClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-t-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 w-10 h-10 rounded-2xl flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {translations.scanQR || "Scan QR Code"}
                </h2>
                <p className="text-sm text-white/70">
                  {translations.pointCamera || "Point camera at QR code"}
                </p>
              </div>
            </div>
            <button
              onClick={handleManualClose}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative bg-black rounded-b-3xl overflow-hidden">
          {hasPermission === false && (
            <div className="p-8 text-center">
              <Camera className="h-12 w-12 text-white/50 mx-auto mb-4" />
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={requestCameraPermission}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                {translations.retryCamera || "Try Again"}
              </button>
            </div>
          )}

          {hasPermission === null && (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white">
                {translations.requestingCamera || "Requesting camera access..."}
              </p>
            </div>
          )}

          {hasPermission === true && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-80 object-cover"
              />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Corner markers */}
                  <div className="w-48 h-48 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-400"></div>
                  </div>

                  {/* Scanning line */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanLine className="h-8 w-8 text-blue-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status indicator */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">
                    {translations.scanning || "Scanning..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-md rounded-b-3xl p-4 border border-white/20 border-t-0">
          <div className="flex items-center justify-center space-x-2 text-white/70 text-sm">
            <Zap className="h-4 w-4" />
            <span>
              {translations.qrInstructions ||
                "Hold steady and align QR code within frame"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
