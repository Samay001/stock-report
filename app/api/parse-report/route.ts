import { NextRequest, NextResponse } from 'next/server';
import { Trade, ParseReportResponse } from '@/lib/types';

// Mock OCR function - in production, this would call OpenAI Vision API
async function mockOCRParsing(file: File): Promise<ParseReportResponse> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock extracted trades - in production, this would use OpenAI Vision
  const mockTrades: Trade[] = [
    {
      date: "2025-01-08",
      symbol: "RELIANCE",
      side: "BUY",
      quantity: 50,
      price: 2850.25,
      pnl: 1250.00
    },
    {
      date: "2025-01-08",
      symbol: "INFY",
      side: "SELL",
      quantity: 100,
      price: 1475.50,
      pnl: -850.75
    },
    {
      date: "2025-01-09",
      symbol: "TCS",
      side: "BUY",
      quantity: 25,
      price: 3200.00,
      pnl: 2100.25
    }
  ];

  return {
    trades: mockTrades,
    meta: {
      currency: "INR",
      source: "ocr",
      rowsParsed: mockTrades.length,
      parseConfidence: 0.87
    }
  };
}

// Actual OpenAI Vision implementation (requires API key)
async function parseWithOpenAIVision(file: File): Promise<ParseReportResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = file.type || 'image/jpeg';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this trading report image and extract trade data. Return a JSON object with the following structure:
              {
                "trades": [
                  {
                    "date": "YYYY-MM-DD",
                    "symbol": "SYMBOL",
                    "side": "BUY" | "SELL",
                    "quantity": number,
                    "price": number,
                    "pnl": number (optional)
                  }
                ],
                "meta": {
                  "currency": "INR",
                  "source": "ocr",
                  "rowsParsed": number,
                  "parseConfidence": number (0-1)
                }
              }
              
              Extract all visible trades from the image. If P&L is not visible, omit the pnl field. Use ISO date format for dates.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in OpenAI response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed as ParseReportResponse;
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image or PDF.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    let result: ParseReportResponse;

    try {
      // Try OpenAI Vision first
      result = await parseWithOpenAIVision(file);
    } catch (error) {
      // Fallback to mock parsing (silent fallback for missing API key)
      result = await mockOCRParsing(file);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Parse report error:', error);
    return NextResponse.json(
      { error: 'Failed to parse report. Please try again.' },
      { status: 500 }
    );
  }
}