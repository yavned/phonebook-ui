import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Contact } from '../models/contact.class';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  subscription: Subscription;
  @Input() showModal: boolean;
  @Output() hideModal = new EventEmitter<boolean>();
  @Output() relodeContacts = new EventEmitter<boolean>();
  @Input() contactForm: FormGroup;

  constructor(private contactService: ContactService) {
  }

  ngOnInit() {
    this.subscription = new Subscription();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeModal() {
    this.hideModal.emit(true);
  }

  onSubmit(contact: Contact) {
    //create new contact
    if (!contact.id) {
      this.subscription.add(
        this.contactService.post(contact).subscribe(
          res => {
            this.relodeContacts.emit(true);
            this.closeModal();
          },
          err => console.error(err)
        ));
    }
    //update contact
    else {
      this.subscription.add(
        this.contactService.patch(contact).subscribe(
          res => {
            this.relodeContacts.emit(true);
            this.closeModal();
          },
          err => console.error(err)
        )); 
    }
  }
}
