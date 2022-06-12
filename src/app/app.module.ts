import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppShellModule } from './app-shell/app-shell.module';
import { AppComponent } from './app.component';
import { MovieListPageModule } from './movie/movie-list-page/movie-list-page.module';
import { ReadAccessInterceptor } from './read-access.interceptor';
import { SvgIconModule } from './ui/component/icons/icon.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    MovieListPageModule,
    BrowserModule,
    AppShellModule,
    AppRoutingModule,
    SvgIconModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ReadAccessInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
