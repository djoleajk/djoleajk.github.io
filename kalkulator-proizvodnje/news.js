// ============================================
// RSS ВЕСТИ - Најновије вести из Србије
// Користи rss2json API (бесплатан, без кључа)
// ============================================

class NewsRSS {
    constructor() {
        this.rssFeeds = [
            // РТС Вести
            'http://www.rts.rs/page/stories/ci/rss.html',
            // Б92 Вести
            'https://www.b92.net/info/rss/najnovije.xml',
            // Н1 Вести
            'http://rs.n1info.com/rss/104/Vesti'
        ];
        this.currentFeedIndex = 0;
        this.maxNews = 5;
        this.lastUpdate = null;
    }

    /**
     * Преузми вести са RSS feed-а
     */
    async fetchNews() {
        try {
            // Користи rss2json API за парсирање RSS-а (решава CORS проблем)
            const rssUrl = this.rssFeeds[this.currentFeedIndex];
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Грешка при учитавању вести');
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error('RSS Feed није доступан');
            }
            
            this.lastUpdate = new Date();
            console.log('✓ Вести учитане');
            
            return data;
        } catch (error) {
            console.warn('⚠ Грешка при преузимању вести:', error.message);
            
            // Покушај са следећим RSS feed-ом
            this.currentFeedIndex = (this.currentFeedIndex + 1) % this.rssFeeds.length;
            
            return null;
        }
    }

    /**
     * Форматирај време објављивања
     */
    formatTimeAgo(dateString) {
        const now = new Date();
        const pubDate = new Date(dateString);
        const diffMs = now - pubDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) {
            return 'управо сада';
        } else if (diffMins < 60) {
            return `пре ${diffMins} мин`;
        } else if (diffHours < 24) {
            return `пре ${diffHours} ${diffHours === 1 ? 'сат' : diffHours <= 4 ? 'сата' : 'сати'}`;
        } else if (diffDays === 1) {
            return 'јуче';
        } else if (diffDays < 7) {
            return `пре ${diffDays} дана`;
        } else {
            return pubDate.toLocaleDateString('sr-RS');
        }
    }

    /**
     * Скрати текст за приказ
     */
    truncateText(text, maxLength = 150) {
        if (!text) return '';
        
        // Уклони HTML тагове
        text = text.replace(/<[^>]*>/g, '');
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Прикажи вести на страници
     */
    async displayNews(containerId = 'newsWidget') {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error('News container није пронађен:', containerId);
            return;
        }

        // Приказ loading
        container.innerHTML = '<div class="news-loading">📰 Учитавам вести...</div>';

        // Преузми вести
        const data = await this.fetchNews();
        
        if (!data || !data.items || data.items.length === 0) {
            container.innerHTML = '<div class="news-error">⚠️ Вести тренутно нису доступне</div>';
            return;
        }

        // Узми само првих N вести
        const newsItems = data.items.slice(0, this.maxNews);
        const feedTitle = data.feed.title || 'Вести';

        // Креирај HTML
        let html = `
            <div class="news-card">
                <div class="news-header">
                    <div class="news-title">
                        📰 ${feedTitle}
                    </div>
                    <div class="news-time">
                        Ажурирано: ${this.lastUpdate.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div class="news-list">
        `;

        newsItems.forEach((item, index) => {
            const timeAgo = this.formatTimeAgo(item.pubDate);
            const description = this.truncateText(item.description || item.content, 120);
            
            html += `
                <div class="news-item" onclick="window.open('${item.link}', '_blank')">
                    <div class="news-item-content">
                        <div class="news-item-title">${item.title}</div>
                        ${description ? `<div class="news-item-description">${description}</div>` : ''}
                        <div class="news-item-meta">
                            <span class="news-item-time">🕐 ${timeAgo}</span>
                        </div>
                    </div>
                    <div class="news-item-arrow">→</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Аутоматско освежавање сваких 10 минута
        setTimeout(() => {
            this.displayNews(containerId);
        }, 10 * 60 * 1000);
    }
}

// Креирај глобалну инстанцу
const newsRSS = new NewsRSS();

// Аутоматски покрени приказ вести када се страна учита
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('newsWidget')) {
            newsRSS.displayNews();
        }
    });
} else {
    if (document.getElementById('newsWidget')) {
        newsRSS.displayNews();
    }
}

