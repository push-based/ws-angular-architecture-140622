import { LetModule } from '../../../shared/rxa-custom/let';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '../icons/icon.module';
import { SearchBarComponent } from './search-bar.component';

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, LetModule, SvgIconModule],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
