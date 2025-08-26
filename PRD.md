# wouldreads - News Aggregation Platform

A curated news aggregation platform that automatically fetches and displays 50 articles daily from premium tech and culture news sources, providing a clean reading experience with progress tracking.

**Experience Qualities**:
1. **Curated** - Thoughtfully selected sources provide high-quality, relevant content without noise
2. **Efficient** - Quick scanning and reading progress tracking helps users stay informed without overwhelm
3. **Clean** - Minimal, distraction-free interface focuses attention on content discovery and consumption

**Complexity Level**: Light Application (multiple features with basic state)
- Handles RSS feed parsing, article aggregation, read state management, and source filtering with persistent user preferences

## Essential Features

### Article Aggregation
- **Functionality**: Fetches up to 50 articles daily from 6 specified RSS feeds
- **Purpose**: Provides curated, high-quality content from trusted tech and culture sources
- **Trigger**: Automatic on page load, with manual refresh capability
- **Progression**: Load feeds → Parse RSS → Deduplicate → Sort by date → Display cards
- **Success criteria**: Articles load within 3 seconds, sources are clearly attributed, no duplicates appear

### Article Display Cards
- **Functionality**: Shows article title, source, date, and description in card format
- **Purpose**: Enables quick content scanning and informed reading decisions
- **Trigger**: After successful feed aggregation
- **Progression**: Render cards → Display metadata → Enable click interaction → Open external links
- **Success criteria**: All metadata visible, cards are clickable, external links open correctly

### Read State Management
- **Functionality**: Mark articles as read with visual indication and persistent storage
- **Purpose**: Track reading progress and avoid re-reading content
- **Trigger**: User clicks "mark as read" button on any article card
- **Progression**: Click button → Update visual state → Store in persistence → Maintain across sessions
- **Success criteria**: Read state persists between sessions, visual distinction is clear

### Source Attribution
- **Functionality**: Clear source identification with consistent branding
- **Purpose**: Builds trust and helps users recognize preferred sources
- **Trigger**: Displays automatically with each article
- **Progression**: Parse source from RSS → Map to clean source name → Display prominently
- **Success criteria**: All sources are correctly identified and consistently formatted

## Edge Case Handling

- **Feed Unavailable**: Display cached articles with "some sources unavailable" notice
- **No Network**: Show last cached articles with offline indicator
- **Malformed RSS**: Skip problematic feeds, log errors, continue with working sources
- **Duplicate Articles**: Deduplicate by title similarity and URL matching
- **Missing Metadata**: Use fallback values (source name for missing titles, "No description" for missing content)

## Design Direction

The design should feel sophisticated and editorial, like a premium digital magazine, with generous whitespace and typography that invites focused reading rather than hurried scanning.

## Color Selection

Triadic color scheme creating visual interest while maintaining readability and professional credibility.

- **Primary Color**: Deep Editorial Blue (oklch(0.25 0.15 250)) - Communicates trust, professionalism, and editorial authority
- **Secondary Colors**: Warm Off-White (oklch(0.97 0.01 85)) for cards and Cool Charcoal (oklch(0.15 0.02 250)) for text hierarchy
- **Accent Color**: Energetic Orange (oklch(0.65 0.18 45)) - Draws attention to interactive elements and read status
- **Foreground/Background Pairings**: 
  - Background (Off-White oklch(0.98 0.005 85)): Charcoal text (oklch(0.15 0.02 250)) - Ratio 12.1:1 ✓
  - Card (Warm Off-White oklch(0.97 0.01 85)): Charcoal text (oklch(0.15 0.02 250)) - Ratio 11.8:1 ✓
  - Primary (Deep Blue oklch(0.25 0.15 250)): White text (oklch(0.98 0 0)) - Ratio 8.9:1 ✓
  - Accent (Orange oklch(0.65 0.18 45)): White text (oklch(0.98 0 0)) - Ratio 4.6:1 ✓

## Font Selection

Typography should convey editorial sophistication and excellent readability, using Inter for its technical precision and excellent screen rendering.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Subtitle): Inter Regular/16px/normal letter spacing, muted color
  - H3 (Article Title): Inter Semibold/18px/tight letter spacing
  - Body (Description): Inter Regular/14px/relaxed line height (1.6)
  - Caption (Source/Date): Inter Medium/12px/normal letter spacing, accent color

## Animations

Subtle, purposeful animations that enhance the editorial experience without distraction, emphasizing content over interface flourishes.

- **Purposeful Meaning**: Gentle hover effects on cards suggest interactivity; smooth state transitions for read status reinforce user actions
- **Hierarchy of Movement**: Article cards receive primary animation focus; secondary elements like buttons use minimal, fast transitions

## Component Selection

- **Components**: Card for articles, Button for actions, Badge for sources, Separator for visual hierarchy, ScrollArea for article list
- **Customizations**: Custom article card layout, enhanced button states for read/unread actions
- **States**: Cards show hover, read/unread visual states; buttons show loading during feed fetches
- **Icon Selection**: ExternalLink for article links, Check for read status, RefreshCw for manual refresh
- **Spacing**: Consistent 4-unit (16px) gaps between cards, 2-unit (8px) internal card padding
- **Mobile**: Single column layout, larger touch targets, collapsible source filters, card spacing adjusts to 3-unit gaps