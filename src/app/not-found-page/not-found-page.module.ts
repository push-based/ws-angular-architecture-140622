import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';
import { SvgIconModule } from '../ui/component/icons/icon.module';

const routes: Routes = [
  {
    path: 'list/:category',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class NotFoundPageModule {}
