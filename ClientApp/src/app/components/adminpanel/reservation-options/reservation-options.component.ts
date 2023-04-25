import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'reservation-options',
  templateUrl: './reservation-options.component.html',
  styleUrls: ['./reservation-options.component.css']
})
export class ReservationOptionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  load_AddReservation() {
    
    document.getElementById('reservation_datablock1')!.style.display = 'block';
    document.getElementById('reservation_datablock2')!.style.display = 'block';

    document.getElementById('reservation_datablock3')!.style.display = 'none';

    document.getElementById('reservation_datablock4')!.style.display = 'none';
    document.getElementById('reservation_datablock5')!.style.display = 'none';

   
  }

  load_DeleteReservation() {
    
    document.getElementById('reservation_datablock1')!.style.display = 'none';
    document.getElementById('reservation_datablock2')!.style.display = 'none';

    document.getElementById('reservation_datablock3')!.style.display = 'block';

    document.getElementById('reservation_datablock4')!.style.display = 'none';
    document.getElementById('reservation_datablock5')!.style.display = 'none';

    
  }

  load_UpdateReservation() {
    
    document.getElementById('reservation_datablock4')!.style.display = 'block';
    document.getElementById('reservation_datablock5')!.style.display = 'block';

    document.getElementById('reservation_datablock1')!.style.display = 'none';
    document.getElementById('reservation_datablock2')!.style.display = 'none';

    document.getElementById('reservation_datablock3')!.style.display = 'none';

    
  }

}
