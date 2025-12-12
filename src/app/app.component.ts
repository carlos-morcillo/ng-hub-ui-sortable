import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { SeoService, SeoData } from './services/seo.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class AppComponent implements OnInit {

  navbarCollapsed = true;

  private readonly seoDataByRoute: { [key: string]: SeoData } = {
    '/': {
      title: 'ng-hub-ui-sortable | Angular Drag and Drop Library with SortableJS',
      description: 'Complete Angular library for drag and drop functionality using SortableJS. Supports arrays, FormArray, and Signals with full TypeScript support and reactive forms integration.',
      keywords: 'Angular drag and drop, SortableJS Angular, Angular 18, Angular sortable, drag drop library, Reactive Forms, FormArray sortable, Angular Signals, TypeScript drag drop',
      url: '/',
      author: 'Carlos Morcillo Fernandez'
    },
    '/sortable-array': {
      title: 'Simple Array Example | ng-hub-ui-sortable',
      description: 'Learn how to implement drag and drop with simple arrays in Angular using ng-hub-ui-sortable. Complete example with code and live demo.',
      keywords: 'Angular array sortable, drag drop array, simple sortable example, Angular drag and drop tutorial',
      url: '/sortable-array',
      author: 'Carlos Morcillo Fernandez'
    },
    '/sortable-form-array': {
      title: 'FormArray Example | ng-hub-ui-sortable',
      description: 'Integrate drag and drop with Angular Reactive Forms FormArray. Complete example showing how to make FormArray items sortable with validation support.',
      keywords: 'Angular FormArray sortable, Reactive Forms drag drop, FormArray drag and drop, Angular forms sortable',
      url: '/sortable-form-array',
      author: 'Carlos Morcillo Fernandez'
    },
    '/custom-options': {
      title: 'Custom Options Example | ng-hub-ui-sortable',
      description: 'Explore advanced customization options for ng-hub-ui-sortable. Learn how to configure animation, handle, filter, and other SortableJS options in Angular.',
      keywords: 'SortableJS options, Angular sortable configuration, custom drag drop options, sortable animation',
      url: '/custom-options',
      author: 'Carlos Morcillo Fernandez'
    },
    '/multiple-lists': {
      title: 'Multiple Lists Example | ng-hub-ui-sortable',
      description: 'Create drag and drop between multiple lists in Angular. Learn how to implement connected sortable lists with group configuration and cross-list transfers.',
      keywords: 'Angular multiple lists, drag drop between lists, connected sortables, sortable groups',
      url: '/multiple-lists',
      author: 'Carlos Morcillo Fernandez'
    },
    '/layout-builder': {
      title: 'Layout Builder Example | ng-hub-ui-sortable',
      description: 'Build a visual layout builder with drag and drop in Angular. Complete example showing how to create a grid-based layout system with sortable widgets.',
      keywords: 'Angular layout builder, drag drop builder, visual editor, sortable grid',
      url: '/layout-builder',
      author: 'Carlos Morcillo Fernandez'
    },
    '/sortable-signal': {
      title: 'Angular Signals Example | ng-hub-ui-sortable',
      description: 'Use ng-hub-ui-sortable with Angular Signals. Learn how to implement reactive drag and drop with writable signals in Angular 18+.',
      keywords: 'Angular Signals sortable, writable signals, Angular 18 signals, reactive drag drop',
      url: '/sortable-signal',
      author: 'Carlos Morcillo Fernandez'
    }
  };

  constructor(
    private router: Router,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set initial SEO data
    this.updateSeoForRoute(this.router.url);

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateSeoForRoute(event.urlAfterRedirects);
    });
  }

  private updateSeoForRoute(url: string): void {
    // Extract base route without query params or fragments
    const baseRoute = url.split('?')[0].split('#')[0];

    const seoData = this.seoDataByRoute[baseRoute] || this.seoDataByRoute['/'];

    // Add breadcrumb for non-home pages
    if (baseRoute !== '/') {
      const breadcrumbItems = [
        { name: 'Home', url: '/' },
        { name: seoData.title.split('|')[0].trim(), url: baseRoute }
      ];

      const breadcrumbData = this.seoService.createBreadcrumbStructuredData(breadcrumbItems);
      seoData.structuredData = breadcrumbData;
    } else {
      // For home page, use SoftwareApplication structured data
      seoData.structuredData = this.seoService.createSoftwareApplicationStructuredData();
    }

    this.seoService.updateMetaTags(seoData);
  }

  get showTestCases() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('showTestCases') === 'true';
    }
    return false;
  }

}
