import { NextRequest, NextResponse } from 'next/server';
import { Trade, InsightsResponse } from '@/lib/types';
import { calculateStats } from '@/lib/trade-utils';

// Mock insights generation
function generateMockInsights(trades: Trade[]): InsightsResponse {
  const stats = calculateStats(trades);
  
  const bullets = [
    `${stats.totalTrades} trades executed with ${(stats.winRate * 100).toFixed(1)}% win rate`,
    `Generated ${stats.grossPnl >= 0 ? 'profit' : 'loss'} of ₹${Math.abs(stats.grossPnl).toLocaleString()}`,
    `Average winning trade: ₹${stats.avgWin.toLocaleString()}, Average loss: ₹${Math.abs(stats.avgLoss).toLocaleString()}`,
    `${stats.wins} winning trades vs ${stats.losses} losing trades`,
    stats.bestTrade ? `Best performance: ${stats.bestTrade.symbol} with ₹${stats.bestTrade.pnl.toLocaleString()} profit` : 'No best trade data available',
  ].filter(Boolean);

  const conclusion = `This trading period shows ${stats.winRate >= 0.6 ? 'strong' : stats.winRate >= 0.4 ? 'moderate' : 'challenging'} performance with a ${(stats.winRate * 100).toFixed(1)}% win rate. ${stats.grossPnl >= 0 ? 'The positive net P&L indicates effective trade management.' : 'Consider reviewing risk management strategies to improve profitability.'} Focus on ${stats.wins > stats.losses ? 'maintaining' : 'improving'} the current approach while ${stats.avgLoss < -1000 ? 'managing position sizing to limit large losses' : 'continuing disciplined execution'}.`;

  return {
    bullets,
    conclusion,
    stats
  };
}

// OpenAI insights generation
async function generateWithOpenAI(trades: Trade[]): Promise<InsightsResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const stats = calculateStats(trades);
  const tradesData = JSON.stringify(trades, null, 2);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert trading analyst. Analyze trade data and provide actionable insights.
          
          Return your response in this exact JSON format:
          {
            "bullets": [
              "5-8 bullet points with specific insights",
              "Include performance metrics and notable patterns",
              "Focus on actionable observations"
            ],
            "conclusion": "A single paragraph summarizing the overall trading performance, key strengths, and specific recommendations for improvement"
          }
          
          Keep insights practical and specific. Reference actual symbols, dates, and amounts when relevant.`
        },
        {
          role: 'user',
          content: `Analyze these trading results:
          
          Trade Data:
          ${tradesData}
          
          Calculated Statistics:
          - Total trades: ${stats.totalTrades}
          - Win rate: ${(stats.winRate * 100).toFixed(1)}%
          - Gross P&L: ₹${stats.grossPnl.toLocaleString()}
          - Average win: ₹${stats.avgWin.toLocaleString()}
          - Average loss: ₹${stats.avgLoss.toLocaleString()}
          - Best trade: ${stats.bestTrade ? `${stats.bestTrade.symbol} - ₹${stats.bestTrade.pnl.toLocaleString()}` : 'N/A'}
          - Worst trade: ${stats.worstTrade ? `${stats.worstTrade.symbol} - ₹${stats.worstTrade.pnl.toLocaleString()}` : 'N/A'}
          
          Provide specific, actionable insights for this Indian stock trading performance.`
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
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
    
    return {
      bullets: parsed.bullets || [],
      conclusion: parsed.conclusion || '',
      stats
    };
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trades } = body;

    if (!trades || !Array.isArray(trades)) {
      return NextResponse.json(
        { error: 'Invalid trades data provided' },
        { status: 400 }
      );
    }

    if (trades.length === 0) {
      return NextResponse.json(
        { error: 'No trades to analyze' },
        { status: 400 }
      );
    }

    let insights: InsightsResponse;

    try {
      // Try OpenAI first
      insights = await generateWithOpenAI(trades);
    } catch (error) {
      // Fallback to mock insights (silent fallback for missing API key)
      insights = generateMockInsights(trades);
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Generate insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights. Please try again.' },
      { status: 500 }
    );
  }
}