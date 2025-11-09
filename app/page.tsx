"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Upload, BarChart3, Brain, TrendingUp, FileImage, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">TradeSight</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-6">
            <Zap className="h-4 w-4 mr-2 text-primary" />
            AI-Powered Trading Analysis
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Transform Your Trading Reports into{" "}
            <span className="text-primary">Actionable Insights</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Upload your stock trading screenshots or PDFs and get instant AI analysis. 
            Track performance, visualize trends, and discover patterns in your trading strategy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/dashboard">
                <Upload className="h-5 w-5 mr-2" />
                Start Analyzing
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <FileImage className="h-5 w-5 mr-2" />
              See Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Upload</h3>
            <p className="text-muted-foreground">
              Drag & drop your trading reports or screenshots. Our OCR technology extracts trade data automatically.
            </p>
          </Card>

          <Card className="p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
            <p className="text-muted-foreground">
              Interactive charts showing equity curves, P&L by symbol, and trading patterns with filtering options.
            </p>
          </Card>

          <Card className="p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-muted-foreground">
              Get personalized insights, win/loss analysis, and actionable recommendations powered by AI.
            </p>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Upload Report</h3>
              <p className="text-muted-foreground text-sm">
                Drop your trading report image or PDF
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Processing</h3>
              <p className="text-muted-foreground text-sm">
                Our AI extracts and structures your trade data
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Insights</h3>
              <p className="text-muted-foreground text-sm">
                View analytics, charts, and AI-generated insights
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 TradeSight. Built with Next.js, OpenAI, and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  );
}
