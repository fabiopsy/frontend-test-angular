import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './promocoes/formulario/formulario.component';
import { PromocoesComponent } from './promocoes/promocoes.component';
import { SobreComponent } from './promocoes/sobre/sobre.component';

const routes: Routes = [
  {path: '', component: PromocoesComponent },
  {path: 'formulario', component: FormularioComponent },
  {path: 'sobre', component: SobreComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
