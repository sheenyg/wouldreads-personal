import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArticleCard } from "@/components/ArticleCard";
import { RefreshCw, Gear, Calendar, Shuffle } from "@phosphor-icons/react";
import { Article } from "@/lib/types";
import { aggregateArticles } from "@/lib/rss";
import { randomizeArticlesBySource, normalizeArticles } from "@/lib/utils";
import { toast, Toaster } from 'sonner';

function App() {
    const [articles, setArticles] = useKV<Article[]>("articles", []);
    const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
    const [readArticleIds, setReadArticleIds] = useKV<string[]>("read-articles", []);
    const [isLoading, setIsLoading] = useState(false);
    const [liveRss, setLiveRss] = useKV<boolean>("live-rss", true);
    const [lastFetch, setLastFetch] = useKV<string>("last-fetch", "");

    const loadArticles = async () => {
        setIsLoading(true);
        try {
            const freshArticles = await aggregateArticles();
            
            // Merge read status from existing articles
            const readSet = new Set(readArticleIds);
            const articlesWithReadStatus = freshArticles.map(article => ({
                ...article,
                isRead: readSet.has(article.id)
            }));
            
            setArticles(articlesWithReadStatus);
            setLastFetch(new Date().toISOString());
            toast.success(`Loaded ${freshArticles.length} articles`);
        } catch (error) {
            console.error('Failed to load articles:', error);
            toast.error('Failed to load articles. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const shuffleArticles = () => {
        const normalizedArticles = normalizeArticles(articles);
        const shuffled = randomizeArticlesBySource(normalizedArticles);
        setDisplayedArticles(shuffled);
        
        // Count articles by source for toast message
        const sourceCount = shuffled.reduce((acc, article) => {
            acc[article.source] = (acc[article.source] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const sourcesWithMultiple = Object.entries(sourceCount)
            .filter(([_, count]) => count >= 2)
            .length;
            
        toast.success(`Shuffled articles - ${sourcesWithMultiple} sources with 2+ articles`);
    };

    const handleMarkAsRead = (articleId: string) => {
        setReadArticleIds(currentReadIds => {
            const readSet = new Set(currentReadIds);
            if (readSet.has(articleId)) {
                readSet.delete(articleId);
            } else {
                readSet.add(articleId);
            }
            return Array.from(readSet);
        });

        // Update both articles and displayedArticles
        const updateReadStatus = (articlesList: Article[]) => 
            articlesList.map(article => 
                article.id === articleId 
                    ? { ...article, isRead: !article.isRead }
                    : article
            );

        setArticles(currentArticles => updateReadStatus(currentArticles));
        setDisplayedArticles(currentDisplayed => updateReadStatus(currentDisplayed));
    };

    // Load articles on mount if we don't have any
    useEffect(() => {
        if (articles.length === 0) {
            loadArticles();
        } else {
            // Normalize articles when loading from storage to ensure dates are Date objects
            const normalizedArticles = normalizeArticles(articles);
            setArticles(normalizedArticles);
        }
    }, []);

    // Randomize displayed articles when articles change
    useEffect(() => {
        if (articles.length > 0) {
            const normalizedArticles = normalizeArticles(articles);
            const randomized = randomizeArticlesBySource(normalizedArticles);
            setDisplayedArticles(randomized);
        } else {
            setDisplayedArticles([]);
        }
    }, [articles]);

    // Update read status when readArticleIds changes
    useEffect(() => {
        const readSet = new Set(readArticleIds);
        const updateReadStatus = (articlesList: Article[]) => 
            articlesList.map(article => ({
                ...article,
                isRead: readSet.has(article.id)
            }));

        setArticles(currentArticles => updateReadStatus(currentArticles));
        setDisplayedArticles(currentDisplayed => updateReadStatus(currentDisplayed));
    }, [readArticleIds]);

    const readCount = displayedArticles.filter(article => article.isRead).length;
    const totalCount = displayedArticles.length;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-primary mb-4 title-font">wouldreads</h1>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Automatic article recommendations from my favorite tech + culture news sources
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            className="gap-2 h-10"
                        >
                            <Gear size={16} />
                            Manage Sources
                        </Button>
                        
                        <Button 
                            onClick={loadArticles} 
                            disabled={isLoading}
                            variant="outline"
                            className="gap-2 h-10"
                        >
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refresh Articles
                        </Button>
                        
                        <Button 
                            onClick={shuffleArticles} 
                            disabled={displayedArticles.length === 0}
                            variant="outline"
                            className="gap-2 h-10"
                        >
                            <Shuffle size={16} />
                            Shuffle Order
                        </Button>
                        
                        <div className="flex items-center gap-3">
                            <Switch 
                                checked={liveRss} 
                                onCheckedChange={setLiveRss}
                                className="data-[state=checked]:bg-primary"
                            />
                            <span className="text-sm font-medium">Live RSS</span>
                        </div>
                    </div>
                    
                    <Button variant="outline" className="gap-2 h-10">
                        <Calendar size={16} />
                        Today's selection
                    </Button>
                </div>

                {/* Articles Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-center mb-4 title-font">Today's Curated Articles</h2>
                    <div className="text-center text-muted-foreground mb-8">
                        <span>{readCount} of {totalCount} articles read</span>
                        <span className="mx-2">•</span>
                        <span>
                            {displayedArticles.length > 0 && (() => {
                                const sourceCounts = displayedArticles.reduce((acc, article) => {
                                    acc[article.source] = (acc[article.source] || 0) + 1;
                                    return acc;
                                }, {} as Record<string, number>);
                                
                                const sourcesWithMultiple = Object.values(sourceCounts).filter(count => count >= 2).length;
                                const totalSources = Object.keys(sourceCounts).length;
                                
                                return `${totalSources} sources (${sourcesWithMultiple} with 2+ articles)`;
                            })()}
                        </span>
                    </div>
                </div>

                {/* Articles List */}
                <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-6">
                        {displayedArticles.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <Calendar size={48} className="text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                    No articles loaded
                                </h3>
                                <p className="text-muted-foreground">
                                    Click "Refresh Articles" to load the latest articles
                                </p>
                            </div>
                        )}
                        
                        {isLoading && displayedArticles.length === 0 && (
                            <div className="text-center py-12">
                                <RefreshCw size={48} className="text-muted-foreground mx-auto mb-4 animate-spin" />
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                    Loading articles...
                                </h3>
                                <p className="text-muted-foreground">
                                    Fetching the latest articles from your favorite sources
                                </p>
                            </div>
                        )}
                        
                        {displayedArticles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                onMarkAsRead={handleMarkAsRead}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
            
            {/* Footer */}
            <footer className="text-center py-8 text-muted-foreground text-sm">
                <p>Made with love by GitHub Spark and Sheena Ganju</p>
            </footer>
            
            <Toaster />
        </div>
    );
}

export default App;