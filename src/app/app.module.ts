import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppShellModule } from './app-shell/app-shell.module';
import { AppComponent } from './app.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { ReadAccessInterceptor } from './read-access.interceptor';
import { SvgIconModule } from './ui/component/icons/icon.module';

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent],
  imports: [BrowserModule, AppShellModule, AppRoutingModule, SvgIconModule],
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
