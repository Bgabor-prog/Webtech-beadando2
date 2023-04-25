import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit, asNativeElements, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { discardPeriodicTasks } from '@angular/core/testing';
import { NavigationExtras, Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'room-svgs',
  templateUrl: './601_Room.svg',
  styleUrls: ['./room-svgs.component.css']
})
export class RoomSVGsComponent implements OnInit {
  @Output() deskClick = new EventEmitter<string>();
  @ViewChild('chairGroup', { static: true }) chairGroup!: ElementRef;

  @Input() svgUrl!: string;

  isAnimating = false;
  canMoveChair: boolean = true;

  reservations!: any[];
  reservedDeskIds: string[] = [];
  reservedDeskIdsAsNumbers: number[] = [];

  currentlySelected!: string;
  IsOneDeskIdEmitted: boolean = false;

  IsOneDeskSelected: boolean = false;
  whichOneIsSelected!: string;
  selectedDeskElement!: HTMLElement | null;

  desks = document.getElementsByName("desk");

  deskId: string = '';

  hoveredElement!: HTMLElement;
  getStatus!: string | null;

  constructor(private reservationService: ReservationService, private userService: UserService, private router: Router, private http: HttpClient) {
    this.isAnimating = false;
  }

  ngOnInit() {
    // Initialize with a default date range, or skip this if you want the SVG to be updated only after the user picks a date range
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];
    this.getReservedDeskIds(startDate, endDate);

    for (let i = 0; i < this.desks.length; i++) {
      // Attach the click event listener to each desk
      this.desks[i].addEventListener('click', () => {
        this.handleDeskClick(this.desks[i]);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.svgUrl) {
      // SVG fájl URL-je megváltozott, frissítjük a megjelenítést
      // Az új URL-t az this.svgUrl tulajdonságban találjuk
    }
  }


  setReservation(e: HTMLElement) {
    this.hoveredElement = e;
    this.getStatus = this.hoveredElement!.getAttribute("isFree");

    if (!this.IsOneDeskSelected) {
      if (this.getStatus == 'true') {
        this.hoveredElement!.style.fill = 'rgb(204,0,0)';
        this.hoveredElement!.setAttribute("isFree", "false");
        this.IsOneDeskSelected = true;
        this.whichOneIsSelected = this.hoveredElement.id;
        this.selectedDeskElement = e;
        this.updateHoverEffect(e);
      }
    } else if (this.hoveredElement.id == this.whichOneIsSelected) {

      //if the user clicks on the same desk as selected before just dont do anything because it means the user free up the desk

    } else {

      console.log("You already selected one desk. Click on it again to free up the Desk")
    }

    if (this.getStatus == 'false') {
      this.hoveredElement!.style.fill = 'rgb(0,204,0)';
      this.hoveredElement!.setAttribute("isFree", "true");
      this.IsOneDeskSelected = false;
      this.canMoveChair = true;
      this.selectedDeskElement = null;
      this.updateHoverEffect(null);
    }
  }

  getReservedDeskIds(startDate: string, endDate: string): Promise<void> {
    return new Promise((resolve) => {
      const previouslySelectedDeskIsFree = !this.selectedDeskElement || this.selectedDeskElement.getAttribute('isFree') === 'true';
      this.reservedDeskIdsAsNumbers = [];
      this.reservationService.getDeskIdsByDate(startDate, endDate)
        .subscribe(
          data => {
            this.reservedDeskIdsAsNumbers = data;
            if (!previouslySelectedDeskIsFree && this.selectedDeskElement) {
              const deskId = this.selectedDeskElement.getAttribute('id');
              const isDeskReserved = this.isDeskReserved(this.selectedDeskElement);
    
              if (isDeskReserved) {
                alert(`Desk ${deskId} is no longer available for the selected date range.`);
                this.resetDeskSelection();
              }
            }
            this.resetDeskSelection();
            this.updateReservedDeskOnSvg();
            resolve();
          }
        );
    });
  }

  resetDeskSelection() {
    this.selectedDeskElement = null;
    this.IsOneDeskSelected = false;
    this.whichOneIsSelected = '';
    this.deskClick.emit('');
    this.currentlySelected = '';
    this.IsOneDeskIdEmitted = false;
    this.resetDesks();
  }

  updateReservedDeskOnSvg() {
    // Reset all desks to their default (free) state
    this.resetDesks();


    for (let i = 0; i < this.desks.length; i++) {
      const deskElement = this.desks[i] as HTMLElement;
      const chairElement = this.getRelatedChairElement(deskElement);
      const isDeskReserved = this.isDeskReserved(deskElement);

      if (isDeskReserved !== (deskElement.getAttribute('data-is-reserved') === 'true')) {
        deskElement.setAttribute('data-is-reserved', isDeskReserved.toString());

        if (isDeskReserved) {
          // Move the chair to the reserved desk
          deskElement.style.fill = 'rgb(204,0,0)';
          deskElement.setAttributeNS(null, "pointer-events", "none");
          deskElement.setAttributeNS(null, "stroke", "rgba(53,42,42)");


          if (deskElement.nextElementSibling !== null) {
            const deskNumberDiv = deskElement.nextElementSibling?.querySelector('.deskNumber');

            if (deskNumberDiv !== null) {
              const deskNumberElement = deskNumberDiv as HTMLElement;

              deskNumberElement.style.color = "rgba(53,42,42)";
              deskNumberElement.style.fontWeight = 'bold';

              const reservedTextDiv = deskElement.nextElementSibling?.querySelector('.reservedText');

              if (reservedTextDiv !== null) {
                const reservedTextElement = reservedTextDiv as HTMLElement;

                // Show the reservedText element
                reservedTextElement.style.display = 'block';
              }
            }
          }

          this.moveChair(chairElement, deskElement, true);

        } else {
          // Move the chair back to its original position
          if (this.selectedDeskElement && this.selectedDeskElement.id === deskElement.id) {
            // If the desk is the one that the user has selected, update the desk status and move the chair
            const isFree = deskElement.getAttribute('isFree') === 'true';
            this.updateDeskStatus(deskElement, isFree);
            this.moveChair(chairElement, deskElement, !isFree);
          } else {
            // If the desk is not the one that the user has selected, just move the chair back to its original position
            this.moveChair(chairElement, deskElement, false);
          }

          // Reset desk to default (free) state
          this.resetDesks();
        }
      }
    }
  }


  handleDeskClick(deskElement: HTMLElement) {
    if (this.isAnimating) {
      return;
    }

    const chairElement = this.getRelatedChairElement(deskElement);

    if (deskElement.getAttribute("data-is-reserved") === "true") {
      // Desk is reserved, so ignore the click event
      return;
    }

    const isFree = deskElement.getAttribute("isFree") === "true";

    if (this.selectedDeskElement) {
      if (this.selectedDeskElement === deskElement) {
        // If the user clicks on the selected desk again, deselect it and move the chair back
        this.updateDeskStatus(deskElement, isFree);
        this.moveChair(chairElement, deskElement, !isFree);
      } else {
        // If the user clicks on a different desk, move the chair back to its original position
        const prevChairElement = this.getRelatedChairElement(this.selectedDeskElement);
        this.updateDeskStatus(this.selectedDeskElement, !isFree);
        this.moveChair(prevChairElement, this.selectedDeskElement, isFree);

        // Then, move the chair to the new desk and update its status
        this.updateDeskStatus(deskElement, isFree);
        this.moveChair(chairElement, deskElement, !isFree);
      }
    } else {
      // If the user clicks on a desk for the first time, update the desk status and move the chair
      this.updateDeskStatus(deskElement, isFree);
      this.moveChair(chairElement, deskElement, !isFree);
    }
  }


  isDeskReserved(deskElement: HTMLElement): boolean {
    const deskId = Number(deskElement.id);
    const isDeskReserved = this.reservedDeskIdsAsNumbers.includes(deskId);
    return isDeskReserved;
  }

  getRelatedChairElement(deskElement: HTMLElement): SVGGraphicsElement {
    // Assuming each desk has a data-chair-id attribute with the related chair's ID
    const chairId = deskElement.getAttribute('data-chair-id');

    if (!chairId) {
      throw new Error('Related chair ID not found');
    }

    const chairElement = document.getElementById(chairId);

    if (!chairElement || !(chairElement instanceof SVGGraphicsElement)) {
      throw new Error('Chair element not found or not an SVGGraphicsElement');
    }

    return chairElement;
  }

  resetDesks() {
    for (let i = 0; i < this.desks.length; i++) {

      const deskElement = this.desks[i] as HTMLElement;
      const chairElement = this.getRelatedChairElement(deskElement);

      const isDeskReserved = this.isDeskReserved(this.desks[i]);
      if (!isDeskReserved) {
        this.moveChair(chairElement, deskElement, false);

        deskElement.style.fill = 'rgb(0,204,0)'; 
        deskElement.setAttribute('isFree', 'true'); 
        deskElement.setAttribute('data-is-reserved', 'false');
        deskElement.setAttributeNS(null, "pointer-events", "all"); 
        deskElement.setAttributeNS(null, "stroke", "rgb(91, 91, 91)");

        // Check if nextElementSibling is not null
        if (this.desks[i].nextElementSibling !== null) {
          // Access the number div inside the SVG
          const deskNumberDiv = this.desks[i].nextElementSibling?.querySelector('.deskNumber');

          if (deskNumberDiv !== null) {
            // Cast the deskNumberDiv to HTMLElement type
            const deskNumberElement = deskNumberDiv as HTMLElement;

            // Apply default CSS changes to the number div
            deskNumberElement.className = 'deskNumber';
            ;

            // Access the reservedText div inside the SVG
            const reservedTextDiv = this.desks[i].nextElementSibling?.querySelector('.reservedText');

            if (reservedTextDiv !== null) {
              // Cast the reservedTextDiv to HTMLElement type
              const reservedTextElement = reservedTextDiv as HTMLElement;

              // Hide the reservedText element
              reservedTextElement.style.display = 'none';
            }
          }
        }
      }
    }
  }

  updateDeskStatus(deskElement: HTMLElement, isFree: boolean) {
    if (isFree) {
      deskElement.style.fill = 'rgb(0,204,0)';
      deskElement.setAttribute('isFree', 'true');
      this.selectedDeskElement = null;
    } else {
      deskElement.style.fill = 'rgb(204,0,0)';
      deskElement.setAttribute('isFree', 'false');
      this.selectedDeskElement = deskElement;
    }

    this.toggleOtherDesks(deskElement, !isFree);
  }

  toggleOtherDesks(selectedDeskElement: Element, shouldDisable: boolean) {
    const allDesks = document.querySelectorAll('.desk');

    allDesks.forEach((desk) => {
      if (desk === selectedDeskElement) {
        return;
      }

      const deskHTMLElement = desk as HTMLElement;

      if (shouldDisable) {
        deskHTMLElement.style.pointerEvents = 'none';
      } else {
        deskHTMLElement.style.pointerEvents = 'auto';
      }
    });
  }

  onDeskClick(id: string) {

    if (!this.IsOneDeskIdEmitted) {
      if (this.currentlySelected != id) {
        this.deskClick.emit(id);
        this.IsOneDeskIdEmitted = true;
        this.currentlySelected = id;

      }
    } else if (this.hoveredElement.id == this.whichOneIsSelected) {

      this.deskClick.emit('');
      this.currentlySelected = '';
      this.IsOneDeskIdEmitted = false;
    } else {

      console.log("You already choose a desk to reserve!")
    }

  }

  moveChair(chairElement: SVGGraphicsElement, deskElement: HTMLElement, isReserved: boolean): void {

    if (!this.canMoveChair && deskElement !== this.selectedDeskElement) {
      return;
    }
    // Set animation flag to true
    this.isAnimating = true;
    const chairRect = chairElement.getBoundingClientRect();
    const deskRect = deskElement.getBoundingClientRect();

    const deskRotation = parseInt(deskElement.getAttribute("data-rotation") || "0", 10);
    const chairRotation = parseInt(chairElement.getAttribute("data-rotation") || "0", 10);

    let distanceToMoveX = 0;
    let distanceToMoveY = 0;

    if (deskRotation === 90 || deskRotation === -90) {
      if (Math.abs(chairRect.left - deskRect.left) <= Math.abs(chairRect.left - deskRect.right)) {
        distanceToMoveX = deskRect.left - chairRect.right + 30;
      } else {
        distanceToMoveX = deskRect.right - chairRect.left - 30;
      }
    } else {
      if (chairRotation === 180) {
        if (Math.abs(chairRect.top - deskRect.top) <= Math.abs(chairRect.top - deskRect.bottom)) {
          distanceToMoveY = deskRect.top - chairRect.bottom + 30;
        } else {
          distanceToMoveY = deskRect.bottom - chairRect.top - 30;
        }
      } else {
        if (Math.abs(chairRect.top - deskRect.top) <= Math.abs(chairRect.top - deskRect.bottom)) {
          distanceToMoveY = deskRect.top - chairRect.bottom + 30;
        } else {
          distanceToMoveY = deskRect.bottom - chairRect.top + 30;
        }
      }
    }

    const clickedDeskElement = deskElement;

    const currentTranslation = chairElement.style.transform || 'translate(0px, 0px)';
    if (isReserved && currentTranslation === 'translate(0px, 0px)') {
      if (isReserved) {
        console.log("Forward move");
        chairElement.style.transform = `translate(${distanceToMoveX}px, ${distanceToMoveY}px)`;
      }
    } else if (!isReserved && currentTranslation !== 'translate(0px, 0px)') {
      if (!isReserved) {

        console.log("Backward move");
        chairElement.style.transform = 'translate(0px, 0px)';
      }
    }

    clickedDeskElement.classList.add('disabled');

    setTimeout(() => {
      this.isAnimating = false,
        clickedDeskElement.classList.remove('disabled');
    }, 500);
  }

  updateHoverEffect(selectedDesk: HTMLElement | null): void {
    const allDesks = document.querySelectorAll(".deskRect, .deskRectRotated");

    allDesks.forEach((desk: Element) => {
      if (selectedDesk === null) {
        desk.classList.remove('disabled');
      } else if (desk.id !== selectedDesk.id) {
        desk.classList.add('disabled');
      } else {
        desk.classList.remove('disabled');
      }
    });
  }

}
