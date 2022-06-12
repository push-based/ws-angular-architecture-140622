import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeToggleComponent } from './dark-mode-toggle.component';
import { LetModule } from '../../../shared/rxa-custom/let';

@NgModule({
  declarations: [DarkModeToggleComponent],
  exports: [DarkModeToggleComponent],
  imports: [CommonModule, LetModule],
})
export class DarkModeToggleModule {}
