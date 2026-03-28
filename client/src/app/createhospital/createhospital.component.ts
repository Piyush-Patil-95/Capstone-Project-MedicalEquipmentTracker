import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss']
})
export class CreatehospitalComponent implements OnInit {
  itemForm!: FormGroup;
  equipmentForm!: FormGroup;
  formModel:any={status:null};
  showError:boolean=false;
  errorMessage:any;
  hospitalList:any=[
    {name:"Taj hospital", location:"mumbai"},
    {name:"Oberoy hospital", location:"mumbai"},
  ]; 
  assignModel: any={};
  showMessage: any;
  responseMessage: any
 
  //todo: Complete missing code..
  
  constructor(private fb:FormBuilder, private service:HttpService, private router:Router){
    this.itemForm = this.fb.group({
      name:['', Validators.required],
      location:['', Validators.required]
    })

    this.equipmentForm = this.fb.group({
      name:['', Validators.required],
      description:['', Validators.required],
      hospitalId:['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getHospital();
  }

  getHospital(){
    this.service.getHospital().subscribe(data=>{
      this.hospitalList = data
    })
  }

  onSubmit(){
    if(this.itemForm.invalid){
      this.itemForm.markAllAsTouched()
      this.showError = true;
      this.errorMessage = "Please find all required hospital fields"
    }
    if(this.itemForm.valid){
      this.service.createHospital(this.itemForm.value).subscribe(()=>{
        this.router.navigate(['/dashboard'])
      })
    }
    

  }

  addEquipment(equipment:any){
    this.service.addEquipment(equipment).subscribe(()=>{
      this.router.navigate(['/dashboard'])
    })
  }

  submitEquipment(){
    if(this.equipmentForm.invalid){
      this.equipmentForm.markAllAsTouched()
      this.showError = true;
      this.errorMessage = "Please find all required equipment fields"
    }

    const payload = {
      name:this.equipmentForm.value.name,
      description: this.equipmentForm.value.description,
      hospitalId: this.equipmentForm.value.hospitalI
      
    }

    this.service.addEquipment(payload).subscribe(()=>{
      this.router.navigate(['/dashboard'])
    })
  }




  
}
