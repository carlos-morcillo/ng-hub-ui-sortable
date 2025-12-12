import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  structuredData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = 'https://carlos-morcillo.github.io/ng-hub-ui-sortable';
  private readonly defaultImage = 'https://raw.githubusercontent.com/carlos-morcillo/ng-hub-ui-sortable/master/docs/og-image.png';
  private readonly siteName = 'ng-hub-ui-sortable';

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  updateMetaTags(seoData: SeoData): void {
    const fullUrl = seoData.url ? `${this.baseUrl}${seoData.url}` : this.baseUrl;
    const imageUrl = seoData.image || this.defaultImage;

    // Update title
    this.title.setTitle(seoData.title);

    // Update basic meta tags
    this.meta.updateTag({ name: 'description', content: seoData.description });

    if (seoData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoData.keywords });
    }

    // Update Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: seoData.title });
    this.meta.updateTag({ property: 'og:description', content: seoData.description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: `${seoData.title} - ${this.siteName}` });
    this.meta.updateTag({ property: 'og:url', content: fullUrl });
    this.meta.updateTag({ property: 'og:type', content: seoData.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Update Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seoData.title });
    this.meta.updateTag({ name: 'twitter:description', content: seoData.description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: `${seoData.title} - ${this.siteName}` });

    if (seoData.author) {
      this.meta.updateTag({ name: 'author', content: seoData.author });
      this.meta.updateTag({ name: 'twitter:creator', content: seoData.author });
    }

    // Update canonical link
    this.updateCanonicalUrl(fullUrl);

    // Update structured data if provided
    if (seoData.structuredData) {
      this.updateStructuredData(seoData.structuredData);
    }
  }

  updateCanonicalUrl(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
      }

      link.setAttribute('href', url);
    }
  }

  updateStructuredData(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      // Remove existing structured data scripts added by this service
      const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]');
      existingScripts.forEach(script => script.remove());

      // Add new structured data
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic', 'true');
      script.text = JSON.stringify(data);
      this.document.head.appendChild(script);
    }
  }

  createBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): any {
    const baseUrl = this.baseUrl;

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${baseUrl}${item.url}`
      }))
    };
  }

  createSoftwareApplicationStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'ng-hub-ui-sortable',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Any',
      'description': 'Angular library for drag and drop functionality using SortableJS. Supports arrays, FormArray, and Signals with full TypeScript support.',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'author': {
        '@type': 'Person',
        'name': 'Carlos Morcillo Fernandez',
        'url': 'https://www.carlosmorcillo.com/'
      },
      'programmingLanguage': 'TypeScript',
      'license': 'https://creativecommons.org/licenses/by/4.0/',
      'url': this.baseUrl,
      'codeRepository': 'https://github.com/carlos-morcillo/ng-hub-ui-sortable'
    };
  }

  createHowToStructuredData(name: string, description: string, steps: Array<{ name: string; text: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': name,
      'description': description,
      'step': steps.map((step, index) => ({
        '@type': 'HowToStep',
        'position': index + 1,
        'name': step.name,
        'text': step.text
      }))
    };
  }
}
