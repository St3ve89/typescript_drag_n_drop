import { Component } from './base-component.js';
import { Validatable, validate } from '../util/validation.js';
import { autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';

// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  pplInputEl: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputEl = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.pplInputEl = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPpl = this.pplInputEl.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    };

    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    };

    const pplValidatable: Validatable = {
      value: +enteredPpl,
      required: true,
      min: 1,
      max: 5
    };

    if (
      !validate(titleValidatable) ||
      !validate(descValidatable) ||
      !validate(pplValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPpl];
    }
  }

  @autobind
  private submitHandler(ev: Event) {
    ev.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, ppl] = userInput;
      projectState.addProject(title, desc, ppl);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.pplInputEl.value = '';
  }
}
