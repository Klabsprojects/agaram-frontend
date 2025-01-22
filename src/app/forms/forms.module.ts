import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { leaveTransferComponent } from '../forms/leave-transfer/leave-transfer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForeignVisitComponent } from '../forms/foreign-visit/foreign-visit.component';
import { OfficersTourComponent } from './officers-tour/officers-tour.component';
import { SafVillageComponent } from './saf-village/saf-village.component';
import { LtcComponent } from './ltc/ltc.component';
import { MedicalReimbursementComponent } from './medical-reimbursement/medical-reimbursement.component';
import { HbaComponent } from './hba/hba.component';
import { PrivateVisitsComponent } from './private-visits/private-visits.component';
import { TransferPostingComponent } from './transfer-posting/transfer-posting.component';
import { PromotionComponent } from './promotion/promotion.component';
import { LeaveComponent } from './leave/leave.component';
import { TrainingComponent } from './training/training.component';
import { CreateForeignVisitComponent } from './foreign-visit/create-foreign-visit/create-foreign-visit.component';
import { CreateSafGamesVillageComponent } from './saf-village/create-saf-games-village/create-saf-games-village.component';
import { CreatePrivateVisitComponent } from './private-visits/create-private-visit/create-private-visit.component';
import { CreateOfficerTourComponent } from './officers-tour/create-officer-tour/create-officer-tour.component';
import { CreateLtcComponent } from './ltc/create-ltc/create-ltc.component';
import { ImmovableComponent } from './immovable/immovable.component';
import { CreateImmovableComponent } from './immovable/create-immovable/create-immovable.component';
import { MovableComponent } from './movable/movable.component';
import { CreateMovableComponent } from './movable/create-movable/create-movable.component';
import { CreateMedicalReimbursementComponent } from './medical-reimbursement/create-medical-reimbursement/create-medical-reimbursement.component';
import { EducationComponent } from './education/education.component';
import { CreateEducationComponent } from './education/create-education/create-education.component';
import { IntimationComponent } from './intimation/intimation.component';
import { CreateIntimationComponent } from './intimation/create-intimation/create-intimation.component';
import { SafGamesAllocationComponent } from './saf-village/saf-games-allocation/saf-games-allocation.component';
import { CreateSafAllocationComponent } from './saf-village/create-saf-allocation/create-saf-allocation.component';
import { ApplyLeaveComponent } from './leave/apply-leave/apply-leave.component';
import { CreateTrainingComponent } from './training/create-training/create-training.component';
import { CreateTransferComponent } from './transfer-posting/create-transfer/create-transfer.component';
import { CreatePromotionComponent } from './promotion/create-promotion/create-promotion.component';
import { OfficerProfileListComponent } from '../officer-profile/officer-profile-list/officer-profile-list.component';
import { EditTransferPostingComponent } from './transfer-posting/edit-transfer-posting/edit-transfer-posting.component';
import { EditPromotionComponent } from './promotion/edit-promotion/edit-promotion.component';
import { EditLeaveComponent } from './leave/edit-leave/edit-leave.component';
import { EditTrainingComponent } from './training/edit-training/edit-training.component';
import { EditForeignVisitComponent } from './foreign-visit/edit-foreign-visit/edit-foreign-visit.component';
import { EditLtcComponent } from './ltc/edit-ltc/edit-ltc.component';
import { EditMedicalReimbursementComponent } from './medical-reimbursement/edit-medical-reimbursement/edit-medical-reimbursement.component';
import { EditPrivateVisitComponent } from './private-visits/edit-private-visit/edit-private-visit.component';
import { EditImmovableComponent } from './immovable/edit-immovable/edit-immovable.component';
import { EditMovableComponent } from './movable/edit-movable/edit-movable.component';
import { EditEducationComponent } from './education/edit-education/edit-education.component';
import { EditIntimationComponent } from './intimation/edit-intimation/edit-intimation.component';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth-guard';
import { CreateHbaComponent } from './hba/create-hba/create-hba.component';
import { GpfComponent } from './gpf/gpf.component';
import { CreateGpfComponent } from './gpf/create-gpf/create-gpf.component';
import { EditGpfComponent } from './gpf/edit-gpf/edit-gpf.component';
import { MhaidComponent } from './mhaid/mhaid.component';
import { CreateIdComponent } from './mhaid/create-id/create-id.component';
import { EditIdComponent } from './mhaid/edit-id/edit-id.component';
import { OtherGoComponent } from './uploads/other-go/other-go.component';
import { CircularsComponent } from './uploads/circulars/circulars.component';
import { UtilityformsComponent } from './uploads/utilityforms/utilityforms.component';
import { ActrulesComponent } from './uploads/actrules/actrules.component';
import { FaqComponent } from './uploads/faq/faq.component';
import { PostingTransferComponent } from './uploads/posting-transfer/posting-transfer.component';
import { SpecialEntriesComponent } from './uploads/special-entries/special-entries.component';
import { OfficerTourComponent } from './officer-tour/officer-tour.component';
import { CreateTourComponent } from './officer-tour/create-tour/create-tour.component';
import { EditTourComponent } from './officer-tour/edit-tour/edit-tour.component';

const routes : Routes = [
  { path: 'transfer-posting', component: TransferPostingComponent,data: { componentName: 'TransferPosting' },canActivate: [AuthGuard] },
  { path: 'create-transfer', component: CreateTransferComponent,canActivate: [AuthGuard] },
  { path: 'edit-transfer', component: EditTransferPostingComponent,canActivate: [AuthGuard] },
  { path: 'promotion', component: PromotionComponent,data: { componentName: 'Promotion' },canActivate: [AuthGuard]},
  { path: 'create-promotion', component: CreatePromotionComponent,canActivate: [AuthGuard] },
  { path: 'edit-promotion', component: EditPromotionComponent,canActivate: [AuthGuard] },
  { path: 'leave', component: LeaveComponent,data: { componentName: 'Leave' },canActivate: [AuthGuard] },
  { path: 'apply-leave', component: ApplyLeaveComponent,canActivate: [AuthGuard]},
  { path: 'edit-leave', component: EditLeaveComponent,canActivate: [AuthGuard] },
  { path: 'training', component: TrainingComponent,data: { componentName: 'Training' },canActivate: [AuthGuard] },
  { path: 'create-training', component: CreateTrainingComponent,canActivate: [AuthGuard] },
  { path: 'edit-training', component: EditTrainingComponent,canActivate: [AuthGuard]},
  { path:'foreign-visit',component:ForeignVisitComponent,data: { componentName: 'ForeignVisit' },canActivate: [AuthGuard]},
  { path:'create-foreign-visit',component:CreateForeignVisitComponent,canActivate: [AuthGuard]},
  { path:'edit-foreign-visit',component:EditForeignVisitComponent,canActivate: [AuthGuard]},
  { path:'saf-village-application',component:SafVillageComponent,data: { componentName: 'SAFApplication' },canActivate: [AuthGuard]},
  { path:'saf-village-allocation',component:SafGamesAllocationComponent, data: { componentName: 'SAFAllocation' },canActivate: [AuthGuard]},
  { path:'create-saf-games-village',component:CreateSafGamesVillageComponent,canActivate: [AuthGuard]},
  { path:'create-saf-allocation',component:CreateSafAllocationComponent,canActivate: [AuthGuard]},
  { path:'ltc',component:LtcComponent,data: { componentName: 'LTC' },canActivate: [AuthGuard]},
  { path:'create-ltc',component:CreateLtcComponent,canActivate: [AuthGuard]},
  { path:'edit-ltc',component:EditLtcComponent,canActivate: [AuthGuard]},
  { path:'medical-reimbursement',component:MedicalReimbursementComponent, data: { componentName: 'MedicalReimbursement' },canActivate: [AuthGuard]},
  { path:'create-medical-reimbursement',component:CreateMedicalReimbursementComponent,canActivate: [AuthGuard]},
  { path:'edit-medical-reimbursement',component:EditMedicalReimbursementComponent,canActivate: [AuthGuard]},
  { path:'hba',component:HbaComponent,canActivate: [AuthGuard]},
  { path:'create-hba',component:CreateHbaComponent,canActivate: [AuthGuard]},
  { path:'gpf',component:GpfComponent,canActivate: [AuthGuard]},
  { path:'create-gpf',component:CreateGpfComponent,canActivate: [AuthGuard]},
  { path:'edit-gpf',component:EditGpfComponent,canActivate: [AuthGuard]},
  { path:'mha-idcard',component:MhaidComponent,canActivate: [AuthGuard]},
  { path:'create-mha',component:CreateIdComponent,canActivate: [AuthGuard]},
  { path:'edit-mha',component:EditIdComponent,canActivate: [AuthGuard]},
  { path:'private-visits',component:PrivateVisitsComponent, data: { componentName: 'PrivateVisit' },canActivate: [AuthGuard]},
  { path:'create-private',component:CreatePrivateVisitComponent,canActivate: [AuthGuard]},
  { path:'edit-private-visit',component:EditPrivateVisitComponent,canActivate: [AuthGuard]},
  { path:'officers-tour',component:OfficersTourComponent,canActivate: [AuthGuard]},
  { path:'create-officer-tour',component:CreateOfficerTourComponent,canActivate: [AuthGuard]},
  { path:'immovable',component:ImmovableComponent, data: { componentName: 'Immovable' },canActivate: [AuthGuard]},
  { path:'create-immovable',component:CreateImmovableComponent,canActivate: [AuthGuard]},
  { path:'edit-immovable',component:EditImmovableComponent,canActivate: [AuthGuard]},
  { path:'movable',component:MovableComponent, data: { componentName: 'Movable' },canActivate: [AuthGuard]},
  { path:'create-movable',component:CreateMovableComponent,canActivate: [AuthGuard]},
  { path:'edit-movable',component:EditMovableComponent,canActivate: [AuthGuard]},
  { path:'education',component:EducationComponent,data: { componentName: 'Education' },canActivate: [AuthGuard]},
  { path:'create-education',component:CreateEducationComponent,canActivate: [AuthGuard]},
  { path:'edit-education',component:EditEducationComponent,canActivate: [AuthGuard]},
  { path:'intimation',component:IntimationComponent,data: { componentName: 'Intimation' },canActivate: [AuthGuard]},
  { path:'create-intimation',component:CreateIntimationComponent,canActivate: [AuthGuard]},
  { path:'edit-intimation',component:EditIntimationComponent,canActivate: [AuthGuard]},
  { path:'officer-profile',component:OfficerProfileListComponent,data: { componentName: 'OfficerProfile' },canActivate: [AuthGuard]},
  { path:'othergo',component:OtherGoComponent,data: { componentName: 'OtherGo' },canActivate: [AuthGuard]},
  { path:'circular',component:CircularsComponent,data: { componentName: 'Circulars' },canActivate: [AuthGuard]},
  { path:'utility',component:UtilityformsComponent,data: { componentName: 'Utilityforms' },canActivate: [AuthGuard]},
  { path:'act-rule',component:ActrulesComponent,data: { componentName: 'Actrules' },canActivate: [AuthGuard]},
  { path:'faq',component:FaqComponent,data: { componentName: 'Faq' },canActivate: [AuthGuard]},
  { path:'post-transfer',component:PostingTransferComponent,data: { componentName: 'PostingTransfer' },canActivate: [AuthGuard]},
  { path:'special-entry',component:SpecialEntriesComponent,data: { componentName: 'SpecialEntries' },canActivate: [AuthGuard]},
  { path:'officer-tour',component:OfficerTourComponent,data: { componentName: 'OfficerTour' },canActivate: [AuthGuard]},
  { path:'create-officers-tour',component:CreateTourComponent,data: { componentName: 'CreateTour' },canActivate: [AuthGuard]},
  { path:'edit-officers-tour',component:EditTourComponent,canActivate: [AuthGuard]},
]

@NgModule({
  declarations: [
    leaveTransferComponent,
    ForeignVisitComponent,
    OfficersTourComponent,
    SafVillageComponent,
    LtcComponent,
    MedicalReimbursementComponent,
    HbaComponent,
    CreateHbaComponent,
    PrivateVisitsComponent,
    TransferPostingComponent,
    PromotionComponent,
    LeaveComponent,
    TrainingComponent,
    CreateSafGamesVillageComponent,
    CreatePrivateVisitComponent,
    CreateOfficerTourComponent,
    CreateForeignVisitComponent,
    CreateLtcComponent,
    ImmovableComponent,
    CreateImmovableComponent,
    MovableComponent,
    CreateMovableComponent,
    CreateMedicalReimbursementComponent,
    EducationComponent,
    CreateEducationComponent,
    IntimationComponent,
    CreateIntimationComponent,
    SafGamesAllocationComponent,
    CreateSafAllocationComponent,
    ApplyLeaveComponent,
    CreateTrainingComponent,
    CreateTransferComponent,
    CreatePromotionComponent,
    EditTransferPostingComponent,
    EditPromotionComponent,
    EditLeaveComponent,
    EditTrainingComponent,
    EditForeignVisitComponent,
    EditLtcComponent,
    EditMedicalReimbursementComponent,
    EditPrivateVisitComponent,
    EditImmovableComponent,
    EditMovableComponent,
    EditEducationComponent,
    EditIntimationComponent,
    OfficerProfileListComponent,
    GpfComponent,
    CreateGpfComponent,
    EditGpfComponent,
    MhaidComponent,
    CreateIdComponent,
    EditIdComponent,
    OtherGoComponent,
    CircularsComponent,
    UtilityformsComponent,
    ActrulesComponent,
    FaqComponent,
    PostingTransferComponent,
    SpecialEntriesComponent,
    OfficerTourComponent,
    CreateTourComponent,
    EditTourComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  providers:[]
})
export class FormModule { }
