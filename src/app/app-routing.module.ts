import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamaraComponent } from './Pages/camara/camara.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'camara',
    pathMatch: 'full'
  },
  {
    path: 'camara',
    component: CamaraComponent,
  },
  {
    path: '**',
    redirectTo: 'camara'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
