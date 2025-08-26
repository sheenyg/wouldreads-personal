import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Check } from "@phosphor-icons/react";
import { Article } from "@/lib/types";
import { formatTimeAgo } from "@/lib/rss";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  onMarkAsRead: (articleId: string) => void;
}

export function ArticleCard({ article, onMarkAsRead }: ArticleCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Only open link if not clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    window.open(article.link, '_blank', 'noopener,noreferrer');
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(article.id);
  };

  const handleReadFullArticle = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
        article.isRead ? "opacity-75 bg-muted/20 border-border/50" : "border-border hover:border-primary/20"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-bold text-xl leading-tight mb-3 title-font",
              article.isRead ? "text-muted-foreground" : "text-foreground"
            )}>
              {article.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm text-foreground">
                {article.source}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(article.publishedAt)}
              </span>
            </div>
          </div>
          <Button
            variant={article.isRead ? "default" : "default"}
            size="sm"
            onClick={handleMarkAsRead}
            className={cn(
              "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 h-auto rounded-md",
              article.isRead && "bg-muted hover:bg-muted/90 text-muted-foreground"
            )}
          >
            {article.isRead ? (
              <>
                <Check size={14} className="mr-1" />
                Read
              </>
            ) : (
              "Mark Read"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <p className={cn(
          "text-base leading-relaxed mb-4",
          article.isRead ? "text-muted-foreground" : "text-foreground"
        )}>
          {article.description}
        </p>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleReadFullArticle}
          className="gap-2 text-sm"
        >
          <ExternalLink size={14} />
          Read Full Article
        </Button>
      </CardContent>
    </Card>
  );
}