import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArticleCard } from "@/components/ArticleCard";
import { RefreshCw, Newspaper } from "@phosphor-icons/react";
import { Article } from "@/lib/types";
import { aggregateArticles } from "@/lib/rss";
import { toast, Toaster } from 'sonner';

function App() {
    const [articles, setArticles] = useKV<Article[]>("articles", []);
    const [readArticleIds, setReadArticleIds] = useKV<string[]>("read-articles", []);
    const [isLoading, setIsLoading] = useState(false);
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

        setArticles(currentArticles => 
            currentArticles.map(article => 
                article.id === articleId 
                    ? { ...article, isRead: !article.isRead }
                    : article
            )
        );
    };

    // Load articles on mount if we don't have any
    useEffect(() => {
        if (articles.length === 0) {
            loadArticles();
        }
    }, []);

    // Update read status when readArticleIds changes
    useEffect(() => {
        const readSet = new Set(readArticleIds);
        setArticles(currentArticles => 
            currentArticles.map(article => ({
                ...article,
                isRead: readSet.has(article.id)
            }))
        );
    }, [readArticleIds]);

    const readCount = articles.filter(article => article.isRead).length;
    const totalCount = articles.length;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Newspaper size={32} className="text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">wouldreads</h1>
                    </div>
                    <p className="text-muted-foreground text-lg mb-6">
                        Automatic article recommendations from my favorite tech + culture news sources
                    </p>
                    
                    {/* Stats and Refresh */}
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-2">
                        <span>{totalCount} articles</span>
                        <span>•</span>
                        <span>{readCount} read</span>
                        <span>•</span>
                        <span>
                            {lastFetch ? `Updated ${new Date(lastFetch).toLocaleTimeString()}` : 'Not loaded'}
                        </span>
                    </div>
                    
                    <Button 
                        onClick={loadArticles} 
                        disabled={isLoading}
                        className="gap-2"
                        size="sm"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        {isLoading ? 'Loading...' : 'Refresh Articles'}
                    </Button>
                </div>

                {/* Articles List */}
                <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                        {articles.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <Newspaper size={48} className="text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                    No articles loaded
                                </h3>
                                <p className="text-muted-foreground">
                                    Click "Refresh Articles" to load the latest articles
                                </p>
                            </div>
                        )}
                        
                        {isLoading && articles.length === 0 && (
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
                        
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                onMarkAsRead={handleMarkAsRead}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <Toaster />
        </div>
    );
}

export default App;