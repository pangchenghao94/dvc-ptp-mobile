import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = HomePage;
  rootPage: any = "LoginPage";
  activePage: any;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', icon: "home" },
      { title: 'I & D', component: 'InDListPage', icon: "list-box" },    
      { title: 'Profile', component: 'ProfilePage', icon: "person" },              
      { title: 'Logout', component: null, icon: "log-out"}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      if(this.platform.is("android")){
        this.statusBar.styleBlackOpaque();
      }
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component){
      this.nav.setRoot(page.component);
    }
    else{
      this.nav.setRoot('LoginPage');
    }
  }

  checkActive(page){
    return page == this.activePage;
  }
}
