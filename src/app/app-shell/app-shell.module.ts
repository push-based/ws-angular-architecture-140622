import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LetModule } from '../shared/rxa-custom/let';
import { HamburgerButtonModule } from '../ui/component/hamburger-button/hamburger-button.module';
import { IconRegistry } from '../ui/component/icons/icon-registry.service';
import { SvgIconModule } from '../ui/component/icons/icon.module';
import { SideDrawerModule } from '../ui/component/side-drawer/side-drawer.module';
import { DarkModeToggleModule } from '../ui/component/dark-mode-toggle/dark-mode-toggle.module';
import { SearchBarModule } from '../ui/component/search-bar/search-bar.module';
import { AppShellComponent } from './app-shell.component';
import { LazyModule } from '../shared/cdk/lazy/lazy.module';

@NgModule({
  declarations: [AppShellComponent],
  imports: [
    CommonModule,
    HamburgerButtonModule,
    LetModule,
    SideDrawerModule,
    SearchBarModule,
    DarkModeToggleModule,
    LazyModule,
    SvgIconModule,
    HttpClientModule,
    RouterModule,
  ],
  exports: [AppShellComponent],
  providers: [IconRegistry],
})
export class AppShellModule {}
