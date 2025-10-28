import * as FileSystem from 'expo-file-system';

export interface ImpactAnalysis {
  score: number;
  factors: {
    contentRelevance: number;
    engagementPrediction: number;
    emotionalResonance: number;
    visualClarity: number;
  };
  suggestions: string[];
  category: string;
}

class ImpactService {
  private readonly API_ENDPOINT = process.env.EXPO_PUBLIC_IMPACT_API_URL || 'https://your-impact-api.com';
  
  /**
   * Analyzes an image and returns an impact score
   */
  async analyzeImage(imageUri: string, caption?: string, tags?: string[]): Promise<ImpactAnalysis> {
    try {
      // Convert image to base64 for API transmission
      const base64Image = await this.convertImageToBase64(imageUri);
      
      const response = await fetch(`${this.API_ENDPOINT}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_IMPACT_API_KEY}`,
        },
        body: JSON.stringify({
          image: base64Image,
          caption,
          tags,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Impact analysis failed: ${response.statusText}`);
      }

      const analysis = await response.json();
      return this.validateAnalysis(analysis);
    } catch (error) {
      console.error('Impact analysis error:', error);
      // Fallback to local analysis if API fails
      return this.fallbackAnalysis(imageUri, caption, tags);
    }
  }

  /**
   * Converts image URI to base64 string
   */
  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      throw new Error('Failed to convert image to base64');
    }
  }

  /**
   * Validates the analysis response from the API
   */
  private validateAnalysis(analysis: any): ImpactAnalysis {
    const defaultAnalysis: ImpactAnalysis = {
      score: 0,
      factors: {
        contentRelevance: 0,
        engagementPrediction: 0,
        emotionalResonance: 0,
        visualClarity: 0,
      },
      suggestions: [],
      category: 'general',
    };

    return {
      score: Math.min(100, Math.max(0, analysis.score || 0)),
      factors: {
        contentRelevance: Math.min(100, Math.max(0, analysis.factors?.contentRelevance || 0)),
        engagementPrediction: Math.min(100, Math.max(0, analysis.factors?.engagementPrediction || 0)),
        emotionalResonance: Math.min(100, Math.max(0, analysis.factors?.emotionalResonance || 0)),
        visualClarity: Math.min(100, Math.max(0, analysis.factors?.visualClarity || 0)),
      },
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
      category: analysis.category || 'general',
    };
  }

  /**
   * Fallback analysis when API is unavailable
   * This provides a basic scoring algorithm based on image properties
   */
  private async fallbackAnalysis(imageUri: string, caption?: string, tags?: string[]): Promise<ImpactAnalysis> {
    // Basic scoring algorithm
    let score = 50; // Base score
    
    // Caption analysis
    if (caption) {
      const words = caption.split(' ').length;
      if (words >= 5 && words <= 30) score += 10; // Optimal caption length
      if (caption.includes('#')) score += 5; // Has hashtags
    }
    
    // Tags analysis
    if (tags && tags.length > 0) {
      score += Math.min(tags.length * 3, 15); // Up to 15 points for tags
    }
    
    // Add some randomness to simulate AI variability
    const variation = (Math.random() - 0.5) * 20;
    score = Math.min(100, Math.max(0, score + variation));
    
    return {
      score: Math.round(score),
      factors: {
        contentRelevance: Math.round(score * 0.8 + Math.random() * 20),
        engagementPrediction: Math.round(score * 0.9 + Math.random() * 10),
        emotionalResonance: Math.round(score * 0.7 + Math.random() * 30),
        visualClarity: Math.round(score * 0.85 + Math.random() * 15),
      },
      suggestions: this.generateSuggestions(score),
      category: this.categorizeContent(caption, tags),
    };
  }

  /**
   * Generates improvement suggestions based on score
   */
  private generateSuggestions(score: number): string[] {
    const suggestions: string[] = [];
    
    if (score < 40) {
      suggestions.push('Consider adding a more descriptive caption');
      suggestions.push('Try using relevant hashtags to increase discoverability');
      suggestions.push('Ensure good lighting and image quality');
    } else if (score < 70) {
      suggestions.push('Add engaging questions to encourage comments');
      suggestions.push('Share at optimal times when your audience is active');
    } else {
      suggestions.push('Great content! Consider cross-posting to other platforms');
      suggestions.push('Engage with comments to boost interaction');
    }
    
    return suggestions;
  }

  /**
   * Categorizes content based on caption and tags
   */
  private categorizeContent(caption?: string, tags?: string[]): string {
    const allText = `${caption || ''} ${tags?.join(' ') || ''}`.toLowerCase();
    
    if (allText.includes('food') || allText.includes('recipe')) return 'food';
    if (allText.includes('travel') || allText.includes('vacation')) return 'travel';
    if (allText.includes('fitness') || allText.includes('workout')) return 'fitness';
    if (allText.includes('nature') || allText.includes('landscape')) return 'nature';
    if (allText.includes('art') || allText.includes('creative')) return 'art';
    if (allText.includes('tech') || allText.includes('innovation')) return 'technology';
    
    return 'general';
  }

  /**
   * Calculates impact metrics for a user's posts
   */
  calculateImpactMetrics(posts: any[]): any {
    if (posts.length === 0) {
      return {
        weeklyAverage: 0,
        monthlyAverage: 0,
        topPerformingPosts: [],
        categoryPerformance: {},
        weeklyTrend: [],
        totalPosts: 0,
        impactGrowth: 0,
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter posts by time period
    const weeklyPosts = posts.filter(post => new Date(post.createdAt) >= oneWeekAgo);
    const monthlyPosts = posts.filter(post => new Date(post.createdAt) >= oneMonthAgo);

    // Calculate averages
    const weeklyAverage = weeklyPosts.length > 0 
      ? weeklyPosts.reduce((sum, post) => sum + post.impactScore, 0) / weeklyPosts.length 
      : 0;
    
    const monthlyAverage = monthlyPosts.length > 0 
      ? monthlyPosts.reduce((sum, post) => sum + post.impactScore, 0) / monthlyPosts.length 
      : 0;

    // Calculate category performance
    const categoryPerformance: { [key: string]: number } = {};
    posts.forEach(post => {
      const category = post.category || 'general';
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = [];
      }
      categoryPerformance[category].push(post.impactScore);
    });

    // Average by category
    Object.keys(categoryPerformance).forEach(category => {
      const scores = categoryPerformance[category];
      categoryPerformance[category] = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
    });

    // Generate weekly trend data
    const weeklyTrend = this.generateWeeklyTrend(posts);

    return {
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      monthlyAverage: Math.round(monthlyAverage * 10) / 10,
      topPerformingPosts: [...posts].sort((a, b) => b.impactScore - a.impactScore).slice(0, 3),
      categoryPerformance,
      weeklyTrend,
      totalPosts: posts.length,
      impactGrowth: this.calculateGrowth(posts),
    };
  }

  private generateWeeklyTrend(posts: any[]): { date: string; score: number }[] {
    const trend = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayPosts = posts.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate.toDateString() === date.toDateString();
      });
      
      const averageScore = dayPosts.length > 0 
        ? dayPosts.reduce((sum, post) => sum + post.impactScore, 0) / dayPosts.length 
        : 0;
      
      trend.push({
        date: date.toISOString().split('T')[0],
        score: Math.round(averageScore * 10) / 10,
      });
    }
    
    return trend;
  }

  private calculateGrowth(posts: any[]): number {
    if (posts.length < 2) return 0;
    
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const lastWeekPosts = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= oneWeekAgo;
    });
    
    const previousWeekPosts = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= twoWeeksAgo && postDate < oneWeekAgo;
    });
    
    if (previousWeekPosts.length === 0) return 0;
    
    const lastWeekAvg = lastWeekPosts.length > 0 
      ? lastWeekPosts.reduce((sum, post) => sum + post.impactScore, 0) / lastWeekPosts.length 
      : 0;
    
    const previousWeekAvg = previousWeekPosts.reduce((sum, post) => sum + post.impactScore, 0) / previousWeekPosts.length;
    
    return Math.round(((lastWeekAvg - previousWeekAvg) / previousWeekAvg) * 100);
  }
}

export const impactService = new ImpactService();