import {NgModule} from "@angular/core";
import {HomeComponent} from "./pages/home/home.component";
import {ParticipantsListComponent} from "./pages/participantsList/participantsList.component";
import {ActivitiesComponent} from "./pages/activities/activities.component";
import {ActivityComponent} from "./pages/activities/activity/activity.component";
import {RouterModule, Routes} from "@angular/router";
import {FonComponent} from "./fon.component";

const routes: Routes = [
  {path: '', component: FonComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'patients', component: ParticipantsListComponent},
      {path: 'participantList', component: ParticipantsListComponent},
      {path: 'patient/:guid', component: ActivitiesComponent, children: [
          {path: ':activity', component: ActivityComponent}
        ]}
    ]},

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class fonRoutingModule {}
