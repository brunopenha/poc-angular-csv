import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ItemListComponent} from './item-list/item-list.component';
import { Papa } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    CommonModule,
    ItemListComponent,
    AppComponent
  ],
  providers: [Papa],
  bootstrap: []
})
export class AppModule { }
