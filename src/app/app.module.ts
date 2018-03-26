import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TicTacToeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
            { path: 'welcome', component: WelcomeComponent },
            { path: 'tictactoe', component: TicTacToeComponent },
            { path: '', redirectTo: 'welcome', pathMatch: 'full' },
            { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
        ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
