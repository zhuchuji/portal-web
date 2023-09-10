import { ReactNode } from 'react';

interface Context {
  getRenderedContent(): ReactNode;
  prevStep(): void;
  nextStep(): void;
}

export class GeneratorContext implements Context {
  private state: State;

  constructor() {
    this.state = new EditState();
  }

  prevStep() {
    this.state.prev();
  }

  nextStep() {

  }

  public getRenderedContent(): ReactNode {
    return <div />
  }
}

interface State {
  prev(): void;
  next(): void;
}

class EditState implements State {
  constructor() {

  }

  public prev() {
    
  }

  public next() {

  }
}

class PreviewState implements State {
  public getRenderedContent() {

  }
  public prev() {

  }

  public next() {

  }
}

class GenerateState implements State {
  public prev() {

  }

  public next() {

  }
}