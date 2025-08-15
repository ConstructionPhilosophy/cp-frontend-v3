import React from "react";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex mb-4 gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
        </div>
        <p className="mt-4 text-sm text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/login">
          <Button className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
