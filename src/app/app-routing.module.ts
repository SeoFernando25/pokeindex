import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from './pages/entry/entry.component';
import { FallbackComponent } from './pages/fallback/fallback.component';
import { IndexComponent } from './pages/index/index.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  { path: '', component: IndexComponent, data: { state: 'home' } },
  { path: 'search', component: SearchComponent, data: { state: 'search' } },
  { path: 'entry/:id', component: EntryComponent, data: { state: 'entry' } },
  { path: '**', component: FallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
