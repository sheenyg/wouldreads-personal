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
    // Only open link if not clicking on the read button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    window.open(article.link, '_blank', 'noopener,noreferrer');
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(article.id);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-accent/30",
        article.isRead && "opacity-60 bg-muted/30"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold text-lg leading-tight line-clamp-2",
              article.isRead && "text-muted-foreground"
            )}>
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {article.source}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(article.publishedAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant={article.isRead ? "default" : "outline"}
              size="sm"
              onClick={handleMarkAsRead}
              className={cn(
                "h-8 w-8 p-0",
                article.isRead && "bg-accent hover:bg-accent/90"
              )}
            >
              <Check size={14} weight={article.isRead ? "bold" : "regular"} />
            </Button>
            <ExternalLink size={16} className="text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className={cn(
          "text-sm leading-relaxed line-clamp-3",
          article.isRead ? "text-muted-foreground" : "text-foreground"
        )}>
          {article.description}
        </p>
      </CardContent>
    </Card>
  );
}