import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from './contact.service';
import { Subscription, Observable } from 'rxjs';
import { Contact } from './models/contact.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  contacts: Contact[];
  contact: Contact;
  contactForm: FormGroup;
  totalNumberOfContacts: number;
  pages: number[] = [];
  pageSize = 10;
  searchInput: string;
  currentPage = 1;
  showModal = false;

  constructor(private contactService: ContactService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.subscription = new Subscription();

    this.getContacts(1);

    this.contactForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: [null],
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getContacts(pageNumber: number) {
    this.subscription.add(
      this.contactService.get(pageNumber, this.pageSize, this.searchInput || '').subscribe(
        (res: any) => {
          this.contacts = res.data;
          this.totalNumberOfContacts = res.total;

          let numberOfPages = Math.ceil(this.totalNumberOfContacts / this.pageSize);
          this.pages = [];
          for (let i = 0; i < numberOfPages; i++) {
            this.pages.push(i + 1);
          }

          this.currentPage = pageNumber;
        },
        err => console.log(err)
      ));
  }

  add(){
    this.showModal = !this.showModal;

    this.contactForm.patchValue({ id: undefined });
    this.contactForm.patchValue({ name: '' });
    this.contactForm.patchValue({ phone: '' });
    this.contactForm.patchValue({ email: '' });
    this.contactForm.patchValue({ gender: null });
  }

  edit(contact: Contact) {
    this.showModal = !this.showModal;

    this.contactForm.patchValue({ id: contact.id });
    this.contactForm.patchValue({ name: contact.name });
    this.contactForm.patchValue({ phone: contact.phone });
    this.contactForm.patchValue({ email: contact.email });
    this.contactForm.patchValue({ gender: contact.gender });
  }

  delete(id) {
    this.contactService.delete(id).subscribe(
      res => this.getContacts(this.currentPage),
      err => alert('error!')
    );
  }

  isAtivePage(page): boolean {
    return page === this.currentPage ? true : false;
  }

  next() {
    if (this.currentPage + 1 <= this.pages.length)
      this.currentPage++;
    this.getContacts(this.currentPage);
  }

  prev() {
    if (this.currentPage - 1 >= 1)
      this.currentPage--;
    this.getContacts(this.currentPage);
  }
}