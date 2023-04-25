import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'database-options',
  templateUrl: './database-options.component.html',
  styleUrls: ['./database-options.component.css']
})
export class DatabaseOptionsComponent implements OnInit {

  currentlyActiveButton = document.getElementById('');

  //Get all data and option element by name
  datacontainers = document.getElementsByName('container');
  optioncontainers = document.getElementsByName('option');

  constructor() { }

  ngOnInit(): void {
    this.currentlyActiveButton = document.getElementById('btn4');
    document.getElementById('btn4')?.classList.add('active');

  }

  // A function that will use all other function below to controll the admin Panel
  displayView(button: string, data: string, option: string) {
    this.load_Options(option);
    this.load_Data(data);
    this.SetActiveButtonClass(button);
  }

  //Load the datas for the specified button that was selected and disable the unselected ones
  load_Data(selected: string) {
    document.getElementById(selected)!.style.display = 'flex';

    for (let i = 0; i < this.datacontainers.length; i++) {
      if (this.datacontainers[i].id != selected) {
        this.datacontainers[i]!.style.display = 'none';
      }

    }

  }

  //Set the selected table option-container to active then go through the options and disable the unselected containers
  load_Options(selected: string) {
    document.getElementById(selected)!.style.display = 'block';

    for (let i = 0; i < this.optioncontainers.length; i++) {
      if (this.optioncontainers[i].id != selected) {
        this.optioncontainers[i]!.style.display = 'none';
        //console.log(this.optioncontainers[i].id +'\n'+this.optioncontainers[i].style.display);
      }

    }

  }
 
 //Remove the currently selected button class and give the Active class to the selected button
  SetActiveButtonClass(selected: string) {
    this.currentlyActiveButton?.classList.remove('active');

    document.getElementById(selected)?.classList.add('active');

    this.currentlyActiveButton = document.getElementById(selected);
  }

}
