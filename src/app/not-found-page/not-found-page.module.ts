import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SvgIconModule } from '../ui/component/icons/icon.module';
import { NotFoundPageComponent } from './not-found-page.component';

const routes: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [RouterModule.forChild(routes), CommonModule, SvgIconModule],
})
export class NotFoundPageModule {}
