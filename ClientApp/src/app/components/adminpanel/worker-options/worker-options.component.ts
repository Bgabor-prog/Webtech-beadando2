import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'worker-options',
  templateUrl: './worker-options.component.html',
  styleUrls: ['./worker-options.component.css']
})
export class WorkerOptionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  load_AddWorker() {
    document.getElementById('worker_datablock1')!.style.display = 'block';
    document.getElementById('worker_datablock2')!.style.display = 'block';

    document.getElementById('worker_datablock3')!.style.display = 'none';

    document.getElementById('worker_datablock4')!.style.display = 'none';
    document.getElementById('worker_datablock5')!.style.display = 'none';

  }

  load_DeleteWorker() {
    document.getElementById('worker_datablock1')!.style.display = 'none';
    document.getElementById('worker_datablock2')!.style.display = 'none';

    document.getElementById('worker_datablock3')!.style.display = 'block';

    document.getElementById('worker_datablock4')!.style.display = 'none';
    document.getElementById('worker_datablock5')!.style.display = 'none';

  
  }

  load_UpdateWorker() {
    document.getElementById('worker_datablock4')!.style.display = 'block';
    document.getElementById('worker_datablock5')!.style.display = 'block';

    document.getElementById('worker_datablock1')!.style.display = 'none';
    document.getElementById('worker_datablock2')!.style.display = 'none';

    document.getElementById('worker_datablock3')!.style.display = 'none';

   
  }

}


