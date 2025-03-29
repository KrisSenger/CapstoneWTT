/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/Home`; params?: Router.UnknownInputParams; } | { pathname: `/IncidentReporter`; params?: Router.UnknownInputParams; } | { pathname: `/LogbookViewer`; params?: Router.UnknownInputParams; } | { pathname: `/Login`; params?: Router.UnknownInputParams; } | { pathname: `/TripLogger`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/Home`; params?: Router.UnknownOutputParams; } | { pathname: `/IncidentReporter`; params?: Router.UnknownOutputParams; } | { pathname: `/LogbookViewer`; params?: Router.UnknownOutputParams; } | { pathname: `/Login`; params?: Router.UnknownOutputParams; } | { pathname: `/TripLogger`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/Home${`?${string}` | `#${string}` | ''}` | `/IncidentReporter${`?${string}` | `#${string}` | ''}` | `/LogbookViewer${`?${string}` | `#${string}` | ''}` | `/Login${`?${string}` | `#${string}` | ''}` | `/TripLogger${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/Home`; params?: Router.UnknownInputParams; } | { pathname: `/IncidentReporter`; params?: Router.UnknownInputParams; } | { pathname: `/LogbookViewer`; params?: Router.UnknownInputParams; } | { pathname: `/Login`; params?: Router.UnknownInputParams; } | { pathname: `/TripLogger`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
